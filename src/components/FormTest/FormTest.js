import React from 'react'
import Form from 'Components/BPHome/Form'
import FormField from 'Components/BPHome/FormField'
import { Button, InputGroup } from '@blueprintjs/core'

export default class FormTest extends React.Component {
  componentDidMount() {

  }

  schema = {
    properties: {
      // username: { type: 'string', minLength: 3, pattern: '^[a-z]+$' },
      password: { type: 'string', minLength: 5 },
    },
    required: ['username'],
  }

  render() {
    return (
      <Form schema={this.schema}>
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
      </Form>
    )
  }
}
