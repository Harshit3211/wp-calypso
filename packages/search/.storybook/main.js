const path = require( 'path' );

module.exports = {
	stories: [ '../src/*.stories.{js,jsx,ts,tsx}' ],
	addons: [ '@storybook/addon-actions', '@storybook/preset-scss' ],
	typescript: {
		check: false,
		reactDocgen: false,
	},
	webpackFinal: async ( config ) => ( {
		...config,
		resolve: {
			...config.resolve,
			alias: {
				...config.resolve.alias,
				// Storybook resolves emotion incorrectly internally, so we need to correct it.
				// See https://github.com/storybookjs/storybook/issues/13277#issuecomment-751747964.
				'@emotion/styled': path.join( process.cwd(), 'node_modules/@emotion/styled' ),
			},
		},
	} ),
};
