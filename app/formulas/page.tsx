
import { supabase } from "@/lib/db/supabase"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import Link from "next/link"

// Using 'any' strictly for speed now, will replace with Types in next step
export default async function FormulasPage() {
    const { data: formulas, error } = await supabase
        .from('formulas')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="p-8 mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Formulas</h1>
                <Link href="/formulas/create">
                    <Button>+ New Formula</Button>
                </Link>
            </div>

            {error && <div className="text-red-500 mb-4">Error loading formulas</div>}

            <div className="grid gap-4 md:grid-cols-3">
                {formulas?.map((formula: any) => (
                    <Card key={formula.id} className="hover:shadow-md transition-shadow">
                        <h2 className="font-semibold text-lg">{formula.name}</h2>
                        <div className="text-sm text-gray-500 mt-1">{formula.type}</div>
                        {formula.notes && <p className="text-gray-600 mt-2 text-sm line-clamp-2">{formula.notes}</p>}
                    </Card>
                ))}
                {formulas?.length === 0 && (
                    <p className="text-gray-500 col-span-3 text-center py-12">No formulas found. Create your first one.</p>
                )}
            </div>
        </div>
    )
}
