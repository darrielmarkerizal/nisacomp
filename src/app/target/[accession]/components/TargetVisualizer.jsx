"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MdBiotech,
  MdShare,
  Md3dRotation,
  MdOutlineScience,
} from "react-icons/md";

export default function TargetVisualizer({ target }) {
  const [activeStructure, setActiveStructure] = useState(
    target.structure && target.structure.length > 0
      ? target.structure[0].id
      : null
  );

  const [viewType, setViewType] = useState("cartoon");

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h3 className="text-lg font-semibold mb-2">Visualisasi Protein</h3>
        <p className="text-sm text-gray-600">
          Eksplorasi struktur dan karakteristik protein ini secara visual
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Area visualisasi utama */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="overflow-hidden border shadow-sm">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Md3dRotation className="h-5 w-5 text-indigo-600" />
                <span>Struktur Tiga Dimensi</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="p-0">
              {target.structure && target.structure.length > 0 ? (
                <div className="relative">
                  <div className="aspect-video bg-gray-50 flex items-center justify-center">
                    {activeStructure ? (
                      <iframe
                        src={`https://www.rcsb.org/3d-view/molstar/${activeStructure}?bg=white&style=${viewType}`}
                        width="100%"
                        height="100%"
                        style={{ border: "none", minHeight: "400px" }}
                        title={`Struktur 3D ${activeStructure}`}
                      />
                    ) : (
                      <div className="text-center p-10">
                        <p className="text-gray-500">
                          Silakan pilih struktur untuk divisualisasikan
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="absolute top-2 right-2 flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="bg-white/80 backdrop-blur-sm hover:bg-white"
                      onClick={() => {
                        if (activeStructure) {
                          window.open(
                            `https://www.rcsb.org/structure/${activeStructure}`,
                            "_blank"
                          );
                        }
                      }}
                    >
                      <Md3dRotation className="h-4 w-4 mr-1" />
                      <span>Lihat Detail</span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="bg-white/80 backdrop-blur-sm hover:bg-white"
                      onClick={() => {
                        if (navigator.share && activeStructure) {
                          navigator.share({
                            title: `Struktur 3D ${activeStructure}`,
                            url: `https://www.rcsb.org/structure/${activeStructure}`,
                          });
                        } else {
                          navigator.clipboard.writeText(
                            `https://www.rcsb.org/structure/${activeStructure}`
                          );
                          alert("URL disalin ke clipboard!");
                        }
                      }}
                    >
                      <MdShare className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="p-4 border-t bg-gray-50">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="text-sm font-medium text-gray-700">
                        Tampilan:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant={
                            viewType === "cartoon" ? "default" : "outline"
                          }
                          onClick={() => setViewType("cartoon")}
                        >
                          Cartoon
                        </Button>
                        <Button
                          size="sm"
                          variant={
                            viewType === "ball-and-stick"
                              ? "default"
                              : "outline"
                          }
                          onClick={() => setViewType("ball-and-stick")}
                        >
                          Ball & Stick
                        </Button>
                        <Button
                          size="sm"
                          variant={
                            viewType === "surface" ? "default" : "outline"
                          }
                          onClick={() => setViewType("surface")}
                        >
                          Surface
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-10 text-center">
                  <MdOutlineScience className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <h4 className="text-lg font-medium text-gray-700 mb-2">
                    Tidak Ada Data Struktur
                  </h4>
                  <p className="text-sm text-gray-500 max-w-md mx-auto">
                    Protein ini belum memiliki struktur 3D yang ditentukan atau
                    tidak memiliki referensi struktur dalam database PDB.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Visualisasi pathway */}
          <Card className="overflow-hidden border shadow-sm">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4">
              <CardTitle className="text-base font-medium">
                Pathway dan Interaksi
              </CardTitle>
            </CardHeader>

            <CardContent className="p-4">
              {target.pathways && target.pathways.length > 0 ? (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Protein ini terlibat dalam jalur biologis berikut:
                  </p>

                  <ul className="space-y-3">
                    {target.pathways.map((pathway, index) => (
                      <li
                        key={index}
                        className="flex items-start p-3 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div>
                          <span className="font-medium">{pathway.name}</span>
                          <div className="flex items-center mt-1 gap-2">
                            <Badge
                              variant="outline"
                              className="bg-teal-50 text-teal-700"
                            >
                              Reactome: {pathway.id}
                            </Badge>
                            <a
                              href={`https://reactome.org/content/detail/${pathway.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-indigo-600 hover:underline"
                            >
                              Lihat Detail
                            </a>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500">
                    Tidak ada data pathway tersedia untuk protein ini.
                  </p>
                  <Button
                    variant="link"
                    className="mt-2"
                    onClick={() =>
                      window.open(
                        `https://string-db.org/network/${target.organism}/${target.geneName || target.accession}`,
                        "_blank"
                      )
                    }
                  >
                    Cari interaksi di STRING-DB
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar dengan pemilihan struktur */}
        <div className="lg:col-span-4 space-y-6">
          {target.structure && target.structure.length > 0 ? (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Struktur Tersedia</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {target.structure.map((struct, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-md border cursor-pointer transition-colors ${
                        activeStructure === struct.id
                          ? "border-indigo-300 bg-indigo-50"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                      onClick={() => setActiveStructure(struct.id)}
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-indigo-700">
                          {struct.id}
                        </h4>
                        <Badge
                          variant={
                            activeStructure === struct.id
                              ? "default"
                              : "outline"
                          }
                          className={
                            activeStructure === struct.id
                              ? "bg-indigo-100 text-indigo-800 hover:bg-indigo-200"
                              : ""
                          }
                        >
                          PDB
                        </Badge>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        <div className="flex flex-col gap-1">
                          <span>
                            Metode: {struct.method || "Tidak diketahui"}
                          </span>
                          {struct.resolution && (
                            <span>Resolusi: {struct.resolution} Å</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Sumber Alternatif</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">
                  Tidak ada struktur PDB yang tersedia untuk protein ini. Anda
                  dapat mencari di database lain:
                </p>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() =>
                      window.open(
                        `https://alphafold.ebi.ac.uk/search?query=${target.accession}`,
                        "_blank"
                      )
                    }
                  >
                    <MdBiotech className="h-4 w-4 mr-2 text-blue-500" />
                    Cek di AlphaFold
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() =>
                      window.open(
                        `https://www.ebi.ac.uk/pdbe/entry/search/index?searchParams=${target.accession}`,
                        "_blank"
                      )
                    }
                  >
                    <MdOutlineScience className="h-4 w-4 mr-2 text-green-500" />
                    Cari di PDBe
                  </Button>
                </div>
                <Alert className="mt-4 bg-amber-50">
                  <AlertDescription className="text-amber-800 text-xs">
                    Prediksi struktur dapat dihasilkan menggunakan AlphaFold
                    atau model AI lainnya.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Analisis Sekuens</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="stats" className="w-full">
                <TabsList className="grid grid-cols-2 mb-2">
                  <TabsTrigger value="stats">Statistik</TabsTrigger>
                  <TabsTrigger value="properties">Properti</TabsTrigger>
                </TabsList>
                <TabsContent value="stats" className="p-2">
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span className="text-gray-600">Panjang:</span>
                      <span className="font-medium">{target.length} aa</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Tipe Molekul:</span>
                      <span className="font-medium">{target.moleculeType}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Massa Molekul:</span>
                      <span className="font-medium">
                        ~{Math.round(target.length * 110)} Da
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Asam Amino:</span>
                      <span className="font-medium">
                        {calculateAminoAcidCount(target.sequence)}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">
                        Terakhir Diperbarui:
                      </span>
                      <span className="font-medium">
                        {formatDate(target.updateDate)}
                      </span>
                    </li>
                  </ul>
                </TabsContent>
                <TabsContent value="properties" className="p-2">
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        Hidrofobisitas
                      </p>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-teal-500"
                          style={{
                            width: `${calculateHydrophobicity(target.sequence)}%`,
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-xs mt-1">
                        <span>Hidrofilik</span>
                        <span>Hidrofobik</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        Komposisi Asam Amino
                      </p>
                      <div className="flex h-4 rounded-md overflow-hidden">
                        {generateAminoAcidBars(target.sequence).map(
                          (bar, i) => (
                            <div
                              key={i}
                              className={`h-full ${bar.color}`}
                              style={{ width: `${bar.percentage}%` }}
                              title={`${bar.group}: ${bar.percentage.toFixed(1)}%`}
                            />
                          )
                        )}
                      </div>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
                        {generateAminoAcidBars(target.sequence).map(
                          (bar, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-1 text-xs"
                            >
                              <div
                                className={`w-2 h-2 rounded-full ${bar.color}`}
                              />
                              <span>
                                {bar.group}: {bar.percentage.toFixed(1)}%
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Format tanggal
function formatDate(dateStr) {
  if (!dateStr) return "Tidak tersedia";

  try {
    const parts = dateStr.includes("/")
      ? dateStr.split("/")
      : dateStr.split("-");

    if (parts.length < 3) return dateStr;

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ];

    return `${parts[2]} ${months[parseInt(parts[1]) - 1]} ${parts[0]}`;
  } catch (e) {
    return dateStr;
  }
}

// Hitung jumlah asam amino
function calculateAminoAcidCount(sequence) {
  if (!sequence) return 0;
  return sequence.length;
}

// Estimasi hidrofobisitas
function calculateHydrophobicity(sequence) {
  if (!sequence || sequence.length === 0) return 50;

  const hydrophobic = "AILFWV";
  const hydrophilic = "RKDENQ";

  let hydroCount = 0;
  let philicCount = 0;

  for (const char of sequence) {
    if (hydrophobic.includes(char)) hydroCount++;
    if (hydrophilic.includes(char)) philicCount++;
  }

  const total = hydroCount + philicCount;
  if (total === 0) return 50;

  return (hydroCount / total) * 100;
}

// Generate komposisi asam amino
function generateAminoAcidBars(sequence) {
  if (!sequence || sequence.length === 0) {
    return [{ group: "Tidak ada data", percentage: 100, color: "bg-gray-200" }];
  }

  const groups = {
    Hidrofobik: { acids: "AILMFWYV", color: "bg-blue-500" },
    Polar: { acids: "NQST", color: "bg-green-500" },
    Basa: { acids: "KRH", color: "bg-red-500" },
    Asam: { acids: "DE", color: "bg-yellow-500" },
    Spesial: { acids: "CGP", color: "bg-purple-500" },
  };

  const counts = {};
  Object.keys(groups).forEach((key) => {
    counts[key] = 0;
  });

  // Hitung setiap asam amino
  for (const char of sequence) {
    for (const [group, info] of Object.entries(groups)) {
      if (info.acids.includes(char)) {
        counts[group]++;
        break;
      }
    }
  }

  // Hitung persentase
  const result = [];
  Object.keys(counts).forEach((group) => {
    const percentage = (counts[group] / sequence.length) * 100;
    if (percentage > 0) {
      result.push({
        group,
        percentage,
        color: groups[group].color,
      });
    }
  });

  return result;
}
