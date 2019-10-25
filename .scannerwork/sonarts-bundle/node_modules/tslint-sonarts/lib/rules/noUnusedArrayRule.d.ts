import * as tslint from "tslint";
import * as ts from "typescript";
import { SonarRuleMetaData } from "../sonarRule";
export declare class Rule extends tslint.Rules.TypedRule {
    static metadata: SonarRuleMetaData;
    private static readonly MESSAGE;
    applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): tslint.RuleFailure[];
}
