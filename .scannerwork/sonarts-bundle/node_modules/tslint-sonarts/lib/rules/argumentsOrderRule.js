"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * SonarTS
 * Copyright (C) 2017-2019 SonarSource SA
 * mailto:info AT sonarsource DOT com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */
const tslint = require("tslint");
const sonarAnalysis_1 = require("../utils/sonarAnalysis");
const nodes_1 = require("../utils/nodes");
class Rule extends tslint.Rules.TypedRule {
    applyWithProgram(sourceFile, program) {
        return new Visitor(this.getOptions().ruleName, program).visit(sourceFile).getIssues();
    }
}
Rule.metadata = {
    ruleName: "arguments-order",
    description: "Parameters should be passed in the correct order",
    rationale: tslint.Utils.dedent ``,
    optionsDescription: "",
    options: null,
    rspecKey: "RSPEC-2234",
    type: "functionality",
    typescriptOnly: false,
};
Rule.message = (arg1, arg2) => `Parameters '${arg1}' and '${arg2}' have the same names but not the same order as the arguments.`;
exports.Rule = Rule;
class Visitor extends sonarAnalysis_1.TypedSonarRuleVisitor {
    visitCallExpression(node) {
        const argumentNames = node.arguments.map(arg => (nodes_1.isIdentifier(arg) ? arg.getText() : undefined));
        const { parameterNames, declaration } = this.getSignature(node);
        if (parameterNames) {
            let swappedArguments = null;
            for (let argumentIndex = 0; argumentIndex < argumentNames.length; argumentIndex++) {
                const argumentName = argumentNames[argumentIndex];
                if (argumentName) {
                    const swappedPairArgument = this.getSwappedPairArgument(argumentName, argumentIndex, argumentNames, parameterNames, node);
                    if (swappedPairArgument) {
                        swappedArguments = { arg1: argumentName, arg2: swappedPairArgument };
                        break;
                    }
                }
            }
            if (swappedArguments) {
                this.raiseIssue(node, swappedArguments, declaration);
            }
        }
        super.visitCallExpression(node);
    }
    getSwappedPairArgument(argumentName, argumentIndex, argumentNames, parameterNames, node) {
        const parameterIndex = parameterNames.findIndex(param => param.name === argumentName);
        if (parameterIndex > -1 && parameterIndex !== argumentIndex) {
            const anotherArgument = argumentNames[parameterIndex];
            if (parameterNames[argumentIndex].name === anotherArgument) {
                const firstArgumentType = this.getTypeAsString(node.arguments[argumentIndex]);
                const secondArgumentType = this.getTypeAsString(node.arguments[parameterIndex]);
                if (firstArgumentType === secondArgumentType) {
                    return anotherArgument;
                }
            }
        }
        return undefined;
    }
    getTypeAsString(expr) {
        const { typeToString, getBaseTypeOfLiteralType, getTypeAtLocation } = this.program.getTypeChecker();
        return typeToString(getBaseTypeOfLiteralType(getTypeAtLocation(expr)));
    }
    raiseIssue(node, swappedArguments, declaration) {
        const issue = this.addIssueAtLocation(new sonarAnalysis_1.IssueLocation(node.arguments.pos, node.arguments.end, node.getSourceFile(), Rule.message(swappedArguments.arg1, swappedArguments.arg2)));
        if (declaration &&
            declaration.parameters.pos &&
            declaration.getSourceFile() === node.getSourceFile()) {
            const textRange = declaration.parameters;
            issue.addSecondaryLocation(new sonarAnalysis_1.IssueLocation(textRange.pos, textRange.end, node.getSourceFile(), "Formal parameters"));
        }
    }
    getSignature(node) {
        const parameterNames = [];
        const calleeType = this.program.getTypeChecker().getTypeAtLocation(node.expression);
        const callSignatures = calleeType.getCallSignatures();
        if (callSignatures.length === 1) {
            const callSignature = callSignatures[0];
            callSignature.parameters.forEach(parameterSymbol => {
                parameterNames.push(parameterSymbol);
            });
            return { parameterNames, declaration: callSignature.declaration };
        }
        return { parameterNames: undefined, declaration: undefined };
    }
}
//# sourceMappingURL=argumentsOrderRule.js.map