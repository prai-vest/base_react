import React from 'react'
import cn from 'classnames'
import { Icon } from '@blueprintjs/core';

export default class AccordionItem extends React.Component {
  state = {
    focused: false,
    selected: false,
    expanded: this.props.expanded,
  }

  childPanels = []

  componentWillUnmount() {
    const { unmountHandler } = this.props
    if (unmountHandler) {
      unmountHandler(this)
    }
  }

  togglePanel = (selected = true) => new Promise((resolve) => {
    this.setState((state) => ({ selected, expanded: !state.expanded }),
      () => {
        const { expanded } = this.state
        resolve(expanded)
      })
  })

  deselectPanel = () => {
    this.setState({ selected: false })
  }

  unexpandPanel = () => {
    this.setState({ expanded: false })
  }

  setFocus = (value) => {
    this.setState({ focused: value })
  }

  registerPanelR = (ref) => {
    if (ref) {
      this.childPanels.push(ref)
    }
  }

  deregisterPanelR = (ref) => {
    const newPanels = this.childPanels.filter((panel) => ref !== panel)
    this.childPanels = newPanels
  }

  renderChildren = (children) => {
    const { depth, panelHeadClickHandler } = this.props
    return React.Children.map(children, (child, index) => {
      if (child.type === AccordionItem) {
        return React.cloneElement(child, {
          depth: depth + 1,
          id: `panel-d.${depth + 1}${index}`,
          panelHeadClickHandler,
          parentRef: this,
          ref: this.registerPanelR,
          unmountHandler: this.deregisterPanelR,
        })
      }
      return child
    })
  }

  render() {
    const {
      expanded, focused, selected,
    } = this.state
    const {
      children, title, panelHeadClickHandler, id,
    } = this.props
    const icon = expanded ? 'caret-up' : 'caret-down'

    return (
      <div
        role="treeitem"
        className="vm accordion-item"
        id={id}
        aria-selected={selected ? 'true' : 'false'}
        aria-expanded={expanded && children ? 'true' : 'false'}
      >
        <span
          className={cn('ac-header ac-link',
            { 'v-focus': focused, 'v-selected': selected, 'v-expanded': expanded })}
          onClick={() => panelHeadClickHandler(this)}
        >
          {title}
          {children && <Icon icon={icon} className="v-caret" />}
        </span>
        { children && (
          <div role="group" className="accordion-group" aria-hidden={expanded ? 'false' : 'true'}>
            {expanded && this.renderChildren(children)}
          </div>
        )}
      </div>
    )
  }
}
