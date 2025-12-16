
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/db/supabase'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/Skeleton'

type Batch = {
    id: string
    batch_number: number
    type: string
    total_quantity: number
    unit: string
    status: string
    bonding_start_date: string
    formula: { name: string }
}

export default function BatchesPage() {
    const [batches, setBatches] = useState<Batch[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchBatches()
    }, [])

    async function fetchBatches() {
        setLoading(true)
        const { data, error } = await supabase
            .from('batches')
            .select(`
        id, 
        batch_number, 
        type, 
        total_quantity, 
        unit, 
        status, 
        bonding_start_date,
        formula:formulas(name)
      `)
            .order('created_at', { ascending: false })

        if (!error && data) {
            setBatches(data as any)
        }
        setLoading(false)
    }

    return (
        <div className="w-full space-y-8 animate-fadeIn">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Production Batches</h1>
                    <p className="text-[var(--muted-foreground)]">Track active bonding batches and production history.</p>
                </div>
                <Link href="/batches/create">
                    <Button>+ New Batch</Button>
                </Link>
            </div>

            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-[var(--muted)] text-[var(--muted-foreground)] font-medium">
                            <tr>
                                <th className="p-4 rounded-tl-lg">Batch #</th>
                                <th className="p-4">Formula</th>
                                <th className="p-4">Type</th>
                                <th className="p-4">Started</th>
                                <th className="p-4 text-right">Quantity</th>
                                <th className="p-4 text-center rounded-tr-lg">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border)]">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i}>
                                        <td className="p-4"><Skeleton className="h-5 w-12" /></td>
                                        <td className="p-4"><Skeleton className="h-5 w-32" /></td>
                                        <td className="p-4"><Skeleton className="h-5 w-20" /></td>
                                        <td className="p-4"><Skeleton className="h-5 w-24" /></td>
                                        <td className="p-4"><Skeleton className="h-5 w-16 ml-auto" /></td>
                                        <td className="p-4"><Skeleton className="h-6 w-20 mx-auto rounded-full" /></td>
                                    </tr>
                                ))
                            ) : batches.length === 0 ? (
                                <tr><td colSpan={6} className="p-12 text-center text-[var(--muted-foreground)]">No batches found. Start production to see listings here.</td></tr>
                            ) : (
                                batches.map(batch => (
                                    <tr key={batch.id} className="hover:bg-[var(--muted)]/50 transition-colors">
                                        <td className="p-4 font-mono text-[var(--muted-foreground)]">#{batch.batch_number}</td>
                                        <td className="p-4 font-bold md:text-base">{batch.formula?.name}</td>
                                        <td className="p-4">
                                            <span className="px-2 py-1 rounded-full border border-[var(--border)] text-xs text-[var(--muted-foreground)]">
                                                {batch.type}
                                            </span>
                                        </td>
                                        <td className="p-4 text-[var(--muted-foreground)]">
                                            {new Date(batch.bonding_start_date).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 text-right font-mono font-bold">
                                            {batch.total_quantity}{batch.unit}
                                        </td>
                                        <td className="p-4 text-center">
                                            {batch.status === 'Bonding' ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> Bonding
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border border-green-200 dark:border-green-800">
                                                    {batch.status}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    )
}
