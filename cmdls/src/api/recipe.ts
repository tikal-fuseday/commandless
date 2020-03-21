import axios from "axios"
import {
  Command,
  Recipe,
  RecipeType,
  Resolution,
  Input,
  InputOverridesByName,
} from "../data"

type ListRecipesResponse = {
  description: string
  keywords: string[]
  inputOverrides: InputOverridesByName
  recipeType: RecipeType
  resolutionKey?: string
  command: {
    bin: string
    resolution: Resolution
    keywords: string[]
    inputs: Input[]
  }
}[]

async function listRecipes(
  keywords: string[] = [],
  packageManagers: string[] = [],
  recipeTypes: string[] = [],
): Promise<Recipe[]> {
  const response = await axios.get(`http://localhost:8080/recipes`, {
    params: {
      ...(keywords ? {keywords: keywords.join(",")} : {}),
      ...(packageManagers ? {package_managers: packageManagers.join(",")} : {}),
      ...(recipeTypes ? {type: recipeTypes.join(",")} : {}),
    },
  })
  const listRecipesResponse: ListRecipesResponse = response.data
  const recipes = listRecipesResponse.map((recipeResponse) => {
    const command = new Command({
      bin: recipeResponse.command.bin,
      resolution: recipeResponse.command.resolution,
      keywords: recipeResponse.command.keywords,
      inputs: recipeResponse.command.inputs,
    })
    const recipe = new Recipe({
      description: recipeResponse.description,
      keywords: recipeResponse.keywords,
      inputOverrides: recipeResponse.inputOverrides,
      recipeType: recipeResponse.recipeType,
      resolutionKey: recipeResponse.resolutionKey,
      command,
    })
    return recipe
  })
  return recipes
}

export async function listRecipesByKeywords(
  keywords: string[],
  packageManagers?: string[],
): Promise<Recipe[]> {
  return listRecipes(keywords, packageManagers)
}

export async function listRecipesByTypes(
  recipeTypes: string[],
): Promise<Recipe[]> {
  return listRecipes(undefined, undefined, recipeTypes)
}
