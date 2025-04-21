import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  // Awaiting params untuk memenuhi syarat Next.js 14
  const { cid } = await Promise.resolve(params);

  if (!cid) {
    return NextResponse.json(
      { error: "CID parameter is required" },
      { status: 400 }
    );
  }

  try {
    // Dapatkan data dari PubChem
    const pubchemUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug_view/data/compound/${cid}/JSON`;
    const response = await axios.get(pubchemUrl);

    const sections = response.data?.Record?.Section || [];

    // Ekstrak klasifikasi dan informasi regulasi
    const classificationData = {
      cid,
      drugClassifications: [],
      atcCodes: [],
      enzymes: [],
      pathways: [],
      diseases: [],
    };

    // Fungsi untuk menemukan section berdasarkan heading
    const findSection = (sections, heading) => {
      return sections.find((s) =>
        s.TOCHeading?.toLowerCase().includes(heading.toLowerCase())
      );
    };

    // Fungsi untuk ekstrak nilai dari information
    const extractInformation = (info) => {
      if (!info?.Value) return null;
      if (info.Value.StringWithMarkup)
        return info.Value.StringWithMarkup[0]?.String;
      if (info.Value.Number) return info.Value.Number[0];
      return null;
    };

    // Klasifikasi Obat
    const drugSection = findSection(sections, "Drug and Medication");
    if (drugSection && drugSection.Section) {
      const classSection = drugSection.Section.find((s) =>
        s.TOCHeading?.toLowerCase().includes("classification")
      );
      if (classSection && classSection.Information) {
        classSection.Information.forEach((info) => {
          const value = extractInformation(info);
          if (value) {
            classificationData.drugClassifications.push({
              name: info.Name || "Classification",
              value,
              source: info.Reference?.[0]?.SourceName || "PubChem",
            });
          }
        });
      }

      // ATC Codes
      const atcSection = findSection(drugSection.Section, "ATC Code");
      if (atcSection && atcSection.Information) {
        atcSection.Information.forEach((info) => {
          const value = extractInformation(info);
          if (value) {
            classificationData.atcCodes.push({
              code: value,
              description: info.Name || null,
            });
          }
        });
      }
    }

    // Interaksi Enzim (CYP450 dll)
    const biochemSection = findSection(
      sections,
      "Pharmacology and Biochemistry"
    );
    if (biochemSection && biochemSection.Section) {
      const enzymeSection = findSection(biochemSection.Section, "Enzymes");
      if (enzymeSection && enzymeSection.Information) {
        enzymeSection.Information.forEach((info) => {
          const value = extractInformation(info);
          if (value) {
            classificationData.enzymes.push({
              name: info.Name || "Enzyme",
              interaction: value,
              source: info.Reference?.[0]?.SourceName || "PubChem",
            });
          }
        });
      }

      // Pathways terkait
      const pathwaySection = findSection(biochemSection.Section, "Pathway");
      if (pathwaySection && pathwaySection.Information) {
        pathwaySection.Information.forEach((info) => {
          const value = extractInformation(info);
          if (value) {
            classificationData.pathways.push({
              name: info.Name || "Pathway",
              description: value,
              source: info.Reference?.[0]?.SourceName || "PubChem",
            });
          }
        });
      }
    }

    // Data penyakit terkait
    const disSection = findSection(
      sections,
      "Associated Disorders and Diseases"
    );
    if (disSection && disSection.Information) {
      disSection.Information.forEach((info) => {
        const value = extractInformation(info);
        if (value) {
          classificationData.diseases.push({
            name: info.Name || "Disease",
            description: value,
            source: info.Reference?.[0]?.SourceName || "PubChem",
          });
        }
      });
    }

    // Tambahkan flag untuk menunjukkan ketersediaan data
    classificationData.hasClassificationData =
      classificationData.drugClassifications.length > 0;
    classificationData.hasAtcCodes = classificationData.atcCodes.length > 0;
    classificationData.hasEnzymeData = classificationData.enzymes.length > 0;
    classificationData.hasPathwayData = classificationData.pathways.length > 0;
    classificationData.hasDiseaseData = classificationData.diseases.length > 0;

    return NextResponse.json(classificationData);
  } catch (error) {
    console.error("Error fetching classification data:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch classification data",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
