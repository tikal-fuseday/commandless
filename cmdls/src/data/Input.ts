export type InputType = "string" | "number" | "boolean"

export interface Input {
  description: string
  type: InputType
  isRequired: boolean
  short?: string
  long?: string
  value?: any
}
