"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MdContentCopy,
  MdCheck,
  MdDownload,
  MdZoomIn,
  MdZoomOut,
} from "react-icons/md";

export default function TargetSequence({ target }) {
  const [format, setFormat] = useState("pretty");
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState("normal");
  const [activeTab, setActiveTab] = useState("visualisasi");

  const sequence = target?.sequence || "";

  // Format sequence for display
  const formatSequence = (seq, type) => {
    if (!seq) return "";

    switch (type) {
      case "raw":
        return seq;
      case "fasta":
        return `>${target.accession} ${target.name}\n${formatFasta(seq)}`;
      case "pretty":
      default:
        return formatPretty(seq);
    }
  };

  // Format sequence with line numbers and spaces
  const formatPretty = (seq) => {
    const formatted = [];
    const chunkSize = 10;
    const lineSize = 60;

    for (let i = 0; i < seq.length; i += lineSize) {
      const lineNumber = i + 1;
      const line = seq.substring(i, i + lineSize);
      let formattedLine = "";

      // Add spaces every 10 characters
      for (let j = 0; j < line.length; j += chunkSize) {
        formattedLine += line.substring(j, j + chunkSize) + " ";
      }

      formatted.push(
        <div key={i} className="flex hover:bg-slate-50">
          <span className="w-12 text-right text-gray-500 mr-4 select-none font-mono">
            {lineNumber}
          </span>
          <span className={`font-mono ${getFontSizeClass(fontSize)}`}>
            {formattedLine.trim()}
          </span>
        </div>
      );
    }

    return formatted;
  };

  // Format sequence in FASTA format (60 chars per line)
  const formatFasta = (seq) => {
    let result = "";
    for (let i = 0; i < seq.length; i += 60) {
      result += seq.substring(i, i + 60) + "\n";
    }
    return result.trim();
  };

  // Get font size class based on selected size
  const getFontSizeClass = (size) => {
    switch (size) {
      case "small":
        return "text-xs";
      case "large":
        return "text-base";
      case "xlarge":
        return "text-lg";
      case "normal":
      default:
        return "text-sm";
    }
  };

  // Copy sequence to clipboard
  const handleCopy = () => {
    let textToCopy;

    switch (format) {
      case "raw":
        textToCopy = sequence;
        break;
      case "fasta":
        textToCopy = `>${target.accession} ${target.name}\n${formatFasta(sequence)}`;
        break;
      default:
        textToCopy = sequence;
    }

    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      toast({
        title: "Sekuens disalin!",
        description: `${sequence.length} asam amino disalin ke clipboard.`,
      });
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Download sequence as file
  const handleDownload = () => {
    let content;
    let fileType = "txt";

    switch (format) {
      case "raw":
        content = sequence;
        break;
      case "fasta":
        content = `>${target.accession} ${target.name}\n${formatFasta(sequence)}`;
        fileType = "fasta";
        break;
      default:
        content = sequence;
    }

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${target.accession}.${fileType}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Sekuens diunduh!",
      description: `File ${target.accession}.${fileType} telah diunduh.`,
    });
  };

  // Amino acid visualization options
  const colorByProperty = (seq) => {
    // Define amino acid properties and their colors
    const properties = {
      hydrophobic: ["A", "V", "L", "I", "M", "F", "Y", "W"],
      polar: ["S", "T", "N", "Q"],
      basic: ["K", "R", "H"],
      acidic: ["D", "E"],
      special: ["C", "G", "P"],
    };

    const colors = {
      hydrophobic: "bg-red-100 text-red-900",
      polar: "bg-blue-100 text-blue-900",
      basic: "bg-green-100 text-green-900",
      acidic: "bg-purple-100 text-purple-900",
      special: "bg-yellow-100 text-yellow-900",
      default: "bg-gray-100 text-gray-900",
    };

    // Get property for an amino acid
    const getProperty = (aa) => {
      for (const [property, acids] of Object.entries(properties)) {
        if (acids.includes(aa)) return property;
      }
      return "default";
    };

    // Format amino acids with color based on properties
    const coloredSequence = [];
    const chunkSize = 10;
    const lineSize = 60;

    for (let i = 0; i < seq.length; i += lineSize) {
      const lineNumber = i + 1;
      const line = seq.substring(i, i + lineSize);
      const lineElements = [];

      // Process amino acids
      for (let j = 0; j < line.length; j++) {
        const aa = line[j];
        const property = getProperty(aa);

        lineElements.push(
          <span
            key={j}
            className={`inline-block w-6 h-6 text-center py-0.5 m-0.5 rounded ${colors[property]} ${getFontSizeClass(fontSize)}`}
            title={getAminoAcidName(aa)}
          >
            {aa}
          </span>
        );

        // Add space after every 10 AAs
        if ((j + 1) % chunkSize === 0 && j !== line.length - 1) {
          lineElements.push(<span key={`space-${j}`} className="mr-2"></span>);
        }
      }

      coloredSequence.push(
        <div key={i} className="flex hover:bg-slate-50 py-1">
          <span className="w-12 text-right text-gray-500 mr-4 select-none font-mono">
            {lineNumber}
          </span>
          <div>{lineElements}</div>
        </div>
      );
    }

    return coloredSequence;
  };

  // Get full amino acid name
  const getAminoAcidName = (code) => {
    const names = {
      A: "Alanin",
      R: "Arginin",
      N: "Asparagin",
      D: "Asam Aspartat",
      C: "Sistein",
      E: "Asam Glutamat",
      Q: "Glutamin",
      G: "Glisin",
      H: "Histidin",
      I: "Isoleusin",
      L: "Leusin",
      K: "Lisin",
      M: "Metionin",
      F: "Fenilalanin",
      P: "Prolin",
      S: "Serin",
      T: "Treonin",
      W: "Triptofan",
      Y: "Tirosin",
      V: "Valin",
    };

    return names[code] || code;
  };

  // Render amino acid legend
  const renderLegend = () => {
    const properties = [
      {
        name: "Hidrofobik",
        acids: ["A", "V", "L", "I", "M", "F", "Y", "W"],
        color: "bg-red-100 text-red-900",
      },
      {
        name: "Polar",
        acids: ["S", "T", "N", "Q"],
        color: "bg-blue-100 text-blue-900",
      },
      {
        name: "Basa",
        acids: ["K", "R", "H"],
        color: "bg-green-100 text-green-900",
      },
      {
        name: "Asam",
        acids: ["D", "E"],
        color: "bg-purple-100 text-purple-900",
      },
      {
        name: "Khusus",
        acids: ["C", "G", "P"],
        color: "bg-yellow-100 text-yellow-900",
      },
    ];

    return (
      <div className="flex flex-wrap gap-4 mt-4">
        {properties.map((prop, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded ${prop.color}`}></div>
            <span className="text-sm text-gray-700">
              {prop.name} ({prop.acids.join(", ")})
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h3 className="text-lg font-semibold">Sekuens Protein</h3>
          <p className="text-sm text-gray-600">
            {sequence
              ? `${sequence.length} asam amino`
              : "Tidak ada sekuens tersedia"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-500"
              onClick={() => {
                if (fontSize === "normal") setFontSize("small");
                else if (fontSize === "small") setFontSize("normal");
                else if (fontSize === "large") setFontSize("normal");
                else if (fontSize === "xlarge") setFontSize("large");
              }}
            >
              <MdZoomOut className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-500"
              onClick={() => {
                if (fontSize === "normal") setFontSize("large");
                else if (fontSize === "small") setFontSize("normal");
                else if (fontSize === "large") setFontSize("xlarge");
                else if (fontSize === "xlarge") setFontSize("xlarge");
              }}
            >
              <MdZoomIn className="h-4 w-4" />
            </Button>
          </div>

          <Select value={format} onValueChange={setFormat}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pretty">Rapi</SelectItem>
              <SelectItem value="raw">Mentah</SelectItem>
              <SelectItem value="fasta">FASTA</SelectItem>
            </SelectContent>
          </Select>

          {sequence && (
            <>
              <Button
                variant="outline"
                size="sm"
                className="flex gap-1 items-center"
                onClick={handleCopy}
              >
                {copied ? (
                  <>
                    <MdCheck className="h-4 w-4" />
                    <span>Disalin!</span>
                  </>
                ) : (
                  <>
                    <MdContentCopy className="h-4 w-4" />
                    <span>Salin</span>
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="flex gap-1 items-center"
                onClick={handleDownload}
              >
                <MdDownload className="h-4 w-4" />
                <span>Unduh</span>
              </Button>
            </>
          )}
        </div>
      </div>

      <Separator />

      {sequence ? (
        <>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="mb-4">
              <TabsTrigger value="visualisasi">Visualisasi</TabsTrigger>
              <TabsTrigger value="teks">Teks</TabsTrigger>
            </TabsList>

            <Card className="overflow-hidden border shadow-sm transition-all hover:shadow-md">
              <CardContent className="p-4 overflow-auto bg-white">
                <TabsContent value="visualisasi" className="mt-0">
                  {colorByProperty(sequence)}
                  {renderLegend()}
                </TabsContent>

                <TabsContent value="teks" className="mt-0">
                  <div
                    className={`${format !== "pretty" ? "font-mono whitespace-pre" : ""} ${getFontSizeClass(fontSize)}`}
                  >
                    {formatSequence(sequence, format)}
                  </div>
                </TabsContent>
              </CardContent>
            </Card>
          </Tabs>

          <div className="flex justify-between text-sm text-gray-500">
            <span>Sumber: {target.uniprotId ? "UniProt" : "NCBI"}</span>
            <span>
              Terakhir diperbarui: {target.updateDate || "Tidak diketahui"}
            </span>
          </div>
        </>
      ) : (
        <div className="text-center p-8 bg-gray-50 border rounded-lg">
          <p className="text-gray-600">Tidak ada data sekuens tersedia</p>
        </div>
      )}
    </div>
  );
}
