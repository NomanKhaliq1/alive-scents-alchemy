
'use client'

import { useState, useEffect, use } from 'react'
import { supabase } from '@/lib/db/supabase'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input, Select } from '@/components/ui/FormElements'
import { Skeleton } from '@/components/ui/Skeleton'
import Link from 'next/link'

type DealerPrice = {
    id: string
    material: { name: string, unit: string }
    price: number
    currency: string
    updated_at: string
}

export default function DealerDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)

    const [dealer, setDealer] = useState<any>(null)
    const [prices, setPrices] = useState<DealerPrice[]>([])
    const [materials, setMaterials] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    // Add Price Form
    const [selectedMaterial, setSelectedMaterial] = useState('')
    const [price, setPrice] = useState('')
    const [currency, setCurrency] = useState('PKR')

    useEffect(() => {
        fetchData()
    }, [id])

    async function fetchData() {
        setLoading(true)
        // 1. Dealer Info
        const { data: d } = await supabase.from('dealers').select('*').eq('id', id).single()
        if (d) setDealer(d)

        // 2. Prices
        const { data: p } = await supabase
            .from('dealer_prices')
            .select('id, price, currency, updated_at, material:materials(name, unit)')
            .eq('dealer_id', id)
            .order('updated_at', { ascending: false })
        if (p) setPrices(p as any)

        // 3. All Materials (for dropdown)
        const { data: m } = await supabase.from('materials').select('id, name').order('name')
        if (m) setMaterials(m)

        setLoading(false)
    }

    async function addPrice(e: React.FormEvent) {
        e.preventDefault()
        if (!selectedMaterial || !price) return

        const { error } = await supabase.from('dealer_prices').insert([{
            dealer_id: id,
            material_id: selectedMaterial,
            price: parseFloat(price),
            currency
        }])

        if (!error) {
            setPrice('')
            setSelectedMaterial('')
            fetchData() // Refresh list
        } else {
            alert('Error adding price')
        }
    }

    if (loading) return <div className="p-8"><Skeleton className="h-12 w-1/3 mb-8" /></div>
    if (!dealer) return <div className="p-8">Dealer not found</div>

    return (
        <div className="w-full space-y-8 animate-fadeIn">
            <div>
                <Link href="/dealers" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] mb-2 inline-block">← Back to Dealers</Link>
                <h1 className="text-3xl font-bold tracking-tight">{dealer.name}</h1>
                <p className="text-[var(--muted-foreground)]">{dealer.city || 'No City'} • {dealer.contact_info || 'No Contact'}</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* LEFT: Price List */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <h3 className="font-bold text-lg mb-4">Price List</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-[var(--muted)] text-[var(--muted-foreground)] font-medium">
                                    <tr>
                                        <th className="p-3 rounded-tl-lg">Material</th>
                                        <th className="p-3 text-right">Price</th>
                                        <th className="p-3 text-right rounded-tr-lg">Last Updated</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--border)]">
                                    {prices.length === 0 ? (
                                        <tr><td colSpan={3} className="p-8 text-center text-[var(--muted-foreground)]">No quotes added yet.</td></tr>
                                    ) : (
                                        prices.map(item => (
                                            <tr key={item.id} className="hover:bg-[var(--muted)]/50">
                                                <td className="p-3 font-medium">{item.material?.name}</td>
                                                <td className="p-3 text-right font-mono">
                                                    {item.currency} {item.price} <span className="text-[var(--muted-foreground)] text-xs">/ {item.material?.unit}</span>
                                                </td>
                                                <td className="p-3 text-right text-[var(--muted-foreground)] text-xs">
                                                    {new Date(item.updated_at).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>

                {/* RIGHT: Add New Quote Form */}
                <div>
                    <Card className="sticky top-24">
                        <h3 className="font-bold text-lg mb-4">Add Price Quote</h3>
                        <form onSubmit={addPrice} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold mb-1">Material</label>
                                <Select required value={selectedMaterial} onChange={e => setSelectedMaterial(e.target.value)}>
                                    <option value="">-- Select Material --</option>
                                    {materials.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                                </Select>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-xs font-bold mb-1">Price</label>
                                    <Input required type="number" min="0" step="0.01" value={price} onChange={e => setPrice(e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold mb-1">Currency</label>
                                    <Select value={currency} onChange={e => setCurrency(e.target.value)}>
                                        <option value="PKR">PKR</option>
                                        <option value="USD">USD</option>
                                        <option value="EUR">EUR</option>
                                        <option value="AED">AED</option>
                                    </Select>
                                </div>
                            </div>

                            <Button type="submit" className="w-full">Add Quote</Button>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    )
}
