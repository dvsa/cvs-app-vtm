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
class Rule extends tslint.Rules.TypedRule {
    applyWithProgram(sourceFile, program) {
        return new Visitor(this.getOptions().ruleName, program).visit(sourceFile).getIssues();
    }
}
Rule.metadata = {
    ruleName: "no-alphabetical-sort",
    description: 'A compare function should be provided when using "Array.prototype.sort()"',
    rationale: tslint.Utils.dedent ``,
    optionsDescription: "",
    options: null,
    rspecKey: "RSPEC-2871",
    type: "functionality",
    typescriptOnly: false,
};
Rule.MESSAGE = "Provide a compare function to avoid sorting elements alphabetically.";
exports.Rule = Rule;
class Visitor extends sonarAnalysis_1.TypedSonarRuleVisitor {
    visitCallExpression(callExpression) {
        if (callExpression.arguments.length === 0 && nodes_1.isPropertyAccessExpression(callExpression.expression)) {
            const { name, expression } = callExpression.expression;
            if (name.getText() === "sort") {
                const arrayElementType = this.arrayElementType(expression);
                if (arrayElementType && nodes_1.is(arrayElementType, ts.SyntaxKind.NumberKeyword)) {
                    this.addIssue(name, Rule.MESSAGE);
                }
            }
        }
        super.visitCallExpression(callExpression);
    }
    arrayElementType(expression) {
        const { typeToTypeNode, getTypeAtLocation } = this.program.getTypeChecker();
        const typeNode = typeToTypeNode(getTypeAtLocation(expression));
        if (typeNode && nodes_1.is(typeNode, ts.SyntaxKind.ArrayType)) {
            return typeNode.elementType;
        }
        return undefined;
    }
}
//# sourceMappingURL=noAlphabeticalSortRule.js.map