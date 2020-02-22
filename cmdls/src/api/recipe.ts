import {Command, Recipe} from "../data"

export interface RecipeResponse extends Recipe {
  command: Command
}

export async function listRecipes(
  keywords: string[],
): Promise<RecipeResponse[]> {
  return []
}
