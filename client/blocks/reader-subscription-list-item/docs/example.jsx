import { Card } from '@automattic/components';
import { map } from 'lodash';
import React, { PureComponent } from 'react';
import ConnectedReaderSubscriptionListItem from 'calypso/blocks/reader-subscription-list-item/connected';
import ReaderSubscriptionListItemPlaceholder from 'calypso/blocks/reader-subscription-list-item/placeholder';

const sites = {
	longreads: { siteId: 70135762 },
	wordpress: { feedId: 25823 },
	bestBlogInTheWorldAAA: { siteId: 77147075 },
	mathWithBadDrawings: { feedId: 10056049 },
	uproxx: { feedId: 19850964 },
	atlantic: { feedId: 49548095 },
	fourthGenerationFarmGirl: { feedId: 24393283 },
};

export default class ReaderSubscriptionListItemExample extends PureComponent {
	static displayName = 'ReaderSubscriptionListItem';

	render() {
		return (
			<Card>
				{ map( sites, ( site ) => (
					<ConnectedReaderSubscriptionListItem key={ site.feedId || site.siteId } { ...site } />
				) ) }
				<ReaderSubscriptionListItemPlaceholder />
			</Card>
		);
	}
}
