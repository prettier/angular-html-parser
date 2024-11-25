import {API, FileInfo} from 'jscodeshift';

export default function transformer(file: FileInfo, api: API) {
  const j = api.jscodeshift;

  const ast = j(file.source);

  ast.find(j.ImportDeclaration).forEach(({node}) => {
    const source = node.source.value as string;
    if (!source.endsWith('.js')) {
      node.source.value = source + '.js';
    }
  });

  ast.find(j.TSTypeAliasDeclaration).forEach(({node}) => {
    if (node.id.name === 'Node' && node.typeAnnotation.type === 'TSUnionType') {
      node.typeAnnotation.types = node.typeAnnotation.types.filter(
        (type) =>
          type.type === 'TSTypeReference' &&
          type.typeName.type === 'Identifier' &&
          type.typeName.name !== 'Expansion' &&
          type.typeName.name !== 'ExpansionCase'
      );
    }
  });

  return ast.toSource();
}
