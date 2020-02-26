import axios from "axios"
import {Command, Recipe, Resolution} from "../data"

type ListRecipesResponse = {
  description: string
  keywords: string[]
  inputs: string // InputOverridesByName
  command: {
    bin: string
    resolution: Resolution
    keywords: string[]
    inputs: string // Input[]
  }
}[]

export async function listRecipes(keywords: string[]): Promise<Recipe[]> {
  const response = await axios.get(
    `http://localhost:8080/recipes?keywords=${keywords.join(",")}`,
  )
  const listRecipesResponse: ListRecipesResponse = response.data
  const recipes = listRecipesResponse.map((recipeResponse) => {
    const command = new Command({
      bin: recipeResponse.command.bin,
      resolution: recipeResponse.command.resolution,
      keywords: recipeResponse.command.keywords,
      inputs: JSON.parse(recipeResponse.command.inputs),
    })
    const recipe = new Recipe({
      description: recipeResponse.description,
      keywords: recipeResponse.keywords,
      inputOverrides: JSON.parse(recipeResponse.inputs),
      command,
    })
    return recipe
  })
  return recipes
}
