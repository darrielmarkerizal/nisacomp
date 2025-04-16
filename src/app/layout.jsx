import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import {
  MdMenu,
  MdFavorite,
  MdHistory,
  MdHome,
  MdMedication,
  MdCompareArrows,
  MdSearch,
  MdCalculate,
  MdWaterDrop,
  MdPerson,
  MdSettings,
} from "react-icons/md";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "MedGuide - Asisten Farmasi Personal untuk Nisa",
  description:
    "Alternatif LexiComp dengan informasi obat lengkap, interaksi obat, kalkulator dosis, dan fitur farmasi lainnya.",
  icons: {
    icon: "/favicon.ico",
  },
};

// Data menu navigasi
const navMenuItems = [
  {
    title: "Informasi Obat",
    href: "/drug-info",
    icon: <MdMedication className="w-5 h-5" />,
    color: "text-indigo-600",
    description: "Monograf obat: dosis, efek samping, kontraindikasi",
  },
  {
    title: "Interaksi Obat",
    href: "/interactions",
    icon: <MdCompareArrows className="w-5 h-5" />,
    color: "text-sky-600",
    description: "Periksa interaksi antarobat",
  },
  {
    title: "Identifikasi Obat",
    href: "/identify",
    icon: <MdSearch className="w-5 h-5" />,
    color: "text-teal-600",
    description: "Kenali obat dari ciri fisik atau kode",
  },
  {
    title: "Kalkulator Dosis",
    href: "/calculator",
    icon: <MdCalculate className="w-5 h-5" />,
    color: "text-amber-600",
    description: "Hitung dosis sesuai kebutuhan pasien",
  },
  {
    title: "Kompatibilitas IV",
    href: "/iv-compatibility",
    icon: <MdWaterDrop className="w-5 h-5" />,
    color: "text-violet-600",
    description: "Periksa kompatibilitas obat intravena",
  },
  {
    title: "Edukasi Pasien",
    href: "/patient-education",
    icon: <MdPerson className="w-5 h-5" />,
    color: "text-emerald-600",
    description: "Material edukasi untuk pasien",
  },
];

