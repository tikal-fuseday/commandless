import * as chalk from "chalk"
import * as prompts from "prompts"
import {ShellCommand} from "../data"

export async function ConfirmationDialog(cmd: ShellCommand): Promise<boolean> {
  const stringCmd = chalk.yellow(`${cmd.bin} ${cmd.args.join(" ")}`)
  const response = await prompts({
    type: "toggle",
    name: "isConfirmed",
    message: `Would you like to run ${stringCmd}`,
    initial: false,
    active: "yes",
    inactive: "no",
  })
  return response.isConfirmed
}
