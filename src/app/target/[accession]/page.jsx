"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import {
  ExclamationTriangleIcon,
  DownloadIcon,
  ReloadIcon,
} from "@radix-ui/react-icons";
import { MdOutlineShare, MdFeedback } from "react-icons/md";
import TargetHeader from "./components/TargetHeader";
import TargetInfo from "./components/TargetInfo";
import TargetSequence from "./components/TargetSequence";
import TargetFeatures from "./components/TargetFeatures";
import TargetReferences from "./components/TargetReferences";
import TargetVisualizer from "./components/TargetVisualizer";

export default function TargetPage({ params }) {
  const [target, setTarget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(10);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("info");
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    // Simulasi progress loading untuk UX yang lebih baik
    const loadingInterval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 90) {
          clearInterval(loadingInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 300);

    async function fetchTargetData() {
      try {
        setLoading(true);

        // Tambahkan timeout untuk memastikan progress bar terlihat
        await new Promise((resolve) => setTimeout(resolve, 300));

        const res = await fetch(`/api/target/${params.accession}`);
        if (!res.ok) {
          throw new Error(`Gagal mengambil data target: ${res.status}`);
        }

        const data = await res.json();
        setLoadingProgress(95);

        // Process API response based on source
        if (data.source === "UniProt" && data.data?.results?.[0]) {
          // Process UniProt response
          const uniprotData = processUniProtData(
            data.data.results[0],
            params.accession
          );
          setTarget(uniprotData);
        } else {
          // Direct response from API
          setTarget(data);
        }

        setLoadingProgress(100);
        setLoading(false);
      } catch (err) {
        console.error("Error mengambil data target:", err);
        setError(err.message);
        setLoading(false);
        setLoadingProgress(100);
      }
    }

    fetchTargetData();

    return () => {
      clearInterval(loadingInterval);
    };
  }, [params.accession]);

  // Process UniProt API response to match our target data format
  function processUniProtData(data, accession) {
    // Extract key information from UniProt response
    return {
      accession: accession,
      accessionVersion: accession,
      uniprotId: data.primaryAccession,
      name:
        data.proteinDescription?.recommendedName?.fullName?.value ||
        data.proteinDescription?.submissionNames?.[0]?.fullName?.value ||
        "Protein tidak dikenal",
      organism: data.organism?.scientificName || "Organisme tidak dikenal",
      taxonomy: data.organism?.lineage?.join("; ") || "",
      length: data.sequence?.length || 0,
      sequence: data.sequence?.value || "",
      moleculeType: "Protein",
      version: "",
      updateDate: data.entryAudit?.lastAnnotationUpdateDate || "",
      createDate: data.entryAudit?.firstPublicDate || "",
      function:
        data.comments?.find((c) => c.commentType === "FUNCTION")?.texts?.[0]
          ?.value || "",
      features:
        data.features?.map((feature) => ({
          key: feature.type,
          location: `${feature.location.start.value}..${feature.location.end.value}`,
          qualifiers: {
            description: [feature.description || ""],
          },
        })) || [],
      references:
        data.references?.map((ref) => ({
          title: ref.citation?.title || "",
          authors: ref.citation?.authors?.join(", ") || "",
          journal: `${ref.citation?.journal || ""} ${ref.citation?.volume || ""}${ref.citation?.firstPage ? ":" + ref.citation.firstPage : ""} (${ref.citation?.publicationDate || ""})`,
          pubmed:
            ref.citation?.citationCrossReferences?.find(
              (x) => x.database === "PubMed"
            )?.id || "",
          year: ref.citation?.publicationDate?.substring(0, 4) || "",
        })) || [],
      keywords: data.keywords?.map((k) => k.value) || [],
      geneName: data.genes?.[0]?.geneName?.value || null,
      // Tambahkan data untuk visualizer
      structure:
        data.dbReferences
          ?.filter((ref) => ref.type === "PDB")
          .map((ref) => ({
            id: ref.id,
            method: ref.properties?.method || "",
            resolution: ref.properties?.resolution || "",
          })) || [],
      pathways:
        data.dbReferences
          ?.filter((ref) => ref.type === "Reactome")
          .map((ref) => ({
            id: ref.id,
            name: ref.properties?.pathway || ref.id,
          })) || [],
    };
  }

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    setLoadingProgress(10);
    window.location.reload();
  };

  if (error) {
    return (
      <div className="container mx-auto p-4 md:p-6 lg:p-8 animate-fadeIn">
        <Alert variant="destructive" className="mb-6">
          <ExclamationTriangleIcon className="h-5 w-5" />
          <div className="ml-2">
            <AlertTitle className="text-lg font-semibold">
              Terjadi Kesalahan
            </AlertTitle>
            <AlertDescription className="mt-2">
              Gagal memuat data target: {error}
            </AlertDescription>
          </div>
        </Alert>

        <Card className="p-6 text-center bg-white/50 backdrop-blur-sm">
          <div className="space-y-4">
            <p className="text-gray-700">
              Kami tidak dapat mengambil data protein yang Anda minta saat ini.
              Silakan coba lagi atau kembali ke halaman sebelumnya.
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              <Button onClick={handleRetry} className="flex items-center gap-2">
                <ReloadIcon className="h-4 w-4" />
                Coba Lagi
              </Button>

              <Button variant="outline" onClick={() => window.history.back()}>
                Kembali
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  const handleTabChange = (value) => {
    setActiveTab(value);
    // Scroll ke atas saat tab berubah
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
      {loading ? (
        <div className="space-y-8 animate-fadeIn">
          <div className="mb-8">
            <p className="text-center text-gray-600 mb-2">
              Memuat data protein...
            </p>
            <Progress
              value={loadingProgress}
              className="h-2 w-full max-w-xl mx-auto"
            />
          </div>
          <LoadingSkeleton />
        </div>
      ) : (
        <div className="flex flex-col gap-6 animate-fadeIn">
          <TargetHeader target={target} />

          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <div className="flex justify-between items-center flex-wrap gap-4 mb-4">
              <TabsList className="grid grid-cols-3 sm:grid-cols-5 lg:w-[720px]">
                <TabsTrigger value="info">Informasi</TabsTrigger>
                <TabsTrigger value="sequence">Urutan</TabsTrigger>
                <TabsTrigger value="features">Fitur</TabsTrigger>
                <TabsTrigger value="references">Referensi</TabsTrigger>
                <TabsTrigger value="visualizer">Visualisasi</TabsTrigger>
              </TabsList>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden md:flex items-center gap-1"
                  onClick={() => {
                    // Logika untuk mengunduh data
                    const json = JSON.stringify(target, null, 2);
                    const blob = new Blob([json], { type: "application/json" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.download = `${target.accession}_data.json`;
                    a.href = url;
                    a.click();
                  }}
                >
                  <DownloadIcon className="h-4 w-4" />
                  <span>Unduh Data</span>
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => {
                    // Toggle feedback form
                    setShowFeedback(!showFeedback);
                  }}
                >
                  <MdFeedback className="h-5 w-5 text-gray-600" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => {
                    // Logika untuk membagikan
                    if (navigator.share) {
                      navigator.share({
                        title: `Data Protein ${target.accession}`,
                        text: `Lihat informasi tentang protein ${target.name}`,
                        url: window.location.href,
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      alert("URL disalin ke clipboard!");
                    }
                  }}
                >
                  <MdOutlineShare className="h-5 w-5 text-gray-600" />
                </Button>
              </div>
            </div>

            {showFeedback && (
              <Card className="p-4 mb-4 bg-blue-50 border-blue-200">
                <div className="flex justify-between items-start">
                  <p className="text-sm text-blue-700 mb-2">
                    Bagaimana menurut Anda tentang tampilan data protein ini?
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFeedback(false)}
                  >
                    Tutup
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    🙁 Perlu Perbaikan
                  </Button>
                  <Button variant="outline" size="sm">
                    😐 Cukup Baik
                  </Button>
                  <Button variant="outline" size="sm">
                    😊 Sangat Membantu
                  </Button>
                </div>
              </Card>
            )}

            <ScrollArea className="mt-2 bg-white rounded-lg border p-5 md:p-6 shadow-sm">
              <TabsContent value="info" className="space-y-6">
                <TargetInfo target={target} />
              </TabsContent>
              <TabsContent value="sequence">
                <TargetSequence target={target} />
              </TabsContent>
              <TabsContent value="features">
                <TargetFeatures target={target} />
              </TabsContent>
              <TabsContent value="references">
                <TargetReferences target={target} />
              </TabsContent>
              <TabsContent value="visualizer">
                <TargetVisualizer target={target} />
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>
      )}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-10">
      {/* Header skeleton */}
      <Card className="p-5">
        <div className="flex gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-3 flex-1">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
            <div className="flex flex-wrap gap-2 mt-3">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-28" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-10 w-full sm:w-[600px]" />

        <Card className="p-6">
          <div className="space-y-5">
            <Skeleton className="h-6 w-40" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
            </div>

            <Skeleton className="h-6 w-40 mt-10" />
            <Skeleton className="h-[120px] w-full" />

            <div className="flex flex-wrap gap-2 mt-3">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
