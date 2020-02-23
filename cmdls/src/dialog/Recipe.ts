import * as prompts from "prompts"
import {listRecipes, RecipeResponse} from "../api/recipe"

function getKeywords(): string[] {
  return process.argv.slice(2)
}

export async function RecipeDialog(): Promise<RecipeResponse | undefined> {
  const keywords = getKeywords()
  if (keywords.length === 0) {
    console.log("Provide a list of keywords")
    return
  }
  const recipes = await listRecipes(keywords)
  if (recipes.length === 0) {
    console.log("no recipes found")
    return
  }
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
