import {Recipe, CommandApplication, Input, OptionValues} from "../data"
import {
  OptionDialog,
  CommandActionDialog,
  ConfirmationDecision,
  CommandAction,
} from "."

function getInitialOptionValues(recipe: Recipe): OptionValues {
  const initialOptionValues: OptionValues = {}
  for (const inputName in recipe.inputOverrides) {
    initialOptionValues[inputName] = recipe.inputOverrides[inputName].value
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
  if (prevCommandAction.decision === ConfirmationDecision.ProceedToExecution) {
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

export async function CommandDialog(
  recipe: Recipe,
): Promise<CommandApplication> {
  let optionValues = getInitialOptionValues(recipe)
  let commandAction: CommandAction | null = null
  let commandApplication = new CommandApplication(recipe.command, optionValues)
  while (
    !commandAction ||
    commandAction.decision !== ConfirmationDecision.ProceedToExecution
  ) {
    const commandActionDialog = new CommandActionDialog(commandApplication)
    commandAction = await commandActionDialog.run()
    optionValues = await getOptionValues(optionValues, commandAction)
    commandApplication = new CommandApplication(recipe.command, optionValues)
  }
  return commandApplication
}
