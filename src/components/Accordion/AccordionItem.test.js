import React from 'react'
import { mount } from 'enzyme'
import { Icon } from '@blueprintjs/core';
import AccordionItem from './AccordionItem'

describe('AccordionItem', () => {
  let wrapper
  let instance

  beforeEach(() => {
    wrapper = mount(
      <AccordionItem title="Item 1">
        <div>hello</div>
      </AccordionItem>,
    )
    instance = wrapper.instance()
  })
  it('should get it\'s title text from title prop', () => {
    expect(wrapper.find('.ac-header').text()).toContain('Item 1')
  })

  it('should get expanded state from props', () => {
    expect(wrapper.state().expanded).toBe(false)

    wrapper = mount(<AccordionItem title="Item 1" expanded />)
    expect(wrapper.state().expanded).toBe(true)
  })

  it('should call provided unmountHandler with itself on unmount', () => {
    const unmountHandler = jest.fn()
    wrapper = mount(<AccordionItem unmountHandler={unmountHandler} title="Item 1" />)
    expect(unmountHandler).not.toHaveBeenCalled()
    wrapper.unmount()
    expect(unmountHandler).toHaveBeenCalled()
  })

  describe('togglePanel', () => {
    it('should toggle the expanded state and set selected to provided argument', async () => {
      expect(wrapper.state().expanded).toBe(false)
      expect(wrapper.state().selected).toBe(false)
      let caret = wrapper.find(Icon)
      expect(caret.props().icon).toBe('caret-down')
      expect(wrapper.contains(<div>hello</div>)).toBe(false)
      await instance.togglePanel()

      expect(wrapper.state().expanded).toBe(true)
      expect(wrapper.state().selected).toBe(true)
      wrapper.update()
      caret = wrapper.find(Icon)
      expect(caret.props().icon).toBe('caret-up')
      expect(wrapper.contains(<div>hello</div>)).toBe(true)
      await instance.togglePanel()

      expect(wrapper.state().expanded).toBe(false)
      expect(wrapper.state().selected).toBe(true) // note selected stayed true
    })
  })

  it('deselectPanel() should set selected state to false', async () => {
    await instance.togglePanel()
    expect(wrapper.state().selected).toBe(true)

    instance.deselectPanel()
    expect(wrapper.state().selected).toBe(false)
  })

  it('unexpandPanel() should set expanded state to false', async () => {
    await instance.togglePanel()
    expect(wrapper.state().expanded).toBe(true)

    instance.unexpandPanel()
    expect(wrapper.state().expanded).toBe(false)
  })

  it('setFocus() should set the selected state to provided argument', () => {
    expect(wrapper.state().focused).toBe(false)

    instance.setFocus(true)
    expect(wrapper.state().focused).toBe(true)

    instance.setFocus(false)
    expect(wrapper.state().focused).toBe(false)
  })

  it('registerPanelR() should add provided value to childPanels property', () => {
    expect(instance.childPanels.length).toBe(0)

    instance.registerPanelR('AAA')
    expect(instance.childPanels[0]).toBe('AAA')
  })

  it('deregisterPanelR() should remove provided item from childPanels array', () => {
    instance.registerPanelR('AAA')
    instance.registerPanelR('BBB')

    instance.deregisterPanelR('BBB')
    expect(instance.childPanels).toEqual(['AAA'])
  })

  describe('classes and aria interaction', () => {
    it('should set aria attributes correctly', async () => {
      const mainNode = wrapper.getDOMNode()
      // defaults
      expect(mainNode.getAttribute('aria-selected')).toBe('false')
      expect(mainNode.getAttribute('aria-expanded')).toBe('false')

      await instance.togglePanel()
      wrapper.update()
      expect(mainNode.getAttribute('aria-selected')).toBe('true')
      expect(mainNode.getAttribute('aria-expanded')).toBe('true')

      instance.deselectPanel(false)
      wrapper.update()
      expect(mainNode.getAttribute('aria-selected')).toBe('false')
    })

    it('should set classes correctly', async () => {
      let headerNode = wrapper.find('.ac-header')
      // defaults
      expect(headerNode.hasClass('v-expanded')).toBe(false)
      expect(headerNode.hasClass('v-focus')).toBe(false)
      expect(headerNode.hasClass('v-selected')).toBe(false)
      await instance.togglePanel()
      wrapper.update()

      headerNode = wrapper.find('.ac-header')
      expect(headerNode.hasClass('v-expanded')).toBe(true)
      expect(headerNode.hasClass('v-selected')).toBe(true)
    })
  })
})
