import * as tslint from "tslint";
import * as ts from "typescript";
import { SonarRuleMetaData } from "../sonarRule";
export declare class Rule extends tslint.Rules.TypedRule {
    static metadata: SonarRuleMetaData;
    static message: (arg1: string, arg2: string) => string;
    applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): tslint.RuleFailure[];
}
