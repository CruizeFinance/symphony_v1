import { CSSProperties, ReactNode } from 'react'
import './button.scss'

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  style?: CSSProperties
  disabled?: boolean
}

const Button = ({ children, onClick, style, disabled }: ButtonProps) => {
  return (
    <button
      className="button"
      onClick={onClick}
      style={{ ...style }}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export default Button
