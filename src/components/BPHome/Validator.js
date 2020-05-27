import Ajv from 'ajv'

export default class Validator {
  cache = {}

  constructor(schema) {
    this.schema = schema
    this.validateFn = Ajv({ allErrors: true }).compile(schema)
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
}
