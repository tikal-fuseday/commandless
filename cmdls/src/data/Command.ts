import {Resolution, Input} from "./"

export interface Command {
  resolution: Resolution
  keywords: string[]
  inputs: Input[]
}
