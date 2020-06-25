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

const KEY_CODES = {
  down: 40,
  enter: 13,
  space: 32,
  up: 38,
}

describe('Accordion', () => {
  describe('Generic behavior', () => {
    let wrapper
    let instance
    beforeAll(() => {
      wrapper = mount(
        <Accordion>
          <AccordionItem title="Item One" />
          <AccordionItem title="Item Two" />
        </Accordion>,
      )
      instance = wrapper.instance()
    })
    it('generates a flattened store of child panels on mount', () => {
      expect(instance.childPanels.length).toBe(2)
      expect(instance.flattenedPanelsStore.length).toBe(2)
    })

    it('should ensure that svg\'s are not focusable', () => {
      wrapper.find('.v-caret svg').forEach((svg) => {
        const focusable = svg.getDOMNode().getAttribute('focusable')
        expect(focusable).toBe('false')
      })
    })

    it('should provide proper depth value prop to the accordion items/panels', () => {
      wrapper.find(AccordionItem).forEach((panel) => {
        expect(panel.props().depth).toBe(2)
      })
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

    it('focusPanelByIndex() ignores argument out of range', () => {
      // recap: currently item two is expanded and focused
      expect(itemTwo.state().expanded).toBe(true)
      expect(itemTwo.state().focused).toBe(true)

      instance.focusPanelByIndex(0)
      expect(itemOne.state().focused).toBe(true)
      expect(instance.activePanel).toBe(itemOne.instance())

      // out of bounds index
      instance.focusPanelByIndex(-1)
      expect(itemOne.state().focused).toBe(true)
      expect(instance.activePanel).toBe(itemOne.instance())

      instance.focusPanelByIndex(10)
      expect(itemOne.state().focused).toBe(true)
      expect(instance.activePanel).toBe(itemOne.instance())
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

    describe('Keyboard navigation', () => {
      let spyFocusHandler
      let spyClickHandler
      let spyFilterEventSource
      beforeAll(() => {
        instance.focusIndex = -1 // resetting to default
        spyFocusHandler = jest.spyOn(instance, 'focusPanelByIndex')
        spyClickHandler = jest.spyOn(instance, 'panelHeadClickHandler')
          .mockImplementation(() => {})
        spyFilterEventSource = jest.spyOn(instance, 'filterEventSource')
        // wrapper.update()
      })

      beforeEach(() => {
        jest.clearAllMocks()
      })

      it('should set focus on the first item when the accordion is focused', () => {
        expect(wrapper.state().focused).toBe(false)
        wrapper.simulate('focus')

        expect(wrapper.state().focused).toBe(true)
        expect(spyFocusHandler).toHaveBeenCalledWith(0)
      })

      it('should set focused to false on blur', () => {
        expect(wrapper.state().focused).toBe(true)
        wrapper.simulate('blur')
        expect(wrapper.state().focused).toBe(false)
      })

      it('should call focusPanelIndex and clickHandler with appropriate argument on keyboard navigation', () => {
        spyFilterEventSource.mockImplementation(() => false)
        expect(instance.focusIndex).toBe(0) // recap we're at index 0
        wrapper.simulate('keydown', { keyCode: KEY_CODES.down })
        // wrapper.simulate('keydown', { keyCode: KEY_CODES.down })

        expect(spyFocusHandler).toHaveBeenCalledWith(1) // now at index 1
        expect(instance.focusIndex).toBe(1)

        wrapper.simulate('keydown', { keyCode: KEY_CODES.down })
        wrapper.simulate('keydown', { keyCode: KEY_CODES.down })
        expect(spyFocusHandler).toHaveBeenLastCalledWith(3) // now at index 3
        expect(instance.focusIndex).toBe(3)

        wrapper.simulate('keydown', { keyCode: KEY_CODES.up })
        expect(spyFocusHandler).toHaveBeenLastCalledWith(2) // now at index 2
        expect(instance.focusIndex).toBe(2)

        wrapper.simulate('keydown', { keyCode: KEY_CODES.space }) // space to triger panel-click
        expect(spyClickHandler).toHaveBeenCalled()
        expect(spyClickHandler).toHaveBeenLastCalledWith(instance.flattenedPanelsStore[2])

        wrapper.simulate('keydown', { keyCode: KEY_CODES.enter }) // enter to triger panel-click
        expect(spyClickHandler).toHaveBeenCalledTimes(2)
        expect(spyClickHandler).toHaveBeenLastCalledWith(instance.flattenedPanelsStore[2])

        expect(spyFocusHandler).toHaveBeenCalledTimes(4)
        // other keycodes are not recognized
        wrapper.simulate('keydown', { keyCode: 14 })
        expect(spyClickHandler).toHaveBeenCalledTimes(2) // function call numbers didn't change
        expect(spyFocusHandler).toHaveBeenCalledTimes(4)
      })

      it('should skip keyboard interaction if filterEventSource returns true', () => {
        spyFilterEventSource.mockImplementation(() => true)
        const currentFocusedIndex = instance.focusIndex

        wrapper.simulate('keydown', { keyCode: KEY_CODES.down })
        expect(instance.focusIndex).toBe(currentFocusedIndex)

        wrapper.simulate('keydown', { keyCode: KEY_CODES.up })
        expect(instance.focusIndex).toBe(currentFocusedIndex)
      })
    })
  })
})
