import React from 'react'
import Form from 'Components/BPHome/Form'
import FormField from 'Components/BPHome/FormField'
import { Button, InputGroup } from '@blueprintjs/core'

export default class FormTest extends React.Component {
  componentDidMount() {

  }

  render() {
    return (
      <Form>
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
