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
    // If total pages <= 7, display all pages
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // If current page is near start
    if (currentPage <= 3) {
      return [1, 2, 3, 4, 5, "ellipsis", totalPages];
    }

    // If current page is near end
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

    // If current page is in middle
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

  return (
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
          <div className="relative flex-grow flex">
            <div className="relative flex-grow">
              <MdSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                type="text"
                placeholder="Cari publikasi berdasarkan judul, penulis, atau jurnal..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-8 rounded-r-none"
              />
            </div>
            <Button
              className="rounded-l-none"
              onClick={handleSearch}
              disabled={isLoadingSearch}
            >
              {isLoadingSearch ? (
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                "Cari"
              )}
            </Button>
          </div>
          <div className="flex gap-2">
            <Select
              value={sortBy}
              onValueChange={(value) => {
                setSortBy(value);
                setCurrentPage(1);
                fetchLiteratureData({ sortBy: value, page: 1 });
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
              title={sortOrder === "asc" ? "Urutkan menurun" : "Urutkan menaik"}
              className="flex-shrink-0"
            >
              <MdSort
                className={`h-4 w-4 ${sortOrder === "asc" ? "transform rotate-180" : ""}`}
              />
            </Button>
          </div>
        </div>

        {error ? (
          <Alert variant="destructive" className="mb-4">
            <MdOutlineWarning className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : loading ? (
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
                    {(literatureData.pagination.currentPage - 1) * perPage +
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
                              item === literatureData.pagination.currentPage
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
            </div>
          </>
        ) : (
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center rounded-full bg-slate-100 p-4 mb-4">
              <MdOutlineLibraryBooks className="h-6 w-6 text-slate-500" />
            </div>
            <h3 className="text-lg font-medium text-slate-800">
              {searchQuery ? "Tidak Ditemukan Hasil" : "Tidak Ada Publikasi"}
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
  );
}