export default function RootLayout({ children }) {
  return (
    <html lang="id" style={{ colorScheme: "light" }}>
      <body className={`${plusJakarta.variable} antialiased font-sans`}>
        <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-200 selection:text-indigo-800">
          {/* Header responsif - RATA KIRI */}
          <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="px-4 md:px-6 flex h-14 items-center max-w-7xl mx-auto">
              {/* Area Kiri: Logo dan Hamburger Menu */}
              <div className="flex items-center gap-2">
                {/* Hamburger Menu hanya tampil di mobile dan tablet */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="md:hidden"
                      aria-label="Menu"
                    >
                      <MdMenu className="h-5 w-5" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="left"
                    className="w-[80vw] max-w-[300px] p-0"
                  >
                    <div className="border-b p-4">
                      <SheetTitle className="text-left flex items-center">
                        <div className="rounded-md bg-indigo-100 p-2 mr-3 text-indigo-700">
                          <MdMedication className="h-5 w-5" />
                        </div>
                        <span className="text-xl font-semibold">MedGuide</span>
                      </SheetTitle>
                    </div>
                    <nav className="flex flex-col px-2 py-4">
                      {navMenuItems.map((item, index) => (
                        <Link
                          key={index}
                          href={item.href}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-slate-100 transition-colors mb-1"
                        >
                          <div
                            className={`p-1.5 rounded-md bg-slate-100 ${item.color}`}
                          >
                            {item.icon}
                          </div>
                          <div>
                            <div className="font-medium">{item.title}</div>
                            <div className="text-xs text-slate-500 hidden sm:block">
                              {item.description}
                            </div>
                          </div>
                        </Link>
                      ))}
                      <div className="h-px bg-slate-200 my-3"></div>
                      <Link
                        href="/favorites"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-slate-100 transition-colors"
                      >
                        <div className="p-1.5 rounded-md bg-slate-100 text-rose-600">
                          <MdFavorite className="h-5 w-5" />
                        </div>
                        <div className="font-medium">Favorit</div>
                      </Link>
                      <Link
                        href="/history"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-slate-100 transition-colors"
                      >
                        <div className="p-1.5 rounded-md bg-slate-100 text-blue-600">
                          <MdHistory className="h-5 w-5" />
                        </div>
                        <div className="font-medium">Riwayat</div>
                      </Link>
                    </nav>
                  </SheetContent>
                </Sheet>

                {/* Logo - Responsif */}
                <Link href="/" className="flex items-center">
                  <div className="rounded-md bg-indigo-100 p-1.5 text-indigo-700 mr-2 md:hidden">
                    <MdMedication className="h-4 w-4" />
                  </div>
                  <div className="flex">
                    <span className="text-lg font-semibold text-indigo-600">
                      Med
                    </span>
                    <span className="text-lg font-semibold text-slate-700">
                      Guide
                    </span>
                  </div>
                </Link>
              </div>

              {/* Desktop Navigation - Hanya tampil di desktop */}
              <nav className="hidden md:flex items-center ml-6 space-x-1">
                {navMenuItems.slice(0, 3).map((item, index) => (
                  <HoverCard key={index} openDelay={200} closeDelay={100}>
                    <HoverCardTrigger asChild>
                      <Link
                        href={item.href}
                        className="px-2.5 py-1.5 rounded-md text-sm font-medium hover:bg-slate-100 transition-colors"
                      >
                        {item.title}
                      </Link>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-64">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-md bg-slate-100 ${item.color}`}
                        >
                          {item.icon}
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold">
                            {item.title}
                          </h4>
                          <p className="text-xs text-slate-500">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                ))}

                {/* Dropdown untuk menu lainnya */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-sm font-medium"
                    >
                      Lainnya
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="ml-1 h-4 w-4"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    {navMenuItems.slice(3).map((item, index) => (
                      <DropdownMenuItem key={index} asChild>
                        <Link href={item.href} className="cursor-pointer">
                          <div className="flex items-center gap-2">
                            <div className={`${item.color}`}>{item.icon}</div>
                            <span>{item.title}</span>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </nav>

              {/* Area Kanan: Akun dan Fitur */}
              <div className="flex items-center ml-auto gap-1 md:gap-2">
                {/* Favorit dan Riwayat - Hanya tampil di tablet dan desktop */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden md:flex text-slate-600"
                  aria-label="Favorit"
                >
                  <Link
                    href="/favorites"
                    className="flex items-center justify-center"
                  >
                    <MdFavorite className="h-5 w-5" />
                    <span className="sr-only">Favorit</span>
                  </Link>
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden md:flex text-slate-600"
                  aria-label="Riwayat"
                >
                  <Link
                    href="/history"
                    className="flex items-center justify-center"
                  >
                    <MdHistory className="h-5 w-5" />
                    <span className="sr-only">Riwayat</span>
                  </Link>
                </Button>

                {/* Home selalu tampil */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-slate-600"
                  aria-label="Beranda"
                >
                  <Link href="/" className="flex items-center justify-center">
                    <MdHome className="h-5 w-5" />
                    <span className="sr-only">Beranda</span>
                  </Link>
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/avatar-nisa.png" alt="Nisa" />
                        <AvatarFallback className="bg-indigo-100 text-indigo-700">
                          NF
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          Nisa Fredlina
                        </p>
                        <p className="text-xs leading-none text-slate-500">
                          nisa.fredlina@example.com
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <MdPerson className="mr-2 h-4 w-4" />
                      <span>Profil</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <MdSettings className="mr-2 h-4 w-4" />
                      <span>Setelan</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 h-4 w-4"
                      >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      <span>Keluar</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          {/* Konten halaman dengan padding responsif - CONTAINER DIHAPUS AGAR TIDAK TENGAH */}
          <div className="flex-grow">
            <div className="px-4 py-4 md:px-6 md:py-6 max-w-7xl mx-auto">
              {children}
            </div>
          </div>

          {/* Footer responsif - RATA KIRI */}
          <footer className="mt-auto py-4 md:py-6 px-4 text-sm text-slate-500 border-t border-slate-200 bg-white">
            <div className="max-w-7xl mx-auto">
              <p className="hidden sm:block">
                Dibuat dengan ❤️ untuk Nisa Fredlina Mahardika Saputri
              </p>
              <p className="sm:hidden">Dibuat dengan ❤️ untuk Nisa</p>
              <p className="mt-1">© {new Date().getFullYear()} MedGuide</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
