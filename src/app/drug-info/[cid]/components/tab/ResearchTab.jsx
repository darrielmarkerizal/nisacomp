import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  MdOutlineWarning,
  MdOutlineBiotech,
  MdOpenInNew,
  MdInfoOutline,
  MdSearch,
  MdSort,
  MdFilterList,
  MdKeyboardArrowDown,
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
import { Separator } from "@/components/ui/separator";
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
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

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
      bioassaySearch,
    ]
  );

  // Handler untuk menjalankan pencarian bioassay
  const handleBioassaySearch = () => {
    if (!bioassaySearch.trim()) return;

    setBioassayPage(1); // Reset ke halaman pertama
    fetchBioactivityData({
      page: 1,
      search: bioassaySearch,
      showLoading: false,
      forceSearch: true,
    });
  };

  // Handler untuk reset pencarian
  const handleResetSearch = () => {
    setBioassaySearch("");
    setBioassayPage(1);
    fetchBioactivityData({
      page: 1,
      search: "",
      forceSearch: false,
    });
  };

  // Handler untuk perubahan pagination bioassay
  const handleBioassayPageChange = (page) => {
    setBioassayPage(page);

    // Scroll to top of bioassay table on mobile for better UX
    if (windowWidth < 640) {
      document.getElementById("bioassay-table")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
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

  // Track window resize for responsive design
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

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

  // Responsive generatePaginationItems function
  const generatePaginationItems = (currentPage, totalPages) => {
    // For mobile view with limited space, show fewer items
    if (windowWidth < 640) {
      // For mobile
      if (totalPages <= 3) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
      } else if (currentPage === 1) {
        return [1, 2, "ellipsis", totalPages];
      } else if (currentPage === totalPages) {
        return [1, "ellipsis", totalPages - 1, totalPages];
      } else {
        return [1, "ellipsis", currentPage, "ellipsis", totalPages];
      }
    } else if (windowWidth < 768) {
      // For small tablets
      if (totalPages <= 5) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
      } else if (currentPage <= 2) {
        return [1, 2, 3, "ellipsis", totalPages];
      } else if (currentPage >= totalPages - 1) {
        return [1, "ellipsis", totalPages - 2, totalPages - 1, totalPages];
      } else {
        return [1, "ellipsis", currentPage, "ellipsis", totalPages];
      }
    } else {
      // For larger screens
      if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
      } else if (currentPage <= 3) {
        return [1, 2, 3, 4, 5, "ellipsis", totalPages];
      } else if (currentPage >= totalPages - 2) {
        return [
          1,
          "ellipsis",
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        ];
      } else {
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
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 rounded-lg" />
              ))}
            </div>
            <Skeleton className="h-32 rounded-lg" />
            <Skeleton className="h-[350px] rounded-lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-4 sm:p-8 text-center">
          <div className="inline-flex items-center justify-center rounded-full bg-red-100 p-3 sm:p-4 mb-3 sm:mb-4">
            <MdOutlineWarning className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
          </div>
          <h3 className="text-base sm:text-lg font-medium text-slate-800">
            Terjadi Kesalahan
          </h3>
          <p className="text-slate-500 mt-2 text-sm">
            Gagal memuat data bioaktivitas
          </p>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="mt-4 text-xs sm:text-sm h-8 sm:h-9"
          >
            Coba Lagi
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="sm:pb-4 pb-3">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <div className="p-1.5 sm:p-2 bg-green-50 rounded-full">
            <MdOutlineBiotech className="text-green-600 h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <span>Data Bioaktivitas</span>
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Aktivitas biologis dan farmakologis {compound.name}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3 sm:p-6">
        {bioactivityData?.hasBioactivityData ? (
          <div className="space-y-4 sm:space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-medium text-green-800 text-xs sm:text-sm">
                  Total Pengujian Aktif
                </h3>
                <div className="text-xl sm:text-2xl font-bold text-green-700 mt-1">
                  {bioactivityData.bioactivity.activeAssayCount || 0}
                  <span className="text-xs sm:text-sm font-normal text-green-600 ml-1">
                    / {bioactivityData.bioactivity.totalAssayCount || 0}
                  </span>
                </div>
              </div>

              <div className="p-3 sm:p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                <h3 className="font-medium text-indigo-800 text-xs sm:text-sm">
                  Target Aktif
                </h3>
                <div className="text-xl sm:text-2xl font-bold text-indigo-700 mt-1">
                  {bioactivityData.bioactivity.activeTargetCount || 0}
                </div>
              </div>

              <div className="p-3 sm:p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <h3 className="font-medium text-amber-800 text-xs sm:text-sm">
                  Status Obat
                </h3>
                <div className="text-base sm:text-lg font-bold text-amber-700 mt-1">
                  {compound.essential?.useClassification &&
                  compound.essential.useClassification !== "N/A" ? (
                    <div className="truncate">
                      {compound.essential.useClassification}
                    </div>
                  ) : compound.essential?.pharmActionList?.length > 0 ? (
                    <div className="truncate">
                      {compound.essential.pharmActionList.join(", ")}
                    </div>
                  ) : (
                    <div className="text-amber-500 text-sm sm:text-base font-normal">
                      Tidak Diketahui
                    </div>
                  )}
                </div>
                {compound.essential?.drugStatus && (
                  <div className="mt-1 text-[10px] sm:text-xs text-amber-600">
                    {compound.essential.drugStatus}
                  </div>
                )}
              </div>
            </div>

            {/* Bioactivity Summary */}
            {bioactivityData.bioactivity.bioactiveSummary && (
              <div className="p-2.5 sm:p-3 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-xs sm:text-sm text-slate-700">
                  {bioactivityData.bioactivity.bioactiveSummary}
                </p>
              </div>
            )}

            {/* Bioassay Section with Search, Sort, and Pagination */}
            {bioactivityData.bioactivity.assays &&
              bioactivityData.bioactivity.assays.length > 0 && (
                <div className="mt-6 sm:mt-8 relative" id="bioassay-table">
                  <h3 className="font-medium text-slate-700 mb-3 text-sm sm:text-base">
                    Data Bioassay (Pengujian)
                  </h3>

                  {/* Search and Sort Controls */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-3 sm:mb-4">
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
                          className="pl-8 rounded-r-none text-sm h-9 sm:h-10"
                        />
                      </div>
                      <Button
                        className="rounded-l-none px-2 sm:px-3 h-9 sm:h-10"
                        onClick={handleBioassaySearch}
                        disabled={isLoadingBioassay}
                      >
                        {isLoadingBioassay ? (
                          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                        ) : (
                          <span className="sm:inline hidden">Cari</span>
                        )}
                        {!isLoadingBioassay && (
                          <MdSearch className="h-4 w-4 sm:hidden" />
                        )}
                      </Button>
                    </div>
                    <div className="flex gap-1 sm:gap-2">
                      <Select
                        value={bioassayActiveSortBy}
                        onValueChange={(value) => {
                          setBioassayActiveSortBy(value);
                          setBioassayActiveSortOrder("asc");
                          setBioassayPage(1);
                        }}
                      >
                        <SelectTrigger className="w-[120px] sm:w-[150px] h-9 sm:h-10 text-xs sm:text-sm">
                          <SelectValue placeholder="Urutkan" />
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
                        className="flex-shrink-0 h-9 sm:h-10 w-9 sm:w-10"
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
                  <div className="flex justify-between items-center mb-2 sm:mb-3">
                    <div className="text-xs sm:text-sm text-slate-500">
                      {bioactivityData.pagination && (
                        <span>
                          Menampilkan{" "}
                          <span className="font-medium">
                            {(bioactivityData.pagination.page - 1) *
                              bioactivityData.pagination.pageSize +
                              1}
                            -
                            {Math.min(
                              bioactivityData.pagination.page *
                                bioactivityData.pagination.pageSize,
                              bioactivityData.pagination.totalItems
                            )}
                          </span>{" "}
                          dari {bioactivityData.pagination.totalItems}
                        </span>
                      )}
                      {bioactivityData.search && (
                        <span className="block sm:inline sm:ml-1">
                          {" "}
                          untuk "{bioactivityData.search}"
                        </span>
                      )}
                    </div>
                    {bioactivityData.search && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleResetSearch}
                        className="text-xs h-7 p-2"
                      >
                        <MdFilterList className="h-3 w-3 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">Hapus</span> Filter
                      </Button>
                    )}
                  </div>

                  {/* Overlay loading untuk pencarian */}
                  {isLoadingBioassay && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10 rounded-md">
                      <div className="bg-white/80 p-3 sm:p-4 rounded-lg shadow-sm flex items-center gap-3">
                        <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-green-500 border-t-transparent"></div>
                        <span className="text-slate-700 text-sm">
                          Memuat bioassay...
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Bioassay table */}
                  <div className="overflow-auto border border-slate-200 rounded-lg max-h-[350px] sm:max-h-[400px]">
                    <table className="min-w-full divide-y divide-slate-200">
                      <thead className="bg-slate-50 sticky top-0 z-10">
                        <tr>
                          <th
                            className="px-2 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs font-medium text-slate-600 text-left cursor-pointer hover:bg-slate-100"
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
                            className="px-2 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs font-medium text-slate-600 text-left cursor-pointer hover:bg-slate-100"
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
                            className="px-2 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs font-medium text-slate-600 text-left cursor-pointer hover:bg-slate-100"
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
                          <th className="px-2 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs font-medium text-slate-600 text-left">
                            Nama Assay
                          </th>
                          <th className="px-2 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs font-medium text-slate-600 text-left">
                            Detail
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-200">
                        {bioactivityData.bioactivity.assays.map(
                          (assay, idx) => (
                            <tr key={idx} className="hover:bg-slate-50">
                              <td className="px-2 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs text-slate-600">
                                {assay["AID"] || "-"}
                              </td>
                              <td className="px-2 sm:px-3 py-1.5 sm:py-2">
                                {assay["Activity Outcome"] ? (
                                  <Badge
                                    variant="outline"
                                    className={`${
                                      assay["Activity Outcome"]
                                        .toLowerCase()
                                        .includes("active")
                                        ? "bg-green-50 text-green-700"
                                        : assay["Activity Outcome"]
                                              .toLowerCase()
                                              .includes("inactive")
                                          ? "bg-slate-50 text-slate-700"
                                          : assay["Activity Outcome"]
                                                .toLowerCase()
                                                .includes("inconclusive")
                                            ? "bg-amber-50 text-amber-700"
                                            : "bg-slate-50 text-slate-700"
                                    } text-[9px] sm:text-xs px-1 sm:px-1.5 py-0.5 whitespace-nowrap`}
                                  >
                                    {assay["Activity Outcome"]}
                                  </Badge>
                                ) : (
                                  <span className="text-[10px] sm:text-xs text-slate-500">
                                    -
                                  </span>
                                )}
                              </td>
                              <td className="px-2 sm:px-3 py-1.5 sm:py-2">
                                {assay["Activity Value [uM]"] ? (
                                  <div className="flex flex-col">
                                    <span
                                      className={`text-[10px] sm:text-xs ${
                                        parseFloat(
                                          assay["Activity Value [uM]"]
                                        ) < 1
                                          ? "text-green-600 font-medium"
                                          : parseFloat(
                                                assay["Activity Value [uM]"]
                                              ) < 10
                                            ? "text-green-700"
                                            : "text-slate-600"
                                      }`}
                                    >
                                      {parseFloat(
                                        assay["Activity Value [uM]"]
                                      ).toFixed(2)}
                                    </span>
                                    {assay["Activity Type"] && (
                                      <span className="text-[9px] text-slate-500 hidden sm:inline">
                                        {assay["Activity Type"]}
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-[10px] sm:text-xs text-slate-500">
                                    -
                                  </span>
                                )}
                              </td>
                              <td className="px-2 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs text-slate-800">
                                <div className="max-w-[150px] sm:max-w-[250px] md:max-w-[350px] truncate">
                                  {assay["Assay Name"] || "-"}
                                  {assay["Target Name"] && (
                                    <span className="text-[9px] text-slate-500 block">
                                      Target: {assay["Target Name"]}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="px-2 sm:px-3 py-1.5 sm:py-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 sm:h-7 text-[9px] sm:text-xs p-1 sm:p-2"
                                  onClick={() => {
                                    window.open(
                                      `/api/obat/bioactivity/${compound.cid}?aid=${assay["AID"]}`,
                                      "_blank"
                                    );
                                  }}
                                >
                                  <MdOpenInNew className="mr-1 h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                  <span className="hidden xs:inline">
                                    Detail
                                  </span>
                                </Button>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Footer pagination controls */}
                  <Separator className="my-3 sm:my-4" />

                  <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 mt-3">
                    {/* Items per page selector - Simplified for mobile */}

                    {/* Pagination info - Simplified for mobile */}
                    {bioactivityData.pagination && (
                      <div className="text-xs sm:text-sm text-slate-500">
                        <span className="hidden sm:inline">Halaman </span>
                        {bioactivityData.pagination.page}
                        <span className="hidden sm:inline"> dari </span>
                        <span className="sm:hidden">/</span>
                        {bioactivityData.pagination.totalPages || 1}
                      </div>
                    )}
                  </div>

                  {/* Pagination */}
                  {bioactivityData.pagination &&
                    bioactivityData.pagination.totalPages > 1 && (
                      <div className="mt-3 sm:mt-4">
                        <Pagination>
                          <PaginationContent className="flex flex-wrap justify-center gap-1 md:gap-0">
                            {/* Previous Button - Selalu ditampilkan */}
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
                                className={`${
                                  !bioactivityData.pagination.hasPrevPage
                                    ? "pointer-events-none opacity-50"
                                    : ""
                                } h-8 sm:h-9 text-xs sm:text-sm py-1 px-1.5 sm:px-3`}
                              />
                            </PaginationItem>

                            {/* Responsive Pagination Items */}
                            {generatePaginationItems(
                              bioactivityData.pagination.page,
                              bioactivityData.pagination.totalPages
                            ).map((item, index) => (
                              <PaginationItem key={index}>
                                {item === "ellipsis" ? (
                                  <PaginationEllipsis className="h-8 sm:h-9" />
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
                                    className="h-8 sm:h-9 w-8 sm:w-9 text-xs sm:text-sm"
                                  >
                                    {item}
                                  </PaginationLink>
                                )}
                              </PaginationItem>
                            ))}

                            {/* Next Button - Selalu ditampilkan */}
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
                                className={`${
                                  !bioactivityData.pagination.hasNextPage
                                    ? "pointer-events-none opacity-50"
                                    : ""
                                } h-8 sm:h-9 text-xs sm:text-sm py-1 px-1.5 sm:px-3`}
                              />
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>
                      </div>
                    )}
                </div>
              )}
          </div>
        ) : (
          <div className="p-4 sm:p-8 text-center">
            <div className="inline-flex items-center justify-center rounded-full bg-slate-100 p-3 sm:p-4 mb-3 sm:mb-4">
              <MdOutlineBiotech className="h-5 w-5 sm:h-6 sm:w-6 text-slate-500" />
            </div>
            <h3 className="text-base sm:text-lg font-medium text-slate-800">
              Tidak Ada Data Bioaktivitas
            </h3>
            <p className="text-slate-500 max-w-md mx-auto text-xs sm:text-sm mt-1 sm:mt-2">
              Tidak ditemukan data bioaktivitas untuk {compound.name}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
