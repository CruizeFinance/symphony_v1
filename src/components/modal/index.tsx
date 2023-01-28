import { CSSProperties, ReactNode } from 'react'
import './modal.scss'

interface ModalProps {
  open: boolean
  hide: () => void
  children: ReactNode
  modalStyle?: CSSProperties
  modalContentStyle?: CSSProperties
}

const Modal = ({
  children,
  open,
  hide,
  modalContentStyle,
  modalStyle,
}: ModalProps) => {
  if (!open) return null

  return (
    <div className="modal-container" onClick={hide} style={{ ...modalStyle }}>
      <div
        className="modal-content-style"
        style={{ ...modalContentStyle }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

export default Modal
