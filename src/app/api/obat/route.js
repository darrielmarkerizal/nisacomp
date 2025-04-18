import axios from "axios";
import { NextResponse } from "next/server";

const PUBCHEM_BASE_URL = "https://pubchem.ncbi.nlm.nih.gov/rest/pug";

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const page = searchParams.get("page") || 1;
  const perPage = searchParams.get("perPage") || 10;
  const sortBy = searchParams.get("sortBy") || "cid";
  const sortOrder = searchParams.get("sortOrder") || "asc";
  const search = searchParams.get("search")?.trim();

  if (!search) {
    return NextResponse.json(
      {
        error: "Search parameter is required and cannot be empty.",
      },
      { status: 400 }
    );
  }

  // Konversi ke tipe yang sesuai
  const pageNum = parseInt(page);
  const perPageNum = parseInt(perPage);

  // Validasi parameter
  if (pageNum < 1 || perPageNum < 1 || perPageNum > 100) {
    return NextResponse.json(
      {
        error:
          "Invalid parameters. Ensure page >= 1 and perPage between 1 and 100.",
      },
      { status: 400 }
    );
  }

  if (!["cid", "iupac_name", "title"].includes(sortBy)) {
    return NextResponse.json(
      {
        error: "Invalid sortBy parameter. Use cid, iupac_name, or title.",
      },
      { status: 400 }
    );
  }

  if (!["asc", "desc"].includes(sortOrder)) {
    return NextResponse.json(
      {
        error: "Invalid sortOrder parameter. Use asc or desc.",
      },
      { status: 400 }
    );
  }

  // Validasi search term
  if (!/^[a-zA-Z0-9\s\-_]+$/.test(search)) {
    return NextResponse.json(
      {
        error:
          "Invalid search term. Use alphanumeric characters, spaces, hyphens, or underscores.",
      },
      { status: 400 }
    );
  }

  // Log input parameters untuk debugging
  console.log("Request Parameters:", {
    page: pageNum,
    perPage: perPageNum,
    sortBy,
    sortOrder,
    search,
  });

  try {
    let compounds = [];
    let totalItems = 0;

    // Gunakan endpoint /compound/name untuk pencarian berdasarkan nama
    const searchUrl = `${PUBCHEM_BASE_URL}/compound/name/${encodeURIComponent(
      search
    )}/cids/JSON`;
    console.log("Fetching CIDs from:", searchUrl);

    const searchResponse = await axios.get(searchUrl).catch((error) => {
      throw new Error(
        `Search request failed: ${error.message}, URL: ${searchUrl}`
      );
    });

    const cids = searchResponse.data.IdentifierList?.CID || [];

    if (cids.length === 0) {
      // Jika tidak ada hasil pencarian, kembalikan array kosong
      console.log("No compounds found for search term:", search);
      compounds = [];
      totalItems = 0;
    } else {
      // Ambil properti untuk CID yang ditemukan
      const propertiesUrl = `${PUBCHEM_BASE_URL}/compound/cid/${cids.join(
        ","
      )}/property/IUPACName,Title/JSON`;
      console.log("Fetching properties from:", propertiesUrl);

      const propertiesResponse = await axios
        .get(propertiesUrl)
        .catch((error) => {
          throw new Error(
            `Properties request failed: ${error.message}, URL: ${propertiesUrl}`
          );
        });

      compounds = propertiesResponse.data.PropertyTable.Properties.map(
        (compound) => ({
          cid: compound.CID,
          iupac_name: compound.IUPACName || "N/A",
          title: compound.Title || "N/A",
        })
      );
      totalItems = compounds.length;
    }

    // Sorting
    compounds.sort((a, b) => {
      if (sortBy === "cid") {
        return sortOrder === "asc" ? a.cid - b.cid : b.cid - a.cid;
      }

      const valueA =
        a[sortBy] === undefined || a[sortBy] === null || a[sortBy] === "N/A"
          ? ""
          : String(a[sortBy]).toLowerCase();
      const valueB =
        b[sortBy] === undefined || b[sortBy] === null || b[sortBy] === "N/A"
          ? ""
          : String(b[sortBy]).toLowerCase();

      return sortOrder === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    });

    // Pagination
    const totalPages = Math.ceil(totalItems / perPageNum);
    const currentPage = pageNum;
    const hasNextPage = totalItems > pageNum * perPageNum;
    const hasPrevPage = pageNum > 1;

    // Ambil item untuk halaman saat ini
    const startIndex = (pageNum - 1) * perPageNum;
    const paginatedCompounds = compounds.slice(
      startIndex,
      startIndex + perPageNum
    );

    // Kirim respons
    return NextResponse.json({
      status: "success",
      data: paginatedCompounds,
      pagination: {
        totalItems,
        totalPages,
        currentPage,
        perPage: perPageNum,
        hasNextPage,
        hasPrevPage,
        nextPage: hasNextPage ? pageNum + 1 : null,
        prevPage: hasPrevPage ? pageNum - 1 : null,
      },
    });
  } catch (error) {
    console.error("Error fetching data from PubChem:", error.message);
    if (error.message.includes("400")) {
      return NextResponse.json(
        {
          error:
            "Invalid request to PubChem API. Check search term or parameters.",
          details: error.message,
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        error: "Failed to fetch data from PubChem. Please try again later.",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
