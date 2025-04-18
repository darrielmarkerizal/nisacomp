import axios from "axios";
import { NextResponse } from "next/server";

const PUBCHEM_PUG_VIEW_BASE_URL =
  "https://pubchem.ncbi.nlm.nih.gov/rest/pug_view";

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

    const response = await axios.get(
      `${PUBCHEM_PUG_VIEW_BASE_URL}/data/compound/${cidNum}/JSON/`
    );

    const rawData = response.data;

    // Format data menjadi struktur yang lebih mudah digunakan
    const formattedData = {
      cid: cidNum,
      name: rawData.Record?.RecordTitle || `Compound ${cidNum}`,
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
      }));
    }

    // Ekstrak data dari setiap section
    if (rawData.Record?.Section) {
      rawData.Record.Section.forEach((section) => {
        // Gunakan TOCHeading sebagai nama section (1. Structures, 2. Names and Identifiers, dll)
        const heading = section.TOCHeading;
        if (!heading) return;

        const sectionData = {
          description: section.Description || "",
          data: {},
          subsections: [],
        };

        // Tambahkan information langsung di section ini
        if (section.Information) {
          section.Information.forEach((info) => {
            if (info.Value) {
              if (info.Value.StringWithMarkup) {
                sectionData.data[info.Name || "Info"] =
                  info.Value.StringWithMarkup.map((item) => item.String).join(
                    ", "
                  );
              } else if (info.Value.String) {
                sectionData.data[info.Name || "Info"] = info.Value.String;
              } else if (info.Value.Number) {
                sectionData.data[info.Name || "Info"] =
                  info.Value.Number.toString();
              } else if (info.Value.StringValueList) {
                sectionData.data[info.Name || "Info"] =
                  info.Value.StringValueList;
              }
            }
          });
        }

        // Process subsections
        if (section.Section) {
          section.Section.forEach((subsection) => {
            const subsectionData = {
              name: subsection.TOCHeading || "Unknown",
              description: subsection.Description || "",
              data: {},
            };

            if (subsection.Information) {
              subsection.Information.forEach((info) => {
                if (info.Value) {
                  if (info.Value.StringWithMarkup) {
                    subsectionData.data[info.Name || "Info"] =
                      info.Value.StringWithMarkup.map(
                        (item) => item.String
                      ).join(", ");
                  } else if (info.Value.String) {
                    subsectionData.data[info.Name || "Info"] =
                      info.Value.String;
                  } else if (info.Value.Number) {
                    subsectionData.data[info.Name || "Info"] =
                      info.Value.Number.toString();
                  } else if (info.Value.StringValueList) {
                    subsectionData.data[info.Name || "Info"] =
                      info.Value.StringValueList;
                  } else if (info.Value.Unit) {
                    subsectionData.data[info.Name || "Info"] =
                      `${info.Value.Number || ""} ${info.Value.Unit || ""}`;
                  }
                }
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
                  };

                  if (deepSubsection.Information) {
                    deepSubsection.Information.forEach((info) => {
                      if (info.Value) {
                        if (info.Value.StringWithMarkup) {
                          deepData.data[info.Name || "Info"] =
                            info.Value.StringWithMarkup.map(
                              (item) => item.String
                            ).join(", ");
                        } else if (info.Value.String) {
                          deepData.data[info.Name || "Info"] =
                            info.Value.String;
                        } else if (info.Value.Number) {
                          deepData.data[info.Name || "Info"] =
                            info.Value.Number.toString();
                        } else if (info.Value.StringValueList) {
                          deepData.data[info.Name || "Info"] =
                            info.Value.StringValueList;
                        }
                      }
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

    // Ekstrak data penting untuk kemudahan akses
    const essentialData = extractEssentialData(rawData, cidNum);
    formattedData.essential = essentialData;

    return NextResponse.json(formattedData);
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

// Helper function untuk mengekstrak data penting dari respon PubChem
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
