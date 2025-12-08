import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Dummy with minimum threshold per item (minimum = value where warning triggers)
const stokRendah = [
  { nama: "Gula Pasir", stok: 3, minimum: 5 },
  { nama: "Minyak Goreng", stok: 5, minimum: 5 },
  { nama: "Beras 5kg", stok: 2, minimum: 4 },
  { nama: "Telur Ayam", stok: 4, minimum: 6 },
  { nama: "Kopi Bubuk", stok: 1, minimum: 2 },
  { nama: "Masako", stok: 1, minimum: 2 },
]

// widget WidgetStokRendah.jsx
export default function WidgetStokRendah() {
  const [page, setPage] = useState(1);
  const perPage = 10;
  const totalPages = Math.max(1, Math.ceil(stokRendah.length / perPage));
  const startIndex = (page - 1) * perPage;
  const currentItems = stokRendah.slice(startIndex, startIndex + perPage);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Stok Hampir Habis</CardTitle>
        <CardDescription>
          Daftar barang dengan stok terendah
        </CardDescription>
      </CardHeader>

      <CardContent className="h-[380px] flex flex-col">
        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Barang</TableHead>
                <TableHead className="text-center">Minimum</TableHead>
                <TableHead className="text-right">Stok</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {currentItems.map((item, idx) => (
                <TableRow key={startIndex + idx}>
                  <TableCell className="font-medium">{item.nama}</TableCell>
                  <TableCell className="text-center text-sm text-muted-foreground">{item.minimum ?? '-'}</TableCell>
                  <TableCell className="text-right font-semibold">{item.stok}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination controls (outside scrollable area) */}
        <div className="mt-2 pt-2 border-t flex items-center justify-between text-sm">
          <div className="text-muted-foreground">
            {startIndex + 1} - {Math.min(startIndex + currentItems.length, stokRendah.length)} dari {stokRendah.length}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`px-3 py-1 rounded ${page === 1 ? 'bg-gray-200 text-gray-400' : 'bg-gray-900 text-white'}`}>
              Prev
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className={`px-3 py-1 rounded ${page === totalPages ? 'bg-gray-200 text-gray-400' : 'bg-gray-900 text-white'}`}>
              Next
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
