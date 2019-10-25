import * as tslint from "tslint";
import * as ts from "typescript";
import { SonarRuleMetaData } from "../sonarRule";
export declare class Rule extends tslint.Rules.AbstractRule {
    static metadata: SonarRuleMetaData;
    static DEFAULT_MAXIMUM: number;
    private readonly maximum;
    static message: (actual: number, max: number) => string;
    apply(sourceFile: ts.SourceFile): tslint.RuleFailure[];
}
