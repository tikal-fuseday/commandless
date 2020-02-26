import {RecipeDialog, CommandDialog, ExecutionDialog} from "./dialog"

async function main() {
  const recipe = await RecipeDialog()
  if (!recipe) return
  const commandApplication = await CommandDialog(recipe)
  await new ExecutionDialog(commandApplication).run()
}

main()
