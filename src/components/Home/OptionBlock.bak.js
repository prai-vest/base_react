import React from 'react'
import {
  DropDownList,
} from '@progress/kendo-react-dropdowns'
import {
 FieldWrapper, Form, Field, FormElement,
} from '@progress/kendo-react-form'
import { Label, Error } from '@progress/kendo-react-labels'
import { Input } from '@progress/kendo-react-inputs'

const OPTIONS_STRATEGY = [
  { text: 'Covered Call', id: 1 },
  { text: 'Protective Put', id: 2 },
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
    console.log(value)
    for (let i = 0, len = validatorsArr.length; i < len; i++) {
      const validator = validatorsArr[i]
      const result = validator(value)
      if (result) return result
    }
    return ''
  }

// const optionSelectValidator = (value) => {
//   console.log(value)
//   return value ? '' : 'Please select a strategy'
// }


const MyInput = (fieldRenderProps) => {
  const {
  validationMessage, label, modified, ...others
  } = fieldRenderProps;
  return (
    <div className="k-form-field">
      <Label>{label}</Label>
      <Input {...others} />
      {
        modified && validationMessage
          && (<Error>{validationMessage}</Error>)
      }
    </div>
  )
}

export default class OptionBlock extends React.Component {
  componentDidMount() {
    console.log('Mounted')
  }

  handleSubmit(dataItem) {
    return dataItem
  }

  render() {
    return (
      <Form
        onSubmit={this.handleSubmit}
        render={(formRenderProps) => (
          <FormElement>
            <div className="open-option-block">
              <div className="block-top">
                <DropDownList
                  data={OPTIONS_STRATEGY}
                  textField="text"
                  valueMap={(value) => value && value.id}
                  defaultItem={{ text: 'Choose One', id: null }}
                />
                {/* <div className="select-wrapper">
                  <Field
                    name="strategy"
                    component={DropDownList}
                    data={OPTIONS_STRATEGY}
                    textField="text"
                    valueMap={(value) => value && value.id}
                    defaultItem={{ text: 'Choose One', id: null }}
                    validator={optionSelectValidator}
                  />
                </div> */}
                <Field
                  name="underlyingsymbol"
                  component={MyInput}
                  label="Underlying Symbol"
                  validator={getValidateFunc([validators.required, validators.reg])}
                />
                {/* <FieldWrapper>
                </FieldWrapper> */}
                <div className="own-fieldset">
                  {/* <legend>Coverage</legend> */}
                  {/* <FieldWrapper>
                    <Label>% Change</Label>
                    <Input /> */}
                  <Field
                    name="change-percentage"
                    component={MyInput}
                    label="% Change"
                    validator={getValidateFunc([validators.required, validators.numeric])}
                  />
                  <Field
                    name="target-percentage"
                    component={MyInput}
                    label="Target %"
                    validator={getValidateFunc([validators.required, validators.numeric])}
                  />
                  {/* <FieldWrapper>
                    <Label>Rounding</Label>
                    <DropDownList
                      data={['Round Up', 'Round Down']}
                      defaultItem="Round Nearest"
                    />
                  </FieldWrapper> */}
                  {/* <div className="select-wrapper">
                    <Field
                      name="rounding"
                      component={DropDownList}
                      data={['Round Up', 'Round Down']}
                      defaultItem="Round Nearest"
                    />
                  </div> */}
                </div>
                <div className="reb-field">
                  <span>del</span>
                </div>
              </div>
            </div>
          </FormElement>
        )}
      />
    )
  }
}
