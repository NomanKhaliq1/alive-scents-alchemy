export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            materials: {
                Row: {
                    id: string
                    created_at: string
                    name: string
                    category: 'Oil' | 'Fixative' | 'Base' | 'Solvent' | 'Additive'
                    description: string | null
                    unit: string
                    dealer_preference: string | null
                }
                Insert: {
                    id?: string
                    created_at?: string
                    name: string
                    category: 'Oil' | 'Fixative' | 'Base' | 'Solvent' | 'Additive'
                    description?: string | null
                    unit?: string
                    dealer_preference?: string | null
                }
                Update: {
                    id?: string
                    created_at?: string
                    name?: string
                    category?: 'Oil' | 'Fixative' | 'Base' | 'Solvent' | 'Additive'
                    description?: string | null
                    unit?: string
                    dealer_preference?: string | null
                }
            }
            material_inventory: {
                Row: {
                    id: string
                    material_id: string
                    quantity_available: number
                    reorder_level: number
                    last_updated: string
                }
                Insert: {
                    id?: string
                    material_id: string
                    quantity_available?: number
                    reorder_level?: number
                    last_updated?: string
                }
                Update: {
                    id?: string
                    material_id?: string
                    quantity_available?: number
                    reorder_level?: number
                    last_updated?: string
                }
            }
            formulas: {
                Row: {
                    id: string
                    created_at: string
                    name: string
                    type: 'Fixative' | 'Base' | 'Perfume' | 'Oil_Blend'
                    notes: string | null
                    default_bonding_days: number | null
                }
                Insert: {
                    id?: string
                    created_at?: string
                    name: string
                    type: 'Fixative' | 'Base' | 'Perfume' | 'Oil_Blend'
                    notes?: string | null
                    default_bonding_days?: number | null
                }
                Update: {
                    id?: string
                    created_at?: string
                    name?: string
                    type?: 'Fixative' | 'Base' | 'Perfume' | 'Oil_Blend'
                    notes?: string | null
                    default_bonding_days?: number | null
                }
            }
            formula_items: {
                Row: {
                    id: string
                    formula_id: string
                    material_id: string
                    percentage: number
                }
                Insert: {
                    id?: string
                    formula_id: string
                    material_id: string
                    percentage: number
                }
                Update: {
                    id?: string
                    formula_id?: string
                    material_id?: string
                    percentage?: number
                }
            }
        }
    }
}
