import {RecipeResponse} from "../api/recipe"
import {Input, OptionValues, getShellCommand, runShellCommand} from "../data"
import {
  OptionDialog,
  ConfirmationDialog,
  ConfirmationDecision,
  CommandAction,
} from "../dialog"

function getInitialOptionValues(recipe: RecipeResponse): OptionValues {
  const initialOptionValues: OptionValues = {}
  for (const inputName in recipe.inputs) {
    initialOptionValues[inputName] = recipe.inputs[inputName].value
  }
  return initialOptionValues
}

async function collectOptionValues(inputs: Input[]): Promise<OptionValues> {
  const optionValues: OptionValues = {}
  for (const input of inputs) {
    const {[input.name]: optionValue} = await OptionDialog(input)
    optionValues[input.name] = optionValue
  }
  return optionValues
}

async function getOptionValues(
  prevOptionValues: OptionValues,
  prevCommandAction: CommandAction,
): Promise<OptionValues> {
  if (prevCommandAction.decision === ConfirmationDecision.Run) {
    return prevOptionValues
  }
  const overridenInputs = prevCommandAction.inputs //
    .map((input, i, inputs) => {
      return {
        ...input,
        description: `(${i + 1}/${inputs.length}) ${input.description}`,
        value: prevOptionValues[input.name],
      }
    })
  const optionValues = await collectOptionValues(overridenInputs)
  return {...prevOptionValues, ...optionValues}
}

export async function CommandDialog(recipe: RecipeResponse): Promise<void> {
  let optionValues = getInitialOptionValues(recipe)
  let commandAction: CommandAction | null = null
  while (
    !commandAction ||
    commandAction.decision !== ConfirmationDecision.Run
  ) {
    commandAction = await ConfirmationDialog(recipe.command, optionValues)
    optionValues = await getOptionValues(optionValues, commandAction)
  }
  const shellCommand = getShellCommand(recipe.command, optionValues)
  await runShellCommand(shellCommand)
}
