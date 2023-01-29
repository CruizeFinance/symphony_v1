import { ReactNode, useRef } from 'react'
import './collapsible.scss'

interface CollapsibleProps {
  isOpen: boolean
  content: ReactNode
}

const Collapsible = ({ isOpen, content }: CollapsibleProps) => {
  const contentRef = useRef<HTMLDivElement>(null)

  if (isOpen) {
    contentRef.current?.style.setProperty(
      '--collapsible-content-height',
      `${contentRef.current?.scrollHeight}px`,
    )
  }

  return (
    
      <div ref={contentRef} className={`collapsible-content ${isOpen ? 'open' : ''}`}>
        {content}
      </div>
    
  )
}

export default Collapsible
