
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/db/supabase'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input, Select } from '@/components/ui/FormElements'
import { Skeleton } from '@/components/ui/Skeleton'

type Purchase = {
    id: string
    material: { name: string, unit: string }
    dealer: { name: string } | null
    quantity: number
    cost: number
    purchase_date: string
}

export default function PurchasesPage() {
    const [purchases, setPurchases] = useState<Purchase[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)

    // Form State
    const [materials, setMaterials] = useState<any[]>([])
    const [dealers, setDealers] = useState<any[]>([])

    const [selectedMaterial, setSelectedMaterial] = useState('')
    const [selectedDealer, setSelectedDealer] = useState('')
    const [quantity, setQuantity] = useState('')
    const [cost, setCost] = useState('')
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])

    useEffect(() => {
        fetchData()
    }, [])

    async function fetchData() {
        setLoading(true)
        // Purchases
        const { data: p } = await supabase
            .from('purchases')
            .select('*, material:materials(name, unit), dealer:dealers(name)')
            .order('purchase_date', { ascending: false })
        if (p) setPurchases(p as any)

        // Materials
        const { data: m } = await supabase.from('materials').select('id, name').order('name')
        if (m) setMaterials(m)

        // Dealers
        const { data: d } = await supabase.from('dealers').select('id, name').order('name')
        if (d) setDealers(d)

        setLoading(false)
    }

    async function handlePurchase(e: React.FormEvent) {
        e.preventDefault()
        if (!selectedMaterial || !quantity || !cost) return

        const qty = parseFloat(quantity)
        const costVal = parseFloat(cost)

        // 1. Create Purchase Record
        const { error: purchaseError } = await supabase.from('purchases').insert([{
            material_id: selectedMaterial,
            dealer_id: selectedDealer || null,
            quantity: qty,
            cost: costVal,
            purchase_date: date
        }])

        if (purchaseError) {
            alert('Error recording purchase: ' + purchaseError.message)
            return
        }

        // 2. Update Inventory (Fetch current first)
        const { data: inv } = await supabase
            .from('material_inventory')
            .select('quantity_available')
            .eq('material_id', selectedMaterial)
            .single()

        const currentQty = inv?.quantity_available || 0
        const newQty = currentQty + qty

        const { error: stockError } = await supabase
            .from('material_inventory')
            .upsert({
                material_id: selectedMaterial,
                quantity_available: newQty,
                last_updated: new Date().toISOString()
            }, { onConflict: 'material_id' })

        if (stockError) {
            alert('Purchase recorded but stock update failed: ' + stockError.message)
        } else {
            // Reset
            setQuantity('')
            setCost('')
            setShowForm(false)
            fetchData()
        }
    }

    return (
        <div className="space-y-8 animate-fadeIn w-full">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Purchases</h1>
                    <p className="text-[var(--muted-foreground)]">Record expenses and restock raw materials.</p>
                </div>
                <Button onClick={() => setShowForm(!showForm)}>{showForm ? 'Cancel' : '+ New Purchase'}</Button>
            </div>

            {showForm && (
                <Card className="animate-in fade-in slide-in-from-top-4 border-l-4 border-l-blue-500">
                    <h3 className="font-bold text-lg mb-4">Record Purchase</h3>
                    <form onSubmit={handlePurchase} className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                        <div className="lg:col-span-1">
                            <label className="block text-xs font-bold mb-1">Material</label>
                            <Select required value={selectedMaterial} onChange={e => setSelectedMaterial(e.target.value)}>
                                <option value="">-- Select --</option>
                                {materials.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                            </Select>
                        </div>
                        <div className="lg:col-span-1">
                            <label className="block text-xs font-bold mb-1">Supplier (Optional)</label>
                            <Select value={selectedDealer} onChange={e => setSelectedDealer(e.target.value)}>
                                <option value="">-- None --</option>
                                {dealers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                            </Select>
                        </div>
                        <div className="lg:col-span-1">
                            <label className="block text-xs font-bold mb-1">Quantity</label>
                            <Input required type="number" step="any" min="0" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="Amount" />
                        </div>
                        <div className="lg:col-span-1">
                            <label className="block text-xs font-bold mb-1">Total Cost</label>
                            <Input required type="number" step="0.01" min="0" value={cost} onChange={e => setCost(e.target.value)} placeholder="Currency" />
                        </div>
                        <div className="lg:col-span-1">
                            <Button type="submit" className="w-full">Save & Restock</Button>
                        </div>
                    </form>
                </Card>
            )}

            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-[var(--muted)] text-[var(--muted-foreground)] font-medium">
                            <tr>
                                <th className="p-4 rounded-tl-lg">Date</th>
                                <th className="p-4">Material</th>
                                <th className="p-4">Supplier</th>
                                <th className="p-4 text-right">Quantity</th>
                                <th className="p-4 text-right rounded-tr-lg">Cost</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border)]">
                            {loading ? (
                                <tr><td colSpan={5} className="p-4 text-center"><Skeleton className="h-6 w-full" /></td></tr>
                            ) : purchases.length === 0 ? (
                                <tr><td colSpan={5} className="p-8 text-center text-[var(--muted-foreground)]">No purchase history.</td></tr>
                            ) : (
                                purchases.map(p => (
                                    <tr key={p.id} className="hover:bg-[var(--muted)]/50">
                                        <td className="p-4 text-[var(--muted-foreground)]">{new Date(p.purchase_date).toLocaleDateString()}</td>
                                        <td className="p-4 font-medium">{p.material?.name}</td>
                                        <td className="p-4 text-[var(--muted-foreground)]">{p.dealer?.name || '-'}</td>
                                        <td className="p-4 text-right font-mono">{p.quantity} <span className="text-xs text-[var(--muted-foreground)]">{p.material?.unit}</span></td>
                                        <td className="p-4 text-right font-mono font-bold text-blue-600 dark:text-blue-400">
                                            {p.cost.toLocaleString()}
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
