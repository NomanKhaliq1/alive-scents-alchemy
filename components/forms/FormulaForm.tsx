
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/db/supabase'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input, Select } from '@/components/ui/FormElements'
import { useRouter } from 'next/navigation'

type Material = {
    id: string
    name: string
    category: string
}

type FormulaItemRow = {
    material_id: string
    percentage: number
}

export default function FormulaForm() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [materials, setMaterials] = useState<Material[]>([])
    const [error, setError] = useState<string | null>(null)

    // Form State
    const [name, setName] = useState('')
    const [type, setType] = useState('Perfume')
    const [notes, setNotes] = useState('')
    const [items, setItems] = useState<FormulaItemRow[]>([{ material_id: '', percentage: 0 }])

    useEffect(() => {
        // Load materials for the dropdown
        async function loadMaterials() {
            const { data } = await supabase.from('materials').select('id, name, category').order('name')
            if (data) setMaterials(data)
        }
        loadMaterials()
    }, [])

    const totalPercentage = items.reduce((sum, item) => sum + (Number(item.percentage) || 0), 0)

    const handleAddItem = () => {
        setItems([...items, { material_id: '', percentage: 0 }])
    }

    const handleRemoveItem = (index: number) => {
        const newItems = [...items]
        newItems.splice(index, 1)
        setItems(newItems)
    }

    const updateItem = (index: number, field: keyof FormulaItemRow, value: any) => {
        const newItems = [...items]
        newItems[index] = { ...newItems[index], [field]: value }
        setItems(newItems)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        // Validation
        if (Math.abs(totalPercentage - 100) > 0.1) {
            setError(`Total percentage must be exactly 100%. Current: ${totalPercentage}%`)
            return
        }
        if (items.some(i => !i.material_id)) {
            setError('All ingredients must have a selected material.')
            return
        }

        setLoading(true)

        try {
            // 1. Create Formula
            const { data: formulaData, error: formulaError } = await supabase
                .from('formulas')
                .insert([{ name, type, notes }])
                .select()
                .single()

            if (formulaError) throw formulaError

            // 2. Create Items
            const formulaItems = items.map(item => ({
                formula_id: formulaData.id,
                material_id: item.material_id,
                percentage: item.percentage
            }))

            const { error: itemsError } = await supabase
                .from('formula_items')
                .insert(formulaItems)

            if (itemsError) throw itemsError

            // Success
            router.push('/formulas')
            router.refresh()

        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-sm font-medium">
                    {error}
                </div>
            )}

            <Card>
                <h3 className="text-xl font-bold mb-6 tracking-tight">Basic Details</h3>
                <div className="grid gap-6 md:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-500">Formula Name</label>
                        <Input
                            required
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="e.g. Midnight Jasmine"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-500">Type</label>
                        <Select
                            value={type}
                            onChange={e => setType(e.target.value)}
                        >
                            <option value="Perfume">Perfume</option>
                            <option value="Fixative">Fixative</option>
                            <option value="Base">Base</option>
                            <option value="Oil_Blend">Oil Blend</option>
                        </Select>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2 text-gray-500">Notes</label>
                        <textarea
                            className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl p-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[var(--foreground)]/10 focus:border-[var(--foreground)] placeholder:text-[var(--muted-foreground)]"
                            rows={3}
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                        />
                    </div>
                </div>
            </Card>

            <Card>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold tracking-tight">Ingredients</h3>
                    <div className={`px-3 py-1 rounded-full text-sm font-bold border ${totalPercentage === 100 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-orange-50 text-orange-700 border-orange-200'}`}>
                        Total: {totalPercentage}%
                    </div>
                </div>

                <div className="space-y-3">
                    {items.map((item, index) => (
                        <div key={index} className="flex gap-3 items-start animate-fadeIn">
                            <div className="flex-1">
                                <Select
                                    required
                                    value={item.material_id}
                                    onChange={e => updateItem(index, 'material_id', e.target.value)}
                                >
                                    <option value="">Select Material...</option>
                                    {materials.map(m => (
                                        <option key={m.id} value={m.id}>
                                            {m.name} ({m.category})
                                        </option>
                                    ))}
                                </Select>
                            </div>
                            <div className="w-28">
                                <Input
                                    type="number"
                                    step="0.01"
                                    required
                                    placeholder="%"
                                    value={item.percentage}
                                    onChange={e => updateItem(index, 'percentage', parseFloat(e.target.value))}
                                />
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => handleRemoveItem(index)}
                                className="hover:bg-red-50 hover:text-red-500 px-3"
                            >
                                ×
                            </Button>
                        </div>
                    ))}
                </div>

                <Button
                    type="button"
                    variant="secondary"
                    onClick={handleAddItem}
                    className="mt-6 w-full md:w-auto"
                >
                    + Add Ingredient
                </Button>

            </Card>

            <div className="flex justify-end gap-3 pt-4">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={() => router.back()}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={loading || totalPercentage !== 100}
                    className={loading ? 'opacity-50' : ''}
                >
                    {loading ? 'Saving...' : 'Save Formula'}
                </Button>
            </div>
        </form>
    )
}
