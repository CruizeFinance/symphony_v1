import { CSSProperties, ReactNode } from 'react'
import './button.scss'

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  style?: CSSProperties
  disabled?: boolean
  className?: string
}

const Button = ({
  children,
  onClick,
  style,
  disabled,
  className,
}: ButtonProps) => {
  return (
    <button
      className={`button ${className || ''}`}
      onClick={!disabled ? () => onClick && onClick() : undefined}
      style={{ ...style }}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export default Button
