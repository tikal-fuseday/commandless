import {Input} from "./"

export interface Recipe {
  description: string
  keywords: string[]
  inputs: Partial<Input>[]
}
