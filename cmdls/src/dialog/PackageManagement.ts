import * as prompts from "prompts"
import {Recipe, CommandApplication} from "../data"
import {listRecipesByTypes} from "../api/recipe"
import {RecipeType} from "../data/Recipe"

export class PackageManagementDialog {
  private commandApplication: CommandApplication
  constructor(commandApplication: CommandApplication) {
    this.commandApplication = commandApplication
  }
  private async getPackageManagerRecipes(): Promise<Recipe[]> {
    const recipes = await listRecipesByTypes(["installer", "runner"])
    return recipes
  }
  private async getInstalledRecipes(recipes: Recipe[]) {
    const probedRecipes = await Promise.all(
      recipes.filter(async (recipe) => {
        const isInstalled = await recipe.command.probe()
        return isInstalled
      }),
    )
    return probedRecipes
  }
  private getPackageName(packageManagerRecipe: Recipe): string {
    const resolutionKey =
      packageManagerRecipe.resolutionKey || packageManagerRecipe.command.bin
    const packageName = this.commandApplication.command.resolution[
      resolutionKey
    ]
    return packageName
  }
  private async getRunner(runnerRecipe: Recipe): Promise<CommandApplication> {
    const packageManagerOptionValues = runnerRecipe.getOptionValues()
    const packageName = this.getPackageName(runnerRecipe)
    const {args} = this.commandApplication.getShellCommand()
    const runner = new CommandApplication(
      runnerRecipe.command,
      packageManagerOptionValues,
    ).supplyNext([packageName, ...args])
    return runner
  }
  private async install(installerRecipe: Recipe): Promise<void> {
    const installerCommand = installerRecipe.command
    const optionValues = installerRecipe.getOptionValues()
    const packageName = this.getPackageName(installerRecipe)
    const installer = new CommandApplication(
      installerCommand,
      optionValues,
    ).supplyNext(packageName)
    return await installer.execute()
  }
  public async run(): Promise<CommandApplication | void> {
    const packageManagerRecipes = await this.getPackageManagerRecipes()
    const packageManagers = await this.getInstalledRecipes(
      packageManagerRecipes,
    )
    const choices = packageManagers.map((packageManager) => {
      return {
        title: packageManager.description,
        value: packageManager,
      }
    })
    if (choices.length === 0) {
      throw new Error("No package managers available")
    }
    const message = `${this.commandApplication.command.bin} is not installed`
    const response = await prompts({
      type: "select",
      name: "packageManager",
      message,
      choices,
    })
    const recipe = response.packageManager as Recipe
    return recipe.recipeType === RecipeType.Installer
      ? this.install(recipe)
      : this.getRunner(recipe)
  }
}
