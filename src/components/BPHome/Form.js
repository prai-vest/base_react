import React from 'react'
import { Button } from '@blueprintjs/core'
import Validator from './Validator'
import './Form.scss'

const INITIAL_STATE = {
  data: {},
  canSubmit: true,
  errors: [],
}
export default class Form extends React.PureComponent {
  static defaultProps = {
    data: {},
    validateOnChange: true,
    validateOnBlur: true,
    showMultipleErrors: false,
    centralizedErrorHandling: true,
  }

  syntheticResetCandidates = []

  // eslint-disable-next-line
  validator = new Validator(this.props.schema)

  formRef = React.createRef()

  state = { ...INITIAL_STATE }

  componentDidMount() {
    this.formRef.current.addEventListener('reset', this.resetForm)
  }

  resetForm = () => {
    this.setState({ ...INITIAL_STATE })
    this.syntheticResetCandidates.forEach((item) => {
      if (item.reset) {
        item.reset()
      }
    })
  }

  // when doing validation individually in formfields need to query
  // all other fields to check if the form is submittable or not
  ensureIfAbleToSubmit = () => {
    const { centralizedErrorHandling } = this.props
    if (centralizedErrorHandling) {
      console.log('This shouldn\'t be firing when error-handling is centralized')
    }
    const errRef = this.syntheticResetCandidates
      .find((item) => item.state && item.state.errors && item.state.errors.length)
    if (errRef) {
      this.disableSubmit()
    } else {
      this.enableSubmit()
    }
  }

  enableSubmit = () => {
    this.setState({ canSubmit: true })
  }

  disableSubmit = () => {
    this.setState({ canSubmit: false })
  }

  registerSyntheticCandidates = (ref) => {
    this.syntheticResetCandidates.push(ref)
  }

  fieldOnChangeHandler = (event) => {
    const { centralizedErrorHandling, validateOnChange } = this.props
    const dataField = event.target.getAttribute('dataField')
    const newValue = event.target.value
    const { data } = this.state
    const newData = data
    newData[dataField] = newValue.trim()
    /* todo setPathValue here */
    this.setState({ data: newData })
    if (centralizedErrorHandling && validateOnChange) {
      const errors = this.validate(newData)
      this.setState({ errors, canSubmit: errors.length === 0 })
    }
  }

  fieldOnBlurHandler = () => {
    const { centralizedErrorHandling, validateOnBlur } = this.props
    const { data } = this.state
    if (centralizedErrorHandling && validateOnBlur) {
      const errors = this.validate(data)
      this.setState({ errors, canSubmit: errors.length === 0 })
    }
  }

  validate = (data) => {
    const { schema } = this.props
    const errors = []
    const requiredErrors = []
    const { validateFn } = this.validator
    validateFn(data)
    if (validateFn.errors?.length) {
      // separate required specific errors
      validateFn.errors.forEach((item) => {
        if (item.keyword === 'required') {
          requiredErrors.push(item)
        } else {
          const dataField = item.dataPath.slice(1)
          const { fieldSchema: { messages = {} } } = this.validator.getPropertySchema(dataField)
          errors
            .push({ ...item, ...(messages[item.keyword] && { message: messages[item.keyword] }) })
        }
      })
    }
    // add the required errors back with right message
    // add the missing required errors (only missing property triggers aj's required, not '')
    schema.required.forEach((dataField) => {
      const value = data[dataField]
      if (value === '' || value === null || value === undefined) {
        const errorObj = requiredErrors.find((item) => item.dataPath === `.${dataField}`)
        if (errorObj) {
          errors.unshift({ ...errorObj, message: 'This field is required' })
        } else {
          errors.unshift({
            dataPath: `.${dataField}`,
            keyword: 'required',
            message: 'This field is required',
          })
        }
      }
    })
    return errors
  }

  resetErrorForField = (dataField) => {
    const { errors } = this.state
    const filteredErrors = errors.filter(({ dataPath }) => dataPath !== `.${dataField}`)
    this.setState({
      errors: filteredErrors,
    })
  }

  handleSubmit = async (event) => {
    event.preventDefault()
    this.setState({ canSubmit: false })
    const { onValidate, onSubmit } = this.props
    const { data } = this.state
    const uiErrors = this.validate(data)
    let additionalErrors = []
    if (onValidate) {
      additionalErrors = await onValidate(data)
    }
    const errors = uiErrors.concat(additionalErrors)
    if (errors.length === 0) {
      onSubmit(data)
    }
    this.setState({ errors, canSubmit: true })
  }

  renderForm = (children) => {
    console.log('[Form] rendered')
    const {
      centralizedErrorHandling, data: initialData, showMultipleErrors,
      validateOnChange, validateOnBlur,
    } = this.props
    const { errors } = this.state
    const modifiedChild = React.Children.map(children, (child) => {
      if (!child.props) return child
      const { dataField } = child.props
      if (dataField) {
        const fieldSpecificErrors = errors
          .filter((errorObj) => errorObj.dataPath === `.${dataField}`)
          .map((errorObj) => errorObj.message)

        return React.cloneElement(child, {
          initialValue: initialData[dataField],
          centralizedErrorHandling,
          dataField,
          ensureIfAbleToSubmit: this.ensureIfAbleToSubmit,
          errors: fieldSpecificErrors,
          fieldOnBlurHandler: this.fieldOnBlurHandler,
          fieldOnChangeHandler: this.fieldOnChangeHandler,
          formValidator: this.validator,
          registerSyntheticCandidates: this.registerSyntheticCandidates,
          resetErrorForField: this.resetErrorForField,
          showMultipleErrors,
          validateOnChange,
          validateOnBlur,
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
      <form ref={this.formRef} onSubmit={this.handleSubmit} className="vm form">
        {this.renderForm(children)}
        {!renderButtons && (
          <div className="form-buttons">
            <Button type="reset" className="reset-btn" text="Reset" />
            <Button type="submit" className="submit-btn" text="Submit" disabled={!canSubmit} />
          </div>
        )}
        {renderButtons && renderButtons({ formRef: this.formRef, canSubmit })}
      </form>
    )
  }
}
