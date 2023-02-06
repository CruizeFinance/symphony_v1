import { useState } from 'react'
import { Sprite, Tooltip } from '..'
import './tabs.scss'

interface TabsProps {
  type?: 'default' | 'contained'
  onChange?: (val: string) => void
  tabs: {
    label: string
    tooltip?: string
  }[]
  disabledTab?: string[]
}

const Tabs = ({ onChange, type, tabs, disabledTab }: TabsProps) => {
  const [defaultSelected, setDefaultSelected] = useState(
    tabs[0]
  )

  return (
    <div className={`tabs-container ${type || 'default'}`}>
      {tabs.map((tab) => (
        <div
          key={tab.label}
          className={`tab outlined ${
            defaultSelected.label === tab.label && !disabledTab?.includes(tab.label) ? 'selected' : ''
          }`}
          onClick={!disabledTab?.includes(tab.label) ? () =>  {
            onChange && onChange(tab.label)
            setDefaultSelected(tab)
          } : undefined}
          {...disabledTab?.includes(tab.label) ? { style: { cursor: 'not-allowed' } } : undefined}
        >
          <label className="label">{tab.label}</label>
          {tab.tooltip ? (
            <Tooltip text={tab.tooltip}>
              <Sprite id={'tooltip-icon'} width={21} height={20} />
            </Tooltip>
          ) : null}
        </div>
      ))}
    </div>
  )
}

export default Tabs
