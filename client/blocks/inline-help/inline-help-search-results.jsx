import { speak } from '@wordpress/a11y';
import { localize } from 'i18n-calypso';
import { debounce, isEmpty } from 'lodash';
import page from 'page';
import PropTypes from 'prop-types';
import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import QueryInlineHelpSearch from 'calypso/components/data/query-inline-help-search';
import QueryUserPurchases from 'calypso/components/data/query-user-purchases';
import Gridicon from 'calypso/components/gridicon';
import { decodeEntities, preventWidows } from 'calypso/lib/formatting';
import { localizeUrl } from 'calypso/lib/i18n-utils';
import { recordTracksEvent } from 'calypso/state/analytics/actions';
import { getCurrentUserId } from 'calypso/state/current-user/selectors';
import getSearchResultsByQuery from 'calypso/state/inline-help/selectors/get-inline-help-search-results-for-query';
import isRequestingInlineHelpSearchResultsForQuery from 'calypso/state/inline-help/selectors/is-requesting-inline-help-search-results-for-query';
import hasCancelableUserPurchases from 'calypso/state/selectors/has-cancelable-user-purchases';
import hasInlineHelpAPIResults from 'calypso/state/selectors/has-inline-help-api-results';
import { getSectionName } from 'calypso/state/ui/selectors';
import {
	SUPPORT_TYPE_ADMIN_SECTION,
	SUPPORT_TYPE_API_HELP,
	SUPPORT_TYPE_CONTEXTUAL_HELP,
} from './constants';
import PlaceholderLines from './placeholder-lines';

const noop = () => {};

function debounceSpeak( { message = '', priority = 'polite', timeout = 800 } ) {
	return debounce( () => {
		speak( message, priority );
	}, timeout );
}

const loadingSpeak = debounceSpeak( { message: 'Loading search results.', timeout: 1500 } );

const resultsSpeak = debounceSpeak( { message: 'Search results loaded.' } );

const errorSpeak = debounceSpeak( { message: 'No search results found.' } );

