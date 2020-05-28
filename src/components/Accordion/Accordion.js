import React from 'react'
// import AccordionItem from 'Components/Accordion/AccordionItem'
import './Accordion.scss'

export default class Accordion extends React.Component {
  // activePanel

  panelRefs = []

  registerPanel = (ref) => {
    this.panelRefs.push(ref)
  }


  panelHeadClickHandler = (panelInstance) => {
    // console.log(this)
    // this.togglePanel()
    panelInstance.togglePanel()

    // lets worry about closing later
    // hint, maybe also record a reference to parent?

    // close all others
    // if (hasOpened) {
    //   this.panelRefs.filter((panel) => panel !== panelInstance)
    //   .forEach((pn) => console.log(pn))
    // }
  }

  renderPanels = (children) => React.Children.map(children, (child, index) => {
      const { depth = 0 } = child.props
      return React.cloneElement(child, {
        depth: depth + 1,
        id: `panel-d.${depth + 1}${index}`,
        panelHeadClickHandler: this.panelHeadClickHandler,
        panelRegistrar: this.registerPanel,
        ref: this.registerPanel,
      })
    })

  test = () => {
    console.log(this.panelRefs)
  }

  render() {
    const { children } = this.props
    return (
      <>
        <div role="tree" tabIndex="0" aria-activedescendant="" className="vm v-accordion">
          { this.renderPanels(children) }
        </div>
        <div style={{ marginTop: '10px' }}>
          <button onClick={this.test}>Test</button>
        </div>
      </>
    )
  }
}
