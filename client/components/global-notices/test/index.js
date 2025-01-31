import deepFreeze from 'deep-freeze';
import { shallow } from 'enzyme';
import React from 'react';
import Notice from 'calypso/components/notice';
import { GlobalNotices } from '..';

const baseProps = deepFreeze( {
	storeNotices: [],
	removeNotice: jest.fn(),
} );

beforeEach( jest.clearAllMocks );

describe( '<GlobalNotices />', () => {
	test( 'should not render without notices', () => {
		const wrapper = shallow( <GlobalNotices { ...baseProps } /> );
		expect( wrapper.type() ).toBeNull();
	} );

	test( 'should render notices with the expected structure', () => {
		const notices = [
			{
				noticeId: 'testing-notice',
				showDismiss: true,
				status: 'is-success',
				text: 'A test notice',
			},
		];
		const wrapper = shallow( <GlobalNotices { ...baseProps } storeNotices={ notices } /> );
		//expect( wrapper.hasClass( 'global-notices' ) ).toBe( true );
		expect( wrapper.prop( 'id' ) ).toBe( 'overlay-notices' );
		expect( wrapper.find( Notice ) ).toHaveLength( 1 );
		expect( wrapper ).toMatchSnapshot();
	} );

	test( 'should use provided id', () => {
		const notices = [
			{
				noticeId: 'testing-notice',
				showDismiss: true,
				status: 'is-success',
				text: 'A test notice',
			},
		];
		const wrapper = shallow(
			<GlobalNotices { ...baseProps } storeNotices={ notices } id="test-id" />
		);
		expect( wrapper.prop( 'id' ) ).toBe( 'test-id' );
	} );

	test( 'should call dismissals', () => {
		const notices = [
			{
				noticeId: 'testing-notice',
				onDismissClick: jest.fn(),
				showDismiss: true,
				status: 'is-success',
				text: 'A test notice',
			},
		];

		const wrapper = shallow(
			<GlobalNotices { ...baseProps } storeNotices={ notices } id="test-id" />
		);

		wrapper.find( Notice ).prop( 'onDismissClick' )();

		expect( notices[ 0 ].onDismissClick ).toHaveBeenCalledTimes( 1 );
		expect( baseProps.removeNotice ).toHaveBeenCalledTimes( 1 );
		expect( baseProps.removeNotice ).toHaveBeenCalledWith( 'testing-notice' );
	} );
} );
