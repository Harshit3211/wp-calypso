import { Card } from '@automattic/components';
import PropTypes from 'prop-types';
import React from 'react';
import CreditCardFormFieldsLoadingPlaceholder from 'calypso/components/credit-card-form-fields/loading-placeholder';
import FormButton from 'calypso/components/forms/form-button';
import Layout from 'calypso/components/layout';
import Column from 'calypso/components/layout/column';
import LoadingPlaceholder from 'calypso/me/purchases/components/loading-placeholder';

import './style.scss';

export default function PaymentMethodLoader( { title } ) {
	return (
		<LoadingPlaceholder title={ title } isFullWidth={ true }>
			<Layout>
				<Column type="main">
					<Card className="payment-method-loader__credit-card-content credit-card-form__content">
						<CreditCardFormFieldsLoadingPlaceholder />

						<FormButton isPrimary={ false } />
					</Card>
				</Column>
				<Column type="sidebar">
					<Card className="payment-method-loader__top-card">
						<div className="payment-method-loader__content loading-placeholder__content cancel-purchase-loading-placeholder__subheader" />
						<div className="payment-method-loader__content loading-placeholder__content" />
					</Card>

					<Card>
						<div className="payment-method-loader__content loading-placeholder__content cancel-purchase-loading-placeholder__subheader" />
						<div className="payment-method-loader__content loading-placeholder__content" />
					</Card>
				</Column>
			</Layout>
		</LoadingPlaceholder>
	);
}

PaymentMethodLoader.propTypes = {
	title: PropTypes.string.isRequired,
};
