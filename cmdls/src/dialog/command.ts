import * as prompts from "prompts"
import {RecipeResponse} from "../api/recipe"
import {Input} from "../data"

interface InputTypeToPromptType {
  [prop: string]: prompts.PromptType
}

const inputTypeToPromptType: InputTypeToPromptType = {
  string: "text",
  number: "number",
  boolean: "toggle",
}

function convertInputToPrompt(input: Input, i: number): prompts.PromptObject {
  const type = inputTypeToPromptType[input.type]
  return {
    type,
    name: input.short || input.long || "arg" + i,
    message: input.description,
    initial: input.value,
    active: type === "toggle" ? "yes" : undefined,
    inactive: type === "toggle" ? "no" : undefined,
  }
}

export async function CommandDialog(recipe: RecipeResponse): Promise<void> {
  const choices = recipe.command.inputs.map(convertInputToPrompt)
  const response = await prompts(choices)
  console.log(response)
}
