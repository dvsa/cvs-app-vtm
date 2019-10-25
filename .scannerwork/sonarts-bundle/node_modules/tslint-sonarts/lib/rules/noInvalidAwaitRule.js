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
const semantics_1 = require("../utils/semantics");
class Rule extends tslint.Rules.TypedRule {
    applyWithProgram(sourceFile, program) {
        return new Visitor(this.getOptions().ruleName, program).visit(sourceFile).getIssues();
    }
}
Rule.metadata = {
    ruleName: "no-invalid-await",
    description: '"await" should only be used with promises',
    rationale: tslint.Utils.dedent ``,
    optionsDescription: "",
    options: null,
    rspecKey: "RSPEC-4123",
    type: "functionality",
    typescriptOnly: false,
};
Rule.MESSAGE = "Refactor this redundant 'await' on a non-promise.";
exports.Rule = Rule;
class Visitor extends sonarAnalysis_1.TypedSonarRuleVisitor {
    visitAwaitExpression(node) {
        const awaitedType = this.program.getTypeChecker().getTypeAtLocation(node.expression);
        if (!hasThenMethod(awaitedType) && !semantics_1.isAny(awaitedType) && !semantics_1.isUnion(awaitedType)) {
            this.addIssue(node, Rule.MESSAGE);
        }
        super.visitAwaitExpression(node);
    }
}
function hasThenMethod(type) {
    const thenProperty = type.getProperty("then");
    return Boolean(thenProperty && thenProperty.flags & ts.SymbolFlags.Method);
}
//# sourceMappingURL=noInvalidAwaitRule.js.map