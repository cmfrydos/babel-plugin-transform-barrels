const fs = require("fs");
const parser = require("@babel/parser");
const t = require("@babel/types");

class AST {
    static filenameToAST = (filename) => {
      try {
        const content = fs.readFileSync(filename, "utf-8");
        return parser.parse(content, { sourceType: "module", plugins:["jsx", "typescript"] });
      } catch (error) {
        return null;
      }
    };
    
    static isAnySpecifierExist(specifiers) {
      return specifiers.length !== 0;
    }

    static getSpecifierType(specifier) {
      if (t.isExportSpecifier(specifier) || t.isExportDefaultSpecifier(specifier) || t.isExportNamespaceSpecifier(specifier)) {
        if (specifier?.local?.name === "default")
        {
          return "default";
        } else if (specifier?.local) {
          return "named";
        } else {
          return "namespace"
        }  
      }
      if (t.isImportSpecifier(specifier) || t.isImportDefaultSpecifier(specifier) || t.isImportNamespaceSpecifier(specifier)) {
        if (t.isImportDefaultSpecifier(specifier))
        {
          return "default";
        } else if (t.isImportSpecifier(specifier)) {
          return "named";
        } else {
          return "namespace"
        }  
      }
    }
    
    static createASTImportDeclaration = ({localName, importedName, path, type, originalNode}) => {
      let astImportSpecifier;
      switch (type) {
        case "named":
          astImportSpecifier = t.importSpecifier(t.identifier(localName),t.identifier(importedName))
          break;
        case "namespace":
          astImportSpecifier = t.importNamespaceSpecifier(t.identifier(localName))
          break;
        default:
          astImportSpecifier = t.importDefaultSpecifier(t.identifier(localName))
      }
    
      const newImportDeclaration = t.importDeclaration([astImportSpecifier], t.stringLiteral(path));
    
      // Clone original node and apply its location to the new import declaration for source mapping
      if (originalNode) {
        const clonedNode = t.cloneNode(originalNode, false, false);
        newImportDeclaration.loc = clonedNode.loc;
        newImportDeclaration.start = clonedNode.start;
        newImportDeclaration.end = clonedNode.end;
        newImportDeclaration.leadingComments = clonedNode.leadingComments;
        newImportDeclaration.trailingComments = clonedNode.trailingComments;
      }
    
      return newImportDeclaration;
    }
  }

module.exports = AST;