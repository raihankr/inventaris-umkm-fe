import { useEffect, useState } from "react";
import { XIcon } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

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

import { apiGet } from "@/lib/api";
import { GET_RECENT_TRANSACTIONS } from "@/constants/api/dashboard";

export default function WidgetTransaksiTerbaru() {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadData() {
    setLoading(true);
    const res = await apiGet(GET_RECENT_TRANSACTIONS);

    if (res.error) {
      setError(res.message || "Gagal memuat data transaksi");
      setLoading(false);
      return;
    }

    setData(res?.data?.data || []); // pastikan format sesuai API-mu
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Card className="h-full w-full flex flex-col">
      <CardHeader>
        <CardTitle>Transaksi Terbaru</CardTitle>
        <CardDescription>10 transaksi pembelian terakhir</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col min-h-[350px]">
        {loading && (
          <div className="flex-1 flex items-center justify-center">
            <Spinner className="w-8 h-8 text-muted-foreground" />
          </div>
        )}

        {error && (
          <div className="text-center py-6 text-sm text-red-500">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="flex-1 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[140px]">ID</TableHead>
                  <TableHead>Pembeli</TableHead>
                  <TableHead className="w-[160px] text-right">Total</TableHead>
                  <TableHead className="w-[120px] text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {data.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4 text-sm">
                      Tidak ada transaksi ditemukan.
                    </TableCell>
                  </TableRow>
                )}

                {data.map((trx) => (
                  <TableRow key={trx.id_transaction}>
                    <TableCell className="font-medium">
                      {trx.id_transaction}
                    </TableCell>

                    <TableCell>
                      {trx.users?.name || "-"}
                    </TableCell>

                    <TableCell className="text-right">
                      Rp {trx.total_price?.toLocaleString("id-ID")}
                    </TableCell>

                    <TableCell className="text-center">
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
        )}
      </CardContent>

      {/* Dialog */}
      <Dialog
        open={!!selected}
        onOpenChange={(open) => !open && setSelected(null)}
      >
        <DialogOverlay className="bg-black/50 backdrop-blur-sm" />
        <DialogContent className="sm:max-w-[520px]" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Detail Transaksi</DialogTitle>
            <DialogDescription>
              Rincian pembelian {selected?.id_transaction}
            </DialogDescription>
          </DialogHeader>

          <DialogClose asChild>
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-4 right-4 shadow-none"
            >
              <XIcon />
            </Button>
          </DialogClose>

          {selected && (
            <div className="space-y-3">
              {selected.items?.map((item) => (
                <div key={item.id_trx_item} className="flex justify-between text-sm">
                  <span>
                    {item.product?.name} x {item.amount}
                  </span>
                  <span>
                    Rp {item.price?.toLocaleString("id-ID")}
                  </span>
                </div>
              ))}

              <div className="border-t pt-2 text-sm font-semibold flex justify-between">
                <span>Total</span>
                <span>Rp {selected.total_price?.toLocaleString("id-ID")}</span>
              </div>

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
