import { CSSProperties, ReactNode } from 'react'
import './card.scss'

interface CardProps {
  children: ReactNode,
  className?: string,
  style?: CSSProperties
}

const Card = ({ children, className, style }: CardProps) => {
  return <div className={`card ${className || ''}`} style={{ ...style }}>{children}</div>
}

export default Card
