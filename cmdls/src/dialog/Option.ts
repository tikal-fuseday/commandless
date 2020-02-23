import * as prompts from "prompts"
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

export async function OptionDialog(input: Input): Promise<OptionValues> {
  const response = await prompts(convertInputToPrompt(input))
  return response
}
