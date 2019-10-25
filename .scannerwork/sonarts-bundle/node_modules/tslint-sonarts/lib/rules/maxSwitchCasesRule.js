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
const navigation_1 = require("../utils/navigation");
class Rule extends tslint.Rules.AbstractRule {
    get maximum() {
        if (this.ruleArguments[0] !== undefined) {
            return this.ruleArguments[0];
        }
        return Rule.DEFAULT_MAXIMUM;
    }
    apply(sourceFile) {
        return new Visitor(this.getOptions().ruleName, this.maximum).visit(sourceFile).getIssues();
    }
}
Rule.metadata = {
    ruleName: "max-switch-cases",
    description: `"switch" statements should not have too many "case" clauses`,
    rationale: tslint.Utils.dedent ``,
    optionsDescription: "",
    options: { type: "number" },
    optionExamples: [true, [true, 15]],
    rspecKey: "RSPEC-1479",
    type: "maintainability",
    typescriptOnly: false,
};
Rule.DEFAULT_MAXIMUM = 30;
Rule.message = (actual, max) => `Reduce the number of non-empty switch cases from ${actual} to at most ${max}.`;
exports.Rule = Rule;
class Visitor extends sonarAnalysis_1.SonarRuleVisitor {
    constructor(ruleName, maximum) {
        super(ruleName);
        this.maximum = maximum;
    }
    visitSwitchStatement(node) {
        const nonEmptyCases = node.caseBlock.clauses.filter(switchCase => switchCase.statements.length > 0 && !nodes_1.is(switchCase, ts.SyntaxKind.DefaultClause));
        if (nonEmptyCases.length > this.maximum) {
            this.addIssue(navigation_1.findChild(node, ts.SyntaxKind.SwitchKeyword), Rule.message(nonEmptyCases.length, this.maximum));
        }
        super.visitSwitchStatement(node);
    }
}
//# sourceMappingURL=maxSwitchCasesRule.js.map