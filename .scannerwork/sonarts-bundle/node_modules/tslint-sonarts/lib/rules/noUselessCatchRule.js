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
const areEquivalent_1 = require("../utils/areEquivalent");
const navigation_1 = require("../utils/navigation");
class Rule extends tslint.Rules.AbstractRule {
    apply(sourceFile) {
        return new Visitor(this.getOptions().ruleName).visit(sourceFile).getIssues();
    }
}
Rule.metadata = {
    ruleName: "no-useless-catch",
    description: `"catch" clauses should do more than rethrow`,
    rationale: tslint.Utils.dedent ``,
    optionsDescription: "",
    options: null,
    rspecKey: "RSPEC-2737",
    type: "maintainability",
    typescriptOnly: false,
};
Rule.MESSAGE = "Add logic to this catch clause or eliminate it and rethrow the exception automatically.";
exports.Rule = Rule;
class Visitor extends sonarAnalysis_1.SonarRuleVisitor {
    visitCatchClause(catchClause) {
        const statements = catchClause.block.statements;
        if (statements.length === 1 && onlyRethrows(statements[0], catchClause.variableDeclaration)) {
            this.addIssue(navigation_1.findChild(catchClause, ts.SyntaxKind.CatchKeyword), Rule.MESSAGE);
        }
        super.visitCatchClause(catchClause);
    }
}
function onlyRethrows(statement, variableDeclaration) {
    return (variableDeclaration &&
        nodes_1.isThrowStatement(statement) &&
        statement.expression &&
        areEquivalent_1.default(variableDeclaration.name, statement.expression));
}
//# sourceMappingURL=noUselessCatchRule.js.map