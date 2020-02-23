import * as chalk from "chalk"
import * as prompts from "prompts"
import {Command, Input, getShellCommand, OptionValues} from "../data"

export enum CommandDecision {
  Run,
  EditSelectedOptions,
  ReviewRequiredOptions,
  ReviewMoreOptions,
}

export interface CommandAction {
  decision: CommandDecision
  inputs: Input[]
}

export async function CommandActionDialog(
  command: Command,
  optionValues: OptionValues,
): Promise<CommandAction> {
  const {bin, args} = getShellCommand(command, optionValues)

  const completedOptions = command.inputs.filter((input) => {
    return typeof optionValues[input.name] !== "undefined"
  })
  const additionalOptions = command.inputs.filter((input) => {
    return typeof optionValues[input.name] === "undefined"
  })
  const requiredOptions = command.inputs.filter((input) => {
    return input.isRequired && typeof optionValues[input.name] === "undefined"
  })
  const hasRequiredOptions = requiredOptions.length > 0
  const hasMoreOptions = additionalOptions.length > 0
  const hasCompletedOptions = completedOptions.length > 0
  const showReviewMoreOptions = !hasRequiredOptions && hasMoreOptions
  const showEditCompletedOptions = !hasRequiredOptions && hasCompletedOptions

  const choices: prompts.Choice[] = []
  if (hasRequiredOptions) {
    choices.push({
      title: "Review required options",
      value: {
        decision: CommandDecision.ReviewRequiredOptions,
        inputs: requiredOptions,
      },
    })
  } else {
    choices.push({
      title: "Run",
      value: {
        decision: CommandDecision.Run,
        inputs: [],
      },
    })
  }
  if (showReviewMoreOptions) {
    choices.push({
      title: "Review more options",
      value: {
        decision: CommandDecision.ReviewMoreOptions,
        inputs: additionalOptions,
      },
    })
  }
  if (showEditCompletedOptions) {
    choices.push({
      title: "Edit selected options",
      value: {
        decision: CommandDecision.EditSelectedOptions,
        inputs: completedOptions,
      },
    })
  }
  if (choices.length === 1) {
    return choices[0].value
  }
  const stringCmd = chalk.yellow(`${bin} ${args.join(" ")}`)
  const response = await prompts({
    type: "select",
    name: "confirmationDecision",
    message: stringCmd,
    choices,
    initial: 1,
  })
  return response.confirmationDecision
}
