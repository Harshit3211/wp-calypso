import { Button } from '@automattic/components';
import { translate } from 'i18n-calypso';
import React, { PureComponent } from 'react';
import SectionHeader from 'calypso/components/section-header';

class SectionHeaderExample extends PureComponent {
	static displayName = 'SectionHeader';

	render() {
		return (
			<div>
				<SectionHeader label={ translate( 'Team' ) } count={ 10 }>
					<Button compact primary>
						{ translate( 'Primary Action' ) }
					</Button>
					<Button compact>{ translate( 'Manage' ) }</Button>
					<Button
						compact
						onClick={ function () {
							alert( translate( 'Clicked add button' ) );
						} }
					>
						{ translate( 'Add' ) }
					</Button>
				</SectionHeader>

				<h3>{ translate( 'Clickable SectionHeader' ) }</h3>

				<SectionHeader
					label={ translate( 'Team' ) }
					count={ 10 }
					href="/devdocs/design/section-header"
				/>

				<h3>{ translate( 'Empty SectionHeader' ) }</h3>
				<SectionHeader />
			</div>
		);
	}
}

export default SectionHeaderExample;
