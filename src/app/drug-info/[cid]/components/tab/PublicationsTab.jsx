import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  MdSearch,
  MdSort,
  MdOutlineWarning,
  MdOpenInNew,
  MdPerson,
  MdOutlineBook,
  MdCalendarToday,
  MdFilterList,
  MdOutlineArticle,
  MdOutlineLibraryBooks,
  MdKeyboardArrowDown,
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
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PublicationsTab({ compound }) {
  const [literatureData, setLiteratureData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("year");
  const [sortOrder, setSortOrder] = useState("desc");
  const [perPage, setPerPage] = useState(10);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);

  const fetchLiteratureData = useCallback(
    async (options = {}) => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        params.append("page", options.page || currentPage);
        params.append("pageSize", options.perPage || perPage);
        params.append("sortBy", options.sortBy || sortBy);
        params.append("sortOrder", options.sortOrder || sortOrder);

        if (options.search) {
          params.append("search", options.search);
        }

        const response = await axios.get(
          `/api/obat/literature/${compound.cid}?${params.toString()}`
        );
        setLiteratureData(response.data);
      } catch (err) {
        console.error("Error fetching literature data:", err);
        setError(
          err.response?.data?.error ||
            err.message ||
            "Failed to fetch literature data"
        );
      } finally {
        setLoading(false);
        if (options.isSearch) {
          setIsLoadingSearch(false);
        }
      }
    },
    [compound.cid, currentPage, perPage, sortBy, sortOrder]
  );

  useEffect(() => {
    fetchLiteratureData();
  }, [fetchLiteratureData]);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    setIsLoadingSearch(true);
    setCurrentPage(1);
    fetchLiteratureData({
      search: searchQuery,
      page: 1,
      isSearch: true,
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchLiteratureData({ page });

    // Scroll to top of results on mobile when changing page
    if (window.innerWidth < 640) {
      document.getElementById("publications-results")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleResetSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
    fetchLiteratureData({
      search: "",
      page: 1,
    });
  };

  const handleToggleSortOrder = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);
    fetchLiteratureData({ sortOrder: newSortOrder });
  };

  const handlePerPageChange = (value) => {
    const newPerPage = parseInt(value);
    setPerPage(newPerPage);
    setCurrentPage(1);
    fetchLiteratureData({ perPage: newPerPage, page: 1 });
  };

  // Helper function to generate pagination items
  function generatePaginationItems(currentPage, totalPages) {
    // For mobile view with limited space, show fewer items
    if (window.innerWidth < 640) {
      return generateMobilePaginationItems(currentPage, totalPages);
    }

    // For larger screens
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, 5, "ellipsis", totalPages];
    }

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

  function generateMobilePaginationItems(currentPage, totalPages) {
    // Simplified pagination for mobile
    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage === 1) {
      return [1, 2, "ellipsis", totalPages];
    }

    if (currentPage === totalPages) {
      return [1, "ellipsis", totalPages - 1, totalPages];
    }

    return [1, "ellipsis", currentPage, "ellipsis", totalPages];
  }

  // Format author names for better display
  const formatAuthors = (authors) => {
    if (!authors) return "-";

    // For mobile, limit to first author + "et al" if multiple
    if (window.innerWidth < 640 && authors.includes(",")) {
      const firstAuthor = authors.split(",")[0];
      return `${firstAuthor} et al.`;
    }

    // For tablet, show more but still limit
    if (window.innerWidth < 1024 && authors.length > 50) {
      return authors.substring(0, 50) + "...";
    }

    return authors;
  };

  return (
    <Card>
      <CardHeader className="sm:pb-4 pb-3">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <div className="p-1.5 sm:p-2 bg-indigo-50 rounded-full">
            <MdOutlineArticle className="text-indigo-600 h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <span>Publikasi & Literatur</span>
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Referensi ilmiah dan publikasi terkait {compound.name}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 relative px-3 sm:px-6">
        {/* Pencarian dan filter */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <div className="relative flex-grow flex">
            <div className="relative flex-grow">
              <MdSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                type="text"
                placeholder="Cari publikasi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-8 rounded-r-none text-sm h-9 sm:h-10"
              />
            </div>
            <Button
              className="rounded-l-none px-2 sm:px-3 h-9 sm:h-10"
              onClick={handleSearch}
              disabled={isLoadingSearch}
            >
              {isLoadingSearch ? (
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <span className="sm:inline hidden">Cari</span>
              )}
              {!isLoadingSearch && <MdSearch className="h-4 w-4 sm:hidden" />}
            </Button>
          </div>
          <div className="flex gap-1 sm:gap-2">
            <Select
              value={sortBy}
              onValueChange={(value) => {
                setSortBy(value);
                setCurrentPage(1);
                fetchLiteratureData({ sortBy: value, page: 1 });
              }}
            >
              <SelectTrigger className="w-[120px] sm:w-[130px] h-9 sm:h-10 text-xs sm:text-sm">
                <SelectValue placeholder="Urutkan" />
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
              title={sortOrder === "asc" ? "Urutkan menurun" : "Urutkan menaik"}
              className="flex-shrink-0 h-9 sm:h-10 w-9 sm:w-10"
            >
              <MdSort
                className={`h-4 w-4 ${sortOrder === "asc" ? "transform rotate-180" : ""}`}
              />
            </Button>
          </div>
        </div>

        <div id="publications-results">
          {error ? (
            <Alert variant="destructive" className="mb-4 text-xs sm:text-sm">
              <MdOutlineWarning className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : loading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-2 border-b-2 border-indigo-500 mb-4"></div>
              <p className="text-slate-500 text-sm">Memuat publikasi...</p>
            </div>
          ) : literatureData?.publications &&
            literatureData.publications.length > 0 ? (
            <>
              {/* Status pencarian atau loading */}
              <div className="flex justify-between items-center">
                {literatureData.search?.query ? (
                  <div className="text-xs sm:text-sm text-slate-500 mb-2">
                    <span className="font-medium">
                      {literatureData.filteredCount}
                    </span>{" "}
                    hasil untuk "{literatureData.search.query}"
                  </div>
                ) : (
                  <div className="text-xs sm:text-sm text-slate-500 mb-2">
                    Total:{" "}
                    <span className="font-medium">
                      {literatureData.publicationCount}
                    </span>
                  </div>
                )}
              </div>
              {/* Overlay loading */}
              {isLoadingSearch && (
                <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10 rounded-md">
                  <div className="bg-white/80 p-3 sm:p-4 rounded-lg shadow-sm flex items-center gap-3">
                    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-indigo-500 border-t-transparent"></div>
                    <span className="text-slate-700 text-sm">Mencari...</span>
                  </div>
                </div>
              )}
              {/* Daftar publikasi */}
              <div className="space-y-2 sm:space-y-3">
                {literatureData.publications.map((pub, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 sm:p-3 bg-white border border-slate-200 rounded-lg hover:border-indigo-200 transition-colors"
                  >
                    <a
                      href={pub.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="font-medium text-indigo-600 hover:underline flex items-start gap-1 text-sm sm:text-base"
                    >
                      <span>{pub.title}</span>
                      <MdOpenInNew className="flex-shrink-0 h-3 w-3 sm:h-4 sm:w-4 mt-1" />
                    </a>

                    <div className="flex flex-wrap text-[10px] sm:text-xs text-slate-500 gap-2 sm:gap-4 mt-1.5 sm:mt-2">
                      <div className="flex items-center gap-0.5 sm:gap-1">
                        <MdPerson className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                        <span>{formatAuthors(pub.authors)}</span>
                      </div>
                      <div className="flex items-center gap-0.5 sm:gap-1">
                        <MdOutlineBook className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                        <span className="truncate max-w-[100px] sm:max-w-[150px]">
                          {pub.journal}
                        </span>
                      </div>
                      <div className="flex items-center gap-0.5 sm:gap-1">
                        <MdCalendarToday className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                        <span>{pub.year}</span>
                      </div>
                    </div>

                    <div className="mt-2">
                      <Badge
                        variant="outline"
                        className="text-[9px] sm:text-xs px-1 sm:px-1.5"
                      >
                        PMID: {pub.pmid}
                      </Badge>
                      {pub.abstract && (
                        <details className="mt-2 text-[10px] sm:text-xs group">
                          <summary className="text-indigo-600 cursor-pointer flex items-center">
                            <span>Lihat Abstrak</span>
                            <MdKeyboardArrowDown className="h-3 w-3 ml-0.5 transition-transform group-open:rotate-180" />
                          </summary>
                          <p className="text-slate-600 mt-2 bg-slate-50 p-2 sm:p-3 rounded-md leading-relaxed">
                            {pub.abstract}
                          </p>
                        </details>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {literatureData.pagination &&
                literatureData.pagination.totalPages > 1 && (
                  <Pagination className="mt-3 sm:mt-4">
                    <PaginationContent className="flex flex-wrap justify-center gap-1 md:gap-0">
                      {/* Previous Button - Selalu ditampilkan */}
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
                          className={`${
                            !literatureData.pagination.hasPrevPage
                              ? "pointer-events-none opacity-50"
                              : ""
                          } h-8 sm:h-9 text-xs sm:text-sm py-1 px-1.5 sm:px-3`}
                        />
                      </PaginationItem>

                      {/* First Page - Selalu tampilkan */}
                      {literatureData.pagination.currentPage > 2 &&
                        literatureData.pagination.totalPages > 3 && (
                          <PaginationItem>
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(1);
                              }}
                              className="h-8 sm:h-9 w-8 sm:w-9 text-xs sm:text-sm"
                            >
                              1
                            </PaginationLink>
                          </PaginationItem>
                        )}

                      {/* Ellipsis Awal - Tampilkan jika halaman saat ini > 3 */}
                      {literatureData.pagination.currentPage > 3 &&
                        literatureData.pagination.totalPages > 4 && (
                          <PaginationItem>
                            <PaginationEllipsis className="h-8 sm:h-9" />
                          </PaginationItem>
                        )}

                      {/* Previous Page - Ditampilkan di tablet & desktop, disembunyikan di mobile jika perlu */}
                      {literatureData.pagination.currentPage > 1 && (
                        <PaginationItem
                          className={
                            literatureData.pagination.totalPages > 5
                              ? "hidden sm:block"
                              : ""
                          }
                        >
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(
                                literatureData.pagination.currentPage - 1
                              );
                            }}
                            className="h-8 sm:h-9 w-8 sm:w-9 text-xs sm:text-sm"
                          >
                            {literatureData.pagination.currentPage - 1}
                          </PaginationLink>
                        </PaginationItem>
                      )}

                      {/* Current Page - Selalu ditampilkan */}
                      <PaginationItem>
                        <PaginationLink
                          href="#"
                          isActive={true}
                          className="h-8 sm:h-9 w-8 sm:w-9 text-xs sm:text-sm"
                        >
                          {literatureData.pagination.currentPage}
                        </PaginationLink>
                      </PaginationItem>

                      {/* Next Page - Ditampilkan di tablet & desktop, disembunyikan di mobile jika perlu */}
                      {literatureData.pagination.currentPage <
                        literatureData.pagination.totalPages && (
                        <PaginationItem
                          className={
                            literatureData.pagination.totalPages > 5
                              ? "hidden sm:block"
                              : ""
                          }
                        >
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(
                                literatureData.pagination.currentPage + 1
                              );
                            }}
                            className="h-8 sm:h-9 w-8 sm:w-9 text-xs sm:text-sm"
                          >
                            {literatureData.pagination.currentPage + 1}
                          </PaginationLink>
                        </PaginationItem>
                      )}

                      {/* Ellipsis Akhir - Tampilkan jika total halaman - halaman saat ini > 2 */}
                      {literatureData.pagination.totalPages -
                        literatureData.pagination.currentPage >
                        2 &&
                        literatureData.pagination.totalPages > 4 && (
                          <PaginationItem>
                            <PaginationEllipsis className="h-8 sm:h-9" />
                          </PaginationItem>
                        )}

                      {/* Last Page - Selalu tampilkan jika tidak berada di halaman terakhir atau sebelum terakhir */}
                      {literatureData.pagination.currentPage <
                        literatureData.pagination.totalPages - 1 &&
                        literatureData.pagination.totalPages > 3 && (
                          <PaginationItem>
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(
                                  literatureData.pagination.totalPages
                                );
                              }}
                              className="h-8 sm:h-9 w-8 sm:w-9 text-xs sm:text-sm"
                            >
                              {literatureData.pagination.totalPages}
                            </PaginationLink>
                          </PaginationItem>
                        )}

                      {/* Next Button - Selalu ditampilkan */}
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
                          className={`${
                            !literatureData.pagination.hasNextPage
                              ? "pointer-events-none opacity-50"
                              : ""
                          } h-8 sm:h-9 text-xs sm:text-sm py-1 px-1.5 sm:px-3`}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              {/* Reset search button */}
              {searchQuery && (
                <div className="flex justify-center mt-4 sm:mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleResetSearch}
                    className="flex items-center gap-1 text-xs h-8 sm:h-9"
                  >
                    <MdFilterList className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>Hapus Pencarian</span>
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="p-4 sm:p-8 text-center">
              <div className="inline-flex items-center justify-center rounded-full bg-slate-100 p-3 sm:p-4 mb-3 sm:mb-4">
                <MdOutlineLibraryBooks className="h-5 w-5 sm:h-6 sm:w-6 text-slate-500" />
              </div>
              <h3 className="text-base sm:text-lg font-medium text-slate-800">
                {searchQuery ? "Tidak Ditemukan Hasil" : "Tidak Ada Publikasi"}
              </h3>
              <p className="text-slate-500 max-w-md mx-auto text-xs sm:text-sm mt-1 sm:mt-2">
                {searchQuery
                  ? `Tidak ditemukan publikasi yang sesuai dengan pencarian "${searchQuery}"`
                  : `Tidak ditemukan publikasi ilmiah yang terkait dengan ${compound.name}`}
              </p>
              {searchQuery && (
                <Button
                  variant="outline"
                  onClick={handleResetSearch}
                  className="mt-3 sm:mt-4 text-xs sm:text-sm h-8 sm:h-9"
                >
                  Hapus Pencarian
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
