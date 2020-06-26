import React from 'react'
// import AccordionItem from 'Components/Accordion/AccordionItem'
import cn from 'classnames'
import './Accordion.scss'

const KEY_CODES = {
  down: 40,
  enter: 13,
  space: 32,
  up: 38,
}
/*
  transforms a tree-like structure into a flat array
*/
function flattenChildPanels(panel, store = []) {
  if (panel.childPanels.length) {
    panel.childPanels.forEach((item) => {
      store.push(item)
      store = store.concat(flattenChildPanels(item))
    })
  }
  return store
}

export default class Accordion extends React.Component {
  static defaultProps = {
    mode: 'single', // or multiple
  }

  state = {
    activePanelId: '',
    focused: false,
  }

  accordionRef = React.createRef()

  childPanels = []

  // stores flattened representation of accordion
  // panels of unknown depth for ease of traversing
  // during keyboard navigation
  flattenedPanelsStore = []

  activePanel = null

  selectedPanel = null

  focusIndex = -1

  componentDidMount() {
    this.createFlattenedPanelsStore()

    // IE fix for making panel caret unfocusable
    const svgs = this.accordionRef.current
      .querySelectorAll('svg')
    Array.from(svgs).forEach((item) => {
      item.setAttribute('focusable', 'false')
    })
  }

  focusPanelByIndex = (idx) => {
    if (idx < 0 || idx >= this.flattenedPanelsStore.length) {
      return
    }
    // remove focus from now old active panel
    if (this.flattenedPanelsStore.includes(this.activePanel)) {
      this.activePanel.setFocus(false)
    }
    this.focusIndex = idx
    this.activePanel = this.flattenedPanelsStore[idx] // new active panel
    this.activePanel.setFocus(true)
    this.setState({ activePanelId: this.activePanel.props.id })
  }

  createFlattenedPanelsStore = () => {
    this.flattenedPanelsStore = flattenChildPanels(this)
  }

  // register immediate childPanels
  registerPanel = (ref) => {
    if (ref) {
      this.childPanels.push(ref)
    }
  }

  focusHandler = () => {
    this.setState({ focused: true })
    if (this.focusIndex === -1) {
      this.focusIndex = 0
    }
    this.focusPanelByIndex(this.focusIndex)
  }

  blurHandler = () => {
    this.setState({ focused: false })
  }

  // document.activeElement not mockable
  /* istanbul ignore next */
  filterEventSource = () => document.activeElement !== this.accordionRef.current
      && !document.activeElement.matches('.ac-header')

  getNextFocusIndex = (direction) => {
    const currentFocusIndex = this.focusIndex
    const currentPanel = this.activePanel
    const currentDepth = currentPanel.props.depth
    if (direction === 'DOWN') {
      const nextFocusIndex = currentFocusIndex + 1
      // if currentPanel is closed, we can skip all it's children
      if (currentPanel.state.expanded === false) {
        return nextFocusIndex + flattenChildPanels(currentPanel).length
      }
      return nextFocusIndex
    }

    // direction 'UP'
    const nextFocusIndex = currentFocusIndex - 1
    if (nextFocusIndex <= 0) {
      return nextFocusIndex
    }
    let nextPanel = this.flattenedPanelsStore[nextFocusIndex]

    // if depth of next panel is lower, we know we're good
    // because the panel must be open if current panel is it's child
    if (nextPanel.props.depth < currentDepth) {
      return nextFocusIndex
    }

    // else if the next panel's depth is higher, we'll need to get
    // up to it's parent on same depth as currentPanel to see if the panel
    // is open or not
    let ct = 1
    while (nextPanel.props.depth !== currentDepth) {
      nextPanel = this.flattenedPanelsStore[nextFocusIndex - ct]
      ct++
    }
    // if the next panel in same depth is closed
    // we can skip all it's children and directly go to it
    if (!nextPanel.state.expanded) {
      return this.flattenedPanelsStore.indexOf(nextPanel)
    }

    // else carry on as usual
    return nextFocusIndex
  }

  handleKeyPress = (event) => {
    if (this.filterEventSource()) {
      return
    }
    switch (event.keyCode) {
      case KEY_CODES.down:
        this.focusPanelByIndex(this.getNextFocusIndex('DOWN'))
        break
      case KEY_CODES.up:
        this.focusPanelByIndex(this.getNextFocusIndex('UP'))
        break
      case KEY_CODES.space:
      case KEY_CODES.enter:
        this.panelHeadClickHandler(this.activePanel)
        break
      default:
        break
    }
  }

  panelHeadClickHandler = async (panelInstance) => {
    const { mode } = this.props
    // if accordion mode is single
    if (mode === 'single') {
      // get all other panels on same depth and deselect/unexpand them
      const sameDepthPanels = this.flattenedPanelsStore.filter(
        (panel) => panel.props.depth === panelInstance.props.depth
          && panel !== panelInstance,
      )
      sameDepthPanels.forEach((panel) => {
        panel.deselectPanel()
        panel.unexpandPanel()
      })
    }

    if (panelInstance !== this.selectedPanel) {
      if (this.selectedPanel) {
        this.selectedPanel.deselectPanel()
      }
      this.selectedPanel = panelInstance
    }
    await panelInstance.togglePanel()
    const idx = this.flattenedPanelsStore.indexOf(panelInstance)
    this.focusPanelByIndex(idx)
  }

  renderPanels = (children) => React.Children.map(children, (child, index) => {
      const { depth } = child.props
      return React.cloneElement(child, {
        depth,
        id: `panel-d.${depth + 1}${index}`,
        panelHeadClickHandler: this.panelHeadClickHandler,
        ref: this.registerPanel,
      })
    })

  render() {
    const { children } = this.props
    const { focused, activePanelId } = this.state
    return (
      <div
        role="tree"
        tabIndex="0"
        className={cn('vm v-accordion', { focused })}
        onFocus={this.focusHandler}
        onBlur={this.blurHandler}
        onKeyDown={this.handleKeyPress}
        {
          ...(activePanelId && { 'aria-activedescendant': activePanelId })
        }
        ref={this.accordionRef}
      >
        { this.renderPanels(children) }
      </div>
    )
  }
}
