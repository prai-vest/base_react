import React, { Component } from 'react'
import {
 Position, Tooltip, Intent,
} from '@blueprintjs/core'
import cn from 'classnames'
import './FormField.scss'

export default class FormField extends Component {
  static defaultProps = {
    errorType: 'static',
    errors: [],
  }

  componentDidMount() {
  }

  renderToolTippedFormField = (children, errors) => (errors.length === 0
      ? children
      : (
        <Tooltip
          content={errors[0]}
          position={Position.TOP}
          intent="danger"
        >
          {children}
        </Tooltip>
      ))

  renderFormField(children) {
    const {
      dataField, onChange, errors,
    } = this.props
    const newChildren = React.Children.map(children, (child) => React.cloneElement(child, {
      className: cn('vm', 'input'),
      intent: errors.length ? Intent.DANGER : '',
      datafield: dataField,
      onChange,
    }))

    // return errortype === 'static'
    //   ? newChildren
    //   : this.renderToolTippedFormField(newChildren, errors)
    return (
      <Tooltip
        content={errors[0]}
        position={Position.TOP}
        intent="danger"
        disabled={errors.length === 0}
      >
        {newChildren}
      </Tooltip>
    )
  }

  render() {
    const {
      children, errors, errortype, label,
    } = this.props
    return (
      <div className="form-field">
        {label && <label>{label}</label>}
        {this.renderFormField(children)}
        { errors.length > 0 && errortype === 'static'
          && (
          <div className="validation-message">
            {errors[0]}
          </div>
        )}
      </div>
    )
  }
}
