import React, { Profiler } from 'react'
import {
 Button, Intent, HTMLSelect,
  InputGroup, Icon,
} from '@blueprintjs/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowDown } from '@fortawesome/free-solid-svg-icons'
import range from 'Utils/range'
import BPOptionBlock from './BPOptionBlock'
import '@blueprintjs/icons/lib/css/blueprint-icons.css'
import '@blueprintjs/core/lib/css/blueprint.css'
import 'normalize.css'
import './BPHome.scss'

const OPTIONS_STRATEGY = [
  { label: 'Choose One', value: null },
  { label: 'Covered Call', value: 1 },
  { label: 'Protective Put', value: 2 },
]
export default class Home extends React.Component {
  optionBlocksRef = []

  runDataBlocks = {}

  ct = 0

  state = {
    optionBlocks: [],
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
        <h2>Blueprint Rebalancer</h2>
        <div className="card">
          <div className="card-head">
            <div className="card-title">Open Option Strategies: </div>
            <Button intent={Intent.PRIMARY} rightIcon={<FontAwesomeIcon icon={faArrowDown} />} onClick={this.addOptionBlock}>Add</Button>
          </div>
          <div className="card-body">
            <div className="rebalance-blocks-container">
              {optionBlocks.map((i) => (
                <BPOptionBlock
                  key={i}
                  keyprop={i}
                  handleSubmit={this.populateDataBlock}
                  handleDelete={this.deregisterOptionBlock}
                  registerRef={this.registerOptionBlock}
                />
              ))}
            </div>
          </div>
          <div className="card-footer">
            <Button intent={Intent.SUCCESS}>Run</Button>
          </div>
        </div>
      </div>
    )
  }
}
