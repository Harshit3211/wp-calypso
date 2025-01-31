import { localize } from 'i18n-calypso';
import React from 'react';
import { connect } from 'react-redux';
import welcomeImage from 'calypso/assets/images/reader/reader-welcome-illustration.svg';
import EmptyContent from 'calypso/components/empty-content';
import { withPerformanceTrackerStop } from 'calypso/lib/performance-tracking';
import { recordAction, recordGaEvent } from 'calypso/reader/stats';
import { recordReaderTracksEvent } from 'calypso/state/reader/analytics/actions';

class FollowingEmptyContent extends React.Component {
	shouldComponentUpdate() {
		return false;
	}

	recordAction = () => {
		recordAction( 'clicked_search_on_empty' );
		recordGaEvent( 'Clicked Search on EmptyContent' );
		this.props.recordReaderTracksEvent( 'calypso_reader_search_on_empty_stream_clicked' );
	};

	render() {
		/* eslint-disable wpcalypso/jsx-classname-namespace */
		const action = (
			<a
				className="empty-content__action button is-primary"
				onClick={ this.recordAction }
				href="/read/search"
			>
				{ this.props.translate( 'Find sites to follow' ) }
			</a>
		);
		const secondaryAction = null;

		return (
			<EmptyContent
				className="stream__empty"
				title={ this.props.translate( 'Welcome to Reader' ) }
				line={ this.props.translate( 'Recent posts from sites you follow will appear here.' ) }
				action={ action }
				secondaryAction={ secondaryAction }
				illustration={ welcomeImage }
				illustrationWidth={ 350 }
			/>
		);
		/* eslint-enable wpcalypso/jsx-classname-namespace */
	}
}

export default connect( null, {
	recordReaderTracksEvent,
} )( withPerformanceTrackerStop( localize( FollowingEmptyContent ) ) );
