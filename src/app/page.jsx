import Link from "next/link";
import {
  MdMedication,
  MdCompareArrows,
  MdSearch,
  MdCalculate,
  MdWaterDrop,
  MdPerson,
  MdFavorite,
  MdOutlineSearch,
} from "react-icons/md";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReconciliationDialog } from "@/components/ReconciliationDialog";

export default function Home() {
  const firstName = "Nisa";

  const features = [
    {
      title: "Informasi Obat",
      description: "Monograf lengkap obat: dosis, efek samping, kontraindikasi",
      icon: <MdMedication className="w-6 h-6" />,
      href: "/drug-info",
      color: "bg-indigo-50",
      textColor: "text-indigo-700",
      borderColor: "border-indigo-100",
      iconBg: "bg-indigo-100",
    },
    {
      title: "Interaksi Obat",
      description: "Analisis interaksi antarobat dengan tingkat keparahan",
      icon: <MdCompareArrows className="w-6 h-6" />,
      href: "/interactions",
      color: "bg-sky-50",
      textColor: "text-sky-700",
      borderColor: "border-sky-100",
      iconBg: "bg-sky-100",
    },
    {
      title: "Identifikasi Obat",
      description: "Identifikasi berdasarkan ciri fisik, imprint, atau kode",
      icon: <MdSearch className="w-6 h-6" />,
      href: "/identify",
      color: "bg-teal-50",
      textColor: "text-teal-700",
      borderColor: "border-teal-100",
      iconBg: "bg-teal-100",
    },
    {
      title: "Kalkulator Dosis",
      description: "Hitungan dosis berdasarkan berat, usia, dan kondisi pasien",
      icon: <MdCalculate className="w-6 h-6" />,
      href: "/calculator",
      color: "bg-amber-50",
      textColor: "text-amber-700",
      borderColor: "border-amber-100",
      iconBg: "bg-amber-100",
    },
    {
      title: "Kompatibilitas IV",
      description:
        "Data kompatibilitas untuk pemberian obat intravena simultan",
      icon: <MdWaterDrop className="w-6 h-6" />,
      href: "/iv-compatibility",
      color: "bg-violet-50",
      textColor: "text-violet-700",
      borderColor: "border-violet-100",
      iconBg: "bg-violet-100",
    },
    {
      title: "Edukasi Pasien",
      description: "Material edukasi pasien dalam bahasa yang mudah dipahami",
      icon: <MdPerson className="w-6 h-6" />,
      href: "/patient-education",
      color: "bg-emerald-50",
      textColor: "text-emerald-700",
      borderColor: "border-emerald-100",
      iconBg: "bg-emerald-100",
    },
  ];

  const frequentlySearched = [
    "Paracetamol",
    "Amoxicillin",
    "Omeprazole",
    "Simvastatin",
    "Metformin",
    "Amlodipine",
  ];

  return (
    <>
      {/* Reconciliation Dialog */}
      <ReconciliationDialog />

      {/* Header dengan greeting - Rata Kiri */}
      <div className="mb-6 md:mb-8">
        <h2 className="text-xl md:text-2xl font-medium text-slate-800">
          Selamat datang,{" "}
          <span className="font-semibold text-indigo-600">{firstName}</span>!
        </h2>
        <p className="text-slate-500 mt-1 text-sm md:text-base">
          Referensi farmasi dalam genggaman Anda
        </p>
      </div>

      {/* Search Bar - Rata Kiri */}
      <div className="mb-8 md:mb-10">
        <div className="max-w-xl">
          <div className="flex gap-2">
            <div className="relative flex-grow">
              <Input
                type="text"
                placeholder="Cari obat atau materi medis..."
                className="pl-10 pr-4 h-10 md:h-12 text-sm md:text-base"
              />
              <MdOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            </div>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white hidden sm:flex">
              Cari
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 sm:hidden">
              <MdSearch className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Quick Search Tags - Rata Kiri */}
        <div className="mt-3 flex flex-wrap gap-1.5 md:gap-2">
          {frequentlySearched.map((drug, idx) => (
            <Badge
              key={idx}
              variant="outline"
              className="px-2 py-0.5 md:px-3 md:py-1 text-xs md:text-sm hover:bg-slate-100 cursor-pointer transition-colors"
            >
              {drug}
            </Badge>
          ))}
        </div>
      </div>

      {/* Main Content - Tab System Rata Kiri */}
      <main>
        <Tabs defaultValue="features" className="mb-6 md:mb-8">
          <TabsList className="w-full justify-start border-b mb-4 pb-0 bg-transparent overflow-x-auto">
            <TabsTrigger
              value="features"
              className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 data-[state=active]:text-indigo-700 rounded-none text-sm"
            >
              Fitur
            </TabsTrigger>
            <TabsTrigger
              value="recent"
              className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 data-[state=active]:text-indigo-700 rounded-none text-sm"
            >
              Terakhir Dilihat
            </TabsTrigger>
            <TabsTrigger
              value="favorites"
              className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 data-[state=active]:text-indigo-700 rounded-none text-sm"
            >
              Favorit
            </TabsTrigger>
          </TabsList>

          {/* Features Tab - Grid responsif */}
          <TabsContent value="features" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className={`border ${feature.borderColor} ${feature.color} overflow-hidden transition-all hover:shadow-md`}
                >
                  <Link href={feature.href} className="block h-full">
                    <CardHeader className="pb-2 p-4 md:p-5">
                      <div className="flex items-start md:block">
                        <div
                          className={`${feature.iconBg} ${feature.textColor} w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center mb-0 md:mb-2 mr-3 md:mr-0`}
                        >
                          {feature.icon}
                        </div>
                        <div>
                          <CardTitle
                            className={`text-base md:text-lg ${feature.textColor}`}
                          >
                            {feature.title}
                          </CardTitle>
                          <p className="text-slate-600 text-xs md:text-sm mt-1 md:mt-0">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                  </Link>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Recent Tab - Responsif */}
          <TabsContent value="recent">
            <Card>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  <div className="p-3 md:p-4 flex items-start">
                    <div className="rounded-lg bg-indigo-100 p-2 mr-3 text-indigo-700 flex-shrink-0">
                      <MdMedication className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-slate-900 text-sm md:text-base truncate">
                        Paracetamol
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        Informasi Obat • 2 jam lalu
                      </p>
                    </div>
                  </div>

                  <div className="p-3 md:p-4 flex items-start">
                    <div className="rounded-lg bg-sky-100 p-2 mr-3 text-sky-700 flex-shrink-0">
                      <MdCompareArrows className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-slate-900 text-sm md:text-base truncate">
                        Amlodipine + Simvastatin
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        Interaksi Obat • 5 jam lalu
                      </p>
                    </div>
                  </div>

                  <div className="p-3 md:p-4 flex items-start">
                    <div className="rounded-lg bg-amber-100 p-2 mr-3 text-amber-700 flex-shrink-0">
                      <MdCalculate className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-slate-900 text-sm md:text-base truncate">
                        Kalkulator Dosis Pediatrik
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        Kalkulator • 1 hari lalu
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-slate-50 border-t border-slate-100 py-2 flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-indigo-600 hover:text-indigo-700 text-xs md:text-sm"
                >
                  Lihat Semua
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Favorites Tab - Tampilan rata kiri */}
          <TabsContent value="favorites">
            <div className="p-6 md:p-8 text-center text-slate-500">
              <div className="flex flex-col items-center">
                <MdFavorite className="w-10 h-10 md:w-12 md:h-12 mb-2 md:mb-3 text-slate-300" />
                <p className="text-sm md:text-base">Belum ada item favorit</p>
                <Button
                  variant="outline"
                  className="mt-3 md:mt-4 text-xs md:text-sm"
                >
                  Jelajahi Fitur
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Referensi Section - Rata Kiri */}
        <div className="mb-6 md:mb-8">
          <h2 className="text-base md:text-lg font-medium text-slate-800 mb-3 md:mb-4">
            Sumber Referensi
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            <Card className="bg-gradient-to-br from-indigo-50 to-slate-50">
              <CardContent className="p-3 md:p-4 flex items-center">
                <div className="mr-3 rounded-full bg-white p-1.5 md:p-2 shadow-sm flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-indigo-600"
                  >
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
                  </svg>
                </div>
                <div className="min-w-0">
                  <h3 className="font-medium text-slate-900 text-sm md:text-base truncate">
                    Referensi Obat
                  </h3>
                  <p className="text-xs text-slate-500 truncate">
                    USP-DI, MIMS, ISO
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-teal-50 to-slate-50">
              <CardContent className="p-3 md:p-4 flex items-center">
                <div className="mr-3 rounded-full bg-white p-1.5 md:p-2 shadow-sm flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-teal-600"
                  >
                    <path d="m21 16-4 4-4-4"></path>
                    <path d="M17 20V4"></path>
                    <path d="M3 8l4-4 4 4"></path>
                    <path d="M7 4v16"></path>
                  </svg>
                </div>
                <div className="min-w-0">
                  <h3 className="font-medium text-slate-900 text-sm md:text-base truncate">
                    Guideline Terapi
                  </h3>
                  <p className="text-xs text-slate-500 truncate">
                    WHO, AHA, JNC
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-50 to-slate-50 sm:col-span-2 lg:col-span-1">
              <CardContent className="p-3 md:p-4 flex items-center">
                <div className="mr-3 rounded-full bg-white p-1.5 md:p-2 shadow-sm flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-amber-600"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <div className="min-w-0">
                  <h3 className="font-medium text-slate-900 text-sm md:text-base truncate">
                    Komunitas
                  </h3>
                  <p className="text-xs text-slate-500 truncate">
                    Forum, Diskusi Kasus
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
