'use client'

import React, { useState, useEffect, useRef } from 'react'

export interface DropdownItem {
  label: string
  value: string
  icon?: React.ReactNode
  disabled?: boolean
  danger?: boolean
  divider?: boolean
  subtext?: string
  shortcut?: string
}

interface DropdownProps {
  trigger: React.ReactNode
  items: DropdownItem[]
  onSelect?: (value: string) => void
  position?: 'top' | 'bottom' | 'left' | 'right'
  align?: 'start' | 'center' | 'end'
  width?: 'auto' | 'full' | number
  closeOnSelect?: boolean
  closeOnClickOutside?: boolean
  showArrow?: boolean
  className?: string
  menuClassName?: string
  header?: React.ReactNode
  footer?: React.ReactNode
  maxHeight?: string
}

export default function Dropdown({ 
  trigger, 
  items, 
  onSelect,
  position = 'bottom',
  align = 'start',
  width = 'auto',
  closeOnSelect = true,
  closeOnClickOutside = true,
  showArrow = true,
  className = '',
  menuClassName = '',
  header,
  footer,
  maxHeight = '320px'
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!closeOnClickOutside) return

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [closeOnClickOutside])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen])

  const handleSelect = (item: DropdownItem) => {
    if (item.disabled) return
    if (onSelect) onSelect(item.value)
    if (closeOnSelect) setIsOpen(false)
  }

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  // Position classes
  const positionClasses = {
    bottom: 'top-full mt-2',
    top: 'bottom-full mb-2',
    left: 'right-full mr-2 top-0',
    right: 'left-full ml-2 top-0'
  }

  // Align classes
  const alignClasses = {
    start: 'left-0',
    center: 'left-1/2 -translate-x-1/2',
    end: 'right-0'
  }

  // Arrow position classes
  const arrowPositionClasses = {
    bottom: 'top-0 -translate-y-1/2',
    top: 'bottom-0 translate-y-1/2',
    left: 'right-0 translate-x-1/2 top-1/2 -translate-y-1/2',
    right: 'left-0 -translate-x-1/2 top-1/2 -translate-y-1/2'
  }

  const arrowAlignClasses = {
    start: 'left-4',
    center: 'left-1/2 -translate-x-1/2',
    end: 'right-4'
  }

  // Width classes
  const widthClasses = {
    auto: 'min-w-[160px]',
    full: 'w-full',
    custom: ''
  }

  const menuWidth = typeof width === 'number' ? `${width}px` : widthClasses[width as keyof typeof widthClasses]

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      {/* Trigger */}
      <div onClick={toggleDropdown} className="cursor-pointer">
        {trigger}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={menuRef}
          className={`absolute z-50 ${positionClasses[position]} ${alignClasses[align]} ${
            width === 'auto' ? widthClasses.auto : ''
          } ${menuClassName}`}
          style={{ width: menuWidth }}
        >
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden animate-fadeIn relative">
            {/* Arrow */}
            {showArrow && (
              <div 
                className={`absolute w-3 h-3 bg-white border border-gray-200 transform rotate-45 ${arrowPositionClasses[position]} ${arrowAlignClasses[align]}`}
                style={{
                  ...(position === 'bottom' && { borderTop: 'none', borderLeft: 'none' }),
                  ...(position === 'top' && { borderBottom: 'none', borderRight: 'none' }),
                  ...(position === 'left' && { borderTop: 'none', borderRight: 'none' }),
                  ...(position === 'right' && { borderBottom: 'none', borderLeft: 'none' })
                }}
              />
            )}

            {/* Header */}
            {header && (
              <div className="px-4 py-2 border-b border-gray-100 bg-gray-50">
                {header}
              </div>
            )}

            {/* Items */}
            <div className="overflow-y-auto" style={{ maxHeight }}>
              {items.map((item, index) => (
                <React.Fragment key={index}>
                  {item.divider ? (
                    <div className="h-px bg-gray-200 my-1" />
                  ) : (
                    <button
                      onClick={() => handleSelect(item)}
                      disabled={item.disabled}
                      className={`
                        w-full px-4 py-2 text-left text-sm transition-colors duration-150
                        flex items-center justify-between gap-2
                        ${item.disabled 
                          ? 'opacity-50 cursor-not-allowed text-gray-400' 
                          : item.danger
                            ? 'text-red-600 hover:bg-red-50'
                            : 'text-gray-700 hover:bg-gray-100'
                        }
                      `}
                    >
                      <div className="flex items-center gap-2">
                        {item.icon && <span className="text-base">{item.icon}</span>}
                        <div className="flex flex-col items-start">
                          <span>{item.label}</span>
                          {item.subtext && (
                            <span className="text-xs text-gray-500">{item.subtext}</span>
                          )}
                        </div>
                      </div>
                      {item.shortcut && (
                        <span className="text-xs text-gray-400">{item.shortcut}</span>
                      )}
                    </button>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Footer */}
            {footer && (
              <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
                {footer}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}