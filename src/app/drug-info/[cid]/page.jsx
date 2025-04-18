"use client";

import { useState, useEffect } from "react";
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
  MdKeyboardArrowDown,
  MdKeyboardArrowRight,
  MdOutlineChevronRight,
  MdOutlineSecurity,
  MdOutlineWarningAmber,
  MdBookmark,
  MdSearch,
  MdLibraryBooks,
  MdOutlineFoodBank,
  MdOutlineConstruction,
  MdOutlineBiotech,
  MdOutlineEco,
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

export default function DrugDetailPage() {
  const params = useParams();
  const router = useRouter();
  const cid = params?.cid || "";

  const [compound, setCompound] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchCompoundData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `/api/obat/${encodeURIComponent(cid)}`
        );
        setCompound(response.data);

        // Update recently viewed
        const recentlyViewed = JSON.parse(
          localStorage.getItem("recentlyViewedDrugs") || "[]"
        );
        const existingIndex = recentlyViewed.findIndex(
          (item) => item.cid === response.data.cid
        );

        if (existingIndex !== -1) {
          // Remove existing entry
          recentlyViewed.splice(existingIndex, 1);
        }

        // Add to beginning of array
        recentlyViewed.unshift({
          cid: response.data.cid,
          name: response.data.name,
          iupac_name: response.data.essential.iupacName,
        });

        // Keep only recent 10
        localStorage.setItem(
          "recentlyViewedDrugs",
          JSON.stringify(recentlyViewed.slice(0, 10))
        );

        // Check if this compound is in favorites
        const storedFavorites = localStorage.getItem("favoriteCompounds");
        const favorites = storedFavorites ? JSON.parse(storedFavorites) : [];
        setIsFavorite(favorites.some((fav) => fav.cid === response.data.cid));
      } catch (err) {
        console.error("Error fetching compound details:", err);
        setError(err.message || "Error fetching compound data");
      } finally {
        setLoading(false);
      }
    };

    if (cid) {
      fetchCompoundData();
    }
  }, [cid]);

  const toggleFavorite = () => {
    try {
      const storedFavorites = localStorage.getItem("favoriteCompounds");
      const favorites = storedFavorites ? JSON.parse(storedFavorites) : [];

      if (isFavorite) {
        // Remove from favorites
        const updatedFavorites = favorites.filter(
          (fav) => fav.cid !== compound.cid
        );
        localStorage.setItem(
          "favoriteCompounds",
          JSON.stringify(updatedFavorites)
        );
        toast.success("Dihapus dari favorit");
      } else {
        // Add to favorites
        const compoundInfo = {
          cid: compound.cid,
          name: compound.name,
          iupacName: compound.essential.iupacName,
          molecularFormula: compound.essential.molecularFormula,
          thumbnailUrl: compound.essential.thumbnailUrl,
          addedAt: new Date().toISOString(),
        };
        localStorage.setItem(
          "favoriteCompounds",
          JSON.stringify([...favorites, compoundInfo])
        );
        toast.success("Ditambahkan ke favorit");
      }

      setIsFavorite(!isFavorite);
    } catch (e) {
      console.error("Error managing favorites:", e);
      toast.error("Gagal menambahkan ke favorit");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Informasi Senyawa: ${compound.name}`,
          text: `Info lengkap tentang ${compound.name}`,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.info("URL disalin ke clipboard!");
      } catch (err) {
        console.error("Failed to copy URL:", err);
        toast.error("Gagal menyalin URL");
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <Skeleton className="h-[300px] w-full rounded-lg" />
          </div>
          <div className="lg:col-span-2">
            <Skeleton className="h-8 w-40 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />

            <div className="grid grid-cols-2 gap-4 mt-6">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </div>
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

  if (!compound) {
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
              Informasi Tidak Ditemukan
            </h3>
            <p className="text-slate-500 mt-2">
              Detail untuk senyawa ini tidak tersedia
            </p>
            <Button className="mt-4" onClick={() => router.push("/drug-info")}>
              Lihat Daftar Senyawa
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatTableOfContents = (sections) => {
    return Object.keys(sections).map((key) => {
      const section = sections[key];
      return {
        title: key,
        description: section.description,
        hasSubsections: section.subsections && section.subsections.length > 0,
        subsections:
          section.subsections?.map((sub) => ({
            title: sub.name,
            description: sub.description,
          })) || [],
      };
    });
  };

  const tableOfContents = formatTableOfContents(compound.sections);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl print:py-0">
      <div className="print:hidden">
        <Breadcrumb className="mb-4">
          <BreadcrumbItem>
            <BreadcrumbLink href="/drug-info">Database Obat</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="#">{compound.name}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>

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
            {compound.name}
          </h1>
          <p className="text-sm text-slate-500">CID: {compound.cid}</p>
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
          <TabsTrigger value="chemistry">Kimia</TabsTrigger>
          <TabsTrigger value="pharmacology">Farmakologi</TabsTrigger>
          <TabsTrigger value="safety">Keamanan</TabsTrigger>
          <TabsTrigger value="full">Konten Lengkap</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <MdOutlineScience className="text-indigo-600" /> Struktur
                  Molekul
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center text-center">
                <div className="p-2 bg-white rounded-lg shadow-sm border">
                  <Image
                    src={compound.essential.structureUrl}
                    alt={`Struktur kimia ${compound.name}`}
                    width={200}
                    height={200}
                    className="mx-auto"
                  />
                </div>
                <div className="mt-4 w-full text-center">
                  <p className="font-medium">
                    {compound.essential.molecularFormula
                      .split("")
                      .map((char, index) => {
                        return /\d/.test(char) ? (
                          <sub key={index}>{char}</sub>
                        ) : (
                          char
                        );
                      })}
                  </p>
                  <p className="text-sm text-slate-500">Formula Molekul</p>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-slate-600">
                    Berat Molekul:{" "}
                    <span className="font-medium">
                      {compound.essential.molecularWeight}
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MdOutlineInfo className="text-indigo-600" /> Informasi Umum
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-slate-500">
                      Nama IUPAC
                    </h3>
                    <p className="font-medium break-words">
                      {compound.essential.iupacName}
                    </p>
                  </div>

                  {compound.essential.synonyms[0] !== "N/A" && (
                    <div>
                      <h3 className="text-sm font-medium text-slate-500">
                        Sinonim
                      </h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {compound.essential.synonyms
                          .slice(0, 5)
                          .map((synonym, idx) => (
                            <Badge
                              key={idx}
                              variant="secondary"
                              className="text-xs"
                            >
                              {synonym}
                            </Badge>
                          ))}
                        {compound.essential.synonyms.length > 5 && (
                          <Badge variant="outline" className="text-xs">
                            +{compound.essential.synonyms.length - 5} lainnya
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1">
                      <h3 className="text-sm font-medium text-slate-500">
                        InChIKey
                      </h3>
                      <p className="font-mono text-xs bg-slate-50 p-2 rounded border border-slate-200 overflow-auto">
                        {compound.essential.inchiKey}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-medium text-slate-500">
                        SMILES
                      </h3>
                      <p className="font-mono text-xs bg-slate-50 p-2 rounded border border-slate-200 overflow-auto max-h-[60px]">
                        {compound.essential.canonicalSmiles}
                      </p>
                    </div>
                  </div>

                  {compound.essential.useClassification !== "N/A" && (
                    <div className="pt-2">
                      <h3 className="text-sm font-medium text-slate-500">
                        Klasifikasi Penggunaan
                      </h3>
                      <p>{compound.essential.useClassification}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {compound.essential.pharmacology !== "N/A" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MdOutlineMedication className="text-indigo-600" />{" "}
                  Farmakologi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 whitespace-pre-line">
                  {compound.essential.pharmacology}
                </p>
              </CardContent>
            </Card>
          )}

          {compound.essential.drugIndication !== "N/A" && (
            <Card>
              <CardHeader>
                <CardTitle>Indikasi & Penggunaan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 whitespace-pre-line">
                  {compound.essential.drugIndication}
                </p>
              </CardContent>
            </Card>
          )}

          {compound.essential.toxicity !== "N/A" && (
            <Alert
              variant="destructive"
              className="bg-red-50 border-red-200 text-red-800"
            >
              <MdOutlineWarning className="h-5 w-5 text-red-600" />
              <AlertTitle>Informasi Toksisitas</AlertTitle>
              <AlertDescription className="mt-2 whitespace-pre-line">
                {compound.essential.toxicity}
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        {/* Chemistry Tab */}
        <TabsContent value="chemistry" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MdOutlineScience className="text-indigo-600" /> Struktur
                  Molekul
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center text-center">
                <div className="p-2 bg-white rounded-lg shadow-sm border">
                  <Image
                    src={compound.essential.structureUrl}
                    alt={`Struktur kimia ${compound.name}`}
                    width={200}
                    height={200}
                    className="mx-auto"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="border-b pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <MdOutlineScience className="text-indigo-600" /> Properti
                    Kimia
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <ChemicalPropertiesTable compound={compound} />
                </CardContent>
              </Card>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Identifikasi & Nama Lain</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-slate-500">
                  Nama IUPAC
                </h3>
                <p className="font-medium break-words">
                  {compound.essential.iupacName}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-slate-500">InChIKey</h3>
                <p className="font-mono text-xs bg-slate-50 p-2 rounded border border-slate-200 overflow-auto">
                  {compound.essential.inchiKey}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-slate-500">SMILES</h3>
                <p className="font-mono text-xs bg-slate-50 p-2 rounded border border-slate-200 overflow-auto max-h-16">
                  {compound.essential.canonicalSmiles}
                </p>
              </div>

              {compound.essential.synonyms[0] !== "N/A" && (
                <div>
                  <h3 className="text-sm font-medium text-slate-500 mb-2">
                    Sinonim & Nama Lain
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {compound.essential.synonyms
                      .slice(0, 15)
                      .map((synonym, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="text-xs"
                        >
                          {synonym}
                        </Badge>
                      ))}
                  </div>
                  {compound.essential.synonyms.length > 15 && (
                    <Accordion type="single" collapsible className="mt-2">
                      <AccordionItem value="more-synonyms">
                        <AccordionTrigger className="text-xs text-slate-600">
                          Tampilkan {compound.essential.synonyms.length - 15}{" "}
                          nama lainnya
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {compound.essential.synonyms
                              .slice(15)
                              .map((synonym, idx) => (
                                <Badge
                                  key={idx}
                                  variant="outline"
                                  className="text-xs bg-slate-50"
                                >
                                  {synonym}
                                </Badge>
                              ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pharmacology Tab */}
        <TabsContent value="pharmacology" className="space-y-6">
          {compound.essential.pharmacology !== "N/A" ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MdOutlineMedication className="text-indigo-600" />{" "}
                  Farmakologi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 whitespace-pre-line">
                  {compound.essential.pharmacology}
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center rounded-full bg-slate-100 p-4 mb-4">
                  <MdOutlineInfo className="h-6 w-6 text-slate-600" />
                </div>
                <h3 className="text-lg font-medium text-slate-800">
                  Informasi Farmakologi Tidak Tersedia
                </h3>
                <p className="text-slate-500 mt-2">
                  Data farmakologi untuk {compound.name} belum tersedia di
                  database PubChem.
                </p>
              </CardContent>
            </Card>
          )}

          {compound.essential.drugIndication !== "N/A" && (
            <Card>
              <CardHeader>
                <CardTitle>Indikasi & Penggunaan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 whitespace-pre-line">
                  {compound.essential.drugIndication}
                </p>
              </CardContent>
            </Card>
          )}

          {renderSectionIfExists(
            compound,
            "Pharmacology and Biochemistry",
            "Pharmacology"
          )}
          {renderSectionIfExists(
            compound,
            "Pharmacology and Biochemistry",
            "Absorption"
          )}
          {renderSectionIfExists(
            compound,
            "Pharmacology and Biochemistry",
            "Mechanism of Action"
          )}
        </TabsContent>

        {/* Safety Tab */}
        <TabsContent value="safety" className="space-y-6">
          {compound.essential.safetyHazards !== "N/A" ||
          compound.essential.toxicity !== "N/A" ? (
            <>
              {compound.essential.safetyHazards !== "N/A" && (
                <Card>
                  <CardHeader className="bg-amber-50">
                    <CardTitle className="flex items-center gap-2 text-amber-800">
                      <MdOutlineSecurity className="text-amber-600" /> Keamanan
                      & Bahaya
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-slate-700 whitespace-pre-line">
                      {compound.essential.safetyHazards}
                    </p>
                  </CardContent>
                </Card>
              )}

              {compound.essential.toxicity !== "N/A" && (
                <Card>
                  <CardHeader className="bg-red-50">
                    <CardTitle className="flex items-center gap-2 text-red-800">
                      <MdOutlineWarningAmber className="text-red-600" />{" "}
                      Toksisitas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-slate-700 whitespace-pre-line">
                      {compound.essential.toxicity}
                    </p>
                  </CardContent>
                </Card>
              )}

              {renderSectionIfExists(
                compound,
                "Safety and Hazards",
                "Hazard Classes and Categories"
              )}
              {renderSectionIfExists(
                compound,
                "Safety and Hazards",
                "GHS Classification"
              )}
              {renderSectionIfExists(
                compound,
                "Safety and Hazards",
                "First Aid Measures"
              )}
            </>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center rounded-full bg-slate-100 p-4 mb-4">
                  <MdOutlineInfo className="h-6 w-6 text-slate-600" />
                </div>
                <h3 className="text-lg font-medium text-slate-800">
                  Informasi Keamanan Tidak Tersedia
                </h3>
                <p className="text-slate-500 mt-2">
                  Data keamanan & toksisitas untuk {compound.name} belum
                  tersedia di database PubChem.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Full Content Tab */}
        <TabsContent value="full" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Daftar Isi</CardTitle>
              <CardDescription>
                Konten lengkap dari PubChem untuk {compound.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tableOfContents.map((section, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className="h-6 w-6 rounded-full flex items-center justify-center p-0">
                        {index + 1}
                      </Badge>
                      <Link
                        href={`#section-${index + 1}`}
                        className="font-medium text-indigo-600 hover:underline"
                      >
                        {section.title}
                      </Link>
                    </div>
                    {section.hasSubsections && (
                      <div className="pl-8 space-y-1">
                        {section.subsections.map((sub, subIndex) => (
                          <div
                            key={subIndex}
                            className="flex items-center gap-1"
                          >
                            <MdOutlineChevronRight className="text-slate-400 h-4 w-4" />
                            <Link
                              href={`#section-${index + 1}-${subIndex + 1}`}
                              className="text-sm text-slate-600 hover:text-indigo-600 hover:underline"
                            >
                              {sub.title}
                            </Link>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Render all sections */}
          {tableOfContents.map((section, index) => (
            <section
              key={index}
              id={`section-${index + 1}`}
              className="scroll-mt-16"
            >
              <SectionCard
                title={`${index + 1}. ${section.title}`}
                description={section.description}
                icon={getSectionIcon(section.title)}
                compound={compound}
                sectionKey={section.title}
              >
                {section.hasSubsections && (
                  <Accordion type="multiple" className="mt-4">
                    {section.subsections.map((subsection, subIndex) => (
                      <AccordionItem
                        key={subIndex}
                        value={`section-${index + 1}-${subIndex + 1}`}
                        id={`section-${index + 1}-${subIndex + 1}`}
                        className="scroll-mt-24"
                      >
                        <AccordionTrigger className="hover:bg-slate-50 px-3 rounded-md">
                          {subsection.title}
                        </AccordionTrigger>
                        <AccordionContent className="px-3 pt-2 text-slate-700">
                          {renderSubsectionContent(
                            compound,
                            section.title,
                            subsection.title
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </SectionCard>
            </section>
          ))}

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm text-slate-500 mt-8">
            <div className="flex items-center gap-2 mb-2">
              <MdLibraryBooks className="text-slate-400" />
              <h3 className="font-medium">Sumber Data</h3>
            </div>
            <ul className="space-y-1 pl-6 list-disc">
              {compound.sources.slice(0, 5).map((source, index) => (
                <li key={index}>
                  {source.url ? (
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:underline"
                    >
                      {source.name} {source.id ? `(${source.id})` : ""}
                    </a>
                  ) : (
                    <span>
                      {source.name} {source.id ? `(${source.id})` : ""}
                    </span>
                  )}
                </li>
              ))}
              {compound.sources.length > 5 && (
                <Accordion type="single" collapsible>
                  <AccordionItem value="more-sources">
                    <AccordionTrigger className="text-xs py-1 hover:no-underline">
                      Lihat {compound.sources.length - 5} sumber lainnya
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-1 pl-2 list-disc">
                        {compound.sources.slice(5).map((source, index) => (
                          <li key={index}>
                            {source.url ? (
                              <a
                                href={source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-600 hover:underline"
                              >
                                {source.name}{" "}
                                {source.id ? `(${source.id})` : ""}
                              </a>
                            ) : (
                              <span>
                                {source.name}{" "}
                                {source.id ? `(${source.id})` : ""}
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}
            </ul>
            <p className="mt-4 text-xs">
              <em>
                Data dari PubChem - National Library of Medicine. Informasi
                disediakan untuk tujuan edukasi dan tidak menggantikan saran
                profesional kesehatan.
              </em>
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper Components
function ChemicalPropertiesTable({ compound }) {
  const formatFormula = (formula) => {
    if (!formula || formula === "N/A") return "Tidak tersedia";

    return formula.split("").map((char, index) => {
      return /\d/.test(char) ? (
        <sub key={index} className="text-base">
          {char}
        </sub>
      ) : (
        <span key={index}>{char}</span>
      );
    });
  };

  const tableData = [
    {
      label: "Formula Molekul",
      value: formatFormula(compound.essential.molecularFormula),
    },
    { label: "Berat Molekul", value: compound.essential.molecularWeight },
    {
      label: "SMILES",
      value: compound.essential.canonicalSmiles,
      isCode: true,
    },
    { label: "InChI Key", value: compound.essential.inchiKey, isCode: true },
  ];

  // Add additional properties from compound sections if available
  const chemPhysProps = compound.sections["Chemical and Physical Properties"];
  if (chemPhysProps && chemPhysProps.subsections) {
    const computedProps = chemPhysProps.subsections.find(
      (s) =>
        s.name === "Computed Properties" ||
        s.name === "Chemical and Physical Properties"
    );
    if (computedProps && computedProps.data) {
      Object.entries(computedProps.data).forEach(([key, value]) => {
        if (
          !tableData.some(
            (item) => item.label.toLowerCase() === key.toLowerCase()
          )
        ) {
          tableData.push({ label: key, value });
        }
      });
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-1/3">Properti</TableHead>
          <TableHead>Nilai</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tableData.map((row, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">{row.label}</TableCell>
            <TableCell>
              {row.isCode ? (
                <span className="font-mono text-xs bg-slate-50 p-1 rounded border border-slate-200 overflow-auto max-w-xs block">
                  {row.value}
                </span>
              ) : (
                row.value
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function SectionCard({
  title,
  description,
  icon,
  children,
  compound,
  sectionKey,
}) {
  // Directly render data if there are no subsections but there's data in the section
  const sectionData = compound.sections[sectionKey]?.data;
  const hasDirectData = sectionData && Object.keys(sectionData).length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-indigo-800">
          {icon} {title}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {hasDirectData && (
          <div className="mb-4">
            {Object.entries(sectionData).map(([key, value], idx) => (
              <div key={idx} className="mb-3">
                <h4 className="font-medium text-slate-700">{key}</h4>
                {Array.isArray(value) ? (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {value.slice(0, 10).map((item, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {item}
                      </Badge>
                    ))}
                    {value.length > 10 && (
                      <Badge variant="outline" className="text-xs">
                        +{value.length - 10} lainnya
                      </Badge>
                    )}
                  </div>
                ) : (
                  <p className="text-slate-600">{value}</p>
                )}
              </div>
            ))}
            {children && <Separator className="my-4" />}
          </div>
        )}
        {children}
      </CardContent>
    </Card>
  );
}

// Helper functions
function getSectionIcon(title) {
  const title_lower = title.toLowerCase();

  if (title_lower.includes("structure"))
    return <MdOutlineScience className="text-indigo-600" />;
  if (title_lower.includes("name") || title_lower.includes("identifier"))
    return <MdBookmark className="text-blue-600" />;
  if (title_lower.includes("chemical") || title_lower.includes("physical"))
    return <MdOutlineScience className="text-purple-600" />;
  if (title_lower.includes("drug") || title_lower.includes("medication"))
    return <MdOutlineMedication className="text-green-600" />;
  if (title_lower.includes("food"))
    return <MdOutlineFoodBank className="text-amber-600" />;
  if (title_lower.includes("agriculture") || title_lower.includes("agro"))
    return <MdOutlineAgricultural className="text-green-700" />;
  if (title_lower.includes("safety") || title_lower.includes("hazard"))
    return <MdOutlineWarningAmber className="text-red-600" />;
  if (title_lower.includes("toxic"))
    return <MdOutlineWarning className="text-red-600" />;
  if (title_lower.includes("pharmaco") || title_lower.includes("biochem"))
    return <MdOutlineBiotech className="text-teal-600" />;
  if (title_lower.includes("use") || title_lower.includes("manufacturing"))
    return <MdOutlineConstruction className="text-amber-700" />;
  if (title_lower.includes("search") || title_lower.includes("literature"))
    return <MdSearch className="text-slate-600" />;

  return <MdOutlineInfo className="text-slate-600" />;
}

function renderSectionIfExists(compound, sectionName, subsectionName) {
  const section = compound.sections[sectionName];
  if (!section) return null;

  const subsection = section.subsections.find((s) => s.name === subsectionName);
  if (!subsection || Object.keys(subsection.data).length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{subsectionName}</CardTitle>
      </CardHeader>
      <CardContent>
        {Object.entries(subsection.data).map(([key, value], idx) => (
          <div key={idx} className="mb-4 last:mb-0">
            <h4 className="font-medium text-slate-700 mb-1">{key}</h4>
            {Array.isArray(value) ? (
              <div className="flex flex-wrap gap-2">
                {value.map((item, i) => (
                  <Badge key={i} variant="secondary">
                    {item}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-slate-600 whitespace-pre-line">{value}</p>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function renderSubsectionContent(compound, sectionName, subsectionName) {
  const section = compound.sections[sectionName];
  if (!section) return <p>Informasi tidak tersedia</p>;

  const subsection = section.subsections.find((s) => s.name === subsectionName);
  if (!subsection || Object.keys(subsection.data).length === 0) {
    return (
      <p className="text-slate-500 italic">
        Data tidak tersedia untuk bagian ini
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {Object.entries(subsection.data).map(([key, value], idx) => (
        <div key={idx}>
          <h4 className="font-medium text-slate-700 mb-1">{key}</h4>
          {Array.isArray(value) ? (
            <div className="flex flex-wrap gap-2">
              {value.map((item, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {item}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-slate-600 whitespace-pre-line">{value}</p>
          )}
        </div>
      ))}

      {/* Display sub-subsections if they exist */}
      {subsection.subsections && subsection.subsections.length > 0 && (
        <div className="mt-6 border-t pt-4">
          <h4 className="font-medium text-slate-700 mb-3">Subtopik</h4>
          <Accordion type="single" collapsible>
            {subsection.subsections.map((subsubsection, idx) => (
              <AccordionItem key={idx} value={`sub-${idx}`}>
                <AccordionTrigger className="text-sm">
                  {subsubsection.name}
                </AccordionTrigger>
                <AccordionContent>
                  {Object.entries(subsubsection.data).length > 0 ? (
                    Object.entries(subsubsection.data).map(
                      ([key, value], i) => (
                        <div key={i} className="mb-3">
                          <h5 className="font-medium text-slate-700 text-sm">
                            {key}
                          </h5>
                          {Array.isArray(value) ? (
                            <div className="flex flex-wrap gap-2 mt-1">
                              {value.map((item, j) => (
                                <Badge
                                  key={j}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {item}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <p className="text-slate-600 text-sm">{value}</p>
                          )}
                        </div>
                      )
                    )
                  ) : (
                    <p className="text-slate-500 italic text-sm">
                      Tidak ada data tersedia
                    </p>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
    </div>
  );
}
