import {
	POST_DELETE,
	POST_DELETE_SUCCESS,
	POST_DELETE_FAILURE,
	POST_EDIT,
	POST_REQUEST,
	POST_REQUEST_SUCCESS,
	POST_REQUEST_FAILURE,
	POST_RESTORE,
	POST_RESTORE_FAILURE,
	POST_RESTORE_SUCCESS,
	POST_SAVE,
	POST_SAVE_SUCCESS,
	POST_SAVE_FAILURE,
	POSTS_RECEIVE,
	POSTS_REQUEST,
	POSTS_REQUEST_SUCCESS,
	POSTS_REQUEST_FAILURE,
} from 'calypso/state/action-types';
import {
	receivePost,
	receivePosts,
	requestSitePosts,
	requestSitePost,
	requestAllSitesPosts,
	editPost,
	savePost,
	trashPost,
	deletePost,
	restorePost,
} from 'calypso/state/posts/actions';
import { savePostSuccess } from 'calypso/state/posts/actions/save-post-success';
import useNock from 'calypso/test-helpers/use-nock';

jest.mock( 'calypso/state/posts/actions/save-post-success', () => ( {
	savePostSuccess: jest.fn(),
} ) );

describe( 'actions', () => {
	let dispatch;
	let getState;

	beforeEach( () => {
		dispatch = jest.fn();
		getState = jest.fn( () => ( {
			posts: {
				queries: {},
			},
		} ) );
	} );

	describe( '#receivePost()', () => {
		test( 'should return an action object', () => {
			const post = { ID: 841, title: 'Hello World' };
			const action = receivePost( post );

			expect( action ).toEqual( {
				type: POSTS_RECEIVE,
				posts: [ post ],
			} );
		} );
	} );

	describe( '#receivePosts()', () => {
		test( 'should return an action object', () => {
			const posts = [ { ID: 841, title: 'Hello World' } ];
			const action = receivePosts( posts );

			expect( action ).toEqual( {
				type: POSTS_RECEIVE,
				posts,
			} );
		} );
	} );

	describe( 'savePostSuccess()', () => {
		// eslint-disable-next-line no-shadow
		const { savePostSuccess } = jest.requireActual(
			'calypso/state/posts/actions/save-post-success'
		);
		test( 'should return an action object', () => {
			const savedPost = { ID: 841, title: 'Hello World' };
			const attributes = { status: 'draft' };
			savePostSuccess( 10, 841, savedPost, attributes )( dispatch );

			expect( dispatch ).toHaveBeenCalledWith( {
				type: POST_SAVE_SUCCESS,
				siteId: 10,
				postId: 841,
				savedPost: savedPost,
				post: attributes,
			} );
		} );
	} );

	describe( '#requestSitePosts()', () => {
		useNock( ( nock ) => {
			nock( 'https://public-api.wordpress.com:443' )
				.persist()
				.get( '/rest/v1.1/sites/2916284/posts' )
				.reply( 200, {
					found: 2,
					posts: [
						{ ID: 841, title: 'Hello World' },
						{ ID: 413, title: 'Ribs & Chicken' },
					],
				} )
				.get( '/rest/v1.1/sites/2916284/posts' )
				.query( { search: 'Hello' } )
				.reply( 200, {
					found: 1,
					posts: [ { ID: 841, title: 'Hello World' } ],
				} )
				.get( '/rest/v1.1/sites/77203074/posts' )
				.reply( 403, {
					error: 'authorization_required',
					message: 'User cannot access this private blog.',
				} );
		} );

		test( 'should dispatch fetch action when thunk triggered', () => {
			requestSitePosts( 2916284 )( dispatch );

			expect( dispatch ).toHaveBeenCalledWith( {
				type: POSTS_REQUEST,
				siteId: 2916284,
				query: {},
			} );
		} );

		test( 'should dispatch posts receive action when request completes', () => {
			return requestSitePosts( 2916284 )( dispatch ).then( () => {
				expect( dispatch ).toHaveBeenCalledWith( {
					type: POSTS_RECEIVE,
					posts: [
						{ ID: 841, title: 'Hello World' },
						{ ID: 413, title: 'Ribs & Chicken' },
					],
				} );
			} );
		} );

		test( 'should dispatch success action when posts request completes', () => {
			return requestSitePosts( 2916284 )( dispatch ).then( () => {
				expect( dispatch ).toHaveBeenCalledWith( {
					type: POSTS_REQUEST_SUCCESS,
					siteId: 2916284,
					query: {},
					found: 2,
					posts: [
						{ ID: 841, title: 'Hello World' },
						{ ID: 413, title: 'Ribs & Chicken' },
					],
				} );
			} );
		} );

		test( 'should dispatch posts request success action with query results', () => {
			return requestSitePosts( 2916284, { search: 'Hello' } )( dispatch ).then( () => {
				expect( dispatch ).toHaveBeenCalledWith( {
					type: POSTS_REQUEST_SUCCESS,
					siteId: 2916284,
					query: { search: 'Hello' },
					found: 1,
					posts: [ { ID: 841, title: 'Hello World' } ],
				} );
			} );
		} );

		test( 'should dispatch failure action when request fails', () => {
			return requestSitePosts( 77203074 )( dispatch ).then( () => {
				expect( dispatch ).toHaveBeenCalledWith(
					expect.objectContaining( {
						type: POSTS_REQUEST_FAILURE,
						siteId: 77203074,
						query: {},
						error: expect.objectContaining( { message: 'User cannot access this private blog.' } ),
					} )
				);
			} );
		} );
	} );

	describe( '#requestAllSitesPosts()', () => {
		useNock( ( nock ) => {
			nock( 'https://public-api.wordpress.com:443' )
				.persist()
				.get( '/rest/v1.1/me/posts' )
				.reply( 200, {
					found: 2,
					posts: [
						{ ID: 841, title: 'Hello World' },
						{ ID: 413, title: 'Ribs & Chicken' },
					],
				} );
		} );

		test( 'should dispatch posts receive action when request completes', () => {
			return requestAllSitesPosts()( dispatch ).then( () => {
				expect( dispatch ).toHaveBeenCalledWith( {
					type: POSTS_RECEIVE,
					posts: [
						{ ID: 841, title: 'Hello World' },
						{ ID: 413, title: 'Ribs & Chicken' },
					],
				} );
			} );
		} );
	} );

	describe( '#requestSitePost()', () => {
		useNock( ( nock ) => {
			nock( 'https://public-api.wordpress.com:443' )
				.persist()
				.get( '/rest/v1.1/sites/2916284/posts/413' )
				.reply( 200, { ID: 413, title: 'Ribs & Chicken' } )
				.get( '/rest/v1.1/sites/2916284/posts/420' )
				.reply( 404, {
					error: 'unknown_post',
					message: 'Unknown post',
				} );
		} );

		test( 'should dispatch request action when thunk triggered', () => {
			requestSitePost( 2916284, 413 )( dispatch );

			expect( dispatch ).toHaveBeenCalledWith( {
				type: POST_REQUEST,
				siteId: 2916284,
				postId: 413,
			} );
		} );

		test( 'should dispatch posts receive action when request completes', () => {
			return requestSitePost(
				2916284,
				413
			)( dispatch ).then( () => {
				expect( dispatch ).toHaveBeenCalledWith( {
					type: POSTS_RECEIVE,
					posts: [ expect.objectContaining( { ID: 413, title: 'Ribs & Chicken' } ) ],
				} );
			} );
		} );

		test( 'should dispatch posts posts request success action when request completes', () => {
			return requestSitePost(
				2916284,
				413
			)( dispatch ).then( () => {
				expect( dispatch ).toHaveBeenCalledWith( {
					type: POST_REQUEST_SUCCESS,
					siteId: 2916284,
					postId: 413,
				} );
			} );
		} );

		test( 'should dispatch fail action when request fails', () => {
			return requestSitePost(
				2916284,
				420
			)( dispatch ).then( () => {
				expect( dispatch ).toHaveBeenCalledWith( {
					type: POST_REQUEST_FAILURE,
					siteId: 2916284,
					postId: 420,
					error: expect.objectContaining( { message: 'Unknown post' } ),
				} );
			} );
		} );
	} );

	describe( '#editPost()', () => {
		test( 'should return an action object for a new post', () => {
			const action = editPost(
				2916284,
				null,
				{
					title: 'Hello World',
				},
				2916284
			);

			expect( action ).toEqual( {
				type: POST_EDIT,
				siteId: 2916284,
				postId: null,
				post: { title: 'Hello World' },
			} );
		} );

		test( 'should return an action object for an existing post', () => {
			const action = editPost( 2916284, 413, {
				title: 'Hello World',
			} );

			expect( action ).toEqual( {
				type: POST_EDIT,
				siteId: 2916284,
				postId: 413,
				post: { title: 'Hello World' },
			} );
		} );
	} );

	describe( 'savePost()', () => {
		useNock( ( nock ) => {
			nock( 'https://public-api.wordpress.com:443' )
				.persist()
				.post( '/rest/v1.2/sites/2916284/posts/new', {
					title: 'Hello World',
				} )
				.reply( 200, {
					ID: 13640,
					title: 'Hello World',
				} )
				.post( '/rest/v1.2/sites/2916284/posts/13640', {
					title: 'Updated',
				} )
				.reply( 200, {
					ID: 13640,
					title: 'Updated',
				} )
				.post( '/rest/v1.2/sites/77203074/posts/new' )
				.reply( 403, {
					error: 'unauthorized',
					message: 'User cannot edit posts',
				} )
				.post( '/rest/v1.2/sites/77203074/posts/102' )
				.reply( 403, {
					error: 'unauthorized',
					message: 'User cannot edit post',
				} );
		} );

		test( 'should dispatch save action when thunk triggered for new post', () => {
			savePost( 2916284, null, { title: 'Hello World' } )( dispatch );

			expect( dispatch ).toHaveBeenCalledWith( {
				type: POST_SAVE,
				siteId: 2916284,
				postId: null,
				post: {
					title: 'Hello World',
				},
			} );
		} );

		test( 'should dispatch success action when saving new post succeeds', () => {
			return savePost( 2916284, null, { title: 'Hello World' } )( dispatch, getState ).then( () => {
				expect( savePostSuccess ).toHaveBeenCalledWith(
					2916284,
					null,
					{ ID: 13640, title: 'Hello World' },
					{ title: 'Hello World' },
					false
				);
			} );
		} );

		test( 'should dispatch received post action when saving new post succeeds', () => {
			return savePost( 2916284, null, { title: 'Hello World' } )( dispatch ).then( () => {
				expect( dispatch ).toHaveBeenCalledWith( {
					type: POSTS_RECEIVE,
					posts: [
						expect.objectContaining( {
							ID: 13640,
							title: 'Hello World',
						} ),
					],
				} );
			} );
		} );

		test( 'should dispatch save action when thunk triggered for existing post', () => {
			savePost( 2916284, 13640, { title: 'Updated' } )( dispatch );

			expect( dispatch ).toHaveBeenCalledWith( {
				type: POST_SAVE,
				siteId: 2916284,
				postId: 13640,
				post: {
					title: 'Updated',
				},
			} );
		} );

		test( 'should dispatch success action when saving existing post succeeds', () => {
			return savePost( 2916284, 13640, { title: 'Updated' } )( dispatch, getState ).then( () => {
				expect( savePostSuccess ).toHaveBeenCalledWith(
					2916284,
					13640,
					{ ID: 13640, title: 'Updated' },
					{ title: 'Updated' },
					false
				);
			} );
		} );

		test( 'should dispatch received post action when saving existing post succeeds', () => {
			return savePost( 2916284, 13640, { title: 'Updated' } )( dispatch ).then( () => {
				expect( dispatch ).toHaveBeenCalledWith( {
					type: POSTS_RECEIVE,
					posts: [
						expect.objectContaining( {
							ID: 13640,
							title: 'Updated',
						} ),
					],
				} );
			} );
		} );

		test( 'should dispatch failure action when saving new post fails', () => {
			return new Promise( ( done ) => {
				savePost( 77203074, null, { title: 'Hello World' } )( dispatch ).catch( () => {
					expect( dispatch ).toHaveBeenCalledWith( {
						type: POST_SAVE_FAILURE,
						siteId: 77203074,
						postId: null,
						error: expect.objectContaining( { message: 'User cannot edit posts' } ),
					} );
					done();
				} );
			} );
		} );

		test( 'should dispatch failure action when saving existing post fails', () => {
			return new Promise( ( done ) => {
				savePost( 77203074, 102, { title: 'Hello World' } )( dispatch ).catch( () => {
					expect( dispatch ).toHaveBeenCalledWith( {
						type: POST_SAVE_FAILURE,
						siteId: 77203074,
						postId: 102,
						error: expect.objectContaining( { message: 'User cannot edit post' } ),
					} );
					done();
				} );
			} );
		} );
	} );

	describe( 'trashPost()', () => {
		test( 'should dispatch save request with trash status payload', () => {
			trashPost( 2916284, 13640 )( dispatch );

			expect( dispatch ).toHaveBeenCalledWith( {
				type: POST_SAVE,
				siteId: 2916284,
				postId: 13640,
				post: {
					status: 'trash',
				},
			} );
		} );
	} );

	describe( 'deletePost()', () => {
		useNock( ( nock ) => {
			nock( 'https://public-api.wordpress.com:443' )
				.persist()
				.post( '/rest/v1.1/sites/2916284/posts/13640/delete' )
				.reply( 200, {
					ID: 13640,
					status: 'deleted',
				} )
				.post( '/rest/v1.1/sites/77203074/posts/102/delete' )
				.reply( 403, {
					error: 'unauthorized',
					message: 'User cannot delete posts',
				} );
		} );

		test( 'should dispatch request action when thunk triggered', () => {
			deletePost( 2916284, 13640 )( dispatch, getState );

			expect( dispatch ).toHaveBeenCalledWith( {
				type: POST_DELETE,
				siteId: 2916284,
				postId: 13640,
			} );
		} );

		test( 'should dispatch success action when deleting post succeeds', () => {
			return deletePost( 2916284, 13640 )( dispatch, getState ).then( () => {
				expect( dispatch ).toHaveBeenCalledWith( {
					type: POST_DELETE_SUCCESS,
					siteId: 2916284,
					postId: 13640,
				} );
			} );
		} );

		test( 'should dispatch failure action when deleting post fails', () => {
			return new Promise( ( done ) => {
				deletePost( 77203074, 102 )( dispatch, getState ).catch( () => {
					expect( dispatch ).toHaveBeenCalledWith( {
						type: POST_DELETE_FAILURE,
						siteId: 77203074,
						postId: 102,
						error: expect.objectContaining( { message: 'User cannot delete posts' } ),
					} );
					done();
				} );
			} );
		} );
	} );

	describe( 'restorePost()', () => {
		useNock( ( nock ) => {
			nock( 'https://public-api.wordpress.com:443' )
				.persist()
				.post( '/rest/v1.1/sites/2916284/posts/13640/restore' )
				.reply( 200, {
					ID: 13640,
					status: 'draft',
				} )
				.post( '/rest/v1.1/sites/77203074/posts/102/restore' )
				.reply( 403, {
					error: 'unauthorized',
					message: 'User cannot restore trashed posts',
				} );
		} );

		test( 'should dispatch request action when thunk triggered', () => {
			restorePost( 2916284, 13640 )( dispatch, getState );

			expect( dispatch ).toHaveBeenCalledWith( {
				type: POST_RESTORE,
				siteId: 2916284,
				postId: 13640,
			} );
		} );

		test( 'should dispatch the received post when request completes successfully', () => {
			return restorePost( 2916284, 13640 )( dispatch, getState ).then( () => {
				expect( dispatch ).toHaveBeenCalledWith( {
					type: POSTS_RECEIVE,
					posts: [ { ID: 13640, status: 'draft' } ],
				} );
			} );
		} );

		test( 'should dispatch success action when restoring post succeeds', () => {
			return restorePost( 2916284, 13640 )( dispatch, getState ).then( () => {
				expect( dispatch ).toHaveBeenCalledWith( {
					type: POST_RESTORE_SUCCESS,
					siteId: 2916284,
					postId: 13640,
				} );
			} );
		} );

		test( 'should dispatch failure action when restoring post fails', () => {
			return new Promise( ( done ) => {
				restorePost( 77203074, 102 )( dispatch, getState ).catch( () => {
					expect( dispatch ).toHaveBeenCalledWith( {
						type: POST_RESTORE_FAILURE,
						siteId: 77203074,
						postId: 102,
						error: expect.objectContaining( { message: 'User cannot restore trashed posts' } ),
					} );
					done();
				} );
			} );
		} );
	} );
} );
