import React from 'react'
import { Button, MenuItem } from '@blueprintjs/core'
import { Select } from '@blueprintjs/select'


function renderItem(item, { handleClick, modifiers, query }) {
  if (!modifiers.matchesPredicate) {
    return null;
  }
  return (
    <MenuItem text={item.value} key={item.value} active={modifiers.active} onClick={handleClick} />
  )
}

export default class VMSelect extends React.Component {
  state = {
    selection: '',
  }

  componentDidMount() {
    /* also needs to handle initial value */
    /* change needs to be propagated poperly */
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
      <Select
        items={[{ id: 1, value: 'Hello' }, { id: 2, value: 'World' }]}
        itemRenderer={renderItem}
        onItemSelect={this.handleSelectChange}
        filterable={false}
        resetOnClose={false}
        resetOnSelect={false}
        resetOnQuery={false}
        popoverProps={{ minimal: true }}
      >
        <Button
          text={selection || '(No selection)'}
          rightIcon="caret-down"
        />
      </Select>
    )
  }
}
