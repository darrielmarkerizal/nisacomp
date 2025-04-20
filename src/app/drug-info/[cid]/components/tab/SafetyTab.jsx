import React from "react";
import {
  MdOutlineWarning,
  MdOutlineWarningAmber,
  MdOutlineSecurity,
  MdOutlineInfo,
} from "react-icons/md";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

function SafetyTab({ compound, renderSectionIfExists }) {
  return (
    <div className="space-y-6">
      {/* FDA Warnings Card */}
      {compound.fda && compound.fda.clinical.warnings && (
        <Card>
          <CardHeader className="bg-red-50">
            <CardTitle className="flex items-center gap-2 text-red-800">
              <MdOutlineWarning className="text-red-600" /> Peringatan FDA
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-slate-700 whitespace-pre-line">
              {compound.fda.clinical.warnings}
            </p>
          </CardContent>
        </Card>
      )}

      {/* FDA Safety Accordion */}
      {compound.fda && (
        <Accordion type="multiple" defaultValue={["do-not-use"]}>
          {compound.fda.safety.doNotUse && (
            <AccordionItem value="do-not-use">
              <AccordionTrigger className="text-red-700 hover:no-underline">
                <span className="flex items-center">
                  <MdOutlineWarningAmber className="mr-2" /> JANGAN DIGUNAKAN
                  JIKA
                </span>
              </AccordionTrigger>
              <AccordionContent className="bg-red-50 p-3 rounded-md text-red-900">
                {compound.fda.safety.doNotUse}
              </AccordionContent>
            </AccordionItem>
          )}

          {compound.fda.safety.stopUse && (
            <AccordionItem value="stop-use">
              <AccordionTrigger className="text-amber-700 hover:no-underline">
                <span className="flex items-center">
                  <MdOutlineWarningAmber className="mr-2" /> HENTIKAN PENGGUNAAN
                  JIKA
                </span>
              </AccordionTrigger>
              <AccordionContent className="bg-amber-50 p-3 rounded-md text-amber-900">
                {compound.fda.safety.stopUse}
              </AccordionContent>
            </AccordionItem>
          )}

          {compound.fda.safety.askDoctor && (
            <AccordionItem value="ask-doctor">
              <AccordionTrigger>
                <span className="flex items-center gap-2">Tanyakan Dokter</span>
              </AccordionTrigger>
              <AccordionContent className="bg-slate-50 p-3 rounded-md">
                {compound.fda.safety.askDoctor}
              </AccordionContent>
            </AccordionItem>
          )}

          {compound.fda.safety.askDoctorOrPharmacist && (
            <AccordionItem value="ask-doctor-pharmacist">
              <AccordionTrigger>
                <span className="flex items-center gap-2">
                  Tanyakan Dokter atau Apoteker
                </span>
              </AccordionTrigger>
              <AccordionContent className="bg-slate-50 p-3 rounded-md">
                {compound.fda.safety.askDoctorOrPharmacist}
              </AccordionContent>
            </AccordionItem>
          )}

          {compound.fda.safety.whenUsing && (
            <AccordionItem value="when-using">
              <AccordionTrigger>
                <span className="flex items-center gap-2">
                  Ketika Menggunakan
                </span>
              </AccordionTrigger>
              <AccordionContent className="bg-slate-50 p-3 rounded-md">
                {compound.fda.safety.whenUsing}
              </AccordionContent>
            </AccordionItem>
          )}

          {compound.fda.safety.keepOutOfReachOfChildren && (
            <AccordionItem value="children-warning">
              <AccordionTrigger>
                <span className="flex items-center gap-2">
                  Jauhkan dari Jangkauan Anak-anak
                </span>
              </AccordionTrigger>
              <AccordionContent className="bg-slate-50 p-3 rounded-md">
                {compound.fda.safety.keepOutOfReachOfChildren}
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      )}

      {/* PubChem Safety Information */}
      {compound.essential.safetyHazards !== "N/A" ||
      compound.essential.toxicity !== "N/A" ? (
        <>
          {compound.essential.safetyHazards !== "N/A" && (
            <Card>
              <CardHeader className="bg-amber-50">
                <CardTitle className="flex items-center gap-2 text-amber-800">
                  <MdOutlineSecurity className="text-amber-600" /> Keamanan &
                  Bahaya (PubChem)
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
                  <MdOutlineWarningAmber className="text-red-600" /> Toksisitas
                  (PubChem)
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
        !compound.fda && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="inline-flex items-center justify-center rounded-full bg-slate-100 p-4 mb-4">
                <MdOutlineInfo className="h-6 w-6 text-slate-600" />
              </div>
              <h3 className="text-lg font-medium text-slate-800">
                Informasi Keamanan Tidak Tersedia
              </h3>
              <p className="text-slate-500 mt-2">
                Data keamanan & toksisitas untuk {compound.name} belum tersedia
                di database PubChem atau FDA.
              </p>
            </CardContent>
          </Card>
        )
      )}

      {/* Chemical Safety Symbols */}
      {compound.raw?.Record?.Section?.[1]?.Information?.[0]?.Value
        ?.StringWithMarkup?.[0]?.Markup && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader className="bg-amber-100 border-b border-amber-200">
            <CardTitle className="flex items-center gap-2 text-amber-800">
              <MdOutlineWarningAmber className="text-amber-600 h-5 w-5" />{" "}
              Keamanan Kimia
            </CardTitle>
            <CardDescription className="text-amber-700">
              Simbol dan peringatan untuk penanganan bahan kimia ini
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {compound.raw.Record.Section[1].Information[0].Value.StringWithMarkup[0].Markup.map(
                (icon, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="bg-white p-3 rounded-md border border-amber-200 shadow-sm">
                      <Badge
                        variant="outline"
                        className="h-16 w-16 flex items-center justify-center p-2 bg-amber-50 border-amber-300"
                      >
                        {icon.Extra}
                      </Badge>
                    </div>
                    <span className="text-sm mt-2 text-center font-medium text-amber-800">
                      {icon.Extra}
                    </span>
                  </div>
                )
              )}
            </div>
            <div className="mt-6 pt-4 border-t border-amber-200">
              <p className="text-amber-700 text-sm flex items-center">
                <MdOutlineWarning className="inline mr-2" />
                Simbol-simbol ini menunjukkan potensi bahaya dan perlu ditangani
                dengan hati-hati sesuai protokol keamanan.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Chemical Safety Guidelines */}
      {compound.raw?.Record?.Section?.[5]?.Section?.some(
        (section) => section.TOCHeading === "Safety and Hazards"
      ) && (
        <Card>
          <CardHeader>
            <CardTitle>Panduan Keamanan Kimia Detail</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {compound.raw?.Record?.Section?.[5]?.Section?.find(
              (section) => section.TOCHeading === "Safety and Hazards"
            )?.Section?.map((subsection, idx) => (
              <div
                key={idx}
                className="mb-4 pb-4 border-b border-slate-100 last:border-0"
              >
                <h3 className="font-medium text-slate-800 mb-2">
                  {subsection.TOCHeading}
                </h3>
                {subsection.Information?.map((info, infoIdx) => (
                  <div key={infoIdx} className="mb-2">
                    {info.Name && (
                      <h4 className="text-sm font-medium text-slate-600 mb-1">
                        {info.Name}
                      </h4>
                    )}
                    <p className="text-slate-700 whitespace-pre-line">
                      {info?.Value?.StringWithMarkup?.[0]?.String}
                    </p>
                  </div>
                ))}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default SafetyTab;
