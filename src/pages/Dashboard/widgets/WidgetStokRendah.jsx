import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Spinner } from "@/components/ui/spinner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { fetchWithPagination } from "@/lib/api";
import { GET_LOW_STOCK_PRODUCTS } from "@/constants/api/dashboard";

export default function WidgetStokRendah() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 5;

  const [total, setTotal] = useState(0);
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch data dari API
  async function loadData() {
    setLoading(true);
    setErrorMsg("");

    const res = await fetchWithPagination(GET_LOW_STOCK_PRODUCTS, {
      page,
      limit,
    });

    if (res.error) {
      setErrorMsg(res.message || "Gagal memuat data");
      setLoading(false);
      return;
    }

    // FIX SESUAI STRUKTUR API
    setItems(res.data?.data?.data || []);
    setTotal(res.data?.data?.count || 0);

    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, [page]);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Stok Hampir Habis</CardTitle>
        <CardDescription>Daftar barang dengan stok terendah</CardDescription>
      </CardHeader>

      <CardContent className="h-[380px] flex flex-col">

        {/* Loading state */}
        {loading && (
          <div className="flex-1 flex items-center justify-center">
            <Spinner className="w-6 h-6 text-muted-foreground" />
          </div>
        )}

        {/* Error state */}
        {!loading && errorMsg && (
          <div className="flex-1 flex items-center justify-center text-sm text-red-500">
            {errorMsg}
          </div>
        )}

        {/* Table / Card */}
        {!loading && !errorMsg && (
          <div className="flex-1 overflow-auto min-w-0">
            {/* Desktop Table */}
            <div className="hidden sm:block">
              <Table className="table-fixed min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-auto">Nama Barang</TableHead>
                    <TableHead className="text-center w-20">Minimum</TableHead>
                    <TableHead className="text-right w-16">Stok</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan="3" className="text-center text-sm text-muted-foreground">
                        Tidak ada data
                      </TableCell>
                    </TableRow>
                  ) : (
                    items.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium whitespace-normal break-words">{item.name}</TableCell>
                        <TableCell className="text-center text-sm text-muted-foreground">{item.minimum ?? "-"}</TableCell>
                        <TableCell className="text-right font-semibold">{item.stock}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card */}
            <div className="sm:hidden space-y-2">
              {items.length === 0 ? (
                <div className="text-center text-sm text-muted-foreground">Tidak ada data</div>
              ) : (
                items.map((item, idx) => (
                  <Card key={idx} className="p-3 border rounded-lg shadow-sm">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{item.name}</span>
                      <span className="font-semibold">{item.stock}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">Minimum: {item.minimum ?? "-"}</div>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}

        {/* Pagination */}
        {!loading && !errorMsg && items.length > 0 && (
          <div className="mt-2 pt-2 border-t flex flex-col sm:flex-row items-center justify-between text-sm gap-2">
            <div className="text-muted-foreground">
              {`${(page - 1) * limit + 1} - ${(page - 1) * limit + items.length} dari ${total}`}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className={`px-3 py-1.5 rounded-md font-medium text-sm transition-all ${page === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg"
                  }`}
              >
                Prev
              </button>

              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className={`px-3 py-1.5 rounded-md font-medium text-sm transition-all ${page === totalPages
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg"
                  }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
