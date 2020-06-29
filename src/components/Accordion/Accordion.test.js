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

    it('also includes children of child panels in the flattened store', () => {
      // only if the children are also AccordionItems
      const localWrapper = mount(
        <Accordion>
          <AccordionItem title="Item One" />
          <AccordionItem title="Item Two">
            <AccordionItem title="Child of Child 1" />
            <AccordionItem title="Child of Child 2" />
          </AccordionItem>
        </Accordion>,
      )
      const localInstance = localWrapper.instance()

      expect(localInstance.childPanels.length).toBe(2)
      expect(localInstance.flattenedPanelsStore.length).toBe(4)
    })

    it('should ensure that svg\'s are not focusable', () => {
      wrapper.find('.v-caret svg').forEach((svg) => {
        const focusable = svg.getDOMNode().getAttribute('focusable')
        expect(focusable).toBe('false')
      })
    })

    it('should provide proper depth value prop to the accordion items/panels', () => {
      wrapper.find(AccordionItem).forEach((panel) => {
        expect(panel.props().depth).toBe(1)
      })
    })
  })


  describe('behavior panel click (single mode)', () => {
    let wrapper
    let instance
    beforeEach(() => {
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
      expect(instance.flattenedPanelsStore.length).toBe(4)
      // both accordion item's children are hidden
      const itemOne = wrapper.find({ title: 'Item One' })
      expect(wrapper.find('div.v-hidden').length).toBe(2)
      expect(itemOne.find('div.v-hidden').length).toBe(1)

      const itemOneHeader = itemOne.find('span.ac-header').at(0)
      expect(itemOne.state().focused).toBe(false)

      itemOneHeader.simulate('click')
      await wait()

      // child AccordionItems become visible
      expect(wrapper.find({ title: 'Item One' }).state().expanded).toBe(true)

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
      // setup: open item one
      const itemOne = wrapper.find({ title: 'Item One' })
      const itemOneHeader = itemOne.find('span.ac-header').at(0)
      itemOneHeader.simulate('click')
      expect(wrapper.find({ title: 'Item One' }).find('div.v-hidden').length).toBe(0)

      const itemTwo = wrapper.find({ title: 'Item Two' })
      const itemTwoHeader = itemTwo.find('.ac-header')
      expect(itemTwo.state().focused).toBe(false)
      expect(itemTwo.state().selected).toBe(false)

      itemTwoHeader.simulate('click')
      await wait()

      // Item one's children are hidden
      expect(wrapper.find({ title: 'Item One' }).find('div.v-hidden').length).toBe(1)

      // while Item two's children become visible
      expect(wrapper.find({ title: 'Item Two' }).find('div.v-hidden').length).toBe(0)

      // Item one is no longer active
      expect(instance.activePanel).not.toBe(itemOne.instance())
      expect(instance.activePanel).toBe(itemTwo.instance())
      expect(itemTwo.state().focused).toBe(true)
      expect(itemTwo.state().selected).toBe(true)

      // activePanelId also changes
      expect(wrapper.state().activePanelId).toBe(itemTwo.props().id)
    })

    it('focusPanelByIndex() ignores argument out of range', () => {
      instance.focusPanelByIndex(0)
      let itemOne = wrapper.find({ title: 'Item One' })
      expect(itemOne.state().focused).toBe(true)
      expect(instance.activePanel).toBe(itemOne.instance())
      // out of bounds index
      instance.focusPanelByIndex(-1)
      itemOne = wrapper.find({ title: 'Item One' })
      expect(itemOne.state().focused).toBe(true)
      expect(instance.activePanel).toBe(itemOne.instance())

      itemOne = wrapper.find({ title: 'Item One' })
      instance.focusPanelByIndex(10)
      expect(itemOne.state().focused).toBe(true)
      expect(instance.activePanel).toBe(itemOne.instance())
    })
  })

  describe('behaviour panel click (multi mode)', () => {
    let wrapper
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
    })

    it('allows for more than one panel to be open', async () => {
      const itemTwo = wrapper.find({ title: 'Item Two' })
      const itemTwoHeader = itemTwo.find('.ac-header')
      // Item one is currently open
      expect(wrapper.find({ title: 'Item One' }).state().expanded).toBe(true)
      // Item two is not
      expect(wrapper.find({ title: 'Item Two' }).state().expanded).toBe(false)
      itemTwoHeader.simulate('click')
      await wait()

      // Item two is now open
      expect(wrapper.find({ title: 'Item Two' }).state().expanded).toBe(true)
      // Item one is still open
      expect(wrapper.find({ title: 'Item One' }).state().expanded).toBe(true)
    })
  })

  describe('Keyboard navigation', () => {
    let wrapper
    let instance
    let spyFocusHandler
    let spyClickHandler
    let spyFilterEventSource
    beforeEach(() => {
      jest.clearAllMocks()
      wrapper = mount(
        <Accordion mode="multiple">
          <AccordionItem title="Item Uno">
            <AccordionItem title="Item Uno - Child One" />
            <AccordionItem title="Item Uno - Child Two" />
          </AccordionItem>
          <AccordionItem title="Item Dos" expanded>
            <div className="mello">
              hello
            </div>
          </AccordionItem>
          <AccordionItem title="Item Tres">
            <AccordionItem title="Item Tres - Child One">
              <AccordionItem title="Child's child - Child One" />
            </AccordionItem>
            <AccordionItem title="Item Tres - Child Two" />
          </AccordionItem>
          <AccordionItem title="Item terminal">
            <AccordionItem title="Child -terminal" />
          </AccordionItem>
        </Accordion>,
      )
      instance = wrapper.instance()
      instance.focusIndex = -1 // resetting to default
      spyFocusHandler = jest.spyOn(instance, 'focusPanelByIndex')
      spyClickHandler = jest.spyOn(instance, 'panelHeadClickHandler')
      spyFilterEventSource = jest.spyOn(instance, 'filterEventSource')
        .mockImplementation(() => false)
      // wrapper.update()
    })

    it('should set focus on the first item when the accordion is focused', () => {
      expect(wrapper.state().focused).toBe(false)
      wrapper.simulate('focus')

      expect(wrapper.state().focused).toBe(true)
      expect(spyFocusHandler).toHaveBeenCalledWith(0)
    })

    it('should set focused to false on blur', () => {
      wrapper.simulate('focus')
      expect(wrapper.state().focused).toBe(true)
      wrapper.simulate('blur')
      expect(wrapper.state().focused).toBe(false)
    })

    it('should skip keyboard interaction if filterEventSource returns true', () => {
      spyFilterEventSource.mockImplementation(() => true)
      const currentFocusedIndex = instance.focusIndex

      wrapper.simulate('keydown', { keyCode: KEY_CODES.down })
      expect(instance.focusIndex).toBe(currentFocusedIndex)

      wrapper.simulate('keydown', { keyCode: KEY_CODES.up })
      expect(instance.focusIndex).toBe(currentFocusedIndex)
    })

    it('should ignore other keyCodes', () => {
      // other keycodes are not recognized
      wrapper.simulate('keydown', { keyCode: 14 })
      expect(spyClickHandler).toHaveBeenCalledTimes(0)
      expect(spyFocusHandler).toHaveBeenCalledTimes(0)
    })

    describe('Direction down specific cases', () => {
      it('should properly skip children of closed Panel and navigate correctly', () => {
        const itemOne = wrapper.find({ title: 'Item Uno' })
        // verify itemOne is closed
        expect(itemOne.find('div.v-hidden').exists()).toBe(true)
        wrapper.simulate('focus')
        expect(spyFocusHandler).toHaveBeenLastCalledWith(0)
        expect(spyFocusHandler).toHaveBeenCalledTimes(1)

        // on direction Down we expect to skip the children of the first Panel
        wrapper.simulate('keydown', { keyCode: KEY_CODES.down })
        expect(spyFocusHandler).toHaveBeenCalledTimes(2)
        expect(spyFocusHandler).not.toHaveBeenLastCalledWith(1)
        expect(spyFocusHandler).toHaveBeenLastCalledWith(3)
      })

      it('should call focusHandler with panelLength when called from last child expanded or otherwise', () => {
        wrapper.simulate('focus')
        wrapper.simulate('keydown', { keyCode: KEY_CODES.down }) // we're on DOS
        wrapper.simulate('keydown', { keyCode: KEY_CODES.down }) // we're on TRES
        expect(spyFocusHandler).toHaveBeenLastCalledWith(4)

        wrapper.simulate('keydown', { keyCode: KEY_CODES.down }) // we're on unexpanded Item terminal
        expect(spyFocusHandler).toHaveBeenLastCalledWith(8) // skipped all unexpanded children

        wrapper.simulate('keydown', { keyCode: KEY_CODES.down })
        expect(spyFocusHandler).toHaveBeenLastCalledWith(instance.flattenedPanelsStore.length)

        wrapper.simulate('keydown', { keyCode: KEY_CODES.space }) // open terminal Panel
        wrapper.simulate('keydown', { keyCode: KEY_CODES.down })
        // we're now on the very last panel
        expect(wrapper.find({ title: 'Child -terminal' }).state().focused).toBe(true)

        wrapper.simulate('keydown', { keyCode: KEY_CODES.down })
        // note this puts you out of bounds since indices run 0 - (length - 1)
        expect(spyFocusHandler).toHaveBeenLastCalledWith(instance.flattenedPanelsStore.length)
      })
    })

    describe('Direction Up + down cases', () => {
      it('handles moving up/down between same depth unopened panels or open panels with no AccordionItem children', () => {
        wrapper.simulate('focus')
        wrapper.simulate('keydown', { keyCode: KEY_CODES.down }) // we're on DOS
        wrapper.simulate('keydown', { keyCode: KEY_CODES.down }) // we're on TRES
        expect(wrapper.find({ title: 'Item Tres' }).state().focused).toBe(true)

        // Moving up
        wrapper.simulate('keydown', { keyCode: KEY_CODES.up })
        // now on DOS
        expect(wrapper.find({ title: 'Item Tres' }).state().focused).toBe(false)
        expect(wrapper.find({ title: 'Item Dos' }).state().focused).toBe(true)
        wrapper.simulate('keydown', { keyCode: KEY_CODES.up })
        // now on Uno
        expect(wrapper.find({ title: 'Item Dos' }).state().focused).toBe(false)
        expect(wrapper.find({ title: 'Item Uno' }).state().focused).toBe(true)
      })

      it('handles moving up and down with open panels with AccordionItem children', async () => {
        const itemTres = wrapper.find({ title: 'Item Tres' })
        itemTres.find('.ac-header').at(0).simulate('click')
        await wait()

        // Item Tres is open
        expect(wrapper.find({ title: 'Item Tres' }).state().focused).toBe(true)
        expect(wrapper.find({ title: 'Item Tres' }).state().expanded).toBe(true)


        wrapper.simulate('keydown', { keyCode: KEY_CODES.down }) // active: Item Tres - Child One
        expect(wrapper.find({ title: 'Item Tres - Child One' }).state().focused).toBe(true)
        expect(wrapper.find({ title: 'Item Tres - Child One' }).state().expanded).toBe(false)

        wrapper.simulate('keydown', { keyCode: KEY_CODES.space })
        expect(wrapper.find({ title: 'Item Tres - Child One' }).state().expanded).toBe(true)

        wrapper.simulate('keydown', { keyCode: KEY_CODES.down })
        expect(wrapper.find({ title: 'Child\'s child - Child One' }).state().focused).toBe(true)

        wrapper.simulate('keydown', { keyCode: KEY_CODES.down })
        expect(wrapper.find({ title: 'Item Tres - Child Two' }).state().focused).toBe(true)
        expect(wrapper.find({ title: 'Child\'s child - Child One' }).state().focused).toBe(false)

        // UP
        wrapper.simulate('keydown', { keyCode: KEY_CODES.up })
        expect(wrapper.find({ title: 'Child\'s child - Child One' }).state().focused).toBe(true)

        wrapper.simulate('keydown', { keyCode: KEY_CODES.up })
        expect(wrapper.find({ title: 'Item Tres - Child One' }).state().focused).toBe(true)
        wrapper.simulate('keydown', { keyCode: KEY_CODES.up })
        wrapper.simulate('keydown', { keyCode: KEY_CODES.up })
        wrapper.simulate('keydown', { keyCode: KEY_CODES.up })
        expect(wrapper.find({ title: 'Item Uno' }).state().focused).toBe(true)

        wrapper.simulate('keydown', { keyCode: KEY_CODES.up })
        expect(spyFocusHandler).toHaveBeenLastCalledWith(-1)
      })
    })
  })
})
