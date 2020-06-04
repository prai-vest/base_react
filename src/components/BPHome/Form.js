import React from 'react'
import { Button } from '@blueprintjs/core'
import noop from 'Utils/noop'
import Validator from './Validator'
import './Form.scss'

// centralizedErrorHandling: true,
const INITIAL_STATE = {
  data: {},
  canSubmit: true,
  errors: [],
}
export default class Form extends React.PureComponent {
  static defaultProps = {
    data: {},
    encompassingValidation: false,
    onBlur: noop,
    onFocus: noop,
    onValidate: (a, _) => _,
    remoteValidate: () => [],
    schema: {},
    showErrorsOn(state) {
      return state.modified || state.visited
    },
    showMultipleErrors: false,
  }

  dataProperty = {}

  syntheticResetCandidates = []

  fieldsWithErrors = new Set()

  // eslint-disable-next-line
  constructor(props) {
    super(props)
    const { data, schema, showErrorsOn } = this.props
    this.validator = new Validator(schema, data)
    const { validateFn, defaults } = this.validator
    const defaultData = { ...defaults, ...data }
    this.defaultData = defaultData
    this.validateFn = validateFn
    this.state = {
      ...INITIAL_STATE,
      data: this.defaultData,
      showErrorsOn,
    }
  }

  registerErrorField = (field, inOrOut) => {
    if (inOrOut) {
      this.fieldsWithErrors.add(field)
    } else {
      this.fieldsWithErrors.delete(field)
    }

    this.setState({
      canSubmit: this.fieldsWithErrors.size === 0,
    })
  }

  resetForm = () => {
    this.setState({ ...INITIAL_STATE, data: this.defaultData })
    this.syntheticResetCandidates.forEach((item) => {
      if (item.reset) {
        item.reset()
      }
    })
  }

  registerSyntheticResetCandidates = (ref) => {
    if (ref) {
      this.syntheticResetCandidates.push(ref)
    }
  }

  fieldOnChangeHandler = (value, dataField) => {
    this.dataProperty[dataField] = value
  }

  fieldOnFocus = (event, dataField) => {
    const { onFocus } = this.props
    onFocus(event, dataField)
  }

  fieldOnBlurHandler = (event, dataField) => {
    const { onBlur } = this.props
    onBlur(event, dataField)
  }

  validate = (dataField) => {
    const { schema, onValidate, encompassingValidation } = this.props
    const errors = []
    const requiredErrors = []
    const validator = this.validateFn
    let requiredFields = []

    if (encompassingValidation || !dataField) {
      validator(this.dataProperty)
    } else {
      validator({ [dataField]: this.dataProperty[dataField] })
    }

    if (validator.errors?.length) {
      const validationErrors = dataField
        ? validator.errors
          .filter((errorObj) => errorObj.dataPath === `.${dataField}`)
        : validator.errors

      requiredFields = dataField
        ? schema.required.filter((item) => item === dataField)
        : schema.required

      // separate required specific errors
      validationErrors.forEach((item) => {
        if (item.keyword === 'required') {
          requiredErrors.push(item)
        } else {
          const currentDataField = item.dataPath.slice(1)
          const { fieldSchema: { messages = {} } } = this.validator
            .getPropertySchema(currentDataField)
          errors
            .push({ ...item, ...(messages[item.keyword] && { message: messages[item.keyword] }) })
        }
      })
    }

    // add the required errors back with right message
    // add the missing required errors (only missing property triggers aj's required, not '')
    // therefore needs to be added manually
    requiredFields.forEach((currentDataField) => {
      const value = this.dataProperty[currentDataField]
      if (value === '' || value === null || value === undefined) {
        const errorObj = requiredErrors.find((item) => item.dataPath === `.${currentDataField}`)
        if (errorObj) {
          errors.unshift({ ...errorObj, message: 'This field is required' })
        } else {
          errors.unshift({
            dataPath: `.${currentDataField}`,
            keyword: 'required',
            message: 'This field is required',
          })
        }
      }
    })

    return onValidate(this.dataProperty, errors)
  }

  setErrorsOnField = (errors) => {
    this.syntheticResetCandidates.forEach((item) => {
      if (item.setErrors) {
        item.setErrors(errors)
      }
    })
  }

  handleSubmit = async (event) => {
    event.preventDefault()
    this.setState({ canSubmit: false })
    const { onSubmit, remoteValidate } = this.props
    const uiErrors = this.validate()
    if (uiErrors.length) {
      this.setState({ showErrorsOn: () => true })
      this.setErrorsOnField(uiErrors)
      return
    }

    let remoteErrors = []
    if (remoteValidate) {
      remoteErrors = await remoteValidate(this.dataProperty)
    }

    const errors = uiErrors.concat(remoteErrors)
    if (errors.length === 0) {
      onSubmit(this.dataProperty)
    } else {
      this.setState({ canSubmit: false, showErrorsOn: () => true })
      this.setErrorsOnField(errors)
    }
  }

  renderForm = (children) => {
    console.log('[Form] rendered')
    const {
      showMultipleErrors,
    } = this.props
    const { data, errors, showErrorsOn } = this.state

    const modifiedChild = React.Children.map(children, (child) => {
      if (!child.props) return child
      const { dataField } = child.props
      if (dataField) {
        const fieldSpecificErrors = errors
          .filter((errorObj) => errorObj.dataPath === `.${dataField}`)
          .map((errorObj) => errorObj.message)

        return React.cloneElement(child, {
          initialValue: this.defaultData[dataField],
          value: data[dataField],
          dataField,
          errors: fieldSpecificErrors,
          formValidator: this.validate,
          fieldOnBlurHandler: this.fieldOnBlurHandler,
          fieldOnFocus: this.fieldOnFocus,
          fieldOnChangeHandler: this.fieldOnChangeHandler,
          registerErrorField: this.registerErrorField,
          registerSyntheticResetCandidates: this.registerSyntheticResetCandidates,
          showErrorsOn,
          showMultipleErrors,
          validate: this.validate,
        })
      }

      if (child.props.children) {
        return React.cloneElement(child, {
          children: this.renderForm(child.props.children),
        })
      }
      return child
    })
    return modifiedChild
  }

  render() {
    const { children, renderButtons } = this.props
    const { canSubmit } = this.state
    return (
      <form ref={this.formRef} onSubmit={this.handleSubmit} onReset={this.resetForm} className="vm form">
        {this.renderForm(children)}
        {!renderButtons && (
          <div className="form-buttons">
            <Button type="reset" className="reset-btn" text="Reset" />
            {/* <Button className="reset-btn" text="Reset" /> */}
            <Button type="submit" className="submit-btn" text="Submit" disabled={!canSubmit} />
          </div>
        )}
        {renderButtons && renderButtons({ formRef: this.formRef, canSubmit })}
      </form>
    )
  }
}
