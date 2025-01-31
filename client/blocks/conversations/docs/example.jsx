import { map, compact } from 'lodash';
import React from 'react';
import { commentsTree } from 'calypso/blocks/conversations/docs/fixtures';
import { ConversationCommentList } from 'calypso/blocks/conversations/list';
import { posts } from 'calypso/blocks/reader-post-card/docs/fixtures';

const noop = () => {};

const ConversationCommentListExample = () => {
	const post = posts[ 0 ];

	return (
		<div className="design-assets__group">
			<ConversationCommentList
				commentsFetchingStatus={ {} }
				commentsTree={ commentsTree }
				blogId={ 123 }
				postId={ 12 }
				commentIds={ [ 1, 2, 3 ] }
				sortedComments={ compact( map( commentsTree, 'data' ) ) }
				post={ post }
				enableCaterpillar={ false }
				shouldRequestComments={ false }
				setActiveReply={ noop }
			/>
		</div>
	);
};

ConversationCommentListExample.displayName = 'ConversationCommentList';

export default ConversationCommentListExample;
