import React from 'react';
import PopoverMenuItem from 'calypso/components/popover-menu/item';
import PopoverMenuSeparator from 'calypso/components/popover-menu/separator';
import EllipsisMenu from '../';

export default function EllipsisMenuExample() {
	return (
		<EllipsisMenu position="bottom right">
			<PopoverMenuItem icon="add">Option A</PopoverMenuItem>
			<PopoverMenuItem icon="pencil">Option B</PopoverMenuItem>
			<PopoverMenuSeparator />
			<PopoverMenuItem icon="help">Option C</PopoverMenuItem>
			<PopoverMenuItem disabled icon="cross-circle">
				Disabled option
			</PopoverMenuItem>
		</EllipsisMenu>
	);
}

EllipsisMenuExample.displayName = 'EllipsisMenuExample';
