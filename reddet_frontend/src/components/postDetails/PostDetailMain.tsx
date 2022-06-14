/* eslint-disable no-underscore-dangle */
import {
  Grid,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import PostFooter from 'components/posts/PostFooter';
import PostHeader from 'components/posts/PostHeader';
import UpvoteSection, { VoteActiveState } from 'components/posts/UpvoteSection';
import { useAuth } from 'providers/authProvider';
import { ReactEventHandler } from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';
import { useVotePost } from 'services/posts';
import useUserQuery, { IUserResponse } from 'services/user';
import { IPostDetail } from 'types/postType';
import { ICommentDetail } from 'types/commentType';
import CommentInputSection from './contents/CommentInputSection';
import PostContent from './contents/PostContent';

interface IPostDetailsBodyProps {
  postData: IPostDetail,
  activeState: VoteActiveState
}

export default function PostDetailsMain({ postData, activeState }: IPostDetailsBodyProps) {
  const auth = useAuth();
  const userQuery = useUserQuery(auth?.data?.user.id);
  const votePostMutation = useVotePost();

  const handleUpvote: ReactEventHandler = (ev) => {
    ev.stopPropagation();
    if (auth?.data?.token) {
      votePostMutation.mutate({
        id: postData.id,
        dir: activeState === VoteActiveState.Up ? 0 : 1,
      });
    } else {
      showNotification({
        id: 'postVote',
        autoClose: 4000,
        disallowClose: true,
        title: 'Unauthorized action',
        message: 'Please Login first.',
        color: 'red',
      });
    }
  };

  const handleDownvote: ReactEventHandler = (ev) => {
    ev.stopPropagation();
    if (auth?.data?.token) {
      votePostMutation.mutate({
        id: postData.id,
        dir: activeState === VoteActiveState.Down ? 0 : -1,
      });
    } else {
      showNotification({
        id: 'postVote',
        autoClose: 4000,
        disallowClose: true,
        title: 'Unauthorized action',
        message: 'Please Login first.',
        color: 'red',
      });
    }
  };

  const handleCommentClicked: ReactEventHandler = (ev) => {
    ev.stopPropagation();
    // should probably scroll to the comment section?
  };

  return (
    <>
      <Grid>
        <Grid.Col
          span={1}
        >
          <UpvoteSection
            upvotes={postData.upvotes}
            handleUpvote={handleUpvote}
            handleDownvote={handleDownvote}
            activeState={activeState}
            isLoading={votePostMutation.isLoading}
          />
        </Grid.Col>
        <Grid.Col span={11} pr="lg">
          <PostHeader posted_at={postData.posted_at} postedBy={postData.posted_by.name} />
          <PostContent post_title={postData.post_title} post_body={postData.post_body} />
          <PostFooter
            commentLength={postData.comments.length}
            onCommentClicked={handleCommentClicked}
          />
          <CommentInputSection />
        </Grid.Col>
      </Grid>
      <Outlet context={{ comments: postData.comments, user: userQuery.data }} />
    </>
  );
}

type ContextType = { comments: ICommentDetail[], user: IUserResponse | undefined, };

export function useComments() {
  return useOutletContext<ContextType>();
}
