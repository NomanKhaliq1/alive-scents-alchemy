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
                    material_id: string | null
                    ingredient_name: string | null
                    ingredient_type: string | null // NEW
                    percentage: number
                }
                Insert: {
                    id?: string
                    formula_id: string
                    material_id?: string | null
                    ingredient_name?: string | null
                    ingredient_type?: string | null
                    percentage: number
                }
                Update: {
                    id?: string
                    formula_id?: string
                    material_id?: string | null
                    ingredient_name?: string | null
                    ingredient_type?: string | null
                    percentage?: number
                }
            }
            batches: {
                Row: {
                    id: string
                    created_at: string
                    batch_number: number
                    formula_id: string
                    type: 'Fixative' | 'Base' | 'Perfume'
                    total_quantity: number
                    unit: string
                    status: 'Bonding' | 'Ready' | 'Finished'
                    bonding_start_date: string | null
                    bonding_end_date_estimated: string | null
                    notes: string | null
                }
                Insert: {
                    id?: string
                    created_at?: string
                    batch_number?: number
                    formula_id: string
                    type: 'Fixative' | 'Base' | 'Perfume'
                    total_quantity: number
                    unit?: string
                    status?: 'Bonding' | 'Ready' | 'Finished'
                    bonding_start_date?: string | null
                    bonding_end_date_estimated?: string | null
                    notes?: string | null
                }
                Update: {
                    id?: string
                    created_at?: string
                    batch_number?: number
                    formula_id?: string
                    type?: 'Fixative' | 'Base' | 'Perfume'
                    total_quantity?: number
                    unit?: string
                    status?: 'Bonding' | 'Ready' | 'Finished'
                    bonding_start_date?: string | null
                    bonding_end_date_estimated?: string | null
                    notes?: string | null
                }
            }
            purchases: {
                Row: {
                    id: string
                    material_id: string
                    dealer_id: string | null
                    quantity: number
                    cost: number
                    purchase_date: string
                    notes: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    material_id: string
                    dealer_id?: string | null
                    quantity: number
                    cost: number
                    purchase_date?: string
                    notes?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    material_id?: string
                    dealer_id?: string | null
                    quantity?: number
                    cost?: number
                    purchase_date?: string
                    notes?: string | null
                    created_at?: string
                }
            }
            sales: {
                Row: {
                    id: string
                    product_id: string
                    quantity_sold: number
                    sale_price: number
                    total_amount: number | null // Generated column
                    customer_name: string | null
                    sale_date: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    product_id: string
                    quantity_sold: number
                    sale_price: number
                    customer_name?: string | null
                    sale_date?: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    product_id?: string
                    quantity_sold?: number
                    sale_price?: number
                    customer_name?: string | null
                    sale_date?: string
                    created_at?: string
                }
            }
            finished_stock: {
                Row: {
                    id: string
                    batch_id: string
                    product_name: string
                    bottles_available: number
                    bottle_size_ml: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    batch_id: string
                    product_name: string
                    bottles_available?: number
                    bottle_size_ml: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    batch_id?: string
                    product_name?: string
                    bottles_available?: number
                    bottle_size_ml?: number
                    created_at?: string
                }
            }
            formula_steps: {
                Row: {
                    id: string
                    formula_id: string
                    step_number: number
                    instruction: string
                    bonding_days: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    formula_id: string
                    step_number: number
                    instruction: string
                    bonding_days?: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    formula_id?: string
                    step_number?: number
                    instruction?: string
                    bonding_days?: number
                    created_at?: string
                }
            }
        }
    }
}
