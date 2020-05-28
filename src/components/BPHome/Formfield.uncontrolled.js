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
fieldSchema = {}

fieldValidator = null

isARequiredField = false

isFieldSchemaSet = false

componentDidMount() {
  const { registerSyntheticCandidates } = this.props
  registerSyntheticCandidates(this)
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
  // const {
  //   centralizedErrorHandling, dataField, ensureIfAbleToSubmit, initialValue,
  //   fieldOnChangeHandler, resetErrorForField,
  // } = this.props

  // const currentInputValue = event
  //   ? event.target.value.trim()
  //   : inputValue.trim()

  // if (currentInputValue !== initialValue) {
  //   this.setState({ modified: true })
  // }
  // // validate only if error handling is not centralized
  // if (!centralizedErrorHandling) {
  //   const { isErrorsMixed } = this.state
  //   if (isErrorsMixed) {
  //     resetErrorForField(dataField)
  //   }
  //   this.currentInputValue = currentInputValue
  //   const errors = this.validateField(this.currentInputValue || '')
  //   this.setState({ errors }, () => {
  //     ensureIfAbleToSubmit()
  //   })
  // }
  // fieldOnChangeHandler(currentInputValue, dataField)
}