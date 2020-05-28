import React from 'react'
import Form from 'Components/BPHome/Form'
import FormField from 'Components/BPHome/FormField'
import { Button, InputGroup } from '@blueprintjs/core'
import { DateInput } from '@blueprintjs/datetime'
// import InputMask from 'react-input-mask'
import axios from 'axios'
import VMDateInput from '../BPComponents/VMDateInput'

import 'normalize.css'
import '@blueprintjs/icons/lib/css/blueprint-icons.css'
import '@blueprintjs/core/lib/css/blueprint.css'
import '@blueprintjs/datetime/lib/css/blueprint-datetime.css'
import './FormTest.scss'


const jsDateFormatter = {
  // note that the native implementation of Date functions differs between browsers
  formatDate: (date) => date.toLocaleDateString(),
  parseDate: (str) => new Date(str),
  placeholder: 'M/D/YYYY',
};
export default class FormTest extends React.Component {
  state = {
    submitted: false,
  }

  schema = {
    properties: {
      username: {
        minLength: 3,
        pattern: '^[a-z]+$',
        messages: {
          minLength: 'Username must be 3 or more characters long',
          pattern: 'Not the right pattern',
        },
      },
      lastname: {
        type: 'string',
        minLength: 2,
        messages: {
          minLength: 'Password must have min-length of 2',
        },
      },
      birthday: { format: 'date', default: new Date() },
    },
    required: ['username', 'lastname', 'birthday'],
  }

  submitHandler = () => {
    console.log('submitHandler called')
    this.setState({
      submitted: true,
    })
  }

  goBackHandler = () => {
    this.setState({
      submitted: false,
    })
  }

  remoteValidate = (formData) => axios.post('http://localhost:3004/validate', formData)
      .then(({ data }) => {
        if (data.code === 0) {
          return true
        }
        const { errors } = data
        return Object.keys(errors).map((dataField) => ({
            dataPath: `.${dataField}`,
            message: errors[dataField],
          }))
      })

  render() {
    const { submitted } = this.state
    return (
      <div className="demo-container">
        <h2 className="title">Simple form with ui and backend validation</h2>
        <div className="form-container">
          {!submitted && (
          <Form
            schema={this.schema}
            onValidate={this.remoteValidate}
            onSubmit={this.submitHandler}
          >
            <FormField
              dataField="username"
              label="Username"
            >
              <InputGroup />
            </FormField>
            <FormField
              dataField="lastname"
              label="Lastname"
            >
              <InputGroup />
            </FormField>
            <FormField
              dataField="birthday"
              label="Birthday"
              dataGrabber={(i) => i}
            >
              <VMDateInput registerForSyntheticReset />
            </FormField>
          </Form>
        )}
          {
          submitted && (
            <h3 className="submitted-message">
              Your form has been successfully submitted.
            </h3>

          )
        }
        </div>
      </div>
    )
  }
}
