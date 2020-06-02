import React, { useState, useCallback } from 'react'
import makeId from 'Utils/makeId'
import { MenuItem, Button } from '@blueprintjs/core'
import { Select } from '@blueprintjs/select';

function renderItem(item, { handleClick, modifiers }) {
  return (
    <MenuItem
      key={makeId()}
      icon="git-commit"
      text={item}
      onClick={handleClick}
      active={modifiers.active}
    />
  )
}

export default function PSelect({
 onChange, ...rest
}) {
  const [selection, setSelection] = useState()
  const changeHandler = useCallback((value) => {
    setSelection(value)
    onChange(value)
  })

  return (
    <Select
      {...rest}
      itemRenderer={renderItem}
      onItemSelect={changeHandler}
      filterable={false}
    >
      <Button
        icon="media"
        rightIcon="caret-down"
        text={selection || 'Choose One'}
      />
    </Select>
  )
}
