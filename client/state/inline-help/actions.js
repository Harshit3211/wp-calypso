import {
	INLINE_HELP_SET_SEARCH_QUERY,
	INLINE_HELP_SELECT_RESULT,
	INLINE_HELP_CONTACT_FORM_RESET,
	INLINE_HELP_CONTACT_FORM_SHOW_QANDA,
	INLINE_HELP_POPOVER_SHOW,
	INLINE_HELP_POPOVER_HIDE,
} from 'calypso/state/action-types';
import 'calypso/state/inline-help/init';

/**
 * Set the search query in the state tree for the inline help.
 *
 * @param {string} searchQuery - query string to persist.
 * @returns {Function}            Action thunk.
 */
export function setInlineHelpSearchQuery( searchQuery = '' ) {
	return {
		type: INLINE_HELP_SET_SEARCH_QUERY,
		searchQuery,
	};
}

/**
 * Selects a specific result in the inline help results list.
 *
 * @param  {number}  resultIndex Index of the result to select
 * @returns {Function}        Action thunk
 */
export function selectResult( resultIndex ) {
	return ( dispatch ) => {
		dispatch( {
			type: INLINE_HELP_SELECT_RESULT,
			resultIndex,
		} );
	};
}

/**
 * Resets the inline contact form state.
 *
 * @returns {Function}  Action thunk
 */
export function resetInlineHelpContactForm() {
	return ( dispatch ) => {
		dispatch( {
			type: INLINE_HELP_CONTACT_FORM_RESET,
		} );
	};
}

/**
 * Shows the Q&A suggestions on the contact form.
 *
 * @returns {Function}  Action thunk
 */
export function showQandAOnInlineHelpContactForm() {
	return ( dispatch ) => {
		dispatch( {
			type: INLINE_HELP_CONTACT_FORM_SHOW_QANDA,
		} );
	};
}

export function showInlineHelpPopover() {
	return ( dispatch ) => {
		dispatch( {
			type: INLINE_HELP_POPOVER_SHOW,
		} );
	};
}

export function hideInlineHelpPopover() {
	return ( dispatch ) => {
		dispatch( {
			type: INLINE_HELP_POPOVER_HIDE,
		} );
	};
}
