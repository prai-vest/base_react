import React from 'react'
import { Button } from '@progress/kendo-react-buttons'
// import { DatePicker } from '@progress/kendo-react-dateinputs'
// import { Button, ButtonGroup, DropDownButton, DropDownButtonItem,
// SplitButton, SplitButtonItem, Toolbar, ToolbarItem } from '@progress/kendo-react-buttons';
import {
 Card, CardHeader, CardTitle, CardBody, CardFooter,
} from '@progress/kendo-react-layout'
import OptionBlock from './OptionBlock'
import './Home.scss'

export default class Home extends React.Component {
  optionBlocksRef = []

  runDataBlocks = {}

  ct = 0

  state = {
    optionBlocks: [],
  }

  componentDidMount() {
    console.log('hello')
  }

  addOptionBlock = () => {
    this.setState((state) => ({
      optionBlocks: state.optionBlocks.concat(++this.ct),
    }))
  }

  run = () => {
    this.optionBlocksRef.filter(Boolean)
      .forEach((ref) => ref.onSubmit())
    console.log(this.runDataBlocks)
  }

  populateDataBlock = (ref, dataItem) => {
    this.runDataBlocks[ref._id] = dataItem
  }

  registerOptionBlock = (ref) => {
    this.optionBlocksRef.push(ref)
  }

  deregisterOptionBlock = (ref, blockKey) => {
    const remaining = this.optionBlocksRef.filter((i) => i._id !== ref._id)
    this.optionBlocksRef = remaining
    if (this.runDataBlocks[ref._id]) {
      delete this.runDataBlocks[ref._id]
    }
    this.setState((state) => ({
      optionBlocks: state.optionBlocks.filter((i) => i !== blockKey),
    }))
  }

  render() {
    const { optionBlocks } = this.state
    return (
      <div className="rebalance-right">
        <h4>Rebalance</h4>
        <Card className="rebalancer">
          <CardHeader>
            <CardTitle style={{ fontSize: '16px' }}>Open Option Strategies:</CardTitle>
            <Button primary icon="arrow-down" onClick={this.addOptionBlock}>Add</Button>
          </CardHeader>
          <CardBody>
            <div className="rebalance-blocks-container">
              {optionBlocks.map((i) => (
                <OptionBlock
                  key={i}
                  keyprop={i}
                  handleSubmit={this.populateDataBlock}
                  handleDelete={this.deregisterOptionBlock}
                  registerRef={this.registerOptionBlock}
                />
               ))}
            </div>
          </CardBody>
          <CardFooter>
            <Button onClick={this.run}>Run</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }
}
