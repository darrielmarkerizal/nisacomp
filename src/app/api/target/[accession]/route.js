import { NextResponse } from "next/server";
import axios from "axios";

// Add force dynamic to ensure API route is not cached
export const dynamic = "force-dynamic";

export async function GET(request, context) {
  // Ekstrak params dengan benar
  const { params } = context;
  const accession = params.accession;

  console.log(
    `Fetching data for accession: ${accession} directly from UniProt`
  );

  try {
    // Panggil API UniProt secara langsung
    const uniprotResponse = await axios.get(
      `https://rest.uniprot.org/uniprotkb/search`,
      {
        params: {
          query: accession,
          format: "json",
          size: 1, // Batasi hasil ke 1 entri untuk kinerja lebih baik
        },
        timeout: 15000,
      }
    );

    // Cek apakah ada hasil yang ditemukan
    if (
      uniprotResponse.data.results &&
      uniprotResponse.data.results.length > 0
    ) {
      console.log(
        `Found ${uniprotResponse.data.results.length} UniProt entries for ${accession}`
      );

      // Return data mentah dari UniProt
      return NextResponse.json({
        source: "UniProt",
        query: accession,
        data: uniprotResponse.data,
      });
    } else {
      console.log(`No UniProt entries found for ${accession}`);

      // Jika tidak ada hasil, coba query alternatif
      console.log("Trying alternative query with RefSeq...");
      const alternativeResponse = await axios.get(
        `https://rest.uniprot.org/uniprotkb/search`,
        {
          params: {
            query: `database:(RefSeq) AND xref_refseq:${accession}`,
            format: "json",
            size: 1,
          },
          timeout: 15000,
        }
      );

      if (
        alternativeResponse.data.results &&
        alternativeResponse.data.results.length > 0
      ) {
        console.log(
          `Found ${alternativeResponse.data.results.length} UniProt entries with alternative query`
        );

        return NextResponse.json({
          source: "UniProt",
          query: `database:(RefSeq) AND xref_refseq:${accession}`,
          data: alternativeResponse.data,
        });
      }

      // Jika kedua query tidak menghasilkan data
      return NextResponse.json(
        {
          message: "No UniProt entries found for the given accession",
          query: accession,
        },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error(`Error fetching data from UniProt: ${error.message}`);

    return NextResponse.json(
      {
        message: "Failed to fetch data from UniProt API",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
