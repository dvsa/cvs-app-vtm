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
const navigation_1 = require("../utils/navigation");
const nodes_1 = require("../utils/nodes");
class Rule extends tslint.Rules.AbstractRule {
    apply(sourceFile) {
        return new Visitor(this.getOptions().ruleName).visit(sourceFile).getIssues();
    }
}
Rule.metadata = {
    ruleName: "prefer-type-guard",
    description: "Type guards should be used",
    rationale: tslint.Utils.dedent ``,
    optionsDescription: "",
    options: null,
    rspecKey: "RSPEC-4322",
    type: "maintainability",
    typescriptOnly: true,
};
Rule.MESSAGE = (parameterName, typeName) => `Declare this function return type using type predicate "${parameterName} is ${typeName}".`;
exports.Rule = Rule;
class Visitor extends sonarAnalysis_1.SonarRuleVisitor {
    visitFunctionLikeDeclaration(node) {
        if (!nodes_1.is(node, ts.SyntaxKind.Constructor, ts.SyntaxKind.GetAccessor, ts.SyntaxKind.SetAccessor, ts.SyntaxKind.ArrowFunction, ts.SyntaxKind.FunctionExpression)) {
            this.checkFunctionLikeDeclaration(node);
        }
        super.visitFunctionLikeDeclaration(node);
    }
    checkFunctionLikeDeclaration(node) {
        if (node.type && nodes_1.is(node.type, ts.SyntaxKind.TypePredicate)) {
            return;
        }
        const { body } = node;
        const returnedExpression = this.returnedExpression(body);
        if (!returnedExpression) {
            return;
        }
        if (this.isInequalityBinaryExpression(returnedExpression)) {
            const { left, right } = returnedExpression;
            if (this.isUndefined(right)) {
                this.checkCastedType(node, left);
            }
        }
        else if (this.isNegation(returnedExpression) && this.isNegation(returnedExpression.operand)) {
            this.checkCastedType(node, returnedExpression.operand.operand);
        }
        else if (this.isBooleanCall(returnedExpression)) {
            this.checkCastedType(node, returnedExpression.arguments[0]);
        }
    }
    checkCastedType(node, expression) {
        const castedType = this.getCastedTypeFromPropertyAccess(expression);
        const nOfParam = node.parameters.length;
        if (!castedType || castedType.type.kind === ts.SyntaxKind.AnyKeyword) {
            return;
        }
        const { expression: castedExpression, type } = castedType;
        if (nOfParam === 1 || (nOfParam === 0 && nodes_1.is(castedExpression, ts.SyntaxKind.ThisKeyword))) {
            this.addIssue(navigation_1.functionLikeMainToken(node), Rule.MESSAGE(castedExpression.getText(), type.getText()));
        }
    }
    isInequalityBinaryExpression(returnExpression) {
        return (nodes_1.isBinaryExpression(returnExpression) &&
            nodes_1.is(returnExpression.operatorToken, ts.SyntaxKind.ExclamationEqualsEqualsToken, ts.SyntaxKind.ExclamationEqualsToken));
    }
    isNegation(node) {
        return nodes_1.isPrefixUnaryExpression(node) && node.operator === ts.SyntaxKind.ExclamationToken;
    }
    isBooleanCall(node) {
        return nodes_1.isCallExpression(node) && node.expression.getText() === "Boolean" && node.arguments.length === 1;
    }
    getCastedTypeFromPropertyAccess(node) {
        node = navigation_1.drillDownThroughParenthesis(node);
        if (nodes_1.isPropertyAccessExpression(node)) {
            const expression = navigation_1.drillDownThroughParenthesis(node.expression);
            if (nodes_1.is(expression, ts.SyntaxKind.AsExpression, ts.SyntaxKind.TypeAssertionExpression)) {
                return expression;
            }
        }
        return undefined;
    }
    isUndefined(node) {
        return nodes_1.isIdentifier(node) && node.text === "undefined";
    }
    returnedExpression(body) {
        if (!body) {
            return undefined;
        }
        if (nodes_1.isBlock(body)) {
            return body.statements.length === 1 && nodes_1.isReturnStatement(body.statements[0])
                ? body.statements[0].expression
                : undefined;
        }
        return body;
    }
}
//# sourceMappingURL=preferTypeGuardRule.js.map