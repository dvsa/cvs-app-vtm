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
    ruleName: "no-collapsible-if",
    description: 'Collapsible "if" statements should be merged',
    rationale: tslint.Utils.dedent ``,
    optionsDescription: "",
    options: null,
    rspecKey: "RSPEC-1066",
    type: "maintainability",
    typescriptOnly: false,
};
Rule.MESSAGE = "Merge this if statement with the enclosing one.";
Rule.SECONDARY_MESSAGE = 'Enclosing "if" statement';
exports.Rule = Rule;
class Visitor extends sonarAnalysis_1.SonarRuleVisitor {
    visitIfStatement(node) {
        let then = node.thenStatement;
        if (nodes_1.isBlock(then) && then.statements.length === 1) {
            then = then.statements[0];
        }
        if (this.isIfStatementWithoutElse(node) && this.isIfStatementWithoutElse(then)) {
            this.addIssue(this.ifKeyword(then), Rule.MESSAGE).addSecondaryLocation(this.ifKeyword(node), Rule.SECONDARY_MESSAGE);
        }
        super.visitIfStatement(node);
    }
    isIfStatementWithoutElse(node) {
        return nodes_1.isIfStatement(node) && node.elseStatement == null;
    }
    ifKeyword(node) {
        return navigation_1.findChild(node, ts.SyntaxKind.IfKeyword);
    }
}
//# sourceMappingURL=noCollapsibleIfRule.js.map