import * as childProcess from "child_process"
import {Input} from "./"

export interface Resolution {
  [resolutionKey: string]: string
}

export interface ICommand {
  bin: string
  resolution: Resolution
  keywords: string[]
  inputs: Input[]
}

export class Command {
  public bin: string
  public resolution: Resolution
  public keywords: string[]
  public inputs: Input[]
  constructor(data: ICommand) {
    this.bin = data.bin
    this.resolution = data.resolution
    this.keywords = data.keywords
    this.inputs = data.inputs
  }
  public hasResolution(resolutionKey: keyof Resolution): boolean {
    return Boolean(this.resolution[resolutionKey])
  }
  public async probe(): Promise<boolean> {
    return new Promise((resolve) => {
      childProcess.exec(`which ${this.bin}`, (error) => {
        resolve(!error)
      })
    })
  }
}
