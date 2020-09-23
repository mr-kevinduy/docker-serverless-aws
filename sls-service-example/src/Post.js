import Util from './Util';

const postsTable = Util.getTableName('posts');

module.exports = {

  /** Create post */
  create: async event => {
    return Util.envelop({
      post: {
        title: 'Create Hello post'
      }
    });
  },

  /** Get post */
  get: async event => {
    const slug = event.pathParameters.slug;

    /* istanbul ignore if  */
    if (!slug) {
      return Util.envelop('Slug must be specified.', 422);
    }

    const post = (await Util.DocumentClient.get({
      TableName: postsTable,
      Key: { slug },
    }).promise()).Item;
    
    if (! post) {
      return Util.envelop(`Post not found: [${slug}]`, 422);
    }

    // const authenticatedUser = await User.authenticateAndGetUser(event);

    // return Util.envelop({
    //   post: await transformRetrievedPost(post, authenticatedUser)
    // });

    return Util.envelop({
      post: {
        title: 'Get Hello post'
      }
    });
  },
};

// async function transformRetrievedPost(post, authenticatedUser) {
//   delete post.dummy;

//   post.tagList = post.tagList ? post.tagList.values : [];

//   post.favoritesCount = post.favoritesCount || 0;

//   post.favorited = false;

//   if (post.favoritedBy && authenticatedUser) {
//     post.favorited = post.favoritedBy.includes(authenticatedUser.username);

//     delete post.favoritedBy;
//   }

//   post.author = await User.getProfileByUsername(post.author, authenticatedUser);

//   return post;
// }
