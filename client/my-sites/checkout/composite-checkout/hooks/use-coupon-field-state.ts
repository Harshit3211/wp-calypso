import { useEvents } from '@automattic/composite-checkout';
import { useState, useEffect, useCallback } from 'react';

export type CouponFieldStateProps = {
	couponFieldValue: string;
	setCouponFieldValue: ( arg0: string ) => void;
	isApplyButtonActive: boolean;
	isFreshOrEdited: boolean;
	setIsFreshOrEdited: ( arg0: boolean ) => void;
	handleCouponSubmit: () => void;
};

export default function useCouponFieldState(
	applyCoupon: ( couponId: string ) => void
): CouponFieldStateProps {
	const onEvent = useEvents();
	const [ couponFieldValue, setCouponFieldValue ] = useState< string >( '' );

	// Used to hide the `Apply` button
	const [ isApplyButtonActive, setIsApplyButtonActive ] = useState< boolean >( false );

	// Used to hide error messages if the user has edited the form field
	const [ isFreshOrEdited, setIsFreshOrEdited ] = useState< boolean >( true );

	useEffect( () => {
		if ( couponFieldValue.length > 0 ) {
			setIsApplyButtonActive( true );
			return;
		}
		setIsApplyButtonActive( false );
	}, [ couponFieldValue ] );

	const handleCouponSubmit = useCallback( () => {
		const trimmedValue = couponFieldValue.trim();

		if ( isCouponValid( trimmedValue ) ) {
			onEvent( {
				type: 'a8c_checkout_add_coupon',
				payload: { coupon: trimmedValue },
			} );

			applyCoupon( trimmedValue );

			return;
		}

		onEvent( {
			type: 'a8c_checkout_add_coupon_error',
			payload: { type: 'Invalid code' },
		} );
	}, [ couponFieldValue, onEvent, applyCoupon ] );

	return {
		couponFieldValue,
		setCouponFieldValue,
		isApplyButtonActive,
		isFreshOrEdited,
		setIsFreshOrEdited,
		handleCouponSubmit,
	};
}

function isCouponValid( coupon: string ) {
	// Coupon code is case-insensitive and started with an alphabet.
	// Underscores and hyphens can be included in the coupon code.
	// Per-user coupons can have a dot followed by 5-6 letter checksum for verification.
	return coupon.match( /^[a-z][a-z\d_-]+(\.[a-z\d]+)?$/i );
}
