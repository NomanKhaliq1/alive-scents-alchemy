
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/db/supabase'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input, Select } from '@/components/ui/FormElements'

type InventoryItem = {
    id: string // material_id
    name: string
    category: string
    current_stock: number
    reorder_level: number
    last_updated: string | null
}

export default function InventoryPage() {
    const [items, setItems] = useState<InventoryItem[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterCategory, setFilterCategory] = useState('All')

    // Stock Update State
    const [editingId, setEditingId] = useState<string | null>(null)
    const [adjustAmount, setAdjustAmount] = useState<string>('')
    const [newReorderLevel, setNewReorderLevel] = useState<string>('')
    const [updateLoading, setUpdateLoading] = useState(false)

    useEffect(() => {
        fetchInventory()
    }, [])

    async function fetchInventory() {
        setLoading(true)
        // Fetch materials and join with inventory
        // Note: Assuming 1:1 relationship for simplicity in this view. 
        // In schema, material_inventory uses material_id.

        const { data: materials, error } = await supabase
            .from('materials')
            .select(`
        id, 
        name, 
        category, 
        material_inventory(quantity_available, reorder_level, last_updated)
      `)
            .order('name')

        if (error) {
            console.error('Error fetching inventory:', error)
        } else {
            const flattened = materials.map((m: any) => ({
                id: m.id,
                name: m.name,
                category: m.category,
                current_stock: m.material_inventory?.[0]?.quantity_available || 0,
                reorder_level: m.material_inventory?.[0]?.reorder_level || 0,
                last_updated: m.material_inventory?.[0]?.last_updated
            }))
            setItems(flattened)
        }
        setLoading(false)
    }

    const handleUpdateStock = async (materialId: string) => {
        setUpdateLoading(true)
        const stockVal = parseFloat(adjustAmount)
        const reorderVal = parseFloat(newReorderLevel)

        const { error } = await supabase
            .from('material_inventory')
            .upsert({
                material_id: materialId,
                quantity_available: isNaN(stockVal) ? 0 : stockVal,
                reorder_level: isNaN(reorderVal) ? 0 : reorderVal,
                last_updated: new Date().toISOString()
            }, { onConflict: 'material_id' })

        if (!error) {
            setEditingId(null)
            setAdjustAmount('')
            setNewReorderLevel('')
            fetchInventory()
        } else {
            alert('Failed to update stock')
        }
        setUpdateLoading(false)
    }

    const filteredItems = items.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = filterCategory === 'All' || item.category === filterCategory
        return matchesSearch && matchesCategory
    })

    return (
        <div className="space-y-8 animate-fadeIn w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Inventory</h1>
                    <p className="text-[var(--muted-foreground)]">Manage raw material stock levels.</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Input
                        placeholder="Search materials..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="min-w-[200px]"
                    />
                    <Select
                        value={filterCategory}
                        onChange={e => setFilterCategory(e.target.value)}
                        className="w-[150px]"
                    >
                        <option value="All">All Categories</option>
                        <option value="Essential Oil">Essential Oil</option>
                        <option value="Aroma Chemical">Aroma Chemical</option>
                        <option value="Solvent">Solvent</option>
                        <option value="Fixative">Fixative</option>
                    </Select>
                </div>
            </div>

            <Card className="min-h-[500px]">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-[var(--muted)] text-[var(--muted-foreground)] font-medium">
                            <tr>
                                <th className="p-4 rounded-tl-lg">Material Name</th>
                                <th className="p-4">Category</th>
                                <th className="p-4 text-right">Stock Level (ml/g)</th>
                                <th className="p-4 text-right">Min Level</th>
                                <th className="p-4 text-center">Status</th>
                                <th className="p-4 rounded-tr-lg text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border)]">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i}>
                                        <td className="p-4"><div className="h-5 w-32 bg-[var(--muted)]/50 animate-pulse rounded"></div></td>
                                        <td className="p-4"><div className="h-5 w-24 bg-[var(--muted)]/50 animate-pulse rounded"></div></td>
                                        <td className="p-4"><div className="ml-auto h-5 w-16 bg-[var(--muted)]/50 animate-pulse rounded"></div></td>
                                        <td className="p-4"><div className="ml-auto h-5 w-12 bg-[var(--muted)]/50 animate-pulse rounded"></div></td>
                                        <td className="p-4"><div className="mx-auto h-5 w-16 bg-[var(--muted)]/50 animate-pulse rounded"></div></td>
                                        <td className="p-4"><div className="ml-auto h-8 w-20 bg-[var(--muted)]/50 animate-pulse rounded"></div></td>
                                    </tr>
                                ))
                            ) : filteredItems.length === 0 ? (
                                <tr><td colSpan={6} className="p-8 text-center text-[var(--muted-foreground)]">No materials found.</td></tr>
                            ) : (
                                filteredItems.map(item => (
                                    <tr key={item.id} className="hover:bg-[var(--muted)]/50 transition-colors">
                                        <td className="p-4 font-medium">{item.name}</td>
                                        <td className="p-4">
                                            <span className="px-2 py-1 rounded-full border border-[var(--border)] text-xs text-[var(--muted-foreground)]">
                                                {item.category}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right font-mono font-bold text-base">
                                            {editingId === item.id ? (
                                                <Input
                                                    type="number"
                                                    autoFocus
                                                    className="w-24 text-right h-8 py-1 inline-block"
                                                    value={adjustAmount}
                                                    // Pre-fill logic could go here
                                                    onChange={e => setAdjustAmount(e.target.value)}
                                                />
                                            ) : (
                                                item.current_stock
                                            )}
                                        </td>
                                        <td className="p-4 text-right text-[var(--muted-foreground)]">
                                            {editingId === item.id ? (
                                                <Input
                                                    type="number"
                                                    className="w-20 text-right h-8 py-1 inline-block"
                                                    value={newReorderLevel}
                                                    onChange={e => setNewReorderLevel(e.target.value)}
                                                />
                                            ) : (
                                                item.reorder_level
                                            )}
                                        </td>
                                        <td className="p-4 text-center">
                                            {item.current_stock <= item.reorder_level ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span> Low
                                                </span>
                                            ) : (
                                                <span className="text-green-600 dark:text-green-400 text-xs font-bold">OK</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right">
                                            {editingId === item.id ? (
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="primary"
                                                        className="h-8 px-3 text-xs"
                                                        onClick={() => handleUpdateStock(item.id)}
                                                        disabled={updateLoading}
                                                    >
                                                        Save
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        className="h-8 px-3 text-xs"
                                                        onClick={() => { setEditingId(null); setAdjustAmount(''); setNewReorderLevel('') }}
                                                    >
                                                        Cancel
                                                    </Button>
                                                </div>
                                            ) : (
                                                <Button
                                                    variant="secondary"
                                                    className="h-8 px-3 text-xs"
                                                    onClick={() => {
                                                        setEditingId(item.id)
                                                        setAdjustAmount(item.current_stock.toString())
                                                    }}
                                                >
                                                    Adjust
                                                </Button>
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
