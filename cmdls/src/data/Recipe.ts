import {InputOverridesByName} from "./"

export interface Recipe {
  description: string
  keywords: string[]
  inputs: InputOverridesByName
}
