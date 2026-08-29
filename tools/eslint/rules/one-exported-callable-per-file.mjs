/**
 * Returns whether a top-level statement declares a function or class.
 *
 * @param {object} statement - Program statement to inspect.
 * @returns {boolean} Whether it is an exported callable declaration.
 */
function isExportedCallable(statement) {
  const declaration =
    statement.type === 'ExportNamedDeclaration'
      ? statement.declaration
      : statement;
  return (
    declaration?.type === 'FunctionDeclaration' ||
    declaration?.type === 'ClassDeclaration'
  );
}

/**
 * Reports every top-level callable after the first declaration in a module.
 *
 * @param {import('eslint').Rule.RuleContext} context - ESLint rule context.
 * @param {object} program - Program node to inspect.
 * @returns {void}
 */
function reportAdditionalCallables(context, program) {
  const callables = program.body.filter(isExportedCallable);
  for (const callable of callables.slice(1)) {
    context.report({ node: callable, messageId: 'oneCallable' });
  }
}

/**
 * Creates listeners for the single exported callable rule.
 *
 * @param {import('eslint').Rule.RuleContext} context - ESLint rule context.
 * @returns {import('eslint').Rule.RuleListener} Rule listeners.
 */
function createRule(context) {
  return { Program: (node) => reportAdditionalCallables(context, node) };
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Allow at most one top-level function or class declaration per module.',
    },
    schema: [],
    messages: {
      oneCallable:
        'Move this function or class to its own named module and focused test.',
    },
  },
  create: createRule,
};
