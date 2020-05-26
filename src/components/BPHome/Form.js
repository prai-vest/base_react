import React from 'react'
import { Button } from '@blueprintjs/core'
import Ajv from 'ajv'
import './Form.scss'

/* eslint-disable class-methods-use-this */
export default class Form extends React.PureComponent {
  static defaultProps = {
    data: {},
    validateOnChange: true,
    validateOnBlur: true,
    showMultipleErrors: true,
  }

  syntheticResetCandidates = []

  validator = Ajv({ allErrors: true })
    .compile(this.props.schema || {})

  formRef = React.createRef()

  state = {
    data: {},
    canSubmit: true,
    formKey: 1,
    errors: [],
  }

  componentDidMount() {
    this.formRef.current.addEventListener('reset', () => {
      this.setState({ canSubmit: true, data: {} })
      this.syntheticResetCandidates.forEach((item) => {
        if (item.reset) {
          item.reset()
        }
      })
    })
  }

  ensureIfAbleToSubmit = () => {
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
    const dataField = event.target.getAttribute('dataField')
    const newValue = event.target.value
    /* todo setPathValue here */
    this.setState(({ data }) => {
      const newData = data
      newData[dataField] = newValue
      return {
        data: newData,
      }
    })
  }

  validate = async () => {
    const { data, canSubmit } = this.state
    const { onValidate } = this.props
    if (!canSubmit) return false

    if (onValidate) {
      const errors = await onValidate(data)
      if (errors.length) {
        this.setState({
          errors,
        })
        return false
      }
    }
    return true
  }

  handleSubmit = async (event) => {
    event.preventDefault()
    await this.validate()
    console.log(this.state.data)
  }

  test = () => {
    console.log(this.state)
    console.log(this.syntheticResetCandidates)
    console.log(this.syntheticResetCandidates[0].state)
  }

  renderForm = (children) => {
    console.log('[Form] rendered')
    const {
      data: initialData, validateOnChange, validateOnBlur,
      schema, showMultipleErrors,
    } = this.props
    const { errors } = this.state
    const modifiedChild = React.Children.map(children, (child) => {
      if (!child.props) return child
      const { dataField } = child.props
      if (dataField) {
        return React.cloneElement(child, {
          initialValue: initialData[dataField],
          // currentValue: currentData[dataField],
          dataField,
          showMultipleErrors,
          ensureIfAbleToSubmit: this.ensureIfAbleToSubmit,
          fieldOnChangeHandler: this.fieldOnChangeHandler,
          registerSyntheticCandidates: this.registerSyntheticCandidates,
          schema,
          validator: this.validator,
          validateOnChange,
          validateOnBlur,
          errors,
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
    const { children } = this.props
    const { canSubmit } = this.state
    return (
      <form ref={this.formRef} onSubmit={this.handleSubmit} className="vm form">
        {this.renderForm(children)}
        <div className="form-buttons">
          <Button onClick={this.test} text="Test" />
          <Button type="submit" text="Submit" disabled={!canSubmit} />
        </div>
      </form>
    )
  }
}
