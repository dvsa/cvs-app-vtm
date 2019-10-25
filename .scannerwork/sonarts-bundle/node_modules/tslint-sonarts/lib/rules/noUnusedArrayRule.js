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
const builder_1 = require("../symbols/builder");
const sonarAnalysis_1 = require("../utils/sonarAnalysis");
const collectionUtils_1 = require("./utils/collectionUtils");
const table_1 = require("../symbols/table");
const navigation_1 = require("../utils/navigation");
const nodes_1 = require("../utils/nodes");
class Rule extends tslint.Rules.TypedRule {
    applyWithProgram(sourceFile, program) {
        const symbols = builder_1.SymbolTableBuilder.build(sourceFile, program);
        // walker is created to only save issues
        const visitor = new sonarAnalysis_1.SonarRuleVisitor(this.getOptions().ruleName);
        collectionUtils_1.getCollectionSymbols(symbols, program)
            // filter out symbols with at least one read usage
            .filter(symbolAndDeclaration => !symbols.allUsages(symbolAndDeclaration.symbol).some(usage => isReadUsage(usage)))
            // raise issue
            .forEach(symbolAndDeclaration => visitor.addIssue(symbolAndDeclaration.declaration, Rule.MESSAGE));
        return visitor.getIssues();
    }
}
Rule.metadata = {
    ruleName: "no-unused-array",
    description: "Array contents should be used",
    optionsDescription: "",
    options: null,
    rspecKey: "RSPEC-4030",
    type: "maintainability",
    typescriptOnly: false,
};
Rule.MESSAGE = "Either use this collection's contents or remove the collection.";
exports.Rule = Rule;
const writeArrayPatterns = [
    collectionUtils_1.isElementWrite,
    isVariableWrite,
    isWritingMethodCall,
];
const writingMethods = new Set([
    "copyWithin",
    "fill",
    "pop",
    "push",
    "reverse",
    "shift",
    "sort",
    "splice",
    "unshift",
    "clear",
    "delete",
    "set",
    "add",
]);
function isReadUsage(usage) {
    if (usage.is(table_1.UsageFlag.DECLARATION)) {
        return false;
    }
    // prettier-ignore
    const expressionStatement = navigation_1.firstAncestor(usage.node, [ts.SyntaxKind.ExpressionStatement]);
    if (expressionStatement) {
        return !writeArrayPatterns.some(pattern => pattern(expressionStatement, usage));
    }
    return true;
}
/**
 * Detectes expression statements like the following:
 *  myArray = [1, 2];
 */
function isVariableWrite({ expression }, usage) {
    return (nodes_1.isBinaryExpression(expression) &&
        nodes_1.is(expression.operatorToken, ts.SyntaxKind.EqualsToken) &&
        expression.left === usage.node &&
        collectionUtils_1.isNewCollectionCreation(expression.right));
}
/**
 * Detectes expression statements like the following:
 * myArray.push(1);
 */
function isWritingMethodCall(statement, usage) {
    if (nodes_1.isCallExpression(statement.expression)) {
        const callExpression = statement.expression;
        if (nodes_1.isPropertyAccessExpression(callExpression.expression)) {
            const propertyAccess = callExpression.expression;
            return propertyAccess.expression === usage.node && writingMethods.has(propertyAccess.name.text);
        }
    }
    return false;
}
//# sourceMappingURL=noUnusedArrayRule.js.map