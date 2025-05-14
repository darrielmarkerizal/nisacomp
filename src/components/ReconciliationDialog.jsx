"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function ReconciliationDialog() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Show dialog on page load after a short delay
    const timer = setTimeout(() => {
      setOpen(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-lg text-indigo-600">
            Pesan Penting
          </DialogTitle>
          <DialogDescription className="text-center">
            <div className="mt-2 space-y-2 text-slate-700">
              <p>
                Sayangg, aku tau kamu masih marah sama aku soal kejadian tadi,
                dan aku ngerti banget kalo kamu butuh waktu buat tenang.
              </p>
              <p>
                Aku cuma pengen bilang aku sayang banget sama kamu, dan aku ga
                mau kita selesai gini.
              </p>
              <p>
                Aku sadar aku salah udah bales video tiktok dari faizal, dan aku
                ga mau ulangin kesalahan itu lagi.
              </p>
              <p>
                Aku janji bakal jaga hati kamu lebih baik, aku ga mau kamu sakit
                hati lagi.
              </p>
              <p>
                Kalo kamu masih ga mau ngobrol, aku bakal nunggu sampe kamu
                siap, aku cuma minta kamu kasih tau aku kapan kamu udah mau
                cerita.
              </p>
              <p>Aku tunggu ya, aku ga mau kehilangan kamu.</p>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center">
          <Button
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700"
            onClick={() => setOpen(false)}
          >
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
