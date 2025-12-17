'use client'

import { useState, useRef, useEffect } from 'react'

interface ComboboxProps {
    options: string[]
    value: string
    onChange: (value: string) => void
    placeholder?: string
    className?: string
}

export function Combobox({ options, value, onChange, placeholder = 'Select...', className = '' }: ComboboxProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [search, setSearch] = useState('')
    const containerRef = useRef<HTMLDivElement>(null)

    // Sync external value to local search if not open (acting as display)
    useEffect(() => {
        if (!isOpen) {
            setSearch(value)
        }
    }, [value, isOpen])

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
                // If the user typed something but didn't click an option, we still take that value (Creatable)
                // But we don't need to do anything here because 'search' logic handles the input change locally
                // Ideally we want to ensure the parent has the value. The parent updates via onChange on every keystroke in this design?
                // No, let's keep it simple: On blur, we just close. The value was updated via onChange during typing.
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const filteredOptions = options.filter(opt =>
        opt.toLowerCase().includes(search.toLowerCase())
    )

    const handleInputClick = () => {
        setIsOpen(true)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
        onChange(e.target.value) // Propagate custom value immediately
        setIsOpen(true)
    }

    const handleOptionClick = (option: string) => {
        onChange(option)
        setSearch(option)
        setIsOpen(false)
    }

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            <div className="relative">
                <input
                    type="text"
                    value={search}
                    onChange={handleInputChange}
                    onClick={handleInputClick}
                    onFocus={() => setIsOpen(true)}
                    placeholder={placeholder}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm transition-all outline-none focus:bg-white/10 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 placeholder:text-white/20 text-[var(--foreground)]"
                />
                <div
                    className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/40"
                >
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                        <path d="M1 1L5 5L9 1" />
                    </svg>
                </div>
            </div>

            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-[#0f1021] border border-white/10 rounded-xl shadow-2xl max-h-60 overflow-y-auto custom-scrollbar animate-fadeIn ring-1 ring-black/50">
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option) => (
                            <button
                                key={option}
                                onClick={() => handleOptionClick(option)}
                                className={`w-full text-left px-4 py-3 text-sm hover:bg-violet-500/10 transition-colors border-b border-white/5 last:border-0 ${option === value ? 'text-violet-400 bg-violet-500/5' : 'text-white/80'
                                    }`}
                            >
                                {option}
                            </button>
                        ))
                    ) : (
                        <div className="px-4 py-3 text-sm text-white/40 italic cursor-pointer hover:bg-white/5 hover:text-violet-400 transition-colors" onClick={() => handleOptionClick(search)}>
                            Create "{search}"
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

