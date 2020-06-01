import React, { useState, useCallback } from 'react'
import {
 FormGroup, InputGroup, RadioGroup, Radio,
} from '@blueprintjs/core';
import Accordion from 'Components/Accordion'
import AccordionItem from 'Components/Accordion/AccordionItem'
import './AccordionTest.scss'

export default function AccordionTest() {
  const [accordionMode, setMode] = useState('single')
  const toggleMode = useCallback((event) => {
    setMode(event.target.value)
  }, [accordionMode])

  return (
    <div className="accordion-page">
      <h2>Accordion Vestmark</h2>
      <div className="controls">
        <RadioGroup
          label="Choose Accordion Mode"
          onChange={toggleMode}
          inline
          selectedValue={accordionMode}
        >
          <Radio label="Single expand mode" value="single" />
          <Radio label="Multi expand mode" value="multi" />
        </RadioGroup>
      </div>
      <div className="accordion-wrapper" style={{ width: '500px' }}>
        <Accordion accordionMode={accordionMode}>
          <AccordionItem expanded title="Panel Alpha">
            <div className="accordion-form">
              <FormGroup
                label="Form Item Zebra"
                labelFor="text-inputA"
              >
                <InputGroup id="text-inputA" placeholder="Lorem ipsum" />
              </FormGroup>
              <FormGroup
                label="Form Item Yankee"
                labelFor="text-inputB"
              >
                <InputGroup id="text-inputB" placeholder="Lorem ipsum" />
              </FormGroup>
            </div>
          </AccordionItem>

          <AccordionItem title="Panel Bravo">
            <div className="accordion-form">
              <FormGroup
                label="Form Item Zebra"
                labelFor="text-inputC"
              >
                <InputGroup id="text-inputC" placeholder="Lorem ipsum" />
              </FormGroup>
              <FormGroup
                label="Form Item Yankee"
                labelFor="text-inputD"
              >
                <InputGroup id="text-inputD" placeholder="Lorem ipsum" />
              </FormGroup>
            </div>
          </AccordionItem>

          <AccordionItem title="Simple Item: Projects">
            <AccordionItem title="Sales Forecasts" />
            <AccordionItem title="Sales Reports" />
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}
