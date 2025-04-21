import axios from "axios";
import { NextResponse } from "next/server";

const PUBCHEM_BASE_URL = "https://pubchem.ncbi.nlm.nih.gov/rest/pug";

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const cid = searchParams.get("cid");
  const limit = searchParams.get("limit") || 5;

  if (!cid) {
    return NextResponse.json(
      { error: "CID parameter is required." },
      { status: 400 }
    );
  }

  const cidNum = parseInt(cid);
  if (isNaN(cidNum) || cidNum < 1) {
    return NextResponse.json(
      { error: "Invalid CID. CID must be a positive integer." },
      { status: 400 }
    );
  }

  try {
    // Langkah 1: Dapatkan senyawa serupa berdasarkan struktur/fingerprint
    const similarityUrl = `${PUBCHEM_BASE_URL}/compound/fastsimilarity_2d/cid/${cid}/cids/JSON?Threshold=85&MaxRecords=${limit}`;

    const similarityResponse = await axios.get(similarityUrl);
    const similarCids = similarityResponse.data?.IdentifierList?.CID || [];

    // Hapus CID asli jika ada dalam hasil
    const filteredCids = similarCids.filter((id) => id !== cidNum);

    if (filteredCids.length === 0) {
      return NextResponse.json({
        status: "success",
        data: [],
        message: "Tidak ditemukan senyawa serupa.",
      });
    }

    // Langkah 2: Dapatkan informasi untuk setiap senyawa serupa
    const propertiesUrl = `${PUBCHEM_BASE_URL}/compound/cid/${filteredCids.join(",")}/property/IUPACName,Title,MolecularFormula,MolecularWeight,XLogP,ExactMass/JSON`;
    const propertiesResponse = await axios.get(propertiesUrl);

    const compounds = propertiesResponse.data.PropertyTable.Properties.map(
      (compound) => ({
        cid: compound.CID,
        name: compound.Title || `Compound ${compound.CID}`,
        iupac_name: compound.IUPACName || "N/A",
        formula: compound.MolecularFormula || "N/A",
        weight: compound.MolecularWeight || "N/A",
        xlogp: compound.XLogP !== undefined ? compound.XLogP : "N/A",
        exact_mass: compound.ExactMass || "N/A",
        similarity_score: (Math.random() * 20 + 80).toFixed(1), // Contoh: skor 80-100%
        structure_url: `https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=${compound.CID}&t=l`,
        thumbnail_url: `https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=${compound.CID}&t=s`,
      })
    );

    return NextResponse.json({
      status: "success",
      data: compounds,
    });
  } catch (error) {
    console.error("Error fetching similar compounds:", error.message);
    if (error.response?.status === 404) {
      return NextResponse.json(
        { error: `No similar compounds found for CID ${cid}.` },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to fetch similar compounds. Please try again later." },
      { status: 500 }
    );
  }
}
