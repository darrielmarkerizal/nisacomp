"use client";

import Link from "next/link";
import {
  MdArrowBack,
  MdOutlineBiotech,
  MdOpenInNew,
  MdFavorite,
  MdShare,
  MdSave,
} from "react-icons/md";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";

export default function TargetHeader({ target }) {
  const [favorited, setFavorited] = useState(false);
  const version = target.accessionVersion?.split(".")?.[1] || target.version;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Data Protein ${target.accession}`,
        text: `Informasi protein ${target.name}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Tautan disalin!",
        description: "Tautan halaman telah disalin ke clipboard.",
      });
    }
  };

  const handleSave = () => {
    toast({
      title: "Menyimpan data",
      description: "Menyimpan data protein untuk akses offline.",
    });
    // Implementasi fungsi menyimpan data
  };

  return (
    <Card className="overflow-hidden border shadow-md bg-gradient-to-r from-indigo-50 to-cyan-50">
      <CardContent className="p-5 md:p-6">
        <div className="flex justify-between items-start mb-4">
          <Link
            href="/target"
            className="inline-flex items-center text-gray-600 text-sm hover:text-gray-900 transition-colors"
          >
            <MdArrowBack className="mr-1.5 h-4 w-4" />
            <span>Kembali ke Daftar Target</span>
          </Link>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-8 w-8 text-gray-500 hover:text-blue-500"
              onClick={handleShare}
            >
              <MdShare className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-8 w-8 text-gray-500 hover:text-green-500"
              onClick={handleSave}
            >
              <MdSave className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 md:items-start">
          <div className="p-3 bg-gradient-to-br from-indigo-100 to-blue-200 rounded-full flex-shrink-0 shadow-sm">
            <MdOutlineBiotech className="text-indigo-600 h-7 w-7" />
          </div>

          <div className="space-y-4 flex-1">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                {target.name}
              </h1>

              <div className="flex flex-wrap items-center gap-2 mt-2">
                <Badge
                  variant="outline"
                  className="bg-indigo-50 text-indigo-700 border-indigo-200 font-medium"
                >
                  {target.accession}
                </Badge>

                {version && (
                  <Badge variant="secondary" className="text-xs">
                    v{version}
                  </Badge>
                )}

                {target.organism && (
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mx-1">•</span>
                    <span className="text-sm text-gray-600 font-medium">
                      {target.organism}
                    </span>
                  </div>
                )}

                {target.geneName && (
                  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200">
                    {target.geneName}
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 bg-white/80 backdrop-blur-sm"
                      asChild
                    >
                      <a
                        href={`https://www.ncbi.nlm.nih.gov/protein/${target.accession}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MdOpenInNew className="mr-1.5 h-3.5 w-3.5" />
                        NCBI
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Lihat di NCBI Protein</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {target.uniprotId && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 bg-white/80 backdrop-blur-sm"
                        asChild
                      >
                        <a
                          href={`https://www.uniprot.org/uniprotkb/${target.uniprotId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <MdOpenInNew className="mr-1.5 h-3.5 w-3.5" />
                          UniProt
                        </a>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Lihat di UniProt ({target.uniprotId})</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

              {target.geneId && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 bg-white/80 backdrop-blur-sm"
                        asChild
                      >
                        <a
                          href={`https://www.ncbi.nlm.nih.gov/gene/${target.geneId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <MdOpenInNew className="mr-1.5 h-3.5 w-3.5" />
                          ID Gen: {target.geneId}
                        </a>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Lihat gen terkait di NCBI</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

              {target.taxId && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 bg-white/80 backdrop-blur-sm"
                        asChild
                      >
                        <a
                          href={`https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=${target.taxId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <MdOpenInNew className="mr-1.5 h-3.5 w-3.5" />
                          Taksonomi
                        </a>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Lihat informasi taksonomi (ID: {target.taxId})</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
