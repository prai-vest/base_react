import React from 'react'
import { Button, ButtonGroup } from '@progress/kendo-react-buttons'
import { DatePicker } from '@progress/kendo-react-dateinputs'
// import { Button, ButtonGroup, DropDownButton, DropDownButtonItem,
// SplitButton, SplitButtonItem, Toolbar, ToolbarItem } from '@progress/kendo-react-buttons';
import {
 Card, CardHeader, CardTitle, CardBody,
} from '@progress/kendo-react-layout'
import {
  DropDownList,
} from '@progress/kendo-react-dropdowns'
import { FieldWrapper, FormElement } from '@progress/kendo-react-form'
import { Label } from '@progress/kendo-react-labels'
import { Input } from '@progress/kendo-react-inputs'
import './Home.scss'

export default class Home extends React.Component {
  componentDidMount() {
    console.log('hello')
  }

  render() {
    return (
      <div className="rebalance-right">
        <h4>Rebalance</h4>
        <Card className="rebalancer">
          <CardHeader>
            <CardTitle style={{ fontSize: '16px' }}>Open Option Strategies:</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="rebalance-blocks-container">
              <div className="open-option-block">
                <div className="block-top">
                  <DropDownList
                    data={['Covered Call', 'Protective Put']}
                    defaultItem="Choose One"
                  />
                  <FieldWrapper>
                    <Label>Underlying Symbol</Label>
                    <Input />
                  </FieldWrapper>
                  <fieldset>
                    {/* <legend>Coverage</legend> */}
                    <FieldWrapper>
                      <Label>% Change</Label>
                      <Input />
                    </FieldWrapper>
                    <FieldWrapper>
                      <Label>Target %</Label>
                      <Input />
                    </FieldWrapper>
                  </fieldset>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    )
  }
}
