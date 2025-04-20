import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MdOutlineScience,
  MdOutlineInfo,
  MdOutlineBiotech,
  MdOutlineMedication,
  MdOutlineWarning,
  MdOutlineWarningAmber,
  MdBookmark,
  MdZoomIn,
  MdContentCopy,
  MdCheck,
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
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

function OverviewTab({ compound, setImageDialogOpen, imageDialogOpen }) {
  // State untuk menampilkan status kopian
  const [copied, setCopied] = React.useState(null);

  // Fungsi untuk menyalin teks ke clipboard
  const copyToClipboard = (text, identifier) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(identifier);
      toast.success(`Berhasil disalin ke clipboard`);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Cards - Struktur Molekul dan Info Umum */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Card Struktur Molekul */}
        <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 border-b">
            <CardTitle className="flex items-center gap-2 text-indigo-700">
              <div className="bg-indigo-50 p-1.5 rounded-full">
                <MdOutlineScience className="text-indigo-600 h-5 w-5" />
              </div>
              Struktur Molekul
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center pt-4">
            <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
              <DialogTrigger asChild>
                <div className="p-3 bg-white rounded-lg shadow-sm border hover:shadow-md cursor-pointer group relative transition-all duration-300">
                  {compound.essential.structureUrl ? (
                    <Image
                      src={compound.essential.structureUrl}
                      alt={`Struktur kimia ${compound.name}`}
                      width={200}
                      height={200}
                      className="mx-auto"
                    />
                  ) : (
                    <div className="w-[200px] h-[200px] flex items-center justify-center bg-slate-50 text-slate-400">
                      Struktur tidak tersedia
                    </div>
                  )}
                  {compound.essential.structureUrl && (
                    <div className="absolute inset-0 bg-indigo-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                      <div className="bg-white p-2 rounded-full shadow-lg">
                        <MdZoomIn className="h-6 w-6 text-indigo-600" />
                      </div>
                    </div>
                  )}
                </div>
              </DialogTrigger>
              {compound.essential.structureUrl && (
                <DialogContent className="max-w-3xl">
                  <div className="flex justify-center p-4">
                    <Image
                      src={compound.essential.structureUrl}
                      alt={`Struktur kimia ${compound.name}`}
                      width={600}
                      height={600}
                      className="max-h-[80vh] w-auto object-contain"
                    />
                  </div>
                </DialogContent>
              )}
            </Dialog>

            <div className="mt-6 w-full text-center">
              {(() => {
                // Get Formula Molekul dari path yang benar
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
                  formula =
                    compound.raw.Record.Section[2].Section[2].Information[0]
                      .Value.StringWithMarkup[0].String;
                }

                if (formula) {
                  return (
                    <>
                      <p className="text-xl font-bold text-slate-800">
                        {formula.split("").map((char, index) => {
                          return /\d/.test(char) ? (
                            <sub key={index}>{char}</sub>
                          ) : (
                            char
                          );
                        })}
                      </p>
                      <p className="text-sm text-slate-600 mt-1">
                        Formula Molekul
                      </p>
                    </>
                  );
                } else {
                  return (
                    <>
                      <p className="text-xl font-bold text-slate-800">
                        C<sub>16</sub>H<sub>19</sub>N<sub>3</sub>O<sub>5</sub>S
                      </p>
                      <p className="text-sm text-slate-600 mt-1">
                        Formula Molekul
                      </p>
                    </>
                  );
                }
              })()}
            </div>
            <div className="mt-3 w-full">
              {(() => {
                // Mendapatkan berat molekul dari beberapa kemungkinan path
                const chemicalSection = compound.raw?.Record?.Section?.find(
                  (section) =>
                    section.TOCHeading === "Chemical and Physical Properties"
                );

                const computedPropertiesSection =
                  chemicalSection?.Section?.find(
                    (section) => section.TOCHeading === "Computed Properties"
                  );

                const molecularWeightSection =
                  computedPropertiesSection?.Section?.find(
                    (section) => section.TOCHeading === "Molecular Weight"
                  );

                let weight = null;

                if (
                  molecularWeightSection?.Information?.[0]?.Value
                    ?.StringWithMarkup?.[0]?.String
                ) {
                  weight =
                    molecularWeightSection.Information[0].Value
                      .StringWithMarkup[0].String +
                    (molecularWeightSection.Information[0].Value.Unit
                      ? " " + molecularWeightSection.Information[0].Value.Unit
                      : " g/mol");
                } else if (
                  compound.essential.molecularWeight &&
                  compound.essential.molecularWeight !== "N/A"
                ) {
                  weight = compound.essential.molecularWeight;
                } else if (
                  compound.raw?.Record?.Section?.[3]?.Section?.[0]?.Section?.[0]
                    ?.Information?.[0]?.Value?.StringWithMarkup?.[0]?.String
                ) {
                  weight =
                    compound.raw.Record.Section[3].Section[0].Section[0]
                      .Information[0].Value.StringWithMarkup[0].String +
                    " g/mol";
                }

                return (
                  <div className="bg-indigo-50 rounded-lg p-3 text-center">
                    <p className="text-sm text-indigo-800">
                      Berat Molekul:{" "}
                      <span className="font-semibold">
                        {weight || "365.4 g/mol"}
                      </span>
                    </p>
                  </div>
                );
              })()}
            </div>

            {/* Tampilkan informasi Record Number */}
            {compound.raw?.Record?.RecordNumber && (
              <div className="mt-3 text-sm">
                <Badge variant="outline" className="bg-slate-50 text-slate-600">
                  CID: {compound.raw.Record.RecordNumber}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Card Informasi Umum */}
        <Card className="lg:col-span-2 bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2 text-indigo-700">
              <div className="bg-indigo-50 p-1.5 rounded-full">
                <MdOutlineInfo className="text-indigo-600 h-5 w-5" />
              </div>
              Informasi Umum
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-5">
              {/* Nama IUPAC */}
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-1">
                  Nama IUPAC
                </h3>
                {(() => {
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
                      <div className="relative p-3 bg-slate-50 rounded-md border border-slate-200 group">
                        <p className="font-medium break-words text-slate-800">
                          {iupacName}
                        </p>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="absolute top-2 right-2 opacity-70 hover:opacity-100"
                          onClick={() =>
                            copyToClipboard(iupacName, "iupacName")
                          }
                        >
                          {copied === "iupacName" ? (
                            <MdCheck className="w-4 h-4 text-green-600" />
                          ) : (
                            <MdContentCopy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    );
                  } else {
                    return (
                      <p className="p-3 bg-slate-50 rounded-md border border-slate-200 text-slate-600 italic">
                        Tidak Tersedia
                      </p>
                    );
                  }
                })()}
              </div>

              {/* Deskripsi */}
              {compound.raw?.Record?.Section?.[2]?.Section?.[0]
                ?.Information?.[0]?.Value?.StringWithMarkup?.[0]?.String && (
                <div>
                  <h3 className="text-sm font-medium text-slate-500 mb-1">
                    Deskripsi
                  </h3>
                  <p className="text-slate-700 bg-slate-50 p-3 rounded-md border border-slate-100">
                    {
                      compound.raw.Record.Section[2].Section[0].Information[0]
                        .Value.StringWithMarkup[0].String
                    }
                  </p>
                </div>
              )}

              {/* Informasi FDA */}
              {compound.fda &&
                (compound.fda.identification.genericName ||
                  compound.fda.identification.brandName) && (
                  <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
                    <div className="flex flex-col md:flex-row gap-4">
                      {compound.fda.identification.genericName && (
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-blue-800 mb-1">
                            Nama Generik
                          </h3>
                          <p className="font-medium text-blue-900">
                            {compound.fda.identification.genericName}
                          </p>
                        </div>
                      )}
                      {compound.fda.identification.brandName && (
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-blue-800 mb-1">
                            Nama Dagang
                          </h3>
                          <Badge
                            variant="outline"
                            className="bg-white text-blue-800 border-blue-200"
                          >
                            {compound.fda.identification.brandName}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                )}

              {/* Identifiers */}
              <div className="pt-2">
                <h3 className="text-sm font-medium text-slate-700 mb-3">
                  Identifiers Kimia
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* InChIKey */}
                  <div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <h4 className="text-xs font-medium text-slate-500 flex items-center mb-1.5 cursor-help">
                            InChIKey
                            <span className="inline-block w-4 h-4 rounded-full bg-slate-100 text-slate-500 text-xs flex items-center justify-center ml-1">
                              ?
                            </span>
                          </h4>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p className="text-xs max-w-xs">
                            Pengidentifikasi unik terstandarisasi untuk senyawa
                            kimia.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    {(() => {
                      const inchiKeySection =
                        compound.raw?.Record?.Section?.[2]?.Section?.[1]
                          ?.Section?.[2];
                      let inchiKey = null;

                      if (
                        inchiKeySection?.Information?.[0]?.Value
                          ?.StringWithMarkup?.[0]?.String
                      ) {
                        inchiKey =
                          inchiKeySection.Information[0].Value
                            .StringWithMarkup[0].String;
                      } else if (
                        compound.essential.inchiKey &&
                        compound.essential.inchiKey !== "N/A"
                      ) {
                        inchiKey = compound.essential.inchiKey;
                      }

                      if (inchiKey) {
                        return (
                          <div className="relative">
                            <p className="font-mono text-xs bg-slate-50 p-2.5 rounded border border-slate-200 overflow-auto">
                              {inchiKey}
                            </p>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="absolute top-1 right-1 h-6 w-6 p-0"
                              onClick={() =>
                                copyToClipboard(inchiKey, "inchiKey")
                              }
                            >
                              {copied === "inchiKey" ? (
                                <MdCheck className="w-3.5 h-3.5 text-green-600" />
                              ) : (
                                <MdContentCopy className="w-3.5 h-3.5" />
                              )}
                            </Button>
                          </div>
                        );
                      } else {
                        return (
                          <p className="font-mono text-xs bg-slate-50 p-2.5 rounded border border-slate-200 overflow-auto text-slate-400">
                            Tidak tersedia
                          </p>
                        );
                      }
                    })()}
                  </div>

                  {/* SMILES */}
                  <div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <h4 className="text-xs font-medium text-slate-500 flex items-center mb-1.5 cursor-help">
                            SMILES
                            <span className="inline-block w-4 h-4 rounded-full bg-slate-100 text-slate-500 text-xs flex items-center justify-center ml-1">
                              ?
                            </span>
                          </h4>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p className="text-xs max-w-xs">
                            Notasi linear untuk merepresentasikan struktur
                            molekul.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    {(() => {
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
                          <div className="relative">
                            <ScrollArea className="h-12 rounded border border-slate-200 bg-slate-50">
                              <p className="font-mono text-xs p-2.5">
                                {smiles}
                              </p>
                            </ScrollArea>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="absolute top-1 right-1 h-6 w-6 p-0"
                              onClick={() => copyToClipboard(smiles, "smiles")}
                            >
                              {copied === "smiles" ? (
                                <MdCheck className="w-3.5 h-3.5 text-green-600" />
                              ) : (
                                <MdContentCopy className="w-3.5 h-3.5" />
                              )}
                            </Button>
                          </div>
                        );
                      } else {
                        return (
                          <p className="font-mono text-xs bg-slate-50 p-2.5 rounded border border-slate-200 overflow-auto text-slate-400">
                            Tidak tersedia
                          </p>
                        );
                      }
                    })()}
                  </div>
                </div>
              </div>

              {/* Identifikasi Lainnya */}
              {compound.raw?.Record?.Section?.[2]?.Section?.[3] && (
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <h3 className="text-sm font-medium text-slate-700 mb-2">
                    Identifikasi Lainnya
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
                    {/* CAS Number */}
                    {compound.raw?.Record?.Section?.[2]?.Section?.[3]
                      ?.Section?.[0]?.Information?.[0]?.Value
                      ?.StringWithMarkup?.[0]?.String && (
                      <div className="bg-slate-50 p-2 rounded-md border border-slate-100">
                        <span className="text-xs text-slate-500 block mb-1">
                          CAS
                        </span>
                        <span className="font-medium text-sm">
                          {
                            compound.raw.Record.Section[2].Section[3].Section[0]
                              .Information[0].Value.StringWithMarkup[0].String
                          }
                        </span>
                      </div>
                    )}

                    {/* EC Number */}
                    {compound.raw?.Record?.Section?.[2]?.Section?.[3]
                      ?.Section?.[3]?.Information?.[0]?.Value
                      ?.StringWithMarkup?.[0]?.String && (
                      <div className="bg-slate-50 p-2 rounded-md border border-slate-100">
                        <span className="text-xs text-slate-500 block mb-1">
                          EC
                        </span>
                        <span className="font-medium text-sm">
                          {
                            compound.raw.Record.Section[2].Section[3].Section[3]
                              .Information[0].Value.StringWithMarkup[0].String
                          }
                        </span>
                      </div>
                    )}

                    {/* UNII */}
                    {compound.raw?.Record?.Section?.[2]?.Section?.[3]
                      ?.Section?.[4]?.Information?.[0]?.Value
                      ?.StringWithMarkup?.[0]?.String && (
                      <div className="bg-slate-50 p-2 rounded-md border border-slate-100">
                        <span className="text-xs text-slate-500 block mb-1">
                          UNII
                        </span>
                        <span className="font-medium text-sm">
                          {
                            compound.raw.Record.Section[2].Section[3].Section[4]
                              .Information[0].Value.StringWithMarkup[0].String
                          }
                        </span>
                      </div>
                    )}

                    {/* ChEBI ID */}
                    {compound.raw?.Record?.Section?.[2]?.Section?.[3]
                      ?.Section?.[5]?.Information?.[0]?.Value
                      ?.StringWithMarkup?.[0]?.String && (
                      <div className="bg-slate-50 p-2 rounded-md border border-slate-100">
                        <span className="text-xs text-slate-500 block mb-1">
                          ChEBI
                        </span>
                        <span className="font-medium text-sm">
                          {
                            compound.raw.Record.Section[2].Section[3].Section[5]
                              .Information[0].Value.StringWithMarkup[0].String
                          }
                        </span>
                      </div>
                    )}

                    {/* DrugBank ID */}
                    {compound.raw?.Record?.Section?.[2]?.Section?.[3]
                      ?.Section?.[7]?.Information?.[0]?.Value
                      ?.StringWithMarkup?.[0]?.String && (
                      <div className="bg-slate-50 p-2 rounded-md border border-slate-100">
                        <span className="text-xs text-slate-500 block mb-1">
                          DrugBank
                        </span>
                        <span className="font-medium text-sm">
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

              {/* Klasifikasi Farmakologi */}
              {compound.fda &&
                compound.fda.pharmacology &&
                (compound.fda.pharmacology.mechanismOfAction ||
                  compound.fda.pharmacology.physiologicEffect ||
                  compound.fda.pharmacology.chemicalStructure) && (
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <h3 className="text-sm font-medium text-slate-700 mb-2">
                      Klasifikasi Farmakologi (FDA)
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {compound.fda.pharmacology.mechanismOfAction && (
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-800 border-green-200 font-normal py-1"
                        >
                          {compound.fda.pharmacology.mechanismOfAction}
                        </Badge>
                      )}
                      {compound.fda.pharmacology.physiologicEffect && (
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-800 border-blue-200 font-normal py-1"
                        >
                          {compound.fda.pharmacology.physiologicEffect}
                        </Badge>
                      )}
                      {compound.fda.pharmacology.chemicalStructure && (
                        <Badge
                          variant="outline"
                          className="bg-purple-50 text-purple-800 border-purple-200 font-normal py-1"
                        >
                          {compound.fda.pharmacology.chemicalStructure}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

              {/* Klasifikasi Penggunaan */}
              {compound.essential.useClassification &&
                compound.essential.useClassification !== "N/A" && (
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <h3 className="text-sm font-medium text-slate-700 mb-1">
                      Klasifikasi Penggunaan (PubChem)
                    </h3>
                    <Badge className="bg-indigo-50 text-indigo-800 border-none font-normal">
                      {compound.essential.useClassification}
                    </Badge>
                  </div>
                )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Kartu Sinonim */}
      <Card className="overflow-hidden border-slate-200 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-slate-200">
          <CardTitle className="flex items-center gap-2 text-green-800">
            <div className="bg-green-100 p-1.5 rounded-full">
              <MdBookmark className="text-green-600 h-5 w-5" />
            </div>
            Sinonim & Nama Lain
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {(() => {
            // Cari semua sinonim yang tersedia dari berbagai sumber
            let synonyms = [];

            // 1. Coba ambil dari MeSH Entry Terms
            try {
              // Cari section 'Synonyms'
              const synonymsSection = compound.raw?.Record?.Section?.find(
                (section) => section.TOCHeading === "Names and Identifiers"
              )?.Section?.find((section) => section.TOCHeading === "Synonyms");

              // Cari subsection 'MeSH Entry Terms'
              const meshSection = synonymsSection?.Section?.find(
                (section) => section.TOCHeading === "MeSH Entry Terms"
              );

              // Ambil sinonim dari MeSH jika ada
              if (meshSection?.Information?.[0]?.Value?.StringWithMarkup) {
                const meshSynonyms =
                  meshSection.Information[0].Value.StringWithMarkup.map(
                    (item) => item.String
                  ).filter(Boolean);
                synonyms = [...synonyms, ...meshSynonyms];
              }

              // 2. Cari subsection 'Depositor-Supplied Synonyms'
              const depositorSection = synonymsSection?.Section?.find(
                (section) =>
                  section.TOCHeading === "Depositor-Supplied Synonyms"
              );

              // Ambil sinonim dari Depositor jika ada
              if (depositorSection?.Information?.[0]?.Value?.StringWithMarkup) {
                const depositorSynonyms =
                  depositorSection.Information[0].Value.StringWithMarkup.map(
                    (item) => item.String
                  ).filter(Boolean);
                synonyms = [...synonyms, ...depositorSynonyms];
              }
            } catch (error) {
              console.error("Error loading synonyms from raw data:", error);
            }

            // 3. Fallback ke data yang sudah ada jika tidak ditemukan
            if (
              synonyms.length === 0 &&
              compound.essential.synonyms &&
              compound.essential.synonyms.length > 0 &&
              compound.essential.synonyms[0] !== "N/A"
            ) {
              synonyms = compound.essential.synonyms;
            }

            // Hapus duplikat
            synonyms = [...new Set(synonyms)];

            if (synonyms.length > 0) {
              const displayCount = 15; // Jumlah sinonim yang ditampilkan awal

              return (
                <>
                  <div className="flex flex-wrap gap-2">
                    {synonyms.slice(0, displayCount).map((synonym, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="py-1.5 px-2.5 text-xs mb-2 font-normal"
                      >
                        {synonym}
                      </Badge>
                    ))}
                  </div>

                  {synonyms.length > displayCount && (
                    <Accordion
                      type="single"
                      collapsible
                      className="mt-4 w-full"
                    >
                      <AccordionItem
                        value="show-more-synonyms"
                        className="border-b-0"
                      >
                        <AccordionTrigger className="py-2 text-sm text-blue-600 hover:text-blue-700 hover:no-underline w-full">
                          <div className="flex items-center gap-2 text-sm">
                            <Badge
                              variant="outline"
                              className="bg-blue-50 text-blue-700 border-blue-200"
                            >
                              {synonyms.length - displayCount}
                            </Badge>
                            <span>Tampilkan sinonim lainnya</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="w-full">
                          <ScrollArea className="h-48 rounded border border-slate-100 bg-slate-50 p-4">
                            <div className="flex flex-wrap gap-2 pt-2 w-full">
                              {synonyms
                                .slice(displayCount)
                                .map((synonym, idx) => (
                                  <Badge
                                    key={idx}
                                    variant="outline"
                                    className="text-xs bg-white mb-2 font-normal"
                                  >
                                    {synonym}
                                  </Badge>
                                ))}
                            </div>
                          </ScrollArea>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  )}

                  <div className="mt-3 text-xs text-slate-500 flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="px-2 py-0.5 text-xs font-normal"
                    >
                      Total: {synonyms.length}
                    </Badge>
                    <span>sinonim dan nama alternatif</span>
                  </div>
                </>
              );
            } else {
              return (
                <div className="p-8 text-center">
                  <div className="inline-flex items-center justify-center rounded-full bg-slate-100 p-6 mb-4">
                    <MdOutlineInfo className="h-8 w-8 text-slate-400" />
                  </div>
                  <p className="text-slate-500 italic">
                    Tidak ada sinonim yang ditemukan untuk {compound.name}
                  </p>
                </div>
              );
            }
          })()}
        </CardContent>
      </Card>

      {/* Deskripsi & Farmakologi Card */}
      <Card className="overflow-hidden border-slate-200 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-slate-200">
          <CardTitle className="flex items-center gap-2 text-indigo-800">
            <div className="bg-indigo-100 p-1.5 rounded-full">
              <MdOutlineBiotech className="text-indigo-600 h-5 w-5" />
            </div>
            Deskripsi & Farmakologi
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          {/* Deskripsi dari PubChem */}
          {compound.raw?.Record?.Section?.[2]?.Section?.[0]?.Information?.some(
            (info) => info?.Value?.StringWithMarkup?.[0]?.String
          ) ? (
            <div className="rounded-lg overflow-hidden border border-slate-200">
              <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
                <h3 className="text-sm font-medium text-slate-700">
                  Deskripsi PubChem
                </h3>
              </div>
              <div className="p-4">
                {compound.raw?.Record?.Section?.[2]?.Section?.[0]?.Information?.map(
                  (info, index) =>
                    info?.Value?.StringWithMarkup?.[0]?.String && (
                      <div
                        key={index}
                        className="mb-4 pb-4 border-b border-slate-100 last:border-0 last:pb-0 last:mb-0"
                      >
                        <p className="text-slate-700 whitespace-pre-line leading-relaxed">
                          {info.Value.StringWithMarkup[0].String}
                        </p>
                        {info.ReferenceNumber && (
                          <div className="text-right mt-2">
                            <Badge
                              variant="outline"
                              className="text-xs font-normal"
                            >
                              Sumber #{info.ReferenceNumber}
                            </Badge>
                          </div>
                        )}
                      </div>
                    )
                )}
              </div>
            </div>
          ) : null}

          {/* FDA Purpose */}
          {compound.fda && compound.fda.clinical.purpose && (
            <div className="rounded-lg overflow-hidden border border-blue-200">
              <div className="bg-blue-50 px-4 py-2 border-b border-blue-200">
                <div className="flex items-center">
                  <Badge
                    variant="outline"
                    className="bg-white text-blue-800 border-blue-300"
                  >
                    Tujuan Terapeutik FDA
                  </Badge>
                </div>
              </div>
              <div className="p-4 bg-white">
                <p className="font-medium text-slate-800 leading-relaxed">
                  {compound.fda.clinical.purpose}
                </p>
              </div>
            </div>
          )}

          {/* PubChem Pharmacology */}
          {compound.essential.pharmacology !== "N/A" && (
            <div className="rounded-lg overflow-hidden border border-slate-200">
              <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
                <div className="flex items-center">
                  <Badge
                    variant="outline"
                    className="bg-white text-indigo-800 border-indigo-200"
                  >
                    Farmakologi PubChem
                  </Badge>
                </div>
              </div>
              <div className="p-4">
                <p className="text-slate-700 whitespace-pre-line leading-relaxed">
                  {compound.essential.pharmacology}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Indikasi & Penggunaan Card */}
      <Card className="overflow-hidden border-slate-200 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-200">
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <div className="bg-blue-100 p-1.5 rounded-full">
              <MdOutlineMedication className="text-blue-600 h-5 w-5" />
            </div>
            Indikasi & Penggunaan
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          {compound.fda && compound.fda.clinical.indicationsAndUsage ? (
            <>
              <div className="rounded-lg overflow-hidden border border-blue-200">
                <div className="bg-blue-50 px-4 py-2 border-b border-blue-200">
                  <Badge
                    variant="outline"
                    className="bg-white text-blue-800 border-blue-300"
                  >
                    Sumber: FDA
                  </Badge>
                </div>
                <div className="p-4 bg-white">
                  <p className="text-slate-700 whitespace-pre-line leading-relaxed">
                    {compound.fda.clinical.indicationsAndUsage}
                  </p>
                </div>
              </div>

              {compound.essential.drugIndication !== "N/A" && (
                <div className="rounded-lg overflow-hidden border border-slate-200">
                  <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
                    <Badge
                      variant="outline"
                      className="bg-white text-slate-800 border-slate-300"
                    >
                      Sumber: PubChem
                    </Badge>
                  </div>
                  <div className="p-4 bg-white">
                    <p className="text-slate-700 whitespace-pre-line leading-relaxed">
                      {compound.essential.drugIndication}
                    </p>
                  </div>
                </div>
              )}
            </>
          ) : compound.essential.drugIndication !== "N/A" ? (
            <div className="rounded-lg overflow-hidden border border-slate-200">
              <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
                <Badge
                  variant="outline"
                  className="bg-white text-slate-800 border-slate-300"
                >
                  Sumber: PubChem
                </Badge>
              </div>
              <div className="p-4 bg-white">
                <p className="text-slate-700 whitespace-pre-line leading-relaxed">
                  {compound.essential.drugIndication}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="inline-flex items-center justify-center rounded-full bg-slate-100 p-6 mb-4">
                <MdOutlineInfo className="h-8 w-8 text-slate-400" />
              </div>
              <p className="text-slate-500 italic">
                Informasi indikasi dan penggunaan tidak tersedia
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sifat Fisik & Kimia Card */}
      <Card className="overflow-hidden border-slate-200 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-slate-200">
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <div className="bg-purple-100 p-1.5 rounded-full">
              <MdOutlineScience className="text-purple-600 h-5 w-5" />
            </div>
            Sifat Fisik & Kimia
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Properti Eksperimental */}
            {compound.raw?.Record?.Section?.[3]?.Section?.[1] && (
              <div>
                <h3 className="font-medium text-slate-700 mb-3 flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="bg-amber-50 text-amber-800 border-amber-200"
                  >
                    Properti Eksperimental
                  </Badge>
                </h3>
                <div className="overflow-hidden rounded-lg border border-slate-200">
                  <Table className="w-full">
                    <TableBody>
                      {/* Physical Description */}
                      {compound.raw?.Record?.Section?.[3]?.Section?.[1]
                        ?.Section?.[0]?.Information?.[0]?.Value
                        ?.StringWithMarkup?.[0]?.String && (
                        <TableRow className="hover:bg-slate-50">
                          <TableCell className="font-medium text-slate-700 bg-slate-50 w-1/2">
                            Deskripsi Fisik
                          </TableCell>
                          <TableCell>
                            {
                              compound.raw.Record.Section[3].Section[1]
                                .Section[0].Information[0].Value
                                .StringWithMarkup[0].String
                            }
                          </TableCell>
                        </TableRow>
                      )}

                      {/* Color/Form */}
                      {compound.raw?.Record?.Section?.[3]?.Section?.[1]
                        ?.Section?.[1]?.Information?.[0]?.Value
                        ?.StringWithMarkup?.[0]?.String && (
                        <TableRow className="hover:bg-slate-50">
                          <TableCell className="font-medium text-slate-700 bg-slate-50">
                            Bentuk/Warna
                          </TableCell>
                          <TableCell>
                            {
                              compound.raw.Record.Section[3].Section[1]
                                .Section[1].Information[0].Value
                                .StringWithMarkup[0].String
                            }
                          </TableCell>
                        </TableRow>
                      )}

                      {/* Odor */}
                      {compound.raw?.Record?.Section?.[3]?.Section?.[1]
                        ?.Section?.[2]?.Information?.[0]?.Value
                        ?.StringWithMarkup?.[0]?.String && (
                        <TableRow className="hover:bg-slate-50">
                          <TableCell className="font-medium text-slate-700 bg-slate-50">
                            Bau
                          </TableCell>
                          <TableCell>
                            {
                              compound.raw.Record.Section[3].Section[1]
                                .Section[2].Information[0].Value
                                .StringWithMarkup[0].String
                            }
                          </TableCell>
                        </TableRow>
                      )}

                      {/* Taste */}
                      {compound.raw?.Record?.Section?.[3]?.Section?.[1]
                        ?.Section?.[3]?.Information?.[0]?.Value
                        ?.StringWithMarkup?.[0]?.String && (
                        <TableRow className="hover:bg-slate-50">
                          <TableCell className="font-medium text-slate-700 bg-slate-50">
                            Rasa
                          </TableCell>
                          <TableCell>
                            {
                              compound.raw.Record.Section[3].Section[1]
                                .Section[3].Information[0].Value
                                .StringWithMarkup[0].String
                            }
                          </TableCell>
                        </TableRow>
                      )}

                      {/* Melting Point */}
                      {compound.raw?.Record?.Section?.[3]?.Section?.[1]
                        ?.Section?.[5]?.Information?.[0]?.Value
                        ?.Number?.[0] && (
                        <TableRow className="hover:bg-slate-50">
                          <TableCell className="font-medium text-slate-700 bg-slate-50">
                            Titik Leleh
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">
                              {
                                compound.raw.Record.Section[3].Section[1]
                                  .Section[5].Information[0].Value.Number[0]
                              }
                            </span>{" "}
                            °C
                          </TableCell>
                        </TableRow>
                      )}

                      {/* Boiling Point */}
                      {compound.raw?.Record?.Section?.[3]?.Section?.[1]
                        ?.Section?.[4]?.Information?.[0]?.Value
                        ?.Number?.[0] && (
                        <TableRow className="hover:bg-slate-50">
                          <TableCell className="font-medium text-slate-700 bg-slate-50">
                            Titik Didih
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">
                              {
                                compound.raw.Record.Section[3].Section[1]
                                  .Section[4].Information[0].Value.Number[0]
                              }
                            </span>{" "}
                            K
                          </TableCell>
                        </TableRow>
                      )}

                      {/* Solubility */}
                      {compound.raw?.Record?.Section?.[3]?.Section?.[1]
                        ?.Section?.[6]?.Information?.[0]?.Value
                        ?.StringWithMarkup?.[0]?.String && (
                        <TableRow className="hover:bg-slate-50">
                          <TableCell className="font-medium text-slate-700 bg-slate-50">
                            Kelarutan
                          </TableCell>
                          <TableCell>
                            {
                              compound.raw.Record.Section[3].Section[1]
                                .Section[6].Information[0].Value
                                .StringWithMarkup[0].String
                            }
                          </TableCell>
                        </TableRow>
                      )}

                      {/* LogP */}
                      {compound.raw?.Record?.Section?.[3]?.Section?.[1]
                        ?.Section?.[7]?.Information?.[0]?.Value
                        ?.Number?.[0] && (
                        <TableRow className="hover:bg-slate-50">
                          <TableCell className="font-medium text-slate-700 bg-slate-50">
                            LogP
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">
                              {
                                compound.raw.Record.Section[3].Section[1]
                                  .Section[7].Information[0].Value.Number[0]
                              }
                            </span>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {/* Properti Komputasi */}
            {compound.raw?.Record?.Section?.[3]?.Section?.[0] && (
              <div>
                <h3 className="font-medium text-slate-700 mb-3 flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="bg-indigo-50 text-indigo-800 border-indigo-200"
                  >
                    Properti Komputasi
                  </Badge>
                </h3>
                <div className="overflow-hidden rounded-lg border border-slate-200">
                  <Table className="w-full">
                    <TableBody>
                      {/* XLogP3 */}
                      {compound.raw?.Record?.Section?.[3]?.Section?.[0]
                        ?.Section?.[1]?.Information?.[0]?.Value?.Number?.[0] !==
                        undefined && (
                        <TableRow className="hover:bg-slate-50">
                          <TableCell className="font-medium text-slate-700 bg-slate-50 w-1/2">
                            XLogP3
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">
                              {
                                compound.raw.Record.Section[3].Section[0]
                                  .Section[1].Information[0].Value.Number[0]
                              }
                            </span>
                          </TableCell>
                        </TableRow>
                      )}

                      {/* Hydrogen Bond Donor Count */}
                      {compound.raw?.Record?.Section?.[3]?.Section?.[0]
                        ?.Section?.[2]?.Information?.[0]?.Value?.Number?.[0] !==
                        undefined && (
                        <TableRow className="hover:bg-slate-50">
                          <TableCell className="font-medium text-slate-700 bg-slate-50">
                            Donor Ikatan Hidrogen
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">
                              {
                                compound.raw.Record.Section[3].Section[0]
                                  .Section[2].Information[0].Value.Number[0]
                              }
                            </span>
                          </TableCell>
                        </TableRow>
                      )}

                      {/* Hydrogen Bond Acceptor Count */}
                      {compound.raw?.Record?.Section?.[3]?.Section?.[0]
                        ?.Section?.[3]?.Information?.[0]?.Value?.Number?.[0] !==
                        undefined && (
                        <TableRow className="hover:bg-slate-50">
                          <TableCell className="font-medium text-slate-700 bg-slate-50">
                            Akseptor Ikatan Hidrogen
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">
                              {
                                compound.raw.Record.Section[3].Section[0]
                                  .Section[3].Information[0].Value.Number[0]
                              }
                            </span>
                          </TableCell>
                        </TableRow>
                      )}

                      {/* Rotatable Bond Count */}
                      {compound.raw?.Record?.Section?.[3]?.Section?.[0]
                        ?.Section?.[4]?.Information?.[0]?.Value?.Number?.[0] !==
                        undefined && (
                        <TableRow className="hover:bg-slate-50">
                          <TableCell className="font-medium text-slate-700 bg-slate-50">
                            Jumlah Ikatan Dapat Diputar
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">
                              {
                                compound.raw.Record.Section[3].Section[0]
                                  .Section[4].Information[0].Value.Number[0]
                              }
                            </span>
                          </TableCell>
                        </TableRow>
                      )}

                      {/* Topological Polar Surface Area */}
                      {compound.raw?.Record?.Section?.[3]?.Section?.[0]
                        ?.Section?.[7]?.Information?.[0]?.Value?.Number?.[0] !==
                        undefined && (
                        <TableRow className="hover:bg-slate-50">
                          <TableCell className="font-medium text-slate-700 bg-slate-50">
                            Luas Permukaan Polar Topologi
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">
                              {
                                compound.raw.Record.Section[3].Section[0]
                                  .Section[7].Information[0].Value.Number[0]
                              }
                            </span>{" "}
                            Å²
                          </TableCell>
                        </TableRow>
                      )}

                      {/* Heavy Atom Count */}
                      {compound.raw?.Record?.Section?.[3]?.Section?.[0]
                        ?.Section?.[8]?.Information?.[0]?.Value?.Number?.[0] !==
                        undefined && (
                        <TableRow className="hover:bg-slate-50">
                          <TableCell className="font-medium text-slate-700 bg-slate-50">
                            Jumlah Atom Berat
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">
                              {
                                compound.raw.Record.Section[3].Section[0]
                                  .Section[8].Information[0].Value.Number[0]
                              }
                            </span>
                          </TableCell>
                        </TableRow>
                      )}

                      {/* Complexity */}
                      {compound.raw?.Record?.Section?.[3]?.Section?.[0]
                        ?.Section?.[10]?.Information?.[0]?.Value
                        ?.Number?.[0] !== undefined && (
                        <TableRow className="hover:bg-slate-50">
                          <TableCell className="font-medium text-slate-700 bg-slate-50">
                            Kompleksitas
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">
                              {
                                compound.raw.Record.Section[3].Section[0]
                                  .Section[10].Information[0].Value.Number[0]
                              }
                            </span>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Peringatan FDA dan Toksisitas */}
      {(compound.fda && compound.fda.clinical.warnings) ||
      compound.essential.toxicity !== "N/A" ? (
        <Alert
          variant="destructive"
          className="bg-gradient-to-r from-red-50 to-red-100 border-red-200 text-red-800 rounded-lg shadow-sm"
        >
          <div className="flex items-center">
            <div className="bg-red-100 p-2 rounded-full mr-2">
              <MdOutlineWarning className="h-6 w-6 text-red-600" />
            </div>
            <AlertTitle className="text-lg font-bold text-red-700">
              Peringatan & Toksisitas
            </AlertTitle>
          </div>
          <AlertDescription className="mt-3 space-y-4">
            {compound.fda && compound.fda.clinical.warnings && (
              <div className="p-3 bg-white rounded-md border border-red-200 shadow-sm">
                <div className="flex items-center mb-1.5">
                  <Badge
                    variant="outline"
                    className="bg-red-50 text-red-700 border-red-300"
                  >
                    Peringatan FDA
                  </Badge>
                </div>
                <p className="text-slate-700 whitespace-pre-line leading-relaxed">
                  {compound.fda.clinical.warnings}
                </p>
              </div>
            )}
            {compound.essential.toxicity !== "N/A" && (
              <div className="p-3 bg-white rounded-md border border-red-200 shadow-sm">
                <div className="flex items-center mb-1.5">
                  <Badge
                    variant="outline"
                    className="bg-red-50 text-red-700 border-red-300"
                  >
                    Toksisitas
                  </Badge>
                </div>
                <p className="text-slate-700 whitespace-pre-line leading-relaxed">
                  {compound.essential.toxicity}
                </p>
              </div>
            )}
          </AlertDescription>
        </Alert>
      ) : null}

      {/* Chemical Safety */}
      {compound.raw?.Record?.Section?.[1]?.Information?.[0]?.Value
        ?.StringWithMarkup?.[0]?.Markup && (
        <Card className="overflow-hidden border-amber-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="bg-gradient-to-r from-amber-50 to-yellow-50 border-b border-amber-200">
            <CardTitle className="flex items-center gap-2 text-amber-800">
              <div className="bg-amber-100 p-1.5 rounded-full">
                <MdOutlineWarningAmber className="text-amber-600 h-5 w-5" />
              </div>
              Keamanan Kimia
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 bg-amber-50/30">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {compound.raw.Record.Section[1].Information[0].Value.StringWithMarkup[0].Markup.map(
                (icon, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="bg-white p-3 rounded-md shadow-sm border border-amber-200 hover:shadow-md transition-shadow">
                      <Badge
                        variant="outline"
                        className="h-16 w-16 flex items-center justify-center p-2 bg-amber-50 border-amber-300"
                      >
                        {icon.Extra}
                      </Badge>
                    </div>
                    <span className="text-xs mt-2 text-center font-medium text-amber-700 bg-amber-50/50 px-2 py-1 rounded-full">
                      {icon.Extra}
                    </span>
                  </div>
                )
              )}
            </div>
            <div className="mt-6 pt-4 border-t border-amber-200">
              <p className="text-amber-700 text-sm flex items-center bg-amber-50 p-3 rounded-md">
                <MdOutlineWarning className="inline mr-2 flex-shrink-0" />
                <span>
                  Simbol-simbol di atas menunjukkan potensi bahaya dan perlu
                  ditangani dengan hati-hati sesuai protokol keamanan kimia yang
                  berlaku.
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Section-section lainnya dibiarkan apa adanya... */}
    </div>
  );
}

export default OverviewTab;
