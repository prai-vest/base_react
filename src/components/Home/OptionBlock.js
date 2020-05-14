import React from 'react'
import {
  DropDownList,
} from '@progress/kendo-react-dropdowns'
import {
 Form, Field, FormElement,
} from '@progress/kendo-react-form'
import { Label, Error } from '@progress/kendo-react-labels'
import { Input } from '@progress/kendo-react-inputs'
import { Tooltip } from '@progress/kendo-react-tooltip'

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
    for (let i = 0, len = validatorsArr.length; i < len; i++) {
      const validator = validatorsArr[i]
      const result = validator(value)
      if (result) return result
    }
    return ''
  }
const securityValidator = getValidateFunc([validators.required, validators.reg])
const numericValidator = getValidateFunc([validators.required, validators.numeric])
// const optionSelectValidator = (value) => value ? '' : 'Please select a strategy'


const MyInput = (fieldRenderProps) => {
  const {
  validationMessage, label, visited, valid, ...others
  } = fieldRenderProps
  const filterElements = (elem) => !valid && elem.tagName === 'INPUT'

  return (
    <div className="k-form-field">
      <Tooltip filter={filterElements} anchorElement="target" position="top">
        <Label>{label}</Label>
        <Input valid={valid} title={validationMessage} {...others} />
        {
          visited && validationMessage
            && (<Error>{validationMessage}</Error>)
        }
      </Tooltip>
    </div>
  )
}

export default class OptionBlock extends React.Component {
  componentDidMount() {
    console.log('Mounted')
  }

  setFormRef = (ref) => {
    const { registerRef } = this.props
    this.formRef = ref
    console.log(ref)
    registerRef(ref)
    // console.log(this.props.keyprop)
  }

  handleSubmit = (dataItem) => {
    const { handleSubmit } = this.props
    handleSubmit(this.formRef, dataItem)
  }

  ownHandleDelete = () => {
    const { handleDelete, keyprop } = this.props
    handleDelete(this.formRef, keyprop)
  }


  render() {
    return (
      <>
        <Form
          onSubmit={this.handleSubmit}
          ref={this.setFormRef}
          render={() => (
            <FormElement>
              <div className="open-option-block">
                <div className="block-top">
                  <div className="select-wrapper">
                    <Field
                      name="strategy"
                      component={DropDownList}
                      data={OPTIONS_STRATEGY}
                      textField="text"
                      valueMap={(value) => value && value.id}
                      defaultItem={{ text: 'Choose One', id: null }}
                    />
                  </div>
                  <Field
                    name="underlyingsymbol"
                    component={MyInput}
                    label="Underlying Symbol"
                    validator={securityValidator}
                  />
                  <div className="own-fieldset">
                    <Field
                      name="changePercentage"
                      component={MyInput}
                      label="% Change"
                      validator={numericValidator}
                    />
                    <Field
                      name="targetPercentage"
                      component={MyInput}
                      label="Target %"
                      validator={numericValidator}
                    />
                    <div className="select-wrapper">
                      <Field
                        name="rounding"
                        component={DropDownList}
                        data={['Round Up', 'Round Down']}
                        defaultItem="Round Nearest"
                      />
                    </div>
                  </div>
                  <div className="reb-field delete-col">
                    <span className="k-icon k-i-trash" onClick={this.ownHandleDelete} />
                  </div>
                </div>
              </div>
            </FormElement>
        )}
        />
      </>
    )
  }
}
