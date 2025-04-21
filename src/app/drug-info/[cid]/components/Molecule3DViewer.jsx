import React, { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  MdOutlineWarning,
  MdOutlineScience,
  MdZoomIn,
  MdZoomOut,
  MdRefresh,
} from "react-icons/md";
import { Button } from "@/components/ui/button";

export default function Molecule3DViewer({
  cid,
  smiles,
  width = "100%",
  height = "350px",
}) {
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [structure3d, setStructure3d] = useState(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    async function fetchStructureData() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/obat/structure3d/${cid}`);
        if (!response.ok) {
          throw new Error("Failed to fetch 3D structure data");
        }

        const data = await response.json();
        setStructure3d(data);
      } catch (err) {
        console.error("Error fetching 3D structure:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (cid) {
      fetchStructureData();
    }
  }, [cid]);

  useEffect(() => {
    // Initialize 3D molecule viewer when both structure data and script are loaded
    if (
      structure3d &&
      structure3d.has3dStructure &&
      scriptLoaded &&
      containerRef.current
    ) {
      let viewer;

      try {
        // Initialize 3DMol.js viewer
        viewer = $3Dmol.createViewer(containerRef.current, {
          backgroundColor: "white",
          antialias: true,
        });

        // Fetch actual 3D structure data (PDB format) and display
        fetch(structure3d.pdb)
          .then((response) => response.text())
          .then((data) => {
            viewer.addModel(data, "pdb");
            viewer.setStyle(
              {},
              { stick: { radius: 0.15, colorscheme: "Jmol", opacity: 0.75 } }
            );
            viewer.zoomTo();
            viewer.render();
          })
          .catch((err) => {
            console.error("Error fetching PDB data:", err);
            setError("Failed to load 3D model data");
          });
      } catch (err) {
        console.error("Error initializing 3D viewer:", err);
        setError("Failed to initialize 3D viewer");
      }

      // Cleanup
      return () => {
        if (viewer) {
          try {
            viewer.clear();
            viewer = null;
          } catch (e) {
            console.error("Error cleaning up 3D viewer:", e);
          }
        }
      };
    }
  }, [structure3d, scriptLoaded]);

  // Render message if 3D structure is not available
  if (error || (structure3d && !structure3d.has3dStructure)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MdOutlineScience className="text-blue-600 h-5 w-5" />
            <span>Visualisasi 3D</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 text-center">
          <div className="inline-flex items-center justify-center rounded-full bg-amber-100 p-4 mb-4">
            <MdOutlineWarning className="h-6 w-6 text-amber-600" />
          </div>
          <h3 className="text-lg font-medium text-slate-800">
            Struktur 3D Tidak Tersedia
          </h3>
          <p className="text-slate-500 mt-2">
            {error ||
              "Struktur 3D untuk senyawa ini tidak tersedia di database PubChem"}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Script
        src="https://3Dmol.org/build/3Dmol-min.js"
        onLoad={() => setScriptLoaded(true)}
      />
      <Card>
        <CardHeader className="border-b pb-3">
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 rounded-full">
              <MdOutlineScience className="text-blue-600 h-5 w-5" />
            </div>
            <span>Visualisasi Struktur 3D</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {loading ? (
            <div className="flex justify-center items-center h-[350px] bg-slate-50 rounded-md">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
                <p className="text-slate-500">Memuat struktur 3D...</p>
              </div>
            </div>
          ) : (
            <>
              <div
                ref={containerRef}
                style={{ width, height }}
                className="border border-slate-200 rounded-lg bg-white shadow-sm mx-auto"
              ></div>

              <div className="flex justify-center mt-3 gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-1"
                >
                  <MdZoomIn className="h-4 w-4" />
                  <span>Perbesar</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-1"
                >
                  <MdZoomOut className="h-4 w-4" />
                  <span>Perkecil</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-1"
                >
                  <MdRefresh className="h-4 w-4" />
                  <span>Reset</span>
                </Button>
              </div>

              <p className="text-xs text-slate-500 text-center mt-3">
                Putar dan zoom dengan mouse/touchpad untuk melihat struktur 3D
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
}
