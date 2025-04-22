"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MdInfo, MdBiotech, MdCategory, MdScience } from "react-icons/md";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function TargetInfo({ target }) {
  // Format dates if available
  const formatDate = (dateStr) => {
    if (!dateStr) return "Tidak tersedia";

    try {
      // Handle different date formats (YYYY/MM/DD or ISO)
      const parts = dateStr.includes("/")
        ? dateStr.split("/")
        : dateStr.split("-");

      if (parts.length < 3) return dateStr;

      const date = new Date(
        parseInt(parts[0]),
        parseInt(parts[1]) - 1, // Month is 0-based
        parseInt(parts[2])
      );

      return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(date);
    } catch (e) {
      return dateStr; // Return original if parsing fails
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <section>
        <div className="flex items-center gap-2 mb-4">
          <MdInfo className="h-5 w-5 text-indigo-500" />
          <h3 className="text-lg font-semibold">Informasi Dasar</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <InfoCard label="Akses" value={target.accession} />
          <InfoCard
            label="Versi"
            value={target.accessionVersion || target.version || "1"}
          />
          <InfoCard
            label="Panjang"
            value={`${target.length || 0} asam amino`}
          />
          <InfoCard
            label="Tipe Molekul"
            value={translateMoleculeType(target.moleculeType)}
          />
          <InfoCard
            label="Terakhir Diperbarui"
            value={formatDate(target.updateDate)}
          />
          <InfoCard label="Dibuat" value={formatDate(target.createDate)} />
          {target.uniprotId && (
            <InfoCard
              label="ID UniProt"
              value={
                <a
                  href={`https://www.uniprot.org/uniprotkb/${target.uniprotId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline"
                >
                  {target.uniprotId}
                </a>
              }
            />
          )}
          {target.geneName && (
            <InfoCard label="Nama Gen" value={target.geneName} />
          )}
        </div>
      </section>

      <Separator />

      <section className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <MdBiotech className="h-5 w-5 text-indigo-500" />
          <h3 className="text-lg font-semibold">Taksonomi</h3>
        </div>
        <Card className="overflow-hidden border transition-all hover:shadow-md">
          <CardContent className="p-5 bg-gradient-to-r from-slate-50 to-blue-50">
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-1">
                Organisme:
              </h4>
              <p className="text-base text-gray-900">
                {target.organism || "Tidak tersedia"}
              </p>
            </div>

            {target.taxId && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-1">
                  ID Taksonomi:
                </h4>
                <a
                  href={`https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=${target.taxId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline"
                >
                  {target.taxId}
                </a>
              </div>
            )}

            {target.taxonomy && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Garis Taksonomi:
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {target.taxonomy.split(";").map((item, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-100 text-xs hover:bg-blue-100 transition-colors"
                    >
                      {item.trim()}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <Separator />

      <section className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <MdScience className="h-5 w-5 text-indigo-500" />
          <h3 className="text-lg font-semibold">Fungsi & Deskripsi</h3>
        </div>
        <Card className="overflow-hidden bg-gradient-to-br from-indigo-50 to-white border-indigo-100 hover:shadow-lg transition-all">
          <CardContent className="p-5">
            {target.function ? (
              <p className="text-gray-800 leading-relaxed">{target.function}</p>
            ) : (
              <p className="text-gray-500 italic">
                Tidak ada informasi fungsi spesifik yang tersedia
              </p>
            )}

            {target.keywords && target.keywords.length > 0 && (
              <div className="mt-5">
                <h4 className="text-sm font-medium text-indigo-800 mb-2">
                  Kata Kunci:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {target.keywords.map((keyword, index) => (
                    <Badge
                      key={index}
                      className="bg-indigo-100 text-indigo-800 border-indigo-200 hover:bg-indigo-200"
                    >
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {target.geneId && (
        <>
          <Separator />
          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <MdCategory className="h-5 w-5 text-indigo-500" />
              <h3 className="text-lg font-semibold">Informasi Gen</h3>
            </div>
            <Card className="overflow-hidden bg-gradient-to-br from-green-50 to-white border-green-100 hover:shadow-lg transition-all">
              <CardContent className="p-5">
                <h4 className="text-sm font-medium text-green-800 mb-2">
                  Gen Terkait:
                </h4>
                <div className="flex items-center gap-2">
                  <a
                    href={`https://www.ncbi.nlm.nih.gov/gene/${target.geneId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:underline font-medium"
                  >
                    ID Gen: {target.geneId}
                  </a>
                  {target.geneName && (
                    <Badge
                      variant="outline"
                      className="bg-green-100 border-green-200"
                    >
                      {target.geneName}
                    </Badge>
                  )}
                </div>

                <Accordion type="single" collapsible className="mt-4">
                  <AccordionItem value="gene-details">
                    <AccordionTrigger className="text-sm text-green-800">
                      Lihat Detail Gen
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-gray-700 mb-2">
                        Gen ini terkait dengan protein {target.name} dan
                        berperan dalam proses biologis yang relevan. Untuk
                        informasi lebih lanjut tentang gen ini termasuk
                        struktur, ekspresi, dan variasi, silakan kunjungi situs
                        NCBI Gene Database.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 bg-green-50 text-green-800 border-green-200 hover:bg-green-100"
                        asChild
                      >
                        <a
                          href={`https://www.ncbi.nlm.nih.gov/gene/${target.geneId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Jelajahi di NCBI Gene
                        </a>
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </section>
        </>
      )}
    </div>
  );
}

function InfoCard({ label, value }) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-4 bg-gradient-to-r from-slate-50 to-indigo-50">
        <p className="text-xs text-gray-500 mb-1">{label}</p>
        <div className="font-medium text-gray-900">
          {value || "Tidak tersedia"}
        </div>
      </CardContent>
    </Card>
  );
}

function Button({ children, className, asChild, variant, size }) {
  const Component = asChild ? "a" : "button";
  return (
    <Component
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors 
        ${variant === "outline" ? "border border-input bg-background hover:bg-accent hover:text-accent-foreground" : "bg-primary text-primary-foreground hover:bg-primary/90"} 
        ${size === "sm" ? "h-8 px-3 text-xs" : "h-10 py-2 px-4"} 
        ${className}`}
    >
      {children}
    </Component>
  );
}

function translateMoleculeType(type) {
  const translations = {
    aa: "Asam Amino",
    DNA: "DNA",
    RNA: "RNA",
    protein: "Protein",
  };

  return translations[type] || type;
}
