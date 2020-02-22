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
  console.log(response.data)
  return response.data
}
