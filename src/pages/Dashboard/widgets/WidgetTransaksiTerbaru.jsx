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

import { Button } from "@/components/ui/button"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

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
]

//  widget
export default function WidgetTransaksiTerbaru() {
  return (
    <Card className="h-full">
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
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button size="sm" variant="outline">
                          Detail
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent className="w-64">
                        <div className="space-y-2">
                          <p className="font-semibold">Detail Belanja</p>

                          <div className="space-y-1">
                            {trx.items.map((item, index) => (
                              <div
                                key={index}
                                className="flex justify-between text-sm"
                              >
                                <span>{item.nama}</span>
                                <span>
                                  Rp {item.harga.toLocaleString("id-ID")}
                                </span>
                              </div>
                            ))}
                          </div>

                          <div className="border-t pt-2 text-sm font-semibold flex justify-between">
                            <span>Total</span>
                            <span>
                              Rp {trx.total.toLocaleString("id-ID")}
                            </span>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
