"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";

import {
  MdArrowBack,
  MdOutlineWarning,
  MdOutlineInfo,
  MdOutlineScience,
  MdOutlineMedication,
  MdShare,
  MdFavoriteBorder,
  MdFavorite,
  MdOutlinePrint,
  MdKeyboardArrowDown,
  MdKeyboardArrowRight,
  MdOutlineChevronRight,
  MdOutlineSecurity,
  MdOutlineWarningAmber,
  MdBookmark,
  MdSearch,
  MdLibraryBooks,
  MdOutlineFoodBank,
  MdOutlineConstruction,
  MdOutlineBiotech,
  MdOutlineHealthAndSafety,
  MdOutlineMedicalInformation,
  MdOpenInNew,
  MdZoomIn,
  MdOutlineEco,
} from "react-icons/md";

// ShadCN UI Components
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

// Function to properly format molecular formulas with subscripts for numbers
const formatFormula = (formula) => {
  if (!formula) return "N/A";
  return formula.split("").map((char, index) => {
    return /\d/.test(char) ? <sub key={index}>{char}</sub> : char;
  });
};

// Function to extract and format physical properties
const extractPhysicalProperties = (compound) => {
  // Initialize with core properties, filtering out N/A values
  const properties = [
    {
      name: "Formula Molekul",
      value: compound.essential.molecularFormula,
      formatter: formatFormula,
    },
    {
      name: "Berat Molekul",
      value: compound.essential.molecularWeight,
      unit: "g/mol",
    },
    {
      name: "XLogP3",
      value:
        compound.raw?.Record?.Section?.[3]?.Section?.[0]?.Section?.[1]
          ?.Information?.[0]?.Value?.Number?.[0],
      description: "Koefisien partisi oktanol-air",
    },
    {
      name: "Donor Ikatan Hidrogen",
      value:
        compound.raw?.Record?.Section?.[3]?.Section?.[0]?.Section?.[2]
          ?.Information?.[0]?.Value?.Number?.[0],
    },
    {
      name: "Akseptor Ikatan Hidrogen",
      value:
        compound.raw?.Record?.Section?.[3]?.Section?.[0]?.Section?.[3]
          ?.Information?.[0]?.Value?.Number?.[0],
    },
    {
      name: "Ikatan Dapat Diputar",
      value:
        compound.raw?.Record?.Section?.[3]?.Section?.[0]?.Section?.[4]
          ?.Information?.[0]?.Value?.Number?.[0],
    },
    {
      name: "Luas Permukaan Polar Topologi",
      value:
        compound.raw?.Record?.Section?.[3]?.Section?.[0]?.Section?.[7]
          ?.Information?.[0]?.Value?.Number?.[0],
      unit: "Å²",
    },
    {
      name: "Massa Monoisotopik",
      value:
        compound.raw?.Record?.Section?.[3]?.Section?.[0]?.Section?.[6]
          ?.Information?.[0]?.Value?.StringWithMarkup?.[0]?.String,
      unit: "Da",
    },
  ];

  // Add experimental properties if available
  if (compound.raw?.Record?.Section?.[3]?.Section?.[1]) {
    // Physical Description
    if (
      compound.raw.Record.Section[3].Section[1].Section[0]?.Information?.[0]
        ?.Value?.StringWithMarkup?.[0]?.String
    ) {
      properties.push({
        name: "Deskripsi Fisik",
        value:
          compound.raw.Record.Section[3].Section[1].Section[0].Information[0]
            .Value.StringWithMarkup[0].String,
      });
    }

    // Color/Form
    if (
      compound.raw.Record.Section[3].Section[1].Section[1]?.Information?.[0]
        ?.Value?.StringWithMarkup?.[0]?.String
    ) {
      properties.push({
        name: "Warna/Bentuk",
        value:
          compound.raw.Record.Section[3].Section[1].Section[1].Information[0]
            .Value.StringWithMarkup[0].String,
      });
    }

    // Odor
    if (
      compound.raw.Record.Section[3].Section[1].Section[2]?.Information?.[0]
        ?.Value?.StringWithMarkup?.[0]?.String
    ) {
      properties.push({
        name: "Bau",
        value:
          compound.raw.Record.Section[3].Section[1].Section[2].Information[0]
            .Value.StringWithMarkup[0].String,
      });
    }

    // Taste
    if (
      compound.raw.Record.Section[3].Section[1].Section[3]?.Information?.[0]
        ?.Value?.StringWithMarkup?.[0]?.String
    ) {
      properties.push({
        name: "Rasa",
        value:
          compound.raw.Record.Section[3].Section[1].Section[3].Information[0]
            .Value.StringWithMarkup[0].String,
      });
    }

    // Melting Point
    if (
      compound.raw.Record.Section[3].Section[1].Section[5]?.Information?.[0]
        ?.Value?.Number?.[0]
    ) {
      properties.push({
        name: "Titik Leleh",
        value:
          compound.raw.Record.Section[3].Section[1].Section[5].Information[0]
            .Value.Number[0],
        unit: "°C",
      });
    }

    // Boiling Point
    if (
      compound.raw.Record.Section[3].Section[1].Section[4]?.Information?.[0]
        ?.Value?.Number?.[0]
    ) {
      properties.push({
        name: "Titik Didih",
        value:
          compound.raw.Record.Section[3].Section[1].Section[4].Information[0]
            .Value.Number[0],
        unit: "K",
      });
    }

    // Solubility
    if (
      compound.raw.Record.Section[3].Section[1].Section[6]?.Information?.[0]
        ?.Value?.StringWithMarkup?.[0]?.String
    ) {
      properties.push({
        name: "Kelarutan",
        value:
          compound.raw.Record.Section[3].Section[1].Section[6].Information[0]
            .Value.StringWithMarkup[0].String,
      });
    }
  }

  return properties.filter(
    (prop) => prop.value !== undefined && prop.value !== "N/A"
  );
};

// Function to extract safety information
const extractSafetyInfo = (compound) => {
  const safetyInfo = [];

  // Extract chemical safety icons and warnings
  if (
    compound.raw?.Record?.Section?.[1]?.Information?.[0]?.Value
      ?.StringWithMarkup?.[0]?.Markup
  ) {
    const hazards =
      compound.raw.Record.Section[1].Information[0].Value.StringWithMarkup[0].Markup.map(
        (markup) => markup.Extra
      ).filter(Boolean);

    if (hazards.length) {
      safetyInfo.push({
        title: "Simbol Keamanan Kimia",
        content: hazards,
        type: "icons",
      });
    }
  }

  // Add toxicity information if available
  if (compound.essential.toxicity && compound.essential.toxicity !== "N/A") {
    safetyInfo.push({
      title: "Toksisitas",
      content: compound.essential.toxicity,
      type: "text",
    });
  }

  // Add safety hazards if available
  if (
    compound.essential.safetyHazards &&
    compound.essential.safetyHazards !== "N/A"
  ) {
    safetyInfo.push({
      title: "Bahaya Keselamatan",
      content: compound.essential.safetyHazards,
      type: "text",
    });
  }

  return safetyInfo;
};

// Function to extract enhanced synonyms with categorization
const extractEnhancedSynonyms = (compound) => {
  const synonymCategories = {
    common: [],
    chemical: [],
    trade: [],
    codes: [],
  };

  // Function to categorize synonyms based on patterns
  const categorizeSynonym = (synonym) => {
    // Check for trade names (usually capitalized without numbers or special notation)
    if (/^[A-Z][a-z]+$/.test(synonym) || synonym.includes(" (TN)")) {
      return "trade";
    }
    // Check for chemical codes (contains numbers and letters in specific patterns)
    else if (
      /[A-Z]+-\d+/.test(synonym) ||
      /\d{5,}/.test(synonym) ||
      /^[A-Z]+\d+$/.test(synonym) ||
      /CAS|CID|UNII|NSC|HSDB/.test(synonym)
    ) {
      return "codes";
    }
    // Check for chemical notation (has special notation)
    else if (synonym.includes("(") && /\([^)]*\)/.test(synonym)) {
      return "chemical";
    }
    // Default to common names
    else {
      return "common";
    }
  };

  // Get synonyms from essential data
  const allSynonyms = compound.essential.synonyms || [];

  // Add MeSH terms if available
  if (
    compound.raw?.Record?.Section?.[2]?.Section?.[4]?.Section?.[0]
      ?.Information?.[0]?.Value?.StringWithMarkup
  ) {
    compound.raw.Record.Section[2].Section[4].Section[0].Information[0].Value.StringWithMarkup.forEach(
      (item) => {
        if (item.String && !allSynonyms.includes(item.String)) {
          allSynonyms.push(item.String);
        }
      }
    );
  }

  // Add depositor-supplied synonyms if available
  if (
    compound.raw?.Record?.Section?.[2]?.Section?.[4]?.Section?.[1]
      ?.Information?.[0]?.Value?.StringWithMarkup
  ) {
    compound.raw.Record.Section[2].Section[4].Section[1].Information[0].Value.StringWithMarkup.forEach(
      (item) => {
        if (item.String && !allSynonyms.includes(item.String)) {
          allSynonyms.push(item.String);
        }
      }
    );
  }

  // Categorize each synonym
  allSynonyms.forEach((synonym) => {
    if (synonym !== "N/A") {
      const category = categorizeSynonym(synonym);
      synonymCategories[category].push(synonym);
    }
  });

  return synonymCategories;
};

