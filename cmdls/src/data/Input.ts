export type InputType = "string" | "number" | "boolean" | "array"

export interface Input {
  name: string
  description: string
  type: InputType
  isRequired: boolean
  short?: string
  long?: string
  value?: any
}

export type InputValue = string[] | string | number | boolean | null

export interface InputOverride {
  value: InputValue
}

export interface InputOverridesByName {
  [inputName: string]: InputOverride
}
