
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/db/supabase'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/FormElements'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/Skeleton'

type Dealer = {
    id: string
    name: string
    contact_info: string
    city: string
}

export default function DealersPage() {
    const [dealers, setDealers] = useState<Dealer[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)

    // New Dealer State
    const [name, setName] = useState('')
    const [contact, setContact] = useState('')
    const [city, setCity] = useState('')

    useEffect(() => {
        fetchDealers()
    }, [])

    async function fetchDealers() {
        setLoading(true)
        const { data } = await supabase.from('dealers').select('*').order('name')
        if (data) setDealers(data)
        setLoading(false)
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        const { error } = await supabase.from('dealers').insert([{ name, contact_info: contact, city }])
        if (!error) {
            setName('')
            setContact('')
            setCity('')
            setShowForm(false)
            fetchDealers()
        } else {
            alert('Error adding dealer')
        }
    }

    return (
        <div className="w-full space-y-8 animate-fadeIn">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Dealers & Suppliers</h1>
                    <p className="text-[var(--muted-foreground)]">Manage your raw material sources.</p>
                </div>
                <Button onClick={() => setShowForm(!showForm)}>{showForm ? 'Cancel' : '+ Add Dealer'}</Button>
            </div>

            {showForm && (
                <Card className="animate-in fade-in slide-in-from-top-4">
                    <form onSubmit={handleSubmit} className="grid md:grid-cols-4 gap-4 items-end">
                        <div className="md:col-span-1">
                            <label className="block text-xs font-bold mb-1">Name</label>
                            <Input required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. A.S. Qurashi" />
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-xs font-bold mb-1">Contact</label>
                            <Input value={contact} onChange={e => setContact(e.target.value)} placeholder="Phone or Email" />
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-xs font-bold mb-1">City</label>
                            <Input value={city} onChange={e => setCity(e.target.value)} placeholder="e.g. Karachi" />
                        </div>
                        <div className="md:col-span-1">
                            <Button type="submit" className="w-full">Save Dealer</Button>
                        </div>
                    </form>
                </Card>
            )}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                    Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-40 w-full" />)
                ) : dealers.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-[var(--muted-foreground)] border border-dashed border-[var(--border)] rounded-xl">
                        No dealers added yet.
                    </div>
                ) : (
                    dealers.map(dealer => (
                        <Link key={dealer.id} href={`/dealers/${dealer.id}`} className="block group">
                            <Card className="h-full hover:border-[var(--foreground)] transition-colors">
                                <h3 className="font-bold text-lg mb-2">{dealer.name}</h3>
                                <div className="space-y-1 text-sm text-[var(--muted-foreground)]">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                        <span>{dealer.contact_info || 'No contact info'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        <span>{dealer.city || 'Unknown City'}</span>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    ))
                )}
            </div>
        </div>
    )
}
