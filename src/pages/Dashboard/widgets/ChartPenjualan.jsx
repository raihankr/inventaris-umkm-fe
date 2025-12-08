"use client" // Menandakan bahwa ini adalah komponen client-side

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

// Contoh data penjualan bulanan
const chartData = [
  { month: "Jan", penjualan: 120 },
  { month: "Feb", penjualan: 180 },
  { month: "Mar", penjualan: 150 },
  { month: "Apr", penjualan: 220 },
  { month: "Mei", penjualan: 200 },
  { month: "Jun", penjualan: 260 },
]

// Konfigurasi warna untuk chart penjualan
const chartConfig = {
  penjualan: {
    label: "Penjualan",
    color: "var(--chart-1)",
  },
}

// widget ChartPenjualan.jsx
export default function ChartPenjualan() {
  return (
    <Card>
      {/* Header Judul */}
      <CardHeader>
        <CardTitle>Tren Penjualan</CardTitle>
        <CardDescription>Perkembangan penjualan 6 bulan terakhir</CardDescription>
      </CardHeader>

      {/* Area Chart */}
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            data={chartData}
            margin={{ left: 12, right: 12 }}
            accessibilityLayer
          >
            {/* Grid */}
            <CartesianGrid vertical={false} />

            {/* Sumbu X */}
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />

            {/* Tooltip */}
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />

            {/* Area Melengkung */}
            <Area
              dataKey="penjualan"
              type="natural"
              fill="var(--color-penjualan)"
              fillOpacity={0.35}
              stroke="var(--color-penjualan)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>

      {/* Footer Info */}
      <CardFooter>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium">Naik 12% bulan ini</span>
          <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  )
}
