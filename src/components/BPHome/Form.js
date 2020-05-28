import React from 'react'
import { Button } from '@blueprintjs/core'
import Validator from './Validator'
import './Form.scss'

// centralizedErrorHandling: true,
const INITIAL_STATE = {
  data: {},
  canSubmit: true,
  errors: [],
  showErrorsOn(state) {
    return state.modified || state.visited
  },
}
export default class Form extends React.PureComponent {
  static defaultProps = {
    onValidate: (a) => a,
    showMultipleErrors: false,
  }

  // eslint-disable-next-line
  constructor(props) {
    super(props)
    const { schema, data } = this.props
    this.validator = new Validator(schema, data)
    const { validateFn, defaults } = this.validator
    const defaultData = { ...defaults, ...data }
    this.defaultData = defaultData
    this.validateFn = validateFn
    this.state = {
      ...INITIAL_STATE,
      data: this.defaultData,
    }
  }

  componentDidMount() {
    // console.log(this.state)
  }

  resetForm = () => {
    this.setState({ ...INITIAL_STATE })
  }

  enableSubmit = () => {
    this.setState({ canSubmit: true })
  }

  disableSubmit = () => {
    this.setState({ canSubmit: false })
  }

  fieldOnChangeHandler = (value, dataField) => {
    // const { centralizedErrorHandling } = this.props
    const { data } = this.state
    const newData = data
    newData[dataField] = value
    this.setState({ data: newData })
    // if (centralizedErrorHandling) {
    const errors = this.validate()
    this.setState({ errors, canSubmit: errors.length === 0 })
    // }
  }

  fieldOnFocus = () => {
    // const { centralizedErrorHandling } = this.props
    // if (centralizedErrorHandling) {
    // const { data } = this.state
    // const errors = this.validate(data)
    // this.setState({ errors, canSubmit: errors.length === 0 })
    // }
  }

  fieldOnBlurHandler = () => {
    const errors = this.validate()
    this.setState({ errors, canSubmit: errors.length === 0 })
  }

  validate = () => {
    const { schema, onValidate } = this.props
    const { data } = this.state
    const errors = []
    const requiredErrors = []
    this.validateFn(data)
    if (this.validateFn.errors?.length) {
      // separate required specific errors
      this.validateFn.errors.forEach((item) => {
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

    return onValidate(errors)
  }

  handleSubmit = async (event) => {
    event.preventDefault()
    this.setState({ canSubmit: false })
    const { onSubmit, remoteValidate } = this.props
    const { data } = this.state
    const uiErrors = this.validate()
    if (uiErrors.length) {
      this.setState({ errors: uiErrors, showErrorsOn: () => true })
      return
    }

    let remoteErrors = []
    if (remoteValidate) {
      remoteErrors = await remoteValidate(data)
    }
    const errors = uiErrors.concat(remoteErrors)

    if (errors.length === 0) {
      onSubmit(data)
    } else {
      this.setState({ errors, canSubmit: false })
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
          // centralizedErrorHandling,
          dataField,
          // ensureIfAbleToSubmit: this.ensureIfAbleToSubmit,
          errors: fieldSpecificErrors,
          fieldOnBlurHandler: this.fieldOnBlurHandler,
          // fieldOnFocus: this.fieldOnFocus,
          fieldOnChangeHandler: this.fieldOnChangeHandler,
          // registerSyntheticCandidates: this.registerSyntheticCandidates,
          // resetErrorForField: this.resetErrorForField,
          showErrorsOn,
          // showErrorsOverride,
          showMultipleErrors,
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
