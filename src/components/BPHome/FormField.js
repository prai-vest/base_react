import React, { Component } from 'react'
import {
 Position, Tooltip, Intent,
} from '@blueprintjs/core'
import cn from 'classnames'
import makeId from 'Utils/makeId'
import './FormField.scss'

export default class FormField extends Component {
  static defaultProps = {
    dataGrabber: (event) => event.target.value?.trim(),
    errorType: 'static',
    errors: [],
  }

  currentInputValue = null

  fieldId = makeId()

  errorId = makeId()

  state = {
    errors: [],
    inFocus: false,
    modified: false,
    touched: false,
    visited: false,
  }

  get showErrors() {
    const { showErrorsOn, errors } = this.props
    return showErrorsOn(this.state) && errors.length > 0
  }

  handleInputChange = (onChangeArg) => {
    const {
      dataField, dataGrabber, fieldOnChangeHandler, initialValue,
    } = this.props

    const currentInputValue = dataGrabber(onChangeArg)
    this.currentInputValue = currentInputValue
    //   ? event.target.value.trim()
    //   : inputValue.trim()

    if (currentInputValue !== initialValue) {
      this.setState({ modified: true })
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
    // const { fieldOnFocus, centralizedErrorHandling, ensureIfAbleToSubmit } = this.props
    // if (!centralizedErrorHandling) {
    //   const errors = this.validateField(this.currentInputValue || '')
    //   this.setState({ errors }, ensureIfAbleToSubmit)
    // }
    this.setState({ touched: true, inFocus: true })
    // fieldOnFocus()
  }

  renderFormField(children, fieldErrors) {
    const {
      centralizedErrorHandling, dataField, errorType,
      initialValue, registerSyntheticCandidates, value,
    } = this.props

    // if (!this.isFieldSchemaSet && !centralizedErrorHandling) {
    //   this.setFieldSchema()
    //   this.setFieldValidator()
    // }

    const newChildren = React.Children.map(children, (child) => {
      const extraProps = {}
      // setup non-native html inputs to act on form reset
      // if (child.props.registerForSyntheticReset) {
      //   extraProps.ref = registerSyntheticCandidates
      // }

      return React.cloneElement(child, {
        ...extraProps,
        'aria-invalid': this.showErrors ? 'true' : 'false',
        'aria-describedby': this.showErrors ? this.errorId : ' ',
        className: cn('vm', 'input'),
        intent: this.showErrors ? Intent.DANGER : '', /* Blueprint specific */
        datafield: dataField,
        // inputRef: this.inputRef,
        id: this.fieldId,
        value: value || '',
        // defaultValue: initialValue,
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
      children, dataField, errorType, label, errors,
    } = this.props
    // const { errors } = this.state
    console.log(`[FormField]: ${dataField} rendered `)
    return (
      <div className="form-field">
        {label && <label htmlFor={this.fieldId}>{label}</label>}
        {this.renderFormField(children, errors)}
        { this.showErrors && errorType === 'static'
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
