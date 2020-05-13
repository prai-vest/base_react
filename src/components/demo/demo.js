import React from 'react'
import { Button, ButtonGroup } from '@progress/kendo-react-buttons'
import { DatePicker, DateRangePicker } from '@progress/kendo-react-dateinputs'
// import { Button, ButtonGroup, DropDownButton, DropDownButtonItem,
// SplitButton, SplitButtonItem, Toolbar, ToolbarItem } from '@progress/kendo-react-buttons';
export default class Home extends React.Component {
  componentDidMount() {
    console.log('hello')
  }

  render() {
    return (
      <div className="example-wrapper">
        <h4>Button</h4>
        <Button>Default</Button>
        <Button primary look="outline">Primary</Button>
        <Button disabled>Disabled</Button>
        <p>Button Group</p>
        <ButtonGroup>
          <Button>
            Option A
          </Button>
          <Button>
            Option B
          </Button>
          <Button>
            Option C
          </Button>
        </ButtonGroup>

        <p>DatePicker</p>
        <DatePicker />
      </div>
    )
  }
}
