'use client'

import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-[#c9d1d9] mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-md text-[#c9d1d9] placeholder:text-[#8b949e] focus:outline-none focus:border-[#238636] focus:ring-1 focus:ring-[#238636] transition-all ${error ? 'border-[#f85149]' : ''} ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-[#f85149]">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'