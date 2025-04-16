"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import {
  MdArrowBack,
  MdOutlineWarning,
  MdOutlineInfo,
  MdOutlineScience,
  MdOutlineMedication,
  MdShare,
  MdFavoriteBorder,
  MdFavorite,
  MdOutlinePrint,
  MdChevronRight,
} from "react-icons/md";

// ShadCN UI Components
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function DrugDetailPage() {
  const params = useParams();
  const router = useRouter();
  const drugName = params?.name || "";

  const [drug, setDrug] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchDrugData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `/api/drug/${encodeURIComponent(drugName)}`
        );
        setDrug(response.data);

        // Check if this drug is in favorites
        const storedFavorites = localStorage.getItem("favoriteDrugs");
        const favorites = storedFavorites ? JSON.parse(storedFavorites) : [];
        setIsFavorite(favorites.some((fav) => fav.name === response.data.name));
      } catch (err) {
        console.error("Error fetching drug details:", err);
        setError(err.message || "Error fetching drug data");
      } finally {
        setLoading(false);
      }
    };

    if (drugName) {
      fetchDrugData();
    }
  }, [drugName]);

  const toggleFavorite = () => {
    try {
      const storedFavorites = localStorage.getItem("favoriteDrugs");
      const favorites = storedFavorites ? JSON.parse(storedFavorites) : [];

      if (isFavorite) {
        // Remove from favorites
        const updatedFavorites = favorites.filter(
          (fav) => fav.name !== drug.name
        );
        localStorage.setItem("favoriteDrugs", JSON.stringify(updatedFavorites));
      } else {
        // Add to favorites
        const drugInfo = {
          name: drug.name,
          genericName: drug.clinicalData.genericName,
          brandName: drug.clinicalData.brandName,
          manufacturer: drug.clinicalData.manufacturer,
          addedAt: new Date().toISOString(),
        };
        localStorage.setItem(
          "favoriteDrugs",
          JSON.stringify([...favorites, drugInfo])
        );
      }

      setIsFavorite(!isFavorite);
    } catch (e) {
      console.error("Error managing favorites:", e);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Informasi Obat: ${drug.name}`,
          text: `Info lengkap tentang ${drug.name} (${drug.clinicalData.genericName})`,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert("URL disalin ke clipboard!");
      } catch (err) {
        console.error("Failed to copy URL:", err);
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="mr-2"
          >
            <MdArrowBack className="mr-1" /> Kembali
          </Button>

          <div className="space-y-1 flex-1">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-60" />
          </div>
        </div>

        <Skeleton className="h-[500px] w-full rounded-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="mb-4"
        >
          <MdArrowBack className="mr-1" /> Kembali
        </Button>

        <Card>
          <CardContent className="p-8 text-center">
            <div className="inline-flex items-center justify-center rounded-full bg-red-100 p-4 mb-4">
              <MdOutlineWarning className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-slate-800">
              Terjadi Kesalahan
            </h3>
            <p className="text-slate-500 mt-2">{error}</p>
            <div className="flex justify-center mt-4 space-x-2">
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Coba Lagi
              </Button>
              <Button onClick={() => router.push("/drug-info")}>
                Kembali ke Daftar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!drug) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="mb-4"
        >
          <MdArrowBack className="mr-1" /> Kembali
        </Button>

        <Card>
          <CardContent className="p-8 text-center">
            <div className="inline-flex items-center justify-center rounded-full bg-amber-100 p-4 mb-4">
              <MdOutlineInfo className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="text-lg font-medium text-slate-800">
              Obat Tidak Ditemukan
            </h3>
            <p className="text-slate-500 mt-2">
              Informasi untuk obat ini tidak tersedia
            </p>
            <Button className="mt-4" onClick={() => router.push("/drug-info")}>
              Lihat Daftar Obat
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl print:py-0">
      {/* Header dengan action buttons */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="mb-1 print:hidden"
          >
            <MdArrowBack className="mr-1" /> Kembali
          </Button>
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-800">
            {drug.name}
          </h1>
          <div className="flex items-center mt-1 flex-wrap gap-2">
            {drug.clinicalData.pharmClass !== "N/A" && (
              <Badge variant="outline" className="bg-slate-50">
                {drug.clinicalData.pharmClass}
              </Badge>
            )}
            {drug.clinicalData.route !== "N/A" && (
              <Badge variant="outline" className="bg-slate-50">
                {drug.clinicalData.route}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2 print:hidden">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleFavorite}
            className={isFavorite ? "text-red-500 hover:text-red-600" : ""}
          >
            {isFavorite ? (
              <MdFavorite className="h-4 w-4" />
            ) : (
              <MdFavoriteBorder className="h-4 w-4" />
            )}
          </Button>
          <Button variant="outline" size="icon" onClick={handleShare}>
            <MdShare className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handlePrint}>
            <MdOutlinePrint className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main content with tabs */}
      <Tabs defaultValue="overview" className="print:block">
        <TabsList className="mb-6 print:hidden">
          <TabsTrigger value="overview">Ringkasan</TabsTrigger>
          <TabsTrigger value="clinical">Klinis</TabsTrigger>
          <TabsTrigger value="chemistry">Kimia</TabsTrigger>
          <TabsTrigger value="detailed">Detail Lengkap</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MdOutlineMedication className="text-indigo-600" /> Informasi
                  Umum
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-500">
                    Nama Generik
                  </p>
                  <p className="font-medium">{drug.clinicalData.genericName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-500">
                    Nama Dagang
                  </p>
                  <p className="font-medium">{drug.clinicalData.brandName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-500">Produsen</p>
                  <p className="font-medium">
                    {drug.clinicalData.manufacturer}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-500">
                    Kelas Farmakologis
                  </p>
                  <p className="font-medium">{drug.clinicalData.pharmClass}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-500">
                    Rute Pemberian
                  </p>
                  <p className="font-medium">{drug.clinicalData.route}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-500">
                    Tipe Produk
                  </p>
                  <p className="font-medium">{drug.clinicalData.productType}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MdOutlineScience className="text-indigo-600" /> Struktur
                  Kimia
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center text-center">
                {drug.chemicalData.structureUrl ? (
                  <div className="p-2 bg-white rounded-lg shadow-sm border">
                    <Image
                      src={drug.chemicalData.structureUrl}
                      alt={`Struktur kimia ${drug.name}`}
                      width={200}
                      height={200}
                      className="mx-auto"
                    />
                  </div>
                ) : (
                  <div className="p-6 bg-slate-50 rounded-lg flex items-center justify-center w-full h-[200px]">
                    <p className="text-slate-500 text-sm">
                      Struktur tidak tersedia
                    </p>
                  </div>
                )}
                <div className="mt-4 w-full text-center">
                  <p className="font-medium">
                    {drug.chemicalData.molecularFormula}
                  </p>
                  <p className="text-sm text-slate-500">Formula Molekul</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Indikasi & Penggunaan</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 whitespace-pre-line">
                {drug.clinicalData.indications === "N/A"
                  ? "Informasi indikasi tidak tersedia"
                  : drug.clinicalData.indications}
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Dosis & Administrasi</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 whitespace-pre-line">
                  {drug.clinicalData.dosage === "N/A"
                    ? "Informasi dosis tidak tersedia"
                    : drug.clinicalData.dosage}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Efek Samping</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 whitespace-pre-line">
                  {drug.clinicalData.sideEffects === "N/A"
                    ? "Informasi efek samping tidak tersedia"
                    : drug.clinicalData.sideEffects}
                </p>
              </CardContent>
            </Card>
          </div>

          {(drug.clinicalData.warnings !== "N/A" ||
            drug.clinicalData.contraindications !== "N/A") && (
            <Alert
              variant="destructive"
              className="bg-red-50 border-red-200 text-red-800"
            >
              <MdOutlineWarning className="h-5 w-5 text-red-600" />
              <AlertTitle>Peringatan & Kontraindikasi</AlertTitle>
              <AlertDescription className="mt-2">
                {drug.clinicalData.warnings !== "N/A" && (
                  <div className="mb-2">
                    <p className="font-medium">Peringatan:</p>
                    <p className="text-sm">
                      {drug.clinicalData.warnings.substring(0, 250)}...
                    </p>
                  </div>
                )}
                {drug.clinicalData.contraindications !== "N/A" && (
                  <div>
                    <p className="font-medium">Kontraindikasi:</p>
                    <p className="text-sm">
                      {drug.clinicalData.contraindications.substring(0, 250)}...
                    </p>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        {/* Clinical Tab */}
        <TabsContent value="clinical" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Indikasi & Penggunaan</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 whitespace-pre-line">
                {drug.clinicalData.indications === "N/A"
                  ? "Informasi indikasi tidak tersedia"
                  : drug.clinicalData.indications}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dosis & Administrasi</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 whitespace-pre-line">
                {drug.clinicalData.dosage === "N/A"
                  ? "Informasi dosis tidak tersedia"
                  : drug.clinicalData.dosage}
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Efek Samping</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 whitespace-pre-line">
                  {drug.clinicalData.sideEffects === "N/A"
                    ? "Informasi efek samping tidak tersedia"
                    : drug.clinicalData.sideEffects}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Kontraindikasi</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 whitespace-pre-line">
                  {drug.clinicalData.contraindications === "N/A"
                    ? "Informasi kontraindikasi tidak tersedia"
                    : drug.clinicalData.contraindications}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Peringatan & Tindakan Pencegahan</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 whitespace-pre-line">
                {drug.clinicalData.warnings === "N/A"
                  ? "Informasi peringatan tidak tersedia"
                  : drug.clinicalData.warnings}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Interaksi Obat</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 whitespace-pre-line">
                {drug.clinicalData.drugInteractions === "N/A"
                  ? "Informasi interaksi obat tidak tersedia"
                  : drug.clinicalData.drugInteractions}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Chemical Tab */}
        <TabsContent value="chemistry" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MdOutlineScience className="text-indigo-600" /> Struktur
                    Kimia
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center text-center">
                    {drug.chemicalData.structureUrl ? (
                      <div className="p-2 bg-white rounded-lg shadow-sm border mb-4">
                        <Image
                          src={drug.chemicalData.structureUrl}
                          alt={`Struktur kimia ${drug.name}`}
                          width={200}
                          height={200}
                          className="mx-auto"
                        />
                      </div>
                    ) : (
                      <div className="p-6 bg-slate-50 rounded-lg flex items-center justify-center w-full h-[200px] mb-4">
                        <p className="text-slate-500 text-sm">
                          Struktur tidak tersedia
                        </p>
                      </div>
                    )}
                    {drug.sources.pubchem && (
                      <Button variant="link" asChild className="text-sm mt-2">
                        <a
                          href={drug.sources.pubchem}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Lihat di PubChem
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Properti Kimia</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-500">
                        Formula Molekul
                      </p>
                      <p className="font-medium">
                        {drug.chemicalData.molecularFormula}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-500">
                        Berat Molekul
                      </p>
                      <p className="font-medium">
                        {drug.chemicalData.molecularWeight} g/mol
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-500">
                        IUPAC
                      </p>
                      <p className="font-medium text-sm">
                        {drug.chemicalData.iupacName}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-500">
                        InChI Key
                      </p>
                      <p className="font-medium text-xs">
                        {drug.chemicalData.inchiKey}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-500">
                        SMILES
                      </p>
                      <p className="font-medium text-xs">
                        {drug.chemicalData.smiles}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-500">
                        XLogP
                      </p>
                      <p className="font-medium">{drug.chemicalData.xLogP}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-500">TPSA</p>
                      <p className="font-medium">{drug.chemicalData.tpsa} Å²</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-500">
                        H-Bond Donors
                      </p>
                      <p className="font-medium">
                        {drug.chemicalData.hBondDonors}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-500">
                        H-Bond Acceptors
                      </p>
                      <p className="font-medium">
                        {drug.chemicalData.hBondAcceptors}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sinonim & Nama Lain</CardTitle>
            </CardHeader>
            <CardContent>
              {drug.chemicalData.synonyms[0] === "N/A" ? (
                <p className="text-slate-500">Tidak ada sinonim tersedia.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {drug.chemicalData.synonyms
                    .slice(0, 15)
                    .map((synonym, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {synonym}
                      </Badge>
                    ))}
                  {drug.chemicalData.synonyms.length > 15 && (
                    <Badge variant="outline" className="text-xs">
                      +{drug.chemicalData.synonyms.length - 15} lainnya
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mekanisme Kerja</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 whitespace-pre-line">
                {drug.clinicalData.mechanismOfAction === "N/A"
                  ? "Informasi mekanisme kerja tidak tersedia"
                  : drug.clinicalData.mechanismOfAction}
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Farmakodinamik</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 whitespace-pre-line">
                  {drug.clinicalData.pharmacodynamics === "N/A"
                    ? "Informasi farmakodinamik tidak tersedia"
                    : drug.clinicalData.pharmacodynamics}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Farmakokinetik</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 whitespace-pre-line">
                  {drug.clinicalData.pharmacokinetics === "N/A"
                    ? "Informasi farmakokinetik tidak tersedia"
                    : drug.clinicalData.pharmacokinetics}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Detailed Tab */}
        <TabsContent value="detailed" id="detailed" className="space-y-6">
          <Card>
            <CardHeader className="pb-0">
              <CardTitle className="text-xl">Informasi Lengkap Obat</CardTitle>
              <CardDescription>
                Data komprehensif dari Badan POM dan referensi internasional
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              <div className="space-y-6">
                {Object.entries({
                  "Indikasi & Penggunaan": drug.clinicalData.indications,
                  "Dosis & Administrasi": drug.clinicalData.dosage,
                  "Efek Samping": drug.clinicalData.sideEffects,
                  Kontraindikasi: drug.clinicalData.contraindications,
                  "Peringatan & Tindakan Pencegahan":
                    drug.clinicalData.warnings,
                  "Penggunaan pada Kehamilan": drug.clinicalData.pregnancy,
                  "Penggunaan saat Menyusui": drug.clinicalData.nursingMothers,
                  "Efek Teratogenik": drug.clinicalData.teratogenicEffects,
                  "Penggunaan Pediatrik": drug.clinicalData.pediatricUse,
                  "Penggunaan Geriatrik": drug.clinicalData.geriatricUse,
                  "Interaksi Obat": drug.clinicalData.drugInteractions,
                  "Mekanisme Kerja": drug.clinicalData.mechanismOfAction,
                  Farmakodinamik: drug.clinicalData.pharmacodynamics,
                  Farmakokinetik: drug.clinicalData.pharmacokinetics,
                  "Informasi Pasien": drug.clinicalData.patientInformation,
                  "Panduan Pengobatan": drug.clinicalData.medicationGuide,
                  "Instruksi Penggunaan": drug.clinicalData.instructionsForUse,
                  Penyimpanan: drug.clinicalData.storage,
                  "Bentuk Sediaan": drug.clinicalData.howSupplied,
                }).map(
                  ([title, content], idx) =>
                    content !== "N/A" && (
                      <div key={idx}>
                        <h3 className="font-medium text-lg text-slate-800 mb-2">
                          {title}
                        </h3>
                        <p className="text-slate-700 whitespace-pre-line">
                          {content}
                        </p>
                        {idx < Object.entries(drug.clinicalData).length - 1 && (
                          <Separator className="mt-6" />
                        )}
                      </div>
                    )
                )}
              </div>
            </CardContent>
          </Card>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm text-slate-500 print:hidden">
            <p>Sumber informasi:</p>
            <ul className="list-disc list-inside space-y-1 mt-1">
              {drug.sources.openfda && (
                <li>
                  <a
                    href={drug.sources.openfda}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:underline"
                  >
                    OpenFDA Database
                  </a>
                </li>
              )}
              {drug.sources.pubchem && (
                <li>
                  <a
                    href={drug.sources.pubchem}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:underline"
                  >
                    PubChem
                  </a>
                </li>
              )}
            </ul>
            <p className="mt-2">
              <em>
                Informasi disediakan untuk tujuan edukasi dan tidak menggantikan
                saran profesional kesehatan.
              </em>
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
