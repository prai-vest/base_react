import React from 'react'

const defaultValidator = () => ''

/* eslint-disable class-methods-use-this */
export default class Form extends React.Component {
  static defaultProps = {
    data: {},
  }

  state = {
    data: {},
    errors: [],
  }

  validators = {}

  componentDidMount() {
    const { data, children } = this.props
    const newData = { ...data }
    this.setState({ data: newData })
    this.registerValidators(children)
  }

  fieldOnChangeHandler = (event) => {
    const dataField = event.target.getAttribute('dataField')
    const newValue = event.target.value
    this.setState(({ data }) => {
      const newData = data
      newData[dataField] = newValue
      return {
        data: newData,
      }
    })
  }

  test = () => {
    console.log(this.state.data)
    console.log(this.props.data)
    console.log(this.validators)
  }

  registerValidators = (children) => {
    React.Children.map(children, (child) => {
      if (!child.props) return child
      const { validator, dataField, children: childChildren } = child.props
      if (validator) {
        this.validators[dataField] = validator
      }
      if (childChildren) {
        this.registerValidators(childChildren)
      }
    })
  }

  renderForm(children) {
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
          onChange: this.fieldOnChangeHandler,
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
    const { children, data } = this.props
    return (
      <form key={data}>
        {this.renderForm(children)}
      </form>
    )
  }
}
