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
const ts = require("typescript");
const sonarAnalysis_1 = require("../utils/sonarAnalysis");
const nodes_1 = require("../utils/nodes");
class Rule extends tslint.Rules.AbstractRule {
    apply(sourceFile) {
        return new Visitor(this.getOptions().ruleName).visit(sourceFile).getIssues();
    }
}
Rule.metadata = {
    ruleName: "bool-param-default",
    description: "Optional boolean parameters should have default value",
    rationale: tslint.Utils.dedent ``,
    optionsDescription: "",
    options: null,
    rspecKey: "RSPEC-4798",
    type: "maintainability",
    typescriptOnly: true,
};
Rule.message = (parameter) => `Provide a default value for '${parameter}' so that the logic of the function is more evident when this parameter is missing. \
Consider defining another function if providing default value is not possible.`;
exports.Rule = Rule;
class Visitor extends sonarAnalysis_1.SonarRuleVisitor {
    visitParameterDeclaration(paramDeclaration) {
        if (!paramDeclaration.initializer &&
            isOptionalBoolean(paramDeclaration) &&
            !isInterfaceMethodParameter(paramDeclaration)) {
            this.addIssue(paramDeclaration, Rule.message(paramDeclaration.name.getText()));
        }
        super.visitParameterDeclaration(paramDeclaration);
    }
}
function isOptionalBoolean(paramDeclaration) {
    return usesQuestionOptionalSyntax(paramDeclaration) || usesUnionUndefinedOptionalSyntax(paramDeclaration.type);
}
/**
 * Matches "param?: boolean"
 */
function usesQuestionOptionalSyntax({ questionToken, type }) {
    return questionToken && nodes_1.is(type, ts.SyntaxKind.BooleanKeyword);
}
/**
 * Matches "boolean | undefined"
 */
function usesUnionUndefinedOptionalSyntax(type) {
    if (!type || !nodes_1.isUnionTypeNode(type)) {
        return false;
    }
    const { types } = type;
    return (types.length === 2 &&
        types.some(t => nodes_1.is(t, ts.SyntaxKind.BooleanKeyword)) &&
        types.some(t => nodes_1.is(t, ts.SyntaxKind.UndefinedKeyword)));
}
function isInterfaceMethodParameter(paramDeclaration) {
    return nodes_1.isInterfaceDeclaration(paramDeclaration.parent.parent);
}
//# sourceMappingURL=boolParamDefaultRule.js.map