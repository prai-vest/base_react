
import React, { createRef } from 'react'
import {
 Form, Field, FormElement,
} from '@progress/kendo-react-form'
import { Input } from '@progress/kendo-react-inputs'
import { Error } from '@progress/kendo-react-labels';

const emailRegex = new RegExp(/\S+@\S+\.\S+/);
const emailValidator = (value) => {
  console.log(value)
  return (emailRegex.test(value) ? '' : 'Please enter a valid email.');
}
const EmailInput = (fieldRenderProps) => {
  const { validationMessage, visited, ...others } = fieldRenderProps;
  return (
    <div>
      <Input {...others} />
      {
        visited && validationMessage
          && (<Error>{validationMessage}</Error>)
      }
    </div>
  )
}

const KendoFormExample = () => {
  const handleSubmit = (dataItem) => console.log(dataItem);
  const formRef = createRef()
  const cb = () => {
    console.log(formRef)
    console.log(formRef.current.onSubmit())
  }
  return (
    <>
      <Form
        ref={formRef}
        onSubmit={handleSubmit}
        render={(formRenderProps) => (
          <FormElement style={{ maxWidth: 650 }}>
            <fieldset className="k-form-fieldset">
              <legend className="k-form-legend">Please fill in the fields:</legend>
              <div className="mb-3">
                <Field name="firstName" component={Input} label="First name" />
              </div>

              <div className="mb-3">
                <Field name="lastName" component={Input} label="Last name" />
              </div>

              <div className="mb-3">
                <Field name="email" type="email" component={EmailInput} label="Email" validator={emailValidator} />
              </div>
            </fieldset>
            <div className="k-form-buttons">
              <button
                type="submit"
                className="k-button"
                disabled={!formRenderProps.allowSubmit}
              >
                Submit
              </button>
            </div>
          </FormElement>
            )}
      />
      <button onClick={cb}>Test Ref</button>
    </>
  );
};

export default KendoFormExample
