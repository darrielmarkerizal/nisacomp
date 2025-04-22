import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  MdOutlineArticle,
  MdOutlineBook,
  MdOutlineLibraryBooks,
  MdOutlineScience,
  MdOutlineWarning,
  MdOutlineBiotech,
  MdOpenInNew,
  MdPerson,
  MdCalendarToday,
  MdInfoOutline,
  MdMedication,
  MdOutlineMedicalInformation,
  MdSearch,
  MdSort,
  MdChevronLeft,
  MdChevronRight,
  MdFilterList,
  MdDownload,
} from "react-icons/md";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Separator } from "@/components/ui/separator";
import Molecule3DViewer from "../Molecule3DViewer";

export default function ResearchTab({ compound }) {
  const [literatureData, setLiteratureData] = useState(null);
  const [bioactivityData, setBioactivityData] = useState(null);
  const [classificationData, setClassificationData] = useState(null);
  const [interactionsData, setInteractionsData] = useState(null);
  const [loading, setLoading] = useState({
    literature: true,
    bioactivity: true,
    classification: true,
    interactions: true,
  });
  const [errors, setErrors] = useState({
    literature: null,
    bioactivity: null,
    classification: null,
    interactions: null,
  });
  const [activeTab, setActiveTab] = useState("publications");

  // State untuk pagination, pencarian, dan pengurutan publikasi
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("year");
  const [sortOrder, setSortOrder] = useState("desc");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);

  // Debounce search query
  useEffect(() => {
    if (searchTimeout) clearTimeout(searchTimeout);

    const timeout = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    setSearchTimeout(timeout);

    return () => {
      if (searchTimeout) clearTimeout(searchTimeout);
    };
  }, [searchQuery]);

  // Fungsi untuk fetch data dengan parameter yang diberikan
  const fetchLiteratureData = useCallback(
    async (options = {}) => {
      const {
        page = currentPage,
        itemsPerPage = perPage,
        query = debouncedSearchQuery,
        sort = sortBy,
        order = sortOrder,
        showLoading = true,
      } = options;

      try {
        if (showLoading) {
          setLoading((prev) => ({ ...prev, literature: true }));
        } else {
          setIsLoadingSearch(true);
        }

        // Bangun query parameters
        const params = new URLSearchParams({
          page,
          perPage: itemsPerPage,
          sortBy: sort,
          sortOrder: order,
        });

        if (query) {
          params.append("query", query);
        }

        const response = await axios.get(
          `/api/obat/literature/${compound.cid}?${params.toString()}`
        );

        setLiteratureData(response.data);
      } catch (err) {
        console.error("Error fetching literature data:", err);
        setErrors((prev) => ({
          ...prev,
          literature:
            err.response?.data?.error ||
            err.message ||
            "Failed to fetch literature data",
        }));
      } finally {
        if (showLoading) {
          setLoading((prev) => ({ ...prev, literature: false }));
        } else {
          setIsLoadingSearch(false);
        }
      }
    },
    [
      compound.cid,
      currentPage,
      perPage,
      debouncedSearchQuery,
      sortBy,
      sortOrder,
    ]
  );

  useEffect(() => {
    async function fetchAllData() {
      // Reset states
      setErrors({
        literature: null,
        bioactivity: null,
        classification: null,
        interactions: null,
      });

      // Fetch literature data
      fetchLiteratureData();

      // Fetch bioactivity data
      fetchBioactivityData();

      // Fetch classification data
      fetchClassificationData();

      // Fetch interactions data
      fetchInteractionsData();
    }

    async function fetchBioactivityData() {
      try {
        setLoading((prev) => ({ ...prev, bioactivity: true }));
        const response = await axios.get(
          `/api/obat/bioactivity/${compound.cid}`
        );
        setBioactivityData(response.data);
      } catch (err) {
        console.error("Error fetching bioactivity data:", err);
        setErrors((prev) => ({
          ...prev,
          bioactivity:
            err.response?.data?.error ||
            err.message ||
            "Failed to fetch bioactivity data",
        }));
      } finally {
        setLoading((prev) => ({ ...prev, bioactivity: false }));
      }
    }

    async function fetchClassificationData() {
      try {
        setLoading((prev) => ({ ...prev, classification: true }));
        const response = await axios.get(
          `/api/obat/classification/${compound.cid}`
        );
        setClassificationData(response.data);
      } catch (err) {
        console.error("Error fetching classification data:", err);
        setErrors((prev) => ({
          ...prev,
          classification:
            err.response?.data?.error ||
            err.message ||
            "Failed to fetch classification data",
        }));
      } finally {
        setLoading((prev) => ({ ...prev, classification: false }));
      }
    }

    async function fetchInteractionsData() {
      try {
        setLoading((prev) => ({ ...prev, interactions: true }));
        const response = await axios.get(
          `/api/obat/interactions/${compound.cid}`
        );
        setInteractionsData(response.data);
      } catch (err) {
        console.error("Error fetching interactions data:", err);
        setErrors((prev) => ({
          ...prev,
          interactions:
            err.response?.data?.error ||
            err.message ||
            "Failed to fetch interactions data",
        }));
      } finally {
        setLoading((prev) => ({ ...prev, interactions: false }));
      }
    }

    fetchAllData();
  }, [compound.cid, fetchLiteratureData]);

  // Effect untuk trigger fetch saat parameter berubah
  useEffect(() => {
    if (activeTab === "publications") {
      fetchLiteratureData({ showLoading: false });
    }
  }, [
    debouncedSearchQuery,
    sortBy,
    sortOrder,
    currentPage,
    perPage,
    fetchLiteratureData,
    activeTab,
  ]);

  // Handler untuk perubahan halaman
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handler untuk perubahan items per page
  const handlePerPageChange = (value) => {
    setPerPage(parseInt(value));
    setCurrentPage(1); // Reset ke halaman pertama saat mengubah jumlah per halaman
  };

  // Handler untuk reset pencarian
  const handleResetSearch = () => {
    setSearchQuery("");
    setDebouncedSearchQuery("");
    setCurrentPage(1);
  };

  // Handler untuk toggle arah pengurutan
  const handleToggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    setCurrentPage(1);
  };

  // Determine whether we should show the loading state for the entire component
  const isLoading = Object.values(loading).some((status) => status);

  // Check if we should show any global error (if all APIs failed)
  const allFailed = Object.values(errors).every((error) => error !== null);
  const anyFailed = Object.values(errors).some((error) => error !== null);

  if (isLoading && !activeTab) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full max-w-md" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (allFailed) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="inline-flex items-center justify-center rounded-full bg-red-100 p-4 mb-4">
            <MdOutlineWarning className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-slate-800">
            Terjadi Kesalahan
          </h3>
          <p className="text-slate-500 mt-2">Gagal memuat data penelitian</p>
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

  // Create a tab for interactions if available
  const hasDrugInteractions =
    interactionsData && interactionsData.hasInteractions;

  return (
    <div className="space-y-6">
      {/* Alert banner if some APIs failed but not all */}
      {anyFailed && !allFailed && (
        <Alert variant="warning" className="bg-amber-50 border-amber-200">
          <MdInfoOutline className="h-4 w-4 text-amber-700" />
          <AlertTitle className="text-amber-800">
            Beberapa data tidak dapat dimuat
          </AlertTitle>
          <AlertDescription className="text-amber-700 text-sm">
            Kami telah menampilkan data yang berhasil dimuat. Silakan coba muat
            ulang halaman jika Anda memerlukan data yang lengkap.
          </AlertDescription>
        </Alert>
      )}

      <Molecule3DViewer cid={compound.cid} />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="publications" className="flex items-center gap-1">
            <MdOutlineLibraryBooks className="h-4 w-4" />
            <span>Publikasi</span>
            {!loading.literature && literatureData?.publicationCount > 0 && (
              <Badge variant="secondary" className="ml-1.5 text-2xs h-5">
                {literatureData.publicationCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="bioactivity" className="flex items-center gap-1">
            <MdOutlineBiotech className="h-4 w-4" />
            <span>Bioaktivitas</span>
          </TabsTrigger>
          <TabsTrigger
            value="classification"
            className="flex items-center gap-1"
          >
            <MdOutlineScience className="h-4 w-4" />
            <span>Klasifikasi</span>
          </TabsTrigger>
          {hasDrugInteractions && (
            <TabsTrigger
              value="interactions"
              className="flex items-center gap-1"
            >
              <MdMedication className="h-4 w-4" />
              <span>Interaksi</span>
              {interactionsData.interactionCount > 0 && (
                <Badge variant="secondary" className="ml-1.5 text-2xs h-5">
                  {interactionsData.interactionCount}
                </Badge>
              )}
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="publications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-indigo-50 rounded-full">
                  <MdOutlineArticle className="text-indigo-600 h-5 w-5" />
                </div>
                <span>Publikasi & Literatur</span>
              </CardTitle>
              <CardDescription>
                Referensi ilmiah dan publikasi terkait {compound.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 relative">
              {/* Pencarian dan filter */}
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="relative flex-grow">
                  <MdSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                  <Input
                    type="text"
                    placeholder="Cari publikasi berdasarkan judul, penulis, atau jurnal..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <div className="flex gap-2">
                  <Select
                    value={sortBy}
                    onValueChange={(value) => {
                      setSortBy(value);
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Urutkan berdasarkan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="year">Tahun</SelectItem>
                      <SelectItem value="title">Judul</SelectItem>
                      <SelectItem value="journal">Jurnal</SelectItem>
                      <SelectItem value="authors">Penulis</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleToggleSortOrder}
                    title={
                      sortOrder === "asc" ? "Urutkan menurun" : "Urutkan menaik"
                    }
                    className="flex-shrink-0"
                  >
                    <MdSort
                      className={`h-4 w-4 ${sortOrder === "asc" ? "transform rotate-180" : ""}`}
                    />
                  </Button>
                </div>
              </div>

              {errors.literature ? (
                <Alert variant="destructive" className="mb-4">
                  <MdOutlineWarning className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{errors.literature}</AlertDescription>
                </Alert>
              ) : loading.literature ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
                  <p className="text-slate-500">Memuat publikasi...</p>
                </div>
              ) : literatureData?.publications &&
                literatureData.publications.length > 0 ? (
                <>
                  {/* Status pencarian atau loading */}
                  <div className="flex flex-col sm:flex-row justify-between items-center">
                    {literatureData.search && literatureData.search.query && (
                      <div className="text-sm text-slate-500 mb-2">
                        Ditemukan{" "}
                        <span className="font-medium">
                          {literatureData.filteredCount}
                        </span>{" "}
                        dari {literatureData.publicationCount} publikasi untuk
                        pencarian "{literatureData.search.query}"
                      </div>
                    )}
                    {!literatureData.search?.query && (
                      <div className="text-sm text-slate-500 mb-2">
                        Total publikasi:{" "}
                        <span className="font-medium">
                          {literatureData.publicationCount}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Overlay loading untuk pencarian */}
                  {isLoadingSearch && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10 rounded-md">
                      <div className="bg-white/80 p-4 rounded-lg shadow-sm flex items-center gap-3">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-indigo-500 border-t-transparent"></div>
                        <span className="text-slate-700">Mencari...</span>
                      </div>
                    </div>
                  )}

                  {/* Daftar publikasi */}
                  <div className="space-y-3">
                    {literatureData.publications.map((pub, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-white border border-slate-200 rounded-lg hover:border-indigo-200 transition-colors"
                      >
                        <a
                          href={pub.url}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="font-medium text-indigo-600 hover:underline flex items-start gap-1 mb-2"
                        >
                          <span>{pub.title}</span>
                          <MdOpenInNew className="flex-shrink-0 h-4 w-4 mt-0.5" />
                        </a>

                        <div className="flex flex-wrap text-xs text-slate-500 gap-4 mt-1">
                          <div className="flex items-center gap-1">
                            <MdPerson className="h-3 w-3" />
                            <span>{pub.authors}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MdOutlineBook className="h-3 w-3" />
                            <span>{pub.journal}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MdCalendarToday className="h-3 w-3" />
                            <span>{pub.year}</span>
                          </div>
                        </div>

                        <div className="mt-2">
                          <Badge variant="outline" className="text-xs">
                            PMID: {pub.pmid}
                          </Badge>
                          {pub.abstract && (
                            <details className="mt-2">
                              <summary className="text-xs text-indigo-600 cursor-pointer">
                                Lihat Abstrak
                              </summary>
                              <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-3 rounded-md">
                                {pub.abstract}
                              </p>
                            </details>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer pagination */}
                  <Separator className="my-4" />

                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    {/* Items per page selector */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-500">Tampilkan:</span>
                      <Select
                        value={perPage.toString()}
                        onValueChange={handlePerPageChange}
                      >
                        <SelectTrigger className="w-[80px] h-8">
                          <SelectValue placeholder={perPage} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5</SelectItem>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="20">20</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                          <SelectItem value="100">100</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Pagination info */}
                    {literatureData.pagination &&
                      literatureData.filteredCount > 0 && (
                        <div className="text-sm text-slate-500">
                          Halaman {literatureData.pagination.currentPage} dari{" "}
                          {literatureData.pagination.totalPages || 1}
                          <span className="mx-1">•</span>
                          Menampilkan{" "}
                          {(literatureData.pagination.currentPage - 1) *
                            perPage +
                            1}{" "}
                          -{" "}
                          {Math.min(
                            literatureData.pagination.currentPage * perPage,
                            literatureData.filteredCount
                          )}{" "}
                          dari {literatureData.filteredCount} hasil
                        </div>
                      )}
                  </div>

                  {/* ShadCN Pagination */}
                  {literatureData.pagination &&
                    literatureData.pagination.totalPages > 1 && (
                      <Pagination className="mt-4">
                        <PaginationContent>
                          {/* Previous button */}
                          <PaginationItem>
                            <PaginationPrevious
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                if (literatureData.pagination.hasPrevPage) {
                                  handlePageChange(
                                    literatureData.pagination.currentPage - 1
                                  );
                                }
                              }}
                              className={
                                !literatureData.pagination.hasPrevPage
                                  ? "pointer-events-none opacity-50"
                                  : ""
                              }
                            />
                          </PaginationItem>

                          {/* Generate pagination items */}
                          {generatePaginationItems(
                            literatureData.pagination.currentPage,
                            literatureData.pagination.totalPages
                          ).map((item, index) => (
                            <PaginationItem key={index}>
                              {item === "ellipsis" ? (
                                <PaginationEllipsis />
                              ) : (
                                <PaginationLink
                                  href="#"
                                  isActive={
                                    item ===
                                    literatureData.pagination.currentPage
                                  }
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handlePageChange(item);
                                  }}
                                >
                                  {item}
                                </PaginationLink>
                              )}
                            </PaginationItem>
                          ))}

                          {/* Next button */}
                          <PaginationItem>
                            <PaginationNext
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                if (literatureData.pagination.hasNextPage) {
                                  handlePageChange(
                                    literatureData.pagination.currentPage + 1
                                  );
                                }
                              }}
                              className={
                                !literatureData.pagination.hasNextPage
                                  ? "pointer-events-none opacity-50"
                                  : ""
                              }
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    )}

                  {/* Actions and external links */}
                  <div className="flex flex-wrap justify-center gap-2 mt-6">
                    {searchQuery && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleResetSearch}
                        className="flex items-center gap-1"
                      >
                        <MdFilterList className="h-4 w-4" />
                        <span>Hapus Pencarian</span>
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        window.open(
                          `https://pubchem.ncbi.nlm.nih.gov/compound/${compound.cid}#section=Literature`,
                          "_blank"
                        )
                      }
                      className="flex items-center gap-1"
                    >
                      <MdOpenInNew className="h-4 w-4" />
                      <span>Lihat di PubChem</span>
                    </Button>

                    {literatureData.publicationCount > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          window.open(
                            `/api/obat/literature/${compound.cid}?all=true&download=true`,
                            "_blank"
                          )
                        }
                        className="flex items-center gap-1"
                      >
                        <MdDownload className="h-4 w-4" />
                        <span>Unduh Semua Publikasi</span>
                      </Button>
                    )}
                  </div>
                </>
              ) : (
                <div className="p-8 text-center">
                  <div className="inline-flex items-center justify-center rounded-full bg-slate-100 p-4 mb-4">
                    <MdOutlineLibraryBooks className="h-6 w-6 text-slate-500" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-800">
                    {searchQuery
                      ? "Tidak Ditemukan Hasil"
                      : "Tidak Ada Publikasi"}
                  </h3>
                  <p className="text-slate-500 max-w-md mx-auto">
                    {searchQuery
                      ? `Tidak ditemukan publikasi yang sesuai dengan pencarian "${searchQuery}"`
                      : `Tidak ditemukan publikasi ilmiah yang terkait dengan ${compound.name}`}
                  </p>
                  {searchQuery && (
                    <Button
                      variant="outline"
                      onClick={handleResetSearch}
                      className="mt-4"
                    >
                      Hapus Pencarian
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bioactivity">
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
              {errors.bioactivity ? (
                <Alert variant="destructive" className="mb-4">
                  <MdOutlineWarning className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{errors.bioactivity}</AlertDescription>
                </Alert>
              ) : loading.bioactivity ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Skeleton className="h-20 w-20 rounded-full mb-4" />
                  <Skeleton className="h-4 w-40 mb-2" />
                  <Skeleton className="h-4 w-60" />
                </div>
              ) : bioactivityData?.hasBioactivityData &&
                (bioactivityData?.bioactivity?.activeAssayCount > 0 ||
                  bioactivityData?.bioactivity?.totalAssayCount > 0) ? (
                <div className="space-y-6">
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

                  {bioactivityData.bioactivity.bioactiveSummary && (
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <p className="text-sm text-slate-700">
                        {bioactivityData.bioactivity.bioactiveSummary}
                      </p>
                    </div>
                  )}

                  {bioactivityData.bioactivity.targets &&
                    bioactivityData.bioactivity.targets.length > 0 && (
                      <div>
                        <h3 className="font-medium text-slate-700 mb-3">
                          Target Protein Utama
                        </h3>

                        <div className="overflow-auto border border-slate-200 rounded-lg">
                          <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                              <tr>
                                <th className="px-3 py-2 text-xs font-medium text-slate-600 text-left">
                                  Target
                                </th>
                                <th className="px-3 py-2 text-xs font-medium text-slate-600 text-left">
                                  Gene ID
                                </th>
                                <th className="px-3 py-2 text-xs font-medium text-slate-600 text-left">
                                  Pengujian Aktif
                                </th>
                                <th className="px-3 py-2 text-xs font-medium text-slate-600 text-left">
                                  Aktivitas
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                              {bioactivityData.bioactivity.targets.map(
                                (target, idx) => (
                                  <tr key={idx} className="hover:bg-slate-50">
                                    <td className="px-3 py-2 text-xs text-slate-800">
                                      {target.geneSymbol ? (
                                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-none">
                                          {target.geneSymbol}
                                        </Badge>
                                      ) : null}
                                      <div className="text-xs mt-1">
                                        {target.name}
                                      </div>
                                    </td>
                                    <td className="px-3 py-2 text-xs text-slate-600">
                                      {target.geneID || "-"}
                                    </td>
                                    <td className="px-3 py-2 text-xs text-slate-600">
                                      {target.activeAssayCount || 0} /{" "}
                                      {target.totalAssayCount || 0}
                                    </td>
                                    <td className="px-3 py-2">
                                      {target.activityValue ? (
                                        <Badge
                                          variant="outline"
                                          className="bg-green-50 text-green-700"
                                        >
                                          {target.activityType || "uM"}:{" "}
                                          {target.activityValue}
                                        </Badge>
                                      ) : (
                                        <span className="text-xs text-slate-500">
                                          -
                                        </span>
                                      )}
                                    </td>
                                  </tr>
                                )
                              )}
                            </tbody>
                          </table>
                        </div>

                        <div className="text-center mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              window.open(
                                `https://pubchem.ncbi.nlm.nih.gov/compound/${compound.cid}#section=BioAssay-Results`,
                                "_blank"
                              )
                            }
                          >
                            Lihat Data Bioaktivitas Lengkap
                          </Button>
                        </div>
                      </div>
                    )}

                  {bioactivityData.bioactivity.assays &&
                    bioactivityData.bioactivity.assays.length > 0 && (
                      <div>
                        <h3 className="font-medium text-slate-700 mb-3">
                          Ringkasan Pengujian (Assay)
                        </h3>
                        <div className="text-xs text-slate-500 mb-2">
                          Menampilkan{" "}
                          {bioactivityData.bioactivity.assays.length} dari{" "}
                          {bioactivityData.bioactivity.totalAssayCount}{" "}
                          pengujian
                        </div>

                        <div className="overflow-auto border border-slate-200 rounded-lg max-h-[300px]">
                          <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50 sticky top-0">
                              <tr>
                                <th className="px-3 py-2 text-xs font-medium text-slate-600 text-left">
                                  AID
                                </th>
                                <th className="px-3 py-2 text-xs font-medium text-slate-600 text-left">
                                  Hasil
                                </th>
                                {bioactivityData.bioactivity.assays[0][
                                  "Assay Name"
                                ] && (
                                  <th className="px-3 py-2 text-xs font-medium text-slate-600 text-left">
                                    Nama Assay
                                  </th>
                                )}
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                              {bioactivityData.bioactivity.assays.map(
                                (assay, idx) => (
                                  <tr key={idx} className="hover:bg-slate-50">
                                    <td className="px-3 py-2 text-xs text-slate-600">
                                      {assay.AID || assay.aid || "-"}
                                    </td>
                                    <td className="px-3 py-2">
                                      {assay["Activity Outcome"] ||
                                      assay.activity ? (
                                        <Badge
                                          variant="outline"
                                          className={
                                            (
                                              assay["Activity Outcome"] ||
                                              assay.activity
                                            )
                                              .toLowerCase()
                                              .includes("active")
                                              ? "bg-green-50 text-green-700"
                                              : "bg-slate-50 text-slate-700"
                                          }
                                        >
                                          {assay["Activity Outcome"] ||
                                            assay.activity}
                                        </Badge>
                                      ) : (
                                        <span className="text-xs text-slate-500">
                                          -
                                        </span>
                                      )}
                                    </td>
                                    {bioactivityData.bioactivity.assays[0][
                                      "Assay Name"
                                    ] && (
                                      <td className="px-3 py-2 text-xs text-slate-800">
                                        {assay["Assay Name"] || "-"}
                                      </td>
                                    )}
                                  </tr>
                                )
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                  {/* Show original data if available for debugging */}
                  {bioactivityData.bioactivity.originalData &&
                    process.env.NODE_ENV === "development" && (
                      <details className="mt-8 border p-2 rounded text-xs">
                        <summary className="cursor-pointer text-slate-500">
                          Raw data (development only)
                        </summary>
                        <pre className="mt-2 bg-slate-50 p-4 rounded overflow-auto max-h-[400px]">
                          {JSON.stringify(
                            bioactivityData.bioactivity.originalData,
                            null,
                            2
                          )}
                        </pre>
                      </details>
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
        </TabsContent>

        <TabsContent value="classification">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 rounded-full">
                  <MdOutlineScience className="text-blue-600 h-5 w-5" />
                </div>
                <span>Klasifikasi & Interaksi Enzim</span>
              </CardTitle>
              <CardDescription>
                Klasifikasi obat dan interaksi dengan enzim
              </CardDescription>
            </CardHeader>
            <CardContent>
              {errors.classification ? (
                <Alert variant="destructive" className="mb-4">
                  <MdOutlineWarning className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{errors.classification}</AlertDescription>
                </Alert>
              ) : loading.classification ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Skeleton className="h-20 w-20 rounded-full mb-4" />
                  <Skeleton className="h-4 w-40 mb-2" />
                  <Skeleton className="h-4 w-60" />
                </div>
              ) : classificationData ? (
                <div className="space-y-6">
                  {/* Klasifikasi Obat */}
                  {classificationData.drugClassifications &&
                    classificationData.drugClassifications.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="font-medium text-slate-700 border-b pb-1">
                          Klasifikasi Obat
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {classificationData.drugClassifications.map(
                            (cls, idx) => (
                              <Badge
                                key={idx}
                                className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200"
                              >
                                {cls.value}
                              </Badge>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  {/* ATC Codes */}
                  {classificationData.atcCodes &&
                    classificationData.atcCodes.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="font-medium text-slate-700 border-b pb-1">
                          Kode ATC (WHO)
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {classificationData.atcCodes.map((atc, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="bg-white"
                            >
                              {atc.code}
                              {atc.description && (
                                <span className="ml-1 text-slate-500">
                                  ({atc.description})
                                </span>
                              )}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Interaksi Enzim */}
                  {classificationData.enzymes &&
                    classificationData.enzymes.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="font-medium text-slate-700 border-b pb-1">
                          Interaksi Enzim
                        </h3>
                        {classificationData.enzymes.map((enz, idx) => (
                          <div
                            key={idx}
                            className="p-3 bg-slate-50 rounded-lg border border-slate-200"
                          >
                            <div className="font-medium text-sm text-slate-700">
                              {enz.name}
                            </div>
                            <div className="text-xs text-slate-600 mt-1">
                              {enz.interaction}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                  {/* Pathways */}
                  {classificationData.pathways &&
                    classificationData.pathways.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="font-medium text-slate-700 border-b pb-1">
                          Jalur Metabolisme
                        </h3>
                        {classificationData.pathways.map((pathway, idx) => (
                          <div
                            key={idx}
                            className="p-3 bg-slate-50 rounded-lg border border-slate-200"
                          >
                            <div className="font-medium text-sm text-slate-700">
                              {pathway.name}
                            </div>
                            <div className="text-xs text-slate-600 mt-1">
                              {pathway.description}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                  {/* Diseases */}
                  {classificationData.diseases &&
                    classificationData.diseases.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="font-medium text-slate-700 border-b pb-1">
                          Penyakit Terkait
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {classificationData.diseases.map((disease, idx) => (
                            <Badge
                              key={idx}
                              className="bg-amber-100 text-amber-800"
                            >
                              {disease.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Show message if no data in any category */}
                  {(!classificationData.hasClassificationData ||
                    classificationData.drugClassifications.length === 0) &&
                    (!classificationData.hasAtcCodes ||
                      classificationData.atcCodes.length === 0) &&
                    (!classificationData.hasEnzymeData ||
                      classificationData.enzymes.length === 0) &&
                    (!classificationData.hasPathwayData ||
                      classificationData.pathways.length === 0) &&
                    (!classificationData.hasDiseaseData ||
                      classificationData.diseases.length === 0) && (
                      <div className="p-4 text-center">
                        <p className="text-slate-500">
                          Tidak ada data klasifikasi tersedia untuk{" "}
                          {compound.name}
                        </p>
                      </div>
                    )}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className="inline-flex items-center justify-center rounded-full bg-slate-100 p-4 mb-4">
                    <MdOutlineScience className="h-6 w-6 text-slate-500" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-800">
                    Tidak Ada Data Klasifikasi
                  </h3>
                  <p className="text-slate-500 max-w-md mx-auto">
                    Tidak ditemukan data klasifikasi untuk {compound.name}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {hasDrugInteractions && (
          <TabsContent value="interactions">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 bg-amber-50 rounded-full">
                    <MdOutlineMedicalInformation className="text-amber-600 h-5 w-5" />
                  </div>
                  <span>Interaksi Obat</span>
                </CardTitle>
                <CardDescription>
                  Interaksi {compound.name} dengan obat-obatan lain
                </CardDescription>
              </CardHeader>
              <CardContent>
                {errors.interactions ? (
                  <Alert variant="destructive" className="mb-4">
                    <MdOutlineWarning className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{errors.interactions}</AlertDescription>
                  </Alert>
                ) : loading.interactions ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <Skeleton className="h-20 w-20 rounded-full mb-4" />
                    <Skeleton className="h-4 w-40 mb-2" />
                    <Skeleton className="h-4 w-60" />
                  </div>
                ) : interactionsData && interactionsData.hasInteractions ? (
                  <div className="space-y-4">
                    {interactionsData.drugbankId && (
                      <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                        <p className="text-sm text-indigo-800">
                          <strong>DrugBank ID:</strong>{" "}
                          {interactionsData.drugbankId}
                        </p>
                      </div>
                    )}

                    <div className="space-y-3">
                      {interactionsData.interactions.map((interaction, idx) => (
                        <div
                          key={idx}
                          className="border rounded-lg overflow-hidden"
                        >
                          <div
                            className={`p-3 ${
                              interaction.severity === "high"
                                ? "bg-red-50 border-b border-red-100"
                                : interaction.severity === "moderate"
                                  ? "bg-amber-50 border-b border-amber-100"
                                  : "bg-slate-50 border-b border-slate-100"
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <h4
                                className={`font-medium ${
                                  interaction.severity === "high"
                                    ? "text-red-800"
                                    : interaction.severity === "moderate"
                                      ? "text-amber-800"
                                      : "text-slate-800"
                                }`}
                              >
                                {interaction.title}
                              </h4>
                              {interaction.severity && (
                                <Badge
                                  className={`
                                  ${
                                    interaction.severity === "high"
                                      ? "bg-red-100 text-red-800 border-red-200"
                                      : interaction.severity === "moderate"
                                        ? "bg-amber-100 text-amber-800 border-amber-200"
                                        : interaction.severity === "low"
                                          ? "bg-green-100 text-green-800 border-green-200"
                                          : "bg-slate-100 text-slate-800 border-slate-200"
                                  }
                                `}
                                >
                                  {interaction.severity === "high"
                                    ? "Tinggi"
                                    : interaction.severity === "moderate"
                                      ? "Sedang"
                                      : interaction.severity === "low"
                                        ? "Rendah"
                                        : "Tidak diketahui"}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="p-3 bg-white">
                            <p className="text-sm text-slate-700">
                              {interaction.description}
                            </p>
                            {interaction.source && (
                              <p className="text-xs text-slate-500 mt-2">
                                Sumber: {interaction.source}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="text-center mt-6">
                      <div className="bg-amber-50 p-4 rounded-lg inline-block border border-amber-200">
                        <p className="text-sm text-amber-800">
                          <strong>Perhatian:</strong> Informasi ini tidak
                          menggantikan saran medis profesional. Selalu
                          konsultasikan dengan dokter atau apoteker sebelum
                          mengubah pengobatan.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <div className="inline-flex items-center justify-center rounded-full bg-slate-100 p-4 mb-4">
                      <MdOutlineMedicalInformation className="h-6 w-6 text-slate-500" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-800">
                      Tidak Ada Data Interaksi
                    </h3>
                    <p className="text-slate-500 max-w-md mx-auto">
                      Tidak ditemukan data interaksi obat untuk {compound.name}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
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
