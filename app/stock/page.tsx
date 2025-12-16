
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/db/supabase'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'

type StockItem = {
    id: string
    product_name: string
    bottles_available: number
    bottle_size_ml: number
    batch: { batch_number: number }
    created_at: string
}

export default function StockPage() {
    const [stock, setStock] = useState<StockItem[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchStock()
    }, [])

    async function fetchStock() {
        setLoading(true)
        const { data, error } = await supabase
            .from('finished_stock')
            .select(`
        id, 
        product_name, 
        bottles_available, 
        bottle_size_ml, 
        created_at,
        batch:batches(batch_number)
      `)
            .order('created_at', { ascending: false })

        if (data) setStock(data as any)
        setLoading(false)
    }

    return (
        <div className="w-full space-y-8 animate-fadeIn">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Finished Stock</h1>
                <p className="text-[var(--muted-foreground)]">Inventory of bottled, ready-to-sell products.</p>
            </div>

            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-[var(--muted)] text-[var(--muted-foreground)] font-medium">
                            <tr>
                                <th className="p-4 rounded-tl-lg">Product</th>
                                <th className="p-4">Batch Ref</th>
                                <th className="p-4">Size</th>
                                <th className="p-4 text-right rounded-tr-lg">Quantity (Bottles)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border)]">
                            {loading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <tr key={i}>
                                        <td className="p-4"><Skeleton className="h-5 w-32" /></td>
                                        <td className="p-4"><Skeleton className="h-5 w-16" /></td>
                                        <td className="p-4"><Skeleton className="h-5 w-12" /></td>
                                        <td className="p-4"><Skeleton className="h-5 w-8 ml-auto" /></td>
                                    </tr>
                                ))
                            ) : stock.length === 0 ? (
                                <tr><td colSpan={4} className="p-12 text-center text-[var(--muted-foreground)]">No finished stock yet. Bottle some batches!</td></tr>
                            ) : (
                                stock.map(item => (
                                    <tr key={item.id} className="hover:bg-[var(--muted)]/50 transition-colors">
                                        <td className="p-4 font-bold md:text-base">{item.product_name}</td>
                                        <td className="p-4 text-[var(--muted-foreground)] font-mono">#{item.batch?.batch_number}</td>
                                        <td className="p-4">{item.bottle_size_ml}ml</td>
                                        <td className="p-4 text-right font-mono font-bold text-lg">{item.bottles_available}</td>
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
