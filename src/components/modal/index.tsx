import { CSSProperties, ReactNode } from 'react'
import './modal.scss'

interface ModalProps {
  open: boolean
  hide?: () => void
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

  return (
    <div className={`modal-container ${open ? 'show' : ''}`} onClick={hide} style={{ ...modalStyle }}>
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
