import React from "react";
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

function FullContentTab({ compound }) {
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
          <div className="text-slate-700 mb-4">
            <p>{section.description}</p>
          </div>
        )}

        {/* Render section information */}
        {section.information && section.information.length > 0 && (
          <div className="space-y-2 border-b border-slate-100 pb-4 mb-4">
            <h4 className="text-base font-medium text-slate-800">
              Informasi Umum
            </h4>
            {section.information.map((info, idx) => (
              <div
                key={idx}
                className="mb-3 pb-3 border-b border-slate-100 last:border-0"
              >
                {info.Name && (
                  <h5 className="text-sm font-semibold">{info.Name}</h5>
                )}
                {info.Value?.StringWithMarkup?.[0]?.String && (
                  <p className="text-slate-700 whitespace-pre-line">
                    {info.Value.StringWithMarkup[0].String}
                  </p>
                )}
                {info.Value?.Number !== undefined && (
                  <p className="text-slate-700">
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Daftar Isi</CardTitle>
          <CardDescription>
            Konten lengkap dari PubChem dan FDA untuk {compound.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {compound.fda && (
              <div className="space-y-2">
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
                <div className="pl-8 space-y-1">
                  <div className="flex items-center gap-1">
                    <MdOutlineChevronRight className="text-slate-400 h-4 w-4" />
                    <Link
                      href="#section-fda-clinical"
                      className="text-sm text-slate-600 hover:text-blue-600 hover:underline"
                    >
                      Informasi Klinis
                    </Link>
                  </div>
                  <div className="flex items-center gap-1">
                    <MdOutlineChevronRight className="text-slate-400 h-4 w-4" />
                    <Link
                      href="#section-fda-safety"
                      className="text-sm text-slate-600 hover:text-blue-600 hover:underline"
                    >
                      Keamanan & Peringatan
                    </Link>
                  </div>
                  <div className="flex items-center gap-1">
                    <MdOutlineChevronRight className="text-slate-400 h-4 w-4" />
                    <Link
                      href="#section-fda-product"
                      className="text-sm text-slate-600 hover:text-blue-600 hover:underline"
                    >
                      Informasi Produk
                    </Link>
                  </div>
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
                  >
                    {section.title}
                  </Link>
                </div>
                {section.hasSubsections && section.subsections.length > 0 && (
                  <div className="pl-8 space-y-1">
                    {section.subsections.map((sub, subIndex) => (
                      <div key={subIndex} className="flex items-center gap-1">
                        <MdOutlineChevronRight className="text-slate-400 h-4 w-4" />
                        <Link
                          href={`#pubchem-section-${index}-subsection-${subIndex}`}
                          className="text-sm text-slate-600 hover:text-indigo-600 hover:underline"
                        >
                          {sub.title}
                        </Link>
                      </div>
                    ))}
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
          <Card className="border-blue-200">
            <CardHeader className="bg-blue-50 border-b border-blue-200">
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <MdOutlineHealthAndSafety className="text-blue-600" /> Informasi
                FDA
              </CardTitle>
              <CardDescription>
                Data dari U.S. Food and Drug Administration untuk{" "}
                {compound.fda.identification.genericName || compound.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {/* FDA Clinical Information Section */}
              <div
                id="section-fda-clinical"
                className="scroll-mt-20 p-6 border-b"
              >
                <h3 className="text-lg font-medium mb-4">Informasi Klinis</h3>

                <div className="space-y-4">
                  {compound.fda.clinical.purpose && (
                    <div className="mb-4 pb-4 border-b border-slate-100">
                      <h4 className="font-medium text-slate-800 mb-1">
                        Tujuan Terapeutik
                      </h4>
                      <p className="text-slate-700">
                        {compound.fda.clinical.purpose}
                      </p>
                    </div>
                  )}

                  {compound.fda.clinical.indicationsAndUsage && (
                    <div className="mb-4 pb-4 border-b border-slate-100">
                      <h4 className="font-medium text-slate-800 mb-1">
                        Indikasi & Penggunaan
                      </h4>
                      <p className="text-slate-700 whitespace-pre-line">
                        {compound.fda.clinical.indicationsAndUsage}
                      </p>
                    </div>
                  )}

                  {compound.fda.clinical.dosageAndAdministration && (
                    <div className="mb-4 pb-4 border-b border-slate-100">
                      <h4 className="font-medium text-slate-800 mb-1">
                        Dosis & Cara Pemberian
                      </h4>
                      <p className="text-slate-700 whitespace-pre-line">
                        {compound.fda.clinical.dosageAndAdministration}
                      </p>
                    </div>
                  )}

                  {compound.fda.clinical.warnings && (
                    <div className="mb-4 pb-4 border-b border-slate-100">
                      <h4 className="font-medium text-red-600 mb-1">
                        Peringatan & Tindakan Pencegahan
                      </h4>
                      <div className="bg-red-50 p-4 rounded-md border-l-4 border-red-500">
                        <p className="text-slate-700 whitespace-pre-line">
                          {compound.fda.clinical.warnings}
                        </p>
                      </div>
                    </div>
                  )}

                  {compound.fda.clinical.pregnancy && (
                    <div className="mb-4 pb-4 border-b border-slate-100">
                      <h4 className="font-medium text-slate-800 mb-1">
                        Kehamilan & Menyusui
                      </h4>
                      <p className="text-slate-700 whitespace-pre-line">
                        {compound.fda.clinical.pregnancy}
                      </p>
                    </div>
                  )}

                  {compound.fda.clinical.adverseReactions && (
                    <div className="mb-4 pb-4 border-b border-slate-100">
                      <h4 className="font-medium text-slate-800 mb-1">
                        Efek Samping
                      </h4>
                      <p className="text-slate-700 whitespace-pre-line">
                        {compound.fda.clinical.adverseReactions}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* FDA Safety Information Section */}
              <div
                id="section-fda-safety"
                className="scroll-mt-20 p-6 border-b"
              >
                <h3 className="text-lg font-medium mb-4">
                  Keamanan & Peringatan
                </h3>

                <div className="space-y-4">
                  {compound.fda.safety.doNotUse && (
                    <div className="mb-4 bg-red-50 p-4 rounded-md border-l-4 border-red-500">
                      <h4 className="font-medium text-red-700 mb-1">
                        JANGAN GUNAKAN JIKA
                      </h4>
                      <p className="text-slate-700 whitespace-pre-line">
                        {compound.fda.safety.doNotUse}
                      </p>
                    </div>
                  )}

                  {compound.fda.safety.stopUse && (
                    <div className="mb-4 bg-amber-50 p-4 rounded-md border-l-4 border-amber-500">
                      <h4 className="font-medium text-amber-700 mb-1">
                        HENTIKAN PENGGUNAAN JIKA
                      </h4>
                      <p className="text-slate-700 whitespace-pre-line">
                        {compound.fda.safety.stopUse}
                      </p>
                    </div>
                  )}

                  {compound.fda.safety.askDoctor && (
                    <div className="mb-4 pb-4 border-b border-slate-100">
                      <h4 className="font-medium text-slate-800 mb-1">
                        Tanyakan Dokter
                      </h4>
                      <p className="text-slate-700 whitespace-pre-line">
                        {compound.fda.safety.askDoctor}
                      </p>
                    </div>
                  )}

                  {compound.fda.safety.askDoctorOrPharmacist && (
                    <div className="mb-4 pb-4 border-b border-slate-100">
                      <h4 className="font-medium text-slate-800 mb-1">
                        Tanyakan Dokter atau Apoteker
                      </h4>
                      <p className="text-slate-700 whitespace-pre-line">
                        {compound.fda.safety.askDoctorOrPharmacist}
                      </p>
                    </div>
                  )}

                  {compound.fda.safety.whenUsing && (
                    <div className="mb-4 pb-4 border-b border-slate-100">
                      <h4 className="font-medium text-slate-800 mb-1">
                        Ketika Menggunakan
                      </h4>
                      <p className="text-slate-700 whitespace-pre-line">
                        {compound.fda.safety.whenUsing}
                      </p>
                    </div>
                  )}

                  {compound.fda.safety.keepOutOfReachOfChildren && (
                    <div className="mb-4 pb-4 border-slate-100">
                      <h4 className="font-medium text-slate-800 mb-1">
                        Jauhkan dari Jangkauan Anak-Anak
                      </h4>
                      <p className="text-slate-700 whitespace-pre-line">
                        {compound.fda.safety.keepOutOfReachOfChildren}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* FDA Product Information Section */}
              <div id="section-fda-product" className="scroll-mt-20 p-6">
                <h3 className="text-lg font-medium mb-4">Informasi Produk</h3>

                <div className="space-y-4">
                  {compound.fda.identification && (
                    <div className="mb-6">
                      <h4 className="font-medium text-slate-800 mb-2">
                        Identifikasi Produk
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {compound.fda.identification.brandName && (
                          <div>
                            <span className="text-sm text-slate-500 block">
                              Nama Dagang
                            </span>
                            <span className="font-medium">
                              {compound.fda.identification.brandName}
                            </span>
                          </div>
                        )}

                        {compound.fda.identification.genericName && (
                          <div>
                            <span className="text-sm text-slate-500 block">
                              Nama Generik
                            </span>
                            <span className="font-medium">
                              {compound.fda.identification.genericName}
                            </span>
                          </div>
                        )}

                        {compound.fda.identification.manufacturerName && (
                          <div>
                            <span className="text-sm text-slate-500 block">
                              Produsen
                            </span>
                            <span className="font-medium">
                              {compound.fda.identification.manufacturerName}
                            </span>
                          </div>
                        )}

                        {compound.fda.identification.productCode && (
                          <div>
                            <span className="text-sm text-slate-500 block">
                              Kode Produk
                            </span>
                            <span className="font-medium">
                              {compound.fda.identification.productCode}
                            </span>
                          </div>
                        )}

                        {compound.fda.identification.productType && (
                          <div>
                            <span className="text-sm text-slate-500 block">
                              Tipe Produk
                            </span>
                            <span className="font-medium">
                              {compound.fda.identification.productType}
                            </span>
                          </div>
                        )}

                        {compound.fda.identification.route && (
                          <div>
                            <span className="text-sm text-slate-500 block">
                              Rute Pemberian
                            </span>
                            <span className="font-medium">
                              {compound.fda.identification.route}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {compound.fda.clinical.activeIngredient && (
                    <div className="mb-4 pb-4 border-b border-slate-100">
                      <h4 className="font-medium text-slate-800 mb-1">
                        Bahan Aktif
                      </h4>
                      <p className="text-slate-700">
                        {compound.fda.clinical.activeIngredient}
                      </p>
                    </div>
                  )}

                  {compound.fda.other.inactiveIngredients && (
                    <div className="mb-4 pb-4 border-b border-slate-100">
                      <h4 className="font-medium text-slate-800 mb-1">
                        Bahan Tidak Aktif
                      </h4>
                      <p className="text-slate-700 whitespace-pre-line">
                        {compound.fda.other.inactiveIngredients}
                      </p>
                    </div>
                  )}

                  {compound.fda.other.labelerName && (
                    <div>
                      <h4 className="font-medium text-slate-800 mb-1">
                        Informasi Pelabelan
                      </h4>
                      <p className="text-slate-700">
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
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center gap-2">
                {getSectionIcon(section.title)}
                <CardTitle>{`${index + 1}. ${section.title}`}</CardTitle>
              </div>
              {section.description && (
                <CardDescription>{section.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {/* Render section content */}
              {renderSectionContent(section)}

              {/* Render subsections */}
              {section.hasSubsections && section.subsections.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">Subsections</h3>
                  <Accordion type="multiple" className="w-full">
                    {section.subsections.map((subsection, subIndex) => (
                      <AccordionItem
                        key={subIndex}
                        value={`section-${index}-${subIndex}`}
                        id={`pubchem-section-${index}-subsection-${subIndex}`}
                        className="scroll-mt-16"
                      >
                        <AccordionTrigger className="text-base font-medium text-slate-700">
                          {subsection.title}
                        </AccordionTrigger>
                        <AccordionContent className="px-2 pt-3">
                          {/* Subsection Description */}
                          {subsection.description && (
                            <p className="text-slate-600 mb-4">
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
                                      className="border-b border-slate-100 pb-4 mb-2 last:border-0"
                                    >
                                      {info.Name && (
                                        <h5 className="text-sm font-medium text-slate-700 mb-1">
                                          {info.Name}
                                        </h5>
                                      )}

                                      {info.Value?.StringWithMarkup &&
                                        info.Value.StringWithMarkup.map(
                                          (item, itemIdx) => (
                                            <p
                                              key={itemIdx}
                                              className="text-slate-700 whitespace-pre-line mb-2"
                                            >
                                              {item.String}
                                            </p>
                                          )
                                        )}

                                      {info.Value?.Number !== undefined && (
                                        <p className="text-slate-700">
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
                                {subsection.subsubsections.map(
                                  (subsubsection, subsubIndex) => (
                                    <div
                                      key={subsubIndex}
                                      className="bg-slate-50 p-4 rounded-md"
                                    >
                                      <h4 className="text-sm font-medium text-slate-700 mb-2">
                                        {subsubsection.TOCHeading ||
                                          `Subsection ${subsubIndex + 1}`}
                                      </h4>

                                      {subsubsection.Description && (
                                        <p className="text-sm text-slate-600 mb-3">
                                          {subsubsection.Description}
                                        </p>
                                      )}

                                      {subsubsection.Information &&
                                        subsubsection.Information.map(
                                          (info, infoIdx) => (
                                            <div key={infoIdx} className="mb-3">
                                              {info.Name && (
                                                <h6 className="text-xs font-medium text-slate-700">
                                                  {info.Name}
                                                </h6>
                                              )}

                                              {info.Value?.StringWithMarkup &&
                                                info.Value.StringWithMarkup.map(
                                                  (item, itemIdx) => (
                                                    <p
                                                      key={itemIdx}
                                                      className="text-sm text-slate-700 whitespace-pre-line"
                                                    >
                                                      {item.String}
                                                    </p>
                                                  )
                                                )}

                                              {info.Value?.Number !==
                                                undefined && (
                                                <p className="text-sm text-slate-700">
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
        <div className="flex items-center gap-2 mb-2">
          <MdLibraryBooks className="text-slate-400" />
          <h3 className="font-medium">Sumber Data</h3>
        </div>

        {compound.fda && (
          <div className="mb-4 pb-4 border-b border-slate-200">
            <h4 className="font-medium text-blue-800 mb-2">
              U.S. Food and Drug Administration (FDA)
            </h4>
            <p className="text-xs text-slate-600 mb-1">
              Data Label dengan ketentuan berikut:
            </p>
            <ul className="list-disc pl-5 text-xs space-y-1">
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
                  className="text-blue-600 hover:underline"
                >
                  Ketentuan Penggunaan
                </a>
              </li>
            </ul>
          </div>
        )}

        <h4 className="font-medium text-indigo-800 mb-2">
          PubChem - National Library of Medicine
        </h4>
        <ul className="space-y-1 pl-6 list-disc">
          {compound.formatted.sources &&
            compound.formatted.sources.slice(0, 5).map((source, index) => (
              <li key={index}>
                {source.url ? (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:underline"
                  >
                    {source.name} {source.id ? `(${source.id})` : ""}
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
              <Accordion type="single" collapsible>
                <AccordionItem value="more-sources">
                  <AccordionTrigger className="text-xs py-1 hover:no-underline">
                    Lihat {compound.formatted.sources.length - 5} sumber lainnya
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-1 pl-2 list-disc">
                      {compound.formatted.sources
                        .slice(5)
                        .map((source, index) => (
                          <li key={index}>
                            {source.url ? (
                              <a
                                href={source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-600 hover:underline"
                              >
                                {source.name}{" "}
                                {source.id ? `(${source.id})` : ""}
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
        <p className="mt-4 text-xs">
          <em>
            Informasi disediakan untuk tujuan edukasi dan tidak menggantikan
            saran profesional kesehatan.
          </em>
        </p>
        <div className="mt-2 text-right">
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
          <div className="mb-4">
            <h3 className="text-sm font-medium text-slate-700">
              Nomor CAS yang Sudah Tidak Digunakan
            </h3>
            <div className="flex flex-wrap gap-2 mt-2">
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

        <div className="mb-4">
          <h3 className="text-sm font-medium text-slate-700 mb-2">
            Referensi Ilmiah Tambahan
          </h3>
          <div className="grid gap-2 text-sm">
            {compound.raw?.Record?.Reference?.map((ref, idx) => (
              <div
                key={idx}
                className="bg-slate-50 p-2 rounded-md flex justify-between"
              >
                <span>ANID: {ref.ANID}</span>
                {ref.Name && (
                  <span className="text-indigo-600">{ref.Name}</span>
                )}
                {ref.SourceName && (
                  <span className="text-slate-500">{ref.SourceName}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
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
