import { Suspense } from "react";
import BioassayDetail from "./components/BioassayDetail";
import BioassayDetailSkeleton from "./components/BioassayDetailSkeleton";

export const metadata = {
  title: "Detail Bioassay | Farmasi Nisa",
  description: "Informasi lengkap mengenai bioassay dari PubChem",
};

export default function BioassayDetailPage({ params }) {
  const { aid } = params;

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6">
      <Suspense fallback={<BioassayDetailSkeleton />}>
        <BioassayDetail aid={aid} />
      </Suspense>
    </div>
  );
}
