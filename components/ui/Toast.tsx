'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

type ToastType = 'success' | 'error' | 'info'

type Toast = {
    id: string
    message: string
    type: ToastType
}

type ToastContextType = {
    toast: (message: string, type?: ToastType) => void
    success: (message: string) => void
    error: (message: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([])

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id))
    }, [])

    const addToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Math.random().toString(36).substr(2, 9)
        setToasts(prev => [...prev, { id, message, type }])
        // Auto remove after 3s
        setTimeout(() => removeToast(id), 3000)
    }, [removeToast])

    const success = useCallback((msg: string) => addToast(msg, 'success'), [addToast])
    const error = useCallback((msg: string) => addToast(msg, 'error'), [addToast])

    return (
        <ToastContext.Provider value={{ toast: addToast, success, error }}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
                {toasts.map(t => (
                    <div
                        key={t.id}
                        className={`
                            pointer-events-auto px-4 py-3 rounded-lg shadow-lg font-medium text-sm animate-fadeIn
                            min-w-[200px] flex items-center gap-2 transform transition-all
                            ${t.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : ''}
                            ${t.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : ''}
                            ${t.type === 'info' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : ''}
                        `}
                    >
                        {t.type === 'success' && <span>✓</span>}
                        {t.type === 'error' && <span>✕</span>}
                        {t.message}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    )
}

export function useToast() {
    const context = useContext(ToastContext)
    if (!context) throw new Error('useToast must be used within a ToastProvider')
    return context
}
