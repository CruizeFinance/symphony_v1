import { ReactNode } from 'react'
import './card.scss'

interface CardProps {
  children: ReactNode,
  className?: string
}

const Card = ({ children, className }: CardProps) => {
  return <div className={`card ${className || ''}`}>{children}</div>
}

export default Card
