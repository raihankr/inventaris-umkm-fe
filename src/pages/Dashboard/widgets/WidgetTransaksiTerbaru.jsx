import { useState } from "react";
import { XIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogOverlay,
} from "@/components/ui/dialog";

// Dummy
const transaksiTerbaru = [
  {
    id: "TRX001",
    nama: "Andi",
    total: 52000,
    items: [
      { nama: "Gula Pasir", harga: 15000 },
      { nama: "Minyak Goreng", harga: 37000 },
    ],
  },
  {
    id: "TRX002",
    nama: "Budi",
    total: 34000,
    items: [
      { nama: "Kopi Bubuk", harga: 12000 },
      { nama: "Gula Pasir", harga: 22000 },
    ],
  },
  {
    id: "TRX003",
    nama: "Siti",
    total: 78000,
    items: [
      { nama: "Beras 5kg", harga: 62000 },
      { nama: "Telur Ayam", harga: 16000 },
    ],
  },
  {
    id: "TRX004",
    nama: "Rudi",
    total: 21000,
    items: [
      { nama: "Masako", harga: 10000 },
      { nama: "Kopi Bubuk", harga: 11000 },
    ],
  },
];

//  widget
export default function WidgetTransaksiTerbaru() {
  const [selected, setSelected] = useState(null);

  return (
    <Card className="h-full w-full flex flex-col">
      <CardHeader>
        <CardTitle>Transaksi Terbaru</CardTitle>
        <CardDescription>
          10 transaksi pembelian terakhir
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col min-h-[350px]">
        <div className="flex-1 overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[140px] text-left">ID</TableHead>
                <TableHead className="text-left">Pembeli</TableHead>
                <TableHead className="w-[160px] text-right">Total</TableHead>
                <TableHead className="w-[120px] text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {transaksiTerbaru.map((trx) => (
                <TableRow key={trx.id}>
                  <TableCell className="font-medium w-[140px]">
                    {trx.id}
                  </TableCell>

                  <TableCell className="text-left">
                    {trx.nama}
                  </TableCell>

                  <TableCell className="text-right w-[160px]">
                    Rp {trx.total.toLocaleString("id-ID")}
                  </TableCell>

                  <TableCell className="text-center w-[120px]">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelected(trx)}
                    >
                      Detail
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* Dialog for transaction detail */}
      <Dialog
        open={!!selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogOverlay className="bg-black/50 backdrop-blur-sm" />
        <DialogContent
          showCloseButton={false}
          onInteractOutside={(e) => e.preventDefault()}
          className="sm:max-w-[520px]"
        >
          <DialogHeader>
            <DialogTitle>Detail Transaksi</DialogTitle>
            <DialogDescription>
              Rincian pembelian {selected?.id}
            </DialogDescription>
          </DialogHeader>

          {/* custom top-right close using project Button */}
          <DialogClose asChild>
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-4 right-4 hover:bg-transparent hover:text-current focus-visible:ring-0 active:bg-transparent shadow-none"
            >
              <XIcon />
            </Button>
          </DialogClose>

          {selected && (
            <div className="space-y-3">
              <div className="space-y-1">
                {selected.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span>{item.nama}</span>
                    <span>Rp {item.harga.toLocaleString("id-ID")}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-2 text-sm font-semibold flex justify-between">
                <span>Total</span>
                <span>Rp {selected.total.toLocaleString("id-ID")}</span>
              </div>

              {/* footer with close button (left aligned) */}
              <DialogFooter>
                <div className="flex justify-between mt-4 sticky bottom-0 bg-background py-2 border-t">
                  <Button variant="outline" onClick={() => setSelected(null)}>
                    Tutup
                  </Button>
                </div>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
