import {RecipeDialog, CommandDialog, ConfirmationDialog} from "./dialog"
import {getShellCommand, run} from "./data/Shell"

async function main() {
  const recipe = await RecipeDialog()
  if (!recipe) return
  const options = await CommandDialog(recipe)
  const cmd = getShellCommand(recipe.command, options)
  const isConfirmed = await ConfirmationDialog(cmd)
  if (isConfirmed) {
    run(cmd)
  } else {
    console.log("Exiting...")
  }
}

main()
