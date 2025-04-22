"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  MdArrowBack,
  MdOutlineBiotech,
  MdOutlineScience,
  MdPeople,
  MdOutlineDescription,
  MdKeyboardArrowDown,
  MdInfo,
  MdTimeline,
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import BioassayDetailSkeleton from "./BioassayDetailSkeleton";

export default function BioassayDetail({ aid }) {
  const [bioassayData, setBioassayData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fullData, setFullData] = useState(null);

  useEffect(() => {
    const fetchBioassayDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `/api/obat/bioactivity/${aid}?aid=${aid}`
        );
        setBioassayData(response.data);

        // Jika ada rawData, simpan untuk tampilan data lengkap
        if (response.data.rawData) {
          setFullData(response.data.rawData);
        }
      } catch (err) {
        console.error("Error fetching bioassay detail:", err);
        setError(
          err.message || "Terjadi kesalahan saat mengambil data bioassay"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBioassayDetail();
  }, [aid]);

  if (loading) {
    return <BioassayDetailSkeleton />;
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!bioassayData) {
    return (
      <Alert className="mb-4">
        <AlertTitle>Tidak Ditemukan</AlertTitle>
        <AlertDescription>
          Data bioassay dengan AID {aid} tidak ditemukan
        </AlertDescription>
      </Alert>
    );
  }

  // Format tanggal jika tersedia
  const formattedDate = bioassayData.lastChange
    ? format(
        new Date(
          bioassayData.lastChange.year,
          bioassayData.lastChange.month - 1,
          bioassayData.lastChange.day
        ),
        "dd MMMM yyyy",
        { locale: id }
      )
    : "Tidak tersedia";

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Section - Improved for Mobile */}
      <div className="bg-white p-3 sm:p-4 rounded-lg border border-slate-200 shadow-sm">
        <Link
          href="/drug-info"
          className="inline-flex items-center text-slate-600 text-xs sm:text-sm hover:text-slate-900"
        >
          <MdArrowBack className="mr-1.5 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span>Kembali ke Daftar Obat</span>
        </Link>

        <div className="mt-2 sm:mt-3">
          <div className="flex items-start gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-green-50 rounded-full flex-shrink-0 mt-0.5">
              <MdOutlineBiotech className="text-green-600 h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-bold text-slate-900 leading-tight">
                {bioassayData.name}
              </h1>
              <div className="flex flex-wrap items-center gap-1.5 mt-1">
                <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                  AID: {aid}
                </Badge>
                <span className="text-xs sm:text-sm text-slate-500">•</span>
                <p className="text-xs sm:text-sm text-slate-500">
                  Diperbarui: {formattedDate}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Left Section - Stats Card */}
        <div className="order-2 lg:order-1 lg:col-span-1">
          <div className="space-y-4 sm:space-y-6 sticky top-4">
            <Card>
              <CardHeader className="pb-2 sm:pb-3">
                <CardTitle className="text-sm sm:text-base flex items-center">
                  <MdTimeline className="mr-1.5 text-slate-600" />
                  Statistik Pengujian
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 pt-0">
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-green-50 border border-green-100 rounded-md text-center">
                    <p className="text-[10px] sm:text-xs text-green-700">
                      Total Substansi
                    </p>
                    <p className="text-base sm:text-xl font-bold text-green-800">
                      {bioassayData.stats?.sidCountAll?.toLocaleString() || "0"}
                    </p>
                  </div>
                  <div className="p-2 bg-green-100 border border-green-200 rounded-md text-center">
                    <p className="text-[10px] sm:text-xs text-green-700">
                      Substansi Aktif
                    </p>
                    <p className="text-base sm:text-xl font-bold text-green-800">
                      {bioassayData.stats?.sidCountActive?.toLocaleString() ||
                        "0"}
                    </p>
                  </div>
                  <div className="p-2 bg-slate-50 border border-slate-100 rounded-md text-center">
                    <p className="text-[10px] sm:text-xs text-slate-700">
                      Total Senyawa
                    </p>
                    <p className="text-base sm:text-xl font-bold text-slate-800">
                      {bioassayData.stats?.cidCountAll?.toLocaleString() || "0"}
                    </p>
                  </div>
                  <div className="p-2 bg-slate-100 border border-slate-200 rounded-md text-center">
                    <p className="text-[10px] sm:text-xs text-slate-700">
                      Senyawa Aktif
                    </p>
                    <p className="text-base sm:text-xl font-bold text-slate-800">
                      {bioassayData.stats?.cidCountActive?.toLocaleString() ||
                        "0"}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-medium text-slate-700 mb-1.5">
                    Persentase Keaktifan
                  </h3>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{
                        width: `${(bioassayData.stats?.sidCountActive / bioassayData.stats?.sidCountAll) * 100 || 0}%`,
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1 text-[10px] sm:text-xs text-slate-500">
                    <span>
                      {(
                        (bioassayData.stats?.sidCountActive /
                          bioassayData.stats?.sidCountAll) *
                          100 || 0
                      ).toFixed(2)}
                      % aktif
                    </span>
                    <span>
                      {(
                        (bioassayData.stats?.sidCountInactive /
                          bioassayData.stats?.sidCountAll) *
                          100 || 0
                      ).toFixed(2)}
                      % tidak aktif
                    </span>
                  </div>
                </div>

                <Separator className="my-1 sm:my-2" />

                <div>
                  <h3 className="text-xs font-medium text-slate-700 mb-1.5">
                    Sumber Data
                  </h3>
                  <div className="bg-slate-50 p-2 rounded-md text-xs">
                    <p className="font-medium text-slate-800">
                      {bioassayData.sourceName}
                    </p>
                    {bioassayData.sourceID && (
                      <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5">
                        ID: {bioassayData.sourceID}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Target Card */}
            <Card>
              <CardHeader className="pb-2 sm:pb-3">
                <CardTitle className="text-sm sm:text-base flex items-center">
                  <MdPeople className="mr-1.5 text-slate-600" />
                  Target Molekul
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {bioassayData.targets && bioassayData.targets.length > 0 ? (
                  <ul className="space-y-2">
                    {bioassayData.targets.map((target, index) => (
                      <li
                        key={index}
                        className="bg-indigo-50 border border-indigo-100 p-2 sm:p-2.5 rounded-md"
                      >
                        <span className="font-medium text-xs sm:text-sm text-indigo-700">
                          {target.name}
                        </span>
                        {target.accession && (
                          <span className="text-[10px] sm:text-xs text-indigo-600 block mt-0.5">
                            Accession: {target.accession}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-500 italic">
                    Tidak ada target yang terdeteksi
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Method Card */}
            <Card>
              <CardHeader className="pb-2 sm:pb-3">
                <CardTitle className="text-sm sm:text-base flex items-center">
                  <MdOutlineScience className="mr-1.5 text-slate-600" />
                  Metode
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <Badge className="bg-green-50 text-green-800 hover:bg-green-100 border border-green-200 text-xs">
                  {bioassayData.method || "Tidak tersedia"}
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Section - Main Content */}
        <div className="order-1 lg:order-2 lg:col-span-3">
          <Card className="mb-4 sm:mb-6">
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="text-base sm:text-lg flex items-center">
                <MdOutlineDescription className="mr-1.5 text-slate-600" />
                Informasi Bioassay
              </CardTitle>
              <CardDescription>
                Detail lengkap mengenai bioassay dan protokol pengujian
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="overview" className="text-xs sm:text-sm">
                    Ringkasan
                  </TabsTrigger>
                  <TabsTrigger value="protocol" className="text-xs sm:text-sm">
                    Protokol
                  </TabsTrigger>
                  <TabsTrigger value="fulldata" className="text-xs sm:text-sm">
                    Data Lengkap
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="description">
                      <AccordionTrigger className="text-sm sm:text-base font-medium py-2">
                        Deskripsi
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="bg-slate-50 p-2.5 sm:p-3 rounded-md text-xs sm:text-sm text-slate-700 whitespace-pre-line">
                          {bioassayData.description ||
                            "Tidak ada deskripsi tersedia"}
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="technical">
                      <AccordionTrigger className="text-sm sm:text-base font-medium py-2">
                        Informasi Teknis
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-1">
                          <div className="bg-slate-50 p-2 sm:p-3 rounded-md">
                            <p className="text-[10px] sm:text-xs text-slate-500">
                              Versi
                            </p>
                            <p className="text-xs sm:text-sm font-medium text-slate-800">
                              {bioassayData.version || "N/A"}
                            </p>
                          </div>
                          <div className="bg-slate-50 p-2 sm:p-3 rounded-md">
                            <p className="text-[10px] sm:text-xs text-slate-500">
                              Revisi
                            </p>
                            <p className="text-xs sm:text-sm font-medium text-slate-800">
                              {bioassayData.revision || "N/A"}
                            </p>
                          </div>
                          <div className="bg-slate-50 p-2 sm:p-3 rounded-md">
                            <p className="text-[10px] sm:text-xs text-slate-500">
                              Jumlah TID
                            </p>
                            <p className="text-xs sm:text-sm font-medium text-slate-800">
                              {bioassayData.numberOfTIDs || "N/A"}
                            </p>
                          </div>
                          <div className="bg-slate-50 p-2 sm:p-3 rounded-md">
                            <p className="text-[10px] sm:text-xs text-slate-500">
                              Memiliki Skor
                            </p>
                            <p className="text-xs sm:text-sm font-medium text-slate-800">
                              {bioassayData.hasScore ? "Ya" : "Tidak"}
                            </p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </TabsContent>

                <TabsContent value="protocol" className="space-y-4">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="protocol">
                      <AccordionTrigger className="text-sm sm:text-base font-medium py-2">
                        Protokol Pengujian
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="bg-slate-50 p-2.5 sm:p-3 rounded-md text-xs sm:text-sm text-slate-700 whitespace-pre-line">
                          {bioassayData.protocol || "Protokol tidak tersedia"}
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {bioassayData.comment && (
                      <AccordionItem value="comments">
                        <AccordionTrigger className="text-sm sm:text-base font-medium py-2">
                          Catatan dan Komentar
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="bg-slate-50 p-2.5 sm:p-3 rounded-md text-xs sm:text-sm text-slate-700 whitespace-pre-line">
                            {bioassayData.comment}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}
                  </Accordion>
                </TabsContent>

                <TabsContent value="fulldata" className="space-y-4">
                  <Alert>
                    <MdInfo className="h-4 w-4" />
                    <AlertTitle className="text-xs sm:text-sm">
                      Data Selengkapnya
                    </AlertTitle>
                    <AlertDescription className="text-xs">
                      Berikut adalah data lengkap dari bioassay ini dalam format
                      yang lebih mudah dibaca.
                    </AlertDescription>
                  </Alert>

                  <Accordion type="single" collapsible className="w-full">
                    {fullData ? (
                      <>
                        <AccordionItem value="basic-info">
                          <AccordionTrigger className="text-sm sm:text-base font-medium py-2">
                            Informasi Dasar
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="bg-slate-50 rounded-md overflow-hidden border border-slate-200">
                              <table className="w-full text-xs">
                                <tbody>
                                  <tr className="border-b border-slate-200">
                                    <td className="px-3 py-2 bg-slate-100 font-medium">
                                      ID Bioassay (AID)
                                    </td>
                                    <td className="px-3 py-2">
                                      {bioassayData.aid || "-"}
                                    </td>
                                  </tr>
                                  <tr className="border-b border-slate-200">
                                    <td className="px-3 py-2 bg-slate-100 font-medium">
                                      Nama
                                    </td>
                                    <td className="px-3 py-2">
                                      {bioassayData.name || "-"}
                                    </td>
                                  </tr>
                                  <tr className="border-b border-slate-200">
                                    <td className="px-3 py-2 bg-slate-100 font-medium">
                                      Sumber
                                    </td>
                                    <td className="px-3 py-2">
                                      {bioassayData.sourceName || "-"}
                                    </td>
                                  </tr>
                                  <tr className="border-b border-slate-200">
                                    <td className="px-3 py-2 bg-slate-100 font-medium">
                                      ID Sumber
                                    </td>
                                    <td className="px-3 py-2">
                                      {bioassayData.sourceID || "-"}
                                    </td>
                                  </tr>
                                  <tr className="border-b border-slate-200">
                                    <td className="px-3 py-2 bg-slate-100 font-medium">
                                      Metode
                                    </td>
                                    <td className="px-3 py-2">
                                      {bioassayData.method || "-"}
                                    </td>
                                  </tr>
                                  <tr className="border-b border-slate-200">
                                    <td className="px-3 py-2 bg-slate-100 font-medium">
                                      Versi
                                    </td>
                                    <td className="px-3 py-2">
                                      {bioassayData.version || "-"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="px-3 py-2 bg-slate-100 font-medium">
                                      Terakhir Diperbarui
                                    </td>
                                    <td className="px-3 py-2">
                                      {formattedDate}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="descriptions-detail">
                          <AccordionTrigger className="text-sm sm:text-base font-medium py-2">
                            Deskripsi Lengkap
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="bg-slate-50 p-3 sm:p-4 rounded-md text-xs sm:text-sm text-slate-700 border border-slate-200">
                              {fullData.AssaySummaries?.AssaySummary?.[0]
                                ?.Description ? (
                                <div className="space-y-3">
                                  {fullData.AssaySummaries?.AssaySummary[0]?.Description.map(
                                    (paragraph, idx) => (
                                      <p
                                        key={idx}
                                        className={
                                          paragraph
                                            ? ""
                                            : "text-slate-400 italic"
                                        }
                                      >
                                        {paragraph || "Paragraf kosong"}
                                      </p>
                                    )
                                  )}
                                </div>
                              ) : (
                                <p className="text-slate-400 italic">
                                  Tidak ada data deskripsi yang tersedia
                                </p>
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="protocol-detail">
                          <AccordionTrigger className="text-sm sm:text-base font-medium py-2">
                            Protokol Lengkap
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="bg-slate-50 p-3 sm:p-4 rounded-md text-xs sm:text-sm text-slate-700 border border-slate-200">
                              {fullData.AssaySummaries?.AssaySummary?.[0]
                                ?.Protocol ? (
                                <div className="space-y-2">
                                  <h4 className="font-medium text-slate-800 mb-1">
                                    Tahapan Protokol:
                                  </h4>
                                  <ol className="list-decimal list-inside space-y-2 pl-1">
                                    {fullData.AssaySummaries?.AssaySummary[0]?.Protocol.map(
                                      (step, idx) => (
                                        <li
                                          key={idx}
                                          className={
                                            step ? "" : "text-slate-400 italic"
                                          }
                                        >
                                          {step || "Langkah tidak terdefinisi"}
                                        </li>
                                      )
                                    )}
                                  </ol>
                                </div>
                              ) : (
                                <p className="text-slate-400 italic">
                                  Tidak ada data protokol yang tersedia
                                </p>
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="comment-detail">
                          <AccordionTrigger className="text-sm sm:text-base font-medium py-2">
                            Catatan dan Komentar
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="bg-slate-50 p-3 sm:p-4 rounded-md text-xs sm:text-sm text-slate-700 border border-slate-200">
                              {fullData.AssaySummaries?.AssaySummary?.[0]
                                ?.Comment ? (
                                <div className="space-y-3">
                                  {fullData.AssaySummaries?.AssaySummary[0]?.Comment.map(
                                    (comment, idx) => (
                                      <p
                                        key={idx}
                                        className={
                                          comment ? "" : "text-slate-400 italic"
                                        }
                                      >
                                        {comment || "Komentar kosong"}
                                      </p>
                                    )
                                  )}
                                </div>
                              ) : (
                                <p className="text-slate-400 italic">
                                  Tidak ada data komentar yang tersedia
                                </p>
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="stats-detail">
                          <AccordionTrigger className="text-sm sm:text-base font-medium py-2">
                            Statistik Lengkap
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-3">
                              {/* Statistik Substansi */}
                              <div>
                                <h4 className="text-xs font-medium text-slate-700 mb-2 pl-1">
                                  Statistik Substansi (SID)
                                </h4>
                                <div className="bg-slate-50 rounded-lg overflow-hidden border border-slate-200">
                                  <div className="grid grid-cols-2 text-xs divide-x divide-slate-200">
                                    <div className="p-2.5">
                                      <p className="text-slate-500 mb-1">
                                        Total
                                      </p>
                                      <p className="font-medium text-slate-900 text-base">
                                        {fullData.AssaySummaries?.AssaySummary?.[0]?.SIDCountAll?.toLocaleString() ||
                                          "0"}
                                      </p>
                                    </div>
                                    <div className="p-2.5">
                                      <p className="text-slate-500 mb-1">
                                        Aktif
                                      </p>
                                      <p className="font-medium text-green-700 text-base">
                                        {fullData.AssaySummaries?.AssaySummary?.[0]?.SIDCountActive?.toLocaleString() ||
                                          "0"}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="h-1 bg-slate-200">
                                    <div
                                      className="h-full bg-green-600"
                                      style={{
                                        width: `${(fullData.AssaySummaries?.AssaySummary?.[0]?.SIDCountActive / fullData.AssaySummaries?.AssaySummary?.[0]?.SIDCountAll) * 100 || 0}%`,
                                      }}
                                    ></div>
                                  </div>
                                  <div className="grid grid-cols-3 text-xs divide-x divide-slate-200">
                                    <div className="p-2.5">
                                      <p className="text-slate-500 mb-1">
                                        Tidak Aktif
                                      </p>
                                      <p className="font-medium text-slate-700">
                                        {fullData.AssaySummaries?.AssaySummary?.[0]?.SIDCountInactive?.toLocaleString() ||
                                          "0"}
                                      </p>
                                    </div>
                                    <div className="p-2.5">
                                      <p className="text-slate-500 mb-1">
                                        Tidak Meyakinkan
                                      </p>
                                      <p className="font-medium text-amber-700">
                                        {fullData.AssaySummaries?.AssaySummary?.[0]?.SIDCountInconclusive?.toLocaleString() ||
                                          "0"}
                                      </p>
                                    </div>
                                    <div className="p-2.5">
                                      <p className="text-slate-500 mb-1">
                                        Tidak Ditentukan
                                      </p>
                                      <p className="font-medium text-slate-700">
                                        {fullData.AssaySummaries?.AssaySummary?.[0]?.SIDCountUnspecified?.toLocaleString() ||
                                          "0"}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Statistik Senyawa */}
                              <div>
                                <h4 className="text-xs font-medium text-slate-700 mb-2 pl-1">
                                  Statistik Senyawa (CID)
                                </h4>
                                <div className="bg-slate-50 rounded-lg overflow-hidden border border-slate-200">
                                  <div className="grid grid-cols-2 text-xs divide-x divide-slate-200">
                                    <div className="p-2.5">
                                      <p className="text-slate-500 mb-1">
                                        Total
                                      </p>
                                      <p className="font-medium text-slate-900 text-base">
                                        {fullData.AssaySummaries?.AssaySummary?.[0]?.CIDCountAll?.toLocaleString() ||
                                          "0"}
                                      </p>
                                    </div>
                                    <div className="p-2.5">
                                      <p className="text-slate-500 mb-1">
                                        Aktif
                                      </p>
                                      <p className="font-medium text-green-700 text-base">
                                        {fullData.AssaySummaries?.AssaySummary?.[0]?.CIDCountActive?.toLocaleString() ||
                                          "0"}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="h-1 bg-slate-200">
                                    <div
                                      className="h-full bg-green-600"
                                      style={{
                                        width: `${(fullData.AssaySummaries?.AssaySummary?.[0]?.CIDCountActive / fullData.AssaySummaries?.AssaySummary?.[0]?.CIDCountAll) * 100 || 0}%`,
                                      }}
                                    ></div>
                                  </div>
                                  <div className="grid grid-cols-3 text-xs divide-x divide-slate-200">
                                    <div className="p-2.5">
                                      <p className="text-slate-500 mb-1">
                                        Tidak Aktif
                                      </p>
                                      <p className="font-medium text-slate-700">
                                        {fullData.AssaySummaries?.AssaySummary?.[0]?.CIDCountInactive?.toLocaleString() ||
                                          "0"}
                                      </p>
                                    </div>
                                    <div className="p-2.5">
                                      <p className="text-slate-500 mb-1">
                                        Tidak Meyakinkan
                                      </p>
                                      <p className="font-medium text-amber-700">
                                        {fullData.AssaySummaries?.AssaySummary?.[0]?.CIDCountInconclusive?.toLocaleString() ||
                                          "0"}
                                      </p>
                                    </div>
                                    <div className="p-2.5">
                                      <p className="text-slate-500 mb-1">
                                        Tidak Ditentukan
                                      </p>
                                      <p className="font-medium text-slate-700">
                                        {fullData.AssaySummaries?.AssaySummary?.[0]?.CIDCountUnspecified?.toLocaleString() ||
                                          "0"}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        {fullData.AssaySummaries?.AssaySummary?.[0]?.Target && (
                          <AccordionItem value="targets-detail">
                            <AccordionTrigger className="text-sm sm:text-base font-medium py-2">
                              Detail Target
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="bg-slate-50 p-3 sm:p-4 rounded-md text-xs text-slate-700 border border-slate-200">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                                  {Array.isArray(
                                    fullData.AssaySummaries?.AssaySummary[0]
                                      ?.Target
                                  ) ? (
                                    fullData.AssaySummaries?.AssaySummary[0]?.Target.map(
                                      (target, idx) => (
                                        <div
                                          key={idx}
                                          className="p-2 border border-indigo-100 bg-indigo-50 rounded-md"
                                        >
                                          <div className="font-medium text-indigo-800 mb-1">
                                            {target.Name ||
                                              "Target Tidak Bernama"}
                                          </div>
                                          {target.Accession && (
                                            <div className="text-indigo-600">
                                              Accession: {target.Accession}
                                            </div>
                                          )}
                                          {target.GI && (
                                            <div className="text-indigo-600">
                                              GI: {target.GI}
                                            </div>
                                          )}
                                          {target.TaxonomyID && (
                                            <div className="text-indigo-600">
                                              Taxonomy ID: {target.TaxonomyID}
                                            </div>
                                          )}
                                          {target.Organism && (
                                            <div className="text-indigo-600">
                                              Organism: {target.Organism}
                                            </div>
                                          )}
                                        </div>
                                      )
                                    )
                                  ) : fullData.AssaySummaries?.AssaySummary[0]
                                      ?.Target ? (
                                    <div className="p-2 border border-indigo-100 bg-indigo-50 rounded-md">
                                      <div className="font-medium text-indigo-800 mb-1">
                                        {fullData.AssaySummaries
                                          ?.AssaySummary[0]?.Target.Name ||
                                          "Target Tidak Bernama"}
                                      </div>
                                      {fullData.AssaySummaries?.AssaySummary[0]
                                        ?.Target.Accession && (
                                        <div className="text-indigo-600">
                                          Accession:{" "}
                                          {
                                            fullData.AssaySummaries
                                              ?.AssaySummary[0]?.Target
                                              .Accession
                                          }
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <p className="text-slate-400 italic">
                                      Tidak ada data target yang tersedia
                                    </p>
                                  )}
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        )}
                      </>
                    ) : (
                      <div className="text-center p-4">
                        <p className="text-sm text-slate-600">
                          Data lengkap tidak tersedia
                        </p>
                      </div>
                    )}
                  </Accordion>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="text-xs text-slate-500 border-t pt-3">
              <div className="flex items-center gap-1">
                <MdInfo className="h-3.5 w-3.5" />
                <span>Data diambil dari PubChem Bioassay Database</span>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
