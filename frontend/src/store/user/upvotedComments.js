
const UPDATE_UPVOTED_COMMENT = "updateUpvotedComment"
const ADD_UPVOTED_COMMENTS = "addUpvotedComments";
const ADD_UPVOTED_COMMENT = "addUpvotedComment";
const ADD_UPVOTED_COMMENT_COMMENTS = "addUpvotedCommentsComment";


export const updateUpvotedComment = (upvote) => {
    return {
        type: UPDATE_UPVOTED_COMMENT,
        upvote: { ...upvote }
    }
}

export const addUpvotedComments = (upvotedComments) => {
    return {
        type: ADD_UPVOTED_COMMENTS,
        upvotedComments
    }
}

export const addUpvotedComment = (upvotedComment) => {
    return {
        type: ADD_UPVOTED_COMMENT,
        upvotedComment
    }
}

export const addUpvotedCommentsComment = (upvotedComment) => {
    return {
        type: ADD_UPVOTED_COMMENT_COMMENTS,
        upvotedComment
    }
}

const upvotedComment = (state = [], action) => {
    switch (action.type) {
        case ADD_UPVOTED_COMMENT:
            state = [
                ...state.map(upvotedComment =>
                    ({
                        ...upvotedComment,
                        comments: [
                            ...upvotedComment.comments.map(
                                comment => ({
                                    ...comment
                                }))]
                    }))];
            state.push({
                comments: [{
                    commentId: action.upvotedComment.commentId,
                    upvote_dir: action.upvotedComment.dir,
                }],
                postId: action.upvotedComment.postId
            });
            return state;
        case ADD_UPVOTED_COMMENT_COMMENTS:
            state = state.map(upvotedComment => upvotedComment.postId === action.upvotedComment.postId ? {
                ...upvotedComment,
                comments: [...upvotedComment.comments.map(comment => ({ ...comment })), {
                    commentId: action.upvotedComment.commentId,
                    upvote_dir: action.upvotedComment.dir
                }]
            } : {
                    ...upvotedComment,
                    comments: upvotedComment.comments.map(comment => ({ ...comment }))
                });
            return state;

        case ADD_UPVOTED_COMMENTS:
            state = action.upvotedComments.map(upvotedComment => ({ ...upvotedComment }));
            return state;

        case UPDATE_UPVOTED_COMMENT:
            state = state.map(
                upvotedComment => upvotedComment.postId === action.upvote.postId ?
                    {
                        ...upvotedComment, comments:
                            [...upvotedComment.comments.map(
                                comment => comment.commentId === action.upvote.commentId ?
                                    {
                                        ...comment, upvote_dir: action.upvote.dir
                                    } : {
                                        ...comment
                                    })]
                    } :
                    {
                        ...upvotedComment, comments: [...upvotedComment.comments.map(comment => ({ ...comment }))]
                    });
            return state;
        default:
            return state;
    }
};

export default upvotedComment;