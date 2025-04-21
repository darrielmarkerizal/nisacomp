import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  // Awaiting params untuk memenuhi syarat Next.js 14
  const { cid } = await Promise.resolve(params);

  // Validasi CID
  if (!cid) {
    return NextResponse.json(
      { error: "CID parameter is required" },
      { status: 400 }
    );
  }

  // Pastikan CID adalah angka valid
  const cidNum = parseInt(cid);
  if (isNaN(cidNum) || cidNum <= 0) {
    return NextResponse.json(
      { error: "CID harus berupa angka positif" },
      { status: 400 }
    );
  }

  try {
    // PERBAIKAN: Menggunakan endpoint PubChem view alih-alih xrefs langsung
    // Mendapatkan data PubChem untuk referensi literatur
    const pubchemUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug_view/data/compound/${cidNum}/JSON`;
    const response = await axios.get(pubchemUrl);

    const sections = response.data?.Record?.Section || [];

    // Cari bagian 'Literature' dalam data PubChem
    const literatureSection = sections.find((section) =>
      section.TOCHeading?.toLowerCase().includes("literature")
    );

    let pmids = [];
    // Ekstraksi PMID dari bagian literatur jika ada
    if (literatureSection && literatureSection.Information) {
      literatureSection.Information.forEach((info) => {
        // Cek ada referensi PubMed
        if (info.Reference && Array.isArray(info.Reference)) {
          info.Reference.forEach((ref) => {
            if (ref.SourceID && !pmids.includes(ref.SourceID)) {
              pmids.push(ref.SourceID);
            }
          });
        }
      });
    }

    // Alternatif: Coba ekstrak dari xrefs menggunakan tipe yang valid
    if (pmids.length === 0) {
      try {
        const xrefsResponse = await axios
          .get(
            `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cidNum}/xrefs/PubMedID/JSON`
          )
          .catch((error) => {
            if (error.response && error.response.status === 404) {
              return {
                data: { InformationList: { Information: [{ PubMedID: [] }] } },
              };
            }
            throw error;
          });

        const xrefPmids =
          xrefsResponse.data?.InformationList?.Information?.[0]?.PubMedID || [];
        pmids = [...new Set([...pmids, ...xrefPmids])];
      } catch (xrefError) {
        console.error("Error fetching PubMed xrefs:", xrefError);
        // Lanjutkan meski gagal mendapatkan xrefs
      }
    }

    let publications = [];
    if (pmids.length > 0) {
      // Ambil detail publikasi dari PubMed API (batas 10)
      const limitedPmids = pmids.slice(0, 10).join(",");

      try {
        const pubmedUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${limitedPmids}&retmode=json`;
        const pubmedResponse = await axios.get(pubmedUrl);
        const results = pubmedResponse.data?.result || {};

        // Proses setiap publikasi
        for (const pmid of pmids.slice(0, 10)) {
          const pubData = results[pmid];
          if (pubData) {
            publications.push({
              pmid: pmid,
              title: pubData.title || "Judul tidak tersedia",
              authors:
                pubData.authors?.map((a) => a.name).join(", ") ||
                "Penulis tidak tersedia",
              journal:
                pubData.fulljournalname ||
                pubData.source ||
                "Jurnal tidak tersedia",
              year: pubData.pubdate
                ? pubData.pubdate.substring(0, 4)
                : "Tahun tidak tersedia",
              url: `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`,
            });
          }
        }
      } catch (pubmedError) {
        console.error("Error fetching PubMed data:", pubmedError);
        // Tetap lanjutkan meski ada error saat mengambil data PubMed
      }
    }

    // Ambil informasi paten jika tersedia
    let patents = [];
    try {
      // PERBAIKAN: Gunakan endpoint yang benar untuk paten
      const patentsResponse = await axios
        .get(
          `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cidNum}/xrefs/PatentID/JSON`
        )
        .catch((error) => {
          if (
            error.response &&
            (error.response.status === 404 || error.response.status === 400)
          ) {
            return {
              data: { InformationList: { Information: [{ PatentID: [] }] } },
            };
          }
          throw error;
        });

      const patentIds =
        patentsResponse.data?.InformationList?.Information?.[0]?.PatentID || [];

      patents = patentIds.slice(0, 5).map((id) => ({
        id,
        url: `https://patents.google.com/patent/${id}`,
      }));
    } catch (patentError) {
      console.error("Error fetching patent data:", patentError);
      // Tetap lanjutkan meski ada error saat mengambil data paten
    }

    // Alternatif: Coba ekstrak paten dari data PubChem view jika xrefs gagal
    if (patents.length === 0) {
      const patentSection = sections.find((section) =>
        section.TOCHeading?.toLowerCase().includes("patent")
      );

      if (patentSection && patentSection.Information) {
        patentSection.Information.forEach((info) => {
          if (info.Value?.StringWithMarkup?.[0]?.String) {
            const patentId = info.Value.StringWithMarkup[0].String.trim();
            // Hanya tambahkan jika terlihat seperti ID paten
            if (patentId && /^[A-Z0-9]+$/.test(patentId)) {
              patents.push({
                id: patentId,
                url: `https://patents.google.com/patent/${patentId}`,
                description: info.Name || null,
              });
            }
          }
        });
      }
    }

    return NextResponse.json({
      cid: cidNum,
      publicationCount: pmids.length,
      publications,
      patentCount: patents.length,
      patents,
      hasLiterature: publications.length > 0 || patents.length > 0,
    });
  } catch (error) {
    console.error("Error fetching literature data:", error);

    // Berikan respons yang lebih deskriptif berdasarkan jenis error
    if (error.response) {
      return NextResponse.json(
        {
          error: `Failed to fetch literature data: ${error.response.status} ${error.response.statusText}`,
          details: error.response.data || error.message,
        },
        { status: error.response.status || 500 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to fetch literature data",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
