import IsolatedBlockEditor from '@automattic/isolated-block-editor';
import { addFilter } from '@wordpress/hooks';
import React, { useEffect } from 'react';
import connectUserMentions from 'calypso/blocks/user-mentions/connect';
import getAddAutocompleters from './autocompleters';

import './style.scss';

const allowedBlocks = [
	'core/paragraph',
	'core/heading',
	'core/list',
	'core/code',
	'core/table',
	'core/quote',
	'core/separator',
];

const BlockEditor = ( { onChange, suggestions } ) => {
	useEffect( () => {
		const addAutoCompleters = getAddAutocompleters( suggestions );
		addFilter(
			'editor.Autocomplete.completers',
			'readerComments/autocompleters',
			addAutoCompleters
		);
	}, [ suggestions ] );

	return (
		<IsolatedBlockEditor
			onSaveContent={ ( html ) => onChange( html ) }
			// eslint-disable-next-line no-console
			onError={ console.error }
			settings={ {
				iso: {
					moreMenu: false,
					blocks: {
						allowBlocks: allowedBlocks,
					},
				},
			} }
		/>
	);
};

export default connectUserMentions( BlockEditor );
