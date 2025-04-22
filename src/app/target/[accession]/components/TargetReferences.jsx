"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MdOpenInNew, MdSearch, MdFilterAlt, MdSort } from "react-icons/md";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function TargetReferences({ target }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest"); // newest, oldest, az

  const references = target.references || [];

  // Sort references based on selected order
  const sortReferences = (refs) => {
    return [...refs].sort((a, b) => {
      switch (sortOrder) {
        case "newest":
          // Try to extract year from journal string
          const yearA = extractYear(a.journal);
          const yearB = extractYear(b.journal);
          return yearB - yearA; // Descending (newest first)

        case "oldest":
          const yearC = extractYear(a.journal);
          const yearD = extractYear(b.journal);
          return yearC - yearD; // Ascending (oldest first)

        case "az":
          return (a.title || "").localeCompare(b.title || ""); // Alphabetical

        default:
          return 0;
      }
    });
  };

  // Extract year from journal string
  const extractYear = (journalStr) => {
    if (!journalStr) return 0;

    // Look for a 4-digit year in the string
    const yearMatch = journalStr.match(/\b(19|20)\d{2}\b/);
    if (yearMatch) {
      return parseInt(yearMatch[0]);
    }

    // Try to find year in parentheses
    const parensMatch = journalStr.match(/\((\d{4})\)/);
    if (parensMatch) {
      return parseInt(parensMatch[1]);
    }

    return 0;
  };

  // Filter references based on search term
  const filteredReferences = references.filter((ref) => {
    if (searchTerm === "") return true;

    const searchLower = searchTerm.toLowerCase();
    return (
      (ref.title && ref.title.toLowerCase().includes(searchLower)) ||
      (ref.authors && ref.authors.toLowerCase().includes(searchLower)) ||
      (ref.journal && ref.journal.toLowerCase().includes(searchLower)) ||
      (ref.pubmed && ref.pubmed.toString().includes(searchLower))
    );
  });

  // Get the sorted, filtered references
  const sortedAndFilteredReferences = sortReferences(filteredReferences);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h3 className="text-lg font-semibold mb-2">Referensi Literatur</h3>
        <p className="text-sm text-gray-600">
          {references.length
            ? `${references.length} publikasi ilmiah yang mengutip protein ini`
            : "Tidak ada data referensi tersedia"}
        </p>
      </div>

      {references.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1">
            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Cari referensi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <MdSort className="h-4 w-4" />
                <span>Urutkan</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Urutkan berdasarkan</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setSortOrder("newest")}
                className={sortOrder === "newest" ? "bg-slate-100" : ""}
              >
                Terbaru
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSortOrder("oldest")}
                className={sortOrder === "oldest" ? "bg-slate-100" : ""}
              >
                Terlama
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSortOrder("az")}
                className={sortOrder === "az" ? "bg-slate-100" : ""}
              >
                Judul (A-Z)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex items-center text-sm text-gray-500">
            <span>{filteredReferences.length} hasil</span>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {sortedAndFilteredReferences.length > 0 ? (
          sortedAndFilteredReferences.map((ref, index) => (
            <ReferenceCard key={index} reference={ref} />
          ))
        ) : references.length > 0 ? (
          <div className="text-center p-8 bg-gray-50 border rounded-lg">
            <p className="text-gray-600">
              Tidak ada referensi yang cocok dengan "{searchTerm}"
            </p>
          </div>
        ) : (
          <div className="text-center p-8 bg-gray-50 border rounded-lg">
            <p className="text-gray-600">Tidak ada data referensi tersedia</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ReferenceCard({ reference }) {
  const hasPubmed = reference.pubmed && reference.pubmed !== "";

  // Extract year from journal
  const extractYear = (journalStr) => {
    if (!journalStr) return null;

    // Look for a 4-digit year in the string
    const yearMatch = journalStr.match(/\b(19|20)\d{2}\b/);
    if (yearMatch) {
      return yearMatch[0];
    }

    // Try to find year in parentheses
    const parensMatch = journalStr.match(/\((\d{4})\)/);
    if (parensMatch) {
      return parensMatch[1];
    }

    return null;
  };

  const year = extractYear(reference.journal);

  const handleCiteClick = () => {
    // Format citation
    let citation = "";

    if (reference.authors) {
      citation += reference.authors + ". ";
    }

    if (reference.title) {
      citation += `"${reference.title}" `;
    }

    if (reference.journal) {
      citation += reference.journal + ". ";
    }

    if (citation) {
      navigator.clipboard.writeText(citation.trim());
    }
  };

  return (
    <Card className="overflow-hidden border shadow-sm hover:shadow-md transition-shadow bg-white">
      <CardContent className="p-4 sm:p-5">
        <div className="flex justify-between">
          <h3 className="font-medium text-gray-900 mb-2">
            {reference.title || "Referensi tanpa judul"}
          </h3>

          {year && (
            <Badge
              variant="outline"
              className="ml-2 bg-slate-50 text-slate-700"
            >
              {year}
            </Badge>
          )}
        </div>

        {reference.authors && (
          <p className="text-sm text-gray-700 mb-3">{reference.authors}</p>
        )}

        <div className="flex flex-wrap items-center gap-3 mt-4">
          {reference.journal && (
            <Badge variant="outline" className="bg-gray-50">
              {reference.journal}
            </Badge>
          )}

          {hasPubmed && (
            <a
              href={`https://pubmed.ncbi.nlm.nih.gov/${reference.pubmed}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 hover:underline"
            >
              <MdOpenInNew className="h-3 w-3" />
              <span>PMID: {reference.pubmed}</span>
            </a>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="ml-auto text-xs text-gray-600"
            onClick={handleCiteClick}
          >
            Salin Sitasi
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
