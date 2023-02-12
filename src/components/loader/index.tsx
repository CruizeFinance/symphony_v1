import { rem } from '../../utils'
import './loader.scss'

interface LoaderProps {
  width?: string | number
  height?: string | number
}

const Loader = ({ width, height }: LoaderProps) => {
  return (
    <div
      className="loader"
      style={{ width: rem(width || 28), height: rem(height || 28) }}
    />
  )
}

export default Loader
