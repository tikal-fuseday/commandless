import * as prompts from "prompts"
import {listRecipes, RecipeResponse} from "../api/recipe"

function getKeywords(): string[] {
  return process.argv.slice(2)
}

export async function RecipeDialog(): Promise<RecipeResponse> {
  const keywords = getKeywords()
  const recipes = await listRecipes(keywords)
  const choices = recipes.map((recipe) => {
    return {
      title: recipe.command.resolution.bin,
      description: recipe.description,
      value: recipe,
    }
  })
  const {recipeSelect} = await prompts({
    type: "select",
    name: "recipeSelect",
    message: "Select a recipe",
    choices,
    initial: 0,
  })
  return recipeSelect as RecipeResponse
}
