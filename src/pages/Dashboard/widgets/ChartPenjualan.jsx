import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

// DATA DUA METRIK
const chartData = [
  { month: "Jan", penjualan: 120, pembelian: 90 },
  { month: "Feb", penjualan: 180, pembelian: 140 },
  { month: "Mar", penjualan: 150, pembelian: 110 },
  { month: "Apr", penjualan: 220, pembelian: 170 },
  { month: "Mei", penjualan: 200, pembelian: 160 },
  { month: "Jun", penjualan: 260, pembelian: 210 },
]

// CONFIG DUA WARNA
const chartConfig = {
  penjualan: {
    label: "Penjualan",
    color: "var(--chart-1)", // BIRU
  },
  pembelian: {
    label: "Pembelian",
    color: "var(--chart-2)", // BIRU MUDA
  },
}

export default function ChartPenjualan() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tren Penjualan & Pembelian</CardTitle>
        <CardDescription>
          Perbandingan 6 bulan terakhir
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            data={chartData}
            margin={{ left: 12, right: 12 }}
            accessibilityLayer
          >
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />

            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />

            {/* AREA PENJUALAN (BIRU) */}
            <Area
              dataKey="penjualan"
              type="natural"
              fill="var(--color-penjualan)"
              fillOpacity={0.35}
              stroke="var(--color-penjualan)"
              strokeWidth={2}
            />

            {/* AREA PEMBELIAN (MERAH) */}
            <Area
              dataKey="pembelian"
              type="natural"
              fill="var(--color-pembelian)"
              fillOpacity={0.35}
              stroke="var(--color-pembelian)"
              strokeWidth={2}
            />

          </AreaChart>
        </ChartContainer>
      </CardContent>

      <CardFooter>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium">Penjualan lebih tinggi dari pembelian</span>
          <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  )
}