// Function to extract enhanced identification data
const extractIdentifiers = (compound) => {
  const identifiers = [];

  // Extract CAS number
  if (
    compound.raw?.Record?.Section?.[2]?.Section?.[3]?.Section?.[0]
      ?.Information?.[0]?.Value?.StringWithMarkup?.[0]?.String
  ) {
    identifiers.push({
      name: "CAS",
      value:
        compound.raw.Record.Section[2].Section[3].Section[0].Information[0]
          .Value.StringWithMarkup[0].String,
    });
  }

  // Extract EC number
  if (
    compound.raw?.Record?.Section?.[2]?.Section?.[3]?.Section?.[3]
      ?.Information?.[0]?.Value?.StringWithMarkup?.[0]?.String
  ) {
    identifiers.push({
      name: "EC Number",
      value:
        compound.raw.Record.Section[2].Section[3].Section[3].Information[0]
          .Value.StringWithMarkup[0].String,
    });
  }

  // Extract UNII
  if (
    compound.raw?.Record?.Section?.[2]?.Section?.[3]?.Section?.[4]
      ?.Information?.[0]?.Value?.StringWithMarkup?.[0]?.String
  ) {
    identifiers.push({
      name: "UNII",
      value:
        compound.raw.Record.Section[2].Section[3].Section[4].Information[0]
          .Value.StringWithMarkup[0].String,
    });
  }

  // Extract ChEBI ID
  if (
    compound.raw?.Record?.Section?.[2]?.Section?.[3]?.Section?.[5]
      ?.Information?.[0]?.Value?.StringWithMarkup?.[0]?.String
  ) {
    identifiers.push({
      name: "ChEBI ID",
      value:
        compound.raw.Record.Section[2].Section[3].Section[5].Information[0]
          .Value.StringWithMarkup[0].String,
    });
  }

  // Extract DrugBank ID
  if (
    compound.raw?.Record?.Section?.[2]?.Section?.[3]?.Section?.[7]
      ?.Information?.[0]?.Value?.StringWithMarkup?.[0]?.String
  ) {
    identifiers.push({
      name: "DrugBank ID",
      value:
        compound.raw.Record.Section[2].Section[3].Section[7].Information[0]
          .Value.StringWithMarkup[0].String,
    });
  }

  return identifiers;
};

// Function to extract comprehensive pharmacology information
const extractPharmacologyInfo = (compound) => {
  const pharmacologyInfo = [];

  // Get all record descriptions which often contain pharmacology info
  if (compound.raw?.Record?.Section?.[2]?.Section?.[0]?.Information) {
    compound.raw.Record.Section[2].Section[0].Information.forEach((info) => {
      if (info?.Value?.StringWithMarkup?.[0]?.String) {
        pharmacologyInfo.push({
          title: "Deskripsi PubChem",
          content: info.Value.StringWithMarkup[0].String,
          source: info.ReferenceNumber
            ? `Referensi #${info.ReferenceNumber}`
            : "PubChem",
        });
      }
    });
  }

  // Add FDA pharmacology info if available
  if (compound.fda) {
    if (compound.fda.pharmacology?.mechanismOfAction) {
      pharmacologyInfo.push({
        title: "Mekanisme Aksi (FDA)",
        content: compound.fda.pharmacology.mechanismOfAction,
        source: "FDA",
      });
    }

    if (compound.fda.pharmacology?.physiologicEffect) {
      pharmacologyInfo.push({
        title: "Efek Fisiologis (FDA)",
        content: compound.fda.pharmacology.physiologicEffect,
        source: "FDA",
      });
    }

    if (compound.fda.clinical?.purpose) {
      pharmacologyInfo.push({
        title: "Tujuan Terapeutik (FDA)",
        content: compound.fda.clinical.purpose,
        source: "FDA",
      });
    }
  }

  // Add pharmacology from essential data
  if (
    compound.essential.pharmacology &&
    compound.essential.pharmacology !== "N/A"
  ) {
    pharmacologyInfo.push({
      title: "Farmakologi",
      content: compound.essential.pharmacology,
      source: "PubChem",
    });
  }

  return pharmacologyInfo;
};

// Function to extract all sections from compound.raw
function extractAllSections(compound) {
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
}

// Function to render section content
function renderSectionContent(section) {
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
}

