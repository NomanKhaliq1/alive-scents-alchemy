
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/db/supabase'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'

type BondingBatch = {
    id: string
    batch_number: number
    type: string
    total_quantity: number
    unit: string
    status: string
    bonding_start_date: string
    formula: {
        name: string
        default_bonding_days: number
    }
}

export default function BondingPage() {
    const [batches, setBatches] = useState<BondingBatch[]>([])
    const [loading, setLoading] = useState(true)
    const [processingId, setProcessingId] = useState<string | null>(null)

    useEffect(() => {
        fetchBondingBatches()
    }, [])

    async function fetchBondingBatches() {
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
        formula:formulas(name, default_bonding_days)
      `)
            .in('status', ['Bonding', 'Ready'])
            .order('bonding_start_date', { ascending: true }) // Oldest first (closest to ready)

        if (!error && data) {
            setBatches(data as any)
        }
        setLoading(false)
    }

    const markAsMatured = async (id: string) => {
        if (!confirm('Mark this batch as Matured/Ready? This will make it available for bottling.')) return

        setProcessingId(id)
        const { error } = await supabase
            .from('batches')
            .update({ status: 'Ready' })
            .eq('id', id)

        if (!error) {
            fetchBondingBatches()
        } else {
            alert('Error updating batch')
        }
        setProcessingId(null)
    }

    const bottleBatch = async (batch: BondingBatch) => {
        const bottleSize = prompt(`Bottle Size (ml)?`)
        if (!bottleSize) return

        const count = prompt(`Number of ${bottleSize}ml bottles?`)
        if (!count) return

        if (!confirm(`Create ${count} x ${bottleSize}ml bottles of ${batch.formula.name}? This will mark batch as Finished.`)) return

        setProcessingId(batch.id)

        // 1. Create Finished Stock
        const { error: stockError } = await supabase
            .from('finished_stock')
            .insert([{
                batch_id: batch.id,
                product_name: batch.formula.name,
                bottles_available: parseInt(count),
                bottle_size_ml: parseFloat(bottleSize)
            }])

        if (stockError) {
            alert('Error creating stock: ' + stockError.message)
            setProcessingId(null)
            return
        }

        // 2. Mark Batch as Finished
        const { error: batchError } = await supabase
            .from('batches')
            .update({ status: 'Finished' })
            .eq('id', batch.id)

        if (!batchError) {
            fetchBondingBatches()
        } else {
            alert('Error updating batch status')
        }
        setProcessingId(null)
    }

    return (
        <div className="w-full space-y-8 animate-fadeIn">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Bonding & Maceration</h1>
                <p className="text-[var(--muted-foreground)]">Monitor maceration progress. Perfumes improve with time.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                    Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-64 w-full rounded-2xl" />)
                ) : batches.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-[var(--muted-foreground)] border border-dashed border-[var(--border)] rounded-xl">
                        No active bonding or ready batches found.
                    </div>
                ) : (
                    batches.map(batch => {
                        const startDate = new Date(batch.bonding_start_date)
                        const today = new Date()
                        const diffTime = Math.abs(today.getTime() - startDate.getTime())
                        const daysPassed = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                        const requiredDays = batch.formula?.default_bonding_days || 0 // Default 0 if null
                        const progress = requiredDays > 0 ? Math.min((daysPassed / requiredDays) * 100, 100) : 100
                        const isReady = daysPassed >= requiredDays || batch.status === 'Ready'

                        return (
                            <Card key={batch.id} className="flex flex-col relative overflow-hidden group">
                                {/* Progress Bar Background */}
                                <div className="absolute top-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000" style={{ width: `${progress}%` }}></div>

                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <span className="text-xs font-mono text-[var(--muted-foreground)]">#{batch.batch_number}</span>
                                        <h3 className="font-bold text-lg leading-tight">{batch.formula?.name}</h3>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold border ${batch.type === 'Perfume' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                                        {batch.type}
                                    </span>
                                </div>

                                <div className="flex-1 space-y-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[var(--muted-foreground)]">Volume</span>
                                        <span className="font-mono font-bold">{batch.total_quantity}{batch.unit}</span>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex justify-between text-xs font-medium">
                                            <span>Progress</span>
                                            <span className={isReady ? 'text-green-600' : 'text-blue-600'}>
                                                {batch.status === 'Ready' ? 'Matured (Ready)' : `${daysPassed} / ${requiredDays} days`}
                                            </span>
                                        </div>
                                        <div className="w-full bg-[var(--muted)] rounded-full h-2 overflow-hidden">
                                            <div className={`h-full rounded-full ${isReady ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${progress}%` }}></div>
                                        </div>
                                    </div>

                                    <div className="text-xs text-[var(--muted-foreground)] flex justify-between mt-2">
                                        <span>Started: {startDate.toLocaleDateString()}</span>
                                        <span>Est. Ready: {new Date(startDate.getTime() + requiredDays * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-[var(--border)]">
                                    {batch.status === 'Ready' ? (
                                        <Button
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                            onClick={() => bottleBatch(batch)}
                                            disabled={!!processingId}
                                        >
                                            {processingId === batch.id ? 'Bottling...' : '🍾 Bottle Batch'}
                                        </Button>
                                    ) : isReady ? (
                                        <Button
                                            className="w-full bg-green-600 hover:bg-green-700 text-white shadow-green-200 dark:shadow-none"
                                            onClick={() => markAsMatured(batch.id)}
                                            disabled={!!processingId}
                                        >
                                            {processingId === batch.id ? 'Updating...' : '✓ Mark Matured'}
                                        </Button>
                                    ) : (
                                        <Button variant="secondary" className="w-full opacity-50 cursor-not-allowed" disabled>
                                            Macerating...
                                        </Button>
                                    )}
                                </div>
                            </Card>
                        )
                    })
                )}
            </div>
        </div>
    )
}
