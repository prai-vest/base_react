import React, { Component } from 'react'
import {
 Position, Tooltip, Intent,
} from '@blueprintjs/core'
import Ajv from 'ajv'
import cn from 'classnames'
import makeId from 'Utils/makeId'
import './FormField.scss'

export default class FormField extends Component {
  static defaultProps = {
    errorType: 'static',
    errors: [],
  }

  static getDerivedStateFromProps({ errors, centralizedErrorHandling }, state) {
    if (centralizedErrorHandling) {
      return {
        errors,
      }
    }
    return {
      errors: errors.concat(state.errors),
      isErrorsMixed: errors.length > 0,
    }
  }

  currentInputValue = null

  inputRef = React.createRef()

  fieldId = makeId()

  errorId = makeId()

  fieldSchema = {}

  fieldValidator = null

  isARequiredField = false

  isFieldSchemaSet = false

  state = {
    errors: [],
  }

  componentDidMount() {
    const { registerSyntheticCandidates } = this.props
    registerSyntheticCandidates(this)
  }

  reset = () => {
    this.currentInputValue = null
    this.setState({ errors: [] })
  }

  setFieldSchema = () => {
    const { dataField, formValidator } = this.props
    const { fieldSchema, isRequired } = formValidator.getPropertySchema(dataField)
    this.fieldSchema = fieldSchema
    this.isARequiredField = isRequired
    this.isFieldSchemaSet = true
  }

  setFieldValidator = () => {
    this.fieldValidator = Ajv({ allErrors: true })
      .compile(this.fieldSchema)
  }

  validateField = (value) => {
    this.fieldValidator(value)
    const errors = []
    if (value === '' && this.isARequiredField) {
      errors.push('This is a required field.')
    }
    if (this.fieldValidator.errors?.length) {
      this.fieldValidator.errors.forEach((item) => {
        const { messages } = this.fieldSchema
        errors.push(messages[item.keyword] || item.message)
      })
    }
    return errors
  }

  handleInputChange = (event) => {
    const {
      centralizedErrorHandling, dataField, ensureIfAbleToSubmit,
      fieldOnChangeHandler, resetErrorForField, validateOnChange,
    } = this.props
    // validate only if error handling is not centralized
    if (!centralizedErrorHandling && validateOnChange) {
      const { isErrorsMixed } = this.state
      if (isErrorsMixed) {
        resetErrorForField(dataField)
      }
      const { target: { value } } = event
      this.currentInputValue = value.trim()
      const errors = this.validateField(this.currentInputValue)
      this.setState({ errors }, () => {
        ensureIfAbleToSubmit()
      })
    }
    fieldOnChangeHandler(event)
  }

  handleBlur = (event) => {
    const {
      centralizedErrorHandling, ensureIfAbleToSubmit, fieldOnBlurHandler, validateOnBlur,
    } = this.props
    // validate only if error handling is not centralized
    if (!centralizedErrorHandling && validateOnBlur) {
      const errors = this.validateField(this.currentInputValue || '')
      this.setState({ errors }, () => {
        ensureIfAbleToSubmit()
      })
    }
    fieldOnBlurHandler(event)
  }

  renderFormField(children, fieldErrors) {
    const {
      centralizedErrorHandling, dataField, errorType,
      initialValue, registerSyntheticCandidates,
    } = this.props

    if (!this.isFieldSchemaSet && !centralizedErrorHandling) {
      this.setFieldSchema()
      this.setFieldValidator()
    }

    const newChildren = React.Children.map(children, (child) => {
      const extraProps = {}
      // setup non-native html inputs to act on form reset
      if (child.props.registerForSyntheticReset) {
        extraProps.ref = registerSyntheticCandidates
      }

      return React.cloneElement(child, {
        ...extraProps,
        'aria-invalid': fieldErrors.length ? 'true' : 'false',
        'aria-describedby': fieldErrors.length ? this.errorId : ' ',
        className: cn('vm', 'input'),
        intent: fieldErrors.length ? Intent.DANGER : '', /* Blueprint specific */
        datafield: dataField,
        // inputRef: this.inputRef,
        id: this.fieldId,
        defaultValue: initialValue,
        onBlur: this.handleBlur,
        onChange: this.handleInputChange,
      })
    })

    return errorType === 'static'
      ? newChildren
      : (
        <Tooltip
          content={fieldErrors[0]}
          position={Position.TOP}
          intent="danger"
          disabled={fieldErrors.length === 0}
        >
          {newChildren}
        </Tooltip>
      )
  }

  render() {
    const {
      children, dataField, errorType, label,
    } = this.props
    const { errors } = this.state

    console.log(`[FormField]: ${dataField} rendered `)
    return (
      <div className="form-field">
        {label && <label htmlFor={this.fieldId}>{label}</label>}
        {this.renderFormField(children, errors)}
        { errors.length > 0 && errorType === 'static'
          && (
          <div className="validation-message" role="alert" id={this.errorId}>
            {errors[0]}
            {/* errors.map((error, idx) =>
            <div key={String.fromCharCode(65 + idx)}>{error}</div>) */}
          </div>
        )}
      </div>
    )
  }
}
