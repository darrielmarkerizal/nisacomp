import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  // Mengambil parameter dari URL
  const { cid } = await Promise.resolve(params);
  const searchParams = new URL(request.url).searchParams;
  const aid = searchParams.get("aid");

  // Jika ada parameter aid, kita akan mengarahkan ke endpoint assay/aid
  if (aid) {
    return await getAssaySummary(aid);
  } else if (!cid) {
    return NextResponse.json(
      { error: "CID parameter is required" },
      { status: 400 }
    );
  } else {
    return await getBioactivityByCID(cid);
  }
}

// Fungsi untuk mengambil detail assay berdasarkan AID
async function getAssaySummary(aid) {
  // Pastikan AID adalah angka valid
  const aidNum = parseInt(aid);
  if (isNaN(aidNum) || aidNum <= 0) {
    return NextResponse.json(
      { error: "AID harus berupa angka positif" },
      { status: 400 }
    );
  }

  try {
    // Endpoint PubChem untuk detail assay
    const assayDetailUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/assay/aid/${aidNum}/summary/JSON`;

    console.log(`Fetching assay detail from ${assayDetailUrl}`);
    const response = await axios.get(assayDetailUrl);

    // Jika berhasil mendapatkan data
    if (response.data && response.data.AssaySummaries) {
      // Ekstrak dan format data assay untuk respons
      const assaySummary = response.data.AssaySummaries.AssaySummary[0];

      // Format respons untuk informasi assay
      const formattedResponse = {
        aid: aidNum.toString(),
        name: assaySummary.Name || "Unknown Assay",
        sourceName: assaySummary.SourceName || null,
        sourceID: assaySummary.SourceID || null,
        description: Array.isArray(assaySummary.Description)
          ? assaySummary.Description.join("\n")
          : assaySummary.Description || null,
        protocol: Array.isArray(assaySummary.Protocol)
          ? assaySummary.Protocol.join("\n")
          : assaySummary.Protocol || null,
        comment: Array.isArray(assaySummary.Comment)
          ? assaySummary.Comment.join("\n")
          : assaySummary.Comment || null,
        method: assaySummary.Method || null,
        targets: (assaySummary.Target || []).map((target) => ({
          name: target.Name || null,
          accession: target.Accession || null,
        })),
        stats: {
          sidCountAll: assaySummary.SIDCountAll || 0,
          sidCountActive: assaySummary.SIDCountActive || 0,
          sidCountInactive: assaySummary.SIDCountInactive || 0,
          cidCountAll: assaySummary.CIDCountAll || 0,
          cidCountActive: assaySummary.CIDCountActive || 0,
          cidCountInactive: assaySummary.CIDCountInactive || 0,
        },
        lastChange: assaySummary.LastDataChange
          ? {
              year: assaySummary.LastDataChange.Year,
              month: assaySummary.LastDataChange.Month,
              day: assaySummary.LastDataChange.Day,
            }
          : null,
        // Data tambahan
        version: assaySummary.Version || null,
        revision: assaySummary.Revision || null,
        hasScore: assaySummary.HasScore || false,
        numberOfTIDs: assaySummary.NumberOfTIDs || 0,
        // Menyertakan data asli untuk memastikan tidak ada informasi yang hilang
        rawData: response.data,
      };

      return NextResponse.json(formattedResponse);
    } else {
      // Jika tidak ada data assay
      return NextResponse.json(
        {
          error: "No assay data found",
          aid: aidNum.toString(),
          rawData: response.data, // Tetap menyertakan data mentah meskipun tidak sesuai format yang diharapkan
        },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error(`Error fetching assay data for AID ${aid}:`, error.message);

    // Berikan respons error yang deskriptif
    return NextResponse.json(
      {
        error: "Failed to fetch assay data",
        details: error.message,
        aid: aid,
        message: `Terjadi kesalahan saat mengambil data assay: ${error.message}`,
      },
      { status: error.response?.status || 500 }
    );
  }
}

// Fungsi untuk mengambil bioaktivitas berdasarkan CID (kode yang ada sebelumnya)
async function getBioactivityByCID(cid) {
  // Pastikan CID adalah angka valid
  const cidNum = parseInt(cid);
  if (isNaN(cidNum) || cidNum <= 0) {
    return NextResponse.json(
      { error: "CID harus berupa angka positif" },
      { status: 400 }
    );
  }

  try {
    // Ambil data assay summary langsung dari endpoint yang mengembalikan data lengkap
    const assaySummaryUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cidNum}/assaysummary/JSON`;

    // Ambil data assay lengkap
    console.log(`Fetching assay data from ${assaySummaryUrl}`);
    const assayResponse = await axios.get(assaySummaryUrl).catch((err) => {
      console.log("Error in initial assay fetch:", err.message);
      return { data: null };
    });

    // Jika kita berhasil mendapatkan data assay summary
    if (assayResponse.data && assayResponse.data.Table) {
      // Menyimpan struktur response asli
      const originalResponse = assayResponse.data;

      // Ekstrak informasi kolom
      const columns = originalResponse.Table.Columns?.Column || [];

      // Ekstrak baris-baris data
      const rows = originalResponse.Table.Row || [];

      // Menghitung jumlah total assay
      const totalAssayCount = rows.length;

      // Hitung jumlah assay aktif
      let activeAssayCount = 0;
      const processedAssays = [];
      const uniqueTargets = new Set();
      const targetDetails = {};

      // Proses setiap baris data
      rows.forEach((row) => {
        if (!row.Cell) return;

        // Buat objek yang memetakan nama kolom ke nilai
        const assayData = {};
        columns.forEach((columnName, index) => {
          if (row.Cell[index] !== undefined) {
            assayData[columnName] = row.Cell[index];
          } else {
            assayData[columnName] = null;
          }
        });

        // Tambahkan ke array assay yang diproses
        processedAssays.push(assayData);

        // Hitung jumlah assay aktif
        if (
          assayData["Activity Outcome"] &&
          assayData["Activity Outcome"].toLowerCase().includes("active")
        ) {
          activeAssayCount++;
        }

        // Kumpulkan data target
        if (assayData["Target GeneID"]) {
          const geneId = assayData["Target GeneID"];
          uniqueTargets.add(geneId);

          // Simpan detail target jika belum ada
          if (!targetDetails[geneId]) {
            targetDetails[geneId] = {
              geneID: geneId,
              name: "Unknown Target",
              activeAssayCount: 0,
              totalAssayCount: 0,
              activityValues: [],
              aids: [],
              sids: [],
              pmids: [],
              activityOutcomes: [],
              targetGI: null,
              activityNames: [],
              assayNames: [],
              assayTypes: [],
              rnai: [],
            };
          }

          // Perbarui jumlah assay untuk target ini
          targetDetails[geneId].totalAssayCount++;

          // Perbarui jumlah assay aktif untuk target ini jika hasilnya aktif
          if (
            assayData["Activity Outcome"] &&
            assayData["Activity Outcome"].toLowerCase().includes("active")
          ) {
            targetDetails[geneId].activeAssayCount++;
          }

          // Simpan nilai aktivitas jika ada
          if (assayData["Activity Value [uM]"]) {
            targetDetails[geneId].activityValues.push(
              assayData["Activity Value [uM]"]
            );
          }

          // Perbarui nama target jika tersedia
          if (assayData["Assay Name"]) {
            targetDetails[geneId].name = assayData["Assay Name"];
          }

          // Tambahkan kolom-kolom original ke dalam detail target
          if (
            assayData["AID"] &&
            !targetDetails[geneId].aids.includes(assayData["AID"])
          ) {
            targetDetails[geneId].aids.push(assayData["AID"]);
          }

          if (
            assayData["SID"] &&
            !targetDetails[geneId].sids.includes(assayData["SID"])
          ) {
            targetDetails[geneId].sids.push(assayData["SID"]);
          }

          if (
            assayData["PubMed ID"] &&
            !targetDetails[geneId].pmids.includes(assayData["PubMed ID"])
          ) {
            targetDetails[geneId].pmids.push(assayData["PubMed ID"]);
          }

          if (
            assayData["Activity Outcome"] &&
            !targetDetails[geneId].activityOutcomes.includes(
              assayData["Activity Outcome"]
            )
          ) {
            targetDetails[geneId].activityOutcomes.push(
              assayData["Activity Outcome"]
            );
          }

          if (assayData["Target GI"]) {
            targetDetails[geneId].targetGI = assayData["Target GI"];
          }

          if (
            assayData["Activity Name"] &&
            !targetDetails[geneId].activityNames.includes(
              assayData["Activity Name"]
            )
          ) {
            targetDetails[geneId].activityNames.push(
              assayData["Activity Name"]
            );
          }

          if (
            assayData["Assay Name"] &&
            !targetDetails[geneId].assayNames.includes(assayData["Assay Name"])
          ) {
            targetDetails[geneId].assayNames.push(assayData["Assay Name"]);
          }

          if (
            assayData["Assay Type"] &&
            !targetDetails[geneId].assayTypes.includes(assayData["Assay Type"])
          ) {
            targetDetails[geneId].assayTypes.push(assayData["Assay Type"]);
          }

          if (
            assayData["RNAi"] &&
            !targetDetails[geneId].rnai.includes(assayData["RNAi"])
          ) {
            targetDetails[geneId].rnai.push(assayData["RNAi"]);
          }
        }
      });

      // Siapkan array target untuk response
      const targetsArray = Object.values(targetDetails).map((target) => {
        // Hitung aktifitas rata-rata jika ada
        let activityValue = null;
        if (target.activityValues.length > 0) {
          // Konversi ke angka dan hitung rata-rata
          const numericValues = target.activityValues
            .map((val) => parseFloat(val))
            .filter((val) => !isNaN(val));

          if (numericValues.length > 0) {
            activityValue =
              numericValues.reduce((a, b) => a + b, 0) / numericValues.length;
            activityValue = activityValue.toFixed(2); // 2 angka desimal
          }
        }

        return {
          name: target.name,
          geneID: target.geneID,
          activeAssayCount: target.activeAssayCount,
          totalAssayCount: target.totalAssayCount,
          activityValue: activityValue,
          activityType: "uM", // Default untuk nilai ini
          // Tambahkan kolom original ke respons
          aids: target.aids,
          sids: target.sids,
          pmids: target.pmids,
          activityOutcomes: target.activityOutcomes,
          targetGI: target.targetGI,
          activityNames: target.activityNames,
          assayNames: target.assayNames,
          assayTypes: target.assayTypes,
          rnai: target.rnai,
        };
      });

      // Siapkan response dengan format yang diharapkan, termasuk originalResponse
      return NextResponse.json({
        cid: cidNum.toString(),
        bioactivity: {
          activeAssayCount,
          totalAssayCount,
          activeTargetCount: uniqueTargets.size,
          targets: targetsArray,
          assays: processedAssays.slice(0, 50), // Batasi ke 50 assay pertama untuk menghindari response terlalu besar
        },
        hasBioactivityData: totalAssayCount > 0,
        rawData: originalResponse, // Menambahkan seluruh data asli
      });
    } else {
      // Jika tidak ada data assay yang tersedia, coba dapatkan informasi melalui PUG View API
      console.log(
        "No assay data available via direct API, trying PUG View API"
      );
      const pugViewUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug_view/data/compound/${cidNum}/JSON`;
      const pugViewResponse = await axios.get(pugViewUrl);

      // Ekstrak data bioaktivitas dari respons
      const sections = pugViewResponse.data?.Record?.Section || [];

      // Cari bagian bioaktivitas
      const bioactivitySection = sections.find(
        (section) =>
          section.TOCHeading?.toLowerCase().includes("bioactivity") ||
          section.TOCHeading?.toLowerCase().includes("pharmacology")
      );

      // Ekstrak informasi aktivitas dari bagian bioaktivitas
      const bioactivityInfo = extractBioactivityInfo(bioactivitySection);

      // Pendekatan terakhir: Coba dapatkan daftar ID assay
      try {
        const assayListUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cidNum}/aids/JSON`;
        const assayListResponse = await axios
          .get(assayListUrl)
          .catch(() => ({ data: { IdentifierList: { AID: [] } } }));

        const assayIds = assayListResponse.data?.IdentifierList?.AID || [];

        if (assayIds.length > 0) {
          // Jika kita mendapatkan IDs assay tapi tidak memiliki data ringkasan
          return NextResponse.json({
            cid: cidNum.toString(),
            bioactivity: {
              activeAssayCount: 0,
              totalAssayCount: assayIds.length,
              activeTargetCount: 0,
              targets: [],
              assays: assayIds.map((id) => ({ AID: id })),
              bioactiveSummary: bioactivityInfo.summary,
            },
            hasBioactivityData: assayIds.length > 0,
            rawData: assayListResponse.data, // Menambahkan data mentah
          });
        }
      } catch (assayErr) {
        console.log("Error fetching assay IDs:", assayErr.message);
      }

      // Jika semua pendekatan gagal, kembalikan informasi dari PUG View
      return NextResponse.json({
        cid: cidNum.toString(),
        bioactivity: {
          activeAssayCount: bioactivityInfo.activeAssayCount,
          totalAssayCount: bioactivityInfo.totalAssayCount,
          activeTargetCount: bioactivityInfo.activeTargetCount,
          targets: bioactivityInfo.targets,
          assays: [],
          bioactiveSummary: bioactivityInfo.summary,
        },
        hasBioactivityData:
          bioactivityInfo.totalAssayCount > 0 ||
          bioactivityInfo.summary !== null,
        rawData: pugViewResponse.data, // Menambahkan data mentah
      });
    }
  } catch (error) {
    console.error("Error fetching bioactivity data:", error.message);

    // Berikan respons error yang lebih deskriptif
    return NextResponse.json(
      {
        error: "Failed to fetch bioactivity data",
        details: error.message,
        cid: cidNum.toString(),
        bioactivity: {
          activeAssayCount: 0,
          totalAssayCount: 0,
          activeTargetCount: 0,
          targets: [],
          assays: [],
          bioactiveSummary: null,
        },
        hasBioactivityData: false,
        message:
          "Terjadi kesalahan saat mengambil data bioaktivitas: " +
          error.message,
      },
      { status: error.response?.status || 500 }
    );
  }
}

