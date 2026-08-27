import { StartParameters } from '../models/start-parameters.model.js';
export declare class ConsoleService {
  getParameters(rawArgv: string[]): StartParameters;
  splitWordsByWidth(text: string, width: number): string[];
  splitData(data: string, separator?: string): string[];
  replaceString(
    text: string,
    textToReplace: string | RegExp,
    replaceValue: string,
  ): string;
  shortenText(text: string, width: number, startCut?: number): string;
  isRunningBuild(): boolean;
  startListenKeyEvents(): void;
  /** Argvs can be specified for example by
   *  "--sort size" and "--sort=size". The main function
   *  expect the parameters as the first form so this
   *  method convert the second to first.
   */
  private normalizeParams;
  private isValidShortenParams;
  private removeSystemArgvs;
  private isArgOption;
  private isArgHavingParams;
  private isValidOption;
  private getOption;
  private isNegative;
}
