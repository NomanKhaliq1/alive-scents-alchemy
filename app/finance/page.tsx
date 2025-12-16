
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/db/supabase'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'

export default function FinancePage() {
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalExpenses: 0,
        netProfit: 0
    })

    useEffect(() => {
        fetchData()
    }, [])

    async function fetchData() {
        setLoading(true)

        // 1. Get All Sales Sum
        const { data: sales } = await supabase.from('sales').select('total_amount')
        const revenue = sales?.reduce((acc, curr) => acc + (curr.total_amount || 0), 0) || 0

        // 2. Get All Purchases Sum
        const { data: purchases } = await supabase.from('purchases').select('cost')
        const expenses = purchases?.reduce((acc, curr) => acc + (curr.cost || 0), 0) || 0

        setStats({
            totalRevenue: revenue,
            totalExpenses: expenses,
            netProfit: revenue - expenses
        })

        setLoading(false)
    }

    return (
        <div className="space-y-8 animate-fadeIn w-full">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Finance Dashboard</h1>
                <p className="text-[var(--muted-foreground)]">Cash flow status and performance metrics.</p>
            </div>

            {loading ? (
                <div className="grid md:grid-cols-3 gap-6">
                    <Skeleton className="h-32 rounded-2xl" />
                    <Skeleton className="h-32 rounded-2xl" />
                    <Skeleton className="h-32 rounded-2xl" />
                </div>
            ) : (
                <div className="grid md:grid-cols-3 gap-6">
                    <Card className="border-l-4 border-l-green-500">
                        <h3 className="text-sm font-medium text-[var(--muted-foreground)] uppercase tracking-wider">Total Revenue</h3>
                        <div className="text-3xl font-bold mt-2 text-green-600 dark:text-green-400">
                            {stats.totalRevenue.toLocaleString()}
                        </div>
                    </Card>

                    <Card className="border-l-4 border-l-red-500">
                        <h3 className="text-sm font-medium text-[var(--muted-foreground)] uppercase tracking-wider">Total Expenses</h3>
                        <div className="text-3xl font-bold mt-2 text-red-600 dark:text-red-400">
                            {stats.totalExpenses.toLocaleString()}
                        </div>
                    </Card>

                    <Card className={`border-l-4 ${stats.netProfit >= 0 ? 'border-l-blue-500' : 'border-l-orange-500'}`}>
                        <h3 className="text-sm font-medium text-[var(--muted-foreground)] uppercase tracking-wider">Net Profit / Cash</h3>
                        <div className={`text-3xl font-bold mt-2 ${stats.netProfit >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'}`}>
                            {stats.netProfit > 0 ? '+' : ''}{stats.netProfit.toLocaleString()}
                        </div>
                    </Card>
                </div>
            )}

            <div className="p-8 text-center text-[var(--muted-foreground)] text-sm border border-dashed rounded-2xl">
                Advanced charts and detailed transaction ledger coming in v2.
            </div>
        </div>
    )
}
