import CommentDetailed from 'components/postDetails/comments/CommentDetailed';
import CommentSection from 'components/postDetails/comments/CommentSection';
import PostDetails from 'components/postDetails/PostDetails';
import PostForm from 'components/posts/postForm/PostForm';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

// const Home = React.lazy(() => import('../components/Home'));
import Home from '../components/Home';
import RequireAuth from './RequireAuth';

function RoutesProvider() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/posts/:postId" element={<PostDetails />}>
        <Route index element={<CommentSection />} />
        <Route path="comments/:commentId" element={<CommentDetailed />} />
      </Route>
      <Route
        path="/postSubmit"
        element={(
          <RequireAuth redirectTo="/">
            <PostForm />
          </RequireAuth>
        )}
      />
      <Route path="*" element={<div>404 not found..</div>} />
    </Routes>
  );
}

export default RoutesProvider;
