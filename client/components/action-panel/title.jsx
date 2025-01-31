import classnames from 'classnames';
import React from 'react';

const ActionPanelTitle = ( { children, className } ) => {
	return <h2 className={ classnames( 'action-panel__title', className ) }>{ children }</h2>;
};

export default ActionPanelTitle;
