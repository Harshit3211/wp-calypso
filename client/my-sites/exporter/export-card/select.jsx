import { localize } from 'i18n-calypso';
import { get } from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import FormSelect from 'calypso/components/forms/form-select';
import { setPostTypeFieldValue } from 'calypso/state/exporter/actions';
import { getPostTypeFieldOptions, getPostTypeFieldValue } from 'calypso/state/exporter/selectors';

class Select extends Component {
	constructor( props ) {
		super( props );
		this.setValue = this.setValue.bind( this );
	}

	setValue( e ) {
		this.props.setValue( e.target.value );
	}

	render() {
		const { isEnabled, isError, postType, shouldShowPlaceholders, value, fieldName } = this.props;

		const fieldsForPostType = get(
			{
				post: [ 'author', 'status', 'start_date', 'end_date', 'category' ],
				page: [ 'author', 'status', 'start_date', 'end_date' ],
			},
			postType,
			[]
		);

		const label = get(
			{
				author: this.props.translate( 'Author…' ),
				status: this.props.translate( 'Status…' ),
				start_date: this.props.translate( 'Start Date…' ),
				end_date: this.props.translate( 'End Date…' ),
				category: this.props.translate( 'Category…' ),
			},
			fieldName,
			''
		);

		if ( fieldsForPostType.indexOf( this.props.fieldName ) < 0 ) {
			return null;
		}

		const options =
			this.props.options &&
			this.props.options.map( ( option, i ) => {
				return (
					<option key={ i } value={ option.value }>
						{ option.label }
					</option>
				);
			} );
		return (
			<FormSelect
				className={ shouldShowPlaceholders ? 'export-card__placeholder-select' : '' }
				disabled={ shouldShowPlaceholders || ! isEnabled }
				isError={ isEnabled && isError }
				onChange={ this.setValue }
				value={ value || '' }
			>
				<option value="">{ label }</option>
				{ options }
			</FormSelect>
		);
	}
}

const mapStateToProps = ( state, ownProps ) => {
	const { siteId, postType, fieldName } = ownProps;

	const options = getPostTypeFieldOptions( state, siteId, postType, fieldName );
	const value = getPostTypeFieldValue( state, siteId, postType, fieldName );

	return {
		shouldShowPlaceholders: ! options,
		options,
		value,
	};
};

const mapDispatchToProps = ( dispatch, ownProps ) => {
	const { siteId, postType, fieldName } = ownProps;

	return {
		setValue: ( value ) => dispatch( setPostTypeFieldValue( siteId, postType, fieldName, value ) ),
	};
};

export default connect( mapStateToProps, mapDispatchToProps )( localize( Select ) );
