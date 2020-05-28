    // syntheticResetCandidates = []
  // formRef = React.createRef()
  // this.formRef.current.addEventListener('reset', this.resetForm)
  // this.syntheticResetCandidates.forEach((item) => {
  //   if (item.reset) {
  //     item.reset()
  //   }
  // })
  // registerSyntheticCandidates = (ref) => {
  //   this.syntheticResetCandidates.push(ref)
  // }


  // when doing validation individually in formfields need to query
  // all other fields to check if the form is submittable or not
  ensureIfAbleToSubmit = () => {
    const { centralizedErrorHandling } = this.props
    if (centralizedErrorHandling) {
      console.log('This shouldn\'t be firing when error-handling is centralized')
    }
    const errRef = this.syntheticResetCandidates
      .find((item) => item.state && item.state.errors && item.state.errors.length)
    if (errRef) {
      this.disableSubmit()
    } else {
      this.enableSubmit()
    }
  }


  fieldOnBlurHandler = () => {
    const { onBlur } = this.props
    if (onBlur) {
      onBlur()
    }
  }

  resetErrorForField = (dataField) => {
    const { errors } = this.state
    const filteredErrors = errors.filter(({ dataPath }) => dataPath !== `.${dataField}`)
    this.setState({
      errors: filteredErrors,
    })
  }

  /*

  remote validation stuff
  let additionalErrors = []
  if (onValidate) {
    const remoteErrors = await onValidate(data)
    if (remoteErrors.length) {
      additionalErrors = remoteErrors
    }
  }

  */
