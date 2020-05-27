import React from 'react'
import Form from 'Components/BPHome/Form'
import FormField from 'Components/BPHome/FormField'
import { Button, InputGroup } from '@blueprintjs/core'
import { DateInput } from '@blueprintjs/datetime'
// import InputMask from 'react-input-mask'
import axios from 'axios'
import 'normalize.css'
import '@blueprintjs/icons/lib/css/blueprint-icons.css'
import '@blueprintjs/core/lib/css/blueprint.css'
import '@blueprintjs/datetime/lib/css/blueprint-datetime.css'


const jsDateFormatter = {
  // note that the native implementation of Date functions differs between browsers
  formatDate: (date) => date.toLocaleDateString(),
  parseDate: (str) => new Date(str),
  placeholder: 'M/D/YYYY',
};
export default class FormTest extends React.Component {
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
      password: {
        type: 'string',
        minLength: 5,
        messages: {
          minLength: 'Password must have min-length of 5',
        },
      },
      birthday: { type: 'string' },
    },
    required: ['username'],
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
    return (
      <>
        <Form
          schema={this.schema}
          onValidate={this.remoteValidate}
          onSubmit={(data) => { console.log('Submitting', data) }}
        >
          <FormField
            dataField="username"
            label="Username"
          >
            <InputGroup />
          </FormField>
          <FormField
            dataField="password"
            label="Password"
          >
            <InputGroup />
          </FormField>
          <FormField
            dataField="birthday"
            label="Birthday"
          >
            <DateInput {...jsDateFormatter} />
          </FormField>
        </Form>
      </>
    )
  }
}
