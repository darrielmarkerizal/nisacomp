import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { name } = params;

  try {
    let pubchemData = {};
    let synonyms = [];
    try {
      const pubchemRes = await axios.get(
        `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(name)}/property/MolecularFormula,MolecularWeight,CanonicalSMILES,InChI,InChIKey,IUPACName,XLogP,TPSA,HBondDonorCount,HBondAcceptorCount/JSON`
      );
      pubchemData = pubchemRes.data.PropertyTable?.Properties[0] || {};

      const synonymRes = await axios.get(
        `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(name)}/synonyms/JSON`
      );
      synonyms = synonymRes.data.InformationList?.Information[0]?.Synonym || [];
    } catch (pubchemError) {
      console.error("PubChem API error:", pubchemError.message);
    }

    let openfdaData = {};
    try {
      const openfdaRes = await axios.get(
        `https://api.fda.gov/drug/label.json?search=(openfda.generic_name:"${encodeURIComponent(name)}" OR openfda.brand_name:"${encodeURIComponent(name)}")&limit=1`
      );
      openfdaData = openfdaRes.data.results[0] || {};
    } catch (openfdaError) {
      console.error("OpenFDA API error:", openfdaError.message);
    }

    return NextResponse.json({
      name,
      chemicalData: {
        molecularFormula: pubchemData.MolecularFormula || "N/A",
        molecularWeight: pubchemData.MolecularWeight || "N/A",
        smiles: pubchemData.CanonicalSMILES || "N/A",
        inchi: pubchemData.InChI || "N/A",
        inchiKey: pubchemData.InChIKey || "N/A",
        iupacName: pubchemData.IUPACName || "N/A",
        xLogP: pubchemData.XLogP || "N/A",
        tpsa: pubchemData.TPSA || "N/A",
        hBondDonors: pubchemData.HBondDonorCount || "N/A",
        hBondAcceptors: pubchemData.HBondAcceptorCount || "N/A",
        cid: pubchemData.CID || null,
        synonyms: synonyms.length > 0 ? synonyms : ["N/A"],
        structureUrl: pubchemData.CID
          ? `https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=${pubchemData.CID}&t=l`
          : null,
      },
      clinicalData: {
        brandName: openfdaData.openfda?.brand_name?.[0] || "N/A",
        genericName: openfdaData.openfda?.generic_name?.[0] || "N/A",
        manufacturer: openfdaData.openfda?.manufacturer_name?.[0] || "N/A",
        productType: openfdaData.openfda?.product_type?.[0] || "N/A",
        route: openfdaData.openfda?.route?.[0] || "N/A",
        indications: openfdaData.indications_and_usage?.[0] || "N/A",
        dosage: openfdaData.dosage_and_administration?.[0] || "N/A",
        sideEffects:
          openfdaData.adverse_reactions?.[0] ||
          openfdaData.warnings?.[0] ||
          "N/A",
        contraindications: openfdaData.contraindications?.[0] || "N/A",
        warnings:
          openfdaData.warnings_and_precautions?.[0] ||
          openfdaData.boxed_warning?.[0] ||
          "N/A",
        pregnancy: openfdaData.pregnancy?.[0] || "N/A",
        drugInteractions: openfdaData.drug_interactions?.[0] || "N/A",
        mechanismOfAction: openfdaData.mechanism_of_action?.[0] || "N/A",
        pharmacodynamics: openfdaData.pharmacodynamics?.[0] || "N/A",
        pharmacokinetics: openfdaData.pharmacokinetics?.[0] || "N/A",
        pediatricUse: openfdaData.pediatric_use?.[0] || "N/A",
        geriatricUse: openfdaData.geriatric_use?.[0] || "N/A",
        nursingMothers: openfdaData.nursing_mothers?.[0] || "N/A",
        teratogenicEffects: openfdaData.teratogenic_effects?.[0] || "N/A",
        patientInformation:
          openfdaData.patient_medication_information?.[0] || "N/A",
        medicationGuide: openfdaData.spl_medguide?.[0] || "N/A",
        instructionsForUse: openfdaData.instructions_for_use?.[0] || "N/A",
        storage: openfdaData.storage_and_handling?.[0] || "N/A",
        howSupplied: openfdaData.how_supplied?.[0] || "N/A",
        pharmClass: openfdaData.openfda?.pharm_class_epc?.[0] || "N/A",
        applicationNumber:
          openfdaData.openfda?.application_number?.[0] || "N/A",
      },
      sources: {
        pubchem: pubchemData.CID
          ? `https://pubchem.ncbi.nlm.nih.gov/compound/${pubchemData.CID}`
          : null,
        openfda: openfdaData.id
          ? `https://api.fda.gov/drug/label/${openfdaData.id}.json`
          : null,
      },
    });
  } catch (error) {
    console.error("General error in drug API:", error);
    return NextResponse.json(
      { error: "Error fetching drug data", message: error.message },
      { status: 500 }
    );
  }
}
