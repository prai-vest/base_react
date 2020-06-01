import React from 'react'
// import AccordionItem from 'Components/Accordion/AccordionItem'
import cn from 'classnames'
import './Accordion.scss'

const KEY_CODES = {
  down: 40,
  up: 38,
  space: 32,
  enter: 13,
}

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
    accordionMode: 'multi', // or multi
  }

  state = {
    activePanelId: '',
    focused: false,
  }

  accordionRef = React.createRef()

  childPanels = []

  flattenedPanelsStore = []

  activePanel = null

  selectedPanel = null

  focusIndex = -1

  componentDidMount() {
    this.createFlattenedPanelsStore()
  }

  focusPanelByIndex = (idx) => {
    if (idx < 0 || idx >= this.flattenedPanelsStore.length) {
      return
    }
    if (this.flattenedPanelsStore.includes(this.activePanel)) {
      this.activePanel.setFocus(false)
    }
    this.focusIndex = idx
    this.activePanel = this.flattenedPanelsStore[idx]
    this.activePanel.setFocus(true)
    this.setState({ activePanelId: this.activePanel.props.id })
  }

  createFlattenedPanelsStore = () => {
    this.flattenedPanelsStore = flattenChildPanels(this)
  }

  registerPanel = (ref) => {
    if (ref) {
      this.childPanels.push(ref)
    }
  }

  focusHandler = () => {
    const { onFocus } = this.props
    this.setState({ focused: true })
    if (this.focusIndex === -1) {
      this.focusIndex = 0
    }
    this.focusPanelByIndex(this.focusIndex)
    if (onFocus) {
      onFocus()
    }
  }

  blurHandler = () => {
    this.setState({ focused: false })
  }

  handleKeyPress = (event) => {
    switch (event.keyCode) {
      case KEY_CODES.down:
        this.focusPanelByIndex(this.focusIndex + 1)
        break
      case KEY_CODES.up:
        this.focusPanelByIndex(this.focusIndex - 1)
        break
      case KEY_CODES.space:
        this.panelHeadClickHandler(this.activePanel)
        break
      case KEY_CODES.enter:
        this.panelHeadClickHandler(this.activePanel)
        break
      default:
        break
    }
  }

  panelHeadClickHandler = async (panelInstance) => {
    const { accordionMode } = this.props
    // if accordion mode is single
    if (accordionMode === 'single') {
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
    this.createFlattenedPanelsStore()
    const idx = this.flattenedPanelsStore.indexOf(panelInstance)
    this.focusPanelByIndex(idx)
  }

  renderPanels = (children) => React.Children.map(children, (child, index) => {
      const { depth = 0 } = child.props
      return React.cloneElement(child, {
        depth: depth + 1,
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
