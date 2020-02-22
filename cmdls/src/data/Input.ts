export type InputType = "string" | "number" | "boolean"

export interface Input {
  name: string
  description: string
  type: InputType
  isRequired: boolean
  short?: string
  long?: string
  value?: any
}

export interface InputOverride {
  value: string
}

export interface InputOverridesByName {
  [inputName: string]: InputOverride
}
