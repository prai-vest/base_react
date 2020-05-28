import React from 'react'
import Accordion from 'Components/Accordion'
import AccordionItem from 'Components/Accordion/AccordionItem'

export default function AccordionTest() {
  return (
    <div className="accordion-page">
      <h2>Accordion Vestmark</h2>
      <div className="accordion-wrapper" style={{ width: '500px' }}>
        <Accordion>
          <AccordionItem title="Projects">
            <AccordionItem title="New Business Plan" />
            <AccordionItem title="Sales Forecasts" />
            <AccordionItem title="Sales Reports" />
          </AccordionItem>
          <AccordionItem title="Programs">
            <AccordionItem title="Sunday" />
            <AccordionItem title="Monday" />
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}
