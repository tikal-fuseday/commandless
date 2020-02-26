import * as prompts from "prompts"
import {CommandApplication} from "../data"
import {PackageManagementDialog} from "./PackageManagement"

export class ExecutionDialog {
  private commandApplication: CommandApplication
  private packageManagementDialog: PackageManagementDialog
  constructor(commandApplication: CommandApplication) {
    this.commandApplication = commandApplication
    this.packageManagementDialog = new PackageManagementDialog(
      commandApplication.command,
    )
  }
  async run(): Promise<void> {
    const isInstalled = await this.commandApplication.command.probe()
    if (!isInstalled) {
      const runner = await this.packageManagementDialog.run()
      if (runner) {
        this.commandApplication = runner
      }
    }
    const {isConfirmed} = await prompts({
      type: "toggle",
      name: "isConfirmed",
      message: `Execute ${this.commandApplication.show()}`,
      initial: false,
      active: "yes",
      inactive: "no",
    })
    if (isConfirmed) {
      await this.commandApplication.execute()
    }
  }
}
