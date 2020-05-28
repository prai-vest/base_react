import { hot } from 'react-hot-loader/root'
import {
  BrowserRouter as Router, Route, Switch, Link,
} from 'react-router-dom'
import React from 'react'
import KendoFormExample from 'Components/KendoFormExample'
import Home from 'Components/Home'
import BPHome from 'Components/BPHome'
import BPComponents from 'Components/BPComponents/VMSelect'
import FormTest from 'Components/TestPages/FormTest'
import AccordionTest from 'Components/TestPages/AccordionTest'
import Demo from 'Components/demo'
import './App.scss'


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
        <div className="container">
          <Switch>
            {/* <Route exact path="/" component={FormTest} /> */}
            <Route exact path="/" component={AccordionTest} />
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
