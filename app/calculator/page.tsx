
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/db/supabase'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input, Select } from '@/components/ui/FormElements'

type Formula = {
    id: string
    name: string
    type: string
}

type FormulaItem = {
    material: { name: string, category: string }
    percentage: number
}

// Logic:
// Qty = (Total Amount * Percentage) / 100

export default function CalculatorPage() {
    const [formulas, setFormulas] = useState<Formula[]>([])
    const [selectedFormulaId, setSelectedFormulaId] = useState('')
    const [totalAmount, setTotalAmount] = useState<number>(100) // Default 100ml
    const [unit, setUnit] = useState('ml')
    const [items, setItems] = useState<FormulaItem[]>([])
    const [loading, setLoading] = useState(false)

    // Load Formulas
    useEffect(() => {
        supabase.from('formulas').select('id, name, type').order('name')
            .then(({ data }) => setFormulas(data || []))
    }, [])

    // Load Ingredients when formula selected
    useEffect(() => {
        if (!selectedFormulaId) {
            setItems([])
            return
        }

        setLoading(true)
        supabase
            .from('formula_items')
            .select('percentage, material:materials(name, category)')
            .eq('formula_id', selectedFormulaId)
            .then(({ data }) => {
                setItems(data as any || [])
                setLoading(false)
            })
    }, [selectedFormulaId])

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Formula Batch Calculator</h1>
                <p className="text-[var(--muted-foreground)]">Scale your recipes precisely for production.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Controls */}
                <Card className="md:col-span-1 space-y-6 h-fit">
                    <div>
                        <label className="block text-sm font-medium mb-2">Select Formula</label>
                        <Select
                            value={selectedFormulaId}
                            onChange={e => setSelectedFormulaId(e.target.value)}
                        >
                            <option value="">-- Choose Recipe --</option>
                            {formulas.map(f => (
                                <option key={f.id} value={f.id}>{f.name} ({f.type})</option>
                            ))}
                        </Select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Total Batch Size</label>
                        <div className="flex gap-2">
                            <Input
                                type="number"
                                value={totalAmount}
                                onChange={e => setTotalAmount(Number(e.target.value))}
                            />
                            <Select
                                value={unit}
                                onChange={e => setUnit(e.target.value)}
                                className="w-24"
                            >
                                <option value="ml">ml</option>
                                <option value="g">g</option>
                                <option value="kg">kg</option>
                                <option value="L">L</option>
                            </Select>
                        </div>
                    </div>
                </Card>

                {/* Results Table */}
                <Card className="md:col-span-2 min-h-[400px]">
                    {!selectedFormulaId ? (
                        <div className="h-full flex flex-col items-center justify-center text-[var(--muted-foreground)]">
                            <svg className="w-12 h-12 mb-4 opacity-20" fill="currentColor" viewBox="0 0 24 24"><path d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                            <p>Select a formula to calculate ingredients</p>
                        </div>
                    ) : (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-bold">Required Materials</h2>
                                <div className="text-right text-sm text-[var(--muted-foreground)]">
                                    Total Output: <b>{totalAmount}{unit}</b>
                                </div>
                            </div>

                            {loading ? (
                                <div className="animate-pulse space-y-4">
                                    {[1, 2, 3].map(i => <div key={i} className="h-10 bg-zinc-100 rounded-lg dark:bg-zinc-800"></div>)}
                                </div>
                            ) : (
                                <div className="overflow-hidden border border-[var(--border)] rounded-lg">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-[var(--muted)] text-[var(--muted-foreground)] font-medium">
                                            <tr>
                                                <th className="p-3">Material</th>
                                                <th className="p-3 text-right">Percent</th>
                                                <th className="p-3 text-right">Quantity ({unit})</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[var(--border)]">
                                            {items.map((item, idx) => {
                                                const qty = (item.percentage / 100) * totalAmount
                                                return (
                                                    <tr key={idx} className="hover:bg-[var(--muted)]/50">
                                                        <td className="p-3 font-medium">
                                                            {item.material.name}
                                                            <span className="ml-2 text-xs text-[var(--muted-foreground)] font-normal border border-[var(--border)] px-1.5 py-0.5 rounded-full">{item.material.category}</span>
                                                        </td>
                                                        <td className="p-3 text-right">{item.percentage}%</td>
                                                        <td className="p-3 text-right font-bold font-mono text-base">
                                                            {qty.toFixed(2)}
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                        <tfoot className="bg-[var(--muted)]/30 font-bold">
                                            <tr>
                                                <td className="p-3">Total</td>
                                                <td className="p-3 text-right">100%</td>
                                                <td className="p-3 text-right">{totalAmount.toFixed(2)}</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </Card>
            </div>
        </div>
    )
}
