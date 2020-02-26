import {InputOverridesByName} from "./"
import {Command} from "./Command"

export interface IRecipe {
  description: string
  keywords: string[]
  inputOverrides: InputOverridesByName
  command: Command
}

export class Recipe {
  public description: string
  public keywords: string[]
  public inputOverrides: InputOverridesByName
  public command: Command
  constructor(data: IRecipe) {
    this.description = data.description
    this.keywords = data.keywords
    this.inputOverrides = data.inputOverrides
    this.command = data.command
  }
}
