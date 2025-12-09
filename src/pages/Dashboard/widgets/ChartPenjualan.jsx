import { useEffect, useMemo, useState } from "react"
import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

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

import { Spinner } from "@/components/ui/spinner"

import { apiGet } from "@/lib/api"
import { GET_TRANSACTIONS_TREND } from "@/constants/api/dashboard"

// WARNA CHART
const chartConfig = {
  penjualan: {
    label: "Penjualan",
    color: "var(--chart-1)",
  },
  pembelian: {
    label: "Pembelian",
    color: "var(--chart-2)",
  },
}

export default function ChartPenjualan() {
  const [period, setPeriod] = useState("6m") // filter default
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // MAP PERIODE
  const periodMap = {
    "1m": "one_month",
    "3m": "three_month",
    "6m": "six_month",
    "12m": "one_year",
  }

  // 1. FETCH DATA API
  useEffect(() => {
    const fetchTrend = async () => {
      setLoading(true)
      setError(null)

      try {
        const url = GET_TRANSACTIONS_TREND.includes("?")
          ? `${GET_TRANSACTIONS_TREND}&period=${encodeURIComponent(periodMap[period])}`
          : `${GET_TRANSACTIONS_TREND}?period=${encodeURIComponent(periodMap[period])}`

        const res = await apiGet(url)

        let data = []
        if (Array.isArray(res)) {
          data = res
        } else if (Array.isArray(res?.data)) {
          data = res.data
        } else if (Array.isArray(res?.data?.data)) {
          data = res.data.data.transaction_trend_data || []
        } else if (Array.isArray(res?.data?.transaction_trend_data)) {
          data = res.data.transaction_trend_data
        } else if (Array.isArray(res?.transaction_trend_data)) {
          data = res.transaction_trend_data
        } else if (Array.isArray(res?.data?.data?.transaction_trend_data)) {
          data = res.data.data.transaction_trend_data
        } else {
          data =
            res?.data?.data?.transaction_trend_data ||
            res?.data?.transaction_trend_data ||
            []
        }

        setChartData(data)
      } catch (err) {
        console.error(err)
        if (err?.response?.status === 401) {
          setError("Autentikasi diperlukan (401). Silakan login ulang.")
        } else {
          setError("Gagal memuat data tren transaksi")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchTrend()
  }, [period])

  // 2. data langsung dipakai
  const filteredData = useMemo(() => {
    return Array.isArray(chartData) ? chartData : []
  }, [chartData])

  // 3. SMART INSIGHT
  const summaryText = useMemo(() => {
    if (!filteredData || filteredData.length === 0) return "Tidak ada data"

    const totalPenjualan = filteredData.reduce(
      (acc, item) => acc + (item.total_sell || 0),
      0
    )

    const totalPembelian = filteredData.reduce(
      (acc, item) => acc + (item.total_buy || 0),
      0
    )

    if (totalPenjualan > totalPembelian)
      return "Penjualan lebih tinggi dari pembelian"

    if (totalPenjualan < totalPembelian)
      return "Pembelian lebih tinggi dari penjualan"

    return "Penjualan dan pembelian seimbang"
  }, [filteredData])

  // LOADING UI
  if (loading) {
    return (
      <Card className="p-6 flex items-center justify-center">
        <Spinner className="h-6 w-6 text-muted-foreground" />
      </Card>
    )
  }

  // ERROR UI
  if (error) {
    return (
      <Card className="p-6">
        <p className="text-sm text-red-500">{error}</p>
      </Card>
    )
  }

  // WIDGET UTAMA
  return (
    <Card>
      <CardHeader className="flex items-start justify-between gap-4">
        <div>
          <CardTitle>Tren Penjualan & Pembelian</CardTitle>
          <CardDescription>
            Perbandingan{" "}
            {period === "1m"
              ? "1 bulan"
              : period === "3m"
                ? "3 bulan"
                : period === "6m"
                  ? "6 bulan"
                  : "1 tahun"}
          </CardDescription>
        </div>

        <div className="flex items-center gap-2">
          {["1m", "3m", "6m", "12m"].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={`px-2 py-1 rounded-md text-sm font-medium transition ${period === p
                  ? "bg-gray-900 text-white"
                  : "text-muted-foreground hover:bg-muted"
                }`}
            >
              {/* Label periode */}
              {p === "1m"
                ? "1 bulan"
                : p === "3m"
                  ? "3 bulan"
                  : p === "6m"
                    ? "6 bulan"
                    : "1 tahun"}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={filteredData} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="date_period"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.split(" ")[0]}
            />

            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="bar" />}
            />

            {/* BAR PENJUALAN */}
            <Bar
              dataKey="total_sell"
              fill="var(--color-penjualan)"
              radius={[4, 4, 0, 0]}
            />

            {/* BAR PEMBELIAN */}
            <Bar
              dataKey="total_buy"
              fill="var(--color-pembelian)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>

      <CardFooter>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium">{summaryText}</span>
          <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  )
}
