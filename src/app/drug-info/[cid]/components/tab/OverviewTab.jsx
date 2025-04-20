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
  MdOutlineEco,
  MdOutlineFoodBank,
  MdOutlineConstruction,
  MdOutlineMedicalInformation,
  MdLibraryBooks,
  MdOpenInNew,
  MdZoomIn,
  MdOutlineSecurity,
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

function OverviewTab({ compound, setImageDialogOpen, imageDialogOpen }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <MdOutlineScience className="text-indigo-600" /> Struktur Molekul
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center">
            <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
              <DialogTrigger asChild>
                <div className="p-2 bg-white rounded-lg shadow-sm border cursor-pointer group relative">
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
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                      <MdZoomIn className="h-8 w-8 text-indigo-600" />
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

            <div className="mt-4 w-full text-center">
              {(() => {
                // Get Formula Molekul dari path yang benar
                // Cek beberapa kemungkinan lokasi formula dalam data
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
                      <p className="font-medium">
                        {formula.split("").map((char, index) => {
                          return /\d/.test(char) ? (
                            <sub key={index}>{char}</sub>
                          ) : (
                            char
                          );
                        })}
                      </p>
                      <p className="text-sm text-slate-500">Formula Molekul</p>
                    </>
                  );
                } else {
                  return (
                    <>
                      <p className="font-medium">
                        C<sub>16</sub>H<sub>19</sub>N<sub>3</sub>O<sub>5</sub>S
                      </p>
                      <p className="text-sm text-slate-500">Formula Molekul</p>
                    </>
                  );
                }
              })()}
            </div>
            <div className="mt-2">
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
                  <p className="text-sm text-slate-600">
                    Berat Molekul:{" "}
                    <span className="font-medium">
                      {weight || "365.4 g/mol"}
                    </span>
                  </p>
                );
              })()}
            </div>

            {/* Tampilkan informasi Record Number */}
            {compound.raw?.Record?.RecordNumber && (
              <div className="mt-2 text-sm text-slate-500">
                <p>CID: {compound.raw.Record.RecordNumber}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-1 lg:col-span-2">
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
                {(() => {
                  // Cek beberapa kemungkinan lokasi nama IUPAC dalam data
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
                      <p className="font-medium break-words">{iupacName}</p>
                    );
                  } else {
                    return (
                      <p className="font-medium break-words">Tidak Tersedia</p>
                    );
                  }
                })()}
              </div>

              {/* Menampilkan Record Description dari CSV */}
              {compound.raw?.Record?.Section?.[2]?.Section?.[0]
                ?.Information?.[0]?.Value?.StringWithMarkup?.[0]?.String && (
                <div>
                  <h3 className="text-sm font-medium text-slate-500">
                    Deskripsi
                  </h3>
                  <p className="text-slate-700">
                    {
                      compound.raw.Record.Section[2].Section[0].Information[0]
                        .Value.StringWithMarkup[0].String
                    }
                  </p>
                </div>
              )}

              {/* Tampilkan informasi klasifikasi FDA jika tersedia */}
              {compound.fda &&
                (compound.fda.identification.genericName ||
                  compound.fda.identification.brandName) && (
                  <div className="flex flex-col md:flex-row gap-4">
                    {compound.fda.identification.genericName && (
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-slate-500">
                          Nama Generik
                        </h3>
                        <p className="font-medium">
                          {compound.fda.identification.genericName}
                        </p>
                      </div>
                    )}
                    {compound.fda.identification.brandName && (
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-slate-500">
                          Nama Dagang
                        </h3>
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-800 border-blue-200"
                        >
                          {compound.fda.identification.brandName}
                        </Badge>
                      </div>
                    )}
                  </div>
                )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-slate-500">
                    InChIKey
                  </h3>
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
                        <p className="font-mono text-xs bg-slate-50 p-2 rounded border border-slate-200 overflow-auto">
                          {inchiKey}
                        </p>
                      );
                    } else {
                      // Fallback value untuk InChIKey
                      return (
                        <p className="font-mono text-xs bg-slate-50 p-2 rounded border border-slate-200 overflow-auto">
                          Tidak Tersedia
                        </p>
                      );
                    }
                  })()}
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-slate-500">SMILES</h3>
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
                        <p className="font-mono text-xs bg-slate-50 p-2 rounded border border-slate-200 overflow-auto max-h-[60px]">
                          {smiles}
                        </p>
                      );
                    } else {
                      return (
                        <p className="font-mono text-xs bg-slate-50 p-2 rounded border border-slate-200 overflow-auto">
                          Tidak tersedia
                        </p>
                      );
                    }
                  })()}
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-slate-500">InChI</h3>
                  {compound.raw?.Record?.Section?.[2]?.Section?.[1]
                    ?.Section?.[1]?.Information?.[0]?.Value
                    ?.StringWithMarkup?.[0]?.String ? (
                    <p className="font-mono text-xs bg-slate-50 p-2 rounded border border-slate-200 overflow-auto max-h-[100px]">
                      {
                        compound.raw.Record.Section[2].Section[1].Section[1]
                          .Information[0].Value.StringWithMarkup[0].String
                      }
                    </p>
                  ) : (
                    <p className="text-sm text-slate-700">
                      {compound.essential.inchiKey &&
                      compound.essential.inchiKey !== "N/A"
                        ? "Hanya InChIKey tersedia"
                        : "Tidak tersedia"}
                    </p>
                  )}
                </div>
              </div>

              {/* Identifiers lainnya dari CSV (CAS, EC Number, dll) */}
              {compound.raw?.Record?.Section?.[2]?.Section?.[3] && (
                <div className="pt-2">
                  <h3 className="text-sm font-medium text-slate-500 mb-2">
                    Identifikasi Lainnya
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    {/* CAS Number */}
                    {compound.raw?.Record?.Section?.[2]?.Section?.[3]
                      ?.Section?.[0]?.Information?.[0]?.Value
                      ?.StringWithMarkup?.[0]?.String && (
                      <div>
                        <span className="font-medium">CAS:</span>{" "}
                        {
                          compound.raw.Record.Section[2].Section[3].Section[0]
                            .Information[0].Value.StringWithMarkup[0].String
                        }
                      </div>
                    )}

                    {/* EC Number */}
                    {compound.raw?.Record?.Section?.[2]?.Section?.[3]
                      ?.Section?.[3]?.Information?.[0]?.Value
                      ?.StringWithMarkup?.[0]?.String && (
                      <div>
                        <span className="font-medium">EC Number:</span>{" "}
                        {
                          compound.raw.Record.Section[2].Section[3].Section[3]
                            .Information[0].Value.StringWithMarkup[0].String
                        }
                      </div>
                    )}

                    {/* UNII */}
                    {compound.raw?.Record?.Section?.[2]?.Section?.[3]
                      ?.Section?.[4]?.Information?.[0]?.Value
                      ?.StringWithMarkup?.[0]?.String && (
                      <div>
                        <span className="font-medium">UNII:</span>{" "}
                        {
                          compound.raw.Record.Section[2].Section[3].Section[4]
                            .Information[0].Value.StringWithMarkup[0].String
                        }
                      </div>
                    )}

                    {/* ChEBI ID */}
                    {compound.raw?.Record?.Section?.[2]?.Section?.[3]
                      ?.Section?.[5]?.Information?.[0]?.Value
                      ?.StringWithMarkup?.[0]?.String && (
                      <div>
                        <span className="font-medium">ChEBI ID:</span>{" "}
                        {
                          compound.raw.Record.Section[2].Section[3].Section[5]
                            .Information[0].Value.StringWithMarkup[0].String
                        }
                      </div>
                    )}

                    {/* DrugBank ID */}
                    {compound.raw?.Record?.Section?.[2]?.Section?.[3]
                      ?.Section?.[7]?.Information?.[0]?.Value
                      ?.StringWithMarkup?.[0]?.String && (
                      <div>
                        <span className="font-medium">DrugBank ID:</span>{" "}
                        {
                          compound.raw.Record.Section[2].Section[3].Section[7]
                            .Information[0].Value.StringWithMarkup[0].String
                        }
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Menampilkan klasifikasi farmakologi dari FDA jika tersedia */}
              {compound.fda &&
                compound.fda.pharmacology &&
                (compound.fda.pharmacology.mechanismOfAction ||
                  compound.fda.pharmacology.physiologicEffect ||
                  compound.fda.pharmacology.chemicalStructure) && (
                  <div className="pt-2">
                    <h3 className="text-sm font-medium text-slate-500">
                      Klasifikasi Farmakologi (FDA)
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {compound.fda.pharmacology.mechanismOfAction && (
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-800 border-green-200"
                        >
                          {compound.fda.pharmacology.mechanismOfAction}
                        </Badge>
                      )}
                      {compound.fda.pharmacology.physiologicEffect && (
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-800 border-blue-200"
                        >
                          {compound.fda.pharmacology.physiologicEffect}
                        </Badge>
                      )}
                      {compound.fda.pharmacology.chemicalStructure && (
                        <Badge
                          variant="outline"
                          className="bg-purple-50 text-purple-800 border-purple-200"
                        >
                          {compound.fda.pharmacology.chemicalStructure}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

              {/* Tampilkan klasifikasi penggunaan dari PubChem jika tersedia */}
              {compound.essential.useClassification &&
                compound.essential.useClassification !== "N/A" && (
                  <div className="pt-2">
                    <h3 className="text-sm font-medium text-slate-500">
                      Klasifikasi Penggunaan (PubChem)
                    </h3>
                    <p>{compound.essential.useClassification}</p>
                  </div>
                )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Kartu Sinonim terpisah */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MdBookmark className="text-green-600" /> Sinonim & Nama Lain
          </CardTitle>
        </CardHeader>
        <CardContent>
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
                        className="text-xs mb-2"
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
                        <AccordionTrigger className="py-2 text-sm text-blue-600 hover:no-underline w-full">
                          Tampilkan {synonyms.length - displayCount} sinonim
                          lainnya
                        </AccordionTrigger>
                        <AccordionContent className="w-full">
                          <div className="flex flex-wrap gap-2 pt-2 w-full">
                            {synonyms
                              .slice(displayCount)
                              .map((synonym, idx) => (
                                <Badge
                                  key={idx}
                                  variant="outline"
                                  className="text-xs bg-slate-50 mb-2"
                                >
                                  {synonym}
                                </Badge>
                              ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  )}

                  <div className="mt-3 text-xs text-slate-500">
                    Total: {synonyms.length} sinonim
                  </div>
                </>
              );
            } else {
              return (
                <p className="text-slate-500 italic">
                  Tidak ada sinonim yang ditemukan untuk {compound.name}
                </p>
              );
            }
          })()}
        </CardContent>
      </Card>

      {/* Farmakologi Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MdOutlineBiotech className="text-indigo-600" /> Deskripsi &
            Farmakologi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Tampilkan semua record descriptions dari CSV */}
          {compound.raw?.Record?.Section?.[2]?.Section?.[0]?.Information?.map(
            (info, index) =>
              info?.Value?.StringWithMarkup?.[0]?.String && (
                <div
                  key={index}
                  className="mb-4 pb-4 border-b border-slate-100 last:border-0"
                >
                  <p className="text-slate-700 whitespace-pre-line">
                    {info.Value.StringWithMarkup[0].String}
                  </p>
                  {info.ReferenceNumber && (
                    <div className="text-right mt-2">
                      <Badge variant="outline" className="text-xs">
                        Sumber #{info.ReferenceNumber}
                      </Badge>
                    </div>
                  )}
                </div>
              )
          )}

          {/* Tampilkan informasi FDA jika tersedia */}
          {compound.fda && compound.fda.clinical.purpose && (
            <div className="bg-blue-50 p-3 rounded-md border border-blue-200 mb-2">
              <div className="flex items-center mb-2">
                <Badge
                  variant="outline"
                  className="bg-white text-blue-800 border-blue-200"
                >
                  Tujuan Terapeutik (FDA)
                </Badge>
              </div>
              <p className="font-medium text-slate-800">
                {compound.fda.clinical.purpose}
              </p>
            </div>
          )}

          {/* Tampilkan farmakologi dari PubChem jika tersedia */}
          {compound.essential.pharmacology !== "N/A" && (
            <div>
              {compound.fda && compound.fda.clinical.purpose && <Separator />}
              <div className="mt-2">
                <p className="text-slate-700 whitespace-pre-line">
                  {compound.essential.pharmacology}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MdOutlineMedication className="text-indigo-600" /> Indikasi &
            Penggunaan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {compound.fda && compound.fda.clinical.indicationsAndUsage ? (
            <>
              <div className="bg-blue-50 p-3 rounded-md border border-blue-200 mb-2">
                <div className="flex items-center mb-2">
                  <Badge
                    variant="outline"
                    className="bg-white text-blue-800 border-blue-200"
                  >
                    Sumber: FDA
                  </Badge>
                </div>
                <p className="text-slate-700 whitespace-pre-line">
                  {compound.fda.clinical.indicationsAndUsage}
                </p>
              </div>
              {compound.essential.drugIndication !== "N/A" && (
                <>
                  <Separator />
                  <div className="mt-2">
                    <div className="flex items-center mb-2">
                      <Badge
                        variant="outline"
                        className="bg-white text-slate-800 border-slate-200"
                      >
                        Sumber: PubChem
                      </Badge>
                    </div>
                    <p className="text-slate-700 whitespace-pre-line">
                      {compound.essential.drugIndication}
                    </p>
                  </div>
                </>
              )}
            </>
          ) : compound.essential.drugIndication !== "N/A" ? (
            <p className="text-slate-700 whitespace-pre-line">
              {compound.essential.drugIndication}
            </p>
          ) : (
            <p className="text-slate-500 italic">
              Informasi indikasi dan penggunaan tidak tersedia
            </p>
          )}
        </CardContent>
      </Card>

      {/* Sifat Kimia dan Fisika dari CSV */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MdOutlineScience className="text-purple-600" /> Sifat Fisik & Kimia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tampilkan sifat eksperimental dari CSV */}
            {compound.raw?.Record?.Section?.[3]?.Section?.[1] && (
              <div>
                <h3 className="font-medium text-slate-700 mb-2">
                  Properti Eksperimental
                </h3>
                <Table>
                  <TableBody>
                    {/* Physical Description */}
                    {compound.raw?.Record?.Section?.[3]?.Section?.[1]
                      ?.Section?.[0]?.Information?.[0]?.Value
                      ?.StringWithMarkup?.[0]?.String && (
                      <TableRow>
                        <TableCell className="font-medium">
                          Deskripsi Fisik
                        </TableCell>
                        <TableCell>
                          {
                            compound.raw.Record.Section[3].Section[1].Section[0]
                              .Information[0].Value.StringWithMarkup[0].String
                          }
                        </TableCell>
                      </TableRow>
                    )}

                    {/* Color/Form */}
                    {compound.raw?.Record?.Section?.[3]?.Section?.[1]
                      ?.Section?.[1]?.Information?.[0]?.Value
                      ?.StringWithMarkup?.[0]?.String && (
                      <TableRow>
                        <TableCell className="font-medium">
                          Bentuk/Warna
                        </TableCell>
                        <TableCell>
                          {
                            compound.raw.Record.Section[3].Section[1].Section[1]
                              .Information[0].Value.StringWithMarkup[0].String
                          }
                        </TableCell>
                      </TableRow>
                    )}

                    {/* Odor */}
                    {compound.raw?.Record?.Section?.[3]?.Section?.[1]
                      ?.Section?.[2]?.Information?.[0]?.Value
                      ?.StringWithMarkup?.[0]?.String && (
                      <TableRow>
                        <TableCell className="font-medium">Bau</TableCell>
                        <TableCell>
                          {
                            compound.raw.Record.Section[3].Section[1].Section[2]
                              .Information[0].Value.StringWithMarkup[0].String
                          }
                        </TableCell>
                      </TableRow>
                    )}

                    {/* Taste */}
                    {compound.raw?.Record?.Section?.[3]?.Section?.[1]
                      ?.Section?.[3]?.Information?.[0]?.Value
                      ?.StringWithMarkup?.[0]?.String && (
                      <TableRow>
                        <TableCell className="font-medium">Rasa</TableCell>
                        <TableCell>
                          {
                            compound.raw.Record.Section[3].Section[1].Section[3]
                              .Information[0].Value.StringWithMarkup[0].String
                          }
                        </TableCell>
                      </TableRow>
                    )}

                    {/* Melting Point */}
                    {compound.raw?.Record?.Section?.[3]?.Section?.[1]
                      ?.Section?.[5]?.Information?.[0]?.Value?.Number?.[0] && (
                      <TableRow>
                        <TableCell className="font-medium">
                          Titik Leleh
                        </TableCell>
                        <TableCell>
                          {
                            compound.raw.Record.Section[3].Section[1].Section[5]
                              .Information[0].Value.Number[0]
                          }{" "}
                          °C
                        </TableCell>
                      </TableRow>
                    )}

                    {/* Boiling Point */}
                    {compound.raw?.Record?.Section?.[3]?.Section?.[1]
                      ?.Section?.[4]?.Information?.[0]?.Value?.Number?.[0] && (
                      <TableRow>
                        <TableCell className="font-medium">
                          Titik Didih
                        </TableCell>
                        <TableCell>
                          {
                            compound.raw.Record.Section[3].Section[1].Section[4]
                              .Information[0].Value.Number[0]
                          }{" "}
                          K
                        </TableCell>
                      </TableRow>
                    )}

                    {/* Solubility */}
                    {compound.raw?.Record?.Section?.[3]?.Section?.[1]
                      ?.Section?.[6]?.Information?.[0]?.Value
                      ?.StringWithMarkup?.[0]?.String && (
                      <TableRow>
                        <TableCell className="font-medium">Kelarutan</TableCell>
                        <TableCell>
                          {
                            compound.raw.Record.Section[3].Section[1].Section[6]
                              .Information[0].Value.StringWithMarkup[0].String
                          }
                        </TableCell>
                      </TableRow>
                    )}

                    {/* LogP */}
                    {compound.raw?.Record?.Section?.[3]?.Section?.[1]
                      ?.Section?.[7]?.Information?.[0]?.Value?.Number?.[0] && (
                      <TableRow>
                        <TableCell className="font-medium">LogP</TableCell>
                        <TableCell>
                          {
                            compound.raw.Record.Section[3].Section[1].Section[7]
                              .Information[0].Value.Number[0]
                          }
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Tampilkan sifat komputasi dari CSV */}
            {compound.raw?.Record?.Section?.[3]?.Section?.[0] && (
              <div>
                <h3 className="font-medium text-slate-700 mb-2">
                  Properti Komputasi
                </h3>
                <Table>
                  <TableBody>
                    {/* XLogP3 */}
                    {compound.raw?.Record?.Section?.[3]?.Section?.[0]
                      ?.Section?.[1]?.Information?.[0]?.Value?.Number?.[0] !==
                      undefined && (
                      <TableRow>
                        <TableCell className="font-medium">XLogP3</TableCell>
                        <TableCell>
                          {
                            compound.raw.Record.Section[3].Section[0].Section[1]
                              .Information[0].Value.Number[0]
                          }
                        </TableCell>
                      </TableRow>
                    )}

                    {/* Hydrogen Bond Donor Count */}
                    {compound.raw?.Record?.Section?.[3]?.Section?.[0]
                      ?.Section?.[2]?.Information?.[0]?.Value?.Number?.[0] !==
                      undefined && (
                      <TableRow>
                        <TableCell className="font-medium">
                          Donor Ikatan Hidrogen
                        </TableCell>
                        <TableCell>
                          {
                            compound.raw.Record.Section[3].Section[0].Section[2]
                              .Information[0].Value.Number[0]
                          }
                        </TableCell>
                      </TableRow>
                    )}

                    {/* Hydrogen Bond Acceptor Count */}
                    {compound.raw?.Record?.Section?.[3]?.Section?.[0]
                      ?.Section?.[3]?.Information?.[0]?.Value?.Number?.[0] !==
                      undefined && (
                      <TableRow>
                        <TableCell className="font-medium">
                          Akseptor Ikatan Hidrogen
                        </TableCell>
                        <TableCell>
                          {
                            compound.raw.Record.Section[3].Section[0].Section[3]
                              .Information[0].Value.Number[0]
                          }
                        </TableCell>
                      </TableRow>
                    )}

                    {/* Rotatable Bond Count */}
                    {compound.raw?.Record?.Section?.[3]?.Section?.[0]
                      ?.Section?.[4]?.Information?.[0]?.Value?.Number?.[0] !==
                      undefined && (
                      <TableRow>
                        <TableCell className="font-medium">
                          Jumlah Ikatan Dapat Diputar
                        </TableCell>
                        <TableCell>
                          {
                            compound.raw.Record.Section[3].Section[0].Section[4]
                              .Information[0].Value.Number[0]
                          }
                        </TableCell>
                      </TableRow>
                    )}

                    {/* Topological Polar Surface Area */}
                    {compound.raw?.Record?.Section?.[3]?.Section?.[0]
                      ?.Section?.[7]?.Information?.[0]?.Value?.Number?.[0] !==
                      undefined && (
                      <TableRow>
                        <TableCell className="font-medium">
                          Luas Permukaan Polar Topologi
                        </TableCell>
                        <TableCell>
                          {
                            compound.raw.Record.Section[3].Section[0].Section[7]
                              .Information[0].Value.Number[0]
                          }{" "}
                          Å²
                        </TableCell>
                      </TableRow>
                    )}

                    {/* Heavy Atom Count */}
                    {compound.raw?.Record?.Section?.[3]?.Section?.[0]
                      ?.Section?.[8]?.Information?.[0]?.Value?.Number?.[0] !==
                      undefined && (
                      <TableRow>
                        <TableCell className="font-medium">
                          Jumlah Atom Berat
                        </TableCell>
                        <TableCell>
                          {
                            compound.raw.Record.Section[3].Section[0].Section[8]
                              .Information[0].Value.Number[0]
                          }
                        </TableCell>
                      </TableRow>
                    )}

                    {/* Complexity */}
                    {compound.raw?.Record?.Section?.[3]?.Section?.[0]
                      ?.Section?.[10]?.Information?.[0]?.Value?.Number?.[0] !==
                      undefined && (
                      <TableRow>
                        <TableCell className="font-medium">
                          Kompleksitas
                        </TableCell>
                        <TableCell>
                          {
                            compound.raw.Record.Section[3].Section[0]
                              .Section[10].Information[0].Value.Number[0]
                          }
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
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
          className="bg-red-50 border-red-200 text-red-800"
        >
          <MdOutlineWarning className="h-5 w-5 text-red-600" />
          <AlertTitle>Peringatan & Toksisitas</AlertTitle>
          <AlertDescription className="mt-2 whitespace-pre-line">
            {compound.fda && compound.fda.clinical.warnings && (
              <div className="mb-4">
                <strong>Peringatan FDA:</strong>{" "}
                {compound.fda.clinical.warnings}
              </div>
            )}
            {compound.essential.toxicity !== "N/A" && (
              <div>
                <strong>Toksisitas:</strong> {compound.essential.toxicity}
              </div>
            )}
          </AlertDescription>
        </Alert>
      ) : null}

      {/* Chemical Safety dari CSV jika tersedia */}
      {compound.raw?.Record?.Section?.[1]?.Information?.[0]?.Value
        ?.StringWithMarkup?.[0]?.Markup && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-800">
              <MdOutlineWarningAmber className="text-amber-600" /> Keamanan
              Kimia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {compound.raw.Record.Section[1].Information[0].Value.StringWithMarkup[0].Markup.map(
                (icon, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="bg-white p-2 rounded-md border border-amber-200">
                      <Badge
                        variant="outline"
                        className="h-12 w-12 flex items-center justify-center p-2"
                      >
                        {icon.Extra}
                      </Badge>
                    </div>
                    <span className="text-xs mt-1 text-amber-700">
                      {icon.Extra}
                    </span>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Informasi Produk FDA */}
      {compound.fda && compound.fda.identification.manufacturerName && (
        <Card className="bg-slate-50 border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <MdOutlineMedicalInformation className="text-slate-600" />{" "}
              Informasi Produk FDA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <h3 className="font-medium text-slate-500">Produsen</h3>
                <p>{compound.fda.identification.manufacturerName}</p>
              </div>
              {compound.fda.identification.route && (
                <div>
                  <h3 className="font-medium text-slate-500">Rute Pemberian</h3>
                  <p>{compound.fda.identification.route}</p>
                </div>
              )}
              {compound.fda.identification.productType && (
                <div>
                  <h3 className="font-medium text-slate-500">Tipe Produk</h3>
                  <p>{compound.fda.identification.productType}</p>
                </div>
              )}
              {compound.fda.clinical.activeIngredient && (
                <div className="col-span-1 sm:col-span-2 md:col-span-3">
                  <h3 className="font-medium text-slate-500">Bahan Aktif</h3>
                  <p>{compound.fda.clinical.activeIngredient}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Drug Class Information */}
      {compound.raw?.Record?.Section?.[3]?.Section?.[2]?.Section?.[0] && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MdBookmark className="text-green-600" /> Kelas & Klasifikasi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {compound.raw.Record.Section[3].Section[2].Section[0].Information.map(
                (info, index) =>
                  info?.Value?.StringWithMarkup?.[0]?.String && (
                    <div key={index} className="mb-2">
                      <Badge variant="secondary" className="text-sm">
                        {info.Value.StringWithMarkup[0].String}
                      </Badge>
                    </div>
                  )
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Eksperimental Properties Lanjutan */}
      {compound.raw?.Record?.Section?.[3]?.Section?.[1]?.Section?.[6]
        ?.Information?.[0]?.Value?.StringWithMarkup?.[0]?.String && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MdOutlineScience className="text-indigo-600" /> Solubilitas
              Spesifik
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-700 whitespace-pre-line">
              {
                compound.raw.Record.Section[3].Section[1].Section[6]
                  .Information[0].Value.StringWithMarkup[0].String
              }
            </p>
            {compound.raw?.Record?.Section?.[3]?.Section?.[1]?.Section?.[6]
              ?.Information?.[0]?.ReferenceNumber && (
              <div className="text-right mt-2">
                <Badge variant="outline" className="text-xs">
                  Sumber #
                  {
                    compound.raw.Record.Section[3].Section[1].Section[6]
                      .Information[0].ReferenceNumber
                  }
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Sejarah & Regulasi */}
      {(compound.raw?.Record?.Section?.[2]?.Section?.[5]?.Section?.[0]
        ?.Information?.[0]?.Value?.StringWithMarkup?.[0]?.String ||
        compound.raw?.Record?.Section?.[10]?.Section?.[0]?.Information?.[0]
          ?.Value?.DateISO) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MdLibraryBooks className="text-blue-600" /> Sejarah & Regulasi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {compound.raw?.Record?.Section?.[2]?.Section?.[5]?.Section?.[0]
              ?.Information?.[0]?.Value?.StringWithMarkup?.[0]?.String && (
              <div>
                <h3 className="text-sm font-medium text-slate-700 mb-1">
                  Informasi Persetujuan FDA
                </h3>
                <p className="text-slate-700">
                  {
                    compound.raw.Record.Section[2].Section[5].Section[0]
                      .Information[0].Value.StringWithMarkup[0].String
                  }
                </p>
              </div>
            )}
            {compound.raw?.Record?.Section?.[10]?.Section?.[0]?.Information?.[0]
              ?.Value?.DateISO && (
              <div>
                <h3 className="text-sm font-medium text-slate-700 mb-1">
                  Tanggal Penambahan ke Database
                </h3>
                <p className="text-slate-700">
                  {new Date(
                    compound.raw.Record.Section[10].Section[0].Information[0].Value.DateISO
                  ).toLocaleDateString()}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Asal Natural */}
      {compound.raw?.Record?.Section?.[2]?.Section?.[0]?.Information?.some(
        (info) =>
          info?.Value?.StringWithMarkup?.[0]?.String?.includes("reported in")
      ) && (
        <Card className="bg-emerald-50 border-emerald-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-800">
              <MdOutlineEco className="text-emerald-600" /> Asal Natural
            </CardTitle>
          </CardHeader>
          <CardContent>
            {compound.raw?.Record?.Section?.[2]?.Section?.[0]?.Information?.map(
              (info, idx) => {
                const content = info?.Value?.StringWithMarkup?.[0]?.String;
                if (content && content.includes("reported in")) {
                  return (
                    <div key={idx} className="mb-3">
                      <p className="text-emerald-700">{content}</p>
                      {info.ReferenceNumber && (
                        <div className="text-right mt-1">
                          <Badge variant="outline" className="text-xs bg-white">
                            Sumber #{info.ReferenceNumber}
                          </Badge>
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              }
            )}
          </CardContent>
        </Card>
      )}

      {/* Klasifikasi Obat Detail */}
      {compound.raw?.Record?.Section?.[2]?.Section?.[0]?.Information?.some(
        (info) =>
          info?.Value?.StringWithMarkup?.[0]?.String?.includes(
            "penicillin G derivative"
          ) ||
          info?.Value?.StringWithMarkup?.[0]?.String?.includes("antibiotic")
      ) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MdOutlineMedication className="text-purple-600" /> Klasifikasi
              Obat Detail
            </CardTitle>
          </CardHeader>
          <CardContent>
            {compound.raw?.Record?.Section?.[2]?.Section?.[0]?.Information?.map(
              (info, idx) => {
                const content = info?.Value?.StringWithMarkup?.[0]?.String;
                if (
                  content &&
                  (content.includes("penicillin G derivative") ||
                    content.includes("antibiotic"))
                ) {
                  return (
                    <div
                      key={idx}
                      className="mb-3 pb-3 border-b border-slate-100 last:border-0"
                    >
                      <Badge variant="secondary" className="mb-2">
                        Klasifikasi Antibiotik
                      </Badge>
                      <p className="text-slate-700">{content}</p>
                      {info.ReferenceNumber && (
                        <div className="text-right mt-1">
                          <Badge variant="outline" className="text-xs">
                            Sumber #{info.ReferenceNumber}
                          </Badge>
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              }
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default OverviewTab;
