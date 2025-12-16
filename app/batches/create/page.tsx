
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/db/supabase'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input, Select } from '@/components/ui/FormElements'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Formula = {
    id: string
    name: string
    type: string
}

type FormulaItem = {
    material: {
        id: string,
        name: string,
        category: string,
        material_inventory: { quantity_available: number }[]
    }
    percentage: number
}

export default function CreateBatchPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formulas, setFormulas] = useState<Formula[]>([])

    // Form State
    const [selectedFormulaId, setSelectedFormulaId] = useState('')
    const [batchType, setBatchType] = useState('Perfume')
    const [totalQuantity, setTotalQuantity] = useState<number>(100)
    const [unit, setUnit] = useState('ml') // Assuming 'ml' for stock logic simplicity in v1
    const [notes, setNotes] = useState('')

    // Validation State
    const [items, setItems] = useState<FormulaItem[]>([])
    const [stockStatus, setStockStatus] = useState<'ok' | 'insufficient' | 'checking'>('checking')
    const [missingItems, setMissingItems] = useState<string[]>([])

    // Load Formulas
    useEffect(() => {
        supabase.from('formulas').select('id, name, type').order('name')
            .then(({ data }) => setFormulas(data || []))
    }, [])

    // Check Stock Logic
    useEffect(() => {
        if (!selectedFormulaId) {
            setItems([])
            setStockStatus('ok')
            return
        }

        const checkStock = async () => {
            setStockStatus('checking')
            // Fetch ingredients
            const { data } = await supabase
                .from('formula_items')
                .select('percentage, material:materials(id, name, category, material_inventory(quantity_available))')
                .eq('formula_id', selectedFormulaId)

            const recipeItems = (data as any) || []
            setItems(recipeItems)

            // Calculate missing
            const missing: string[] = []
            recipeItems.forEach((item: FormulaItem) => {
                const required = (item.percentage / 100) * totalQuantity
                const available = item.material.material_inventory?.[0]?.quantity_available || 0
                if (available < required) {
                    missing.push(`${item.material.name} (Need: ${required.toFixed(2)}${unit}, Have: ${available})`)
                }
            })

            if (missing.length > 0) {
                setMissingItems(missing)
                setStockStatus('insufficient')
            } else {
                setMissingItems([])
                setStockStatus('ok')
            }
        }

        checkStock()

    }, [selectedFormulaId, totalQuantity, unit])


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (stockStatus !== 'ok') return

        if (!confirm(`This will permanently deduct materials from inventory. Create ${totalQuantity}${unit} batch?`)) {
            return
        }

        setLoading(true)

        try {
            // 1. Create Batch Record
            const { data: batch, error: batchError } = await supabase
                .from('batches')
                .insert([{
                    formula_id: selectedFormulaId,
                    type: batchType,
                    total_quantity: totalQuantity,
                    unit: unit,
                    status: 'Bonding',
                    bonding_start_date: new Date().toISOString(),
                    notes: notes
                }])
                .select()
                .single()

            if (batchError) throw batchError

            // 2. Deduct Stock (Iteratively for v1)
            for (const item of items) {
                const required = (item.percentage / 100) * totalQuantity
                const currentStock = item.material.material_inventory?.[0]?.quantity_available || 0
                const newStock = currentStock - required

                const { error: stockError } = await supabase
                    .from('material_inventory')
                    .update({
                        quantity_available: newStock,
                        last_updated: new Date().toISOString()
                    })
                    .eq('material_id', item.material.id)

                if (stockError) console.error('Error updating stock for', item.material.name, stockError)
            }

            router.push('/batches')
            router.refresh()

        } catch (err: any) {
            alert('Error creating batch: ' + err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-fadeIn">
            <div>
                <Link href="/batches" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] mb-2 inline-block">← Back to Batches</Link>
                <h1 className="text-3xl font-bold tracking-tight">New Production Batch</h1>
                <p className="text-[var(--muted-foreground)]">Create a batch and deduct raw materials.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card className="space-y-6">

                    {/* Formula Selection */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Select Formula</label>
                        <Select
                            required
                            value={selectedFormulaId}
                            onChange={e => setSelectedFormulaId(e.target.value)}
                        >
                            <option value="">-- Choose Recipe --</option>
                            {formulas.map(f => (
                                <option key={f.id} value={f.id}>{f.name} ({f.type})</option>
                            ))}
                        </Select>
                    </div>

                    {/* Batch Details */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Batch Type</label>
                            <Select
                                value={batchType}
                                onChange={e => setBatchType(e.target.value)}
                            >
                                <option value="Perfume">Perfume</option>
                                <option value="Fixative">Fixative</option>
                                <option value="Base">Base</option>
                            </Select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Total Quantity</label>
                            <div className="flex gap-2">
                                <Input
                                    type="number"
                                    required
                                    min="1"
                                    value={totalQuantity}
                                    onChange={e => setTotalQuantity(parseFloat(e.target.value))}
                                />
                                <Select
                                    value={unit}
                                    onChange={e => setUnit(e.target.value)}
                                    className="w-24"
                                >
                                    <option value="ml">ml</option>
                                    <option value="g">g</option>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Notes</label>
                        <Input
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            placeholder="Optional batch notes (e.g. experimental maceration)"
                        />
                    </div>

                    {/* Availability Check */}
                    {selectedFormulaId && (
                        <div className={`p-4 rounded-xl border ${stockStatus === 'insufficient' ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                            <h3 className={`font-bold text-sm mb-2 ${stockStatus === 'insufficient' ? 'text-red-700' : 'text-green-700'}`}>
                                {stockStatus === 'checking' ? 'Checking Inventory...' :
                                    stockStatus === 'insufficient' ? 'Insufficient Stock!' :
                                        'Inventory Available'}
                            </h3>

                            {stockStatus === 'insufficient' && (
                                <ul className="list-disc list-inside text-xs text-red-600 space-y-1">
                                    {missingItems.map((msg, i) => <li key={i}>{msg}</li>)}
                                </ul>
                            )}

                            {stockStatus === 'ok' && (
                                <p className="text-xs text-green-600">
                                    All {items.length} ingredients are available for deduction.
                                </p>
                            )}
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={loading || stockStatus !== 'ok' || !selectedFormulaId}
                    >
                        {loading ? 'Processing...' : 'Create Batch & Deduct Stock'}
                    </Button>

                </Card>
            </form>
        </div>
    )
}
