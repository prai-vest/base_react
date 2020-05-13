import { hot } from 'react-hot-loader/root'
import {
  BrowserRouter as Router, Route, Switch, Link,
} from 'react-router-dom'
import React from 'react'
import Home from 'Components/Home'
import Demo from 'Components/demo'
import './App.scss'
import '@progress/kendo-theme-default/dist/all.css'


function App() {
  return (
    <Router>
      <div className="app-root">
        <nav>
          <ul>
            <li><Link to="/">Main</Link></li>
            <li><Link to="/components">Components</Link></li>
          </ul>
        </nav>
        <div className="container">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/components" component={Demo} />
          </Switch>
        </div>
      </div>
    </Router>
  )
}

export default hot(App)
