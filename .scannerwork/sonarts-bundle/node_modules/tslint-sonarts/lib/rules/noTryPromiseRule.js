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
const visitor_1 = require("../utils/visitor");
const navigation_1 = require("../utils/navigation");
const nodes_1 = require("../utils/nodes");
class Rule extends tslint.Rules.TypedRule {
    applyWithProgram(sourceFile, program) {
        return new Visitor(this.getOptions().ruleName, program).visit(sourceFile).getIssues();
    }
}
Rule.metadata = {
    ruleName: "no-try-promise",
    description: "Promise rejections should not be caught by 'try' block",
    rationale: tslint.Utils.dedent ``,
    optionsDescription: "",
    options: null,
    rspecKey: "RSPEC-4822",
    type: "functionality",
    typescriptOnly: false,
};
exports.Rule = Rule;
class Visitor extends sonarAnalysis_1.TypedSonarRuleVisitor {
    visitTryStatement(node) {
        if (node.catchClause) {
            // without '.catch()'
            const openPromises = [];
            // with '.catch()'
            const capturedPromises = [];
            let hasPotentiallyThrowingCalls = false;
            CallLikeExpressionsVisitor.getCallExpressions(node.tryBlock).forEach(callLikeExpr => {
                if (nodes_1.is(callLikeExpr, ts.SyntaxKind.AwaitExpression) || !this.hasThenMethod(callLikeExpr)) {
                    hasPotentiallyThrowingCalls = true;
                    return;
                }
                if (nodes_1.is(callLikeExpr.parent, ts.SyntaxKind.AwaitExpression) || isThened(callLikeExpr) || isCatch(callLikeExpr)) {
                    return;
                }
                (isCaught(callLikeExpr) ? capturedPromises : openPromises).push(callLikeExpr);
            });
            if (!hasPotentiallyThrowingCalls) {
                this.checkForWrongCatch(node, openPromises);
                this.checkForUselessCatch(node, openPromises, capturedPromises);
            }
        }
        super.visitChildren(node);
    }
    checkForWrongCatch(tryStmt, openPromises) {
        if (openPromises.length > 0) {
            const ending = openPromises.length > 1 ? "s" : "";
            const message = `Consider using 'await' for the promise${ending} inside this 'try' or replace it with 'Promise.prototype.catch(...)' usage${ending}.`;
            const issue = this.addIssue(navigation_1.findChild(tryStmt, ts.SyntaxKind.TryKeyword), message);
            openPromises.forEach(openPromise => issue.addSecondaryLocation(openPromise, "Promise"));
        }
    }
    checkForUselessCatch(tryStmt, openPromises, capturedPromises) {
        if (openPromises.length === 0 && capturedPromises.length > 0) {
            const ending = capturedPromises.length > 1 ? "s" : "";
            const message = `Consider removing this 'try' statement as promise${ending} rejection is already captured by '.catch()' method.`;
            const issue = this.addIssue(navigation_1.findChild(tryStmt, ts.SyntaxKind.TryKeyword), message);
            capturedPromises.forEach(capturedPromise => issue.addSecondaryLocation(capturedPromise, "Caught promise"));
        }
    }
    hasThenMethod(node) {
        const { getTypeAtLocation } = this.program.getTypeChecker();
        const type = getTypeAtLocation(node);
        const thenProperty = type.getProperty("then");
        return Boolean(thenProperty && thenProperty.flags & ts.SymbolFlags.Method);
    }
}
const isThened = (callExpr) => nodes_1.isPropertyAccessExpression(callExpr.parent) && callExpr.parent.name.getText() === "then";
const isCaught = (callExpr) => nodes_1.isPropertyAccessExpression(callExpr.parent) && callExpr.parent.name.getText() === "catch";
const isCatch = (callExpr) => nodes_1.isCallExpression(callExpr) &&
    nodes_1.isPropertyAccessExpression(callExpr.expression) &&
    callExpr.expression.name.getText() === "catch";
class CallLikeExpressionsVisitor extends visitor_1.TreeVisitor {
    constructor() {
        super(...arguments);
        this.callLikeExpressions = [];
    }
    static getCallExpressions(node) {
        const callVisitor = new CallLikeExpressionsVisitor();
        callVisitor.visit(node);
        return callVisitor.callLikeExpressions;
    }
    visitCallExpression(node) {
        this.callLikeExpressions.push(node);
        super.visitCallExpression(node);
    }
    visitNewExpression(node) {
        this.callLikeExpressions.push(node);
        super.visitNewExpression(node);
    }
    visitAwaitExpression(node) {
        this.callLikeExpressions.push(node);
        super.visitAwaitExpression(node);
    }
    visitFunctionLikeDeclaration(_) {
        // do nothing
    }
}
//# sourceMappingURL=noTryPromiseRule.js.map