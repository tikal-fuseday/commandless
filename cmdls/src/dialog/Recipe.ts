import * as prompts from "prompts"
import {listRecipes} from "../api/recipe"
import {Recipe} from "../data"

function getKeywords(): string[] {
  return process.argv.slice(2)
}

export async function RecipeDialog(): Promise<Recipe | undefined> {
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
      title: recipe.description,
      // description: recipe.command.bin,
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
  return recipeSelect as Recipe
}
