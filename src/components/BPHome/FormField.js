import React, { Component } from 'react'
import {
 Position, Tooltip, Intent,
} from '@blueprintjs/core'
import Ajv from 'ajv'
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
    mode: 'uncontrolled',
    registerErrorField: noop,
    registerForSyntheticReset: noop,
    registerSyntheticResetCandidates: noop,
    schema: {},
    showErrorsOn: noop,
    showMultipleErrors: false,
    value: null,
  }

  currentInputValue = null

  errorId = makeId()

  fieldId = makeId()

  hintId = makeId()

  constructor(props) {
    super(props)
    const { schema } = props
    this.fieldValidator = Ajv({ allErrors: true }).compile(schema)
  }

  state = { ...INITIAL_STATE }

  componentDidMount() {
    const { registerSyntheticResetCandidates } = this.props
    registerSyntheticResetCandidates(this)
  }

  get showErrors() {
    const {
      showErrorsOn, errors: propErrors, mode,
    } = this.props
    const { errors: stateErrors } = this.state
    const relevantErrors = mode === 'uncontrolled' ? stateErrors : propErrors
    return showErrorsOn(this.state) && relevantErrors.length > 0
  }

  reset = () => {
    this.setState({ ...INITIAL_STATE })
  }

  handleInputChange = (onChangeArg) => {
    const {
      dataField, dataGrabber, fieldOnChangeHandler, initialValue,
      mode, formValidator,
    } = this.props

    const currentInputValue = dataGrabber(onChangeArg)
    this.currentInputValue = currentInputValue
    if (currentInputValue !== initialValue) {
      this.setState({ modified: true })
    }
    fieldOnChangeHandler(currentInputValue, dataField)

    if (mode === 'uncontrolled') {
      const errors = this.localValidate()
      this.setState({ errors })
    }
  }

  handleBlur = () => {
    const { fieldOnBlurHandler, mode } = this.props
    fieldOnBlurHandler()
    this.setState({ visited: true, inFocus: false })

    if (mode === 'uncontrolled') {
      const errors = this.localValidate()
      this.setState({ errors })
    }
  }

  localValidate = () => {
    const { formValidator, dataField, registerErrorField } = this.props
    const errors = formValidator(
      { [dataField]: this.currentInputValue },
      this.fieldValidator,
      dataField,
    )
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

      const valueProps = {
        [mode === 'uncontrolled' ? 'defaultValue' : 'value']: value,
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
        ...valueProps,
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
      children, dataField, errorType, label, errors: propErrors, hint,
      mode,
    } = this.props
    const { errors: stateErrors } = this.state
    const errors = mode === 'uncontrolled' ? stateErrors : propErrors

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
