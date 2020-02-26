import * as childProcess from "child_process"
import * as chalk from "chalk"
import {Command, Input} from "."

export interface OptionValues {
  [optionName: string]: string | number | boolean | null
}

interface ShellCommand {
  bin: string
  args: string[]
}

export class CommandApplication {
  public command: Command
  public optionValues: OptionValues
  public requiredInputs: Input[]
  public additionalInputs: Input[]
  public submittedInputs: Input[]
  public hasRequiredInputs: boolean
  public hasAdditionalInputs: boolean
  public hasSubmittedInputs: boolean
  constructor(command: Command, optionValues: OptionValues) {
    this.command = command
    this.optionValues = optionValues
    this.requiredInputs = this.command.inputs.filter((input) => {
      return (
        input.isRequired && typeof this.optionValues[input.name] === "undefined"
      )
    })
    this.additionalInputs = this.command.inputs.filter((input) => {
      return typeof this.optionValues[input.name] === "undefined"
    })
    this.submittedInputs = this.command.inputs.filter((input) => {
      return typeof this.optionValues[input.name] !== "undefined"
    })
    this.hasRequiredInputs = this.requiredInputs.length > 0
    this.hasAdditionalInputs = this.additionalInputs.length > 0
    this.hasSubmittedInputs = this.submittedInputs.length > 0
  }
  private getShellCommand(): ShellCommand {
    const args = this.command.inputs
      .reduce((args, input) => {
        const flag = input.long
          ? `--${input.long}`
          : input.short
          ? `-${input.short}`
          : ""
        const value = this.optionValues[input.name]
        return value === null || value === undefined || value === false
          ? args
          : value === true
          ? [...args, flag]
          : [...args, flag, String(value)]
      }, [])
      .filter((arg) => arg !== "")
    return {
      bin: this.command.bin,
      args: args,
    }
  }
  public show(): string {
    const {bin, args} = this.getShellCommand()
    return chalk.yellow(`${bin} ${args.join(" ")}`)
  }
  public async execute(): Promise<void> {
    const {bin, args} = this.getShellCommand()
    console.log(`${chalk.green("✔")} Launching ${chalk.green(bin)}`)
    return new Promise((resolve, reject) => {
      const process = childProcess.spawn(bin, args)
      process.stdout.on("data", (data) => {
        console.log(String(data))
      })
      process.stderr.on("data", (data) => {
        console.error(String(data))
      })
      process.on("close", (code) => {
        console.log(
          code === 0
            ? chalk.green("✔ Done")
            : chalk.red(`Command exited with code ${code}`),
        )
        resolve()
      })
    })
  }
}
