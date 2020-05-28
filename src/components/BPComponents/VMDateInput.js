import React from 'react'
import format from 'date-fns/format'
import isValid from 'date-fns/isValid'
import { DateInput } from '@blueprintjs/datetime'

const jsDateFormatter = {
  // note that the native implementation of Date functions differs between browsers
  formatDate: (date) => {
    if (isValid(date)) {
      return format(date, 'yyyy-MM-dd')
    }
    return date
  },
  parseDate: (str) => new Date(str),
  placeholder: 'YYYY-MM-DD',
}

export default class VMDateInput extends React.Component {
  state = {
    value: this.props.value,
  }

  inputRef = React.createRef()

  blurTimeout

  onChangeHandler = (value) => {
    const { onChange } = this.props

    this.setState({
      value,
    })

    // if (!/[^0-9-/]/.test(value)) {

    // }
    onChange(jsDateFormatter.formatDate(value) || '')
  }

  onFocusHandler = () => {
    const { onFocus } = this.props
    onFocus()
    if (this.blurTimeout) {
      clearTimeout(this.blurTimeout)
    }
  }

  onBlurHandler = () => {
    // Focus jumps here from going to
    // calendar and dateInput
    const { onBlur } = this.props
    this.blurTimeout = setTimeout(() => {
      onBlur()
    }, 100)
  }

  reset = () => {
    this.setState({
      value: '',
    })
  }

  render() {
    const { datafield, id } = this.props
    const { value } = this.state
    return (
      <DateInput
        inputProps={{
          id,
          inputRef: this.inputRef,
          datafield,
          onBlur: this.onBlurHandler,
          onFocus: this.onFocusHandler,
        }}
        onChange={this.onChangeHandler}
        value={value}
        {...jsDateFormatter}
      />
    )
  }
}
