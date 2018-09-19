import { RootProperty } from "./_common";
/**
 * This function is set by the first allocation of a Zone.
 *
 * Once the function is set the core `print` function calls this closure instead
 * of [printToConsole].
 *
 * This decouples the core library from the async library.
 */
declare function printToConsole(line: string): void;
declare const printToZone: RootProperty<Function>;
export { printToZone, printToConsole };
