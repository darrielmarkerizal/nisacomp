import axios from "axios";
import { NextResponse } from "next/server";

const PUBCHEM_PUG_VIEW_BASE_URL =
  "https://pubchem.ncbi.nlm.nih.gov/rest/pug_view";
const OPENFDA_API_BASE_URL = "https://api.fda.gov/drug/label.json";

export async function GET(request, { params }) {
  try {
    const cid = params.cid;

    const cidNum = parseInt(cid);
    if (isNaN(cidNum) || cidNum < 1) {
      return NextResponse.json(
        { error: "Invalid CID. CID must be a positive integer." },
        { status: 400 }
      );
    }

    // Fetch PubChem data
    const pubchemResponse = await axios.get(
      `${PUBCHEM_PUG_VIEW_BASE_URL}/data/compound/${cidNum}/JSON/`
    );

    const rawData = pubchemResponse.data;

    // Extract substance name from PubChem data for OpenFDA query
    // First try to get the preferred name
    let substanceName = rawData.Record?.RecordTitle || "";

    // If preferred name not available, try to get IUPAC name
    if (!substanceName) {
      const sections = rawData.Record?.Section || [];
      const namesSection = sections.find(
        (section) =>
          section.TOCHeading?.toLowerCase() === "names and identifiers"
      );

      if (namesSection && namesSection.Section) {
        const iupacSection = namesSection.Section.find(
          (subsection) => subsection.TOCHeading?.toLowerCase() === "iupac name"
        );

        if (
          iupacSection &&
          iupacSection.Information &&
          iupacSection.Information[0]?.Value?.StringWithMarkup
        ) {
          substanceName =
            iupacSection.Information[0].Value.StringWithMarkup[0].String;
        }
      }
    }

    // If still no name found, just use CID number
    if (!substanceName) {
      substanceName = `CID${cidNum}`;
    }

    // Initialize OpenFDA data
    let openFdaData = null;

    // Only fetch OpenFDA data if we have a substance name to query with
    if (substanceName && substanceName !== `CID${cidNum}`) {
      try {
        // Try to fetch OpenFDA data using substance name
        const openFdaResponse = await axios.get(
          `${OPENFDA_API_BASE_URL}?search=openfda.substance_name:"${encodeURIComponent(substanceName)}"&limit=5`
        );

        openFdaData = openFdaResponse.data;

        // If no results with substance_name, try generic_name
        if (!openFdaData.results || openFdaData.results.length === 0) {
          const openFdaGenericResponse = await axios.get(
            `${OPENFDA_API_BASE_URL}?search=openfda.generic_name:"${encodeURIComponent(substanceName)}"&limit=5`
          );
          openFdaData = openFdaGenericResponse.data;
        }

        // If still no results, try brand_name
        if (!openFdaData.results || openFdaData.results.length === 0) {
          // Try with synonym names if available
          const synonyms = findSectionInfoList(
            rawData.Record?.Section || [],
            "Names and Identifiers",
            "Synonyms",
            "Depositor-Supplied Synonyms"
          );

          // Use up to 3 synonyms for searching
          if (synonyms && synonyms.length > 0) {
            for (let i = 0; i < Math.min(3, synonyms.length); i++) {
              try {
                const openFdaSynonymResponse = await axios.get(
                  `${OPENFDA_API_BASE_URL}?search=openfda.brand_name:"${encodeURIComponent(synonyms[i])}"&limit=5`
                );

                if (
                  openFdaSynonymResponse.data.results &&
                  openFdaSynonymResponse.data.results.length > 0
                ) {
                  openFdaData = openFdaSynonymResponse.data;
                  break;
                }
              } catch (error) {
                // Continue to next synonym if error
                console.log(
                  `Error searching OpenFDA with synonym ${synonyms[i]}: ${error.message}`
                );
              }
            }
          }
        }
      } catch (error) {
        // Handle case where OpenFDA doesn't have data for this substance
        console.log(
          `OpenFDA error or no data for ${substanceName}: ${error.message}`
        );
        // Don't fail the whole request just because OpenFDA part failed
        openFdaData = { error: `No OpenFDA data found for ${substanceName}` };
      }
    }

    // Format OpenFDA data if available
    let formattedFdaData = null;
    if (openFdaData && openFdaData.results && openFdaData.results.length > 0) {
      formattedFdaData = formatOpenFdaData(openFdaData);
    }

    // Buat objek dengan data lengkap + data terformat untuk kemudahan akses
    const fullData = {
      // Data lengkap dari PubChem tanpa modifikasi
      raw: rawData,

      // Metadata utama
      cid: cidNum,
      name: rawData.Record?.RecordTitle || `Compound ${cidNum}`,

      // Data terformat untuk kemudahan akses
      formatted: formatData(rawData, cidNum),

      // Data penting yang sering digunakan (untuk akses cepat)
      essential: extractEssentialData(rawData, cidNum),

      // OpenFDA data if available
      fda: formattedFdaData,

      // Raw OpenFDA data for reference
      rawFda: openFdaData?.results || null,

      // Link ke PubChem
      pubchemUrl: `https://pubchem.ncbi.nlm.nih.gov/compound/${cidNum}`,

      // Timestamp kapan data diambil
      fetchedAt: new Date().toISOString(),
    };

    return NextResponse.json(fullData);
  } catch (error) {
    console.error("Error fetching data from PubChem PUG-View:", error.message);
    if (error.response?.status === 404) {
      return NextResponse.json(
        { error: `Compound with CID ${params.cid} not found.` },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to fetch data from PubChem. Please try again later." },
      { status: 500 }
    );
  }
}

// Format data untuk kemudahan akses tetapi tanpa menghilangkan detail
function formatData(rawData, cidNum) {
  const formattedData = {
    sections: {},
    sources: [],
  };

  // Ekstrak sumber referensi
  if (rawData.Record?.Reference) {
    formattedData.sources = rawData.Record.Reference.map((ref) => ({
      name: ref.SourceName || "Unknown",
      id: ref.SourceID || "",
      description: ref.Description || "",
      url: ref.URL || null,
      // Simpan data reference asli
      raw: ref,
    }));
  }

  // Ekstrak data dari setiap section dengan mempertahankan semua detailnya
  if (rawData.Record?.Section) {
    rawData.Record.Section.forEach((section) => {
      const heading = section.TOCHeading;
      if (!heading) return;

      const sectionData = {
        description: section.Description || "",
        data: {},
        subsections: [],
        // Simpan section asli
        raw: section,
      };

      // Proses Information di section
      if (section.Information) {
        section.Information.forEach((info) => {
          // Simpan nama dan nilai, tetapi juga simpan objek info original
          const key =
            info.Name || `Info_${Math.random().toString(36).substring(2, 9)}`;
          sectionData.data[key] = {
            // Ekstrak nilai dalam format yang mudah digunakan
            value: extractValue(info.Value),
            // Simpan info asli
            raw: info,
          };
        });
      }

      // Proses subsections
      if (section.Section) {
        section.Section.forEach((subsection) => {
          const subsectionData = {
            name: subsection.TOCHeading || "Unknown",
            description: subsection.Description || "",
            data: {},
            subsections: [],
            // Simpan subsection asli
            raw: subsection,
          };

          // Proses Information di subsection
          if (subsection.Information) {
            subsection.Information.forEach((info) => {
              const key =
                info.Name ||
                `Info_${Math.random().toString(36).substring(2, 9)}`;
              subsectionData.data[key] = {
                value: extractValue(info.Value),
                raw: info,
              };
            });
          }

          // Deep subsections (level 3)
          if (subsection.Section) {
            subsectionData.subsections = subsection.Section.map(
              (deepSubsection) => {
                const deepData = {
                  name: deepSubsection.TOCHeading || "Unknown",
                  description: deepSubsection.Description || "",
                  data: {},
                  // Simpan deep subsection asli
                  raw: deepSubsection,
                };

                // Proses Information di deep subsection
                if (deepSubsection.Information) {
                  deepSubsection.Information.forEach((info) => {
                    const key =
                      info.Name ||
                      `Info_${Math.random().toString(36).substring(2, 9)}`;
                    deepData.data[key] = {
                      value: extractValue(info.Value),
                      raw: info,
                    };
                  });
                }

                return deepData;
              }
            );
          }

          sectionData.subsections.push(subsectionData);
        });
      }

      formattedData.sections[heading] = sectionData;
    });
  }

  return formattedData;
}

// Format OpenFDA data for easier use
function formatOpenFdaData(openFdaData) {
  // Check if we have results
  if (!openFdaData.results || openFdaData.results.length === 0) {
    return null;
  }

  // Take the first result (most relevant)
  const result = openFdaData.results[0];
  const openfda = result.openfda || {};

  // Build the formatted data structure
  const formattedFda = {
    // Basic metadata
    meta: {
      disclaimer: openFdaData.meta?.disclaimer || "",
      terms: openFdaData.meta?.terms || "",
      license: openFdaData.meta?.license || "",
      lastUpdated: openFdaData.meta?.last_updated || "",
      totalResults: openFdaData.meta?.results?.total || 0,
    },

    // Drug identification
    identification: {
      brandName: getFirstItem(openfda.brand_name),
      genericName: getFirstItem(openfda.generic_name),
      substanceName: getFirstItem(openfda.substance_name),
      manufacturerName: getFirstItem(openfda.manufacturer_name),
      productType: getFirstItem(openfda.product_type),
      route: getFirstItem(openfda.route),
      rxcui: getFirstItem(openfda.rxcui),
      ndc: openfda.product_ndc || [],
      unii: getFirstItem(openfda.unii),
      isOriginalPackager: openfda.is_original_packager
        ? openfda.is_original_packager[0]
        : false,
    },

    // Clinical information
    clinical: {
      // Only extract if available
      activeIngredient: getFirstItem(result.active_ingredient),
      purpose: getFirstItem(result.purpose),
      indicationsAndUsage: getFirstItem(result.indications_and_usage),
      warnings: getFirstItem(result.warnings),
      adverseReactions: getFirstItem(result.adverse_reactions),
      dosageAndAdministration: getFirstItem(result.dosage_and_administration),
      pregnancy: getFirstItem(result.pregnancy_or_breast_feeding),
    },

    // Pharmacological classification
    pharmacology: {
      mechanismOfAction: getFirstItem(openfda.pharm_class_moa),
      chemicalStructure: getFirstItem(openfda.pharm_class_cs),
      physiologicEffect: getFirstItem(openfda.pharm_class_epc),
    },

    // Safety information
    safety: {
      doNotUse: getFirstItem(result.do_not_use),
      askDoctor: getFirstItem(result.ask_doctor),
      askDoctorOrPharmacist: getFirstItem(result.ask_doctor_or_pharmacist),
      whenUsing: getFirstItem(result.when_using),
      stopUse: getFirstItem(result.stop_use),
      keepOutOfReachOfChildren: getFirstItem(
        result.keep_out_of_reach_of_children
      ),
    },

    // Other information
    other: {
      inactiveIngredients: getFirstItem(result.inactive_ingredient),
      storage: getFirstItem(result.storage_and_handling),
      questions: getFirstItem(result.questions),
    },
  };

  return formattedFda;
}

// Helper function to get first item from array or null if empty
function getFirstItem(arr) {
  if (!arr || arr.length === 0) return null;
  return arr[0];
}

// Helper function untuk mengekstrak nilai dari berbagai format Value
function extractValue(valueObj) {
  if (!valueObj) return null;

  if (valueObj.StringWithMarkup) {
    return {
      text: valueObj.StringWithMarkup.map((item) => item.String).join(", "),
      markup: valueObj.StringWithMarkup,
    };
  } else if (valueObj.String) {
    return valueObj.String;
  } else if (valueObj.Number !== undefined) {
    return valueObj.Number;
  } else if (valueObj.StringValueList) {
    return valueObj.StringValueList;
  } else if (valueObj.Unit) {
    return {
      value: valueObj.Number,
      unit: valueObj.Unit,
      formatted: `${valueObj.Number || ""} ${valueObj.Unit || ""}`,
    };
  } else if (valueObj.Binary) {
    return {
      type: "binary",
      length: valueObj.Binary.length,
      data: valueObj.Binary,
    };
  } else if (valueObj.URL) {
    return {
      type: "url",
      url: valueObj.URL,
    };
  }

  return valueObj; // return original object if none of the above
}

// Function for finding values in section info lists (from PubChem data)
function findSectionInfoList(
  sections,
  sectionName,
  subsectionName = null,
  infoName = null
) {
  const sectionNameLower = sectionName.toLowerCase();
  const section = sections.find(
    (s) => s.TOCHeading?.toLowerCase() === sectionNameLower
  );
  if (!section) return null;

  if (!subsectionName) {
    if (!section.Information) return null;
    if (infoName) {
      const info = section.Information.find((i) => i.Name === infoName);
      if (!info || !info.Value || !info.Value.StringValueList) return null;
      return info.Value.StringValueList || null;
    }
    return null;
  }

  const subsectionNameLower = subsectionName.toLowerCase();
  const subsection = section.Section?.find(
    (s) => s.TOCHeading?.toLowerCase() === subsectionNameLower
  );
  if (!subsection || !subsection.Information) return null;

  if (infoName) {
    const info = subsection.Information.find((i) => i.Name === infoName);
    if (!info || !info.Value || !info.Value.StringValueList) return null;
    return info.Value.StringValueList || null;
  }
  return null;
}

// Helper function untuk mengekstrak data penting dari respon PubChem (unchanged)
function extractEssentialData(data, cidNum) {
  const record = data.Record || {};
  const sections = record.Section || [];

  // Helper function untuk mencari nilai dari nama section dan subsection tertentu
  function findSectionValue(sectionName, subsectionName = null) {
    const sectionNameLower = sectionName.toLowerCase();
    const section = sections.find(
      (s) => s.TOCHeading?.toLowerCase() === sectionNameLower
    );
    if (!section) return null;

    if (!subsectionName) {
      if (
        !section.Information ||
        !section.Information[0] ||
        !section.Information[0].Value
      )
        return null;
      const info = section.Information[0];
      if (info.Value.StringWithMarkup)
        return info.Value.StringWithMarkup[0]?.String || null;
      return info.Value.String || info.Value.Number || null;
    }

    const subsectionNameLower = subsectionName.toLowerCase();
    const subsection = section.Section?.find(
      (s) => s.TOCHeading?.toLowerCase() === subsectionNameLower
    );
    if (
      !subsection ||
      !subsection.Information ||
      !subsection.Information[0] ||
      !subsection.Information[0].Value
    )
      return null;

    const info = subsection.Information[0];
    if (info.Value.StringWithMarkup)
      return info.Value.StringWithMarkup[0]?.String || null;
    return info.Value.String || info.Value.Number || null;
  }

  function findSectionInfoList(
    sectionName,
    subsectionName = null,
    infoName = null
  ) {
    const sectionNameLower = sectionName.toLowerCase();
    const section = sections.find(
      (s) => s.TOCHeading?.toLowerCase() === sectionNameLower
    );
    if (!section) return null;

    if (!subsectionName) {
      if (!section.Information) return null;
      if (infoName) {
        const info = section.Information.find((i) => i.Name === infoName);
        if (!info || !info.Value || !info.Value.StringValueList) return null;
        return info.Value.StringValueList || null;
      }
      return null;
    }

    const subsectionNameLower = subsectionName.toLowerCase();
    const subsection = section.Section?.find(
      (s) => s.TOCHeading?.toLowerCase() === subsectionNameLower
    );
    if (!subsection || !subsection.Information) return null;

    if (infoName) {
      const info = subsection.Information.find((i) => i.Name === infoName);
      if (!info || !info.Value || !info.Value.StringValueList) return null;
      return info.Value.StringValueList || null;
    }
    return null;
  }

  // Ekstrak data sinonim
  const synonyms =
    findSectionInfoList(
      "Names and Identifiers",
      "Synonyms",
      "Depositor-Supplied Synonyms"
    ) || [];

  // Buat object dengan data penting
  return {
    structureUrl: `https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=${cidNum}&t=l`,
    thumbnailUrl: `https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=${cidNum}&t=s`,
    molecularFormula:
      findSectionValue(
        "Chemical and Physical Properties",
        "Molecular Formula"
      ) || "N/A",
    molecularWeight:
      findSectionValue(
        "Chemical and Physical Properties",
        "Molecular Weight"
      ) || "N/A",
    inchiKey: findSectionValue("Names and Identifiers", "InChIKey") || "N/A",
    canonicalSmiles:
      findSectionValue(
        "Chemical and Physical Properties",
        "Canonical SMILES"
      ) || "N/A",
    iupacName: findSectionValue("Names and Identifiers", "IUPAC Name") || "N/A",
    synonyms: synonyms.length > 0 ? synonyms : ["N/A"],
    drugIndication:
      findSectionValue("Drug and Medication Information", "Drug Indication") ||
      "N/A",
    pharmacology:
      findSectionValue("Pharmacology and Biochemistry", "Pharmacology") ||
      "N/A",
    toxicity: findSectionValue("Toxicity", "Toxicity Summary") || "N/A",
    safetyHazards:
      findSectionValue("Safety and Hazards", "Safety and Hazard Properties") ||
      "N/A",
    useClassification:
      findSectionValue("Use and Manufacturing", "Use Classification") || "N/A",
    foodAdditive:
      findSectionValue(
        "Food Additives and Ingredients",
        "Food Additive Class"
      ) || "N/A",
  };
}
