import React, { useState, useCallback } from 'react'
import { Divider, Button } from '@blueprintjs/core'
import { Switch } from '@progress/kendo-react-inputs'
import cn from 'classnames'
import Select from 'Components/Presentation/PSelect'
import makeId from 'Utils/makeId'

import './Presentation.scss'

const OPTIONS = ['(id="xs") X-Small', '(id="s") Small', '(id="m") Medium',
  '(id="l") Large', '(id="xl") X-Large', '(id="xxl") 2X-Large']

const OPTIONS_VALUES = ['X-Small', 'Small', 'Medium', 'Large', 'X-Large', '2X-Large']

function formatValues(valueStr, id = null) {
  const splits = valueStr.split('=')
  return (
    <span key={makeId()}>
      <span className="indent-1" id={id}>
        <span className="keyword">
          {splits[0]}
          =
        </span>
        <span className="valueword">{splits[1]}</span>
      </span>
      <br />
    </span>
  )
}

function formatOptions(activeIdx, kwVisible) {
  return function formatter(item, index) {
    return (
      <span key={makeId()}>
        <div className="indent-2">
          {/* {'<li role="option" value="'} */}
          {'<li'}
          {' '}
          {kwVisible && <span className="li-keyword">role=</span>}
          {kwVisible && <span className="li-valueword">&quot;option&quot;</span>}
          {' value="'}
          {item}
          {'" '}
          {index === activeIdx && kwVisible
            ? (
              <span className="keyword">
                aria-selected=
                <span className="valueword">&quot;true&quot;</span>
              </span>
)
            : ''}
          {'/>'}
        </div>
      </span>
    )
  }
}

export default function Presentation() {
  const [selectedItem, setSelectedItem] = useState('')
  const [switchChecked, setSwitchChecked] = useState('false')
  const [activeIndex, setActiveIndex] = useState(-1)
  const [activeItem, setActiveItem] = useState('')
  const [expanded, setExpanded] = useState('false')
  const [activeComponent, setActiveComponent] = useState('switch')
  const [showkeywords, setShowKeywords] = useState(false)

  const selectChangeCallback = useCallback((item) => {
    setSelectedItem(item)
    // const activeIdx = OPTIONS.indexOf(value)
    // setActive
  }, [])

  const onOpen = useCallback(() => { setExpanded('true') }, [])
  const onClose = useCallback(() => {
    setExpanded('false')
    if (!selectedItem) {
      setActiveIndex(-1)
      setActiveItem('')
    }
  }, [selectedItem])
  const handleActiveItemChange = useCallback((value) => {
    const activeIdx = OPTIONS.indexOf(value)
    setActiveIndex(activeIdx)
    const val = /\(id="([a-z]+)"\)/g.exec(value)
    setActiveItem(val[1])
  }, [])

  const handleSwitchChange = ({ value }) => {
    setSwitchChecked(value ? 'true' : 'false')
  }
  return (
    <div className="present-page">
      <h2>
        <span
          className={cn('l-switch', { active: activeComponent === 'switch' })}
          onClick={() => setActiveComponent('switch')}
        >
          Switch
        </span>
        <Divider />
        <span
          className={cn('l-header', { active: activeComponent === 'dropdown-list' })}
          onClick={() => setActiveComponent('dropdown-list')}
        >
          Dropdown List
        </span>
      </h2>
      <div className={cn('side-by-side dropdown-list', { hidden: activeComponent !== 'dropdown-list' })}>
        <div className="element-container">
          <Select
            onChange={selectChangeCallback}
            items={OPTIONS}
            onActiveItemChange={handleActiveItemChange}
            popoverProps={
              { minimal: true, onOpened: onOpen, onClosed: onClose }
            }
          />
        </div>

        <div className="show-interaction">
          {'<div '}
          <br />
          {showkeywords && formatValues('role="listbox"', 'role-id')}
          {
            ['aria-haspopup="true"', 'aria-owns="options-container-id"'].map(formatValues)
          }
          {showkeywords && formatValues(`aria-expanded="${expanded}"`, 'expval-id')}
          {showkeywords && formatValues(`aria-activedescendant="${activeItem}"`, 'activeval-id')}
          {'>'}
          <br />
          <div className="options-view">
            <span className="indent-1">{'<ul id="options-container-id">'}</span>
            {OPTIONS_VALUES.map(formatOptions(activeIndex, showkeywords))}
            <span className="indent-1">{'</ul>'}</span>
          </div>
          {'</div>'}
          <Button icon="changes" onClick={() => setShowKeywords(!showkeywords)} className="switch-btn" />
        </div>
      </div>

      <div className={cn('side-by-side switch', { hidden: activeComponent !== 'switch' })}>
        <div className="element-container">
          <Switch onChange={handleSwitchChange} />
          {/* <BSwitch checked={switchChecked} label="Blueprint" onChange={handleSwitchChange} /> */}
        </div>
        <div className="show-interaction">
          {'<span '}
          {!showkeywords && '>'}
          <br />
          {showkeywords && formatValues('role="switch"', 'expval-id')}
          {showkeywords && formatValues(`aria-checked="${switchChecked}"`, 'expval-id')}
          {showkeywords && '>'}
          <br />
          <span className="indent-1">{'<span>ON</span>'}</span>
          <br />
          <span className="indent-1">{'<span>OFF</span>'}</span>
          <br />
          {'</span>'}
          <Button icon="changes" onClick={() => setShowKeywords(!showkeywords)} className="switch-btn" />
        </div>
      </div>
    </div>
  )
}
