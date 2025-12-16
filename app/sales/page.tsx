
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/db/supabase'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input, Select } from '@/components/ui/FormElements'
import { Skeleton } from '@/components/ui/Skeleton'

type Sale = {
    id: string
    product: { product_name: string, bottle_size_ml: number }
    quantity_sold: number
    sale_price: number
    total_amount: number
    customer_name: string
    sale_date: string
}

export default function SalesPage() {
    const [sales, setSales] = useState<Sale[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)

    // Form State
    const [products, setProducts] = useState<any[]>([])
    const [selectedProduct, setSelectedProduct] = useState('')
    const [quantity, setQuantity] = useState('')
    const [price, setPrice] = useState('') // Unit Price
    const [customer, setCustomer] = useState('')
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])

    useEffect(() => {
        fetchData()
    }, [])

    async function fetchData() {
        setLoading(true)
        // Sales
        const { data: s } = await supabase
            .from('sales')
            .select('*, product:finished_stock(product_name, bottle_size_ml)')
            .order('sale_date', { ascending: false })
        if (s) setSales(s as any)

        // Available Products
        const { data: p } = await supabase
            .from('finished_stock')
            .select('id, product_name, bottle_size_ml, bottles_available')
            .gt('bottles_available', 0)
            .order('product_name')
        if (p) setProducts(p)

        setLoading(false)
    }

    async function handleSale(e: React.FormEvent) {
        e.preventDefault()
        if (!selectedProduct || !quantity || !price) return

        const qty = parseInt(quantity)
        const unitPrice = parseFloat(price)

        // 1. Check Availability (Double check)
        const product = products.find(p => p.id === selectedProduct)
        if (!product || product.bottles_available < qty) {
            alert('Insufficient stock!')
            return
        }

        // 2. Create Sale Record
        const { error: saleError } = await supabase.from('sales').insert([{
            product_id: selectedProduct,
            quantity_sold: qty,
            sale_price: unitPrice,
            customer_name: customer,
            sale_date: date
        }])

        if (saleError) {
            alert('Error recording sale: ' + saleError.message)
            return
        }

        // 3. Deduct Stock
        const { error: stockError } = await supabase
            .from('finished_stock')
            .update({ bottles_available: product.bottles_available - qty })
            .eq('id', selectedProduct)

        if (stockError) {
            alert('Sale recorded but stock deduction failed: ' + stockError.message)
        } else {
            // Reset
            setQuantity('')
            setPrice('')
            setCustomer('')
            setShowForm(false)
            fetchData()
        }
    }

    return (
        <div className="space-y-8 animate-fadeIn w-full">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Sales</h1>
                    <p className="text-[var(--muted-foreground)]">Record sales revenue and deduct finished stock.</p>
                </div>
                <Button onClick={() => setShowForm(!showForm)}>{showForm ? 'Cancel' : '+ New Sale'}</Button>
            </div>

            {showForm && (
                <Card className="animate-in fade-in slide-in-from-top-4 border-l-4 border-l-green-500">
                    <h3 className="font-bold text-lg mb-4">Record Sale</h3>
                    <form onSubmit={handleSale} className="grid md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
                        <div className="lg:col-span-2">
                            <label className="block text-xs font-bold mb-1">Product</label>
                            <Select required value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)}>
                                <option value="">-- Select Available Product --</option>
                                {products.map(p => (
                                    <option key={p.id} value={p.id}>
                                        {p.product_name} | {p.bottle_size_ml}ml | (Stock: {p.bottles_available})
                                    </option>
                                ))}
                            </Select>
                        </div>
                        <div className="lg:col-span-1">
                            <label className="block text-xs font-bold mb-1">Bottles Sold</label>
                            <Input required type="number" min="1" step="1" value={quantity} onChange={e => setQuantity(e.target.value)} />
                        </div>
                        <div className="lg:col-span-1">
                            <label className="block text-xs font-bold mb-1">Price / Unit</label>
                            <Input required type="number" min="0" step="0.01" value={price} onChange={e => setPrice(e.target.value)} />
                        </div>
                        <div className="lg:col-span-1">
                            <label className="block text-xs font-bold mb-1">Customer</label>
                            <Input value={customer} onChange={e => setCustomer(e.target.value)} placeholder="Name" />
                        </div>
                        <div className="lg:col-span-1">
                            <Button type="submit" className="w-full">Save Sale</Button>
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
                                <th className="p-4">Customer</th>
                                <th className="p-4">Product</th>
                                <th className="p-4 text-right">Sold</th>
                                <th className="p-4 text-right">Price/Unit</th>
                                <th className="p-4 text-right rounded-tr-lg">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border)]">
                            {loading ? (
                                <tr><td colSpan={6} className="p-4 text-center"><Skeleton className="h-6 w-full" /></td></tr>
                            ) : sales.length === 0 ? (
                                <tr><td colSpan={6} className="p-8 text-center text-[var(--muted-foreground)]">No sales recorded.</td></tr>
                            ) : (
                                sales.map(s => (
                                    <tr key={s.id} className="hover:bg-[var(--muted)]/50">
                                        <td className="p-4 text-[var(--muted-foreground)]">{new Date(s.sale_date).toLocaleDateString()}</td>
                                        <td className="p-4 font-medium">{s.customer_name || 'Walk-in'}</td>
                                        <td className="p-4">
                                            <div className="font-bold">{s.product?.product_name}</div>
                                            <div className="text-xs text-[var(--muted-foreground)]">{s.product?.bottle_size_ml}ml Bottle</div>
                                        </td>
                                        <td className="p-4 text-right font-mono">{s.quantity_sold}</td>
                                        <td className="p-4 text-right text-[var(--muted-foreground)]">{s.sale_price.toLocaleString()}</td>
                                        <td className="p-4 text-right font-mono font-bold text-green-600 dark:text-green-400">
                                            {s.total_amount?.toLocaleString()}
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
