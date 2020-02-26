import * as prompts from "prompts"
import {Command, Recipe, CommandApplication, Resolution} from "../data"
import {listRecipes} from "../api/recipe"

export class PackageManagementDialog {
  private command: Command
  constructor(command: Command) {
    this.command = command
  }
  public async run(): Promise<CommandApplication | void> {
    const message = `${this.command.bin} is not installed`
    const recipes = await listRecipes(["install", "run"])
    const probedRecipes = await Promise.all(
      recipes.map(async (recipe) => {
        const isInstalled = await recipe.command.probe()
        return {
          isInstalled,
          recipe,
        }
      }),
    )
    const choices = probedRecipes
      .filter(({recipe, isInstalled}) => {
        return (
          isInstalled &&
          this.command.hasResolution(recipe.command.bin as keyof Resolution)
        )
      })
      .map(({recipe}) => {
        return {
          title: recipe.description,
          value: recipe,
        }
      })
    if (choices.length === 0) {
      throw new Error("No package managers available")
    }
    const response = await prompts({
      type: "select",
      name: "packageManager",
      message,
      choices,
    })
    const packageManager: Recipe = response.packageManager
    const isInstaller = packageManager.command.inputs.some((input) => {
      return input.name === "package"
    })
    if (isInstaller) {
      const optionValues = {
        package: this.command.resolution[packageManager.command.bin],
      }
      for (let inputName in packageManager.inputOverrides) {
        optionValues[inputName] = packageManager.inputOverrides[inputName].value
      }
      const installer = new CommandApplication(
        packageManager.command,
        optionValues,
      )
      return await installer.execute()
    }
    // handle runners
  }
}
