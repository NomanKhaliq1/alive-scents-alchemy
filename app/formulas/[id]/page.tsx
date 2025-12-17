'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/db/supabase'
import { Input, Select } from '@/components/ui/FormElements'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useToast } from '@/components/ui/Toast'
import { Combobox } from '@/components/ui/Combobox' // Added Import

export default function EditFormulaPage(props: { params: Promise<{ id: string }> }) {
    const params = use(props.params)
    const [name, setName] = useState('')
    const [type, setType] = useState('Perfume')
    const [notes, setNotes] = useState('')

    // Notebook State
    const [ingredients, setIngredients] = useState<{ name: string, type: string, percentage: number }[]>([])
    const [steps, setSteps] = useState<{ instruction: string, days: number }[]>([])

    // Inputs
    const [currentIngredientName, setCurrentIngredientName] = useState('')
    const [currentType, setCurrentType] = useState('')
    const [currentPercentage, setCurrentPercentage] = useState<number>(0)

    const [currentStepDesc, setCurrentStepDesc] = useState('')
    const [currentStepDays, setCurrentStepDays] = useState(0)

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const router = useRouter()
    const toast = useToast() // Added Hook

    // 1. Load Data
    useEffect(() => {
        const loadFormula = async () => {
            // Fetch Formula
            const { data: formula, error: fError } = await supabase
                .from('formulas')
                .select('*')
                .eq('id', params.id)
                .single()

            if (fError) {
                alert('Formula not found!')
                router.push('/formulas')
                return
            }

            setName(formula.name)
            setType(formula.type)
            setNotes(formula.notes || '')

            // Fetch Ingredients
            const { data: items, error: iError } = await supabase
                .from('formula_items')
                .select('*')
                .eq('formula_id', params.id)

            if (items) {
                setIngredients(items.map((i: any) => ({
                    name: i.ingredient_name || i.material?.name || 'Unknown', // Fallback
                    type: i.ingredient_type || 'Oil',
                    percentage: i.percentage
                })))
            }

            // Fetch Steps
            const { data: formulaSteps, error: sError } = await supabase
                .from('formula_steps')
                .select('*')
                .eq('formula_id', params.id)
                .order('step_number')

            if (formulaSteps) {
                setSteps(formulaSteps.map((s: any) => ({
                    instruction: s.instruction,
                    days: s.bonding_days
                })))
            }

            setLoading(false)
        }
        loadFormula()
    }, [params.id])

    // 2. Logic (Same as Create)
    const addIngredient = () => {
        if (!currentIngredientName || currentPercentage <= 0) return
        setIngredients([...ingredients, {
            name: currentIngredientName,
            type: currentType || 'Oil',
            percentage: currentPercentage
        }])
        setCurrentIngredientName('')
        setCurrentType('')
        setCurrentPercentage(0)
    }

    const removeIngredient = (index: number) => {
        setIngredients(ingredients.filter((_, i) => i !== index))
    }

    const addStep = () => {
        if (!currentStepDesc) return
        setSteps([...steps, { instruction: currentStepDesc, days: currentStepDays }])
        setCurrentStepDesc('')
        setCurrentStepDays(0)
    }

    const removeStep = (index: number) => {
        setSteps(steps.filter((_, i) => i !== index))
    }

    // 3. Update Function
    const handleUpdate = async () => {
        setSaving(true)
        const total = ingredients.reduce((sum, item) => sum + item.percentage, 0)
        if (Math.abs(total - 100) > 0.1) {
            toast.error(`Total percentage must be 100%. Current: ${total}%`) // Toast
            setSaving(false)
            return
        }

        try {
            // Update Formula
            const { error: fError } = await supabase
                .from('formulas')
                .update({
                    name,
                    type,
                    notes,
                    default_bonding_days: steps.reduce((s, step) => s + step.days, 0)
                })
                .eq('id', params.id)
            if (fError) throw fError

            // Delete existing Items & Re-insert (Easiest way for bulk edits)
            await supabase.from('formula_items').delete().eq('formula_id', params.id)
            await supabase.from('formula_steps').delete().eq('formula_id', params.id)

            // Insert Items
            const newItems = ingredients.map(item => ({
                formula_id: params.id,
                ingredient_name: item.name,
                ingredient_type: item.type,
                percentage: item.percentage
            }))
            await supabase.from('formula_items').insert(newItems)

            // Insert Steps
            if (steps.length > 0) {
                const newSteps = steps.map((step, index) => ({
                    formula_id: params.id,
                    step_number: index + 1,
                    instruction: step.instruction,
                    bonding_days: step.days
                }))
                await supabase.from('formula_steps').insert(newSteps)
            }

            toast.success('Formula Updated!') // Toast
            router.refresh()

        } catch (err: any) {
            toast.error('Error updating: ' + err.message) // Toast
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <div className="p-8 text-center">Loading Formula...</div>

    return (
        <div className="max-w-[1600px] mx-auto space-y-6 animate-fadeIn p-4">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Link href="/formulas" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
                        ← Back
                    </Link>
                    <div className="h-6 w-px bg-white/10" />
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Edit Formula</h1>
                        <p className="text-xs text-[var(--muted-foreground)] hidden md:block">
                            ID: {params.id.split('-')[0]}...
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => router.push('/formulas/create')}>
                        + New
                    </Button>
                    <Button onClick={handleUpdate} disabled={saving}>
                        {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* LEFT COLUMN: Meta & Process (4 cols) */}
                <div className="lg:col-span-4 space-y-6">
                    {/* 1. Basic Info Card */}
                    <Card className="space-y-4">
                        <h3 className="font-semibold text-[var(--foreground)] border-b border-white/5 pb-2">Details</h3>
                        <div>
                            <label className="block text-xs font-medium mb-1.5 text-[var(--muted-foreground)]">Name</label>
                            <Input value={name} onChange={e => setName(e.target.value)} className="bg-white/5" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium mb-1.5 text-[var(--muted-foreground)]">Type</label>
                            <Combobox
                                value={type}
                                onChange={setType}
                                options={['Perfume', 'Cologne', 'Eau de Parfum', 'Oil_Blend', 'Attar', 'Raw Ingredient', 'Fixative', 'Base', 'Experimental']}
                                placeholder="Select type..."
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium mb-1.5 text-[var(--muted-foreground)]">Notes</label>
                            <textarea
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--primary)] min-h-[100px]"
                                value={notes}
                                onChange={e => setNotes(e.target.value)}
                            />
                        </div>
                    </Card>

                    {/* 2. Process Guide Card */}
                    <Card className="space-y-4">
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                            <h3 className="font-semibold text-[var(--foreground)]">Process Guide</h3>
                            <span className="text-xs text-[var(--muted-foreground)]">{steps.reduce((s, x) => s + x.days, 0)} days total</span>
                        </div>

                        <div className="flex items-end gap-2">
                            <div className="flex-1">
                                <Input
                                    value={currentStepDesc}
                                    onChange={e => setCurrentStepDesc(e.target.value)}
                                    placeholder="Add instruction..."
                                    className="bg-white/5"
                                />
                            </div>
                            <div className="w-20">
                                <Input
                                    type="number"
                                    value={currentStepDays}
                                    onChange={e => setCurrentStepDays(parseInt(e.target.value) || 0)}
                                    placeholder="Days"
                                    className="bg-white/5"
                                />
                            </div>
                            <Button onClick={addStep} disabled={!currentStepDesc} variant="secondary" className="px-3">
                                +
                            </Button>
                        </div>

                        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
                            {steps.map((step, i) => (
                                <div key={i} className="group flex items-start justify-between gap-2 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm">
                                    <div className="flex gap-3">
                                        <span className="text-[var(--muted-foreground)] font-mono text-xs pt-0.5">{i + 1}.</span>
                                        <p className="loading-relaxed">{step.instruction}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {step.days > 0 && <span className="text-xs text-[var(--primary)] bg-[var(--primary)]/10 px-1.5 py-0.5 rounded">{step.days}d</span>}
                                        <button onClick={() => removeStep(i)} className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                                    </div>
                                </div>
                            ))}
                            {steps.length === 0 && <p className="text-xs text-[var(--muted-foreground)] text-center py-4 italic">No steps defined.</p>}
                        </div>
                    </Card>
                </div>

                {/* RIGHT COLUMN: Ingredients (8 cols) */}
                <div className="lg:col-span-8">
                    <Card className="h-full flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-semibold text-lg text-[var(--foreground)]">Formula Composition</h3>
                            <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="text-[var(--muted-foreground)]">Count:</span>
                                    <span className="font-mono">{ingredients.length}</span>
                                </div>
                                <div className="h-4 w-px bg-white/10" />
                                <div className="flex items-center gap-2">
                                    <span className="text-[var(--muted-foreground)]">Total:</span>
                                    <span className={`font-bold font-mono ${ingredients.reduce((s, i) => s + i.percentage, 0) === 100 ? 'text-green-400' : 'text-amber-400'}`}>
                                        {ingredients.reduce((s, i) => s + i.percentage, 0)}%
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Input Row */}
                        <div className="p-4 bg-[var(--background)] rounded-xl border border-white/10 mb-6 shadow-inner">
                            <div className="flex items-end gap-3">
                                <div className="flex-[3]">
                                    <label className="block text-xs font-medium mb-1.5 text-[var(--muted-foreground)]">Ingredient</label>
                                    <Input
                                        value={currentIngredientName}
                                        onChange={e => setCurrentIngredientName(e.target.value)}
                                        placeholder="Search or type name..."
                                        className="bg-white/5 border-white/10"
                                        autoFocus
                                    />
                                </div>
                                <div className="flex-[2]">
                                    <label className="block text-xs font-medium mb-1.5 text-[var(--muted-foreground)]">Category</label>
                                    <Input
                                        list="ingredient-types"
                                        value={currentType}
                                        onChange={e => setCurrentType(e.target.value)}
                                        placeholder="Oil, Base..."
                                        className="bg-white/5 border-white/10"
                                    />
                                    <datalist id="ingredient-types">
                                        <option value="Oil" />
                                        <option value="Fixative" />
                                        <option value="Base" />
                                        <option value="Top Note" />
                                        <option value="Heart Note" />
                                        <option value="Base Note" />
                                    </datalist>
                                </div>
                                <div className="w-24">
                                    <label className="block text-xs font-medium mb-1.5 text-[var(--muted-foreground)]">Percent</label>
                                    <div className="relative">
                                        <Input
                                            type="number"
                                            value={currentPercentage}
                                            onChange={e => setCurrentPercentage(parseFloat(e.target.value))}
                                            placeholder="0"
                                            className="bg-white/5 border-white/10 pr-6 text-right font-mono"
                                            onKeyDown={(e) => { if (e.key === 'Enter') addIngredient() }}
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--muted-foreground)]">%</span>
                                    </div>
                                </div>
                                <Button onClick={addIngredient} disabled={!currentIngredientName || currentPercentage <= 0} className="px-6">
                                    Add
                                </Button>
                            </div>
                        </div>

                        {/* Ingredients Table */}
                        <div className="flex-1 rounded-xl border border-white/5 overflow-hidden flex flex-col">
                            {/* Header */}
                            <div className="bg-white/5 px-6 py-3 flex text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
                                <div className="flex-[3]">Ingredient Name</div>
                                <div className="flex-[2]">Type</div>
                                <div className="w-24 text-right">Percentage</div>
                                <div className="w-12"></div>
                            </div>

                            {/* Body */}
                            <div className="flex-1 overflow-y-auto min-h-[400px] custom-scrollbar bg-black/20">
                                {ingredients.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-[var(--muted-foreground)] space-y-2 opacity-50">
                                        <div className="text-4xl">🧪</div>
                                        <p>Notebook is empty</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-white/5">
                                        {ingredients.map((item, i) => (
                                            <div key={i} className="flex items-center px-6 py-3 hover:bg-white/5 transition-colors group text-sm">
                                                <div className="flex-[3] font-medium text-[var(--foreground)]">
                                                    {item.name}
                                                </div>
                                                <div className="flex-[2] text-[var(--muted-foreground)]">
                                                    {item.type}
                                                </div>
                                                <div className="w-24 text-right font-mono text-[var(--primary)]">
                                                    {item.percentage}%
                                                </div>
                                                <div className="w-12 text-right">
                                                    <button
                                                        onClick={() => removeIngredient(i)}
                                                        className="text-white/20 hover:text-red-400 transition-colors p-1"
                                                    >
                                                        <span className="sr-only">Delete</span>
                                                        ×
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Footer Summary */}
                            <div className="bg-white/5 border-t border-white/5 px-6 py-4 flex justify-between items-center">
                                <div className="text-sm text-[var(--muted-foreground)]">
                                    Total Ingredients: <span className="text-[var(--foreground)]">{ingredients.length}</span>
                                </div>
                                <div className="text-xl font-bold font-mono">
                                    <span className={ingredients.reduce((s, i) => s + i.percentage, 0) === 100 ? 'text-green-400' : 'text-amber-400'}>
                                        {ingredients.reduce((s, i) => s + i.percentage, 0).toFixed(2)}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
