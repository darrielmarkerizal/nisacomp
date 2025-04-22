"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

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
  MdOutlineHealthAndSafety,
  MdOutlineMedicalInformation,
  MdOpenInNew,
  MdZoomIn,
  MdOutlineEco,
  MdOutlineLibraryBooks,
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

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { toast } from "sonner";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import OverviewTab from "./components/tab/OverviewTab";
import ChemistryTab from "./components/tab/ChemistryTab";
import PharmacologyTab from "./components/tab/PharmacologyTab";
import SafetyTab from "./components/tab/SafetyTab";
import FullContentTab from "./components/tab/FullContentTab";
import ResearchTab from "./components/tab/ResearchTab";
import PublicationsTab from "./components/tab/PublicationsTab";

export default function DrugDetailPage() {
  const params = useParams();
  const router = useRouter();
  const cid = params?.cid || "";

  const [compound, setCompound] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);

  useEffect(() => {
    const fetchCompoundData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `/api/obat/${encodeURIComponent(cid)}`
        );

        // Menggunakan data yang diformat untuk kebutuhan UI
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

  const handleTabChange = (value) => {
    setActiveTab(value);
    // Scroll to top when tab changes
    window.scrollTo(0, 0);
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <Skeleton className="h-[250px] w-full rounded-lg" />
          </div>
          <div className="md:col-span-1 lg:col-span-2">
            <Skeleton className="h-8 w-40 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
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
            <div className="flex flex-wrap justify-center mt-4 gap-2">
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
    return Object.keys(compound.formatted.sections).map((key) => {
      const section = compound.formatted.sections[key];
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

  const tableOfContents = formatTableOfContents(compound.formatted.sections);

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
          <div className="flex items-center gap-2">
            <p className="text-sm text-slate-500">CID: {compound.cid}</p>
            <a
              href={compound.pubchemUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:underline flex items-center"
            >
              <MdOpenInNew className="h-3 w-3 mr-0.5" /> PubChem
            </a>
          </div>
        </div>

        <div className="flex items-center space-x-2 print:hidden">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleFavorite}
            className={isFavorite ? "text-red-500 hover:text-red-600" : ""}
            aria-label={isFavorite ? "Hapus dari favorit" : "Tambah ke favorit"}
          >
            {isFavorite ? (
              <MdFavorite className="h-4 w-4" />
            ) : (
              <MdFavoriteBorder className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleShare}
            aria-label="Bagikan"
          >
            <MdShare className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrint}
            aria-label="Cetak"
          >
            <MdOutlinePrint className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Mobile Tab Selection */}
      <div className="md:hidden mb-6 print:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              {getTabName(activeTab)}
              <MdKeyboardArrowDown className="ml-2 h-4 w-4" />
            </Button>
          </SheetTrigger>
          // Di dalam SheetContent (menu mobile)
          <SheetContent side="bottom" className="h-[40vh]">
            <div className="grid gap-1 py-2">
              <Button
                variant={activeTab === "overview" ? "default" : "ghost"}
                className="justify-start"
                onClick={() => {
                  handleTabChange("overview");
                }}
              >
                Ringkasan
              </Button>
              <Button
                variant={activeTab === "chemistry" ? "default" : "ghost"}
                className="justify-start"
                onClick={() => {
                  handleTabChange("chemistry");
                }}
              >
                Kimia
              </Button>
              <Button
                variant={activeTab === "pharmacology" ? "default" : "ghost"}
                className="justify-start"
                onClick={() => {
                  handleTabChange("pharmacology");
                }}
              >
                Farmakologi & Klinis
              </Button>
              <Button
                variant={activeTab === "safety" ? "default" : "ghost"}
                className="justify-start"
                onClick={() => {
                  handleTabChange("safety");
                }}
              >
                Keamanan
              </Button>
              <Button
                variant={activeTab === "publications" ? "default" : "ghost"}
                className="justify-start"
                onClick={() => {
                  handleTabChange("publications");
                }}
              >
                <div className="flex items-center">
                  <MdOutlineLibraryBooks className="mr-2 h-4 w-4" />
                  Publikasi
                </div>
              </Button>
              <Button
                variant={activeTab === "research" ? "default" : "ghost"}
                className="justify-start"
                onClick={() => {
                  handleTabChange("research");
                }}
              >
                <div className="flex items-center">
                  <MdOutlineBiotech className="mr-2 h-4 w-4" />
                  Bioaktivitas
                </div>
              </Button>
              <Button
                variant={activeTab === "full" ? "default" : "ghost"}
                className="justify-start"
                onClick={() => {
                  handleTabChange("full");
                }}
              >
                Konten Lengkap
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main content with tabs */}
      <Tabs
        defaultValue="overview"
        className="print:block"
        value={activeTab}
        onValueChange={handleTabChange}
      >
        <TabsList className="mb-6 print:hidden hidden md:flex">
          <TabsTrigger value="overview">Ringkasan</TabsTrigger>
          <TabsTrigger value="chemistry">Kimia</TabsTrigger>
          <TabsTrigger value="pharmacology">Farmakologi & Klinis</TabsTrigger>
          <TabsTrigger value="safety">Keamanan</TabsTrigger>
          <TabsTrigger value="publications" className="flex items-center gap-1">
            <span>Publikasi</span>
          </TabsTrigger>
          <TabsTrigger value="research" className="flex items-center gap-1">
            <span>Bioaktivitas</span>
          </TabsTrigger>
          <TabsTrigger value="full">Konten Lengkap</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <OverviewTab
            compound={compound}
            imageDialogOpen={imageDialogOpen}
            setImageDialogOpen={setImageDialogOpen}
          />
        </TabsContent>

        {/* Chemistry Tab */}
        <TabsContent value="chemistry" className="space-y-6">
          <ChemistryTab
            compound={compound}
            setImageDialogOpen={setImageDialogOpen}
          />
        </TabsContent>

        <TabsContent value="pharmacology" className="space-y-6">
          <PharmacologyTab
            compound={compound}
            renderSectionIfExists={renderSectionIfExists}
          />
        </TabsContent>

        <TabsContent value="safety" className="space-y-6">
          <SafetyTab
            compound={compound}
            renderSectionIfExists={renderSectionIfExists}
          />
        </TabsContent>

        {/* Full Content Tab */}
        <TabsContent value="full" className="space-y-6">
          <FullContentTab compound={compound} />
        </TabsContent>

        {/* Research Tab */}
        <TabsContent value="research" className="space-y-6">
          <ResearchTab compound={compound} />
        </TabsContent>

        <TabsContent value="publications" className="space-y-6">
          <PublicationsTab compound={compound} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function RenderValue({ value }) {
  if (value === null || value === undefined || value === "N/A") {
    return <p className="text-slate-500 italic">Tidak tersedia</p>;
  }

  if (typeof value === "object") {
    if (value.text && value.text !== "N/A") {
      return <p className="text-slate-600">{value.text}</p>;
    }
    if (value.formatted && value.formatted !== "N/A") {
      return <p className="text-slate-600">{value.formatted}</p>;
    }
    if (value.type === "url" && value.url) {
      return (
        <a
          href={value.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 hover:underline flex items-center"
        >
          {value.url} <MdOpenInNew className="ml-1 h-3 w-3" />
        </a>
      );
    }
    // Check if object has at least one non-N/A value
    const hasValidData = Object.values(value).some((v) => v && v !== "N/A");
    if (!hasValidData) {
      return <p className="text-slate-500 italic">Tidak tersedia</p>;
    }
    return <p className="text-slate-600">{JSON.stringify(value)}</p>;
  }

  // Handle strings
  if (typeof value === "string" && value.trim() === "") {
    return <p className="text-slate-500 italic">Tidak tersedia</p>;
  }

  return <p className="text-slate-600">{value}</p>;
}

function getTabName(tab) {
  switch (tab) {
    case "overview":
      return "Ringkasan";
    case "chemistry":
      return "Kimia";
    case "pharmacology":
      return "Farmakologi & Klinis";
    case "safety":
      return "Keamanan";
    case "publications":
      return "Publikasi";
    case "research":
      return "Bioaktivitas";
    case "full":
      return "Konten Lengkap";
    default:
      return "Ringkasan";
  }
}

function renderSectionIfExists(compound, sectionName, subsectionName) {
  const section = compound.formatted.sections[sectionName];
  if (!section) return null;

  const subsection = section.subsections.find((s) => s.name === subsectionName);
  if (!subsection) return null;

  // Check if subsection has at least one non-N/A value
  const hasValidData = Object.entries(subsection.data).some(
    ([key, valueObj]) => {
      const value = valueObj.value;
      if (Array.isArray(value)) {
        return value.length > 0 && value[0] !== "N/A";
      }
      return value !== null && value !== undefined && value !== "N/A";
    }
  );

  if (!hasValidData) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{subsectionName}</CardTitle>
      </CardHeader>
      <CardContent>
        {Object.entries(subsection.data).map(([key, valueObj], idx) => {
          const value = valueObj.value;
          if (value === "N/A" || value === null || value === undefined)
            return null;

          return (
            <div key={idx} className="mb-4 last:mb-0">
              <h4 className="font-medium text-slate-700 mb-1">{key}</h4>
              {Array.isArray(value) ? (
                value.length > 0 && value[0] !== "N/A" ? (
                  <div className="flex flex-wrap gap-2">
                    {value.map((item, i) => (
                      <Badge key={i} variant="secondary">
                        {item}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 italic">Tidak tersedia</p>
                )
              ) : (
                <RenderValue value={value} />
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
