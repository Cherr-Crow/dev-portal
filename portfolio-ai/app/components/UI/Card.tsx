'use client'

import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
}

export const Card = ({ children, className = '' }: CardProps) => {
  return (
    <div className={`bg-[#161b22] border border-[#30363d] rounded-lg ${className}`}>
      {children}
    </div>
  )
}

export const CardHeader = ({ children, className = '' }: CardProps) => {
  return (
    <div className={`px-6 py-4 border-b border-[#30363d] ${className}`}>
      {children}
    </div>
  )
}

export const CardBody = ({ children, className = '' }: CardProps) => {
  return (
    <div className={`px-6 py-4 ${className}`}>
      {children}
    </div>
  )
}

export const CardFooter = ({ children, className = '' }: CardProps) => {
  return (
    <div className={`px-6 py-4 border-t border-[#30363d] ${className}`}>
      {children}
    </div>
  )
}