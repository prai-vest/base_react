import React from 'react'
import { mount, render } from 'enzyme'
import makeId from 'Utils/makeId'
import FormField, { INITIAL_STATE } from './FormField'

jest.mock('Utils/makeId')

const INPUT_ID = 'fieldId_bcd'
const ERROR_ID = 'errorId_abc'
const HINT_ID = 'hintId_cde'

describe('FormField', () => {
  beforeEach(() => {
    makeId
      .mockImplementationOnce(() => ERROR_ID)
      .mockImplementationOnce(() => INPUT_ID)
      .mockImplementationOnce(() => HINT_ID)
  })
  it('should call registerSyntheticResetCandidates with itself on mount', () => {
    const mockFn = jest.fn()
    const InputChild = () => <input type="text" />
    const wrapper = mount(
      <FormField
        registerSyntheticResetCandidates={mockFn}
      >
        <InputChild />
      </FormField>,
    )
    expect(mockFn).toHaveBeenCalledWith(wrapper.instance())
  })

  it('should display provided hint and label with right attributes', () => {
    const wrapper = render(
      <FormField
        hint="This is hint"
        label="Username"
      >
        <input type="text" />
      </FormField>,
    )
    // ids are coming from makeId mock
    expect(wrapper.find('input').attr('id')).toBe(INPUT_ID)
    expect(wrapper.find('label').attr('for')).toBe(INPUT_ID)
    const hint = wrapper.find('.input-hint')
    expect(hint.attr('id')).toBe(HINT_ID)
    expect(hint.text()).toBe('Hint: This is hint')
  })

  it('should set proper states on focus and blur + reset', () => {
    const evt = { target: { value: '' } }
    const focusHandler = jest.fn()
    const blurHandler = jest.fn()
    const wrapper = mount(
      <FormField
        fieldOnFocusHandler={focusHandler}
        fieldOnBlurHandler={blurHandler}
      >
        <input type="text" />
      </FormField>,
    )
    const input = wrapper.find(`#${INPUT_ID}`)
    expect(wrapper.state()).toEqual(INITIAL_STATE)
    input.simulate('focus', evt)
    expect(focusHandler).toHaveBeenCalled()
    expect(wrapper.state()).toEqual({
      ...INITIAL_STATE,
      inFocus: true,
      touched: true,
    })

    const spyValidate = jest.spyOn(wrapper.instance(), 'localValidate')
      .mockImplementation(() => [])

    input.simulate('blur', evt)
    expect(wrapper.state()).toEqual({
      ...INITIAL_STATE,
      touched: true,
      visited: true,
    })
    expect(blurHandler).toHaveBeenCalled()
    expect(spyValidate).toHaveBeenCalled() // localValidate is called

    // reset
    wrapper.instance().reset()
    expect(wrapper.state()).toEqual(INITIAL_STATE)
  })

  it('should handle input change properly', () => {
    const onChangeHandler = jest.fn()
    const validateFn = jest.fn(() => [])
    const wrapper = mount(
      <FormField
        dataField="username"
        validate={validateFn}
        fieldOnChangeHandler={onChangeHandler}
        initialValue="abcd"
      >
        <input type="text" />
      </FormField>,
    )

    expect(validateFn).not.toHaveBeenCalled()
    const input = wrapper.find(`#${INPUT_ID}`)
    input.simulate('change', { target: { value: 'daba' } })
    expect(validateFn).toHaveBeenCalled()
    expect(wrapper.state()).toEqual({ // modified is set to true
      ...INITIAL_STATE,
      modified: true,
    })
    // onChange called with value and dataField
    expect(onChangeHandler.mock.calls[0]).toEqual(['daba', 'username'])
  })

  it('should set errors state if validation fails', () => {
    const ERRORS = [
      { message: 'This is wrong' },
      { message: 'This is alwo wrong' },
    ]
    const validateFn = jest.fn(() => ERRORS)

    const wrapper = mount(
      <FormField
        dataField="username"
        validate={validateFn}
        initialValue="abcd"
        showErrorsOn={() => true}
      >
        <input type="text" />
      </FormField>,
    )
    expect(wrapper.instance().showErrors).toBe(false)
    expect(wrapper.state().errors).toEqual([])
    const input = wrapper.find(`#${INPUT_ID}`)
    input.simulate('change', { target: { value: '' } })
    expect(wrapper.state().errors).toEqual(ERRORS.map((i) => i.message))

    // with errors set and input modified, showErrors is true
    expect(wrapper.instance().showErrors).toBe(true)

    // validation is visible
    const errorMessage = wrapper.find('.validation-message')
    expect(errorMessage.text()).toBe('This is wrong')
  })

  it.only('should register child for reset if prop registerForSyntheticReset is on child',
      () => {
    const mockFn = jest.fn()
    mockFn.prototype = React.Component.prototype
    mockFn.displayName = 'ABC'
    const refMock = jest.fn()
    const FormChild = mockFn.mockImplementation(() => ({
        render: () => <div />,
      }))

    // without registerForSyntheticReset registerer only called once
    mount(
      <FormField
        registerSyntheticResetCandidates={refMock}
        datafield="ab"
      >
        <FormChild ab="bc" />

      </FormField>,
    )

    expect(refMock).toHaveBeenCalledTimes(1)
    mockFn.mockClear()
    refMock.mockClear()

    // with registerForSyntheticReset registerer is called twice
    mount(
      <FormField
        registerSyntheticResetCandidates={refMock}
        datafield="ab"
      >
        <FormChild registerForSyntheticReset ab="bc" />

      </FormField>,
    )

    expect(refMock).toHaveBeenCalledTimes(2)
    expect(refMock.mock.calls[1][0]).toBeInstanceOf(FormChild)
  })
})
