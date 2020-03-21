import {InputOverridesByName} from "./"
import {Command} from "./Command"
import {OptionValues} from "./CommandApplication"

export enum RecipeType {
  Regular = "regular",
  Installer = "installer",
  Runner = "runner",
}

export interface IRecipe {
  description: string
  keywords: string[]
  inputOverrides: InputOverridesByName
  command: Command
  recipeType: RecipeType
  resolutionKey?: string
}

export class Recipe {
  public description: string
  public keywords: string[]
  public inputOverrides: InputOverridesByName
  public command: Command
  public recipeType: RecipeType
  public resolutionKey?: string
  constructor(data: IRecipe) {
    this.description = data.description
    this.keywords = data.keywords
    this.inputOverrides = data.inputOverrides
    this.command = data.command
    this.recipeType = data.recipeType
    this.resolutionKey = data.resolutionKey
  }
  public getOptionValues(): OptionValues {
    const optionValues = {}
    for (let inputName in this.inputOverrides) {
      optionValues[inputName] = this.inputOverrides[inputName].value
    }
    return optionValues
  }
}
