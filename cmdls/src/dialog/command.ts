import * as chalk from "chalk"
import * as prompts from "prompts"
import {RecipeResponse} from "../api/recipe"
import {Input, OptionValues} from "../data"

interface InputTypeToPromptType {
  [prop: string]: prompts.PromptType
}

const inputTypeToPromptType: InputTypeToPromptType = {
  string: "text",
  number: "number",
  boolean: "toggle",
}

function convertInputToPrompt(input: Input): prompts.PromptObject {
  const type = inputTypeToPromptType[input.type]
  return {
    type,
    name: input.name,
    message: input.description,
    initial: input.value,
    active: type === "toggle" ? "yes" : undefined,
    inactive: type === "toggle" ? "no" : undefined,
  }
}

export async function CommandDialog(
  recipe: RecipeResponse,
): Promise<OptionValues> {
  const {command} = recipe
  // console.log(
  //   `${chalk.green("✔")} ${chalk.yellow(command.resolution.bin)} has ${
  //     command.inputs.length
  //   } options`,
  // )

  // 1. Prompt only for required options
  // 2. [generated command]
  //    > Run
  //    > Edit
  //    > Review additional properties

  const choices = command.inputs.map((input) => {
    return convertInputToPrompt({
      ...input,
      ...recipe.inputs[input.name],
    })
  })
  const response = await prompts(choices)
  return response
}
