import * as ts from "typescript";
import { CfgBlock, ControlFlowGraph } from "../cfg/cfg";
import { SymbolTable, Usage } from "./table";
export declare class LiveVariableAnalyzer {
    private readonly symbols;
    private blockAvailableReads;
    private deadUsages;
    private usedInNestedFunctionOrClass;
    private root;
    private static readonly FUNCTION_OR_SOURCE_FILE;
    constructor(symbols: SymbolTable);
    analyzeFunction(root: ts.FunctionLikeDeclaration): LVAReturn | undefined;
    analyze(root: ts.Node, cfg: ControlFlowGraph): LVAReturn | undefined;
    private computeSymbolsWithAvailableReads;
    private trackUsage;
    private isUsedInNestedFunctionOrClass;
    private successorSymbolsWithAvailableReads;
    private same;
}
export declare type LVAReturn = {
    cfg: ControlFlowGraph;
    blockAvailableReads: Map<CfgBlock, Set<ts.Symbol>>;
    deadUsages: Set<Usage>;
};
