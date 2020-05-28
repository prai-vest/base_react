import React from 'react'
import { Icon } from '@blueprintjs/core';

export default class AccordionItem extends React.Component {
  state = {
    focused: false,
    selected: false,
    expanded: false,
  }

  togglePanel = () => {
    const { expanded } = this.state
    const newValue = !expanded
    this.setState({ expanded: newValue })
    return newValue
  }

  openPanel = () => {
    this.setState({ expanded: true })
  }

  closePanel = () => {
    this.setState({ expanded: false })
  }

  renderChildren = (children) => {
    const { depth, panelHeadClickHandler, panelRegistrar } = this.props
    return React.Children.map(children, (child, index) => {
      if (child.type === AccordionItem) {
        return React.cloneElement(child, {
          depth: depth + 1,
          id: `panel-d.${depth + 1}${index}`,
          panelHeadClickHandler,
          parentRef: this,
          ref: panelRegistrar,
        })
      }
      return child
    })
  }

  render() {
    const { expanded } = this.state
    const {
      children, title, panelHeadClickHandler, id,
    } = this.props
    const icon = expanded ? 'caret-up' : 'caret-down'

    return (
      <div role="treeitem" className="vm accordion-item" id={id}>
        <span className="ac-header ac-link" onClick={() => panelHeadClickHandler(this)}>
          {title}
          {children && <Icon icon={icon} className="v-caret" />}
        </span>
        { children && expanded && (
          <div role="group" className="accordion-group">
            {this.renderChildren(children)}
          </div>
        )}
      </div>
    )
  }
}
