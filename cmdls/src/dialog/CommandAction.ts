import * as prompts from "prompts"
import {Input, CommandApplication} from "../data"

export enum CommandDecision {
  ProceedToExecution,
  EditSelectedOptions,
  ReviewRequiredOptions,
  ReviewMoreOptions,
}

export interface CommandAction {
  decision: CommandDecision
  inputs: Input[]
}

export class CommandActionDialog {
  private commandApplication: CommandApplication
  private promptChoices: prompts.Choice[]
  constructor(commandApplication: CommandApplication) {
    this.commandApplication = commandApplication
    this.promptChoices = [
      CommandActionDialog.ReviewRequiredOptions(this),
      CommandActionDialog.RunPromptChoice(this),
      CommandActionDialog.ReviewAdditionalOptions(this),
      CommandActionDialog.EditSubmittedOptions(this),
    ]
      .filter(({isEnabled}) => isEnabled)
      .map(({promptChoice}) => promptChoice)
  }
  private get isConfigured(): boolean {
    return !this.commandApplication.hasRequiredInputs
  }
  public async run(): Promise<CommandAction> {
    const choices = this.promptChoices
    if (choices.length === 1) {
      return choices[0].value
    }
    const message = `Generated command ${this.commandApplication.show()}`
    const response = await prompts({
      type: "select",
      name: "confirmationDecision",
      message,
      choices,
    })
    return response.confirmationDecision
  }
  static RunPromptChoice(dialog: CommandActionDialog) {
    return {
      isEnabled: dialog.isConfigured,
      promptChoice: {
        title: "Proceed",
        value: {
          decision: CommandDecision.ProceedToExecution,
          inputs: [],
        },
      },
    }
  }
  static ReviewRequiredOptions(dialog: CommandActionDialog) {
    return {
      isEnabled: !dialog.isConfigured,
      promptChoice: {
        title: "Review required options",
        value: {
          decision: CommandDecision.ReviewRequiredOptions,
          inputs: dialog.commandApplication.requiredInputs,
        },
      },
    }
  }
  static ReviewAdditionalOptions(dialog: CommandActionDialog) {
    return {
      isEnabled:
        dialog.isConfigured && dialog.commandApplication.hasAdditionalInputs,
      promptChoice: {
        title: "Review more options",
        value: {
          decision: CommandDecision.ReviewMoreOptions,
          inputs: dialog.commandApplication.additionalInputs,
        },
      },
    }
  }
  static EditSubmittedOptions(dialog: CommandActionDialog) {
    return {
      isEnabled:
        dialog.isConfigured && dialog.commandApplication.hasSubmittedInputs,
      promptChoice: {
        title: "Edit submitted options",
        value: {
          decision: CommandDecision.EditSelectedOptions,
          inputs: dialog.commandApplication.submittedInputs,
        },
      },
    }
  }
}
