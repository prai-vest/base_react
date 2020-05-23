import React from 'react'
import { Button } from '@blueprintjs/core'

import './Form.scss'

/* eslint-disable class-methods-use-this */
export default class Form extends React.PureComponent {
  static defaultProps = {
    data: {},
  }

  syntheticResetCandidates = []

  formRef = React.createRef()

  state = {
    data: {},
    canSubmit: true,
  }

  componentDidMount() {
    // const { data } = this.props
    // const newData = { ...data }
    // this.setState({ data: newData })
    this.formRef.current.addEventListener('reset', () => {
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

  handleSubmit = (event) => {
    event.preventDefault()
    console.log(this.state.data)
  }

  test = () => {
    console.log(this.state)
    console.log(this.syntheticResetCandidates)
    console.log(this.syntheticResetCandidates[0].state)
  }

  renderForm = (children) => {
    console.log('[Form] rendered')
    const { data: initialData } = this.props
    const { data: currentData, errors } = this.state
    const modifiedChild = React.Children.map(children, (child) => {
      if (!child.props) return child
      const { dataField } = child.props
      if (dataField) {
        // * Hook onChange and errors and anyOther
        // * mayBe also value and Initial Value
        // * Hence Form-Field becomes strictly controlled?
        return React.cloneElement(child, {
          initialValue: initialData[dataField],
          currentValue: currentData[dataField],
          ensureIfAbleToSubmit: this.ensureIfAbleToSubmit,
          onChange: this.fieldOnChangeHandler,
          registerSyntheticCandidates: this.registerSyntheticCandidates,
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
    return (
      <form ref={this.formRef} onSubmit={this.handleSubmit} className="vm form">
        {this.renderForm(children)}
        <div className="form-buttons">
          <Button onClick={this.test} text="Test" />
          <Button type="submit" text="Submit" />
        </div>
      </form>

    )
  }
}
