import React, { useState } from "react";
import Link from "next/link";
import {
  MdLibraryBooks,
  MdOutlineChevronRight,
  MdOutlineScience,
  MdBookmark,
  MdOutlineMedication,
  MdOutlineFoodBank,
  MdOutlineEco,
  MdOutlineWarningAmber,
  MdOutlineWarning,
  MdOutlineBiotech,
  MdOutlineConstruction,
  MdSearch,
  MdOutlineInfo,
  MdOutlineHealthAndSafety,
  MdOpenInNew,
  MdArrowUpward,
  MdFilterList,
  MdToc,
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

function FullContentTab({ compound }) {
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Handle scroll to show/hide back to top button
  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 600) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Extract all sections from compound.raw
  const extractAllSections = (compound) => {
    if (!compound.raw?.Record?.Section) return [];

    return compound.raw.Record.Section.map((section) => {
      // Extract section info
      const sectionInfo = {
        title: section.TOCHeading || "Unknown Section",
        description: section.Description || "",
        hasSubsections: !!section.Section && section.Section.length > 0,
        subsections: [],
        information: section.Information || [],
        raw: section,
      };

      // Extract subsections if available
      if (section.Section && section.Section.length > 0) {
        sectionInfo.subsections = section.Section.map((subsection) => ({
          title: subsection.TOCHeading || "Unknown Subsection",
          description: subsection.Description || "",
          hasSubsubsections:
            !!subsection.Section && subsection.Section.length > 0,
          subsubsections: subsection.Section || [],
          information: subsection.Information || [],
          raw: subsection,
        }));
      }

      return sectionInfo;
    });
  };

  // Function to render section content
  const renderSectionContent = (section) => {
    if (!section) return null;

    return (
      <div className="space-y-4">
        {/* Render section description */}
        {section.description && (
          <div className="text-slate-700 mb-4 text-sm md:text-base">
            <p>{section.description}</p>
          </div>
        )}

        {/* Render section information */}
        {section.information && section.information.length > 0 && (
          <div className="space-y-2 border-b border-slate-100 pb-4 mb-4">
            <h4 className="text-sm md:text-base font-medium text-slate-800 flex items-center gap-1.5">
              <MdOutlineInfo className="text-indigo-500" />
              Informasi Umum
            </h4>
            {section.information.map((info, idx) => (
              <div
                key={idx}
                className="mb-3 pb-3 border-b border-slate-100 last:border-0"
              >
                {info.Name && (
                  <h5 className="text-xs md:text-sm font-medium text-slate-700">
                    {info.Name}
                  </h5>
                )}
                {info.Value?.StringWithMarkup?.[0]?.String && (
                  <p className="text-xs md:text-sm text-slate-700 whitespace-pre-line">
                    {info.Value.StringWithMarkup[0].String}
                  </p>
                )}
                {info.Value?.Number !== undefined && (
                  <p className="text-xs md:text-sm text-slate-700">
                    {info.Value.Number} {info.Value.Unit || ""}
                  </p>
                )}
                {info.ReferenceNumber && (
                  <div className="text-right mt-1">
                    <Badge variant="outline" className="text-xs">
                      Sumber #{info.ReferenceNumber}
                    </Badge>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Extract all available sections
  const allSections = extractAllSections(compound);

  // Helper function to get section icon
  const getSectionIcon = (title) => {
    const title_lower = title.toLowerCase();

    if (title_lower.includes("structure"))
      return <MdOutlineScience className="text-indigo-600" />;
    if (title_lower.includes("name") || title_lower.includes("identifier"))
      return <MdBookmark className="text-blue-600" />;
    if (title_lower.includes("chemical") || title_lower.includes("physical"))
      return <MdOutlineScience className="text-purple-600" />;
    if (title_lower.includes("drug") || title_lower.includes("medication"))
      return <MdOutlineMedication className="text-green-600" />;
    if (title_lower.includes("food"))
      return <MdOutlineFoodBank className="text-amber-600" />;
    if (title_lower.includes("agriculture") || title_lower.includes("agro"))
      return <MdOutlineEco className="text-green-700" />;
    if (title_lower.includes("safety") || title_lower.includes("hazard"))
      return <MdOutlineWarningAmber className="text-red-600" />;
    if (title_lower.includes("toxic"))
      return <MdOutlineWarning className="text-red-600" />;
    if (title_lower.includes("pharmaco") || title_lower.includes("biochem"))
      return <MdOutlineBiotech className="text-teal-600" />;
    if (title_lower.includes("use") || title_lower.includes("manufacturing"))
      return <MdOutlineConstruction className="text-amber-700" />;
    if (title_lower.includes("search") || title_lower.includes("literature"))
      return <MdSearch className="text-slate-600" />;

    return <MdOutlineInfo className="text-slate-600" />;
  };

  // Mobile table of contents component
  const MobileTOC = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 fixed bottom-20 right-4 z-50 shadow-md rounded-full md:hidden"
          size="icon"
        >
          <MdToc />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[85vw] sm:w-[350px] overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle className="text-lg font-medium flex items-center gap-2">
            <MdToc className="text-indigo-600" />
            Daftar Isi
          </SheetTitle>
          <SheetDescription>
            Konten lengkap untuk {compound.name}
          </SheetDescription>
        </SheetHeader>
        <div className="py-4 space-y-4">
          {compound.fda && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="h-6 w-6 rounded-full flex items-center justify-center p-0 bg-blue-600">
                  FDA
                </Badge>
                <Link
                  href="#section-fda"
                  className="font-medium text-blue-600 hover:underline"
                  onClick={() =>
                    document
                      .querySelector(".sheet-overlay-close-button")
                      ?.click()
                  }
                >
                  Informasi FDA
                </Link>
              </div>
              <div className="pl-6 space-y-2">
                <Link
                  href="#section-fda-clinical"
                  className="text-sm text-slate-600 hover:text-blue-600 hover:underline flex items-center gap-1"
                  onClick={() =>
                    document
                      .querySelector(".sheet-overlay-close-button")
                      ?.click()
                  }
                >
                  <MdOutlineChevronRight className="text-slate-400 h-4 w-4 flex-shrink-0" />
                  <span>Informasi Klinis</span>
                </Link>
                <Link
                  href="#section-fda-safety"
                  className="text-sm text-slate-600 hover:text-blue-600 hover:underline flex items-center gap-1"
                  onClick={() =>
                    document
                      .querySelector(".sheet-overlay-close-button")
                      ?.click()
                  }
                >
                  <MdOutlineChevronRight className="text-slate-400 h-4 w-4 flex-shrink-0" />
                  <span>Keamanan & Peringatan</span>
                </Link>
                <Link
                  href="#section-fda-product"
                  className="text-sm text-slate-600 hover:text-blue-600 hover:underline flex items-center gap-1"
                  onClick={() =>
                    document
                      .querySelector(".sheet-overlay-close-button")
                      ?.click()
                  }
                >
                  <MdOutlineChevronRight className="text-slate-400 h-4 w-4 flex-shrink-0" />
                  <span>Informasi Produk</span>
                </Link>
              </div>
            </div>
          )}

          {allSections.map((section, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge className="h-6 w-6 rounded-full flex items-center justify-center p-0">
                  {index + 1}
                </Badge>
                <Link
                  href={`#pubchem-section-${index}`}
                  className="font-medium text-indigo-600 hover:underline"
                  onClick={() =>
                    document
                      .querySelector(".sheet-overlay-close-button")
                      ?.click()
                  }
                >
                  {section.title}
                </Link>
              </div>
              {section.hasSubsections && section.subsections.length > 0 && (
                <div className="pl-6 space-y-2">
                  {section.subsections.map((sub, subIndex) => (
                    <Link
                      key={subIndex}
                      href={`#pubchem-section-${index}-subsection-${subIndex}`}
                      className="text-sm text-slate-600 hover:text-indigo-600 hover:underline flex items-center gap-1"
                      onClick={() =>
                        document
                          .querySelector(".sheet-overlay-close-button")
                          ?.click()
                      }
                    >
                      <MdOutlineChevronRight className="text-slate-400 h-4 w-4 flex-shrink-0" />
                      <span>{sub.title}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <div className="space-y-6 relative pb-12">
      {/* Back to top button */}
      {showBackToTop && (
        <Button
          variant="secondary"
          className="fixed bottom-4 right-4 z-50 shadow-md rounded-full"
          size="icon"
          onClick={scrollToTop}
        >
          <MdArrowUpward />
        </Button>
      )}

      {/* Mobile TOC button - Fixed: Use MobileTOC component directly here */}
      <MobileTOC />

      <Card className="shadow-sm">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b">
          <CardTitle className="text-xl flex items-center gap-2">
            <MdToc className="text-indigo-600" />
            Daftar Isi
          </CardTitle>
          <CardDescription>
            Konten lengkap dari PubChem dan FDA untuk {compound.name}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 md:p-6 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {compound.fda && (
              <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100 space-y-2 hover:bg-blue-50 transition-colors">
                <div className="flex items-center gap-2">
                  <Badge className="h-6 w-6 rounded-full flex items-center justify-center p-0 bg-blue-600">
                    FDA
                  </Badge>
                  <Link
                    href="#section-fda"
                    className="font-medium text-blue-600 hover:underline"
                  >
                    Informasi FDA
                  </Link>
                </div>
                <div className="pl-8 space-y-2">
                  <div className="flex items-center gap-1">
                    <MdOutlineChevronRight className="text-slate-400 h-4 w-4 flex-shrink-0" />
                    <Link
                      href="#section-fda-clinical"
                      className="text-sm text-slate-600 hover:text-blue-600 hover:underline line-clamp-1"
                    >
                      Informasi Klinis
                    </Link>
                  </div>
                  <div className="flex items-center gap-1">
                    <MdOutlineChevronRight className="text-slate-400 h-4 w-4 flex-shrink-0" />
                    <Link
                      href="#section-fda-safety"
                      className="text-sm text-slate-600 hover:text-blue-600 hover:underline line-clamp-1"
                    >
                      Keamanan & Peringatan
                    </Link>
                  </div>
                  <div className="flex items-center gap-1">
                    <MdOutlineChevronRight className="text-slate-400 h-4 w-4 flex-shrink-0" />
                    <Link
                      href="#section-fda-product"
                      className="text-sm text-slate-600 hover:text-blue-600 hover:underline line-clamp-1"
                    >
                      Informasi Produk
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {allSections.map((section, index) => (
              <div
                key={index}
                className="p-3 rounded-lg border border-indigo-100 space-y-2 hover:bg-indigo-50/30 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Badge className="h-6 w-6 rounded-full flex items-center justify-center p-0">
                    {index + 1}
                  </Badge>
                  <Link
                    href={`#pubchem-section-${index}`}
                    className="font-medium text-indigo-600 hover:underline line-clamp-1"
                  >
                    {section.title}
                  </Link>
                </div>
                {section.hasSubsections && section.subsections.length > 0 && (
                  <div className="pl-8 space-y-2">
                    {section.subsections.slice(0, 3).map((sub, subIndex) => (
                      <div key={subIndex} className="flex items-center gap-1">
                        <MdOutlineChevronRight className="text-slate-400 h-4 w-4 flex-shrink-0" />
                        <Link
                          href={`#pubchem-section-${index}-subsection-${subIndex}`}
                          className="text-sm text-slate-600 hover:text-indigo-600 hover:underline line-clamp-1"
                        >
                          {sub.title}
                        </Link>
                      </div>
                    ))}
                    {section.subsections.length > 3 && (
                      <div className="text-right text-xs text-slate-500 italic">
                        +{section.subsections.length - 3} subseksi lainnya
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Render FDA section if available */}
      {compound.fda && (
        <section id="section-fda" className="scroll-mt-16">
          <Card className="border-blue-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <MdOutlineHealthAndSafety className="text-blue-600" /> Informasi
                FDA
              </CardTitle>
              <CardDescription>
                Data dari U.S. Food and Drug Administration untuk{" "}
                {compound.fda.identification.genericName || compound.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-slate-100">
              {/* FDA Clinical Information Section */}
              <div
                id="section-fda-clinical"
                className="scroll-mt-20 p-4 md:p-6"
              >
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2 text-blue-700">
                  <MdOutlineMedication className="text-blue-600" />
                  Informasi Klinis
                </h3>

                <div className="space-y-5">
                  {compound.fda.clinical.purpose && (
                    <div className="rounded-lg bg-white p-4 border border-slate-100 shadow-sm">
                      <h4 className="font-medium text-slate-800 mb-2 flex items-center gap-1.5">
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200"
                        >
                          Tujuan
                        </Badge>
                        <span>Tujuan Terapeutik</span>
                      </h4>
                      <p className="text-slate-700 text-sm md:text-base">
                        {compound.fda.clinical.purpose}
                      </p>
                    </div>
                  )}

                  {compound.fda.clinical.indicationsAndUsage && (
                    <div className="rounded-lg bg-white p-4 border border-slate-100 shadow-sm">
                      <h4 className="font-medium text-slate-800 mb-2 flex items-center gap-1.5">
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200"
                        >
                          Indikasi
                        </Badge>
                        <span>Indikasi & Penggunaan</span>
                      </h4>
                      <p className="text-slate-700 whitespace-pre-line text-sm md:text-base">
                        {compound.fda.clinical.indicationsAndUsage}
                      </p>
                    </div>
                  )}

                  {compound.fda.clinical.dosageAndAdministration && (
                    <div className="rounded-lg bg-white p-4 border border-slate-100 shadow-sm">
                      <h4 className="font-medium text-slate-800 mb-2 flex items-center gap-1.5">
                        <Badge
                          variant="outline"
                          className="bg-purple-50 text-purple-700 hover:bg-purple-50 border-purple-200"
                        >
                          Dosis
                        </Badge>
                        <span>Dosis & Cara Pemberian</span>
                      </h4>
                      <p className="text-slate-700 whitespace-pre-line text-sm md:text-base">
                        {compound.fda.clinical.dosageAndAdministration}
                      </p>
                    </div>
                  )}

                  {compound.fda.clinical.warnings && (
                    <div className="rounded-lg bg-red-50 p-4 border border-red-100 shadow-sm">
                      <h4 className="font-medium text-red-700 mb-2 flex items-center gap-1.5">
                        <MdOutlineWarningAmber className="text-red-600" />
                        <span>Peringatan & Tindakan Pencegahan</span>
                      </h4>
                      <div className="border-l-4 border-red-400 pl-3 py-1">
                        <p className="text-slate-700 whitespace-pre-line text-sm md:text-base">
                          {compound.fda.clinical.warnings}
                        </p>
                      </div>
                    </div>
                  )}

                  {compound.fda.clinical.pregnancy && (
                    <div className="rounded-lg bg-white p-4 border border-slate-100 shadow-sm">
                      <h4 className="font-medium text-slate-800 mb-2 flex items-center gap-1.5">
                        <Badge
                          variant="outline"
                          className="bg-pink-50 text-pink-700 hover:bg-pink-50 border-pink-200"
                        >
                          Kehamilan
                        </Badge>
                        <span>Kehamilan & Menyusui</span>
                      </h4>
                      <p className="text-slate-700 whitespace-pre-line text-sm md:text-base">
                        {compound.fda.clinical.pregnancy}
                      </p>
                    </div>
                  )}

                  {compound.fda.clinical.adverseReactions && (
                    <div className="rounded-lg bg-amber-50 p-4 border border-amber-100 shadow-sm">
                      <h4 className="font-medium text-amber-800 mb-2 flex items-center gap-1.5">
                        <Badge
                          variant="outline"
                          className="bg-amber-50 text-amber-700 hover:bg-amber-50 border-amber-200"
                        >
                          Efek Samping
                        </Badge>
                      </h4>
                      <p className="text-slate-700 whitespace-pre-line text-sm md:text-base">
                        {compound.fda.clinical.adverseReactions}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* FDA Safety Information Section */}
              <div id="section-fda-safety" className="scroll-mt-20 p-4 md:p-6">
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2 text-red-700">
                  <MdOutlineWarning className="text-red-600" />
                  Keamanan & Peringatan
                </h3>

                <div className="space-y-5">
                  {compound.fda.safety.doNotUse && (
                    <div className="rounded-lg bg-red-50 p-4 border-l-4 border-red-500 shadow-sm">
                      <h4 className="font-bold text-red-700 mb-2 flex items-center gap-1.5">
                        <MdOutlineWarningAmber className="text-red-600" />
                        JANGAN GUNAKAN JIKA
                      </h4>
                      <p className="text-slate-700 whitespace-pre-line text-sm md:text-base">
                        {compound.fda.safety.doNotUse}
                      </p>
                    </div>
                  )}

                  {compound.fda.safety.stopUse && (
                    <div className="rounded-lg bg-amber-50 p-4 border-l-4 border-amber-500 shadow-sm">
                      <h4 className="font-bold text-amber-800 mb-2 flex items-center gap-1.5">
                        <MdOutlineWarningAmber className="text-amber-700" />
                        HENTIKAN PENGGUNAAN JIKA
                      </h4>
                      <p className="text-slate-700 whitespace-pre-line text-sm md:text-base">
                        {compound.fda.safety.stopUse}
                      </p>
                    </div>
                  )}

                  {compound.fda.safety.askDoctor && (
                    <div className="rounded-lg bg-white p-4 border border-slate-100 shadow-sm">
                      <h4 className="font-medium text-slate-800 mb-2 flex items-center gap-1.5">
                        <Badge
                          variant="outline"
                          className="bg-indigo-50 text-indigo-700 hover:bg-indigo-50 border-indigo-200"
                        >
                          Konsultasi
                        </Badge>
                        <span>Tanyakan Dokter</span>
                      </h4>
                      <p className="text-slate-700 whitespace-pre-line text-sm md:text-base">
                        {compound.fda.safety.askDoctor}
                      </p>
                    </div>
                  )}

                  {compound.fda.safety.askDoctorOrPharmacist && (
                    <div className="rounded-lg bg-white p-4 border border-slate-100 shadow-sm">
                      <h4 className="font-medium text-slate-800 mb-2 flex items-center gap-1.5">
                        <Badge
                          variant="outline"
                          className="bg-indigo-50 text-indigo-700 hover:bg-indigo-50 border-indigo-200"
                        >
                          Konsultasi
                        </Badge>
                        <span>Tanyakan Dokter atau Apoteker</span>
                      </h4>
                      <p className="text-slate-700 whitespace-pre-line text-sm md:text-base">
                        {compound.fda.safety.askDoctorOrPharmacist}
                      </p>
                    </div>
                  )}

                  {compound.fda.safety.whenUsing && (
                    <div className="rounded-lg bg-white p-4 border border-slate-100 shadow-sm">
                      <h4 className="font-medium text-slate-800 mb-2 flex items-center gap-1.5">
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200"
                        >
                          Penggunaan
                        </Badge>
                        <span>Ketika Menggunakan</span>
                      </h4>
                      <p className="text-slate-700 whitespace-pre-line text-sm md:text-base">
                        {compound.fda.safety.whenUsing}
                      </p>
                    </div>
                  )}

                  {compound.fda.safety.keepOutOfReachOfChildren && (
                    <div className="rounded-lg bg-amber-50 p-4 border border-amber-100 shadow-sm">
                      <h4 className="font-medium text-amber-800 mb-2 flex items-center gap-1.5">
                        <MdOutlineWarningAmber className="text-amber-700" />
                        <span>Jauhkan dari Jangkauan Anak-Anak</span>
                      </h4>
                      <p className="text-slate-700 whitespace-pre-line text-sm md:text-base">
                        {compound.fda.safety.keepOutOfReachOfChildren}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* FDA Product Information Section */}
              <div id="section-fda-product" className="scroll-mt-20 p-4 md:p-6">
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2 text-blue-700">
                  <MdOutlineInfo className="text-blue-600" />
                  Informasi Produk
                </h3>

                <div className="space-y-5">
                  {compound.fda.identification && (
                    <div className="rounded-lg bg-white p-4 border border-slate-100 shadow-sm">
                      <h4 className="font-medium text-slate-800 mb-3 flex items-center gap-1.5">
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200"
                        >
                          Identifikasi
                        </Badge>
                        <span>Identifikasi Produk</span>
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm md:text-base">
                        {compound.fda.identification.brandName && (
                          <div className="p-2 bg-slate-50 rounded-md">
                            <span className="text-xs text-slate-500 block mb-1">
                              Nama Dagang
                            </span>
                            <span className="font-medium text-slate-800">
                              {compound.fda.identification.brandName}
                            </span>
                          </div>
                        )}

                        {compound.fda.identification.genericName && (
                          <div className="p-2 bg-slate-50 rounded-md">
                            <span className="text-xs text-slate-500 block mb-1">
                              Nama Generik
                            </span>
                            <span className="font-medium text-slate-800">
                              {compound.fda.identification.genericName}
                            </span>
                          </div>
                        )}

                        {compound.fda.identification.manufacturerName && (
                          <div className="p-2 bg-slate-50 rounded-md">
                            <span className="text-xs text-slate-500 block mb-1">
                              Produsen
                            </span>
                            <span className="font-medium text-slate-800">
                              {compound.fda.identification.manufacturerName}
                            </span>
                          </div>
                        )}

                        {compound.fda.identification.productCode && (
                          <div className="p-2 bg-slate-50 rounded-md">
                            <span className="text-xs text-slate-500 block mb-1">
                              Kode Produk
                            </span>
                            <span className="font-medium text-slate-800">
                              {compound.fda.identification.productCode}
                            </span>
                          </div>
                        )}

                        {compound.fda.identification.productType && (
                          <div className="p-2 bg-slate-50 rounded-md">
                            <span className="text-xs text-slate-500 block mb-1">
                              Tipe Produk
                            </span>
                            <span className="font-medium text-slate-800">
                              {compound.fda.identification.productType}
                            </span>
                          </div>
                        )}

                        {compound.fda.identification.route && (
                          <div className="p-2 bg-slate-50 rounded-md">
                            <span className="text-xs text-slate-500 block mb-1">
                              Rute Pemberian
                            </span>
                            <span className="font-medium text-slate-800">
                              {compound.fda.identification.route}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {compound.fda.clinical.activeIngredient && (
                    <div className="rounded-lg bg-white p-4 border border-slate-100 shadow-sm">
                      <h4 className="font-medium text-slate-800 mb-2 flex items-center gap-1.5">
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200"
                        >
                          Bahan Aktif
                        </Badge>
                      </h4>
                      <p className="text-slate-700 text-sm md:text-base">
                        {compound.fda.clinical.activeIngredient}
                      </p>
                    </div>
                  )}

                  {compound.fda.other.inactiveIngredients && (
                    <div className="rounded-lg bg-white p-4 border border-slate-100 shadow-sm">
                      <h4 className="font-medium text-slate-800 mb-2 flex items-center gap-1.5">
                        <Badge
                          variant="outline"
                          className="bg-slate-100 text-slate-700 hover:bg-slate-100"
                        >
                          Bahan Lainnya
                        </Badge>
                        <span>Bahan Tidak Aktif</span>
                      </h4>
                      <p className="text-slate-700 whitespace-pre-line text-sm md:text-base">
                        {compound.fda.other.inactiveIngredients}
                      </p>
                    </div>
                  )}

                  {compound.fda.other.labelerName && (
                    <div className="rounded-lg bg-white p-4 border border-slate-100 shadow-sm">
                      <h4 className="font-medium text-slate-800 mb-2 flex items-center gap-1.5">
                        <Badge
                          variant="outline"
                          className="bg-slate-100 text-slate-700 hover:bg-slate-100"
                        >
                          Pelabelan
                        </Badge>
                        <span>Informasi Pelabelan</span>
                      </h4>
                      <p className="text-slate-700 text-sm md:text-base">
                        Labeler: {compound.fda.other.labelerName}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Render all PubChem sections */}
      {allSections.map((section, index) => (
        <section
          key={index}
          id={`pubchem-section-${index}`}
          className="scroll-mt-16"
        >
          <Card className="mb-6 shadow-sm overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-slate-50 border-b">
              <div className="flex items-center gap-2">
                {getSectionIcon(section.title)}
                <CardTitle>{`${index + 1}. ${section.title}`}</CardTitle>
              </div>
              {section.description && (
                <CardDescription className="text-sm md:text-base">
                  {section.description}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              {/* Render section content */}
              {renderSectionContent(section)}

              {/* Render subsections */}
              {section.hasSubsections && section.subsections.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <MdFilterList className="text-indigo-500" />
                    Subsections
                  </h3>
                  <Accordion type="multiple" className="w-full">
                    {section.subsections.map((subsection, subIndex) => (
                      <AccordionItem
                        key={subIndex}
                        value={`section-${index}-${subIndex}`}
                        id={`pubchem-section-${index}-subsection-${subIndex}`}
                        className="scroll-mt-16 border border-slate-200 rounded-lg mb-3 overflow-hidden"
                      >
                        <AccordionTrigger className="text-base font-medium text-slate-700 px-4 py-3 hover:bg-slate-50">
                          {subsection.title}
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pt-3 pb-4 bg-slate-50/50">
                          {/* Subsection Description */}
                          {subsection.description && (
                            <p className="text-slate-600 mb-4 text-sm md:text-base">
                              {subsection.description}
                            </p>
                          )}

                          {/* Subsection Information */}
                          {subsection.information &&
                            subsection.information.length > 0 && (
                              <div className="space-y-4 mb-4">
                                {subsection.information.map(
                                  (info, infoIndex) => (
                                    <div
                                      key={infoIndex}
                                      className="bg-white rounded-md p-3 border border-slate-100 shadow-sm mb-2 last:mb-0"
                                    >
                                      {info.Name && (
                                        <h5 className="text-sm font-medium text-slate-700 mb-1.5">
                                          {info.Name}
                                        </h5>
                                      )}

                                      {info.Value?.StringWithMarkup &&
                                        info.Value.StringWithMarkup.map(
                                          (item, itemIdx) => (
                                            <p
                                              key={itemIdx}
                                              className="text-slate-700 whitespace-pre-line mb-2 text-sm"
                                            >
                                              {item.String}
                                            </p>
                                          )
                                        )}

                                      {info.Value?.Number !== undefined && (
                                        <p className="text-slate-700 text-sm">
                                          {info.Value.Number}{" "}
                                          {info.Value.Unit || ""}
                                        </p>
                                      )}

                                      {info.ReferenceNumber && (
                                        <div className="text-right mt-1">
                                          <Badge
                                            variant="outline"
                                            className="text-xs"
                                          >
                                            Sumber #{info.ReferenceNumber}
                                          </Badge>
                                        </div>
                                      )}
                                    </div>
                                  )
                                )}
                              </div>
                            )}

                          {/* Render Sub-subsections */}
                          {subsection.hasSubsubsections &&
                            subsection.subsubsections.length > 0 && (
                              <div className="mt-4 space-y-4">
                                <h4 className="text-sm font-medium text-indigo-600 mb-2">
                                  Sub-bagian tambahan
                                </h4>
                                {subsection.subsubsections.map(
                                  (subsubsection, subsubIndex) => (
                                    <div
                                      key={subsubIndex}
                                      className="bg-white p-3 rounded-md border border-slate-100 shadow-sm"
                                    >
                                      <h4 className="text-sm font-medium text-slate-700 mb-2">
                                        {subsubsection.TOCHeading ||
                                          `Subsection ${subsubIndex + 1}`}
                                      </h4>

                                      {subsubsection.Description && (
                                        <p className="text-xs md:text-sm text-slate-600 mb-3">
                                          {subsubsection.Description}
                                        </p>
                                      )}

                                      {subsubsection.Information &&
                                        subsubsection.Information.map(
                                          (info, infoIdx) => (
                                            <div
                                              key={infoIdx}
                                              className="mb-3 pb-2 border-b border-slate-100 last:border-0 last:pb-0"
                                            >
                                              {info.Name && (
                                                <h6 className="text-xs font-medium text-slate-700 mb-1">
                                                  {info.Name}
                                                </h6>
                                              )}

                                              {info.Value?.StringWithMarkup &&
                                                info.Value.StringWithMarkup.map(
                                                  (item, itemIdx) => (
                                                    <p
                                                      key={itemIdx}
                                                      className="text-xs md:text-sm text-slate-700 whitespace-pre-line"
                                                    >
                                                      {item.String}
                                                    </p>
                                                  )
                                                )}

                                              {info.Value?.Number !==
                                                undefined && (
                                                <p className="text-xs md:text-sm text-slate-700">
                                                  {info.Value.Number}{" "}
                                                  {info.Value.Unit || ""}
                                                </p>
                                              )}
                                            </div>
                                          )
                                        )}
                                    </div>
                                  )
                                )}
                              </div>
                            )}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      ))}

      {/* Information sources section */}
      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm text-slate-500 mt-8">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-200">
          <MdLibraryBooks className="text-slate-400" />
          <h3 className="font-medium">Sumber Data</h3>
        </div>

        {compound.fda && (
          <div className="mb-4 pb-4 border-b border-slate-200">
            <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-1.5">
              <Badge
                variant="outline"
                className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200"
              >
                FDA
              </Badge>
              <span>U.S. Food and Drug Administration</span>
            </h4>
            <p className="text-xs text-slate-600 mb-2">
              Data Label dengan ketentuan berikut:
            </p>
            <ul className="list-disc pl-5 text-xs space-y-1.5">
              <li>
                <strong>Disclaimer:</strong>{" "}
                {compound.fda.meta.disclaimer ||
                  "Information may not be complete"}
              </li>
              <li>
                <strong>Diperbarui:</strong>{" "}
                {compound.fda.meta.lastUpdated || "N/A"}
              </li>
              <li>
                <a
                  href={compound.fda.meta.terms || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline inline-flex items-center gap-0.5"
                >
                  Ketentuan Penggunaan
                  <MdOpenInNew className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>
        )}

        <h4 className="font-medium text-indigo-800 mb-2 flex items-center gap-1.5">
          <Badge
            variant="outline"
            className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100 border-indigo-200"
          >
            PubChem
          </Badge>
          <span>National Library of Medicine</span>
        </h4>
        <ul className="space-y-1.5 pl-6 list-disc mb-3">
          {compound.formatted.sources &&
            compound.formatted.sources.slice(0, 5).map((source, index) => (
              <li key={index}>
                {source.url ? (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:underline inline-flex items-center gap-0.5"
                  >
                    {source.name} {source.id ? `(${source.id})` : ""}
                    <MdOpenInNew className="h-3 w-3" />
                  </a>
                ) : (
                  <span>
                    {source.name} {source.id ? `(${source.id})` : ""}
                  </span>
                )}
              </li>
            ))}
          {compound.formatted.sources &&
            compound.formatted.sources.length > 5 && (
              <Accordion type="single" collapsible className="border-0">
                <AccordionItem value="more-sources" className="border-0">
                  <AccordionTrigger className="text-xs py-1 hover:no-underline text-indigo-600">
                    Lihat {compound.formatted.sources.length - 5} sumber lainnya
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-1.5 pl-2 list-disc">
                      {compound.formatted.sources
                        .slice(5)
                        .map((source, index) => (
                          <li key={index}>
                            {source.url ? (
                              <a
                                href={source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-600 hover:underline inline-flex items-center gap-0.5"
                              >
                                {source.name}{" "}
                                {source.id ? `(${source.id})` : ""}
                                <MdOpenInNew className="h-3 w-3" />
                              </a>
                            ) : (
                              <span>
                                {source.name}{" "}
                                {source.id ? `(${source.id})` : ""}
                              </span>
                            )}
                          </li>
                        ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
        </ul>
        <p className="mt-4 text-xs bg-yellow-50 p-2 rounded border border-yellow-100">
          <em>
            Informasi disediakan untuk tujuan edukasi dan tidak menggantikan
            saran profesional kesehatan.
          </em>
        </p>
        <div className="mt-3 text-right">
          <span className="text-xs text-slate-400">
            Data diambil pada: {new Date(compound.fetchedAt).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Deprecated CAS Numbers dan referensi tambahan */}
      <div className="border-t pt-4 mt-6">
        {compound.raw?.Record?.Section?.[2]?.Section?.[3]?.Section?.some(
          (section) => section.TOCHeading === "Deprecated CAS"
        ) && (
          <div className="mb-5 p-3 bg-slate-50 rounded-lg border border-slate-100">
            <h3 className="text-sm font-medium text-slate-700 mb-2">
              Nomor CAS yang Sudah Tidak Digunakan
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {compound.raw?.Record?.Section?.[2]?.Section?.[3]?.Section?.find(
                (section) => section.TOCHeading === "Deprecated CAS"
              )?.Information?.[0]?.Value?.StringWithMarkup?.map((item, idx) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className="text-xs bg-slate-50"
                >
                  {item.String}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-100">
          <h3 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-1.5">
            <MdLibraryBooks className="text-indigo-500" />
            <span>Referensi Ilmiah Tambahan</span>
          </h3>
          <div className="grid gap-2 text-xs">
            {compound.raw?.Record?.Reference?.slice(0, 5).map((ref, idx) => (
              <div
                key={idx}
                className="bg-white p-2 rounded-md flex flex-wrap gap-1 justify-between border border-slate-100"
              >
                <span className="font-medium">ANID: {ref.ANID}</span>
                {ref.Name && (
                  <span className="text-indigo-600">{ref.Name}</span>
                )}
                {ref.SourceName && (
                  <span className="text-slate-500">{ref.SourceName}</span>
                )}
              </div>
            ))}
            {compound.raw?.Record?.Reference?.length > 5 && (
              <Button
                variant="outline"
                size="sm"
                className="text-xs mt-1"
                onClick={() => {
                  // Implement view more logic if needed
                  alert(
                    "Additional references are available in the complete dataset."
                  );
                }}
              >
                Lihat {compound.raw.Record.Reference.length - 5} referensi
                lainnya
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <CardFooter className="flex flex-col sm:flex-row sm:justify-between items-center gap-2 bg-slate-50 p-3 border rounded-lg text-xs text-slate-500 mt-6">
        <div className="flex items-center gap-1">
          <MdOutlineInfo className="text-slate-400" />
          <span>Data disediakan oleh PubChem dan U.S. FDA</span>
        </div>
        <Link
          href="https://pubchem.ncbi.nlm.nih.gov"
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 hover:underline inline-flex items-center gap-0.5"
        >
          Kunjungi PubChem
          <MdOpenInNew className="h-3 w-3" />
        </Link>
      </CardFooter>
    </div>
  );
}

// Helper function to render value
function RenderValue({ value }) {
  if (value === null || value === undefined || value === "N/A") {
    return <p className="text-slate-500 italic">Tidak tersedia</p>;
  }

  if (typeof value === "object") {
    if (value.text && value.text !== "N/A") {
      return <p className="text-slate-600">{value.text}</p>;
    }
    if (value.formatted && value.formatted !== "N/A") {
      return <p className="text-slate-600">{value.formatted}</p>;
    }
    if (value.type === "url" && value.url) {
      return (
        <a
          href={value.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 hover:underline flex items-center"
        >
          {value.url} <MdOpenInNew className="ml-1 h-3 w-3" />
        </a>
      );
    }
    // Check if object has at least one non-N/A value
    const hasValidData = Object.values(value).some((v) => v && v !== "N/A");
    if (!hasValidData) {
      return <p className="text-slate-500 italic">Tidak tersedia</p>;
    }
    return <p className="text-slate-600">{JSON.stringify(value)}</p>;
  }

  // Handle strings
  if (typeof value === "string" && value.trim() === "") {
    return <p className="text-slate-500 italic">Tidak tersedia</p>;
  }

  return <p className="text-slate-600">{value}</p>;
}

export default FullContentTab;
