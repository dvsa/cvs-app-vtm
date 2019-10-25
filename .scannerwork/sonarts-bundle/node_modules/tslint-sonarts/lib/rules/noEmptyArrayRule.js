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
const builder_1 = require("../symbols/builder");
const collectionUtils_1 = require("./utils/collectionUtils");
const navigation_1 = require("../utils/navigation");
const nodes_1 = require("../utils/nodes");
const table_1 = require("../symbols/table");
class Rule extends tslint.Rules.TypedRule {
    applyWithProgram(sourceFile, program) {
        // walker is created to only save issues
        const visitor = new sonarAnalysis_1.SonarRuleVisitor(this.getOptions().ruleName);
        const symbols = builder_1.SymbolTableBuilder.build(sourceFile, program);
        collectionUtils_1.getCollectionSymbols(symbols, program)
            // keep only symbols initialized to empty array literal or not initialized at all
            .filter(isInitializedToEmpty)
            .map(symbolAndDeclaration => symbols.allUsages(symbolAndDeclaration.symbol).filter(usage => !usage.is(table_1.UsageFlag.DECLARATION)))
            // filter out symbols with at least one usage that may make array non-empty
            .filter(usages => usages.every(usage => readCollectionPatterns.some(pattern => pattern(usage))))
            // raise issue
            .forEach(usages => usages.forEach(usage => {
            visitor.addIssue(usage.node, Rule.MESSAGE(usage.symbol.name));
        }));
        return visitor.getIssues();
    }
}
Rule.metadata = {
    ruleName: "no-empty-array",
    description: "Empty collections should not be accessed or iterated",
    rationale: tslint.Utils.dedent ``,
    optionsDescription: "",
    options: null,
    rspecKey: "RSPEC-4158",
    type: "functionality",
    typescriptOnly: false,
};
Rule.MESSAGE = (arrayName) => `Review this usage of '${arrayName}' as it can only be empty here.`;
exports.Rule = Rule;
const readCollectionPatterns = [
    isStrictlyReadingMethodCall,
    isForIterationPattern,
    isElementRead,
];
// Methods that mutate the collection but can't add elements
const nonAdditiveMutatorMethods = [
    // array methods
    "copyWithin",
    "pop",
    "reverse",
    "shift",
    "sort",
    // map, set methods
    "delete",
    "clear",
];
const accessorMethods = [
    // array methods
    "concat",
    "includes",
    "indexOf",
    "join",
    "lastIndexOf",
    "slice",
    "toSource",
    "toString",
    "toLocaleString",
    // map, set methods
    "get",
    "has",
];
const iterationMethods = [
    "entries",
    "every",
    "filter",
    "find",
    "findIndex",
    "forEach",
    "keys",
    "map",
    "reduce",
    "reduceRight",
    "some",
    "values",
];
function isInitializedToEmpty(symbolAndDeclaration) {
    // prettier-ignore
    const varDeclaration = navigation_1.firstAncestor(symbolAndDeclaration.declaration, [ts.SyntaxKind.VariableDeclaration]);
    if (varDeclaration && varDeclaration.initializer) {
        const initializer = varDeclaration.initializer;
        return isEmptyCollection(initializer);
    }
    return true;
}
function isEmptyCollection(node) {
    if (nodes_1.isArrayLiteralExpression(node)) {
        return node.elements.length === 0;
    }
    if (nodes_1.isCallExpression(node)) {
        return node.arguments.length === 0;
    }
    if (nodes_1.isNewExpression(node)) {
        return !node.arguments || node.arguments.length === 0;
    }
    return false;
}
function isStrictlyReadingMethodCall(usage) {
    const strictlyReadingMethods = new Set([...nonAdditiveMutatorMethods, ...accessorMethods, ...iterationMethods]);
    const { parent } = usage.node;
    if (nodes_1.isPropertyAccessExpression(parent) && nodes_1.isCallExpression(parent.parent)) {
        return strictlyReadingMethods.has(parent.name.text);
    }
    return false;
}
function isForIterationPattern(usage) {
    const forInOrOfStatement = navigation_1.firstAncestor(usage.node, [
        ts.SyntaxKind.ForOfStatement,
        ts.SyntaxKind.ForInStatement,
    ]);
    return forInOrOfStatement && forInOrOfStatement.expression === usage.node;
}
// To detect: x = foo(a[1]);
function isElementRead(usage) {
    return nodes_1.isElementAccessExpression(usage.node.parent) && !isElementWrite(usage.node.parent);
}
function isElementWrite(elementAccess) {
    const ancestors = navigation_1.ancestorsChain(elementAccess);
    const assignmentParent = ancestors.find(nodes_1.isAssignment);
    if (assignmentParent) {
        return [elementAccess, ...ancestors].includes(assignmentParent.left);
    }
    return false;
}
//# sourceMappingURL=noEmptyArrayRule.js.map