import * as tslint from "tslint";
import * as ts from "typescript";
import { SonarRuleMetaData } from "../sonarRule";
export declare class Rule extends tslint.Rules.AbstractRule {
    static metadata: SonarRuleMetaData;
    static MESSAGE: string;
    static REDUNDANT_UNDEFINED_MESSAGE: string;
    apply(sourceFile: ts.SourceFile): tslint.RuleFailure[];
}
