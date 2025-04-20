import React from "react";
import {
  MdOutlineHealthAndSafety,
  MdOutlineBiotech,
  MdOutlineChevronRight,
  MdSearch,
  MdOpenInNew,
  MdOutlineMedication,
  MdOutlineScience,
  MdOutlineWaterDrop,
  MdOutlineTimeline,
  MdLink,
  MdOutlineInfo,
} from "react-icons/md";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function PharmacologyTab({ compound, renderSectionIfExists }) {
  return (
    <div className="space-y-6">
      {/* FDA Clinical Information Card */}
      {compound.fda && (
        <Card className="overflow-hidden border-blue-200 shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="border-b pb-3 bg-gradient-to-r from-blue-50 to-blue-100/60">
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <div className="bg-blue-100/80 p-1.5 rounded-full">
                <MdOutlineHealthAndSafety className="text-blue-600 h-5 w-5" />
              </div>
              <span>Informasi Klinis FDA</span>
            </CardTitle>
            <CardDescription className="text-blue-700/70">
              Data dari U.S. FDA untuk penggunaan klinis
            </CardDescription>
          </CardHeader>
          <CardContent className="divide-y px-4 py-0">
            {compound.fda.clinical.purpose && (
              <div className="py-4">
                <h3 className="font-medium text-slate-800 mb-2 flex items-center gap-1.5">
                  <div className="h-1 w-1 rounded-full bg-blue-500"></div>
                  Tujuan Terapeutik
                </h3>
                <p className="text-slate-700 bg-blue-50/50 p-3 rounded-md border border-blue-100 leading-relaxed">
                  {compound.fda.clinical.purpose}
                </p>
              </div>
            )}

            {compound.fda.clinical.indicationsAndUsage && (
              <div className="py-4">
                <h3 className="font-medium text-slate-800 mb-2 flex items-center gap-1.5">
                  <div className="h-1 w-1 rounded-full bg-blue-500"></div>
                  Indikasi & Penggunaan
                </h3>
                <div className="bg-white p-3 rounded-md border border-slate-200 shadow-sm">
                  <p className="text-slate-700 whitespace-pre-line leading-relaxed">
                    {compound.fda.clinical.indicationsAndUsage}
                  </p>
                </div>
              </div>
            )}

            {compound.fda.clinical.dosageAndAdministration && (
              <div className="py-4">
                <h3 className="font-medium text-slate-800 mb-2 flex items-center gap-1.5">
                  <div className="h-1 w-1 rounded-full bg-blue-500"></div>
                  Dosis & Cara Pemberian
                </h3>
                <div className="bg-white p-3 rounded-md border border-slate-200 shadow-sm">
                  <p className="text-slate-700 whitespace-pre-line leading-relaxed">
                    {compound.fda.clinical.dosageAndAdministration}
                  </p>
                </div>
              </div>
            )}

            {compound.fda.clinical.pregnancy && (
              <div className="py-4">
                <h3 className="font-medium text-slate-800 mb-2 flex items-center gap-1.5">
                  <div className="h-1 w-1 rounded-full bg-blue-500"></div>
                  Kehamilan & Menyusui
                </h3>
                <div className="bg-white p-3 rounded-md border border-slate-200 shadow-sm">
                  <p className="text-slate-700 whitespace-pre-line leading-relaxed">
                    {compound.fda.clinical.pregnancy}
                  </p>
                </div>
              </div>
            )}

            {compound.fda.clinical.activeIngredient && (
              <div className="py-4">
                <h3 className="font-medium text-slate-800 mb-2 flex items-center gap-1.5">
                  <div className="h-1 w-1 rounded-full bg-blue-500"></div>
                  Bahan Aktif
                </h3>
                <Badge className="bg-blue-100/80 text-blue-800 hover:bg-blue-100 border-none py-1.5 px-3">
                  {compound.fda.clinical.activeIngredient}
                </Badge>
              </div>
            )}

            {compound.fda.other.inactiveIngredients && (
              <div className="py-4">
                <h3 className="font-medium text-slate-800 mb-2 flex items-center gap-1.5">
                  <div className="h-1 w-1 rounded-full bg-blue-500"></div>
                  Bahan Tidak Aktif
                </h3>
                <div className="bg-white p-3 rounded-md border border-slate-200 shadow-sm">
                  <p className="text-slate-700 whitespace-pre-line leading-relaxed">
                    {compound.fda.other.inactiveIngredients}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* PubChem Pharmacology Card */}
      {compound.essential.pharmacology !== "N/A" ? (
        <Card className="overflow-hidden border-indigo-200 shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="border-b border-indigo-100 bg-gradient-to-r from-indigo-50 to-indigo-100/40 pb-3">
            <CardTitle className="flex items-center gap-2 text-indigo-800">
              <div className="bg-indigo-100/80 p-1.5 rounded-full">
                <MdOutlineBiotech className="text-indigo-600 h-5 w-5" />
              </div>
              <span>Farmakologi (PubChem)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="bg-white p-4 rounded-md border border-indigo-100 shadow-sm">
              <p className="text-slate-700 whitespace-pre-line leading-relaxed">
                {compound.essential.pharmacology}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        !compound.fda && (
          <Card className="overflow-hidden shadow-sm border-slate-200">
            <CardContent className="p-8 text-center">
              <div className="inline-flex items-center justify-center rounded-full bg-slate-100 p-6 mb-5">
                <MdSearch className="h-8 w-8 text-slate-500" />
              </div>
              <h3 className="text-lg font-medium text-slate-800 mb-2">
                Informasi Farmakologi Tidak Tersedia
              </h3>
              <p className="text-slate-500 max-w-md mx-auto">
                Data farmakologi untuk {compound.name} belum tersedia di
                database PubChem atau FDA.
              </p>
            </CardContent>
          </Card>
        )
      )}

      {/* FDA Pharmacology Classification Card */}
      {compound.fda &&
        compound.fda.pharmacology &&
        (compound.fda.pharmacology.mechanismOfAction ||
          compound.fda.pharmacology.chemicalStructure ||
          compound.fda.pharmacology.physiologicEffect) && (
          <Card className="overflow-hidden border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
            <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-slate-100/40 pb-3">
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <div className="bg-slate-100 p-1.5 rounded-full">
                  <MdOutlineScience className="text-slate-600 h-5 w-5" />
                </div>
                <span>Klasifikasi Farmakologi FDA</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {compound.fda.pharmacology.mechanismOfAction && (
                  <div className="bg-white p-4 rounded-lg border border-green-200 shadow-sm">
                    <h3 className="font-medium text-green-800 mb-2 flex items-center gap-1.5">
                      <MdOutlineWaterDrop className="h-4 w-4" />
                      Mekanisme Aksi
                    </h3>
                    <div className="flex flex-wrap">
                      <Badge className="mt-1 bg-green-100/90 text-green-800 border-none py-1.5 px-3">
                        {compound.fda.pharmacology.mechanismOfAction}
                      </Badge>
                    </div>
                  </div>
                )}

                {compound.fda.pharmacology.chemicalStructure && (
                  <div className="bg-white p-4 rounded-lg border border-purple-200 shadow-sm">
                    <h3 className="font-medium text-purple-800 mb-2 flex items-center gap-1.5">
                      <MdOutlineScience className="h-4 w-4" />
                      Struktur Kimia
                    </h3>
                    <div className="flex flex-wrap">
                      <Badge className="mt-1 bg-purple-100/90 text-purple-800 border-none py-1.5 px-3">
                        {compound.fda.pharmacology.chemicalStructure}
                      </Badge>
                    </div>
                  </div>
                )}

                {compound.fda.pharmacology.physiologicEffect && (
                  <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
                    <h3 className="font-medium text-blue-800 mb-2 flex items-center gap-1.5">
                      <MdOutlineTimeline className="h-4 w-4" />
                      Efek Fisiologis
                    </h3>
                    <div className="flex flex-wrap">
                      <Badge className="mt-1 bg-blue-100/90 text-blue-800 border-none py-1.5 px-3">
                        {compound.fda.pharmacology.physiologicEffect}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

      {/* Drug Indication Card (if not in FDA but in PubChem) */}
      {compound.essential.drugIndication !== "N/A" &&
        !compound.fda?.clinical.indicationsAndUsage && (
          <Card className="overflow-hidden border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
            <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-amber-50 to-amber-100/40 pb-3">
              <CardTitle className="flex items-center gap-2 text-amber-800">
                <div className="bg-amber-100 p-1.5 rounded-full">
                  <MdOutlineMedication className="text-amber-600 h-5 w-5" />
                </div>
                <span>Indikasi & Penggunaan (PubChem)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="bg-white p-4 rounded-md border border-amber-100 shadow-sm">
                <p className="text-slate-700 whitespace-pre-line leading-relaxed">
                  {compound.essential.drugIndication}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

      {/* Render specialized sections from compound.formatted */}
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

      {/* Mechanism of Action Detail */}
      {compound.raw?.Record?.Section?.[4]?.Section?.some(
        (section) => section.TOCHeading === "Mechanism of Action"
      ) && (
        <Card className="overflow-hidden border-green-200 shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-green-50 to-green-100/50 border-b border-green-200">
            <CardTitle className="flex items-center gap-2 text-green-800">
              <div className="bg-green-100 p-1.5 rounded-full">
                <MdOutlineBiotech className="text-green-600 h-5 w-5" />
              </div>
              <span>Mekanisme Aksi Detail</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              {compound.raw?.Record?.Section?.[4]?.Section?.find(
                (section) => section.TOCHeading === "Mechanism of Action"
              )?.Information?.map((info, idx) => (
                <div
                  key={idx}
                  className="bg-white p-4 rounded-lg border border-green-100 shadow-sm mb-4 last:mb-0"
                >
                  <p className="text-slate-700 whitespace-pre-line leading-relaxed">
                    {info?.Value?.StringWithMarkup?.[0]?.String}
                  </p>
                  {info.ReferenceNumber && (
                    <div className="text-right mt-2">
                      <Badge
                        variant="outline"
                        className="text-xs bg-green-50 text-green-700 border-green-200"
                      >
                        Sumber #{info.ReferenceNumber}
                      </Badge>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Clinical Information Specific to Infections */}
      {compound.raw?.Record?.Section?.[9]?.Information?.some((info) =>
        info?.Value?.StringWithMarkup?.[0]?.String?.includes("infections")
      ) && (
        <Card className="overflow-hidden border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-slate-100/50">
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <div className="bg-slate-100 p-1.5 rounded-full">
                <MdOutlineInfo className="text-slate-600 h-5 w-5" />
              </div>
              <span>Informasi Klinis Spesifik</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              {compound.raw?.Record?.Section?.[9]?.Information?.map(
                (info, idx) => {
                  const content = info?.Value?.StringWithMarkup?.[0]?.String;
                  if (content && content.includes("infections")) {
                    return (
                      <div
                        key={idx}
                        className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm"
                      >
                        <h3 className="font-medium text-slate-700 mb-2 pb-1 border-b border-slate-100">
                          Infeksi yang dapat diobati
                        </h3>
                        <p className="text-slate-700 leading-relaxed">
                          {content}
                        </p>
                        {info.ReferenceNumber && (
                          <div className="text-right mt-2">
                            <Badge
                              variant="outline"
                              className="text-xs bg-slate-50 text-slate-600"
                            >
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
            </div>
          </CardContent>
        </Card>
      )}

      {/* External Resource Links */}
      {(compound.fda ||
        compound.essential.pharmacology !== "N/A" ||
        compound.essential.drugIndication !== "N/A") && (
        <Card className="overflow-hidden border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="pb-2 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-slate-100/30">
            <CardTitle className="flex items-center gap-2 text-slate-700">
              <div className="bg-slate-100 p-1.5 rounded-full">
                <MdLink className="text-slate-600 h-4 w-4" />
              </div>
              <span className="text-sm">Sumber Informasi Tambahan</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {compound.fda && (
                <a
                  href="https://www.fda.gov/drugs/drug-approvals-and-databases/drugsfda-data-files"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center p-2.5 rounded-md hover:bg-blue-50 transition-colors group"
                >
                  <div className="bg-blue-100 p-1.5 rounded-full mr-2 group-hover:bg-blue-200 transition-colors">
                    <MdOutlineHealthAndSafety className="text-blue-600 h-4 w-4" />
                  </div>
                  <span className="text-blue-600 group-hover:text-blue-700 transition-colors font-medium text-sm flex items-center">
                    FDA Database
                    <MdOpenInNew className="ml-1.5 h-3 w-3 opacity-70 group-hover:opacity-100 transition-opacity" />
                  </span>
                </a>
              )}
              <a
                href={`https://pubchem.ncbi.nlm.nih.gov/compound/${compound.cid}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center p-2.5 rounded-md hover:bg-indigo-50 transition-colors group"
              >
                <div className="bg-indigo-100 p-1.5 rounded-full mr-2 group-hover:bg-indigo-200 transition-colors">
                  <MdOutlineScience className="text-indigo-600 h-4 w-4" />
                </div>
                <span className="text-indigo-600 group-hover:text-indigo-700 transition-colors font-medium text-sm flex items-center">
                  PubChem Record
                  <MdOpenInNew className="ml-1.5 h-3 w-3 opacity-70 group-hover:opacity-100 transition-opacity" />
                </span>
              </a>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default PharmacologyTab;
