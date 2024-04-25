module.exports = {
	root: true,
	env: {
		node: true,
	},
	extends: [
		'plugin:vue/vue3-essential',
		'eslint:recommended',
		'@vue/typescript/recommended',
	],
	parserOptions: {
		ecmaVersion: 2020,
	},
	rules: {
		'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		indent: [
			'warn',
			'tab',
			{
				SwitchCase: 1,
			},
		],
		'no-tabs': 'off',
		semi: ['warn', 'always'],
		'comma-dangle': ['warn', 'always-multiline'],
		'comma-spacing': ['warn', { before: false, after: true }],
		'template-curly-spacing': ['warn', 'always'],
		'object-curly-spacing': ['warn', 'always'],
		'space-before-function-paren': [
			'warn',
			{
				anonymous: 'never',
				named: 'never',
				asyncArrow: 'always',
			},
		],
		'quote-props': ['warn', 'as-needed'],
		quotes: ['error', 'single'],
		eqeqeq: ['error', 'always'],
		'vue/html-indent': [
			'warn',
			'tab',
			{
				attribute: 1,
				baseIndent: 1,
				closeBracket: 0,
				alignAttributesVertically: true,
				ignores: [],
			},
		],
		'vue/multi-word-component-names': 'off',
		'vue/html-self-closing': 'off',
	},
};
