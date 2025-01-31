import page from 'page';
import PropTypes from 'prop-types';
import React from 'react';
import HeaderCake from 'calypso/components/header-cake';
import Main from 'calypso/components/main';

import './style.scss';

class LoadingPlaceholder extends React.Component {
	static propTypes = {
		path: PropTypes.string,
		title: PropTypes.string.isRequired,
		isFullWidth: PropTypes.bool.isRequired,
	};

	goBack = () => {
		page.back( this.props.path || '/' );
	};

	render() {
		return (
			<Main wideLayout={ this.props.isFullWidth } className="loading-placeholder">
				<HeaderCake className="loading-placeholder__header" onClick={ this.goBack }>
					{ this.props.title }
				</HeaderCake>

				{ this.props.children }
			</Main>
		);
	}
}

export default LoadingPlaceholder;
