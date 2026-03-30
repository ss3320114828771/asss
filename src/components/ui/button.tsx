/* eslint-disable react-hooks/static-components */
import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info' | 'outline' | 'ghost'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  fullWidth?: boolean
  loading?: boolean
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full'
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  children: React.ReactNode
}

export default function Button({ 
  variant = 'primary', 
  size = 'md',
  fullWidth = false,
  loading = false,
  rounded = 'lg',
  icon,
  iconPosition = 'left',
  children, 
  className = '', 
  disabled,
  ...props 
}: ButtonProps) {
  
  // Base styles
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  // Size variants
  const sizeStyles = {
    xs: 'px-2 py-1 text-xs gap-1',
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-base gap-2',
    lg: 'px-6 py-3 text-lg gap-2',
    xl: 'px-8 py-4 text-xl gap-3'
  }
  
  // Rounded variants
  const roundedStyles = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full'
  }
  
  // Variant styles
  const variantStyles = {
    primary: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg transform hover:scale-105 focus:ring-blue-500',
    secondary: 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white shadow-md hover:shadow-lg transform hover:scale-105 focus:ring-gray-500',
    danger: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-md hover:shadow-lg transform hover:scale-105 focus:ring-red-500',
    success: 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-md hover:shadow-lg transform hover:scale-105 focus:ring-green-500',
    warning: 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white shadow-md hover:shadow-lg transform hover:scale-105 focus:ring-yellow-500',
    info: 'bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white shadow-md hover:shadow-lg transform hover:scale-105 focus:ring-cyan-500',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 hover:border-blue-700 hover:text-blue-700 focus:ring-blue-500 transform hover:scale-105',
    ghost: 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-500'
  }
  
  // Width styles
  const widthStyles = fullWidth ? 'w-full' : ''
  
  // Loading spinner with different sizes
  const LoadingSpinner = () => {
    const spinnerSize = {
      xs: 'h-3 w-3',
      sm: 'h-3.5 w-3.5',
      md: 'h-4 w-4',
      lg: 'h-5 w-5',
      xl: 'h-6 w-6'
    }
    
    return (
      <svg 
        className={`animate-spin ${spinnerSize[size]}`} 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24"
      >
        <circle 
          className="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="4"
        />
        <path 
          className="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    )
  }
  
  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${roundedStyles[rounded]} ${widthStyles} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <LoadingSpinner />}
      {!loading && icon && iconPosition === 'left' && (
        <span className="inline-flex">{icon}</span>
      )}
      <span className={loading ? 'opacity-0 absolute' : ''}>
        {children}
      </span>
      {!loading && icon && iconPosition === 'right' && (
        <span className="inline-flex">{icon}</span>
      )}
    </button>
  )
}