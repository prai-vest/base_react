import { hot } from 'react-hot-loader/root'
import {
  BrowserRouter as Router, Route, Switch, Link,
} from 'react-router-dom'
// import { createBrowserHistory } from 'history'
import {
  Navbar, NavbarGroup, NavbarHeading, NavbarDivider,
  Alignment, Classes, Button,
} from '@blueprintjs/core'
import React, { useState, useEffect, useCallback } from 'react'
import cn from 'classnames'
import KendoFormExample from 'Components/KendoFormExample'
import Home from 'Components/Home'
import BPHome from 'Components/BPHome'
import BPComponents from 'Components/BPComponents/VMSelect'
import FormTest from 'Components/TestPages/FormTest'
import AccordionTest from 'Components/TestPages/AccordionTest'
import Presentation from 'Components/TestPages/Presentation'
import Demo from 'Components/demo'
import './App.scss'

// function compareHref(to) {
//   return function compare(value) {
//     return value === to
//   }
// }

function App() {
  return (
    <Router>
      <div className="app-root">
        {/* <nav>
          <ul>
            <li><Link to="/">Main</Link></li>
            <li><Link to="/components">Components</Link></li>
            <li><Link to="/kendoForm">KendoFormExample</Link></li>
            <li><Link to="/bpcomponents">BP-Components</Link></li>
            <li><Link to="/blueprint">Blueprint</Link></li>
            <li><Link to="/formtest">Form-Test</Link></li>
          </ul>
        </nav> */}
        {/* <Navbar>
          <NavbarGroup align={Alignment.LEFT}>
            <NavbarHeading>DEMO</NavbarHeading>
            <NavbarDivider />

            <Link to="/">
              <Button className={cn(Classes.MINIMAL)} icon="data-lineage" text="Accordion" />
            </Link>
            <Link to="/form">
              <Button className={cn(Classes.MINIMAL)} icon="remove-row-bottom" text="Form" />
            </Link>

          </NavbarGroup>
        </Navbar> */}
        <div className="container">
          <Switch>
            {/* <Route exact path="/" component={AccordionTest} /> */}
            {/* <Route exact path="/form" component={FormTest} /> */}
            <Route exact path="/" from component={Presentation} />
            {/* <Route path="/components" component={Demo} />
            <Route path="/kendoForm" component={KendoFormExample} />
            <Route path="/bpcomponents" component={BPComponents} />
            <Route path="/blueprint" component={BPHome} />
            <Route path="/formtest" component={FormTest} /> */}
          </Switch>
        </div>
      </div>
    </Router>
  )
}

export default hot(App)
