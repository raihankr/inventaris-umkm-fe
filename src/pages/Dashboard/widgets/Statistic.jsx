import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { PackageIcon, ArchiveIcon, CreditCardIcon } from "lucide-react"
import { useTheme } from "../../../contexts/ThemeContext"
import { apiGet } from "@/lib/api"
import { GET_STATISTICS } from "@/constants/api/dashboard"

export default function Statistic() {
    const { darkMode: isDark } = useTheme()
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)

    // Fetch API
    useEffect(() => {
        async function fetchStatistics() {
            const res = await apiGet(GET_STATISTICS)

            if (!res.error) {
                setData(res.data.data)
            }

            setLoading(false)
        }

        fetchStatistics()
    }, [])

    // Format angka: 1.200.000 = 1.2 JT dst
    const formatShort = (value) => {
        if (value == null) return "0"

        const abs = Math.abs(value)
        if (abs >= 1_000_000_000_000) return (value / 1_000_000_000_000).toFixed(1).replace(/\.0$/, "") + " T"
        if (abs >= 1_000_000_000) return (value / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + " M"
        if (abs >= 1_000_000) return (value / 1_000_000).toFixed(1).replace(/\.0$/, "") + " Jt"
        if (abs >= 1_000) return (value / 1_000).toFixed(1).replace(/\.0$/, "") + " Rb"
        return value.toString()
    }

    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:col-span-3">
                <Card className="rounded-xl p-5 border-2 h-24 animate-pulse" />
                <Card className="rounded-xl p-5 border-2 h-24 animate-pulse" />
                <Card className="rounded-xl p-5 border-2 h-24 animate-pulse" />
                <Card className="rounded-xl p-5 border-2 h-24 animate-pulse" />
            </div>
        )
    }

    const totalBuy = data?.transactions?.buy ?? 0
    const totalSell = data?.transactions?.sell ?? 0

    const stats = [
        { label: "Total Product", value: data?.totalProducts ?? 0, icon: PackageIcon, variant: 'green' },
        { label: "Total Asset", value: "Rp " + formatShort(data?.totalAssetValue ?? 0), icon: ArchiveIcon, variant: 'blue' },
        { label: "Transaksi Beli", value: "Rp " + formatShort(totalBuy), icon: CreditCardIcon, variant: 'yellow' },
        { label: "Transaksi Jual", value: "Rp " + formatShort(totalSell), icon: CreditCardIcon, variant: 'purple' }
    ]

    const cardClasses = {
        green: isDark ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200',
        yellow: isDark ? 'bg-yellow-900/20 border-yellow-800' : 'bg-yellow-50 border-yellow-200',
        red: isDark ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200',
        blue: isDark ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200',
        purple: isDark ? 'bg-purple-900/20 border-purple-800' : 'bg-purple-50 border-purple-200'
    }

    const iconColors = {
        green: 'text-green-600',
        yellow: 'text-yellow-600',
        red: 'text-red-600',
        blue: 'text-blue-600',
        purple: 'text-purple-600'
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:col-span-3">
            {stats.map((item, idx) => (
                <Card key={idx} className={`rounded-xl p-5 border-2 transition-all shadow-sm ${cardClasses[item.variant] || cardClasses.blue}`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm mb-1">{item.label}</p>
                            <p className="text-3xl font-bold">{item.value}</p>
                        </div>
                        <item.icon size={36} className={iconColors[item.variant] || iconColors.blue} />
                    </div>
                </Card>
            ))}
        </div>
    )
}
