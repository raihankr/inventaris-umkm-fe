"use client"

// Widget Dashboard
import ChartPenjualan from "./widgets/ChartPenjualan"
import WidgetStokRendah from "./widgets/WidgetStokRendah"
import WidgetTransaksiTerbaru from "./widgets/WidgetTransaksiTerbaru"

export default function Dashboard() {
  return (
    <div className="min-h-screen p-4 sm:p-6">

      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header Dashboard */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            Dashboard Inventaris UMKM
          </h1>
          <p className="text-muted-foreground">
            Ringkasan performa penjualan dan kondisi stok saat ini
          </p>
        </div>

        {/* body */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          
          {/* Chart Penjualan (Lebar 2 Kolom) */}
          <div className="lg:col-span-2">
            <ChartPenjualan />
          </div>

          {/* Widget Stok Rendah */}
          <div>
            <WidgetStokRendah />
          </div>

          {/* Widget Transaksi Terbaru (Lebar 2 Kolom) */}
          <div className="lg:col-span-3">
            <WidgetTransaksiTerbaru />
          </div>

        </div>
      </div>
    </div>
  )
}