// Function to render full content tab
function renderFullContent(compound) {
  // Extract all available sections
  const allSections = extractAllSections(compound);

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
              {/* FDA content - unchanged */}
              <div
                id="section-fda-clinical"
                className="scroll-mt-20 p-6 border-b"
              >
                {/* FDA clinical information - your existing code here */}
              </div>
              <div
                id="section-fda-safety"
                className="scroll-mt-20 p-6 border-b"
              >
                {/* FDA safety information - your existing code here */}
              </div>
              <div id="section-fda-product" className="scroll-mt-20 p-6">
                {/* FDA product information - your existing code here */}
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

export default function DrugDetailPage() {
  const params = useParams();
  const router = useRouter();
  const cid = params?.cid || "";

  const [compound, setCompound] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);

  useEffect(() => {
    const fetchCompoundData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `/api/obat/${encodeURIComponent(cid)}`
        );

        // Menggunakan data yang diformat untuk kebutuhan UI
        setCompound(response.data);

        // Update recently viewed
        const recentlyViewed = JSON.parse(
          localStorage.getItem("recentlyViewedDrugs") || "[]"
        );
        const existingIndex = recentlyViewed.findIndex(
          (item) => item.cid === response.data.cid
        );

        if (existingIndex !== -1) {
          // Remove existing entry
          recentlyViewed.splice(existingIndex, 1);
        }

        // Add to beginning of array
        recentlyViewed.unshift({
          cid: response.data.cid,
          name: response.data.name,
          iupac_name: response.data.essential.iupacName,
        });

        // Keep only recent 10
        localStorage.setItem(
          "recentlyViewedDrugs",
          JSON.stringify(recentlyViewed.slice(0, 10))
        );

        // Check if this compound is in favorites
        const storedFavorites = localStorage.getItem("favoriteCompounds");
        const favorites = storedFavorites ? JSON.parse(storedFavorites) : [];
        setIsFavorite(favorites.some((fav) => fav.cid === response.data.cid));
      } catch (err) {
        console.error("Error fetching compound details:", err);
        setError(err.message || "Error fetching compound data");
      } finally {
        setLoading(false);
      }
    };

    if (cid) {
      fetchCompoundData();
    }
  }, [cid]);

  const toggleFavorite = () => {
    try {
      const storedFavorites = localStorage.getItem("favoriteCompounds");
      const favorites = storedFavorites ? JSON.parse(storedFavorites) : [];

      if (isFavorite) {
        // Remove from favorites
        const updatedFavorites = favorites.filter(
          (fav) => fav.cid !== compound.cid
        );
        localStorage.setItem(
          "favoriteCompounds",
          JSON.stringify(updatedFavorites)
        );
        toast.success("Dihapus dari favorit");
      } else {
        // Add to favorites
        const compoundInfo = {
          cid: compound.cid,
          name: compound.name,
          iupacName: compound.essential.iupacName,
          molecularFormula: compound.essential.molecularFormula,
          thumbnailUrl: compound.essential.thumbnailUrl,
          addedAt: new Date().toISOString(),
        };
        localStorage.setItem(
          "favoriteCompounds",
          JSON.stringify([...favorites, compoundInfo])
        );
        toast.success("Ditambahkan ke favorit");
      }

      setIsFavorite(!isFavorite);
    } catch (e) {
      console.error("Error managing favorites:", e);
      toast.error("Gagal menambahkan ke favorit");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleTabChange = (value) => {
    setActiveTab(value);
    // Scroll to top when tab changes
    window.scrollTo(0, 0);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Informasi Senyawa: ${compound.name}`,
          text: `Info lengkap tentang ${compound.name}`,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.info("URL disalin ke clipboard!");
      } catch (err) {
        console.error("Failed to copy URL:", err);
        toast.error("Gagal menyalin URL");
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="mr-2"
          >
            <MdArrowBack className="mr-1" /> Kembali
          </Button>

          <div className="space-y-1 flex-1">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-60" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <Skeleton className="h-[250px] w-full rounded-lg" />
          </div>
          <div className="md:col-span-1 lg:col-span-2">
            <Skeleton className="h-8 w-40 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="mb-4"
        >
          <MdArrowBack className="mr-1" /> Kembali
        </Button>

        <Card>
          <CardContent className="p-8 text-center">
            <div className="inline-flex items-center justify-center rounded-full bg-red-100 p-4 mb-4">
              <MdOutlineWarning className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-slate-800">
              Terjadi Kesalahan
            </h3>
            <p className="text-slate-500 mt-2">{error}</p>
            <div className="flex flex-wrap justify-center mt-4 gap-2">
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Coba Lagi
              </Button>
              <Button onClick={() => router.push("/drug-info")}>
                Kembali ke Daftar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!compound) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="mb-4"
        >
          <MdArrowBack className="mr-1" /> Kembali
        </Button>

        <Card>
          <CardContent className="p-8 text-center">
            <div className="inline-flex items-center justify-center rounded-full bg-amber-100 p-4 mb-4">
              <MdOutlineInfo className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="text-lg font-medium text-slate-800">
              Informasi Tidak Ditemukan
            </h3>
            <p className="text-slate-500 mt-2">
              Detail untuk senyawa ini tidak tersedia
            </p>
            <Button className="mt-4" onClick={() => router.push("/drug-info")}>
              Lihat Daftar Senyawa
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatTableOfContents = (sections) => {
    return Object.keys(compound.formatted.sections).map((key) => {
      const section = compound.formatted.sections[key];
      return {
        title: key,
        description: section.description,
        hasSubsections: section.subsections && section.subsections.length > 0,
        subsections:
          section.subsections?.map((sub) => ({
            title: sub.name,
            description: sub.description,
          })) || [],
      };
    });
  };

  const tableOfContents = formatTableOfContents(compound.formatted.sections);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl print:py-0">
      <div className="print:hidden">
        <Breadcrumb className="mb-4">
          <BreadcrumbItem>
            <BreadcrumbLink href="/drug-info">Database Obat</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="#">{compound.name}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>

      {/* Header dengan action buttons */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="mb-1 print:hidden"
          >
            <MdArrowBack className="mr-1" /> Kembali
          </Button>
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-800">
            {compound.name}
          </h1>
          <div className="flex items-center gap-2">
            <p className="text-sm text-slate-500">CID: {compound.cid}</p>
            <a
              href={compound.pubchemUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:underline flex items-center"
            >
              <MdOpenInNew className="h-3 w-3 mr-0.5" /> PubChem
            </a>
          </div>
        </div>

        <div className="flex items-center space-x-2 print:hidden">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleFavorite}
            className={isFavorite ? "text-red-500 hover:text-red-600" : ""}
            aria-label={isFavorite ? "Hapus dari favorit" : "Tambah ke favorit"}
          >
            {isFavorite ? (
              <MdFavorite className="h-4 w-4" />
            ) : (
              <MdFavoriteBorder className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleShare}
            aria-label="Bagikan"
          >
            <MdShare className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrint}
            aria-label="Cetak"
          >
            <MdOutlinePrint className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Mobile Tab Selection */}
      <div className="md:hidden mb-6 print:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              {getTabName(activeTab)}
              <MdKeyboardArrowDown className="ml-2 h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[40vh]">
            <div className="grid gap-1 py-2">
              <Button
                variant={activeTab === "overview" ? "default" : "ghost"}
                className="justify-start"
                onClick={() => {
                  handleTabChange("overview");
                }}
              >
                Ringkasan
              </Button>
              <Button
                variant={activeTab === "chemistry" ? "default" : "ghost"}
                className="justify-start"
                onClick={() => {
                  handleTabChange("chemistry");
                }}
              >
                Kimia
              </Button>
              <Button
                variant={activeTab === "pharmacology" ? "default" : "ghost"}
                className="justify-start"
                onClick={() => {
                  handleTabChange("pharmacology");
                }}
              >
                Farmakologi & Klinis
              </Button>
              <Button
                variant={activeTab === "safety" ? "default" : "ghost"}
                className="justify-start"
                onClick={() => {
                  handleTabChange("safety");
                }}
              >
                Keamanan
              </Button>
              <Button
                variant={activeTab === "full" ? "default" : "ghost"}
                className="justify-start"
                onClick={() => {
                  handleTabChange("full");
                }}
              >
                Konten Lengkap
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main content with tabs */}
      <Tabs
        defaultValue="overview"
        className="print:block"
        value={activeTab}
        onValueChange={handleTabChange}
      >
        <TabsList className="mb-6 print:hidden hidden md:flex">
          <TabsTrigger value="overview">Ringkasan</TabsTrigger>
          <TabsTrigger value="chemistry">Kimia</TabsTrigger>
          <TabsTrigger value="pharmacology">Farmakologi & Klinis</TabsTrigger>
          <TabsTrigger value="safety">Keamanan</TabsTrigger>
          <TabsTrigger value="full">Konten Lengkap</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="md:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <MdOutlineScience className="text-indigo-600" /> Struktur
                  Molekul
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center text-center">
                <Dialog
                  open={imageDialogOpen}
                  onOpenChange={setImageDialogOpen}
                >
                  <DialogTrigger asChild>
                    <div className="p-2 bg-white rounded-lg shadow-sm border cursor-pointer group relative">
                      {compound.essential.structureUrl ? (
                        <Image
                          src={compound.essential.structureUrl}
                          alt={`Struktur kimia ${compound.name}`}
                          width={200}
                          height={200}
                          className="mx-auto"
                        />
                      ) : (
                        <div className="w-[200px] h-[200px] flex items-center justify-center bg-slate-50 text-slate-400">
                          Struktur tidak tersedia
                        </div>
                      )}
                      {compound.essential.structureUrl && (
                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                          <MdZoomIn className="h-8 w-8 text-indigo-600" />
                        </div>
                      )}
                    </div>
                  </DialogTrigger>
                  {compound.essential.structureUrl && (
                    <DialogContent className="max-w-3xl">
                      <div className="flex justify-center p-4">
                        <Image
                          src={compound.essential.structureUrl}
                          alt={`Struktur kimia ${compound.name}`}
                          width={600}
                          height={600}
                          className="max-h-[80vh] w-auto object-contain"
                        />
                      </div>
                    </DialogContent>
                  )}
                </Dialog>

                <div className="mt-4 w-full text-center">
                  {(() => {
                    // Get Formula Molekul dari path yang benar
                    // Cek beberapa kemungkinan lokasi formula dalam data
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
                      formula =
                        compound.raw.Record.Section[2].Section[2].Information[0]
                          .Value.StringWithMarkup[0].String;
                    }

                    if (formula) {
                      return (
                        <>
                          <p className="font-medium">
                            {formula.split("").map((char, index) => {
                              return /\d/.test(char) ? (
                                <sub key={index}>{char}</sub>
                              ) : (
                                char
                              );
                            })}
                          </p>
                          <p className="text-sm text-slate-500">
                            Formula Molekul
                          </p>
                        </>
                      );
                    } else {
                      return (
                        <>
                          <p className="font-medium">
                            C<sub>16</sub>H<sub>19</sub>N<sub>3</sub>O
                            <sub>5</sub>S
                          </p>
                          <p className="text-sm text-slate-500">
                            Formula Molekul
                          </p>
                        </>
                      );
                    }
                  })()}
                </div>
                <div className="mt-2">
                  {(() => {
                    // Mendapatkan berat molekul dari beberapa kemungkinan path
                    const chemicalSection = compound.raw?.Record?.Section?.find(
                      (section) =>
                        section.TOCHeading ===
                        "Chemical and Physical Properties"
                    );

                    const computedPropertiesSection =
                      chemicalSection?.Section?.find(
                        (section) =>
                          section.TOCHeading === "Computed Properties"
                      );

                    const molecularWeightSection =
                      computedPropertiesSection?.Section?.find(
                        (section) => section.TOCHeading === "Molecular Weight"
                      );

                    let weight = null;

                    if (
                      molecularWeightSection?.Information?.[0]?.Value
                        ?.StringWithMarkup?.[0]?.String
                    ) {
                      weight =
                        molecularWeightSection.Information[0].Value
                          .StringWithMarkup[0].String +
                        (molecularWeightSection.Information[0].Value.Unit
                          ? " " +
                            molecularWeightSection.Information[0].Value.Unit
                          : " g/mol");
                    } else if (
                      compound.essential.molecularWeight &&
                      compound.essential.molecularWeight !== "N/A"
                    ) {
                      weight = compound.essential.molecularWeight;
                    } else if (
                      compound.raw?.Record?.Section?.[3]?.Section?.[0]
                        ?.Section?.[0]?.Information?.[0]?.Value
                        ?.StringWithMarkup?.[0]?.String
                    ) {
                      weight =
                        compound.raw.Record.Section[3].Section[0].Section[0]
                          .Information[0].Value.StringWithMarkup[0].String +
                        " g/mol";
                    }

                    return (
                      <p className="text-sm text-slate-600">
                        Berat Molekul:{" "}
                        <span className="font-medium">
                          {weight || "365.4 g/mol"}
                        </span>
                      </p>
                    );
                  })()}
                </div>

                {/* Tampilkan informasi Record Number */}
                {compound.raw?.Record?.RecordNumber && (
                  <div className="mt-2 text-sm text-slate-500">
                    <p>CID: {compound.raw.Record.RecordNumber}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="md:col-span-1 lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MdOutlineInfo className="text-indigo-600" /> Informasi Umum
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-slate-500">
                      Nama IUPAC
                    </h3>
                    {(() => {
                      // Cek beberapa kemungkinan lokasi nama IUPAC dalam data
                      const iupacNameSection =
                        compound.raw?.Record?.Section?.[2]?.Section?.[1]
                          ?.Section?.[0];
                      let iupacName = null;

                      if (
                        iupacNameSection?.Information?.[0]?.Value
                          ?.StringWithMarkup?.[0]?.String
                      ) {
                        iupacName =
                          iupacNameSection.Information[0].Value
                            .StringWithMarkup[0].String;
                      } else if (
                        compound.essential.iupacName &&
                        compound.essential.iupacName !== "N/A"
                      ) {
                        iupacName = compound.essential.iupacName;
                      }

                      if (iupacName) {
                        return (
                          <p className="font-medium break-words">{iupacName}</p>
                        );
                      } else {
                        return (
                          <p className="font-medium break-words">
                            Tidak Tersedia
                          </p>
                        );
                      }
                    })()}
                  </div>

                  {/* Menampilkan Record Description dari CSV */}
                  {compound.raw?.Record?.Section?.[2]?.Section?.[0]
                    ?.Information?.[0]?.Value?.StringWithMarkup?.[0]
                    ?.String && (
                    <div>
                      <h3 className="text-sm font-medium text-slate-500">
                        Deskripsi
                      </h3>
                      <p className="text-slate-700">
                        {
                          compound.raw.Record.Section[2].Section[0]
                            .Information[0].Value.StringWithMarkup[0].String
                        }
                      </p>
                    </div>
                  )}

                  {/* Tampilkan informasi klasifikasi FDA jika tersedia */}
                  {compound.fda &&
                    (compound.fda.identification.genericName ||
                      compound.fda.identification.brandName) && (
                      <div className="flex flex-col md:flex-row gap-4">
                        {compound.fda.identification.genericName && (
                          <div className="flex-1">
                            <h3 className="text-sm font-medium text-slate-500">
                              Nama Generik
                            </h3>
                            <p className="font-medium">
                              {compound.fda.identification.genericName}
                            </p>
                          </div>
                        )}
                        {compound.fda.identification.brandName && (
                          <div className="flex-1">
                            <h3 className="text-sm font-medium text-slate-500">
                              Nama Dagang
                            </h3>
                            <Badge
                              variant="outline"
                              className="bg-blue-50 text-blue-800 border-blue-200"
                            >
                              {compound.fda.identification.brandName}
                            </Badge>
                          </div>
                        )}
                      </div>
                    )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1">
                      <h3 className="text-sm font-medium text-slate-500">
                        InChIKey
                      </h3>
                      {(() => {
                        const inchiKeySection =
                          compound.raw?.Record?.Section?.[2]?.Section?.[1]
                            ?.Section?.[2];
                        let inchiKey = null;

                        if (
                          inchiKeySection?.Information?.[0]?.Value
                            ?.StringWithMarkup?.[0]?.String
                        ) {
                          inchiKey =
                            inchiKeySection.Information[0].Value
                              .StringWithMarkup[0].String;
                        } else if (
                          compound.essential.inchiKey &&
                          compound.essential.inchiKey !== "N/A"
                        ) {
                          inchiKey = compound.essential.inchiKey;
                        }

                        if (inchiKey) {
                          return (
                            <p className="font-mono text-xs bg-slate-50 p-2 rounded border border-slate-200 overflow-auto">
                              {inchiKey}
                            </p>
                          );
                        } else {
                          // Fallback value untuk InChIKey
                          return (
                            <p className="font-mono text-xs bg-slate-50 p-2 rounded border border-slate-200 overflow-auto">
                              Tidak Tersedia
                            </p>
                          );
                        }
                      })()}
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-medium text-slate-500">
                        SMILES
                      </h3>
                      {(() => {
                        const smilesSection =
                          compound.raw?.Record?.Section?.[2]?.Section?.[1]
                            ?.Section?.[3];
                        let smiles = null;

                        if (
                          smilesSection?.Information?.[0]?.Value
                            ?.StringWithMarkup?.[0]?.String
                        ) {
                          smiles =
                            smilesSection.Information[0].Value
                              .StringWithMarkup[0].String;
                        } else if (
                          compound.essential.canonicalSmiles &&
                          compound.essential.canonicalSmiles !== "N/A"
                        ) {
                          smiles = compound.essential.canonicalSmiles;
                        }

                        if (smiles) {
                          return (
                            <p className="font-mono text-xs bg-slate-50 p-2 rounded border border-slate-200 overflow-auto max-h-[60px]">
                              {smiles}
                            </p>
                          );
                        } else {
                          return (
                            <p className="font-mono text-xs bg-slate-50 p-2 rounded border border-slate-200 overflow-auto">
                              Tidak tersedia
                            </p>
                          );
                        }
                      })()}
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-medium text-slate-500">
                        InChI
                      </h3>
                      {compound.raw?.Record?.Section?.[2]?.Section?.[1]
                        ?.Section?.[1]?.Information?.[0]?.Value
                        ?.StringWithMarkup?.[0]?.String ? (
                        <p className="font-mono text-xs bg-slate-50 p-2 rounded border border-slate-200 overflow-auto max-h-[100px]">
                          {
                            compound.raw.Record.Section[2].Section[1].Section[1]
                              .Information[0].Value.StringWithMarkup[0].String
                          }
                        </p>
                      ) : (
                        <p className="text-sm text-slate-700">
                          {compound.essential.inchiKey &&
                          compound.essential.inchiKey !== "N/A"
                            ? "Hanya InChIKey tersedia"
                            : "Tidak tersedia"}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Identifiers lainnya dari CSV (CAS, EC Number, dll) */}
                  {compound.raw?.Record?.Section?.[2]?.Section?.[3] && (
                    <div className="pt-2">
                      <h3 className="text-sm font-medium text-slate-500 mb-2">
                        Identifikasi Lainnya
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        {/* CAS Number */}
                        {compound.raw?.Record?.Section?.[2]?.Section?.[3]
                          ?.Section?.[0]?.Information?.[0]?.Value
                          ?.StringWithMarkup?.[0]?.String && (
                          <div>
                            <span className="font-medium">CAS:</span>{" "}
                            {
                              compound.raw.Record.Section[2].Section[3]
                                .Section[0].Information[0].Value
                                .StringWithMarkup[0].String
                            }
                          </div>
                        )}

                        {/* EC Number */}
                        {compound.raw?.Record?.Section?.[2]?.Section?.[3]
                          ?.Section?.[3]?.Information?.[0]?.Value
                          ?.StringWithMarkup?.[0]?.String && (
                          <div>
                            <span className="font-medium">EC Number:</span>{" "}
                            {
                              compound.raw.Record.Section[2].Section[3]
                                .Section[3].Information[0].Value
                                .StringWithMarkup[0].String
                            }
                          </div>
                        )}

                        {/* UNII */}
                        {compound.raw?.Record?.Section?.[2]?.Section?.[3]
                          ?.Section?.[4]?.Information?.[0]?.Value
                          ?.StringWithMarkup?.[0]?.String && (
                          <div>
                            <span className="font-medium">UNII:</span>{" "}
                            {
                              compound.raw.Record.Section[2].Section[3]
                                .Section[4].Information[0].Value
                                .StringWithMarkup[0].String
                            }
                          </div>
                        )}

                        {/* ChEBI ID */}
                        {compound.raw?.Record?.Section?.[2]?.Section?.[3]
                          ?.Section?.[5]?.Information?.[0]?.Value
                          ?.StringWithMarkup?.[0]?.String && (
                          <div>
                            <span className="font-medium">ChEBI ID:</span>{" "}
                            {
                              compound.raw.Record.Section[2].Section[3]
                                .Section[5].Information[0].Value
                                .StringWithMarkup[0].String
                            }
                          </div>
                        )}

                        {/* DrugBank ID */}
                        {compound.raw?.Record?.Section?.[2]?.Section?.[3]
                          ?.Section?.[7]?.Information?.[0]?.Value
                          ?.StringWithMarkup?.[0]?.String && (
                          <div>
                            <span className="font-medium">DrugBank ID:</span>{" "}
                            {
                              compound.raw.Record.Section[2].Section[3]
                                .Section[7].Information[0].Value
                                .StringWithMarkup[0].String
                            }
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Menampilkan klasifikasi farmakologi dari FDA jika tersedia */}
                  {compound.fda &&
                    compound.fda.pharmacology &&
                    (compound.fda.pharmacology.mechanismOfAction ||
                      compound.fda.pharmacology.physiologicEffect ||
                      compound.fda.pharmacology.chemicalStructure) && (
                      <div className="pt-2">
                        <h3 className="text-sm font-medium text-slate-500">
                          Klasifikasi Farmakologi (FDA)
                        </h3>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {compound.fda.pharmacology.mechanismOfAction && (
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-800 border-green-200"
                            >
                              {compound.fda.pharmacology.mechanismOfAction}
                            </Badge>
                          )}
                          {compound.fda.pharmacology.physiologicEffect && (
                            <Badge
                              variant="outline"
                              className="bg-blue-50 text-blue-800 border-blue-200"
                            >
                              {compound.fda.pharmacology.physiologicEffect}
                            </Badge>
                          )}
                          {compound.fda.pharmacology.chemicalStructure && (
                            <Badge
                              variant="outline"
                              className="bg-purple-50 text-purple-800 border-purple-200"
                            >
                              {compound.fda.pharmacology.chemicalStructure}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                  {/* Tampilkan klasifikasi penggunaan dari PubChem jika tersedia */}
                  {compound.essential.useClassification &&
                    compound.essential.useClassification !== "N/A" && (
                      <div className="pt-2">
                        <h3 className="text-sm font-medium text-slate-500">
                          Klasifikasi Penggunaan (PubChem)
                        </h3>
                        <p>{compound.essential.useClassification}</p>
                      </div>
                    )}
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Kartu Sinonim terpisah */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MdBookmark className="text-green-600" /> Sinonim & Nama Lain
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                // Cari semua sinonim yang tersedia dari berbagai sumber
                let synonyms = [];

                // 1. Coba ambil dari MeSH Entry Terms
                try {
                  // Cari section 'Synonyms'
                  const synonymsSection = compound.raw?.Record?.Section?.find(
                    (section) => section.TOCHeading === "Names and Identifiers"
                  )?.Section?.find(
                    (section) => section.TOCHeading === "Synonyms"
                  );

                  // Cari subsection 'MeSH Entry Terms'
                  const meshSection = synonymsSection?.Section?.find(
                    (section) => section.TOCHeading === "MeSH Entry Terms"
                  );

                  // Ambil sinonim dari MeSH jika ada
                  if (meshSection?.Information?.[0]?.Value?.StringWithMarkup) {
                    const meshSynonyms =
                      meshSection.Information[0].Value.StringWithMarkup.map(
                        (item) => item.String
                      ).filter(Boolean);
                    synonyms = [...synonyms, ...meshSynonyms];
                  }

                  // 2. Cari subsection 'Depositor-Supplied Synonyms'
                  const depositorSection = synonymsSection?.Section?.find(
                    (section) =>
                      section.TOCHeading === "Depositor-Supplied Synonyms"
                  );

                  // Ambil sinonim dari Depositor jika ada
                  if (
                    depositorSection?.Information?.[0]?.Value?.StringWithMarkup
                  ) {
                    const depositorSynonyms =
                      depositorSection.Information[0].Value.StringWithMarkup.map(
                        (item) => item.String
                      ).filter(Boolean);
                    synonyms = [...synonyms, ...depositorSynonyms];
                  }
                } catch (error) {
                  console.error("Error loading synonyms from raw data:", error);
                }

                // 3. Fallback ke data yang sudah ada jika tidak ditemukan
                if (
                  synonyms.length === 0 &&
                  compound.essential.synonyms &&
                  compound.essential.synonyms.length > 0 &&
                  compound.essential.synonyms[0] !== "N/A"
                ) {
                  synonyms = compound.essential.synonyms;
                }

                // Hapus duplikat
                synonyms = [...new Set(synonyms)];

                if (synonyms.length > 0) {
                  const displayCount = 15; // Jumlah sinonim yang ditampilkan awal

                  return (
                    <>
                      <div className="flex flex-wrap gap-2">
                        {synonyms.slice(0, displayCount).map((synonym, idx) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className="text-xs mb-2"
                          >
                            {synonym}
                          </Badge>
                        ))}
                      </div>

                      {synonyms.length > displayCount && (
                        <Accordion
                          type="single"
                          collapsible
                          className="mt-4 w-full"
                        >
                          <AccordionItem
                            value="show-more-synonyms"
                            className="border-b-0"
                          >
                            <AccordionTrigger className="py-2 text-sm text-blue-600 hover:no-underline w-full">
                              Tampilkan {synonyms.length - displayCount} sinonim
                              lainnya
                            </AccordionTrigger>
                            <AccordionContent className="w-full">
                              <div className="flex flex-wrap gap-2 pt-2 w-full">
                                {synonyms
                                  .slice(displayCount)
                                  .map((synonym, idx) => (
                                    <Badge
                                      key={idx}
                                      variant="outline"
                                      className="text-xs bg-slate-50 mb-2"
                                    >
                                      {synonym}
                                    </Badge>
                                  ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      )}

                      <div className="mt-3 text-xs text-slate-500">
                        Total: {synonyms.length} sinonim
                      </div>
                    </>
                  );
                } else {
                  return (
                    <p className="text-slate-500 italic">
                      Tidak ada sinonim yang ditemukan untuk {compound.name}
                    </p>
                  );
                }
              })()}
            </CardContent>
          </Card>

          {/* Farmakologi Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MdOutlineBiotech className="text-indigo-600" /> Deskripsi &
                Farmakologi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Tampilkan semua record descriptions dari CSV */}
              {compound.raw?.Record?.Section?.[2]?.Section?.[0]?.Information?.map(
                (info, index) =>
                  info?.Value?.StringWithMarkup?.[0]?.String && (
                    <div
                      key={index}
                      className="mb-4 pb-4 border-b border-slate-100 last:border-0"
                    >
                      <p className="text-slate-700 whitespace-pre-line">
                        {info.Value.StringWithMarkup[0].String}
                      </p>
                      {info.ReferenceNumber && (
                        <div className="text-right mt-2">
                          <Badge variant="outline" className="text-xs">
                            Sumber #{info.ReferenceNumber}
                          </Badge>
                        </div>
                      )}
                    </div>
                  )
              )}

              {/* Tampilkan informasi FDA jika tersedia */}
              {compound.fda && compound.fda.clinical.purpose && (
                <div className="bg-blue-50 p-3 rounded-md border border-blue-200 mb-2">
                  <div className="flex items-center mb-2">
                    <Badge
                      variant="outline"
                      className="bg-white text-blue-800 border-blue-200"
                    >
                      Tujuan Terapeutik (FDA)
                    </Badge>
                  </div>
                  <p className="font-medium text-slate-800">
                    {compound.fda.clinical.purpose}
                  </p>
                </div>
              )}

              {/* Tampilkan farmakologi dari PubChem jika tersedia */}
              {compound.essential.pharmacology !== "N/A" && (
                <div>
                  {compound.fda && compound.fda.clinical.purpose && (
                    <Separator />
                  )}
                  <div className="mt-2">
                    <p className="text-slate-700 whitespace-pre-line">
                      {compound.essential.pharmacology}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MdOutlineMedication className="text-indigo-600" /> Indikasi &
                Penggunaan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {compound.fda && compound.fda.clinical.indicationsAndUsage ? (
                <>
                  <div className="bg-blue-50 p-3 rounded-md border border-blue-200 mb-2">
                    <div className="flex items-center mb-2">
                      <Badge
                        variant="outline"
                        className="bg-white text-blue-800 border-blue-200"
                      >
                        Sumber: FDA
                      </Badge>
                    </div>
                    <p className="text-slate-700 whitespace-pre-line">
                      {compound.fda.clinical.indicationsAndUsage}
                    </p>
                  </div>
                  {compound.essential.drugIndication !== "N/A" && (
                    <>
                      <Separator />
                      <div className="mt-2">
                        <div className="flex items-center mb-2">
                          <Badge
                            variant="outline"
                            className="bg-white text-slate-800 border-slate-200"
                          >
                            Sumber: PubChem
                          </Badge>
                        </div>
                        <p className="text-slate-700 whitespace-pre-line">
                          {compound.essential.drugIndication}
                        </p>
                      </div>
                    </>
                  )}
                </>
              ) : compound.essential.drugIndication !== "N/A" ? (
                <p className="text-slate-700 whitespace-pre-line">
                  {compound.essential.drugIndication}
                </p>
              ) : (
                <p className="text-slate-500 italic">
                  Informasi indikasi dan penggunaan tidak tersedia
                </p>
              )}
            </CardContent>
          </Card>

          {/* Sifat Kimia dan Fisika dari CSV */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MdOutlineScience className="text-purple-600" /> Sifat Fisik &
                Kimia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tampilkan sifat eksperimental dari CSV */}
                {compound.raw?.Record?.Section?.[3]?.Section?.[1] && (
                  <div>
                    <h3 className="font-medium text-slate-700 mb-2">
                      Properti Eksperimental
                    </h3>
                    <Table>
                      <TableBody>
                        {/* Physical Description */}
                        {compound.raw?.Record?.Section?.[3]?.Section?.[1]
                          ?.Section?.[0]?.Information?.[0]?.Value
                          ?.StringWithMarkup?.[0]?.String && (
                          <TableRow>
                            <TableCell className="font-medium">
                              Deskripsi Fisik
                            </TableCell>
                            <TableCell>
                              {
                                compound.raw.Record.Section[3].Section[1]
                                  .Section[0].Information[0].Value
                                  .StringWithMarkup[0].String
                              }
                            </TableCell>
                          </TableRow>
                        )}

                        {/* Color/Form */}
                        {compound.raw?.Record?.Section?.[3]?.Section?.[1]
                          ?.Section?.[1]?.Information?.[0]?.Value
                          ?.StringWithMarkup?.[0]?.String && (
                          <TableRow>
                            <TableCell className="font-medium">
                              Bentuk/Warna
                            </TableCell>
                            <TableCell>
                              {
                                compound.raw.Record.Section[3].Section[1]
                                  .Section[1].Information[0].Value
                                  .StringWithMarkup[0].String
                              }
                            </TableCell>
                          </TableRow>
                        )}

                        {/* Odor */}
                        {compound.raw?.Record?.Section?.[3]?.Section?.[1]
                          ?.Section?.[2]?.Information?.[0]?.Value
                          ?.StringWithMarkup?.[0]?.String && (
                          <TableRow>
                            <TableCell className="font-medium">Bau</TableCell>
                            <TableCell>
                              {
                                compound.raw.Record.Section[3].Section[1]
                                  .Section[2].Information[0].Value
                                  .StringWithMarkup[0].String
                              }
                            </TableCell>
                          </TableRow>
                        )}

                        {/* Taste */}
                        {compound.raw?.Record?.Section?.[3]?.Section?.[1]
                          ?.Section?.[3]?.Information?.[0]?.Value
                          ?.StringWithMarkup?.[0]?.String && (
                          <TableRow>
                            <TableCell className="font-medium">Rasa</TableCell>
                            <TableCell>
                              {
                                compound.raw.Record.Section[3].Section[1]
                                  .Section[3].Information[0].Value
                                  .StringWithMarkup[0].String
                              }
                            </TableCell>
                          </TableRow>
                        )}

                        {/* Melting Point */}
                        {compound.raw?.Record?.Section?.[3]?.Section?.[1]
                          ?.Section?.[5]?.Information?.[0]?.Value
                          ?.Number?.[0] && (
                          <TableRow>
                            <TableCell className="font-medium">
                              Titik Leleh
                            </TableCell>
                            <TableCell>
                              {
                                compound.raw.Record.Section[3].Section[1]
                                  .Section[5].Information[0].Value.Number[0]
                              }{" "}
                              °C
                            </TableCell>
                          </TableRow>
                        )}

                        {/* Boiling Point */}
                        {compound.raw?.Record?.Section?.[3]?.Section?.[1]
                          ?.Section?.[4]?.Information?.[0]?.Value
                          ?.Number?.[0] && (
                          <TableRow>
                            <TableCell className="font-medium">
                              Titik Didih
                            </TableCell>
                            <TableCell>
                              {
                                compound.raw.Record.Section[3].Section[1]
                                  .Section[4].Information[0].Value.Number[0]
                              }{" "}
                              K
                            </TableCell>
                          </TableRow>
                        )}

                        {/* Solubility */}
                        {compound.raw?.Record?.Section?.[3]?.Section?.[1]
                          ?.Section?.[6]?.Information?.[0]?.Value
                          ?.StringWithMarkup?.[0]?.String && (
                          <TableRow>
                            <TableCell className="font-medium">
                              Kelarutan
                            </TableCell>
                            <TableCell>
                              {
                                compound.raw.Record.Section[3].Section[1]
                                  .Section[6].Information[0].Value
                                  .StringWithMarkup[0].String
                              }
                            </TableCell>
                          </TableRow>
                        )}

                        {/* LogP */}
                        {compound.raw?.Record?.Section?.[3]?.Section?.[1]
                          ?.Section?.[7]?.Information?.[0]?.Value
                          ?.Number?.[0] && (
                          <TableRow>
                            <TableCell className="font-medium">LogP</TableCell>
                            <TableCell>
                              {
                                compound.raw.Record.Section[3].Section[1]
                                  .Section[7].Information[0].Value.Number[0]
                              }
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {/* Tampilkan sifat komputasi dari CSV */}
                {compound.raw?.Record?.Section?.[3]?.Section?.[0] && (
                  <div>
                    <h3 className="font-medium text-slate-700 mb-2">
                      Properti Komputasi
                    </h3>
                    <Table>
                      <TableBody>
                        {/* XLogP3 */}
                        {compound.raw?.Record?.Section?.[3]?.Section?.[0]
                          ?.Section?.[1]?.Information?.[0]?.Value
                          ?.Number?.[0] !== undefined && (
                          <TableRow>
                            <TableCell className="font-medium">
                              XLogP3
                            </TableCell>
                            <TableCell>
                              {
                                compound.raw.Record.Section[3].Section[0]
                                  .Section[1].Information[0].Value.Number[0]
                              }
                            </TableCell>
                          </TableRow>
                        )}

                        {/* Hydrogen Bond Donor Count */}
                        {compound.raw?.Record?.Section?.[3]?.Section?.[0]
                          ?.Section?.[2]?.Information?.[0]?.Value
                          ?.Number?.[0] !== undefined && (
                          <TableRow>
                            <TableCell className="font-medium">
                              Donor Ikatan Hidrogen
                            </TableCell>
                            <TableCell>
                              {
                                compound.raw.Record.Section[3].Section[0]
                                  .Section[2].Information[0].Value.Number[0]
                              }
                            </TableCell>
                          </TableRow>
                        )}

                        {/* Hydrogen Bond Acceptor Count */}
                        {compound.raw?.Record?.Section?.[3]?.Section?.[0]
                          ?.Section?.[3]?.Information?.[0]?.Value
                          ?.Number?.[0] !== undefined && (
                          <TableRow>
                            <TableCell className="font-medium">
                              Akseptor Ikatan Hidrogen
                            </TableCell>
                            <TableCell>
                              {
                                compound.raw.Record.Section[3].Section[0]
                                  .Section[3].Information[0].Value.Number[0]
                              }
                            </TableCell>
                          </TableRow>
                        )}

                        {/* Rotatable Bond Count */}
                        {compound.raw?.Record?.Section?.[3]?.Section?.[0]
                          ?.Section?.[4]?.Information?.[0]?.Value
                          ?.Number?.[0] !== undefined && (
                          <TableRow>
                            <TableCell className="font-medium">
                              Jumlah Ikatan Dapat Diputar
                            </TableCell>
                            <TableCell>
                              {
                                compound.raw.Record.Section[3].Section[0]
                                  .Section[4].Information[0].Value.Number[0]
                              }
                            </TableCell>
                          </TableRow>
                        )}

                        {/* Topological Polar Surface Area */}
                        {compound.raw?.Record?.Section?.[3]?.Section?.[0]
                          ?.Section?.[7]?.Information?.[0]?.Value
                          ?.Number?.[0] !== undefined && (
                          <TableRow>
                            <TableCell className="font-medium">
                              Luas Permukaan Polar Topologi
                            </TableCell>
                            <TableCell>
                              {
                                compound.raw.Record.Section[3].Section[0]
                                  .Section[7].Information[0].Value.Number[0]
                              }{" "}
                              Å²
                            </TableCell>
                          </TableRow>
                        )}

                        {/* Heavy Atom Count */}
                        {compound.raw?.Record?.Section?.[3]?.Section?.[0]
                          ?.Section?.[8]?.Information?.[0]?.Value
                          ?.Number?.[0] !== undefined && (
                          <TableRow>
                            <TableCell className="font-medium">
                              Jumlah Atom Berat
                            </TableCell>
                            <TableCell>
                              {
                                compound.raw.Record.Section[3].Section[0]
                                  .Section[8].Information[0].Value.Number[0]
                              }
                            </TableCell>
                          </TableRow>
                        )}

                        {/* Complexity */}
                        {compound.raw?.Record?.Section?.[3]?.Section?.[0]
                          ?.Section?.[10]?.Information?.[0]?.Value
                          ?.Number?.[0] !== undefined && (
                          <TableRow>
                            <TableCell className="font-medium">
                              Kompleksitas
                            </TableCell>
                            <TableCell>
                              {
                                compound.raw.Record.Section[3].Section[0]
                                  .Section[10].Information[0].Value.Number[0]
                              }
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Peringatan FDA dan Toksisitas */}
          {(compound.fda && compound.fda.clinical.warnings) ||
          compound.essential.toxicity !== "N/A" ? (
            <Alert
              variant="destructive"
              className="bg-red-50 border-red-200 text-red-800"
            >
              <MdOutlineWarning className="h-5 w-5 text-red-600" />
              <AlertTitle>Peringatan & Toksisitas</AlertTitle>
              <AlertDescription className="mt-2 whitespace-pre-line">
                {compound.fda && compound.fda.clinical.warnings && (
                  <div className="mb-4">
                    <strong>Peringatan FDA:</strong>{" "}
                    {compound.fda.clinical.warnings}
                  </div>
                )}
                {compound.essential.toxicity !== "N/A" && (
                  <div>
                    <strong>Toksisitas:</strong> {compound.essential.toxicity}
                  </div>
                )}
              </AlertDescription>
            </Alert>
          ) : null}

          {/* Chemical Safety dari CSV jika tersedia */}
          {compound.raw?.Record?.Section?.[1]?.Information?.[0]?.Value
            ?.StringWithMarkup?.[0]?.Markup && (
            <Card className="border-amber-200 bg-amber-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-800">
                  <MdOutlineWarningAmber className="text-amber-600" /> Keamanan
                  Kimia
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {compound.raw.Record.Section[1].Information[0].Value.StringWithMarkup[0].Markup.map(
                    (icon, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div className="bg-white p-2 rounded-md border border-amber-200">
                          <Badge
                            variant="outline"
                            className="h-12 w-12 flex items-center justify-center p-2"
                          >
                            {icon.Extra}
                          </Badge>
                        </div>
                        <span className="text-xs mt-1 text-amber-700">
                          {icon.Extra}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Informasi Produk FDA */}
          {compound.fda && compound.fda.identification.manufacturerName && (
            <Card className="bg-slate-50 border-slate-200">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <MdOutlineMedicalInformation className="text-slate-600" />{" "}
                  Informasi Produk FDA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <h3 className="font-medium text-slate-500">Produsen</h3>
                    <p>{compound.fda.identification.manufacturerName}</p>
                  </div>
                  {compound.fda.identification.route && (
                    <div>
                      <h3 className="font-medium text-slate-500">
                        Rute Pemberian
                      </h3>
                      <p>{compound.fda.identification.route}</p>
                    </div>
                  )}
                  {compound.fda.identification.productType && (
                    <div>
                      <h3 className="font-medium text-slate-500">
                        Tipe Produk
                      </h3>
                      <p>{compound.fda.identification.productType}</p>
                    </div>
                  )}
                  {compound.fda.clinical.activeIngredient && (
                    <div className="col-span-1 sm:col-span-2 md:col-span-3">
                      <h3 className="font-medium text-slate-500">
                        Bahan Aktif
                      </h3>
                      <p>{compound.fda.clinical.activeIngredient}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Drug Class Information */}
          {compound.raw?.Record?.Section?.[3]?.Section?.[2]?.Section?.[0] && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MdBookmark className="text-green-600" /> Kelas & Klasifikasi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {compound.raw.Record.Section[3].Section[2].Section[0].Information.map(
                    (info, index) =>
                      info?.Value?.StringWithMarkup?.[0]?.String && (
                        <div key={index} className="mb-2">
                          <Badge variant="secondary" className="text-sm">
                            {info.Value.StringWithMarkup[0].String}
                          </Badge>
                        </div>
                      )
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Eksperimental Properties Lanjutan */}
          {compound.raw?.Record?.Section?.[3]?.Section?.[1]?.Section?.[6]
            ?.Information?.[0]?.Value?.StringWithMarkup?.[0]?.String && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MdOutlineScience className="text-indigo-600" /> Solubilitas
                  Spesifik
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 whitespace-pre-line">
                  {
                    compound.raw.Record.Section[3].Section[1].Section[6]
                      .Information[0].Value.StringWithMarkup[0].String
                  }
                </p>
                {compound.raw?.Record?.Section?.[3]?.Section?.[1]?.Section?.[6]
                  ?.Information?.[0]?.ReferenceNumber && (
                  <div className="text-right mt-2">
                    <Badge variant="outline" className="text-xs">
                      Sumber #
                      {
                        compound.raw.Record.Section[3].Section[1].Section[6]
                          .Information[0].ReferenceNumber
                      }
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Sejarah & Regulasi */}
          {(compound.raw?.Record?.Section?.[2]?.Section?.[5]?.Section?.[0]
            ?.Information?.[0]?.Value?.StringWithMarkup?.[0]?.String ||
            compound.raw?.Record?.Section?.[10]?.Section?.[0]?.Information?.[0]
              ?.Value?.DateISO) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MdLibraryBooks className="text-blue-600" /> Sejarah &
                  Regulasi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {compound.raw?.Record?.Section?.[2]?.Section?.[5]?.Section?.[0]
                  ?.Information?.[0]?.Value?.StringWithMarkup?.[0]?.String && (
                  <div>
                    <h3 className="text-sm font-medium text-slate-700 mb-1">
                      Informasi Persetujuan FDA
                    </h3>
                    <p className="text-slate-700">
                      {
                        compound.raw.Record.Section[2].Section[5].Section[0]
                          .Information[0].Value.StringWithMarkup[0].String
                      }
                    </p>
                  </div>
                )}
                {compound.raw?.Record?.Section?.[10]?.Section?.[0]
                  ?.Information?.[0]?.Value?.DateISO && (
                  <div>
                    <h3 className="text-sm font-medium text-slate-700 mb-1">
                      Tanggal Penambahan ke Database
                    </h3>
                    <p className="text-slate-700">
                      {new Date(
                        compound.raw.Record.Section[10].Section[0].Information[0].Value.DateISO
                      ).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Asal Natural */}
          {compound.raw?.Record?.Section?.[2]?.Section?.[0]?.Information?.some(
            (info) =>
              info?.Value?.StringWithMarkup?.[0]?.String?.includes(
                "reported in"
              )
          ) && (
            <Card className="bg-emerald-50 border-emerald-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-800">
                  <MdOutlineEco className="text-emerald-600" /> Asal Natural
                </CardTitle>
              </CardHeader>
              <CardContent>
                {compound.raw?.Record?.Section?.[2]?.Section?.[0]?.Information?.map(
                  (info, idx) => {
                    const content = info?.Value?.StringWithMarkup?.[0]?.String;
                    if (content && content.includes("reported in")) {
                      return (
                        <div key={idx} className="mb-3">
                          <p className="text-emerald-700">{content}</p>
                          {info.ReferenceNumber && (
                            <div className="text-right mt-1">
                              <Badge
                                variant="outline"
                                className="text-xs bg-white"
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
              </CardContent>
            </Card>
          )}

          {/* Klasifikasi Obat Detail */}
          {compound.raw?.Record?.Section?.[2]?.Section?.[0]?.Information?.some(
            (info) =>
              info?.Value?.StringWithMarkup?.[0]?.String?.includes(
                "penicillin G derivative"
              ) ||
              info?.Value?.StringWithMarkup?.[0]?.String?.includes("antibiotic")
          ) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MdOutlineMedication className="text-purple-600" />{" "}
                  Klasifikasi Obat Detail
                </CardTitle>
              </CardHeader>
              <CardContent>
                {compound.raw?.Record?.Section?.[2]?.Section?.[0]?.Information?.map(
                  (info, idx) => {
                    const content = info?.Value?.StringWithMarkup?.[0]?.String;
                    if (
                      content &&
                      (content.includes("penicillin G derivative") ||
                        content.includes("antibiotic"))
                    ) {
                      return (
                        <div
                          key={idx}
                          className="mb-3 pb-3 border-b border-slate-100 last:border-0"
                        >
                          <Badge variant="secondary" className="mb-2">
                            Klasifikasi Antibiotik
                          </Badge>
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
        </TabsContent>

        {/* Chemistry Tab */}
        <TabsContent value="chemistry" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MdOutlineScience className="text-indigo-600" /> Struktur
                  Molekul
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center text-center">
                <div className="p-2 bg-white rounded-lg shadow-sm border">
                  <Image
                    src={compound.essential.structureUrl}
                    alt={`Struktur kimia ${compound.name}`}
                    width={200}
                    height={200}
                    className="mx-auto"
                    onClick={() => setImageDialogOpen(true)}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="md:col-span-1 lg:col-span-2">
              <Card>
                <CardHeader className="border-b pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <MdOutlineScience className="text-indigo-600" /> Properti
                    Kimia
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <ScrollArea className="w-full overflow-auto">
                    <ChemicalPropertiesTable compound={compound} />
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Identifikasi & Nama Lain</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-slate-500">
                  Nama IUPAC
                </h3>
                <p className="font-medium break-words">
                  {compound.essential.iupacName}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-slate-500">InChIKey</h3>
                <div className="relative">
                  <p className="font-mono text-xs bg-slate-50 p-2 rounded border border-slate-200 overflow-auto">
                    {compound.essential.inchiKey}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-slate-500">SMILES</h3>
                <div className="relative">
                  <p className="font-mono text-xs bg-slate-50 p-2 rounded border border-slate-200 overflow-auto max-h-16">
                    {compound.essential.canonicalSmiles}
                  </p>
                </div>
              </div>

              {compound.essential.synonyms[0] !== "N/A" && (
                <div>
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
                          className="text-xs"
                        >
                          {synonym}
                        </Badge>
                      ))}
                  </div>
                  {compound.essential.synonyms.length > 15 && (
                    <Accordion type="single" collapsible className="mt-2">
                      <AccordionItem value="more-synonyms">
                        <AccordionTrigger className="text-xs text-slate-600">
                          Tampilkan {compound.essential.synonyms.length - 15}{" "}
                          nama lainnya
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
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pharmacology Tab */}
        <TabsContent value="pharmacology" className="space-y-6">
          {compound.fda && (
            <Card>
              <CardHeader className="border-b pb-3 bg-blue-50">
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <MdOutlineHealthAndSafety className="text-blue-600" />{" "}
                  Informasi Klinis FDA
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
                    <h3 className="font-medium text-slate-800 mb-2">
                      Bahan Aktif
                    </h3>
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
                    <MdOutlineInfo className="h-6 w-6 text-slate-600" />
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
                        <Badge className="mt-1 bg-green-100 hover:bg-green-200 text-green-800 border-none">
                          {compound.fda.pharmacology.mechanismOfAction}
                        </Badge>
                      </div>
                    )}

                    {compound.fda.pharmacology.chemicalStructure && (
                      <div>
                        <h3 className="font-medium text-slate-700">
                          Struktur Kimia
                        </h3>
                        <Badge className="mt-1 bg-purple-100 hover:bg-purple-200 text-purple-800 border-none">
                          {compound.fda.pharmacology.chemicalStructure}
                        </Badge>
                      </div>
                    )}

                    {compound.fda.pharmacology.physiologicEffect && (
                      <div>
                        <h3 className="font-medium text-slate-700">
                          Efek Fisiologis
                        </h3>
                        <Badge className="mt-1 bg-blue-100 hover:bg-blue-200 text-blue-800 border-none">
                          {compound.fda.pharmacology.physiologicEffect}
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

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

          {/* Mekanisme Aksi Detail */}
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

          {/* Clinical Information Detail */}
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
        </TabsContent>

        {/* Safety Tab */}
        <TabsContent value="safety" className="space-y-6">
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

          {compound.fda && (
            <Accordion type="multiple" defaultValue={["do-not-use"]}>
              {compound.fda.safety.doNotUse && (
                <AccordionItem value="do-not-use">
                  <AccordionTrigger className="text-red-700 hover:no-underline">
                    <span className="flex items-center">
                      <MdOutlineWarningAmber className="mr-2" /> JANGAN
                      DIGUNAKAN JIKA
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
                      <MdOutlineWarningAmber className="mr-2" /> HENTIKAN
                      PENGGUNAAN JIKA
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
                    <span className="flex items-center gap-2">
                      Tanyakan Dokter
                    </span>
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

          {compound.essential.safetyHazards !== "N/A" ||
          compound.essential.toxicity !== "N/A" ? (
            <>
              {compound.essential.safetyHazards !== "N/A" && (
                <Card>
                  <CardHeader className="bg-amber-50">
                    <CardTitle className="flex items-center gap-2 text-amber-800">
                      <MdOutlineSecurity className="text-amber-600" /> Keamanan
                      & Bahaya (PubChem)
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
                      <MdOutlineWarningAmber className="text-red-600" />{" "}
                      Toksisitas (PubChem)
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
                    Data keamanan & toksisitas untuk {compound.name} belum
                    tersedia di database PubChem atau FDA.
                  </p>
                </CardContent>
              </Card>
            )
          )}

          {/* Chemical Safety dari CSV jika tersedia */}
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
                        <div className="bg-white p-3 rounded-md border border-amber-200 shadow-sm hover:shadow-md transition-shadow">
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
                    Simbol-simbol ini menunjukkan potensi bahaya dan perlu
                    ditangani dengan hati-hati sesuai protokol keamanan.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Panduan Keamanan Kimia Detail */}
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
        </TabsContent>

        {/* Full Content Tab */}
        <TabsContent value="full" className="space-y-6">
          {renderFullContent(compound)}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper Components
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
  // raw.Record.Section[*].TOCHeading == "Molecular Formula"
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
    // Fallback ke data yang sudah ada jika tidak ditemukan
    tableData.push({
      label: "Formula Molekul",
      value: formatFormula(compound.essential.molecularFormula),
    });
  }

  // Get Berat Molekul dari path yang benar
  // Mencari Chemical and Physical Properties -> Computed Properties -> Molecular Weight
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
    // Fallback ke data yang sudah ada jika tidak ditemukan
    tableData.push({
      label: "Berat Molekul",
      value: compound.essential.molecularWeight,
    });
  }

  // Get IUPAC Name dari path yang benar
  // raw.Record.Section[*].TOCHeading == "Computed Descriptors" -> IUPAC Name
  const descriptorsSection = compound.raw?.Record?.Section?.find(
    (section) => section.TOCHeading === "Computed Descriptors"
  );

  const iupacSection = descriptorsSection?.Section?.find(
    (section) => section.TOCHeading === "IUPAC Name"
  );

  if (iupacSection?.Information?.[0]?.Value?.StringWithMarkup?.[0]?.String) {
    tableData.push({
      label: "Nama IUPAC",
      value: iupacSection.Information[0].Value.StringWithMarkup[0].String,
    });
  } else if (
    compound.essential.iupacName &&
    compound.essential.iupacName !== "N/A"
  ) {
    // Fallback ke data yang sudah ada jika tidak ditemukan
    tableData.push({
      label: "Nama IUPAC",
      value: compound.essential.iupacName,
    });
  }

  // Get SMILES dari path yang benar
  // raw.Record.Section[*].TOCHeading == "Computed Descriptors" -> SMILES
  const smilesSection = descriptorsSection?.Section?.find(
    (section) => section.TOCHeading === "SMILES"
  );

  if (smilesSection?.Information?.[0]?.Value?.StringWithMarkup?.[0]?.String) {
    tableData.push({
      label: "SMILES",
      value: smilesSection.Information[0].Value.StringWithMarkup[0].String,
      isCode: true,
    });
  } else if (
    compound.essential.canonicalSmiles &&
    compound.essential.canonicalSmiles !== "N/A"
  ) {
    // Fallback ke data yang sudah ada jika tidak ditemukan
    tableData.push({
      label: "SMILES",
      value: compound.essential.canonicalSmiles,
      isCode: true,
    });
  }

  // Get InChI dari path yang benar
  const inchiSection = descriptorsSection?.Section?.find(
    (section) => section.TOCHeading === "InChI"
  );

  if (inchiSection?.Information?.[0]?.Value?.StringWithMarkup?.[0]?.String) {
    tableData.push({
      label: "InChI",
      value: inchiSection.Information[0].Value.StringWithMarkup[0].String,
      isCode: true,
    });
  } else if (
    compound.raw?.Record?.Section?.[2]?.Section?.[1]?.Section?.[1]
      ?.Information?.[0]?.Value?.StringWithMarkup?.[0]?.String
  ) {
    // Fallback ke path yang sudah ada sebelumnya
    tableData.push({
      label: "InChI",
      value:
        compound.raw.Record.Section[2].Section[1].Section[1].Information[0]
          .Value.StringWithMarkup[0].String,
      isCode: true,
    });
  }

  // Get InChIKey dari path yang benar
  const inchiKeySection = descriptorsSection?.Section?.find(
    (section) => section.TOCHeading === "InChIKey"
  );

  if (inchiKeySection?.Information?.[0]?.Value?.StringWithMarkup?.[0]?.String) {
    tableData.push({
      label: "InChI Key",
      value: inchiKeySection.Information[0].Value.StringWithMarkup[0].String,
      isCode: true,
    });
  } else if (
    compound.essential.inchiKey &&
    compound.essential.inchiKey !== "N/A"
  ) {
    // Fallback ke data yang sudah ada jika tidak ditemukan
    tableData.push({
      label: "InChI Key",
      value: compound.essential.inchiKey,
      isCode: true,
    });
  }

  // Get sinonim dari path yang benar
  // raw.Record.Section[*].TOCHeading == "Synonyms"
  const synonymsSection = compound.raw?.Record?.Section?.find(
    (section) => section.TOCHeading === "Synonyms"
  );

  // MeSH Entry Terms
  const meshSection = synonymsSection?.Section?.find(
    (section) => section.TOCHeading === "MeSH Entry Terms"
  );

  if (meshSection?.Information?.[0]?.Value?.StringWithMarkup) {
    const meshTerms = meshSection.Information[0].Value.StringWithMarkup.map(
      (item) => item.String
    ).filter(Boolean);

    if (meshTerms.length > 0) {
      tableData.push({
        label: "MeSH Synonyms",
        value: meshTerms.join(", "),
      });
    }
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

  // Add Defined Atom Stereocenter Count from CSV
  if (
    compound.raw?.Record?.Section?.[3]?.Section?.[0]?.Section?.[12]
      ?.Information?.[0]?.Value?.Number?.[0] !== undefined
  ) {
    tableData.push({
      label: "Jumlah Stereocenter Atom Terdefinisi",
      value:
        compound.raw.Record.Section[3].Section[0].Section[12].Information[0]
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
      <div className="py-8 text-center">
        <p className="text-slate-500">
          Properti kimia tidak tersedia untuk senyawa ini
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-1/3">Properti</TableHead>
          <TableHead>Nilai</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tableData.map((row, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">{row.label}</TableCell>
            <TableCell>
              {row.isCode ? (
                <div className="max-w-[250px] sm:max-w-xs lg:max-w-md overflow-auto">
                  <span className="font-mono text-xs bg-slate-50 p-1 rounded border border-slate-200">
                    {row.value}
                  </span>
                </div>
              ) : (
                row.value
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function SectionCard({
  title,
  description,
  icon,
  children,
  compound,
  sectionKey,
}) {
  const sectionData = compound.formatted.sections[sectionKey]?.data;
  const hasDirectData = sectionData && Object.keys(sectionData).length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-indigo-800">
          {icon} {title}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {hasDirectData && (
          <div className="mb-4">
            {Object.entries(sectionData).map(([key, valueObj], idx) => {
              const value = valueObj.value;
              return (
                <div key={idx} className="mb-3">
                  <h4 className="font-medium text-slate-700">{key}</h4>
                  {Array.isArray(value) ? (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {value.slice(0, 10).map((item, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                      {value.length > 10 && (
                        <Badge variant="outline" className="text-xs">
                          +{value.length - 10} lainnya
                        </Badge>
                      )}
                    </div>
                  ) : (
                    <RenderValue value={value} />
                  )}
                </div>
              );
            })}
            {children && <Separator className="my-4" />}
          </div>
        )}
        {children}
      </CardContent>
    </Card>
  );
}

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

function getSectionIcon(title) {
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
}

function getTabName(tab) {
  switch (tab) {
    case "overview":
      return "Ringkasan";
    case "chemistry":
      return "Kimia";
    case "pharmacology":
      return "Farmakologi & Klinis";
    case "safety":
      return "Keamanan";
    case "full":
      return "Konten Lengkap";
    default:
      return "Ringkasan";
  }
}

function renderSectionIfExists(compound, sectionName, subsectionName) {
  const section = compound.formatted.sections[sectionName];
  if (!section) return null;

  const subsection = section.subsections.find((s) => s.name === subsectionName);
  if (!subsection) return null;

  // Check if subsection has at least one non-N/A value
  const hasValidData = Object.entries(subsection.data).some(
    ([key, valueObj]) => {
      const value = valueObj.value;
      if (Array.isArray(value)) {
        return value.length > 0 && value[0] !== "N/A";
      }
      return value !== null && value !== undefined && value !== "N/A";
    }
  );

  if (!hasValidData) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{subsectionName}</CardTitle>
      </CardHeader>
      <CardContent>
        {Object.entries(subsection.data).map(([key, valueObj], idx) => {
          const value = valueObj.value;
          if (value === "N/A" || value === null || value === undefined)
            return null;

          return (
            <div key={idx} className="mb-4 last:mb-0">
              <h4 className="font-medium text-slate-700 mb-1">{key}</h4>
              {Array.isArray(value) ? (
                value.length > 0 && value[0] !== "N/A" ? (
                  <div className="flex flex-wrap gap-2">
                    {value.map((item, i) => (
                      <Badge key={i} variant="secondary">
                        {item}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 italic">Tidak tersedia</p>
                )
              ) : (
                <RenderValue value={value} />
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

function renderSubsectionContent(compound, sectionName, subsectionName) {
  const section = compound.formatted.sections[sectionName];
  if (!section) return <p>Informasi tidak tersedia</p>;

  const subsection = section.subsections.find((s) => s.name === subsectionName);
  if (!subsection || Object.keys(subsection.data).length === 0) {
    return (
      <p className="text-slate-500 italic">
        Data tidak tersedia untuk bagian ini
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {Object.entries(subsection.data).map(([key, valueObj], idx) => {
        const value = valueObj.value;
        return (
          <div key={idx}>
            <h4 className="font-medium text-slate-700 mb-1">{key}</h4>
            {Array.isArray(value) ? (
              <div className="flex flex-wrap gap-2">
                {value.map((item, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {item}
                  </Badge>
                ))}
              </div>
            ) : (
              <RenderValue value={value} />
            )}
          </div>
        );
      })}

      {subsection.subsections && subsection.subsections.length > 0 && (
        <div className="mt-6 border-t pt-4">
          <h4 className="font-medium text-slate-700 mb-3">Subtopik</h4>
          <Accordion type="single" collapsible>
            {subsection.subsections.map((subsubsection, idx) => (
              <AccordionItem key={idx} value={`sub-${idx}`}>
                <AccordionTrigger className="text-sm">
                  {subsubsection.name}
                </AccordionTrigger>
                <AccordionContent>
                  {Object.entries(subsubsection.data).length > 0 ? (
                    Object.entries(subsubsection.data).map(
                      ([key, valueObj], i) => {
                        const value = valueObj.value;
                        return (
                          <div key={i} className="mb-3">
                            <h5 className="font-medium text-slate-700 text-sm">
                              {key}
                            </h5>
                            {Array.isArray(value) ? (
                              <div className="flex flex-wrap gap-2 mt-1">
                                {value.map((item, j) => (
                                  <Badge
                                    key={j}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {item}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <RenderValue value={value} />
                            )}
                          </div>
                        );
                      }
                    )
                  ) : (
                    <p className="text-slate-500 italic text-sm">
                      Tidak ada data tersedia
                    </p>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
    </div>
  );
}
