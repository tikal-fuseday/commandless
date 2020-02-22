import {RecipeDialog, CommandDialog} from "./dialog"

async function main() {
  const recipe = await RecipeDialog()
  if (!recipe) return
  await CommandDialog(recipe)
}

main()
