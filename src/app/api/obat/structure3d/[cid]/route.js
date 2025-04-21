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
    // Cek ketersediaan struktur 3D di PubChem
    const conformersUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/conformers/JSON`;
    const response = await axios.get(conformersUrl);

    const conformers = response.data?.InformationList?.Information || [];

    if (conformers.length === 0) {
      return NextResponse.json({
        cid,
        has3dStructure: false,
        message: "Tidak ada struktur 3D yang tersedia",
      });
    }

    // Format data 3D
    const structure3dData = {
      cid,
      has3dStructure: true,
      conformerCount: conformers.length,
      dataFormats: {
        sdf: `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/record/SDF/?record_type=3d`,
        json: `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/record/JSON/?record_type=3d`,
        mol: `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/record/MOL/?record_type=3d`,
      },
      pdb: `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/record/PDB/?record_type=3d`,
      viewerUrl: `https://pubchem.ncbi.nlm.nih.gov/compound/${cid}#section=3D-Conformer`,
    };

    // Tambahkan informasi tentang jenis conformer jika ada
    if (conformers[0]?.ConformerID) {
      structure3dData.conformer = {
        id: conformers[0].ConformerID,
        type: conformers[0].Type || null,
        dimension: conformers[0].Dimension || "3D",
      };
    }

    return NextResponse.json(structure3dData);
  } catch (error) {
    console.error("Error fetching 3D structure data:", error);

    // Jika 404, berarti tidak ada struktur 3D tersedia
    if (error.response?.status === 404) {
      return NextResponse.json({
        cid,
        has3dStructure: false,
        message: "Tidak ada struktur 3D yang tersedia untuk senyawa ini",
      });
    }

    return NextResponse.json(
      {
        error: "Failed to fetch 3D structure data",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
