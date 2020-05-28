import Ajv from 'ajv'

export default class Validator {
  cache = {}

  constructor(schema, hasDataProps) {
    this.schema = schema
    this.validateFn = Ajv({ allErrors: true }).compile(schema)
    this.defaults = !hasDataProps ? this.assembleDefaults(schema) : {}
  }

  getDefaults() {
    return this.defaults
  }


  getPropertySchema(fieldKey) {
    if (this.cache[fieldKey]) {
      return this.cache[fieldKey]
    }
    const fieldSchema = this.schema.properties[fieldKey] || {}
    const isRequired = this.schema.required?.find((item) => item === fieldKey)
    this.cache[fieldKey] = {
      fieldSchema,
      isRequired,
    }
    return this.cache[fieldKey]
  }

  assembleDefaults = ({ properties }) => Object.keys(properties)
    .reduce((prev, next) => {
      if (properties[next].default) {
        prev[next] = properties[next].default
      }
      return prev
    }, {})
}
