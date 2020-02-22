import {RecipeDialog, CommandDialog} from "./dialog"

async function main() {
  const recipe = await RecipeDialog()
  await CommandDialog(recipe)
}

main()