function HelpSearchResults( {
	currentUserId,
	externalLinks = false,
	hasAPIResults = false,
	hasPurchases,
	isSearching = false,
	onSelect,
	onAdminSectionSelect = noop,
	searchQuery = '',
	searchResults = [],
	sectionName,
	translate,
	placeholderLines,
	track,
} ) {
	useEffect( () => {
		// Cancel all queued speak messages.
		loadingSpeak.cancel();
		resultsSpeak.cancel();
		errorSpeak.cancel();

		// If there's no query, then we don't need to announce anything.
		if ( isEmpty( searchQuery ) ) {
			return;
		}

		if ( isSearching ) {
			loadingSpeak();
		} else if ( ! hasAPIResults ) {
			errorSpeak();
		} else if ( hasAPIResults ) {
			resultsSpeak();
		}
	}, [ isSearching, hasAPIResults, searchQuery ] );

	function getTitleBySectionType( type, query = '' ) {
		let title = '';
		switch ( type ) {
			case SUPPORT_TYPE_CONTEXTUAL_HELP:
				if ( ! query.length ) {
					return null;
				}
				title = translate( 'This might interest you' );
				break;

			case SUPPORT_TYPE_API_HELP:
				title = translate( 'Support articles' );
				break;
			case SUPPORT_TYPE_ADMIN_SECTION:
				title = translate( 'Show me where to' );
				break;
			default:
				return null;
		}

		return title;
	}

	const onLinkClickHandler = ( event, result ) => {
		const { support_type: supportType, link } = result;
		// check and catch admin section links.
		if ( supportType === SUPPORT_TYPE_ADMIN_SECTION && link ) {
			// record track-event.
			track( 'calypso_inlinehelp_admin_section_visit', {
				link: link,
				search_term: searchQuery,
			} );

			// push state only if it's internal link.
			if ( ! /^http/.test( link ) ) {
				event.preventDefault();
				page( link );
				onAdminSectionSelect( event );
			}

			return;
		}

		onSelect( event, result );
	};

	const renderHelpLink = ( result ) => {
		const {
			link,
			key,
			title,
			support_type = SUPPORT_TYPE_API_HELP,
			icon = 'domains',
			post_id,
		} = result;

		const external = externalLinks && support_type !== SUPPORT_TYPE_ADMIN_SECTION;

		// Unless searching with Inline Help or on the Purchases section, hide the
		// "Managing Purchases" documentation link for users who have not made a purchase.
		if (
			post_id === 111349 &&
			! isSearching &&
			! hasAPIResults &&
			! hasPurchases &&
			sectionName !== 'purchases' &&
			sectionName !== 'site-purchases'
		) {
			return null;
		}

		return (
			<Fragment key={ link ?? key }>
				<li className="inline-help__results-item">
					<div className="inline-help__results-cell">
						<a
							href={ localizeUrl( link ) }
							onClick={ ( event ) => {
								if ( ! external ) {
									event.preventDefault();
								}
								onLinkClickHandler( event, result );
							} }
							{ ...( external && {
								target: '_blank',
								rel: 'noreferrer',
							} ) }
						>
							{ support_type === SUPPORT_TYPE_ADMIN_SECTION && (
								<Gridicon icon={ icon } size={ 18 } />
							) }
							<span>{ preventWidows( decodeEntities( title ) ) }</span>
						</a>
					</div>
				</li>
			</Fragment>
		);
	};

	const renderSearchResultsSection = ( id, title, results ) => {
		/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
		return (
			<Fragment key={ id }>
				{ title ? (
					<h3 id={ id } className="inline-help__results-title">
						{ title }
					</h3>
				) : null }
				<ul className="inline-help__results-list" aria-labelledby={ title ? id : undefined }>
					{ results.map( renderHelpLink ) }
				</ul>
			</Fragment>
		);
		/* eslint-enable jsx-a11y/no-noninteractive-element-to-interactive-role */
	};

	const renderSearchSections = ( results, query ) => {
		// Get the unique result types
		// TODO: Clean this up. There has to be a simpler way to find the unique search result types
		const searchResultTypes = results
			.map( ( searchResult ) => searchResult.support_type )
			.filter( ( type, index, arr ) => arr.indexOf( type ) === index );

		return searchResultTypes.map( ( resultType ) => {
			let displayedResults = results;
			switch ( resultType ) {
				case SUPPORT_TYPE_CONTEXTUAL_HELP:
					displayedResults = results.filter( ( r ) => r.support_type === resultType ).slice( 0, 6 );
					break;
				case SUPPORT_TYPE_API_HELP:
					displayedResults = results.filter( ( r ) => r.support_type === resultType ).slice( 0, 5 );
					break;
				case SUPPORT_TYPE_ADMIN_SECTION:
					displayedResults = results.filter( ( r ) => r.support_type === resultType ).slice( 0, 3 );
					break;
			}
			return renderSearchResultsSection(
				`inline-search--${ resultType }`,
				getTitleBySectionType( resultType, query ),
				displayedResults
			);
		} );
	};

	const resultsLabel = hasAPIResults
		? translate( 'Search Results' )
		: translate( 'Helpful resources for this section' );

	const renderSearchResults = () => {
		if ( isSearching && ! searchResults.length ) {
			// search, but no results so far
			return <PlaceholderLines lines={ placeholderLines } />;
		}

		return (
			<>
				{ ! isEmpty( searchQuery ) && ! hasAPIResults && (
					<p className="inline-help__empty-results">
						{ translate(
							'Sorry, there were no matches. Here are some of the most searched for help pages for this section:'
						) }
					</p>
				) }

				<div className="inline-help__results" aria-label={ resultsLabel }>
					{ renderSearchSections( searchResults, searchQuery ) }
				</div>
			</>
		);
	};

	return (
		<>
			<QueryInlineHelpSearch query={ searchQuery } />
			{ currentUserId && <QueryUserPurchases userId={ currentUserId } /> }
			{ renderSearchResults() }
		</>
	);
}

HelpSearchResults.propTypes = {
	translate: PropTypes.func,
	searchQuery: PropTypes.string,
	onSelect: PropTypes.func.isRequired,
	onAdminSectionSelect: PropTypes.func,
	hasAPIResults: PropTypes.bool,
	searchResults: PropTypes.array,
	isSearching: PropTypes.bool,
	track: PropTypes.func,
};

export default connect(
	( state, ownProps ) => ( {
		currentUserId: getCurrentUserId( state ),
		searchResults: getSearchResultsByQuery( state ),
		isSearching: isRequestingInlineHelpSearchResultsForQuery( state, ownProps.searchQuery ),
		hasAPIResults: hasInlineHelpAPIResults( state ),
		hasPurchases: hasCancelableUserPurchases( state, getCurrentUserId( state ) ),
		sectionName: getSectionName( state ),
	} ),
	{
		track: recordTracksEvent,
	}
)( localize( HelpSearchResults ) );
