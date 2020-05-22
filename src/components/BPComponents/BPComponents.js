import React from 'react'
import { Button, MenuItem } from '@blueprintjs/core'
import { Select } from '@blueprintjs/select'


function renderItem(item, { handleClick, modifiers, query }) {
  return (
    <MenuItem text={item.value} key={item.id} active={modifiers.active} onClick={handleClick} />
  )
}

export default class BPComponents extends React.Component {
  state = {
    selection: '',
  }

  handleSelectChange = (item) => {
    // console.log(item)
    this.setState({
      selection: item.value,
    })
  }

  reset = () => {
    this.setState({
     selection: '',
    })
  }

  render() {
    const { selection } = this.state
    return (
      <>
        <Select
          items={[{ id: 1, value: 'Hello' }, { id: 2, value: 'World' }]}
          itemRenderer={renderItem}
          onItemSelect={this.handleSelectChange}
          filterable={false}
          popoverProps={{ minimal: true }}
        >
          <Button
            text={selection || '(No selection)'}
            rightIcon="caret-down"
          />
        </Select>
        <div style={{ marginTop: '10px' }}>
          <Button text="click" onClick={this.test} />
        </div>
      </>
    )
  }
}
