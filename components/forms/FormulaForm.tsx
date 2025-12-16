
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/db/supabase'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
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
        <form onSubmit={handleSubmit} className="space-y-6">

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded border border-red-200">
                    {error}
                </div>
            )}

            <Card>
                <h3 className="font-semibold mb-4 text-gray-700">Basic Details</h3>
                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium mb-1">Formula Name</label>
                        <input
                            required
                            className="w-full border rounded p-2"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="e.g. Midnight Jasmine"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Type</label>
                        <select
                            className="w-full border rounded p-2"
                            value={type}
                            onChange={e => setType(e.target.value)}
                        >
                            <option value="Perfume">Perfume</option>
                            <option value="Fixative">Fixative</option>
                            <option value="Base">Base</option>
                            <option value="Oil_Blend">Oil Blend</option>
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Notes</label>
                        <textarea
                            className="w-full border rounded p-2"
                            rows={3}
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                        />
                    </div>
                </div>
            </Card>

            <Card>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-700">Ingredients</h3>
                    <div className={`font-bold ${totalPercentage === 100 ? 'text-green-600' : 'text-orange-500'}`}>
                        Total: {totalPercentage}%
                    </div>
                </div>

                <div className="space-y-3">
                    {items.map((item, index) => (
                        <div key={index} className="flex gap-2 items-start">
                            <div className="flex-1">
                                <select
                                    required
                                    className="w-full border rounded p-2"
                                    value={item.material_id}
                                    onChange={e => updateItem(index, 'material_id', e.target.value)}
                                >
                                    <option value="">Select Material...</option>
                                    {materials.map(m => (
                                        <option key={m.id} value={m.id}>
                                            {m.name} ({m.category})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="w-28">
                                <input
                                    type="number"
                                    step="0.01"
                                    required
                                    className="w-full border rounded p-2"
                                    placeholder="%"
                                    value={item.percentage}
                                    onChange={e => updateItem(index, 'percentage', parseFloat(e.target.value))}
                                />
                            </div>
                            <Button
                                type="button"
                                variant="danger"
                                onClick={() => handleRemoveItem(index)}
                                className="px-3"
                            >
                                ×
                            </Button>
                        </div>
                    ))}
                </div>

                <button
                    type="button"
                    onClick={handleAddItem}
                    className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                    + Add Ingredient
                </button>

            </Card>

            <div className="flex justify-end gap-3">
                <Button
                    type="button"
                    variant="secondary"
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
