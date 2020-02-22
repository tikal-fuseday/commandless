import {spawn} from "child_process"
import * as chalk from "chalk"
import {Command} from "./Command"

export interface OptionValues {
  [optionName: string]: string | number | boolean | null
}

export interface ShellCommand {
  bin: string
  args: string[]
}

export function getShellCommand(
  command: Command,
  options: OptionValues,
): ShellCommand {
  const cmds = command.resolution.bin.split(" ")
  const args = command.inputs.reduce((args, input) => {
    const flag = input.long
      ? `--${input.long}`
      : input.short
      ? `-${input.short}`
      : ""
    const value = options[input.name]
    return value === null || value === false
      ? args
      : value === true
      ? [...args, flag]
      : [...args, flag, String(value)]
  }, cmds.slice(1))
  return {
    bin: cmds[0],
    args: args,
  }
}

export async function run(cmd: ShellCommand): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log(`${chalk.green("✔")} Launching ${chalk.green(cmd.bin)}`)
    const childProcess = spawn(cmd.bin, cmd.args)
    childProcess.stdout.on("data", (data) => {
      console.log(String(data))
    })
    childProcess.stderr.on("data", (data) => {
      console.error(String(data))
    })
    childProcess.on("close", (code) => {
      if (code === 0) {
        console.log(chalk.green("✔ Done"))
        resolve()
      } else {
        reject(`child process exited with code ${code}`)
      }
    })
  })
}
