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
class Rule extends tslint.Rules.AbstractRule {
    apply(sourceFile) {
        return new Visitor(this.getOptions().ruleName).visit(sourceFile).getIssues();
    }
}
Rule.metadata = {
    ruleName: "prefer-optional",
    description: "Optional property declarations should use '?' syntax",
    rationale: tslint.Utils.dedent ``,
    optionsDescription: "",
    options: null,
    rspecKey: "RSPEC-4782",
    type: "maintainability",
    typescriptOnly: true,
};
Rule.MESSAGE = "Consider using '?' syntax to declare this property instead of 'undefined' in its type.";
Rule.REDUNDANT_UNDEFINED_MESSAGE = "Consider removing redundant 'undefined' type";
exports.Rule = Rule;
class Visitor extends sonarAnalysis_1.SonarRuleVisitor {
    visitPropertySignature(node) {
        this.checkProperty(node);
        super.visitPropertySignature(node);
    }
    visitPropertyDeclaration(node) {
        this.checkProperty(node);
        super.visitPropertyDeclaration(node);
    }
    checkProperty(node) {
        const type = node.type;
        if (type && nodes_1.isUnionTypeNode(type)) {
            const undefinedTypes = type.types.filter(t => nodes_1.is(t, ts.SyntaxKind.UndefinedKeyword));
            if (undefinedTypes.length > 0) {
                if (node.questionToken) {
                    this.addIssue(undefinedTypes[0], Rule.REDUNDANT_UNDEFINED_MESSAGE);
                }
                else {
                    this.addIssue(node.name, Rule.MESSAGE).addSecondaryLocation(undefinedTypes[0]);
                }
            }
        }
    }
}
//# sourceMappingURL=preferOptionalRule.js.map