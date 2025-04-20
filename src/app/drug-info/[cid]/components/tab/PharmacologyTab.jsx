import React from "react";
import {
  MdOutlineHealthAndSafety,
  MdOutlineBiotech,
  MdOutlineChevronRight,
  MdSearch,
  MdOpenInNew,
} from "react-icons/md";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function PharmacologyTab({ compound, renderSectionIfExists }) {
  return (
    <div className="space-y-6">
      {/* FDA Clinical Information Card */}
      {compound.fda && (
        <Card>
          <CardHeader className="border-b pb-3 bg-blue-50">
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <MdOutlineHealthAndSafety className="text-blue-600" /> Informasi
              Klinis FDA
            </CardTitle>
            <CardDescription>
              Data dari U.S. FDA untuk penggunaan klinis
            </CardDescription>
          </CardHeader>
          <CardContent className="divide-y">
            {compound.fda.clinical.purpose && (
              <div className="py-4">
                <h3 className="font-medium text-slate-800 mb-2">
                  Tujuan Terapeutik
                </h3>
                <p className="text-slate-700">
                  {compound.fda.clinical.purpose}
                </p>
              </div>
            )}

            {compound.fda.clinical.indicationsAndUsage && (
              <div className="py-4">
                <h3 className="font-medium text-slate-800 mb-2">
                  Indikasi & Penggunaan
                </h3>
                <p className="text-slate-700 whitespace-pre-line">
                  {compound.fda.clinical.indicationsAndUsage}
                </p>
              </div>
            )}

            {compound.fda.clinical.dosageAndAdministration && (
              <div className="py-4">
                <h3 className="font-medium text-slate-800 mb-2">
                  Dosis & Cara Pemberian
                </h3>
                <p className="text-slate-700 whitespace-pre-line">
                  {compound.fda.clinical.dosageAndAdministration}
                </p>
              </div>
            )}

            {compound.fda.clinical.pregnancy && (
              <div className="py-4">
                <h3 className="font-medium text-slate-800 mb-2">
                  Kehamilan & Menyusui
                </h3>
                <p className="text-slate-700 whitespace-pre-line">
                  {compound.fda.clinical.pregnancy}
                </p>
              </div>
            )}

            {compound.fda.clinical.activeIngredient && (
              <div className="py-4">
                <h3 className="font-medium text-slate-800 mb-2">Bahan Aktif</h3>
                <p className="text-slate-700">
                  {compound.fda.clinical.activeIngredient}
                </p>
              </div>
            )}

            {compound.fda.other.inactiveIngredients && (
              <div className="py-4">
                <h3 className="font-medium text-slate-800 mb-2">
                  Bahan Tidak Aktif
                </h3>
                <p className="text-slate-700 whitespace-pre-line">
                  {compound.fda.other.inactiveIngredients}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* PubChem Pharmacology Card */}
      {compound.essential.pharmacology !== "N/A" ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MdOutlineBiotech className="text-indigo-600" /> Farmakologi
              (PubChem)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-700 whitespace-pre-line">
              {compound.essential.pharmacology}
            </p>
          </CardContent>
        </Card>
      ) : (
        !compound.fda && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="inline-flex items-center justify-center rounded-full bg-slate-100 p-4 mb-4">
                <MdSearch className="h-6 w-6 text-slate-600" />
              </div>
              <h3 className="text-lg font-medium text-slate-800">
                Informasi Farmakologi Tidak Tersedia
              </h3>
              <p className="text-slate-500 mt-2">
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
          <Card>
            <CardHeader>
              <CardTitle>Klasifikasi Farmakologi FDA</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {compound.fda.pharmacology.mechanismOfAction && (
                  <div>
                    <h3 className="font-medium text-slate-700">
                      Mekanisme Aksi
                    </h3>
                    <Badge className="mt-1 bg-green-100 text-green-800 border-none">
                      {compound.fda.pharmacology.mechanismOfAction}
                    </Badge>
                  </div>
                )}

                {compound.fda.pharmacology.chemicalStructure && (
                  <div>
                    <h3 className="font-medium text-slate-700">
                      Struktur Kimia
                    </h3>
                    <Badge className="mt-1 bg-purple-100 text-purple-800 border-none">
                      {compound.fda.pharmacology.chemicalStructure}
                    </Badge>
                  </div>
                )}

                {compound.fda.pharmacology.physiologicEffect && (
                  <div>
                    <h3 className="font-medium text-slate-700">
                      Efek Fisiologis
                    </h3>
                    <Badge className="mt-1 bg-blue-100 text-blue-800 border-none">
                      {compound.fda.pharmacology.physiologicEffect}
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

      {/* Drug Indication Card (if not in FDA but in PubChem) */}
      {compound.essential.drugIndication !== "N/A" &&
        !compound.fda?.clinical.indicationsAndUsage && (
          <Card>
            <CardHeader>
              <CardTitle>Indikasi & Penggunaan (PubChem)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 whitespace-pre-line">
                {compound.essential.drugIndication}
              </p>
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
        <Card className="border-green-200">
          <CardHeader className="bg-green-50 border-b border-green-200">
            <CardTitle className="flex items-center gap-2 text-green-800">
              <MdOutlineBiotech className="text-green-600" /> Mekanisme Aksi
              Detail
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {compound.raw?.Record?.Section?.[4]?.Section?.find(
              (section) => section.TOCHeading === "Mechanism of Action"
            )?.Information?.map((info, idx) => (
              <div key={idx} className="mb-4">
                <p className="text-slate-700 whitespace-pre-line">
                  {info?.Value?.StringWithMarkup?.[0]?.String}
                </p>
                {info.ReferenceNumber && (
                  <div className="text-right mt-1">
                    <Badge variant="outline" className="text-xs">
                      Sumber #{info.ReferenceNumber}
                    </Badge>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Clinical Information Specific to Infections */}
      {compound.raw?.Record?.Section?.[9]?.Information?.some((info) =>
        info?.Value?.StringWithMarkup?.[0]?.String?.includes("infections")
      ) && (
        <Card>
          <CardHeader>
            <CardTitle>Informasi Klinis Spesifik</CardTitle>
          </CardHeader>
          <CardContent>
            {compound.raw?.Record?.Section?.[9]?.Information?.map(
              (info, idx) => {
                const content = info?.Value?.StringWithMarkup?.[0]?.String;
                if (content && content.includes("infections")) {
                  return (
                    <div key={idx} className="mb-3">
                      <h3 className="font-medium text-slate-700 mb-1">
                        Infeksi yang dapat diobati
                      </h3>
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

      {/* External Resource Links */}
      {(compound.fda ||
        compound.essential.pharmacology !== "N/A" ||
        compound.essential.drugIndication !== "N/A") && (
        <Card className="bg-slate-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-600">
              Sumber Informasi Tambahan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {compound.fda && (
                <li className="flex items-center">
                  <MdOutlineChevronRight className="text-blue-500 mr-1" />
                  <a
                    href="https://www.fda.gov/drugs/drug-approvals-and-databases/drugsfda-data-files"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline flex items-center"
                  >
                    FDA Database <MdOpenInNew className="ml-1 h-3 w-3" />
                  </a>
                </li>
              )}
              <li className="flex items-center">
                <MdOutlineChevronRight className="text-blue-500 mr-1" />
                <a
                  href={`https://pubchem.ncbi.nlm.nih.gov/compound/${compound.cid}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline flex items-center"
                >
                  PubChem Record <MdOpenInNew className="ml-1 h-3 w-3" />
                </a>
              </li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default PharmacologyTab;
