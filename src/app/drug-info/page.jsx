"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdOutlineSearch,
  MdOutlineMedication,
  MdHistory,
  MdKeyboardArrowRight,
  MdInfoOutline,
  MdOutlineLocalPharmacy,
  MdOutlineScience,
  MdOutlineInfo,
  MdAccessTime,
  MdOutlineHealthAndSafety,
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

function DrugInfoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const querySearch = searchParams.get("search") || "";

  const [searchTerm, setSearchTerm] = useState(querySearch);
  const [isSearchSubmitted, setIsSearchSubmitted] = useState(!!querySearch);
  const [drugs, setDrugs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [greetingName, setGreetingName] = useState("");
  const [timeOfDay, setTimeOfDay] = useState("");

  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay("pagi");
    else if (hour < 17) setTimeOfDay("siang");
    else setTimeOfDay("malam");

    // Try to get name from localStorage
    const name = localStorage.getItem("userName") || "";
    setGreetingName(name);

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
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("/api/obat", {
        params: {
          search: searchQuery,
          page: 1,
          perPage: 10,
        },
      });

      setDrugs(response.data.data || []);
      setIsSearchSubmitted(true);
    } catch (err) {
      console.error("Error fetching drugs:", err);
      setError("Terjadi kesalahan saat mencari obat. Silakan coba lagi.");
      toast.error("Gagal mencari data obat");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/drug-info?search=${encodeURIComponent(searchTerm.trim())}`);
      fetchDrugs(searchTerm.trim());
    }
  };

  const handleViewDrug = (drug) => {
    // Add to recently viewed
    const storedRecents = localStorage.getItem("recentlyViewedDrugs");
    const recents = storedRecents ? JSON.parse(storedRecents) : [];

    // Remove if already exists
    const filteredRecents = recents.filter((item) => item.cid !== drug.cid);

    // Add to the beginning
    const updatedRecents = [
      {
        cid: drug.cid,
        name: drug.title,
        iupac_name: drug.iupac_name,
      },
      ...filteredRecents,
    ].slice(0, 10);

    localStorage.setItem("recentlyViewedDrugs", JSON.stringify(updatedRecents));
  };

  // Time-sensitive greeting message
  const getGreeting = () => {
    return greetingName
      ? `Selamat ${timeOfDay}, ${greetingName}!`
      : `Selamat ${timeOfDay}!`;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center mb-8"
      >
        <h2 className="text-2xl font-bold text-slate-800 flex items-center">
          <MdOutlineLocalPharmacy className="mr-2 text-indigo-600" />
          NisaCare
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
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <Link
                          href={`/drug-info/${encodeURIComponent(drug.cid)}`}
                          onClick={() => handleViewDrug(drug)}
                        >
                          <Card className="hover:bg-indigo-50/50 transition-colors border-slate-200">
                            <CardContent className="p-3">
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="font-medium text-slate-900 line-clamp-1">
                                    {drug.name}
                                  </p>
                                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                                    {drug.iupac_name}
                                  </p>
                                </div>
                                <div className="bg-indigo-100 rounded-full p-1 flex-shrink-0">
                                  <MdKeyboardArrowRight className="h-4 w-4 text-indigo-600" />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
                <SheetFooter className="pt-4">
                  <SheetClose asChild>
                    <Button variant="outline" className="w-full">
                      Tutup
                    </Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </motion.div>

      {!isSearchSubmitted ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="border-none shadow-none bg-gradient-to-b from-indigo-50 to-white mb-10">
            <CardContent className="px-6 py-12">
              <motion.div
                className="text-center mb-8"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="bg-white p-3 rounded-full inline-flex justify-center items-center w-16 h-16 shadow-sm mb-6">
                  <MdOutlineMedication className="h-8 w-8 text-indigo-600" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
                  {getGreeting()}
                </h1>
                <p className="text-slate-600 max-w-md mx-auto">
                  Cari informasi lengkap tentang obat yang Anda butuhkan di
                  NisaCare
                </p>
              </motion.div>

              <motion.form
                onSubmit={handleSearch}
                className="max-w-2xl mx-auto"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <MdOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      type="text"
                      placeholder="Cari nama obat, contoh: Paracetamol, Ibuprofen..."
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
              </motion.form>

              {recentlyViewed.length > 0 && (
                <motion.div
                  className="mt-10 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <p className="text-sm text-slate-500 mb-4">
                    Pencarian terakhir Anda:
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {recentlyViewed.slice(0, 5).map((drug, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.7 + idx * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-slate-300 hover:bg-indigo-50 hover:text-indigo-700"
                          onClick={() => {
                            router.push(
                              `/drug-info/${encodeURIComponent(drug.cid)}`
                            );
                            handleViewDrug(drug);
                          }}
                        >
                          {drug.name}
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>

          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
          >
            <motion.div variants={item}>
              <Card className="bg-gradient-to-br from-indigo-50 to-white border-indigo-100">
                <CardHeader className="pb-2">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mb-2">
                    <MdOutlineScience className="text-indigo-600 w-5 h-5" />
                  </div>
                  <CardTitle className="text-lg">Database Lengkap</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 text-sm">
                    Akses informasi terperinci dari ribuan obat dan senyawa
                    kimia yang terus diperbarui
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-100">
                <CardHeader className="pb-2">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                    <MdOutlineInfo className="text-purple-600 w-5 h-5" />
                  </div>
                  <CardTitle className="text-lg">Informasi Klinis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 text-sm">
                    Temukan dosis, efek samping, dan interaksi obat untuk
                    panduan penggunaan yang aman
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="bg-gradient-to-br from-amber-50 to-white border-amber-100">
                <CardHeader className="pb-2">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mb-2">
                    <MdOutlineHealthAndSafety className="text-amber-600 w-5 h-5" />
                  </div>
                  <CardTitle className="text-lg">Sumber Terpercaya</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 text-sm">
                    Data diambil dari sumber resmi termasuk PubChem dan panduan
                    farmasi terkini
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {/* Compact Search Form */}
            <Card className="mb-6 shadow-sm border-slate-200">
              <CardContent className="p-4">
                <form onSubmit={handleSearch} className="flex gap-2">
                  <div className="relative flex-1">
                    <MdOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      type="text"
                      placeholder="Cari nama obat..."
                      className="pl-10 border-slate-300 focus-visible:ring-indigo-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    Cari
                  </Button>
                  <Button
                    variant="outline"
                    type="button"
                    className="px-3 border-slate-300"
                    onClick={() => {
                      setSearchTerm("");
                      setIsSearchSubmitted(false);
                      setDrugs([]);
                      router.push(`/drug-info`);
                    }}
                  >
                    Batal
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Results state handling */}
            {loading ? (
              <Card>
                <CardHeader>
                  <CardTitle>Mencari...</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <Card key={i}>
                      <CardHeader className="pb-2">
                        <Skeleton className="h-6 w-2/3 mb-2" />
                        <Skeleton className="h-4 w-1/2" />
                      </CardHeader>
                      <CardContent>
                        <div className="flex space-x-4 items-center mb-4">
                          <Skeleton className="h-16 w-16 rounded" />
                          <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-3 w-4/5" />
                          </div>
                        </div>
                        <Skeleton className="h-8 w-full rounded" />
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            ) : error ? (
              <Card className="border-red-100">
                <CardHeader className="bg-red-50">
                  <CardTitle className="text-red-800 flex items-center gap-2">
                    <MdInfoOutline className="text-red-600" />
                    Terjadi Kesalahan
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 text-center">
                  <p className="text-slate-600 mb-4">{error}</p>
                  <Button onClick={() => fetchDrugs(searchTerm)}>
                    Coba Lagi
                  </Button>
                </CardContent>
              </Card>
            ) : drugs.length === 0 ? (
              <Card>
                <CardHeader className="bg-amber-50">
                  <CardTitle className="text-amber-800 flex items-center gap-2">
                    <MdInfoOutline className="text-amber-600" />
                    Tidak Ada Hasil
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 text-center">
                  <p className="mb-4">
                    Kami tidak menemukan obat dengan kata kunci "
                    <strong>{searchTerm}</strong>".
                    <br />
                    Silakan coba dengan kata kunci lain atau periksa ejaan.
                  </p>
                  <div className="flex justify-center gap-2 mt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchTerm("");
                        setIsSearchSubmitted(false);
                        router.push("/drug-info");
                      }}
                    >
                      Kembali
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-slate-800">
                    Hasil Pencarian
                    <Badge variant="outline" className="ml-2">
                      {drugs.length} obat ditemukan
                    </Badge>
                  </h2>
                </div>

                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {drugs.map((drug, idx) => (
                    <motion.div key={drug.cid} variants={item}>
                      <Card className="h-full flex flex-col hover:shadow-md transition-shadow overflow-hidden group">
                        <CardHeader className="bg-gradient-to-r from-indigo-50 to-white pb-4">
                          <CardTitle className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                              <span className="line-clamp-2 text-lg text-indigo-900">
                                {drug.title}
                              </span>
                            </div>
                            <div className="flex-shrink-0 mt-1">
                              <Badge
                                variant="outline"
                                className="bg-white text-indigo-600 border-indigo-200"
                              >
                                CID: {drug.cid}
                              </Badge>
                            </div>
                          </CardTitle>
                          <CardDescription className="line-clamp-1 mt-1 text-sm font-mono">
                            {drug.iupac_name}
                          </CardDescription>
                        </CardHeader>

                        <CardContent className="pb-4 flex-grow">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="bg-white rounded-md shadow-sm border p-2 flex items-center justify-center h-20 w-20 overflow-hidden">
                                <Image
                                  src={`https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=${drug.cid}&t=l`}
                                  alt={drug.title || "Struktur molekul"}
                                  width={80}
                                  height={80}
                                  className="object-contain"
                                  loading="lazy"
                                />
                              </div>
                            </div>

                            <div className="space-y-3 ml-3 flex-1">
                              {drug.molecular_formula && (
                                <div>
                                  <p className="text-xs text-slate-500 mb-1">
                                    Formula
                                  </p>
                                  <p className="font-mono text-sm bg-slate-50 px-2 py-1 rounded border text-center">
                                    {drug.molecular_formula}
                                  </p>
                                </div>
                              )}

                              {drug.molecular_weight && (
                                <div>
                                  <p className="text-xs text-slate-500 mb-1">
                                    Berat Molekul
                                  </p>
                                  <p className="text-sm font-medium">
                                    {drug.molecular_weight} g/mol
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>

                          <Separator className="my-4" />

                          <div className="flex items-center text-sm text-slate-600 gap-2">
                            <MdAccessTime className="text-slate-400" />
                            <span>Sumber: PubChem Database</span>
                          </div>
                        </CardContent>

                        <CardFooter className="pt-0 mt-auto">
                          <Button
                            asChild
                            className="w-full bg-indigo-600 hover:bg-indigo-700 group-hover:shadow-sm transition-all"
                          >
                            <Link
                              href={`/drug-info/${drug.cid}`}
                              onClick={() => handleViewDrug(drug)}
                            >
                              Lihat Informasi Lengkap
                            </Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Footer Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <div className="mt-16 text-center text-sm text-slate-500">
          <p className="mb-2">
            NisaCare - Asisten Farmasi Digital | Dibuat dengan ❤️ untuk Nisa
          </p>
          <p>Data disediakan oleh PubChem - National Library of Medicine</p>
        </div>
      </motion.div>
    </div>
  );
}

// Loading fallback untuk Suspense
function LoadingFallback() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-8 w-20" />
      </div>

      <div className="space-y-6">
        <div className="bg-slate-50 p-12 rounded-lg">
          <div className="flex flex-col items-center">
            <Skeleton className="h-16 w-16 rounded-full mb-4" />
            <Skeleton className="h-10 w-60 mb-4" />
            <Skeleton className="h-5 w-80 mb-6" />
            <Skeleton className="h-12 w-full max-w-2xl" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}

// Komponen utama yang dibungkus dengan Suspense
export default function DrugInfoPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <DrugInfoContent />
    </Suspense>
  );
}
