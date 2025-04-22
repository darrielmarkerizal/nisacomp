import axios from "axios";
import { NextResponse } from "next/server";

// Memory cache sederhana
if (!global.__literatureCache) {
  global.__literatureCache = new Map();
}

export async function GET(request, { params }) {
  // Awaiting params untuk memenuhi syarat Next.js 14
  const { cid } = await Promise.resolve(params);

  // Pastikan CID adalah angka valid - pindah ke awal fungsi
  const cidNum = parseInt(cid);
  if (isNaN(cidNum) || cidNum <= 0) {
    return NextResponse.json(
      { error: "CID harus berupa angka positif" },
      { status: 400 }
    );
  }

  // Ekstrak query parameters
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const perPage = parseInt(url.searchParams.get("perPage") || "10");
  const download = url.searchParams.get("download") === "true";

  // Parameter pencarian dan pengurutan
  const searchQuery = url.searchParams.get("query") || "";
  const sortBy = url.searchParams.get("sortBy") || "year";
  const sortOrder = url.searchParams.get("sortOrder") || "desc";

  // Caching key berbasis parameter - sekarang cidNum sudah tersedia
  const cacheKey = `${cidNum}-${searchQuery}-${sortBy}-${sortOrder}`;
  const cacheTime = 3600000; // 1 jam dalam ms
  const cachedData = global.__literatureCache.get(cacheKey);

  // Gunakan cache jika tersedia dan masih segar
  if (cachedData && Date.now() - cachedData.timestamp < cacheTime) {
    const { allPublications } = cachedData;
    // Hanya lakukan pagination dan filtering dari cache
    const filtered = filterAndSortPublications(
      allPublications,
      searchQuery,
      sortBy,
      sortOrder
    );

    // Pagination dari data cache
    const pagination = paginateResults(filtered, page, perPage);

    return NextResponse.json({
      cid: cidNum,
      publicationCount: allPublications.length,
      filteredCount: filtered.length,
      publications: pagination.items,
      hasLiterature: pagination.items.length > 0,
      pagination: pagination.meta,
      search: {
        query: searchQuery,
        totalResults: filtered.length,
        originalTotalResults: allPublications.length,
        sortBy,
        sortOrder,
      },
      fromCache: true,
    });
  }

  // Validasi parameter (tetap sama seperti sebelumnya)
  if (isNaN(page) || page < 1) {
    return NextResponse.json(
      { error: "Parameter page harus berupa angka positif" },
      { status: 400 }
    );
  }

  if (isNaN(perPage) || perPage < 1 || perPage > 100) {
    return NextResponse.json(
      { error: "Parameter perPage harus berupa angka antara 1-100" },
      { status: 400 }
    );
  }

  // Validasi pengurutan
  const validSortFields = ["year", "title", "journal", "authors"];
  if (!validSortFields.includes(sortBy)) {
    return NextResponse.json(
      {
        error:
          "Parameter sortBy tidak valid. Gunakan year, title, journal, atau authors",
      },
      { status: 400 }
    );
  }

  if (!["asc", "desc"].includes(sortOrder)) {
    return NextResponse.json(
      { error: "Parameter sortOrder tidak valid. Gunakan asc atau desc" },
      { status: 400 }
    );
  }

  try {
    // Optimasi 1: Implementasi concurrent fetching
    const pmids = await fetchPMIDs(cidNum);

    // Jika tidak ada PMIDs, kembalikan respons kosong yang cepat
    if (pmids.length === 0) {
      const emptyResponse = {
        cid: cidNum,
        publicationCount: 0,
        filteredCount: 0,
        publications: [],
        hasLiterature: false,
        pagination: {
          totalItems: 0,
          currentPage: 1,
          perPage,
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: false,
          nextPage: null,
          prevPage: null,
        },
        search: {
          query: searchQuery,
          totalResults: 0,
          originalTotalResults: 0,
          sortBy,
          sortOrder,
        },
      };

      return NextResponse.json(emptyResponse);
    }

    // PERUBAHAN: Selalu proses semua PMID tanpa batasan 150
    const pmidsToProcess = pmids;

    // Fetch publikasi
    let allPublications = await fetchPublications(pmidsToProcess);

    // Cache hasil untuk penggunaan nanti
    global.__literatureCache.set(cacheKey, {
      allPublications,
      timestamp: Date.now(),
    });

    // Filter dan sort publikasi
    const filteredPublications = filterAndSortPublications(
      allPublications,
      searchQuery,
      sortBy,
      sortOrder
    );

    // Pagination
    const { items: paginatedPublications, meta: paginationMeta } =
      paginateResults(filteredPublications, page, perPage);

    // Download handling - jika parameter download=true
    if (download) {
      // Persiapkan data untuk download (JSON atau CSV format)
      // Implementasi download jika diperlukan
    }

    // Search metadata
    const searchMeta = {
      query: searchQuery,
      totalResults: filteredPublications.length,
      originalTotalResults: allPublications.length,
      sortBy,
      sortOrder,
    };

    return NextResponse.json({
      cid: cidNum,
      publicationCount: pmids.length, // Total publikasi asli sebelum filtering
      filteredCount: filteredPublications.length, // Total publikasi setelah filtering
      publications: paginatedPublications,
      hasLiterature: paginatedPublications.length > 0,
      pagination: paginationMeta,
      search: searchMeta,
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

// Fungsi helper untuk mendapatkan PMIDs
async function fetchPMIDs(cidNum) {
  try {
    // Coba ambil dari PubChem view terlebih dahulu
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

    // Alternatif: Coba ekstrak dari xrefs jika tidak ada di bagian literature
    if (pmids.length === 0) {
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
    }

    return pmids;
  } catch (error) {
    console.error("Error fetching PMIDs:", error);
    return [];
  }
}

// Fungsi untuk mengambil data publikasi dari PubMed
async function fetchPublications(pmids) {
  if (pmids.length === 0) return [];

  const batchSize = 100; // Ukuran batch optimal untuk API PubMed
  let allPublications = [];

  try {
    // Process PMIDs in batches
    const batches = [];
    for (let i = 0; i < pmids.length; i += batchSize) {
      batches.push(pmids.slice(i, i + batchSize));
    }

    // Concurrent batch requests
    const batchResults = await Promise.all(
      batches.map(async (batch) => {
        const batchPmidsStr = batch.join(",");
        const pubmedUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${batchPmidsStr}&retmode=json`;

        try {
          const response = await axios.get(pubmedUrl);
          return response.data?.result || {};
        } catch (error) {
          console.error(`Error in batch fetch: ${error.message}`);
          return {};
        }
      })
    );

    // Process results from all batches
    pmids.forEach((pmid) => {
      // Find this PMID in any of the batch results
      const pubData = batchResults.reduce((found, result) => {
        return found || result[pmid];
      }, null);

      if (pubData) {
        allPublications.push({
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
          abstract: pubData.abstract || "",
          keywords: pubData.keywords || [],
          pubdate: pubData.pubdate || "",
        });
      }
    });

    return allPublications;
  } catch (error) {
    console.error("Error fetching publications:", error);
    return [];
  }
}

// Fungsi untuk filter dan sort publikasi
function filterAndSortPublications(
  publications,
  searchQuery,
  sortBy,
  sortOrder
) {
  // Filter by search query if exists
  let filteredPubs = publications;
  if (searchQuery && searchQuery.trim() !== "") {
    const query = searchQuery.toLowerCase().trim();
    filteredPubs = publications.filter((pub) => {
      return (
        (pub.title && pub.title.toLowerCase().includes(query)) ||
        (pub.authors && pub.authors.toLowerCase().includes(query)) ||
        (pub.journal && pub.journal.toLowerCase().includes(query)) ||
        (pub.abstract && pub.abstract.toLowerCase().includes(query)) ||
        (pub.keywords &&
          pub.keywords.some((k) => k.toLowerCase().includes(query)))
      );
    });
  }

  // Sort publications
  filteredPubs.sort((a, b) => {
    let valueA, valueB;

    // Determine field to sort by
    switch (sortBy) {
      case "year":
        valueA = parseInt(a.year) || 0;
        valueB = parseInt(b.year) || 0;
        break;
      case "title":
        valueA = a.title || "";
        valueB = b.title || "";
        break;
      case "journal":
        valueA = a.journal || "";
        valueB = b.journal || "";
        break;
      case "authors":
        valueA = a.authors || "";
        valueB = b.authors || "";
        break;
      default:
        valueA = parseInt(a.year) || 0;
        valueB = parseInt(b.year) || 0;
    }

    // Determine sort order
    if (sortOrder === "asc") {
      if (typeof valueA === "string") {
        return valueA.localeCompare(valueB);
      }
      return valueA - valueB;
    } else {
      if (typeof valueA === "string") {
        return valueB.localeCompare(valueA);
      }
      return valueB - valueA;
    }
  });

  return filteredPubs;
}

// Fungsi untuk pagination
function paginateResults(items, page, perPage) {
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / perPage);
  const currentPage = Math.min(page, totalPages || 1);
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = Math.min(startIndex + perPage, totalItems);

  return {
    items: items.slice(startIndex, endIndex),
    meta: {
      totalItems,
      currentPage,
      perPage,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
      nextPage: currentPage < totalPages ? currentPage + 1 : null,
      prevPage: currentPage > 1 ? currentPage - 1 : null,
    },
  };
}
