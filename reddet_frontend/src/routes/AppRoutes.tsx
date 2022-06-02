import PostDetails from 'components/postDetails/PostDetails';
import PostForm from 'components/posts/postForm/PostForm';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

// const Home = React.lazy(() => import('../components/Home'));
import Home from '../components/Home';

function RoutesProvider() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/posts/:postId" element={<PostDetails />} />
      <Route path="/postSubmit" element={<PostForm />} />
      <Route path="*" element={<div>404 not found..</div>} />
    </Routes>
  );
}

export default RoutesProvider;
