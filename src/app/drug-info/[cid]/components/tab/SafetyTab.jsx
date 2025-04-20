import React from "react";
import {
  MdOutlineWarning,
  MdOutlineWarningAmber,
  MdOutlineSecurity,
  MdOutlineInfo,
  MdOutlineHealthAndSafety,
  MdOutlineShield,
  MdOutlineRemoveCircle,
  MdOutlineContactSupport,
  MdOutlineAccessTime,
  MdOutlineChildCare,
  MdOutlineScience,
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
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function SafetyTab({ compound, renderSectionIfExists }) {
  return (
    <div className="space-y-6">
      {/* FDA Warnings Card - Improved */}
      {compound.fda && compound.fda.clinical.warnings && (
        <Card className="overflow-hidden border-red-200 shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="border-b border-red-100 bg-gradient-to-r from-red-50 to-red-100/30 pb-3">
            <CardTitle className="flex items-center gap-2 text-red-800">
              <div className="bg-red-100 p-1.5 rounded-full">
                <MdOutlineWarning className="text-red-600 h-5 w-5" />
              </div>
              <span>Peringatan FDA</span>
            </CardTitle>
            <CardDescription className="text-red-700/70">
              Informasi penting keselamatan dari U.S. FDA
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <Alert className="border-red-200 bg-red-50/50">
              <MdOutlineWarningAmber className="h-5 w-5 text-red-600" />
              <AlertTitle className="text-red-800 font-medium mb-1">
                Perhatian Penting!
              </AlertTitle>
              <AlertDescription className="text-red-700 whitespace-pre-line leading-relaxed">
                {compound.fda.clinical.warnings}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* FDA Safety Accordion - Improved */}
      {compound.fda && (
        <Card className="overflow-hidden border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-slate-100/30 pb-3">
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <div className="bg-slate-100 p-1.5 rounded-full">
                <MdOutlineHealthAndSafety className="text-slate-600 h-5 w-5" />
              </div>
              <span>Panduan Keselamatan Penggunaan</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <Accordion
              type="multiple"
              defaultValue={["do-not-use"]}
              className="border rounded-lg overflow-hidden"
            >
              {compound.fda.safety.doNotUse && (
                <AccordionItem value="do-not-use" className="border-b">
                  <AccordionTrigger className="py-3 px-4 bg-red-50 hover:bg-red-100/80 text-red-700 hover:no-underline font-medium group">
                    <div className="flex items-center gap-2">
                      <div className="bg-red-100 p-1.5 rounded-full group-hover:bg-red-200 transition-colors">
                        <MdOutlineRemoveCircle className="h-4 w-4 text-red-600" />
                      </div>
                      <span>JANGAN DIGUNAKAN JIKA</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="bg-red-50/50 p-4 text-red-800 leading-relaxed border-t border-red-100">
                    <div className="bg-white p-3 rounded-md border border-red-100 shadow-sm">
                      {compound.fda.safety.doNotUse}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              {compound.fda.safety.stopUse && (
                <AccordionItem value="stop-use" className="border-b">
                  <AccordionTrigger className="py-3 px-4 bg-amber-50 hover:bg-amber-100/80 text-amber-700 hover:no-underline font-medium group">
                    <div className="flex items-center gap-2">
                      <div className="bg-amber-100 p-1.5 rounded-full group-hover:bg-amber-200 transition-colors">
                        <MdOutlineWarningAmber className="h-4 w-4 text-amber-600" />
                      </div>
                      <span>HENTIKAN PENGGUNAAN JIKA</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="bg-amber-50/50 p-4 text-amber-800 leading-relaxed border-t border-amber-100">
                    <div className="bg-white p-3 rounded-md border border-amber-100 shadow-sm">
                      {compound.fda.safety.stopUse}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              {compound.fda.safety.askDoctor && (
                <AccordionItem value="ask-doctor" className="border-b">
                  <AccordionTrigger className="py-3 px-4 hover:bg-blue-50 text-blue-700 hover:no-underline font-medium group">
                    <div className="flex items-center gap-2">
                      <div className="bg-blue-100/80 p-1.5 rounded-full group-hover:bg-blue-100 transition-colors">
                        <MdOutlineContactSupport className="h-4 w-4 text-blue-600" />
                      </div>
                      <span>Tanyakan Dokter</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="bg-blue-50/20 p-4 text-slate-700 leading-relaxed border-t border-blue-100/80">
                    <div className="bg-white p-3 rounded-md border border-blue-100/60 shadow-sm">
                      {compound.fda.safety.askDoctor}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              {compound.fda.safety.askDoctorOrPharmacist && (
                <AccordionItem
                  value="ask-doctor-pharmacist"
                  className="border-b"
                >
                  <AccordionTrigger className="py-3 px-4 hover:bg-blue-50 text-blue-700 hover:no-underline font-medium group">
                    <div className="flex items-center gap-2">
                      <div className="bg-blue-100/80 p-1.5 rounded-full group-hover:bg-blue-100 transition-colors">
                        <MdOutlineContactSupport className="h-4 w-4 text-blue-600" />
                      </div>
                      <span>Tanyakan Dokter atau Apoteker</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="bg-blue-50/20 p-4 text-slate-700 leading-relaxed border-t border-blue-100/80">
                    <div className="bg-white p-3 rounded-md border border-blue-100/60 shadow-sm">
                      {compound.fda.safety.askDoctorOrPharmacist}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              {compound.fda.safety.whenUsing && (
                <AccordionItem value="when-using" className="border-b">
                  <AccordionTrigger className="py-3 px-4 hover:bg-indigo-50 text-indigo-700 hover:no-underline font-medium group">
                    <div className="flex items-center gap-2">
                      <div className="bg-indigo-100/80 p-1.5 rounded-full group-hover:bg-indigo-100 transition-colors">
                        <MdOutlineAccessTime className="h-4 w-4 text-indigo-600" />
                      </div>
                      <span>Ketika Menggunakan</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="bg-indigo-50/20 p-4 text-slate-700 leading-relaxed border-t border-indigo-100/80">
                    <div className="bg-white p-3 rounded-md border border-indigo-100/60 shadow-sm">
                      {compound.fda.safety.whenUsing}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              {compound.fda.safety.keepOutOfReachOfChildren && (
                <AccordionItem
                  value="children-warning"
                  className="border-b last:border-b-0"
                >
                  <AccordionTrigger className="py-3 px-4 hover:bg-purple-50 text-purple-700 hover:no-underline font-medium group">
                    <div className="flex items-center gap-2">
                      <div className="bg-purple-100/80 p-1.5 rounded-full group-hover:bg-purple-100 transition-colors">
                        <MdOutlineChildCare className="h-4 w-4 text-purple-600" />
                      </div>
                      <span>Jauhkan dari Jangkauan Anak-anak</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="bg-purple-50/20 p-4 text-slate-700 leading-relaxed border-t border-purple-100/80">
                    <div className="bg-white p-3 rounded-md border border-purple-100/60 shadow-sm">
                      {compound.fda.safety.keepOutOfReachOfChildren}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          </CardContent>
        </Card>
      )}

      {/* PubChem Safety Information - Improved */}
      {compound.essential.safetyHazards !== "N/A" ||
      compound.essential.toxicity !== "N/A" ? (
        <>
          {compound.essential.safetyHazards !== "N/A" && (
            <Card className="overflow-hidden border-amber-200 shadow-sm hover:shadow-md transition-all duration-300">
              <CardHeader className="border-b border-amber-100 bg-gradient-to-r from-amber-50 to-amber-100/40 pb-3">
                <CardTitle className="flex items-center gap-2 text-amber-800">
                  <div className="bg-amber-100 p-1.5 rounded-full">
                    <MdOutlineSecurity className="text-amber-600 h-5 w-5" />
                  </div>
                  <span>Keamanan & Bahaya (PubChem)</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="bg-white p-4 rounded-md border border-amber-100 shadow-sm">
                  <p className="text-slate-700 whitespace-pre-line leading-relaxed">
                    {compound.essential.safetyHazards}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {compound.essential.toxicity !== "N/A" && (
            <Card className="overflow-hidden border-red-200 shadow-sm hover:shadow-md transition-all duration-300">
              <CardHeader className="border-b border-red-100 bg-gradient-to-r from-red-50 to-red-100/40 pb-3">
                <CardTitle className="flex items-center gap-2 text-red-800">
                  <div className="bg-red-100 p-1.5 rounded-full">
                    <MdOutlineWarningAmber className="text-red-600 h-5 w-5" />
                  </div>
                  <span>Toksisitas (PubChem)</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="bg-white p-4 rounded-md border border-red-100 shadow-sm">
                  <p className="text-slate-700 whitespace-pre-line leading-relaxed">
                    {compound.essential.toxicity}
                  </p>
                </div>
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
        !compound.fda && (
          <Card className="overflow-hidden border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
            <CardContent className="p-8 text-center">
              <div className="inline-flex items-center justify-center rounded-full bg-slate-100 p-6 mb-5">
                <MdOutlineInfo className="h-8 w-8 text-slate-500" />
              </div>
              <h3 className="text-lg font-medium text-slate-800 mb-2">
                Informasi Keamanan Tidak Tersedia
              </h3>
              <p className="text-slate-500 max-w-md mx-auto">
                Data keamanan & toksisitas untuk {compound.name} belum tersedia
                di database PubChem atau FDA.
              </p>
            </CardContent>
          </Card>
        )
      )}

      {/* Physical Safety Properties */}
      {compound.raw?.Record?.Section?.[3]?.Section?.[1]?.Section?.[0]
        ?.Information && (
        <Card className="overflow-hidden border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-slate-100/40 pb-3">
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <div className="bg-slate-100 p-1.5 rounded-full">
                <MdOutlineScience className="text-slate-600 h-5 w-5" />
              </div>
              <span>Sifat Fisik Keamanan</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {compound.raw?.Record?.Section?.[3]?.Section?.[1]?.Section?.[0]?.Information?.map(
                (info, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm"
                  >
                    <h3 className="font-medium text-slate-700 text-sm mb-2">
                      Deskripsi Fisik
                    </h3>
                    <p className="text-slate-600">
                      {info?.Value?.StringWithMarkup?.[0]?.String ||
                        "Tidak tersedia"}
                    </p>
                  </div>
                )
              )}

              {compound.raw?.Record?.Section?.[3]?.Section?.[1]?.Section?.[2]?.Information?.map(
                (info, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm"
                  >
                    <h3 className="font-medium text-slate-700 text-sm mb-2">
                      Bau
                    </h3>
                    <p className="text-slate-600">
                      {info?.Value?.StringWithMarkup?.[0]?.String ||
                        "Tidak tersedia"}
                    </p>
                  </div>
                )
              )}

              {compound.raw?.Record?.Section?.[3]?.Section?.[1]?.Section?.[3]?.Information?.map(
                (info, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm"
                  >
                    <h3 className="font-medium text-slate-700 text-sm mb-2">
                      Rasa
                    </h3>
                    <p className="text-slate-600">
                      {info?.Value?.StringWithMarkup?.[0]?.String ||
                        "Tidak tersedia"}
                    </p>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chemical Safety Symbols - Enhanced Dynamic Display */}
      {compound.raw?.Record?.Section?.[1]?.Information?.[0]?.Value
        ?.StringWithMarkup?.[0]?.Markup && (
        <Card className="overflow-hidden border-amber-200 shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="border-b border-amber-200 bg-gradient-to-r from-amber-50 to-amber-100/60 pb-3">
            <CardTitle className="flex items-center gap-2 text-amber-800">
              <div className="bg-amber-100 p-1.5 rounded-full">
                <MdOutlineWarningAmber className="text-amber-600 h-5 w-5" />
              </div>
              <span>Simbol Keamanan Kimia GHS</span>
            </CardTitle>
            <CardDescription className="text-amber-700/80">
              Sistem Harmonisasi Global untuk klasifikasi dan pelabelan bahan
              kimia
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-5">
            {compound.raw.Record.Section[1].Information[0].Value
              .StringWithMarkup[0].Markup.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {compound.raw.Record.Section[1].Information[0].Value.StringWithMarkup[0].Markup.map(
                    (icon, index) => (
                      <div
                        key={index}
                        className="flex flex-col items-center group"
                      >
                        <div className="bg-white p-3 rounded-lg border border-amber-200 shadow-sm hover:shadow-md transition-all duration-300 w-full">
                          <div className="aspect-square flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform">
                            <img
                              src={icon.URL}
                              alt={icon.Extra || "Simbol Keamanan"}
                              className="w-full h-full object-contain max-h-24"
                            />
                          </div>
                        </div>
                        <div className="mt-3 text-center">
                          <span className="font-medium text-amber-800 text-sm block">
                            {icon.Extra}
                          </span>
                          <Badge
                            variant="outline"
                            className="mt-1 text-xs bg-amber-50/80 text-amber-700 border-amber-200"
                          >
                            Simbol GHS
                          </Badge>
                        </div>
                      </div>
                    )
                  )}
                </div>

                <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <h3 className="text-amber-800 font-medium flex items-center gap-2 mb-2">
                    <MdOutlineInfo className="h-5 w-5 text-amber-600" />
                    Informasi Simbol GHS
                  </h3>
                  <p className="text-amber-700 text-sm">
                    Simbol GHS (Globally Harmonized System) adalah standar
                    internasional untuk klasifikasi dan pelabelan bahan kimia.
                    Simbol-simbol ini menunjukkan potensi bahaya dan perlu
                    ditangani dengan hati-hati sesuai protokol keamanan.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                    <Alert className="bg-amber-50/60 border-amber-200">
                      <MdOutlineWarningAmber className="h-5 w-5 text-amber-600" />
                      <AlertTitle className="text-amber-800 font-medium text-sm">
                        Perhatian Penting
                      </AlertTitle>
                      <AlertDescription className="text-amber-700 text-xs">
                        Selalu gunakan perlindungan yang tepat dan ikuti
                        protokol keamanan saat menangani bahan kimia ini.
                      </AlertDescription>
                    </Alert>

                    <Alert className="bg-amber-50/60 border-amber-200">
                      <MdOutlineSecurity className="h-5 w-5 text-amber-600" />
                      <AlertTitle className="text-amber-800 font-medium text-sm">
                        Penanganan Aman
                      </AlertTitle>
                      <AlertDescription className="text-amber-700 text-xs">
                        Baca MSDS (Material Safety Data Sheet) lengkap sebelum
                        menggunakan bahan kimia ini.
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center p-6 bg-amber-50/50 border border-amber-100 rounded-lg">
                <MdOutlineInfo className="h-8 w-8 text-amber-400 mx-auto mb-2" />
                <p className="text-amber-700">
                  Tidak ada simbol keamanan GHS yang tersedia untuk senyawa ini.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Detailed Chemical Safety Guidelines - Improved */}
      {compound.raw?.Record?.Section?.[5]?.Section?.some(
        (section) => section.TOCHeading === "Safety and Hazards"
      ) && (
        <Card className="overflow-hidden border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-slate-100/40 pb-3">
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <div className="bg-slate-100 p-1.5 rounded-full">
                <MdOutlineShield className="text-slate-600 h-5 w-5" />
              </div>
              <span>Panduan Keamanan Kimia Detail</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ScrollArea className="max-h-[500px] pr-4">
              <div className="space-y-5">
                {compound.raw?.Record?.Section?.[5]?.Section?.find(
                  (section) => section.TOCHeading === "Safety and Hazards"
                )?.Section?.map((subsection, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm mb-4 last:mb-0"
                  >
                    <h3 className="font-medium text-slate-800 mb-3 pb-2 border-b border-slate-100 flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-slate-400"></div>
                      {subsection.TOCHeading}
                    </h3>
                    <div className="space-y-3">
                      {subsection.Information?.map((info, infoIdx) => (
                        <div key={infoIdx} className="mb-3 last:mb-0">
                          {info.Name && (
                            <h4 className="text-sm font-medium text-slate-700 mb-1.5 flex items-center">
                              <span className="inline-block h-1 w-1 bg-slate-400 rounded-full mr-2"></span>
                              {info.Name}
                            </h4>
                          )}
                          <div className="bg-slate-50 p-3 rounded-md border border-slate-100">
                            <p className="text-slate-700 whitespace-pre-line leading-relaxed text-sm sm:text-base">
                              {info?.Value?.StringWithMarkup?.[0]?.String}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="pt-2 pb-4 px-4 border-t border-slate-100 flex justify-between items-center">
            <p className="text-xs text-slate-500">
              Sumber: PubChem Safety dan GHS Database
            </p>
            <Badge variant="outline" className="bg-slate-50">
              Terjemahan dari Bahasa Inggris
            </Badge>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}

export default SafetyTab;
