'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'primary', size = 'md', fullWidth = false, className = '', ...props }, ref) => {
    const baseStyles = 'font-medium rounded-md transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
    
    const variants = {
      primary: 'bg-[#238636] hover:bg-[#2ea043] text-white',
      secondary: 'bg-[#21262d] hover:bg-[#30363d] text-white border border-[#30363d]',
      danger: 'bg-[#f85149] hover:bg-[#da3633] text-white',
      ghost: 'bg-transparent hover:bg-[#21262d] text-[#c9d1d9]'
    }
    
    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base'
    }
    
    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'