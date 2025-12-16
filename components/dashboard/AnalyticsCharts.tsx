
'use client'

import { Card } from '@/components/ui/Card'
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Legend, AreaChart, Area
} from 'recharts'

type AnalyticsProps = {
    salesTrend: { date: string; amount: number }[]
    topProducts: { name: string; quantity: number }[]
    recentRevenue: number
    recentExpenses: number
}

export function AnalyticsCharts({ salesTrend, topProducts, recentRevenue, recentExpenses }: AnalyticsProps) {
    return (
        <div className="space-y-8 animate-fadeIn">

            {/* KPI Cards */}
            <div className="grid md:grid-cols-3 gap-6">
                <Card className="border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-transparent dark:from-blue-900/10">
                    <h3 className="text-sm font-medium text-[var(--muted-foreground)] uppercase tracking-wider">30-Day Revenue</h3>
                    <div className="text-3xl font-bold mt-2 text-blue-600 dark:text-blue-400">
                        {recentRevenue.toLocaleString()}
                    </div>
                </Card>
                <Card className="border-l-4 border-l-red-500 bg-gradient-to-br from-red-50 to-transparent dark:from-red-900/10">
                    <h3 className="text-sm font-medium text-[var(--muted-foreground)] uppercase tracking-wider">30-Day Expenses</h3>
                    <div className="text-3xl font-bold mt-2 text-red-600 dark:text-red-400">
                        {recentExpenses.toLocaleString()}
                    </div>
                </Card>
                <Card className="border-l-4 border-l-green-500 bg-gradient-to-br from-green-50 to-transparent dark:from-green-900/10">
                    <h3 className="text-sm font-medium text-[var(--muted-foreground)] uppercase tracking-wider">Net Cash Flow</h3>
                    <div className={`text-3xl font-bold mt-2 ${(recentRevenue - recentExpenses) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
                        {(recentRevenue - recentExpenses).toLocaleString()}
                    </div>
                </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Sales Trend Chart */}
                <Card>
                    <h3 className="font-bold text-lg mb-6">Revenue Trend (Last 30 Days)</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={salesTrend}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(val) => new Date(val).getDate().toString()}
                                />
                                <YAxis
                                    tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(val) => val >= 1000 ? `${val / 1000}k` : val}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '8px', border: '1px solid var(--border)' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="amount"
                                    stroke="#2563eb"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Top Products Chart */}
                <Card>
                    <h3 className="font-bold text-lg mb-6">Top Selling Products</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topProducts} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="var(--border)" />
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
                                    width={100}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '8px', border: '1px solid var(--border)' }}
                                    cursor={{ fill: 'var(--muted)/50' }}
                                />
                                <Bar dataKey="quantity" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
        </div>
    )
}
