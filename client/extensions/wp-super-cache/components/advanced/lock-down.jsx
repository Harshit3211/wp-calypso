import { Card } from '@automattic/components';
import { ToggleControl } from '@wordpress/components';
import { pick } from 'lodash';
import React from 'react';
import ClipboardButton from 'calypso/components/forms/clipboard-button';
import FormFieldset from 'calypso/components/forms/form-fieldset';
import FormSettingExplanation from 'calypso/components/forms/form-setting-explanation';
import Gridicon from 'calypso/components/gridicon';
import Notice from 'calypso/components/notice';
import SectionHeader from 'calypso/components/section-header';
import WrapSettingsForm from '../wrap-settings-form';

const LockDown = ( {
	fields: { cache_lock_down },
	handleAutosavingToggle,
	isReadOnly,
	isRequesting,
	isSaving,
	translate,
} ) => {
	const lockdownCodeSnippet = translate(
		"if ( defined( 'WPLOCKDOWN' ) && constant( 'WPLOCKDOWN' ) ) { echo " +
			'"Sorry. My blog is locked down. Updates will appear shortly"; }'
	);

	return (
		<div>
			<SectionHeader label={ translate( 'Lock Down' ) } />
			<Card>
				<form>
					<FormFieldset>
						<ToggleControl
							checked={ !! cache_lock_down }
							disabled={ isRequesting || isSaving || isReadOnly }
							onChange={ handleAutosavingToggle( 'cache_lock_down' ) }
							label={
								<span>
									{ translate(
										'Enable lock down to prepare your server for an expected spike in traffic.'
									) }
								</span>
							}
						/>
					</FormFieldset>

					<div className="wp-super-cache__lock-down-container">
						<FormSettingExplanation className="wp-super-cache__lock-down-explanation">
							{ translate(
								'When this is enabled, new comments on a post will not refresh the cached static files.'
							) }
						</FormSettingExplanation>

						<FormSettingExplanation className="wp-super-cache__lock-down-explanation">
							{ translate(
								'Developers: Make your plugin lock down compatible by checking the "WPLOCKDOWN" ' +
									'constant. The following code will make sure your plugin respects the WPLOCKDOWN setting.'
							) }
						</FormSettingExplanation>

						<FormSettingExplanation className="wp-super-cache__lock-down-code-block">
							<ClipboardButton
								className="wp-super-cache__lock-down-code-block-button"
								text={ lockdownCodeSnippet }
							>
								<Gridicon icon="clipboard" />
							</ClipboardButton>
							<span className="wp-super-cache__lock-down-code-block-snippet">
								{ lockdownCodeSnippet }
							</span>
						</FormSettingExplanation>

						<Notice
							isCompact
							status={ cache_lock_down ? 'is-warning' : 'is-info' }
							text={
								cache_lock_down
									? translate(
											'WordPress is locked down. Super Cache static files will not be deleted ' +
												'when new comments are made.'
									  )
									: translate(
											'WordPress is not locked down. New comments will refresh Super Cache ' +
												'static files as normal.'
									  )
							}
						/>
					</div>
				</form>
			</Card>
		</div>
	);
};

const getFormSettings = ( settings ) => {
	return pick( settings, [ 'cache_lock_down' ] );
};

export default WrapSettingsForm( getFormSettings )( LockDown );
