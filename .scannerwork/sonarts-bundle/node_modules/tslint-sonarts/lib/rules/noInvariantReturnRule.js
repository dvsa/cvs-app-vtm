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
const nodes_1 = require("../utils/nodes");
const navigation_1 = require("../utils/navigation");
const areEquivalent_1 = require("../utils/areEquivalent");
const cfg_1 = require("../cfg/cfg");
const sonarAnalysis_1 = require("../utils/sonarAnalysis");
class Rule extends tslint.Rules.AbstractRule {
    apply(sourceFile) {
        return new Visitor(this.getOptions().ruleName).visit(sourceFile).getIssues();
    }
}
Rule.metadata = {
    ruleName: "no-invariant-return",
    description: "Function returns should not be invariant",
    rationale: tslint.Utils.dedent ``,
    optionsDescription: "",
    options: null,
    rspecKey: "RSPEC-3516",
    type: "functionality",
    typescriptOnly: false,
};
Rule.MESSAGE = "Refactor this method to not always return the same value.";
exports.Rule = Rule;
class Visitor extends sonarAnalysis_1.SonarRuleVisitor {
    visitFunctionLikeDeclaration(node) {
        if (node.body && nodes_1.isBlock(node.body)) {
            const cfg = cfg_1.ControlFlowGraph.fromStatements(Array.from(node.body.statements));
            if (cfg) {
                const returnedExpressions = cfg.getEndPredecessors().map(this.getExplicitReturnExpression);
                if (this.noImplicitReturn(returnedExpressions) &&
                    returnedExpressions.length > 1 &&
                    this.allSameLiteral(returnedExpressions)) {
                    const issue = this.addIssue(navigation_1.functionLikeMainToken(node), Rule.MESSAGE).setCost(returnedExpressions.length);
                    returnedExpressions.forEach(returnedExpression => {
                        issue.addSecondaryLocation(returnedExpression);
                    });
                }
            }
        }
        super.visitFunctionLikeDeclaration(node);
    }
    noImplicitReturn(returnedExpressions) {
        return returnedExpressions.every(expr => !!expr);
    }
    allSameLiteral(returnedExpressions) {
        const first = returnedExpressions[0];
        if (nodes_1.isLiteralExpression(first) || nodes_1.is(first, ts.SyntaxKind.TrueKeyword, ts.SyntaxKind.FalseKeyword)) {
            return returnedExpressions.every(expression => areEquivalent_1.default(first, expression));
        }
        return false;
    }
    getExplicitReturnExpression(cfgBlock) {
        const elements = cfgBlock.getElements();
        const lastElement = elements[elements.length - 1];
        if (!lastElement) {
            return undefined;
        }
        if (lastElement && lastElement.kind === ts.SyntaxKind.ReturnStatement) {
            return lastElement.expression;
        }
    }
}
//# sourceMappingURL=noInvariantReturnRule.js.map