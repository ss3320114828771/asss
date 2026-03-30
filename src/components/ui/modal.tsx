/* eslint-disable react-hooks/set-state-in-effect */
'use client'

import React, { useEffect, useRef, useState } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full' | 'auto'
  position?: 'center' | 'top' | 'bottom'
  closeOnBackdropClick?: boolean
  closeOnEscape?: boolean
  showCloseButton?: boolean
  showHeader?: boolean
  showFooter?: boolean
  footer?: React.ReactNode
  loading?: boolean
  className?: string
  overlayClassName?: string
  contentClassName?: string
  headerClassName?: string
  footerClassName?: string
  onAfterOpen?: () => void
  onAfterClose?: () => void
}

export default function Modal({ 
  isOpen, 
  onClose, 
  children, 
  title,
  size = 'md',
  position = 'center',
  closeOnBackdropClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  showHeader = true,
  showFooter = false,
  footer,
  loading = false,
  className = '',
  overlayClassName = '',
  contentClassName = '',
  headerClassName = '',
  footerClassName = '',
  onAfterOpen,
  onAfterClose
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  // Size classes
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[90vw] w-full',
    auto: 'max-w-none w-auto'
  }

  // Position classes
  const positionClasses = {
    center: 'items-center',
    top: 'items-start pt-16',
    bottom: 'items-end pb-16'
  }

  // Handle escape key
  useEffect(() => {
    if (!closeOnEscape) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen && !loading) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose, closeOnEscape, loading])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setIsAnimating(true)
      if (onAfterOpen) onAfterOpen()
      
      // Small delay for animation
      setTimeout(() => setIsAnimating(false), 200)
    } else {
      document.body.style.overflow = 'unset'
      if (onAfterClose) onAfterClose()
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onAfterOpen, onAfterClose])

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnBackdropClick && !loading && e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm transition-all duration-300 ${positionClasses[position]} ${overlayClassName}`}
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className={`bg-white rounded-xl shadow-2xl transform transition-all duration-300 ${
          isAnimating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        } ${sizeClasses[size]} ${className}`}
      >
        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-90 rounded-xl flex items-center justify-center z-10">
            <div className="flex flex-col items-center gap-3">
              <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-gray-600">Loading...</span>
            </div>
          </div>
        )}

        {/* Header */}
        {showHeader && (title || showCloseButton) && (
          <div className={`flex justify-between items-center p-6 border-b border-gray-200 ${headerClassName}`}>
            {title && (
              <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            )}
            {showCloseButton && !loading && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-1"
                aria-label="Close modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className={`p-6 ${contentClassName}`}>
          {children}
        </div>

        {/* Footer */}
        {showFooter && footer && (
          <div className={`flex justify-end gap-3 p-6 border-t border-gray-200 ${footerClassName}`}>
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}