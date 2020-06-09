import React from 'react'
import { mount } from 'enzyme'
// import { Icon } from '@blueprintjs/core';
import Accordion from './Accordion'
import AccordionItem from './AccordionItem'

const wait = (waitTime = 10) => new Promise((resolve) => {
  setTimeout(() => {
    resolve()
  }, waitTime)
})

describe('Accordion', () => {
  it('generates a flattened store of child panels on mount', () => {
    const localWrapper = mount(
      <Accordion>
        <AccordionItem title="Item One" />
        <AccordionItem title="Item Two" />
      </Accordion>,
    )
    const localInstance = localWrapper.instance()

    expect(localInstance.childPanels.length).toBe(2)
    expect(localInstance.flattenedPanelsStore.length).toBe(2)

    // svg's are not focusable
    localWrapper.find('.v-caret svg').forEach((svg) => {
      const focusable = svg.getDOMNode().getAttribute('focusable')
      expect(focusable).toBe('false')
    })

    // Panels have the right depth
    localWrapper.find(AccordionItem).forEach((panel) => {
      expect(panel.props().depth).toBe(2)
    })
  })

  describe('behavior panel click (single mode)', () => {
    /* note state is deliberately shared between tests in this
      suite to verify the behavior of panel click as a whole */
    let wrapper
    let instance
    let itemOne
    let itemTwo
    beforeAll(() => {
      wrapper = mount(
        <Accordion>
          <AccordionItem title="Item One">
            <AccordionItem title="Item One - Child One" />
            <AccordionItem title="Item One - Child Two" />
          </AccordionItem>
          <AccordionItem title="Item Two">
            <div className="mello">
              hello
            </div>
          </AccordionItem>
        </Accordion>,
      )
      instance = wrapper.instance()
    })

    it('expands the Accordion Item on click if the item has children', async () => {
      expect(instance.flattenedPanelsStore.length).toBe(2)
      itemOne = wrapper.find({ title: 'Item One' })
      expect(wrapper.find({ title: 'Item One - Child One' }).exists()).toBe(false)
      const itemOneHeader = itemOne.find('.ac-header')
      expect(itemOne.state().focused).toBe(false)

      itemOneHeader.simulate('click')
      await wait()

      // child AccordionItems come into being
      expect(wrapper.find({ title: 'Item One - Child One' }).exists()).toBe(true)

      // new AccordionItems are added to flattenedStore
      expect(wrapper.find(AccordionItem).length).toBe(4)
      expect(instance.flattenedPanelsStore.length).toBe(4)

      // clicked Item becomes the selected panel
      expect(instance.selectedPanel).toBe(itemOne.instance())

      // clicked Item also becomes the active panel
      expect(instance.activePanel).toBe(itemOne.instance())

      // active panel's focused state is set to true
      expect(itemOne.state().focused).toBe(true)

      // finally activePanelId is set to be the AccordionItem's id
      expect(wrapper.state().activePanelId).toBe(itemOne.props().id)
    })

    it('closes open item and opens the clicked item when a new item is activated', async () => {
      // recap: currently item one is expanded
      expect(wrapper.find({ title: 'Item One - Child Two' }).exists()).toBe(true)
      expect(wrapper.find(AccordionItem).length).toBe(4)

      itemTwo = wrapper.find({ title: 'Item Two' })
      const itemTwoHeader = itemTwo.find('.ac-header')
      expect(itemTwo.state().focused).toBe(false)
      expect(itemTwo.state().selected).toBe(false)

      itemTwoHeader.simulate('click')
      await wait()


      // Item one's children go away
      expect(wrapper.find(AccordionItem).length).toBe(2)
      expect(wrapper.find({ title: 'Item One - Child Two' }).exists()).toBe(false)

      // Item one is no longer active
      expect(instance.activePanel).not.toBe(itemOne.instance())
      expect(instance.activePanel).toBe(itemTwo.instance())
      expect(itemTwo.state().focused).toBe(true)
      expect(itemTwo.state().selected).toBe(true)

      // activePanelId also changes
      expect(wrapper.state().activePanelId).toBe(itemTwo.props().id)
    })
  })

  describe('behaviour panel click (multi mode)', () => {
    let wrapper
    let instance
    beforeAll(() => {
      wrapper = mount(
        <Accordion mode="multiple">
          <AccordionItem title="Item One" expanded>
            <AccordionItem title="Item One - Child One" />
            <AccordionItem title="Item One - Child Two" />
          </AccordionItem>
          <AccordionItem title="Item Two">
            <div className="mello">
              hello
            </div>
          </AccordionItem>
        </Accordion>,
      )
      instance = wrapper.instance()
    })

    it('allows for more than one panel to be open', async () => {
      // console.log(wrapper.debug())
      const itemTwo = wrapper.find({ title: 'Item Two' })
      const itemTwoHeader = itemTwo.find('.ac-header')
      // Item one is currently open
      expect(wrapper.find({ title: 'Item One - Child Two' }).exists()).toBe(true)
      // Item two is not
      expect(wrapper.find('.mello').exists()).toBe(false)
      itemTwoHeader.simulate('click')
      await wait()


      // Item two is open
      expect(wrapper.find('.mello').exists()).toBe(true)
      // Item one is still open
      expect(wrapper.find({ title: 'Item One - Child Two' }).exists()).toBe(true)
    })
  })
})
