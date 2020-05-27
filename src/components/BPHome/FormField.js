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
        showErrorsOverride: state.showErrorsOverride,
      }
    }
    return {
      errors: errors.concat(state.errors),
      isErrorsMixed: errors.length > 0,
      showErrorsOverride: state.showErrorsOverride,
    }
  }

  currentInputValue = null

  inputRef = React.createRef()

  fieldId = makeId()

  errorId = makeId()

  hintId = makeId()

  fieldSchema = {}

  fieldValidator = null

  isARequiredField = false

  isFieldSchemaSet = false

  state = {
    errors: [],
    inFocus: false,
    modified: false,
    touched: false,
    visited: false,
  }

  componentDidMount() {
    const { registerSyntheticCandidates } = this.props
    registerSyntheticCandidates(this)
  }


  get showErrors() {
    const { showErrorsOn } = this.props
    const { showErrorsOverride } = this.state
    if (showErrorsOverride) return true
    const { errors } = this.state
    /* todo: memoize */
    const testForDivider = /(_OR_|_AND_)/g.exec(showErrorsOn)
    const keys = testForDivider ? showErrorsOn.split(RegExp.$1) : [showErrorsOn]
    const values = keys.map((key) => this.state[key])
    let basedOnInputState
    if (RegExp.$1 === '_AND_') {
      basedOnInputState = values.every(Boolean)
    } else {
      basedOnInputState = values.some(Boolean)
    }
    return basedOnInputState && errors.length > 0
  }

  reset = () => {
    this.currentInputValue = null
    this.setState({
      errors: [], modified: false, touched: false, visited: false,
    })
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
    if (value === '' && value === null && this.isARequiredField) {
      errors.push('This is a required field.')
    }
    if (this.fieldValidator.errors?.length) {
      this.fieldValidator.errors.forEach((item) => {
        const { messages } = this.fieldSchema
        errors.push(messages?.[item.keyword] || item.message)
      })
    }
    return errors
  }

  handleInputChange = (event, inputValue) => {
    const {
      centralizedErrorHandling, dataField, ensureIfAbleToSubmit, initialValue,
      fieldOnChangeHandler, resetErrorForField,
    } = this.props

    const currentInputValue = event
      ? event.target.value.trim()
      : inputValue.trim()

    if (currentInputValue !== initialValue) {
      this.setState({ modified: true })
    }
    // validate only if error handling is not centralized
    if (!centralizedErrorHandling) {
      const { isErrorsMixed } = this.state
      if (isErrorsMixed) {
        resetErrorForField(dataField)
        this.setState({ showErrorsOverride: false })
      }
      this.currentInputValue = currentInputValue
      const errors = this.validateField(this.currentInputValue || '')
      this.setState({ errors }, () => {
        ensureIfAbleToSubmit()
      })
    }
    fieldOnChangeHandler(currentInputValue, dataField)
  }

  handleBlur = () => {
    const { fieldOnBlurHandler } = this.props
    fieldOnBlurHandler()
    this.setState({
      visited: true,
      inFocus: false,
    })
  }

  handleFocus = () => {
    const { fieldOnFocus, centralizedErrorHandling, ensureIfAbleToSubmit } = this.props
    if (!centralizedErrorHandling) {
      const errors = this.validateField(this.currentInputValue || '')
      this.setState({ errors }, ensureIfAbleToSubmit)
    }
    this.setState({ touched: true, inFocus: true })
    fieldOnFocus()
  }

  renderFormField(children, fieldErrors) {
    const {
      centralizedErrorHandling, dataField, errorType,
      initialValue, registerSyntheticCandidates, hint,
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

      const isInvalid = fieldErrors.length && this.showErrors
      const inputDescribedBy = isInvalid ? this.errorId
        : hint ? this.hintId : ' '

      return React.cloneElement(child, {
        ...extraProps,
        'aria-invalid': isInvalid ? 'true' : 'false',
        'aria-describedby': inputDescribedBy,
        className: cn('vm', 'input'),
        intent: isInvalid ? Intent.DANGER : '', /* Blueprint specific */
        datafield: dataField,
        // inputRef: this.inputRef,
        id: this.fieldId,
        defaultValue: initialValue,
        onBlur: this.handleBlur,
        onChange: this.handleInputChange,
        onFocus: this.handleFocus,
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
      children, dataField, errorType, label, hint,
    } = this.props
    const { errors } = this.state
    console.log(`[FormField]: ${dataField} rendered `)
    return (
      <div className="form-field">
        {label && <label htmlFor={this.fieldId}>{label}</label>}
        {this.renderFormField(children, errors)}
        { (this.showErrors && errorType === 'static')
          ? (
            <div className="validation-message" role="alert" id={this.errorId}>
              {errors[0]}
              {/* errors.map((error, idx) =>
              <div key={String.fromCharCode(65 + idx)}>{error}</div>) */}
            </div>
            )
          : null
        }
        {hint && !this.showErrors && (
          <div className="input-hint" id={this.hintId}>{`Hint: ${hint}`}</div>
        )}
      </div>
    )
  }
}
