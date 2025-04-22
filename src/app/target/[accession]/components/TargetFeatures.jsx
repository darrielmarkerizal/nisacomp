"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MdOutlineFilterList, MdSearch } from "react-icons/md";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export default function TargetFeatures({ target }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);

  // Group features by type for better organization
  const featuresByType = target.features.reduce((acc, feature) => {
    const type = feature.key;
    if (!acc[type]) acc[type] = [];
    acc[type].push(feature);
    return acc;
  }, {});

  // Get all unique feature types
  const featureTypes = Object.keys(featuresByType);

  // Filter features based on search term and selected types
  const filteredFeatureTypes = featureTypes.filter((type) => {
    // Filter by selected types if any are selected
    if (selectedTypes.length > 0 && !selectedTypes.includes(type)) {
      return false;
    }

    // Filter by search term
    if (searchTerm === "") return true;
    if (type.toLowerCase().includes(searchTerm.toLowerCase())) return true;

    // Also check if any feature description contains the search term
    return featuresByType[type].some((feature) => {
      const descriptions = feature.qualifiers?.description || [];
      return descriptions.some((desc) =>
        desc.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  });

  // Toggle type selection
  const toggleTypeSelection = (type) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  // Translate feature type
  const translateFeatureType = (type) => {
    const translations = {
      Chain: "Rantai",
      Domain: "Domain",
      Region: "Wilayah",
      Motif: "Motif",
      "Binding site": "Situs Pengikatan",
      "Active site": "Situs Aktif",
      Signal: "Sinyal",
      Propeptide: "Propeptida",
      "Disulfide bond": "Ikatan Disulfida",
      Glycosylation: "Glikosilasi",
      Lipidation: "Lipidasi",
      "Modified residue": "Residu Termodifikasi",
    };

    return translations[type] || type;
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h3 className="text-lg font-semibold mb-2">Fitur Protein</h3>
        <p className="text-sm text-gray-600">
          {target.features.length
            ? `${target.features.length} fitur teridentifikasi dalam ${Object.keys(featuresByType).length} kategori`
            : "Tidak ada data fitur tersedia"}
        </p>
      </div>

      {target.features.length > 0 ? (
        <>
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Cari fitur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <MdOutlineFilterList className="h-4 w-4" />
                  <span>Filter</span>
                  {selectedTypes.length > 0 && (
                    <Badge className="ml-1 bg-indigo-500 text-white">
                      {selectedTypes.length}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-60">
                <h4 className="font-medium mb-2">Filter berdasarkan tipe</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {featureTypes.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={`filter-${type}`}
                        checked={selectedTypes.includes(type)}
                        onCheckedChange={() => toggleTypeSelection(type)}
                      />
                      <label
                        htmlFor={`filter-${type}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {translateFeatureType(type)} (
                        {featuresByType[type].length})
                      </label>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedTypes([])}
                    className="text-xs"
                  >
                    Hapus filter
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setSelectedTypes(featureTypes)}
                    className="text-xs"
                  >
                    Pilih semua
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {filteredFeatureTypes.length > 0 ? (
            <Accordion type="multiple" className="space-y-2">
              {filteredFeatureTypes.map((type) => (
                <AccordionItem
                  key={type}
                  value={type}
                  className="border rounded-md overflow-hidden bg-white shadow-sm hover:shadow-md transition-all"
                >
                  <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 text-left">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                        {translateFeatureType(type)}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {featuresByType[type].length}{" "}
                        {featuresByType[type].length === 1 ? "entri" : "entri"}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[100px]">Lokasi</TableHead>
                            <TableHead>Deskripsi</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {featuresByType[type].map((feature, index) => {
                            const descriptions =
                              feature.qualifiers?.description || [];

                            return (
                              <TableRow
                                key={`${type}-${index}`}
                                className="hover:bg-gray-50"
                              >
                                <TableCell className="font-mono text-sm">
                                  {feature.location}
                                </TableCell>
                                <TableCell>
                                  {descriptions.length > 0 ? (
                                    <ul className="list-disc list-inside space-y-1">
                                      {descriptions.map((desc, i) => (
                                        <li key={i} className="text-sm">
                                          {desc || "Tidak ada deskripsi"}
                                        </li>
                                      ))}
                                    </ul>
                                  ) : (
                                    <span className="text-gray-500 text-sm">
                                      Tidak ada deskripsi
                                    </span>
                                  )}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-center p-8 bg-gray-50 border rounded-lg">
              <p className="text-gray-600">
                Tidak ada fitur yang cocok dengan "{searchTerm}"
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="text-center p-8 bg-gray-50 border rounded-lg">
          <p className="text-gray-600">Tidak ada data fitur tersedia</p>
        </div>
      )}
    </div>
  );
}
