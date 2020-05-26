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

  currentInputValue = null

  fieldId = makeId()

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
    // schema stuff
  }

  reset = () => {
    this.currentInputValue = null
    this.setState({ errors: [] })
  }

  setFieldSchema = () => {
    const { schema, dataField } = this.props
    this.fieldSchema = schema.properties[dataField] || {}
    this.isARequiredField = schema.required?.includes(dataField)
    this.isFieldSchemaSet = true
  }

  // const isRequired =
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
      this.fieldValidator.errors.forEach((item) => errors.push(item.message))
    }
    return errors
  }

  handleInputChange = (event) => {
    const {
      fieldOnChangeHandler, ensureIfAbleToSubmit, validateOnChange,
    } = this.props
    const { target: { value } } = event
    this.currentInputValue = value.trim()

    if (validateOnChange) {
      const errors = this.validateField(this.currentInputValue)
      this.setState({ errors }, () => {
        ensureIfAbleToSubmit()
      })
    }
    fieldOnChangeHandler(event)
  }

  handleBlur = () => {
    const { validateOnBlur, ensureIfAbleToSubmit } = this.props
    if (validateOnBlur) {
      const errors = this.validateField(this.currentInputValue || '')
      this.setState({ errors }, () => {
        ensureIfAbleToSubmit()
      })
    }
  }

  renderFormField(children) {
    const {
      dataField, errors, errorType, registerSyntheticCandidates, initialValue,
    } = this.props

    if (!this.isFieldSchemaSet) {
      this.setFieldSchema()
      this.setFieldValidator()
    }

    const newChildren = React.Children.map(children, (child) => {
      const extraProps = {}
      if (child.props.registerForSyntheticReset) {
        extraProps.ref = registerSyntheticCandidates
      }
      return React.cloneElement(child, {
        ...extraProps,
        className: cn('vm', 'input'),
        intent: errors.length ? Intent.DANGER : '',
        datafield: dataField,
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
          content={errors[0]}
          position={Position.TOP}
          intent="danger"
          disabled={errors.length === 0}
        >
          {newChildren}
        </Tooltip>
      )
  }

  render() {
    const {
      children, errorType, label, dataField, showMultipleErrors,
    } = this.props
    const { errors } = this.state
    console.log(`[FormField]: ${dataField} rendered `)
    return (
      <div className="form-field">
        {label && <label htmlFor={this.fieldId}>{label}</label>}
        {this.renderFormField(children)}
        { errors.length > 0 && errorType === 'static'
          && (
          <div className="validation-message">
            {!showMultipleErrors ? errors[0]
            : (
              errors.map((error, idx) => <div key={String.fromCharCode(65 + idx)}>{error}</div>)
            )}
          </div>
        )}
      </div>
    )
  }
}
