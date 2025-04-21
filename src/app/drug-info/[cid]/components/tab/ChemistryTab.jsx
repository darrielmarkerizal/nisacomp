import React, { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";

import {
  MdOutlineScience,
  MdBookmark,
  MdOutlineContentCopy,
  MdOutlineInfo,
  MdOutlineZoomIn,
  MdCompare,
  MdOutlineCompare,
  MdAdd,
  MdRemove,
  MdRefresh,
} from "react-icons/md";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
} from "recharts";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function ChemistryTab({ compound }) {
  // State untuk mengelola lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const copyToClipboard = (text, label) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success(`${label} disalin ke clipboard`);
      })
      .catch(() => {
        toast.error("Gagal menyalin teks");
      });
  };

  // Helper function to check if a value is available
  const isValueAvailable = (value) => {
    return value && value !== "N/A";
  };

  // Coding state untuk menampilkan status kopian
  const [copied, setCopied] = React.useState(null);

  // Fungsi untuk menyalin yang menampilkan status
  const copyWithFeedback = (text, identifier) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(identifier);
      toast.success(`Berhasil disalin ke clipboard`);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  // Mengambil formula molekul untuk caption
  const getMolecularFormula = () => {
    const molecularFormulaSection = compound.raw?.Record?.Section?.find(
      (section) => section.TOCHeading === "Molecular Formula"
    );

    if (
      molecularFormulaSection?.Information?.[0]?.Value?.StringWithMarkup?.[0]
        ?.String
    ) {
      return molecularFormulaSection.Information[0].Value.StringWithMarkup[0]
        .String;
    } else if (
      compound.essential.molecularFormula &&
      compound.essential.molecularFormula !== "N/A"
    ) {
      return compound.essential.molecularFormula;
    } else if (
      compound.raw?.Record?.Section?.[2]?.Section?.[2]?.Information?.[0]?.Value
        ?.StringWithMarkup?.[0]?.String
    ) {
      return compound.raw.Record.Section[2].Section[2].Information[0].Value
        .StringWithMarkup[0].String;
    }

    return "Formula tidak tersedia";
  };

  // Slides untuk lightbox
  const slides = [
    {
      src: compound.essential.structureUrl,
      title: `Struktur Molekul ${compound.name}`,
      description: `Formula Molekul: ${getMolecularFormula()}`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Lightbox Component */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={slides}
        plugins={[Zoom, Captions]}
        carousel={{ preload: 1 }}
        zoom={{
          maxZoomPixelRatio: 5,
          zoomInMultiplier: 1.5,
          doubleTapDelay: 300,
          doubleClickDelay: 300,
          keyboardMoveDistance: 50,
        }}
        captions={{
          showToggle: true,
          descriptionMaxLines: 3,
        }}
        controller={{ closeOnBackdropClick: true }}
        styles={{
          container: { backgroundColor: "rgba(0, 0, 0, .9)" },
          captionsTitle: { fontSize: "1.1rem", fontWeight: "600" },
          captionsDescription: { fontSize: "0.9rem" },
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <Card className="md:col-span-1">
          <CardHeader className="border-b pb-3">
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-indigo-50 rounded-full">
                <MdOutlineScience className="text-indigo-600 h-5 w-5" />
              </div>
              <span>Struktur Molekul</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center pt-4">
            <div className="p-2 bg-white rounded-lg shadow-sm border relative">
              <TransformWrapper
                initialScale={1}
                minScale={0.5}
                maxScale={3}
                wheel={{ step: 0.1 }}
              >
                {({ zoomIn, zoomOut, resetTransform }) => (
                  <>
                    <div className="absolute top-2 right-2 z-10 flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 bg-white/80 backdrop-blur-sm hover:bg-white"
                        onClick={() => zoomIn()}
                      >
                        <MdAdd className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 bg-white/80 backdrop-blur-sm hover:bg-white"
                        onClick={() => zoomOut()}
                      >
                        <MdRemove className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 bg-white/80 backdrop-blur-sm hover:bg-white"
                        onClick={() => resetTransform()}
                      >
                        <MdRefresh className="h-4 w-4" />
                      </Button>
                    </div>
                    <TransformComponent>
                      <Image
                        src={compound.essential.structureUrl}
                        alt={`Struktur kimia ${compound.name}`}
                        width={200}
                        height={200}
                        className="mx-auto"
                      />
                    </TransformComponent>
                  </>
                )}
              </TransformWrapper>
            </div>
            <p className="text-xs text-center text-slate-500 mt-2">
              Gestur pinch untuk memperbesar, ketuk dua kali untuk memperbesar
              spesifik
            </p>
            <Button
              size="sm"
              variant="secondary"
              className="mt-2"
              onClick={() => setLightboxOpen(true)}
            >
              <MdOutlineZoomIn className="mr-1 h-4 w-4" />
              Perbesar Gambar
            </Button>

            {/* Tampilkan formula molekul - tetap sama */}
            <div className="mt-4 space-y-2">
              <div className="font-medium text-slate-800">
                {(() => {
                  // Get Formula Molekul dari path yang benar - SAMA dengan OverviewTab
                  const molecularFormulaSection =
                    compound.raw?.Record?.Section?.find(
                      (section) => section.TOCHeading === "Molecular Formula"
                    );

                  let formula = null;

                  if (
                    molecularFormulaSection?.Information?.[0]?.Value
                      ?.StringWithMarkup?.[0]?.String
                  ) {
                    formula =
                      molecularFormulaSection.Information[0].Value
                        .StringWithMarkup[0].String;
                  } else if (
                    compound.essential.molecularFormula &&
                    compound.essential.molecularFormula !== "N/A"
                  ) {
                    formula = compound.essential.molecularFormula;
                  } else if (
                    compound.raw?.Record?.Section?.[2]?.Section?.[2]
                      ?.Information?.[0]?.Value?.StringWithMarkup?.[0]?.String
                  ) {
                    // Path tambahan dari OverviewTab
                    formula =
                      compound.raw.Record.Section[2].Section[2].Information[0]
                        .Value.StringWithMarkup[0].String;
                  }

                  if (formula) {
                    return formula.split("").map((char, index) => {
                      return /\d/.test(char) ? (
                        <sub key={index}>{char}</sub>
                      ) : (
                        char
                      );
                    });
                  } else {
                    return "Formula tidak tersedia";
                  }
                })()}
              </div>
              <p className="text-sm text-slate-500">Formula Molekul</p>
            </div>
          </CardContent>
        </Card>

        {/* Properti kimia dengan responsivitas lebih baik */}
        <div className="md:col-span-1 lg:col-span-2">
          <Card>
            <CardHeader className="border-b pb-3">
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-indigo-50 rounded-full">
                  <MdOutlineScience className="text-indigo-600 h-5 w-5" />
                </div>
                <span>Properti Kimia</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ScrollArea className="w-full overflow-auto max-h-[350px] md:max-h-[400px] lg:max-h-[450px]">
                <ChemicalPropertiesTable compound={compound} />
              </ScrollArea>
              <ChemicalPropertiesChart compound={compound} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bagian Identifikasi & Nama Lain tetap sama */}
      <Card>
        <CardHeader className="border-b pb-3">
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-green-50 rounded-full">
              <MdBookmark className="text-green-600 h-5 w-5" />
            </div>
            <span>Identifikasi & Nama Lain</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-5 pt-4">
          <div>
            <h3 className="text-xs sm:text-sm font-medium text-slate-500 mb-1.5">
              Nama IUPAC
            </h3>
            <div className="font-medium break-words p-2 sm:p-3 bg-slate-50 rounded-md border border-slate-100 relative text-xs sm:text-sm">
              {(() => {
                // Gunakan path yang sama dengan OverviewTab untuk IUPAC name
                const iupacNameSection =
                  compound.raw?.Record?.Section?.[2]?.Section?.[1]
                    ?.Section?.[0];
                let iupacName = null;

                if (
                  iupacNameSection?.Information?.[0]?.Value
                    ?.StringWithMarkup?.[0]?.String
                ) {
                  iupacName =
                    iupacNameSection.Information[0].Value.StringWithMarkup[0]
                      .String;
                } else if (
                  compound.essential.iupacName &&
                  compound.essential.iupacName !== "N/A"
                ) {
                  iupacName = compound.essential.iupacName;
                }

                if (iupacName) {
                  return (
                    <>
                      {iupacName}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2"
                        onClick={() => copyToClipboard(iupacName, "Nama IUPAC")}
                      >
                        <MdOutlineContentCopy className="h-4 w-4" />
                      </Button>
                    </>
                  );
                } else {
                  return (
                    <span className="text-slate-400 italic">
                      Tidak tersedia
                    </span>
                  );
                }
              })()}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <h3 className="text-xs sm:text-sm font-medium text-slate-500 flex items-center gap-1 mb-1.5 cursor-help">
                      InChIKey
                      <span className="inline-block w-4 h-4 rounded-full bg-slate-100 text-slate-500 text-xs flex items-center justify-center">
                        ?
                      </span>
                    </h3>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-xs">
                      InChIKey adalah pengidentifikasi unik terstandarisasi
                      untuk senyawa kimia, digunakan untuk pencarian database
                      dan sebagai referensi singkat.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <div className="relative">
                {(() => {
                  // Gunakan path yang sama dengan OverviewTab untuk InChIKey
                  const inchiKeySection =
                    compound.raw?.Record?.Section?.[2]?.Section?.[1]
                      ?.Section?.[2];
                  let inchiKey = null;

                  if (
                    inchiKeySection?.Information?.[0]?.Value
                      ?.StringWithMarkup?.[0]?.String
                  ) {
                    inchiKey =
                      inchiKeySection.Information[0].Value.StringWithMarkup[0]
                        .String;
                  } else if (
                    compound.essential.inchiKey &&
                    compound.essential.inchiKey !== "N/A"
                  ) {
                    inchiKey = compound.essential.inchiKey;
                  }

                  if (inchiKey) {
                    return (
                      <>
                        <p className="font-mono text-xs bg-slate-50 p-2.5 rounded border border-slate-200 overflow-auto">
                          {inchiKey}
                        </p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-2"
                          onClick={() => copyToClipboard(inchiKey, "InChIKey")}
                        >
                          <MdOutlineContentCopy className="h-3.5 w-3.5" />
                        </Button>
                      </>
                    );
                  } else {
                    return (
                      <p className="font-mono text-xs bg-slate-50 p-2.5 rounded border border-slate-200 overflow-auto text-slate-400 italic">
                        Tidak tersedia
                      </p>
                    );
                  }
                })()}
              </div>
            </div>

            <div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <h3 className="text-xs sm:text-sm font-medium text-slate-500 flex items-center gap-1 mb-1.5 cursor-help">
                      SMILES
                      <span className="inline-block w-4 h-4 rounded-full bg-slate-100 text-slate-500 text-xs flex items-center justify-center">
                        ?
                      </span>
                    </h3>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-xs">
                      SMILES adalah notasi linear untuk merepresentasikan
                      struktur molekul menggunakan string ASCII.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <div className="relative">
                {(() => {
                  // Gunakan path yang sama dengan OverviewTab untuk SMILES
                  const smilesSection =
                    compound.raw?.Record?.Section?.[2]?.Section?.[1]
                      ?.Section?.[3];
                  let smiles = null;

                  if (
                    smilesSection?.Information?.[0]?.Value
                      ?.StringWithMarkup?.[0]?.String
                  ) {
                    smiles =
                      smilesSection.Information[0].Value.StringWithMarkup[0]
                        .String;
                  } else if (
                    compound.essential.canonicalSmiles &&
                    compound.essential.canonicalSmiles !== "N/A"
                  ) {
                    smiles = compound.essential.canonicalSmiles;
                  }

                  if (smiles) {
                    return (
                      <>
                        <p className="font-mono text-xs bg-slate-50 p-2.5 rounded border border-slate-200 overflow-auto max-h-16">
                          {smiles}
                        </p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-2"
                          onClick={() => copyToClipboard(smiles, "SMILES")}
                        >
                          <MdOutlineContentCopy className="h-3.5 w-3.5" />
                        </Button>
                      </>
                    );
                  } else {
                    return (
                      <p className="font-mono text-xs bg-slate-50 p-2.5 rounded border border-slate-200 overflow-auto text-slate-400 italic">
                        Tidak tersedia
                      </p>
                    );
                  }
                })()}
              </div>
            </div>
          </div>

          {compound.essential.synonyms[0] !== "N/A" && (
            <div className="pt-2">
              <h3 className="text-xs sm:text-sm font-medium text-slate-500 mb-2">
                Sinonim & Nama Lain
              </h3>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {compound.essential.synonyms
                  .slice(0, 10)
                  .map((synonym, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="text-2xs sm:text-xs py-0.5 sm:py-1 px-1.5 sm:px-2"
                    >
                      {synonym}
                    </Badge>
                  ))}
              </div>
              {compound.essential.synonyms.length > 10 && (
                <Accordion type="single" collapsible className="mt-2">
                  <AccordionItem value="more-synonyms" className="border-none">
                    <AccordionTrigger className="text-2xs sm:text-xs text-slate-600 py-1.5 sm:py-2 hover:no-underline">
                      <span className="text-blue-600">
                        Tampilkan {compound.essential.synonyms.length - 10} nama
                        lainnya
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2">
                        {compound.essential.synonyms
                          .slice(10)
                          .map((synonym, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="text-2xs sm:text-xs bg-slate-50"
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

          {/* Identifiers lainnya */}
          {compound.raw?.Record?.Section?.[2]?.Section?.[3] && (
            <div className="pt-2 mt-4 border-t border-slate-100">
              <h3 className="text-sm font-medium text-slate-700 mb-2">
                Identifikasi Tambahan
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                {/* CAS Number */}
                {compound.raw?.Record?.Section?.[2]?.Section?.[3]?.Section?.[0]
                  ?.Information?.[0]?.Value?.StringWithMarkup?.[0]?.String && (
                  <div className="bg-slate-50 p-2 rounded-md border border-slate-100">
                    <span className="font-medium text-xs text-slate-500 block mb-1">
                      CAS Registry Number
                    </span>
                    <span className="font-mono text-xs">
                      {
                        compound.raw.Record.Section[2].Section[3].Section[0]
                          .Information[0].Value.StringWithMarkup[0].String
                      }
                    </span>
                  </div>
                )}

                {/* EC Number */}
                {compound.raw?.Record?.Section?.[2]?.Section?.[3]?.Section?.[3]
                  ?.Information?.[0]?.Value?.StringWithMarkup?.[0]?.String && (
                  <div className="bg-slate-50 p-2 rounded-md border border-slate-100">
                    <span className="font-medium text-xs text-slate-500 block mb-1">
                      EC Number
                    </span>
                    <span className="font-mono text-xs">
                      {
                        compound.raw.Record.Section[2].Section[3].Section[3]
                          .Information[0].Value.StringWithMarkup[0].String
                      }
                    </span>
                  </div>
                )}

                {/* UNII */}
                {compound.raw?.Record?.Section?.[2]?.Section?.[3]?.Section?.[4]
                  ?.Information?.[0]?.Value?.StringWithMarkup?.[0]?.String && (
                  <div className="bg-slate-50 p-2 rounded-md border border-slate-100">
                    <span className="font-medium text-xs text-slate-500 block mb-1">
                      UNII
                    </span>
                    <span className="font-mono text-xs">
                      {
                        compound.raw.Record.Section[2].Section[3].Section[4]
                          .Information[0].Value.StringWithMarkup[0].String
                      }
                    </span>
                  </div>
                )}

                {/* ChEBI ID */}
                {compound.raw?.Record?.Section?.[2]?.Section?.[3]?.Section?.[5]
                  ?.Information?.[0]?.Value?.StringWithMarkup?.[0]?.String && (
                  <div className="bg-slate-50 p-2 rounded-md border border-slate-100">
                    <span className="font-medium text-xs text-slate-500 block mb-1">
                      ChEBI ID
                    </span>
                    <span className="font-mono text-xs">
                      {
                        compound.raw.Record.Section[2].Section[3].Section[5]
                          .Information[0].Value.StringWithMarkup[0].String
                      }
                    </span>
                  </div>
                )}

                {/* DrugBank ID */}
                {compound.raw?.Record?.Section?.[2]?.Section?.[3]?.Section?.[7]
                  ?.Information?.[0]?.Value?.StringWithMarkup?.[0]?.String && (
                  <div className="bg-slate-50 p-2 rounded-md border border-slate-100">
                    <span className="font-medium text-xs text-slate-500 block mb-1">
                      DrugBank ID
                    </span>
                    <span className="font-mono text-xs">
                      {
                        compound.raw.Record.Section[2].Section[3].Section[7]
                          .Information[0].Value.StringWithMarkup[0].String
                      }
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <SimilarCompounds compound={compound} />
    </div>
  );
}

// Helper component untuk tabel properti kimia
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

  // Initialize with core properties, filtering out N/A values
  const tableData = [];

  // Get Formula Molekul dari path yang benar
  const molecularFormulaSection = compound.raw?.Record?.Section?.find(
    (section) => section.TOCHeading === "Molecular Formula"
  );

  if (
    molecularFormulaSection?.Information?.[0]?.Value?.StringWithMarkup?.[0]
      ?.String
  ) {
    tableData.push({
      label: "Formula Molekul",
      value: formatFormula(
        molecularFormulaSection.Information[0].Value.StringWithMarkup[0].String
      ),
    });
  } else if (
    compound.essential.molecularFormula &&
    compound.essential.molecularFormula !== "N/A"
  ) {
    tableData.push({
      label: "Formula Molekul",
      value: formatFormula(compound.essential.molecularFormula),
    });
  }

  // Get Berat Molekul dari path yang benar
  const chemicalSection = compound.raw?.Record?.Section?.find(
    (section) => section.TOCHeading === "Chemical and Physical Properties"
  );

  const computedPropertiesSection = chemicalSection?.Section?.find(
    (section) => section.TOCHeading === "Computed Properties"
  );

  const molecularWeightSection = computedPropertiesSection?.Section?.find(
    (section) => section.TOCHeading === "Molecular Weight"
  );

  if (
    molecularWeightSection?.Information?.[0]?.Value?.StringWithMarkup?.[0]
      ?.String
  ) {
    const weight =
      molecularWeightSection.Information[0].Value.StringWithMarkup[0].String;
    const unit = molecularWeightSection.Information[0].Value.Unit || "g/mol";
    tableData.push({
      label: "Berat Molekul",
      value: `${weight} ${unit}`,
    });
  } else if (
    compound.essential.molecularWeight &&
    compound.essential.molecularWeight !== "N/A"
  ) {
    tableData.push({
      label: "Berat Molekul",
      value: compound.essential.molecularWeight,
    });
  }

  // Add XLogP3 from CSV if available
  if (
    compound.raw?.Record?.Section?.[3]?.Section?.[0]?.Section?.[1]
      ?.Information?.[0]?.Value?.Number?.[0] !== undefined
  ) {
    tableData.push({
      label: "XLogP3",
      value:
        compound.raw.Record.Section[3].Section[0].Section[1].Information[0]
          .Value.Number[0],
    });
  }

  // Add Hydrogen Bond Donor Count from CSV
  if (
    compound.raw?.Record?.Section?.[3]?.Section?.[0]?.Section?.[2]
      ?.Information?.[0]?.Value?.Number?.[0] !== undefined
  ) {
    tableData.push({
      label: "Jumlah Donor Ikatan Hidrogen",
      value:
        compound.raw.Record.Section[3].Section[0].Section[2].Information[0]
          .Value.Number[0],
    });
  }

  // Add Hydrogen Bond Acceptor Count from CSV
  if (
    compound.raw?.Record?.Section?.[3]?.Section?.[0]?.Section?.[3]
      ?.Information?.[0]?.Value?.Number?.[0] !== undefined
  ) {
    tableData.push({
      label: "Jumlah Akseptor Ikatan Hidrogen",
      value:
        compound.raw.Record.Section[3].Section[0].Section[3].Information[0]
          .Value.Number[0],
    });
  }

  // Add Rotatable Bond Count from CSV
  if (
    compound.raw?.Record?.Section?.[3]?.Section?.[0]?.Section?.[4]
      ?.Information?.[0]?.Value?.Number?.[0] !== undefined
  ) {
    tableData.push({
      label: "Jumlah Ikatan Dapat Diputar",
      value:
        compound.raw.Record.Section[3].Section[0].Section[4].Information[0]
          .Value.Number[0],
    });
  }

  // Add Exact Mass from CSV
  if (
    compound.raw?.Record?.Section?.[3]?.Section?.[0]?.Section?.[5]
      ?.Information?.[0]?.Value?.StringWithMarkup?.[0]?.String
  ) {
    tableData.push({
      label: "Massa Tepat",
      value:
        compound.raw.Record.Section[3].Section[0].Section[5].Information[0]
          .Value.StringWithMarkup[0].String + " Da",
    });
  }

  // Add Topological Polar Surface Area from CSV
  if (
    compound.raw?.Record?.Section?.[3]?.Section?.[0]?.Section?.[7]
      ?.Information?.[0]?.Value?.Number?.[0] !== undefined
  ) {
    tableData.push({
      label: "Luas Permukaan Polar Topologi",
      value:
        compound.raw.Record.Section[3].Section[0].Section[7].Information[0]
          .Value.Number[0] + " Å²",
    });
  }

  // Add Heavy Atom Count from CSV
  if (
    compound.raw?.Record?.Section?.[3]?.Section?.[0]?.Section?.[8]
      ?.Information?.[0]?.Value?.Number?.[0] !== undefined
  ) {
    tableData.push({
      label: "Jumlah Atom Berat",
      value:
        compound.raw.Record.Section[3].Section[0].Section[8].Information[0]
          .Value.Number[0],
    });
  }

  // Add Complexity from CSV
  if (
    compound.raw?.Record?.Section?.[3]?.Section?.[0]?.Section?.[10]
      ?.Information?.[0]?.Value?.Number?.[0] !== undefined
  ) {
    tableData.push({
      label: "Kompleksitas",
      value:
        compound.raw.Record.Section[3].Section[0].Section[10].Information[0]
          .Value.Number[0],
    });
  }

  // Add experimental properties from CSV
  const expProperties = compound.raw?.Record?.Section?.[3]?.Section?.[1];
  if (expProperties) {
    // Add Melting Point
    if (expProperties.Section?.[5]?.Information?.[0]?.Value?.Number?.[0]) {
      tableData.push({
        label: "Titik Leleh",
        value: expProperties.Section[5].Information[0].Value.Number[0] + " °C",
      });
    }

    // Add Boiling Point
    if (expProperties.Section?.[4]?.Information?.[0]?.Value?.Number?.[0]) {
      tableData.push({
        label: "Titik Didih",
        value: expProperties.Section[4].Information[0].Value.Number[0] + " K",
      });
    }

    // Add Solubility
    if (
      expProperties.Section?.[6]?.Information?.[0]?.Value?.StringWithMarkup?.[0]
        ?.String
    ) {
      tableData.push({
        label: "Kelarutan",
        value:
          expProperties.Section[6].Information[0].Value.StringWithMarkup[0]
            .String,
      });
    }

    // Add LogP
    if (expProperties.Section?.[7]?.Information?.[0]?.Value?.Number?.[0]) {
      tableData.push({
        label: "LogP",
        value: expProperties.Section[7].Information[0].Value.Number[0],
      });
    }
  }

  // If no data is available, show a message
  if (tableData.length === 0) {
    return (
      <div className="py-10 text-center">
        <div className="inline-flex items-center justify-center p-4 rounded-full bg-slate-100 mb-3">
          <MdOutlineInfo className="h-6 w-6 text-slate-500" />
        </div>
        <p className="text-slate-600 font-medium">
          Properti kimia tidak tersedia untuk senyawa ini
        </p>
      </div>
    );
  }

  // Tampilan tabel yang diperbarui dengan UI modern dan responsif
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 shadow-sm">
      <Table>
        <TableHeader className="bg-gradient-to-r from-slate-50 to-slate-100 sticky top-0 z-10">
          <TableRow>
            <TableHead className="w-[40%] sm:w-1/3 font-medium text-slate-700 py-2.5 sm:py-3.5 px-3 sm:px-4">
              <span className="block text-xs sm:text-sm">Properti</span>
            </TableHead>
            <TableHead className="font-medium text-slate-700 py-2.5 sm:py-3.5 px-3 sm:px-4">
              <span className="block text-xs sm:text-sm">Nilai</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableData.map((row, index) => (
            <TableRow
              key={index}
              className={`transition-colors border-b last:border-0 ${
                index % 2 === 0 ? "bg-white" : "bg-slate-50/40"
              } hover:bg-slate-100/40`}
            >
              <TableCell className="font-medium text-slate-700 py-2 sm:py-3.5 px-3 sm:px-4">
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="text-xs sm:text-sm leading-relaxed">
                    {row.label}
                  </span>
                </div>
              </TableCell>
              <TableCell className="py-2 sm:py-3.5 px-3 sm:px-4">
                {row.isCode ? (
                  <div className="w-full overflow-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
                    <span className="font-mono text-2xs sm:text-xs bg-white p-1.5 sm:p-2 rounded-md border border-slate-200 inline-block shadow-sm">
                      {row.value}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <span className="text-xs sm:text-sm text-slate-800 font-medium break-words">
                      {row.value}
                    </span>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// Tambahkan fungsi untuk menampilkan diagram di bawah tabel properti
function ChemicalPropertiesChart({ compound }) {
  // Data untuk properti yang dapat divisualisasikan dengan diagram
  const chartData = [
    {
      name: "XLogP3",
      value:
        compound.raw?.Record?.Section?.[3]?.Section?.[0]?.Section?.[1]
          ?.Information?.[0]?.Value?.Number?.[0] || 0,
    },
    {
      name: "HB Donor",
      value:
        compound.raw?.Record?.Section?.[3]?.Section?.[0]?.Section?.[2]
          ?.Information?.[0]?.Value?.Number?.[0] || 0,
    },
    {
      name: "HB Acceptor",
      value:
        compound.raw?.Record?.Section?.[3]?.Section?.[0]?.Section?.[3]
          ?.Information?.[0]?.Value?.Number?.[0] || 0,
    },
    {
      name: "Rot. Bonds",
      value:
        compound.raw?.Record?.Section?.[3]?.Section?.[0]?.Section?.[4]
          ?.Information?.[0]?.Value?.Number?.[0] || 0,
    },
  ].filter((item) => item.value !== 0);

  if (chartData.length === 0) return null;

  return (
    <div className="mt-4 sm:mt-6 border border-slate-200 rounded-lg p-3 sm:p-4 bg-white">
      <h3 className="text-xs sm:text-sm font-medium text-slate-700 mb-2 sm:mb-4">
        Visualisasi Properti
      </h3>
      <ResponsiveContainer width="100%" height={180} minHeight={150}>
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
        >
          <XAxis
            dataKey="name"
            fontSize={10}
            tickMargin={5}
            tick={{ fontSize: "0.65rem" }}
          />
          <RechartsTooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-slate-800 text-white text-2xs sm:text-xs p-1.5 sm:p-2 rounded shadow">
                    <p>{`${payload[0].name}: ${payload[0].value}`}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar
            dataKey="value"
            fill="#6366f1"
            radius={[4, 4, 0, 0]}
            barSize={window.innerWidth < 640 ? 20 : 30}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// Perbarui komponen SimilarCompounds
function SimilarCompounds({ compound }) {
  const [loading, setLoading] = useState(false);
  const [similarCompounds, setSimilarCompounds] = useState([]);
  const [error, setError] = useState(null);
  const router = useRouter();

  const [compareDialog, setCompareDialog] = useState(false);
  const [compoundToCompare, setCompoundToCompare] = useState(null);

  const fetchSimilarCompounds = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/obat/similar?cid=${compound.cid}&limit=6`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Gagal mengambil data senyawa serupa"
        );
      }

      const data = await response.json();
      setSimilarCompounds(data.data || []);
    } catch (err) {
      console.error("Error fetching similar compounds:", err);
      setError(err.message);
      toast.error("Gagal mengambil data senyawa serupa");
    } finally {
      setLoading(false);
    }
  };

  const formatFormula = (formula) => {
    if (!formula) return "N/A";

    return formula.split("").map((char, index) => {
      if (/\d/.test(char)) {
        return <sub key={index}>{char}</sub>;
      }
      return char;
    });
  };

  const startComparison = (similar) => {
    setCompoundToCompare(similar);
    setCompareDialog(true);
  };

  return (
    <Card className="mt-4 sm:mt-6">
      <CardHeader className="border-b pb-3">
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 bg-green-50 rounded-full">
            <MdCompare className="text-green-600 h-5 w-5" />
          </div>
          <span>Senyawa Serupa</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {similarCompounds.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {similarCompounds.map((similar) => (
              <div
                key={similar.cid}
                className="group cursor-pointer"
                onClick={() => startComparison(similar)}
              >
                <div className="relative border border-slate-200 bg-white rounded-lg p-3 sm:p-4 shadow-sm transition-shadow hover:shadow-md hover:border-indigo-200">
                  <div className="absolute top-2 right-2 bg-indigo-100 text-indigo-700 text-2xs sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                    {similar.similarity_score}% mirip
                  </div>

                  <div className="flex items-center justify-center mb-2 sm:mb-3 bg-slate-50 p-1.5 sm:p-2 rounded-md">
                    <Image
                      src={similar.thumbnail_url}
                      alt={similar.name}
                      width={window.innerWidth < 640 ? 80 : 120}
                      height={window.innerWidth < 640 ? 80 : 120}
                      className="transition-transform group-hover:scale-105"
                    />
                  </div>

                  <h3 className="text-2xs sm:text-sm font-medium text-slate-900 truncate mb-0.5 sm:mb-1">
                    {similar.name}
                  </h3>

                  <div className="text-2xs sm:text-xs text-slate-600 mb-1 sm:mb-2">
                    <span className="font-medium">Formula:</span>{" "}
                    {formatFormula(similar.formula)}
                  </div>

                  <div className="flex items-center justify-between text-2xs sm:text-xs text-slate-500">
                    <span>MW: {similar.weight}</span>
                    <span>CID: {similar.cid}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-6 sm:py-8 text-center">
            <div className="p-2 sm:p-3 bg-slate-100 rounded-full mb-2 sm:mb-3">
              <MdOutlineScience className="h-5 sm:h-6 w-5 sm:w-6 text-slate-500" />
            </div>
            <h3 className="text-sm sm:text-base text-slate-700 font-medium mb-1">
              Bandingkan dengan senyawa serupa
            </h3>
            <p className="text-2xs sm:text-sm text-slate-500 mb-3 sm:mb-4 max-w-xs sm:max-w-sm mx-auto">
              Lihat perbandingan properti kimia dengan senyawa yang memiliki
              struktur serupa
            </p>
            <Button
              variant="outline"
              className="gap-1 sm:gap-2 text-xs sm:text-sm py-1 sm:py-2 h-auto"
              onClick={fetchSimilarCompounds}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="h-3 w-3 sm:h-4 sm:w-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin mr-0.5 sm:mr-1"></div>
                  <span>Mencari...</span>
                </>
              ) : (
                <>
                  <MdOutlineCompare className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Temukan Senyawa Serupa</span>
                </>
              )}
            </Button>
            {error && (
              <p className="text-red-500 text-2xs sm:text-xs mt-2">{error}</p>
            )}
          </div>
        )}
      </CardContent>

      <Dialog open={compareDialog} onOpenChange={setCompareDialog}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MdCompare className="h-4 sm:h-5 w-4 sm:w-5" />
              <span className="text-sm sm:text-base">Perbandingan Senyawa</span>
            </DialogTitle>
            <DialogClose />
          </DialogHeader>

          {compoundToCompare && (
            <div className="py-2 sm:py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="border border-slate-200 rounded-lg p-4">
                  <div className="text-center mb-3">
                    <h3 className="font-medium text-lg">{compound.name}</h3>
                    <p className="text-xs text-slate-500">
                      CID: {compound.cid}
                    </p>
                  </div>

                  <div className="flex justify-center mb-4">
                    <Image
                      src={compound.essential.structureUrl}
                      alt={compound.name}
                      width={180}
                      height={180}
                      className="bg-white p-2 border rounded-md"
                    />
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center border-b pb-1">
                      <span className="font-medium">Formula</span>
                      <span>
                        {(() => {
                          const molecularFormulaSection =
                            compound.raw?.Record?.Section?.find(
                              (section) =>
                                section.TOCHeading === "Molecular Formula"
                            );

                          let formula = null;

                          if (
                            molecularFormulaSection?.Information?.[0]?.Value
                              ?.StringWithMarkup?.[0]?.String
                          ) {
                            formula =
                              molecularFormulaSection.Information[0].Value
                                .StringWithMarkup[0].String;
                          } else if (
                            compound.essential.molecularFormula &&
                            compound.essential.molecularFormula !== "N/A"
                          ) {
                            formula = compound.essential.molecularFormula;
                          } else if (
                            compound.raw?.Record?.Section?.[2]?.Section?.[2]
                              ?.Information?.[0]?.Value?.StringWithMarkup?.[0]
                              ?.String
                          ) {
                            formula =
                              compound.raw.Record.Section[2].Section[2]
                                .Information[0].Value.StringWithMarkup[0]
                                .String;
                          }

                          return formula
                            ? formatFormula(formula)
                            : "Tidak tersedia";
                        })()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-b pb-1">
                      <span className="font-medium">Berat Molekul</span>
                      <span>
                        {(() => {
                          const chemicalSection =
                            compound.raw?.Record?.Section?.find(
                              (section) =>
                                section.TOCHeading ===
                                "Chemical and Physical Properties"
                            );

                          const computedPropertiesSection =
                            chemicalSection?.Section?.find(
                              (section) =>
                                section.TOCHeading === "Computed Properties"
                            );

                          const molecularWeightSection =
                            computedPropertiesSection?.Section?.find(
                              (section) =>
                                section.TOCHeading === "Molecular Weight"
                            );

                          if (
                            molecularWeightSection?.Information?.[0]?.Value
                              ?.StringWithMarkup?.[0]?.String
                          ) {
                            const weight =
                              molecularWeightSection.Information[0].Value
                                .StringWithMarkup[0].String;
                            const unit =
                              molecularWeightSection.Information[0].Value
                                .Unit || "g/mol";
                            return `${weight} ${unit}`;
                          } else if (
                            compound.essential.molecularWeight &&
                            compound.essential.molecularWeight !== "N/A"
                          ) {
                            return compound.essential.molecularWeight;
                          }

                          return "Tidak tersedia";
                        })()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-b pb-1">
                      <span className="font-medium">XLogP3</span>
                      <span>
                        {compound.raw?.Record?.Section?.[3]?.Section?.[0]
                          ?.Section?.[1]?.Information?.[0]?.Value
                          ?.Number?.[0] !== undefined
                          ? compound.raw.Record.Section[3].Section[0].Section[1]
                              .Information[0].Value.Number[0]
                          : "Tidak tersedia"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-b pb-1">
                      <span className="font-medium">HB Donor</span>
                      <span>
                        {compound.raw?.Record?.Section?.[3]?.Section?.[0]
                          ?.Section?.[2]?.Information?.[0]?.Value
                          ?.Number?.[0] !== undefined
                          ? compound.raw.Record.Section[3].Section[0].Section[2]
                              .Information[0].Value.Number[0]
                          : "Tidak tersedia"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-b pb-1">
                      <span className="font-medium">HB Acceptor</span>
                      <span>
                        {compound.raw?.Record?.Section?.[3]?.Section?.[0]
                          ?.Section?.[3]?.Information?.[0]?.Value
                          ?.Number?.[0] !== undefined
                          ? compound.raw.Record.Section[3].Section[0].Section[3]
                              .Information[0].Value.Number[0]
                          : "Tidak tersedia"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                  <div className="text-center mb-3">
                    <h3 className="font-medium text-lg">
                      {compoundToCompare.name}
                    </h3>
                    <p className="text-xs text-slate-500">
                      CID: {compoundToCompare.cid}
                    </p>
                  </div>

                  <div className="flex justify-center mb-4">
                    <Image
                      src={compoundToCompare.structure_url}
                      alt={compoundToCompare.name}
                      width={180}
                      height={180}
                      className="bg-white p-2 border rounded-md"
                    />
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center border-b pb-1">
                      <span className="font-medium">Formula</span>
                      <span>{formatFormula(compoundToCompare.formula)}</span>
                    </div>
                    <div className="flex justify-between items-center border-b pb-1">
                      <span className="font-medium">Berat Molekul</span>
                      <span>{compoundToCompare.weight}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <Button
                  variant="outline"
                  className="mr-2"
                  onClick={() => setCompareDialog(false)}
                >
                  Tutup
                </Button>
                <Button
                  onClick={() =>
                    router.push(`/drug-info/${compoundToCompare.cid}`)
                  }
                >
                  Lihat Detail
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export default ChemistryTab;
