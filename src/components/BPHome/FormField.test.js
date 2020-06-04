import React from 'react'
import { mount } from 'enzyme'
import FormField from './FormField'

describe('FormField', () => {
  it('should work', () => {
    const FormChild = jest.fn(() => <input type="text" />)
    const wrapper = mount(<FormField><FormChild /></FormField>)
    console.log(wrapper.debug())
    expect(wrapper.find(FormChild).exists()).toBe(true)
    expect(FormChild).toHaveBeenCalled()
    console.log(FormChild.mock.calls[0][0])
  })
})
