import React, { Component } from 'react'
import {
 Position, Tooltip, Intent,
} from '@blueprintjs/core'
import cn from 'classnames'
import makeId from 'Utils/makeId'
import noop from 'Utils/noop'
import './FormField.scss'

const INITIAL_STATE = {
  errors: [],
  inFocus: false,
  modified: false,
  touched: false,
  visited: false,
}

export default class FormField extends Component {
  static defaultProps = {
    dataField: '',
    dataGrabber: (event) => event.target.value?.trim(),
    errorType: 'static',
    errors: [],
    formValidator: () => [],
    fieldOnBlurHandler: noop,
    fieldOnChangeHandler: noop,
    hint: '',
    initialValue: null,
    label: '',
    registerErrorField: noop,
    registerForSyntheticReset: noop,
    registerSyntheticResetCandidates: noop,
    schema: {},
    showErrorsOn: noop,
    showMultipleErrors: false,
    validate: noop,
    value: null,
  }

  currentInputValue = null

  errorId = makeId()

  fieldId = makeId()

  hintId = makeId()

  state = { ...INITIAL_STATE }

  componentDidMount() {
    const { registerSyntheticResetCandidates } = this.props
    registerSyntheticResetCandidates(this)
  }

  get showErrors() {
    const { showErrorsOn } = this.props
    const { errors } = this.state
    return showErrorsOn(this.state) && errors.length > 0
  }

  reset = () => {
    this.setState({ ...INITIAL_STATE })
  }

  handleInputChange = (onChangeArg) => {
    const {
      dataField, dataGrabber, fieldOnChangeHandler, initialValue,
    } = this.props

    const currentInputValue = dataGrabber(onChangeArg)
    this.currentInputValue = currentInputValue
    if (currentInputValue !== initialValue) {
      this.setState({ modified: true })
    }
    fieldOnChangeHandler(currentInputValue, dataField)
    const errors = this.localValidate()
    this.setState({ errors })
  }

  handleBlur = (event) => {
    const { fieldOnBlurHandler, dataField } = this.props
    fieldOnBlurHandler(event, dataField)
    this.setState({ visited: true, inFocus: false })
    const errors = this.localValidate()
    this.setState({ errors })
  }

  localValidate = () => {
    const { validate, dataField, registerErrorField } = this.props
    const errors = validate(dataField)
    const plainErrorMessages = errors.map((item) => item.message)
    registerErrorField(this, plainErrorMessages.length)
    return plainErrorMessages
  }

  setErrors = (allErrors) => {
    const { dataField } = this.props
    const errors = allErrors
      .filter((item) => item.dataPath === `.${dataField}`)
      .map((errorObj) => errorObj.message)
    console.log(errors)
    this.setState({ errors })
  }

  handleFocus = () => {
    this.setState({ touched: true, inFocus: true })
  }

  renderFormField(children, fieldErrors) {
    const {
      dataField, errorType, mode,
      registerSyntheticResetCandidates, value, hint,
    } = this.props

    const newChildren = React.Children.map(children, (child) => {
      const extraProps = {}
      // setup non-native html inputs to act on form reset
      if (child.props.registerForSyntheticReset) {
        extraProps.ref = registerSyntheticResetCandidates
      }

      let inputDescribedBy = ''
      if (this.showErrors) {
        inputDescribedBy = this.errorId
      } else if (hint) {
        inputDescribedBy = this.hintId
      }

      return React.cloneElement(child, {
        ...extraProps,
        'aria-invalid': this.showErrors ? 'true' : 'false',
        'aria-describedby': inputDescribedBy,
        className: cn('vm', 'input'),
        intent: this.showErrors ? Intent.DANGER : '', /* Blueprint specific */
        datafield: dataField,
        // inputRef: this.inputRef,
        id: this.fieldId,
        defaultValue: value,
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
        { this.showErrors && errorType === 'static'
          && (
          <div className="validation-message" role="alert" id={this.errorId}>
            {errors[0]}
            {/* errors.map((error, idx) =>
            <div key={String.fromCharCode(65 + idx)}>{error}</div>) */}
          </div>
        )}
        { hint && !this.showErrors && (
          <div className="input-hint" id={this.hintId}>{`Hint: ${hint}`}</div>
        )}
      </div>
    )
  }
}
