import React, { Component, Profiler } from 'react'
import {
  Button, Intent, HTMLSelect,
  InputGroup, Icon,
} from '@blueprintjs/core'
import VMSelect from 'Components/BPComponents/VMSelect'
import Form from './Form'
import FormField from './FormField'

const OPTIONS_STRATEGY = [
  { label: 'Choose One', value: null },
  { label: 'Covered Call', value: 1 },
  { label: 'Protective Put', value: 2 },
]

/* eslint-disable no-confusing-arrow */
const validators = {
  required: (value) => value ? '' : 'This field is required',
  numeric: (value) => !Number.isNaN(parseInt(value, 10))
    ? '' : 'Value must be a number',
  reg: (value) => !/[^a-zA-Z0-9]/g.test(value)
    ? '' : 'Only alphanumeric characters allowed',
}

const getValidateFunc = (validatorsArr) => (value) => {
  for (let i = 0, len = validatorsArr.length; i < len; i++) {
    const validator = validatorsArr[i]
    const result = validator(value)
    if (result) return result
  }
  return ''
}
const securityValidator = getValidateFunc([validators.required, validators.reg])
const numericValidator = getValidateFunc([validators.required, validators.numeric])

export default class BPHome extends Component {
  componentDidMount() {
  }

  render() {
    return (
      <div className="open-option-block">
        <Form
          data={{
          underlyingsymbol: '',
          changePercantage: '',
          targetPercentage: '',
        }}
        >
          <FormField
            label="Strategy"
            dataField="strategy"
          >
            <VMSelect registerForSyntheticReset />
          </FormField>
          <FormField
            dataField="underlyingsymbol"
            errorType="tooltip"
            label="Underlying Symbol"
            validator={securityValidator}
          >
            <InputGroup />
          </FormField>

          <div className="own-fieldset">
            <FormField
              dataField="changePercentage"
              errorType="tooltip"
              label="% Change"
              validator={numericValidator}
            >
              <InputGroup />
            </FormField>

            <FormField
              dataField="targetPercentage"
              errorType="tooltip"
              label="Target %"
              validator={numericValidator}
            >
              <InputGroup />
            </FormField>
            <div className="form-field">
              <label>Rounding</label>
              <HTMLSelect
                options={
                ['Round Nearest', 'Round Up', 'Round Down']
              }
              />
            </div>
          </div>
          <div className="reb-field">
            <Icon className="del-icon" icon="trash" intent={Intent.WARNING} />
          </div>
        </Form>
      </div>
    )
  }
}
