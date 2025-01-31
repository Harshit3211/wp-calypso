import classnames from 'classnames';
import { localize } from 'i18n-calypso';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { recordAction, recordGaEvent } from 'calypso/reader/stats';
import { recordReaderTracksEvent } from 'calypso/state/reader/analytics/actions';
import { fillGap } from 'calypso/state/reader/streams/actions';
import './style.scss';

class Gap extends React.Component {
	static propTypes = {
		gap: PropTypes.object.isRequired,
		streamKey: PropTypes.string.isRequired,
		selected: PropTypes.bool,
	};

	state = { isFilling: false };

	handleClick = () => {
		const { streamKey, gap } = this.props;
		this.props.fillGap( { streamKey, gap } );
		recordAction( 'fill_gap' );
		recordGaEvent( 'Clicked Fill Gap' );
		this.props.recordReaderTracksEvent( 'calypso_reader_filled_gap', { stream: streamKey } );

		this.setState( { isFilling: true } );
	};

	render() {
		const classes = classnames( {
			'reader-list-gap': true,
			'is-filling': this.state.isFilling,
			'is-selected': this.props.selected,
		} );
		const { translate } = this.props;

		/* eslint-disable wpcalypso/jsx-classname-namespace */
		return (
			<div className={ classes }>
				<button
					type="button"
					className="button reader-list-gap__button"
					onClick={ this.handleClick }
				>
					{ translate( 'Load More Posts' ) }
				</button>
			</div>
		);
		/* eslint-enable wpcalypso/jsx-classname-namespace */
	}
}

export default localize( connect( null, { fillGap, recordReaderTracksEvent } )( Gap ) );
