/**
 * Module containing utility functions used by noEmptyArrayRule and noUnusedArrayRule
 */
import { SymbolTable, Usage } from "../../symbols/table";
import * as ts from "typescript";
export declare type SymbolAndDeclaration = {
    declaration: ts.Node;
    symbol: ts.Symbol;
};
/**
 * Detectes expression statements like the following:
 *  myArray[1] = 42;
 *  myArray[1] += 42;
 */
export declare function isElementWrite({ expression }: ts.ExpressionStatement, usage: Usage): boolean;
/**
 * Returns an array of pair symbol-declaration storing collections.
 * Parameters, exported/imported and type related symbols are filtered out.
 */
export declare function getCollectionSymbols(symbols: SymbolTable, program: ts.Program): {
    declaration: ts.Node;
    symbol: ts.Symbol;
}[];
export declare function isNewCollectionCreation(node: ts.Node): boolean;
