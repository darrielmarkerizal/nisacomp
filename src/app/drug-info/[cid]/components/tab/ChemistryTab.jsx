import React from "react";
import Image from "next/image";
import {
  MdOutlineScience,
  MdBookmark,
  MdOutlineContentCopy,
  MdOutlineInfo,
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

function ChemistryTab({ compound, setImageDialogOpen }) {
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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <div className="p-2 bg-white rounded-lg shadow-sm border">
              <Image
                src={compound.essential.structureUrl}
                alt={`Struktur kimia ${compound.name}`}
                width={200}
                height={200}
                className="mx-auto"
                onClick={() => setImageDialogOpen(true)}
              />
              <Button
                size="sm"
                variant="secondary"
                className="mt-2"
                onClick={() => setImageDialogOpen(true)}
              >
                Perbesar
              </Button>
            </div>

            {/* Tampilkan formula molekul - menggunakan path yang sama dengan OverviewTab */}
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
              <ScrollArea className="w-full overflow-auto max-h-[400px]">
                <ChemicalPropertiesTable compound={compound} />
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader className="border-b pb-3">
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-green-50 rounded-full">
              <MdBookmark className="text-green-600 h-5 w-5" />
            </div>
            <span>Identifikasi & Nama Lain</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5 pt-4">
          <div>
            <h3 className="text-sm font-medium text-slate-500 mb-1.5">
              Nama IUPAC
            </h3>
            <div className="font-medium break-words p-3 bg-slate-50 rounded-md border border-slate-100 relative">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <h3 className="text-sm font-medium text-slate-500 flex items-center gap-1 mb-1.5 cursor-help">
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
                    <h3 className="text-sm font-medium text-slate-500 flex items-center gap-1 mb-1.5 cursor-help">
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
                      className="text-xs py-1 px-2"
                    >
                      {synonym}
                    </Badge>
                  ))}
              </div>
              {compound.essential.synonyms.length > 15 && (
                <Accordion type="single" collapsible className="mt-2">
                  <AccordionItem value="more-synonyms" className="border-none">
                    <AccordionTrigger className="text-xs text-slate-600 py-2 hover:no-underline">
                      <span className="text-blue-600">
                        Tampilkan {compound.essential.synonyms.length - 15} nama
                        lainnya
                      </span>
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
            <TableHead className="w-2/5 sm:w-1/3 font-medium text-slate-700 py-3.5 px-4">
              <span className="block text-sm">Properti</span>
            </TableHead>
            <TableHead className="font-medium text-slate-700 py-3.5 px-4">
              <span className="block text-sm">Nilai</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableData.map((row, index) => (
            <TableRow
              key={index}
              className={`transition-colors border-b last:border-0 ${index % 2 === 0 ? "bg-white" : "bg-slate-50/40"} hover:bg-slate-100/40`}
            >
              <TableCell className="font-medium text-slate-700 py-3.5 px-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm sm:text-base leading-relaxed">
                    {row.label}
                  </span>
                </div>
              </TableCell>
              <TableCell className="py-3.5 px-4">
                {row.isCode ? (
                  <div className="w-full overflow-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
                    <span className="font-mono text-xs bg-white p-2 rounded-md border border-slate-200 inline-block shadow-sm">
                      {row.value}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <span className="text-sm sm:text-base text-slate-800 font-medium">
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

export default ChemistryTab;
