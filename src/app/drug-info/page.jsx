"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import {
  MdOutlineSearch,
  MdOutlineMedication,
  MdHistory,
  MdKeyboardArrowRight,
  MdRefresh,
  MdInfoOutline,
  MdOutlineMedicalServices,
  MdOutlineLocalPharmacy,
} from "react-icons/md";

// ShadCN UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

export default function DrugInfoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const querySearch = searchParams.get("search") || "";
  
  const [searchTerm, setSearchTerm] = useState(querySearch);
  const [isSearchSubmitted, setIsSearchSubmitted] = useState(!!querySearch);
  const [drugs, setDrugs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    // Load recently viewed drugs from localStorage
    const storedRecents = localStorage.getItem("recentlyViewedDrugs");
    if (storedRecents) {
      setRecentlyViewed(JSON.parse(storedRecents).slice(0, 5));
    }

    // If search query is in URL, fetch results
    if (querySearch) {
      fetchDrugs(querySearch);
    }
  }, [querySearch]);

  const fetchDrugs = async (searchQuery = searchTerm) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get("/api/drug", {
        params: {
          search: searchQuery,
          page: currentPage,
          limit: itemsPerPage,
        },
      });
      
      setDrugs(response.data.drugs || []);
      setTotalItems(response.data.total || 0);
      setIsSearchSubmitted(true);
    } catch (err) {
      setError("Terjadi kesalahan saat mengambil data obat. Silakan coba lagi.");
      console.error("Error fetching drugs:", err);
      toast.error("Gagal mengambil data obat");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setCurrentPage(1);
      router.push(`/drug-info?search=${encodeURIComponent(searchTerm.trim())}`);
      fetchDrugs(searchTerm.trim());
    }
  };

  const handleViewDrug = (drug) => {
    // Add to recently viewed
    const storedRecents = localStorage.getItem("recentlyViewedDrugs");
    const recents = storedRecents ? JSON.parse(storedRecents) : [];
    
    // Remove if already exists
    const filteredRecents = recents.filter(item => item.name !== drug.name);
    
    // Add to the beginning
    const updatedRecents = [drug, ...filteredRecents].slice(0, 10);
    localStorage.setItem("recentlyViewedDrugs", JSON.stringify(updatedRecents));
  };

  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  const getPaginationRange = () => {
    const delta = 1; // Number of pages to show before and after current page
    const pages = [];

    // Always include first page
    pages.push(1);
    
    // Current page area
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      pages.push(i);
    }
    
    // Always include last page if there's more than one page
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    // Add ellipses
    const result = [];
    let prev = 0;
    
    for (const page of pages) {
      if (prev && page - prev > 1) {
        result.push("...");
      }
      result.push(page);
      prev = page;
    }
    
    return result;
  };

  const SearchHero = () => (
    <Card className="border-none shadow-none bg-gradient-to-b from-indigo-50 to-white mb-6">
      <CardContent className="px-6 py-12">
        <div className="text-center mb-8">
          <div className="bg-white p-3 rounded-full inline-flex justify-center items-center w-16 h-16 shadow-sm mb-6">
            <MdOutlineMedication className="h-8 w-8 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Informasi Obat
          </h1>
          <p className="text-slate-600 max-w-md mx-auto">
            Cari dan temukan informasi lengkap tentang obat, komposisi, indikasi, 
            dosis, efek samping, dan interaksi.
          </p>
        </div>
        
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <MdOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                type="text"
                placeholder="Cari nama obat, generik, atau merek..."
                className="pl-10 h-12 rounded-lg border-slate-300 bg-white shadow-sm focus-visible:ring-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button 
              type="submit" 
              className="h-12 px-6 rounded-lg bg-indigo-600 hover:bg-indigo-700"
            >
              Cari
            </Button>
          </div>
        </form>

        {recentlyViewed.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500 mb-4">Pencarian terakhir Anda:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {recentlyViewed.slice(0, 5).map((drug, idx) => (
                <Button 
                  key={idx} 
                  variant="outline" 
                  size="sm"
                  className="border-slate-300 hover:bg-indigo-50 hover:text-indigo-700"
                  onClick={() => {
                    router.push(`/drug-info/${encodeURIComponent(drug.name)}`);
                    handleViewDrug(drug);
                  }}
                >
                  {drug.name}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center">
          <MdOutlineLocalPharmacy className="mr-2 text-indigo-600" />
          Database Obat
        </h2>

        <div className="flex items-center gap-2">
          {recentlyViewed.length > 0 && (
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1.5 border-slate-300"
                >
                  <MdHistory className="h-4 w-4" />
                  <span className="hidden sm:inline">Riwayat</span>
                  <Badge className="ml-1 bg-indigo-100 text-indigo-700 hover:bg-indigo-100">
                    {recentlyViewed.length}
                  </Badge>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Obat Terakhir Dilihat</SheetTitle>
                  <SheetDescription>
                    Riwayat obat yang terakhir Anda lihat
                  </SheetDescription>
                </SheetHeader>
                <ScrollArea className="h-full py-4">
                  <div className="space-y-3">
                    {recentlyViewed.map((drug, idx) => (
                      <div key={idx}>
                        <Link
                          href={`/drug-info/${encodeURIComponent(drug.name)}`}
                          onClick={() => handleViewDrug(drug)}
                        >
                          <Card className="hover:bg-indigo-50/50 transition-colors border-slate-200">
                            <CardContent className="p-3">
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="font-medium text-slate-900 line-clamp-1">
                                    {drug.name}
                                  </p>
                                  <p className="text-xs text-slate-500 mt-1">
                                    {drug.brandName !== drug.name
                                      ? drug.brandName
                                      : "Generic"}
                                  </p>
                                </div>
                                <div className="bg-indigo-100 rounded-full p-1 flex-shrink-0">
                                  <MdKeyboardArrowRight className="h-4 w-4 text-indigo-600" />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <SheetFooter className="pt-4">
                  <SheetClose asChild>
                    <Button variant="outline" className="w-full">Tutup</Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>

      {/* Initial Search View or Search Results */}
      {!isSearchSubmitted ? (
        <SearchHero />
      ) : (
        <>
          {/* Compact Search Input */}
          <Card className="mb-6 shadow-sm border-slate-200">
            <CardContent className="p-4">
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <MdOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="Cari nama obat, generik, atau merek..."
                    className="pl-10 border-slate-300 focus-visible:ring-indigo-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="bg-indigo-600 hover:bg-indigo-700 hidden sm:flex"
                >
                  Cari
                </Button>
                {searchTerm && (
                  <Button 
                    variant="outline" 
                    type="button" 
                    className="px-2 border-slate-300"
                    onClick={() => {
                      setSearchTerm("");
                      setIsSearchSubmitted(false);
                      router.push(`/drug-info`);
                    }}
                    title="Reset pencarian"
                  >
                    <MdRefresh className="h-4 w-4" />
                  </Button>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Search Results */}
          <Card className="border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50 py-4">
              <CardTitle className="text-lg flex items-center justify-between">
                <span className="flex items-center">
                  Hasil Pencarian
                  {!loading && drugs.length > 0 && (
                    <Badge variant="outline" className="ml-2">
                      {totalItems} hasil
                    </Badge>
                  )}
                </span>
              </CardTitle>
            </CardHeader>

            {/* Loading State */}
            {loading && (
              <CardContent className="p-0">
                <div className="p-8 flex flex-col items-center justify-center">
                  <Skeleton className="h-12 w-12 rounded-full bg-indigo-100 mb-4" />
                  <Skeleton className="h-4 w-24 bg-slate-200 mb-3" />
                  <Skeleton className="h-3 w-48 bg-slate-100" />
                </div>
              </CardContent>
            )}

            {/* Error State */}
            {error && !loading && (
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center p-3 bg-red-100 rounded-full mb-4">
                  <MdOutlineSearch className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-slate-800 mb-2">Terjadi Kesalahan</h3>
                <p className="text-slate-600 max-w-md mx-auto">{error}</p>
                <Button onClick={() => fetchDrugs()} className="mt-4">
                  Coba Lagi
                </Button>
              </CardContent>
            )}

            {/* Empty Results */}
            {!loading && !error && drugs.length === 0 && (
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center p-3 bg-amber-100 rounded-full mb-4">
                  <MdInfoOutline className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="text-lg font-medium text-slate-800 mb-2">
                  Tidak Ditemukan
                </h3>
                <p className="text-slate-600 max-w-md mx-auto">
                  Kami tidak menemukan data obat yang sesuai dengan pencarian "{searchTerm}".
                  Silakan coba dengan kata kunci lain.
                </p>
              </CardContent>
            )}

            {/* Results Table/List */}
            {!loading && !error && drugs.length > 0 && (
              <CardContent className="p-0">
                {/* Desktop Table View */}
                <div className="hidden md:block">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50 hover:bg-slate-50">
                        <TableHead className="font-semibold text-slate-700">Nama Generik</TableHead>
                        <TableHead className="font-semibold text-slate-700">Nama Merek</TableHead>
                        <TableHead className="font-semibold text-slate-700">Produsen</TableHead>
                        <TableHead className="w-[100px] text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {drugs.map((drug, idx) => (
                        <TableRow
                          key={idx}
                          className="group cursor-pointer hover:bg-indigo-50/30 transition-colors"
                          onClick={() => {
                            handleViewDrug(drug);
                            router.push(`/drug-info/${encodeURIComponent(drug.name)}`);
                          }}
                        >
                          <TableCell className="font-medium text-indigo-900">
                            {drug.genericName}
                          </TableCell>
                          <TableCell className="text-slate-700">
                            {drug.brandName !== drug.genericName ? (
                              drug.brandName
                            ) : (
                              <span className="text-slate-500 italic">Generic</span>
                            )}
                          </TableCell>
                          <TableCell
                            className="max-w-[200px] truncate text-slate-600"
                            title={drug.manufacturer}
                          >
                            {drug.manufacturer}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-700 border-indigo-200 hover:bg-indigo-100 hover:text-indigo-800 hover:border-indigo-300"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewDrug(drug);
                                router.push(`/drug-info/${encodeURIComponent(drug.name)}`);
                              }}
                            >
                              <span className="mr-1">Detail</span>
                              <MdKeyboardArrowRight className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                {/* Mobile List View */}
                <div className="md:hidden divide-y divide-slate-100">
                  {drugs.map((drug, idx) => (
                    <div 
                      key={idx} 
                      className="p-4 hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer"
                      onClick={() => {
                        handleViewDrug(drug);
                        router.push(`/drug-info/${encodeURIComponent(drug.name)}`);
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 pr-8">
                          <h3 className="font-medium text-slate-900 line-clamp-1">
                            {drug.genericName}
                          </h3>
                          <p className="text-sm text-slate-500 line-clamp-1">
                            {drug.brandName !== drug.genericName
                              ? drug.brandName
                              : "Generik"}
                          </p>
                          <div className="flex items-center mt-1">
                            <Badge variant="outline" className="text-xs border-slate-200 text-slate-600">
                              {drug.manufacturer.length > 20 
                                ? drug.manufacturer.substring(0, 20) + '...' 
                                : drug.manufacturer}
                            </Badge>
                          </div>
                        </div>
                        <div className="bg-indigo-50 rounded-full p-1">
                          <MdKeyboardArrowRight className="h-5 w-5 text-indigo-600" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}

            {/* Pagination */}
            {!loading && !error && drugs.length > 0 && (
              <CardFooter className="flex flex-col sm:flex-row justify-between items-center p-4 border-t border-slate-200 bg-slate-50/50">
                <div className="text-sm text-slate-500 mb-4 sm:mb-0">
                  Menampilkan {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} - {Math.min(currentPage * itemsPerPage, totalItems)} dari {totalItems} obat
                </div>

                <div className="flex items-center gap-3">
                  <Select
                    value={itemsPerPage.toString()}
                    onValueChange={(value) => {
                      setItemsPerPage(parseInt(value, 10));
                      setCurrentPage(1);
                      fetchDrugs();
                    }}
                  >
                    <SelectTrigger className="w-[80px] h-9 border-slate-200">
                      <SelectValue placeholder="10" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>

                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1) {
                              setCurrentPage(currentPage - 1);
                              fetchDrugs();
                            }
                          }}
                          className={
                            currentPage <= 1 
                              ? "pointer-events-none opacity-50" 
                              : "hover:bg-indigo-50 hover:text-indigo-700"
                          }
                        />
                      </PaginationItem>

                      {getPaginationRange().map((page, i) => (
                        <PaginationItem key={i} className={i > 0 && i < getPaginationRange().length - 1 ? "hidden sm:inline-flex" : ""}>
                          {page === "..." ? (
                            <PaginationEllipsis />
                          ) : (
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                setCurrentPage(page);
                                fetchDrugs();
                              }}
                              isActive={page === currentPage}
                              className={page === currentPage 
                                ? "bg-indigo-600 text-white hover:bg-indigo-700" 
                                : "hover:bg-indigo-50 hover:text-indigo-700"}
                            >
                              {page}
                            </PaginationLink>
                          )}
                        </PaginationItem>
                      ))}

                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < totalPages) {
                              setCurrentPage(currentPage + 1);
                              fetchDrugs();
                            }
                          }}
                          className={
                            currentPage >= totalPages
                              ? "pointer-events-none opacity-50"
                              : "hover:bg-indigo-50 hover:text-indigo-700"
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </CardFooter>
            )}
          </Card>
        </>
      )}
    </div>
  );
}