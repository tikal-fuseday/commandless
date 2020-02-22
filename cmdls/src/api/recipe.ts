import axios from "axios"
import {Command, Recipe} from "../data"

export interface RecipeResponse extends Recipe {
  command: Command
}

export async function listRecipes(
  keywords: string[],
): Promise<RecipeResponse[]> {
  const response = await axios.get(
    `http://localhost:8080/recipes?keywords=${keywords.join(",")}`,
  )
  for (const recipe of response.data) {
    recipe.inputs = JSON.parse(recipe.inputs)
    recipe.command.inputs = JSON.parse(recipe.command.inputs)
  }
  return response.data
}
