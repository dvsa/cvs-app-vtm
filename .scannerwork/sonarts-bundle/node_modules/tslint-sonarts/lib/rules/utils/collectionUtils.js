"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module containing utility functions used by noEmptyArrayRule and noUnusedArrayRule
 */
const table_1 = require("../../symbols/table");
const ts = require("typescript");
const navigation_1 = require("../../utils/navigation");
const nodes_1 = require("../../utils/nodes");
/**
 * Detectes expression statements like the following:
 *  myArray[1] = 42;
 *  myArray[1] += 42;
 */
function isElementWrite({ expression }, usage) {
    return (nodes_1.isBinaryExpression(expression) &&
        nodes_1.is(expression.operatorToken, ts.SyntaxKind.EqualsToken, ...navigation_1.COMPOUND_ASSIGNMENTS) &&
        nodes_1.isElementAccessExpression(expression.left) &&
        expression.left.expression === usage.node);
}
exports.isElementWrite = isElementWrite;
/**
 * Returns an array of pair symbol-declaration storing collections.
 * Parameters, exported/imported and type related symbols are filtered out.
 */
function getCollectionSymbols(symbols, program) {
    return (symbols
        .getSymbols()
        // get only symbols storing arrays
        .filter(symbol => hasCollectionType(symbol, program.getTypeChecker(), symbols))
        // filter out unused symbols
        .filter(symbol => symbols.allUsages(symbol).length > 1)
        // map to pair symbol-declaration
        .map(symbol => ({ declaration: findDeclarationNode(symbol, symbols), symbol }))
        // filter out symbols without declaration
        .filter(symbolAndDeclaration => symbolAndDeclaration.declaration)
        .map(symbolAndDeclaration => symbolAndDeclaration)
        // filter out parameters, exported/imported, type-related symbols
        .filter(symbolAndDeclaration => !navigation_1.firstAncestor(symbolAndDeclaration.declaration, [
        ts.SyntaxKind.Parameter,
        ts.SyntaxKind.ImportDeclaration,
        ts.SyntaxKind.InterfaceDeclaration,
        ts.SyntaxKind.TypeAliasDeclaration,
        ts.SyntaxKind.ModuleDeclaration,
    ]) && !isExported(symbolAndDeclaration.declaration))
        // keep only symbols initialized to array literal or not initialized at all
        .filter(symbolAndDeclaration => {
        // prettier-ignore
        const varDeclaration = navigation_1.firstAncestor(symbolAndDeclaration.declaration, [ts.SyntaxKind.VariableDeclaration]);
        if (varDeclaration) {
            if (nodes_1.is(varDeclaration.parent.parent, ts.SyntaxKind.ForInStatement, ts.SyntaxKind.ForOfStatement)) {
                return false;
            }
            return !varDeclaration.initializer || isNewCollectionCreation(varDeclaration.initializer);
        }
        return true;
    })
        // filter out array declared as fields
        .filter(symbolAndDeclaration => !nodes_1.is(symbolAndDeclaration.declaration.parent, ts.SyntaxKind.PropertyDeclaration)));
}
exports.getCollectionSymbols = getCollectionSymbols;
function isNewCollectionCreation(node) {
    if (nodes_1.isArrayLiteralExpression(node)) {
        return true;
    }
    if (nodes_1.isCallExpression(node)) {
        return node.expression.getText() === "Array";
    }
    if (nodes_1.isNewExpression(node)) {
        const constructorName = node.expression.getText();
        return isCollectionName(constructorName);
    }
    return false;
}
exports.isNewCollectionCreation = isNewCollectionCreation;
function isExported(declaration) {
    const varStatement = navigation_1.firstAncestor(declaration, [ts.SyntaxKind.VariableStatement]);
    return !!varStatement && nodes_1.is(varStatement.getFirstToken(), ts.SyntaxKind.ExportKeyword);
}
function findDeclarationNode(symbol, symbols) {
    const declarationUsage = symbols.allUsages(symbol).find(usage => usage.is(table_1.UsageFlag.DECLARATION));
    if (!declarationUsage) {
        return null;
    }
    return declarationUsage.node;
}
function hasCollectionType(symbol, typeChecker, symbols) {
    const usage = symbols.allUsages(symbol)[0];
    const type = typeChecker.getTypeAtLocation(usage.node);
    if (type.symbol) {
        const typeName = type.symbol.name;
        return isCollectionName(typeName);
    }
    return false;
}
function isCollectionName(str) {
    const collections = new Set(["Array", "Set", "Map", "WeakSet", "WeakMap"]);
    return collections.has(str);
}
//# sourceMappingURL=collectionUtils.js.map