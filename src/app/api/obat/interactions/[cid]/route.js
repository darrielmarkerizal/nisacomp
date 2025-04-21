import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { cid } = params;

  if (!cid) {
    return NextResponse.json(
      { error: "CID parameter is required" },
      { status: 400 }
    );
  }

  try {
    // Pertama, ambil data DrugBank ID jika tersedia (untuk mengakses interaksi)
    const pubchemUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug_view/data/compound/${cid}/JSON`;
    const response = await axios.get(pubchemUrl);

    const sections = response.data?.Record?.Section || [];

    // Cari identifiers section
    const identifiersSection = sections.find(
      (section) => section.TOCHeading?.toLowerCase() === "names and identifiers"
    );

    let drugbankId = null;
    let interactions = [];

    if (identifiersSection && identifiersSection.Section) {
      // Cari DrugBank ID
      const otherIdSection = identifiersSection.Section.find(
        (section) => section.TOCHeading?.toLowerCase() === "other identifiers"
      );

      if (otherIdSection && otherIdSection.Section) {
        const drugbankSection = otherIdSection.Section.find(
          (section) => section.TOCHeading?.toLowerCase() === "drugbank"
        );

        if (
          drugbankSection &&
          drugbankSection.Information &&
          drugbankSection.Information[0]?.Value?.StringWithMarkup
        ) {
          drugbankId =
            drugbankSection.Information[0].Value.StringWithMarkup[0].String;
        }
      }
    }

    // Cari interaksi langsung di PubChem data
    const drugSection = sections.find(
      (section) =>
        section.TOCHeading?.toLowerCase() === "drug and medication information"
    );

    if (drugSection && drugSection.Section) {
      const interactionsSection = drugSection.Section.find((section) =>
        section.TOCHeading?.toLowerCase().includes("interaction")
      );

      if (interactionsSection && interactionsSection.Information) {
        interactions = interactionsSection.Information.map((info) => {
          let interactionText = null;

          if (info.Value?.StringWithMarkup?.[0]?.String) {
            interactionText = info.Value.StringWithMarkup[0].String;
          }

          return {
            title: info.Name || "Drug Interaction",
            description: interactionText,
            severity: determineSeverity(interactionText),
            source: info.Reference?.[0]?.SourceName || "PubChem",
          };
        }).filter((interaction) => interaction.description);
      }
    }

    // Periksa juga di bagian farmakologi jika ada
    const pharmacologySection = sections.find(
      (section) =>
        section.TOCHeading?.toLowerCase() === "pharmacology and biochemistry"
    );

    if (pharmacologySection && pharmacologySection.Section) {
      const drugInteractionSection = pharmacologySection.Section.find(
        (section) =>
          section.TOCHeading?.toLowerCase().includes("drug interaction")
      );

      if (drugInteractionSection && drugInteractionSection.Information) {
        const pharmaInteractions = drugInteractionSection.Information.map(
          (info) => {
            let interactionText = null;

            if (info.Value?.StringWithMarkup?.[0]?.String) {
              interactionText = info.Value.StringWithMarkup[0].String;
            }

            return {
              title: info.Name || "Pharmacological Interaction",
              description: interactionText,
              severity: determineSeverity(interactionText),
              source: info.Reference?.[0]?.SourceName || "PubChem",
            };
          }
        ).filter((interaction) => interaction.description);

        interactions = [...interactions, ...pharmaInteractions];
      }
    }

    return NextResponse.json({
      cid,
      drugbankId,
      interactions,
      interactionCount: interactions.length,
      hasInteractions: interactions.length > 0,
    });
  } catch (error) {
    console.error("Error fetching drug interactions:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch drug interactions",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// Helper untuk menentukan tingkat keparahan interaksi
function determineSeverity(text) {
  if (!text) return "unknown";

  const lowerText = text.toLowerCase();

  if (
    lowerText.includes("contraindicated") ||
    lowerText.includes("severe") ||
    lowerText.includes("fatal") ||
    lowerText.includes("avoid")
  ) {
    return "high";
  }

  if (
    lowerText.includes("caution") ||
    lowerText.includes("moderate") ||
    lowerText.includes("may increase") ||
    lowerText.includes("may decrease")
  ) {
    return "moderate";
  }

  if (lowerText.includes("minor") || lowerText.includes("mild")) {
    return "low";
  }

  return "unknown";
}