// Helper function untuk mengekstrak informasi bioaktivitas dari bagian section
function extractBioactivityInfo(bioactivitySection) {
  // Nilai default
  const defaultInfo = {
    activeAssayCount: 0,
    totalAssayCount: 0,
    activeTargetCount: 0,
    targets: [],
    summary: null,
  };

  if (!bioactivitySection) return defaultInfo;

  let summary = null;
  let activeAssayCount = 0;
  let totalAssayCount = 0;
  let activeTargetCount = 0;
  let targets = [];

  try {
    // Cari subsections yang relevan
    const subsections = bioactivitySection.Section || [];

    // Cari ringkasan bioaktivitas
    const summarySections = subsections.filter(
      (section) =>
        section.TOCHeading?.toLowerCase().includes("summary") ||
        section.TOCHeading?.toLowerCase().includes("bioactivity")
    );

    // Ekstrak ringkasan dari setiap bagian
    for (const section of summarySections) {
      if (section.Information && section.Information.length > 0) {
        for (const info of section.Information) {
          // Cek StringWithMarkup
          if (
            info.Value?.StringWithMarkup &&
            info.Value.StringWithMarkup.length > 0
          ) {
            const summaryText = info.Value.StringWithMarkup[0].String;
            if (summaryText) {
              summary = summaryText;

              // Coba temukan jumlah assay dari ringkasan
              const assayCountMatch = summaryText.match(
                /active in (\d+) of (\d+) bioassays/i
              );
              if (assayCountMatch) {
                activeAssayCount = parseInt(assayCountMatch[1]) || 0;
                totalAssayCount = parseInt(assayCountMatch[2]) || 0;
              }

              // Coba temukan jumlah target
              const targetCountMatch = summaryText.match(/(\d+) target/i);
              if (targetCountMatch) {
                activeTargetCount = parseInt(targetCountMatch[1]) || 0;
              }
            }
          }
        }
      }

      // Cari informasi target
      if (section.Section) {
        const targetSections = section.Section.filter(
          (subsection) =>
            subsection.TOCHeading?.toLowerCase().includes("target") ||
            subsection.TOCHeading?.toLowerCase().includes("enzyme") ||
            subsection.TOCHeading?.toLowerCase().includes("receptor")
        );

        for (const targetSection of targetSections) {
          if (
            targetSection.Information &&
            targetSection.Information.length > 0
          ) {
            for (const info of targetSection.Information) {
              if (info.Name && info.Value?.StringWithMarkup) {
                targets.push({
                  name: info.Name,
                  description: info.Value.StringWithMarkup[0]?.String || null,
                  source: info.Reference?.[0]?.SourceName || null,
                });
              }
            }
          }
        }
      }
    }
  } catch (err) {
    console.error("Error parsing bioactivity section:", err);
  }

  return {
    activeAssayCount,
    totalAssayCount,
    activeTargetCount,
    targets,
    summary,
  };
}
