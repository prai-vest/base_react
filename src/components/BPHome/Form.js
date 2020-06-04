import React from 'react'
import { Button } from '@blueprintjs/core'
// import noop from 'Utils/noop'
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
    data: {},
    mode: 'uncontrolled',
    onValidate: (a, _) => _,
    remoteValidate: () => [],
    schema: {},
    showMultipleErrors: false,
  }

  dataProperty = {}

  syntheticResetCandidates = []

  fieldsWithErrors = new Set()

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
  }

  registerErrorField = (field, inOrOut) => {
    if (inOrOut) {
      this.fieldsWithErrors.add(field)
    } else {
      this.fieldsWithErrors.delete(field)
    }

    this.setState({
      canSubmit: this.fieldsWithErrors.size === 0,
    })
  }

  resetForm = () => {
    this.setState({ ...INITIAL_STATE })
    this.syntheticResetCandidates.forEach((item) => {
      if (item.reset) {
        item.reset()
      }
    })
  }

  registerSyntheticResetCandidates = (ref) => {
    if (ref) {
      this.syntheticResetCandidates.push(ref)
    }
  }

  enableSubmit = () => {
    this.setState({ canSubmit: true })
  }

  disableSubmit = () => {
    this.setState({ canSubmit: false })
  }

  fieldOnChangeHandler = (value, dataField) => {
    // const { centralizedErrorHandling } = this.props
    const { mode } = this.props
    if (mode === 'controlled') {
      const { data } = this.state
      const newData = data
      newData[dataField] = value
      const errors = this.validate(newData)
      this.setState({ data: newData, errors, canSubmit: errors.length === 0 })
    } else {
      this.dataProperty[dataField] = value
    }

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
    const { mode } = this.props
    if (mode === 'controlled') {
      const errors = this.validate()
      this.setState({ errors, canSubmit: errors.length === 0 })
    }
  }

  validate = (data, validator = this.validateFn, dataField) => {
    const { schema, onValidate, mode } = this.props
    const errors = []
    const requiredErrors = []
    let requiredFields = []
    if (mode === 'uncontrolled') {
      console.log(this.dataProperty)
      validator(this.dataProperty)
      console.log(validator.errors)
    } else {
      validator(data)
    }
    if (validator.errors?.length) {
      /*
        dataField is only provided in uncontrolled mode
        in which case we need to process only dataField
        specific errors
      */
      const validationErrors = mode === 'uncontrolled' && dataField
        ? validator.errors.filter((errorObj) => errorObj.dataPath === `.${dataField}`)
        : validator.errors
      requiredFields = mode === 'uncontrolled' && dataField
        ? schema.required.filter((item) => item === dataField)
        : schema.required

      // separate required specific errors
      validationErrors.forEach((item) => {
        if (item.keyword === 'required') {
          requiredErrors.push(item)
        } else {
          const currentDataField = item.dataPath.slice(1)
          const { fieldSchema: { messages = {} } } = this.validator
            .getPropertySchema(currentDataField)
          errors
            .push({ ...item, ...(messages[item.keyword] && { message: messages[item.keyword] }) })
        }
      })
    }

    // add the required errors back with right message
    // add the missing required errors (only missing property triggers aj's required, not '')
    // therefore needs to be added manually
    requiredFields.forEach((currentDataField) => {
      const value = data[currentDataField]
      if (value === '' || value === null || value === undefined) {
        const errorObj = requiredErrors.find((item) => item.dataPath === `.${currentDataField}`)
        if (errorObj) {
          errors.unshift({ ...errorObj, message: 'This field is required' })
        } else {
          errors.unshift({
            dataPath: `.${currentDataField}`,
            keyword: 'required',
            message: 'This field is required',
          })
        }
      }
    })

    return onValidate(data, errors)
  }

  handleSubmit = async (event) => {
    event.preventDefault()
    this.setState({ canSubmit: false })
    const { onSubmit, remoteValidate, mode } = this.props
    const { data } = this.state
    const uiErrors = this.validate(data)
    console.log('uiErrors', uiErrors)
    if (uiErrors.length) {
      this.setState({ errors: uiErrors, showErrorsOn: () => true })
      // adds on to showErrorsOn from above
      if (mode === 'uncontrolled') {
        this.syntheticResetCandidates.forEach((item) => {
          if (item.setErrors) {
            item.setErrors(uiErrors)
          }
        })
      }
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

      this.setState({ showErrorsOn: () => true })
      if (mode === 'uncontrolled') {
        this.syntheticResetCandidates.forEach((item) => {
          if (item.setErrors) {
            item.setErrors(errors)
          }
        })
      }
    }
  }

  renderForm = (children) => {
    console.log('[Form] rendered')
    const {
      showMultipleErrors, mode, schema,
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
          formValidator: this.validate,
          fieldOnBlurHandler: this.fieldOnBlurHandler,
          // fieldOnFocus: this.fieldOnFocus,
          fieldOnChangeHandler: this.fieldOnChangeHandler,
          mode,
          registerErrorField: this.registerErrorField,
          registerSyntheticResetCandidates: this.registerSyntheticResetCandidates,
          // resetErrorForField: this.resetErrorForField,
          schema,
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

  test = () => {
    console.log(this.dataProperty)
  }

  render() {
    const { children, renderButtons } = this.props
    const { canSubmit } = this.state
    return (
      <form ref={this.formRef} onSubmit={this.handleSubmit} onReset={this.resetForm} className="vm form">
        {this.renderForm(children)}
        {!renderButtons && (
          <div className="form-buttons">
            <Button type="reset" className="reset-btn" text="Reset" />
            {/* <Button className="reset-btn" text="Reset" /> */}
            <Button type="submit" className="submit-btn" text="Submit" disabled={!canSubmit} />
          </div>
        )}
        {renderButtons && renderButtons({ formRef: this.formRef, canSubmit })}
      </form>
    )
  }
}
