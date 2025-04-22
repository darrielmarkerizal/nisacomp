import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  MdOutlineWarning,
  MdOutlineBiotech,
  MdOpenInNew,
  MdInfoOutline,
  MdSearch,
  MdSort,
} from "react-icons/md";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function ResearchTab({ compound }) {
  const [bioactivityData, setBioactivityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State untuk pagination, search, dan sorting bioaktivitas
  const [bioassayPage, setBioassayPage] = useState(1);
  const [bioassayPerPage, setBioassayPerPage] = useState(10);
  const [bioassaySearch, setBioassaySearch] = useState("");
  const [bioassayActiveSortBy, setBioassayActiveSortBy] = useState("AID");
  const [bioassayActiveSortOrder, setBioassayActiveSortOrder] = useState("asc");
  const [isLoadingBioassay, setIsLoadingBioassay] = useState(false);

  // Fungsi untuk mengambil data bioaktivitas dengan parameter yang diberikan
  const fetchBioactivityData = useCallback(
    async (options = {}) => {
      const {
        page = bioassayPage,
        pageSize = bioassayPerPage,
        search = null,
        sortBy = bioassayActiveSortBy,
        sortOrder = bioassayActiveSortOrder,
        showLoading = true,
        forceSearch = false,
      } = options;

      try {
        if (showLoading) {
          setLoading(true);
        } else {
          setIsLoadingBioassay(true);
        }

        // Bangun query parameters
        const params = new URLSearchParams({
          page,
          pageSize,
          sortBy,
          sortOrder,
        });

        // Tambahkan parameter search jika perlu
        const searchTerm = forceSearch ? search || bioassaySearch : null;
        if (searchTerm && searchTerm.trim() !== "") {
          params.append("search", searchTerm);
        }

        const response = await axios.get(
          `/api/obat/bioactivity/${compound.cid}?${params.toString()}`
        );

        setBioactivityData(response.data);
      } catch (err) {
        console.error("Error fetching bioactivity data:", err);
        setError(
          err.response?.data?.error ||
            err.message ||
            "Failed to fetch bioactivity data"
        );
      } finally {
        if (showLoading) {
          setLoading(false);
        } else {
          setIsLoadingBioassay(false);
        }
      }
    },
    [
      compound.cid,
      bioassayPage,
      bioassayPerPage,
      bioassayActiveSortBy,
      bioassayActiveSortOrder,
    ]
  );

  // Handler untuk menjalankan pencarian bioassay
  const handleBioassaySearch = () => {
    setBioassayPage(1); // Reset ke halaman pertama
    fetchBioactivityData({
      page: 1,
      search: bioassaySearch,
      showLoading: false,
      forceSearch: true,
    });
  };

  // Handler untuk perubahan pagination bioassay
  const handleBioassayPageChange = (page) => {
    setBioassayPage(page);
  };

  // Handler untuk perubahan pengurutan bioassay
  const handleBioassaySortChange = (sortBy) => {
    // Jika mengklik kolom yang sama, toggle arah pengurutan
    if (sortBy === bioassayActiveSortBy) {
      setBioassayActiveSortOrder(
        bioassayActiveSortOrder === "asc" ? "desc" : "asc"
      );
    } else {
      // Jika mengklik kolom yang berbeda, tetapkan kolom baru dan reset ke ascending
      setBioassayActiveSortBy(sortBy);
      setBioassayActiveSortOrder("asc");
    }
    setBioassayPage(1); // Reset ke halaman pertama
  };

  // Efek untuk memuat data saat komponen dimuat
  useEffect(() => {
    fetchBioactivityData({
      forceSearch: false,
      search: null,
    });
  }, [fetchBioactivityData]);

  // Efek untuk memanggil API ketika parameter bioassay berubah
  useEffect(() => {
    fetchBioactivityData({
      showLoading: false,
      forceSearch: false,
    });
  }, [
    bioassayPage,
    bioassayPerPage,
    bioassayActiveSortBy,
    bioassayActiveSortOrder,
    fetchBioactivityData,
  ]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full max-w-md" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="inline-flex items-center justify-center rounded-full bg-red-100 p-4 mb-4">
            <MdOutlineWarning className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-slate-800">
            Terjadi Kesalahan
          </h3>
          <p className="text-slate-500 mt-2">Gagal memuat data bioaktivitas</p>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="mt-4"
          >
            Coba Lagi
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 bg-green-50 rounded-full">
            <MdOutlineBiotech className="text-green-600 h-5 w-5" />
          </div>
          <span>Data Bioaktivitas</span>
        </CardTitle>
        <CardDescription>
          Aktivitas biologis dan farmakologis {compound.name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {bioactivityData?.hasBioactivityData ? (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-medium text-green-800 text-sm">
                  Total Pengujian Aktif
                </h3>
                <div className="text-2xl font-bold text-green-700 mt-1">
                  {bioactivityData.bioactivity.activeAssayCount || 0}
                  <span className="text-sm font-normal text-green-600 ml-1">
                    / {bioactivityData.bioactivity.totalAssayCount || 0}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                <h3 className="font-medium text-indigo-800 text-sm">
                  Target Aktif
                </h3>
                <div className="text-2xl font-bold text-indigo-700 mt-1">
                  {bioactivityData.bioactivity.activeTargetCount || 0}
                </div>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <h3 className="font-medium text-amber-800 text-sm">
                  Status Obat
                </h3>
                <div className="text-lg font-bold text-amber-700 mt-1 truncate">
                  {compound.essential.useClassification !== "N/A"
                    ? compound.essential.useClassification
                    : "Tidak Diketahui"}
                </div>
              </div>
            </div>

            {/* Bioactivity Summary */}
            {bioactivityData.bioactivity.bioactiveSummary && (
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-sm text-slate-700">
                  {bioactivityData.bioactivity.bioactiveSummary}
                </p>
              </div>
            )}

            {/* Bioassay Section with Search, Sort, and Pagination */}
            {bioactivityData.bioactivity.assays &&
              bioactivityData.bioactivity.assays.length > 0 && (
                <div className="mt-8 relative">
                  <h3 className="font-medium text-slate-700 mb-3">
                    Data Bioassay (Pengujian)
                  </h3>

                  {/* Search and Sort Controls */}
                  <div className="flex flex-col sm:flex-row gap-3 mb-4">
                    <div className="relative flex-grow flex">
                      <div className="relative flex-grow">
                        <MdSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                        <Input
                          type="text"
                          placeholder="Cari bioassay..."
                          value={bioassaySearch}
                          onChange={(e) => setBioassaySearch(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleBioassaySearch();
                            }
                          }}
                          className="pl-8 rounded-r-none"
                        />
                      </div>
                      <Button
                        className="rounded-l-none"
                        onClick={handleBioassaySearch}
                        disabled={isLoadingBioassay}
                      >
                        {isLoadingBioassay ? (
                          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                        ) : (
                          "Cari"
                        )}
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Select
                        value={bioassayActiveSortBy}
                        onValueChange={(value) => {
                          setBioassayActiveSortBy(value);
                          setBioassayActiveSortOrder("asc");
                          setBioassayPage(1);
                        }}
                      >
                        <SelectTrigger className="w-[150px]">
                          <SelectValue placeholder="Urutkan berdasarkan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AID">BioAssay AID</SelectItem>
                          <SelectItem value="SID">Substance SID</SelectItem>
                          <SelectItem value="Activity Type">
                            Activity Type
                          </SelectItem>
                          <SelectItem value="Activity Outcome">
                            Activity Outcome
                          </SelectItem>
                          <SelectItem value="Activity Value [uM]">
                            Activity Value
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setBioassayActiveSortOrder(
                            bioassayActiveSortOrder === "asc" ? "desc" : "asc"
                          );
                          setBioassayPage(1);
                        }}
                        title={
                          bioassayActiveSortOrder === "asc"
                            ? "Urutkan menurun"
                            : "Urutkan menaik"
                        }
                        className="flex-shrink-0"
                      >
                        <MdSort
                          className={`h-4 w-4 ${
                            bioassayActiveSortOrder === "asc"
                              ? "transform rotate-180"
                              : ""
                          }`}
                        />
                      </Button>
                    </div>
                  </div>

                  {/* Info text about search results */}
                  <div className="text-sm text-slate-500 mb-3">
                    Menampilkan{" "}
                    {bioactivityData.pagination
                      ? `${
                          (bioactivityData.pagination.page - 1) *
                            bioactivityData.pagination.pageSize +
                          1
                        } - ${Math.min(
                          bioactivityData.pagination.page *
                            bioactivityData.pagination.pageSize,
                          bioactivityData.pagination.totalItems
                        )}`
                      : bioactivityData.bioactivity.assays.length}{" "}
                    dari{" "}
                    {bioactivityData.pagination?.totalItems ||
                      bioactivityData.bioactivity.totalAssayCount}{" "}
                    pengujian
                    {bioactivityData.search &&
                      ` untuk pencarian "${bioactivityData.search}"`}
                  </div>

                  {/* Overlay loading untuk pencarian */}
                  {isLoadingBioassay && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10 rounded-md">
                      <div className="bg-white/80 p-4 rounded-lg shadow-sm flex items-center gap-3">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-green-500 border-t-transparent"></div>
                        <span className="text-slate-700">
                          Memuat bioassay...
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Bioassay table */}
                  <div className="overflow-auto border border-slate-200 rounded-lg max-h-[400px]">
                    <table className="min-w-full divide-y divide-slate-200">
                      <thead className="bg-slate-50 sticky top-0 z-10">
                        <tr>
                          <th
                            className="px-3 py-2 text-xs font-medium text-slate-600 text-left cursor-pointer hover:bg-slate-100"
                            onClick={() => handleBioassaySortChange("AID")}
                          >
                            <div className="flex items-center">
                              AID
                              {bioassayActiveSortBy === "AID" && (
                                <span className="ml-1">
                                  {bioassayActiveSortOrder === "asc"
                                    ? "↑"
                                    : "↓"}
                                </span>
                              )}
                            </div>
                          </th>
                          <th
                            className="px-3 py-2 text-xs font-medium text-slate-600 text-left cursor-pointer hover:bg-slate-100"
                            onClick={() =>
                              handleBioassaySortChange("Activity Outcome")
                            }
                          >
                            <div className="flex items-center">
                              Hasil
                              {bioassayActiveSortBy === "Activity Outcome" && (
                                <span className="ml-1">
                                  {bioassayActiveSortOrder === "asc"
                                    ? "↑"
                                    : "↓"}
                                </span>
                              )}
                            </div>
                          </th>
                          <th
                            className="px-3 py-2 text-xs font-medium text-slate-600 text-left cursor-pointer hover:bg-slate-100"
                            onClick={() =>
                              handleBioassaySortChange("Activity Value [uM]")
                            }
                          >
                            <div className="flex items-center">
                              Nilai (uM)
                              {bioassayActiveSortBy ===
                                "Activity Value [uM]" && (
                                <span className="ml-1">
                                  {bioassayActiveSortOrder === "asc"
                                    ? "↑"
                                    : "↓"}
                                </span>
                              )}
                            </div>
                          </th>
                          <th className="px-3 py-2 text-xs font-medium text-slate-600 text-left">
                            Nama Assay
                          </th>
                          <th className="px-3 py-2 text-xs font-medium text-slate-600 text-left">
                            Detail
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-200">
                        {bioactivityData.bioactivity.assays.map(
                          (assay, idx) => (
                            <tr key={idx} className="hover:bg-slate-50">
                              <td className="px-3 py-2 text-xs text-slate-600">
                                {assay["AID"] || "-"}
                              </td>
                              <td className="px-3 py-2">
                                {assay["Activity Outcome"] ? (
                                  <Badge
                                    variant="outline"
                                    className={
                                      assay["Activity Outcome"]
                                        .toLowerCase()
                                        .includes("active")
                                        ? "bg-green-50 text-green-700"
                                        : "bg-slate-50 text-slate-700"
                                    }
                                  >
                                    {assay["Activity Outcome"]}
                                  </Badge>
                                ) : (
                                  <span className="text-xs text-slate-500">
                                    -
                                  </span>
                                )}
                              </td>
                              <td className="px-3 py-2 text-xs text-slate-600">
                                {assay["Activity Value [uM]"] || "-"}
                              </td>
                              <td className="px-3 py-2 text-xs text-slate-800 max-w-[250px] truncate">
                                {assay["Assay Name"] || "-"}
                              </td>
                              <td className="px-3 py-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 text-xs"
                                  onClick={() => {
                                    window.open(
                                      `/api/obat/bioactivity/${compound.cid}?aid=${assay["AID"]}`,
                                      "_blank"
                                    );
                                  }}
                                >
                                  <MdOpenInNew className="mr-1 h-3 w-3" />
                                  Detail
                                </Button>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {bioactivityData.pagination &&
                    bioactivityData.pagination.totalPages > 1 && (
                      <div className="mt-4">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-500">
                              Tampilkan:
                            </span>
                            <Select
                              value={bioassayPerPage.toString()}
                              onValueChange={(value) => {
                                setBioassayPerPage(parseInt(value));
                                setBioassayPage(1);
                              }}
                            >
                              <SelectTrigger className="w-[80px] h-8">
                                <SelectValue placeholder={bioassayPerPage} />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="20">20</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                                <SelectItem value="100">100</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="text-sm text-slate-500">
                            Halaman {bioactivityData.pagination.page} dari{" "}
                            {bioactivityData.pagination.totalPages}
                          </div>
                        </div>

                        <Pagination>
                          <PaginationContent>
                            <PaginationItem>
                              <PaginationPrevious
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  if (bioactivityData.pagination.hasPrevPage) {
                                    handleBioassayPageChange(
                                      bioactivityData.pagination.page - 1
                                    );
                                  }
                                }}
                                className={
                                  !bioactivityData.pagination.hasPrevPage
                                    ? "pointer-events-none opacity-50"
                                    : ""
                                }
                              />
                            </PaginationItem>

                            {generatePaginationItems(
                              bioactivityData.pagination.page,
                              bioactivityData.pagination.totalPages
                            ).map((item, index) => (
                              <PaginationItem key={index}>
                                {item === "ellipsis" ? (
                                  <PaginationEllipsis />
                                ) : (
                                  <PaginationLink
                                    href="#"
                                    isActive={
                                      item === bioactivityData.pagination.page
                                    }
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleBioassayPageChange(item);
                                    }}
                                  >
                                    {item}
                                  </PaginationLink>
                                )}
                              </PaginationItem>
                            ))}

                            <PaginationItem>
                              <PaginationNext
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  if (bioactivityData.pagination.hasNextPage) {
                                    handleBioassayPageChange(
                                      bioactivityData.pagination.page + 1
                                    );
                                  }
                                }}
                                className={
                                  !bioactivityData.pagination.hasNextPage
                                    ? "pointer-events-none opacity-50"
                                    : ""
                                }
                              />
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>
                      </div>
                    )}

                  <div className="text-center mt-6">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        window.open(
                          `https://pubchem.ncbi.nlm.nih.gov/compound/${compound.cid}#section=BioAssay-Results`,
                          "_blank"
                        );
                      }}
                    >
                      <MdOpenInNew className="mr-1 h-4 w-4" />
                      Lihat di PubChem
                    </Button>
                  </div>
                </div>
              )}
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center rounded-full bg-slate-100 p-4 mb-4">
              <MdOutlineBiotech className="h-6 w-6 text-slate-500" />
            </div>
            <h3 className="text-lg font-medium text-slate-800">
              Tidak Ada Data Bioaktivitas
            </h3>
            <p className="text-slate-500 max-w-md mx-auto">
              Tidak ditemukan data bioaktivitas untuk {compound.name}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Helper function untuk menghasilkan item pagination
function generatePaginationItems(currentPage, totalPages) {
  // Jika total halaman <= 7, tampilkan semua halaman
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // Jika halaman saat ini dekat dengan awal
  if (currentPage <= 3) {
    return [1, 2, 3, 4, 5, "ellipsis", totalPages];
  }

  // Jika halaman saat ini dekat dengan akhir
  if (currentPage >= totalPages - 2) {
    return [
      1,
      "ellipsis",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  // Jika halaman saat ini di tengah-tengah
  return [
    1,
    "ellipsis",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis",
    totalPages,
  ];
}
