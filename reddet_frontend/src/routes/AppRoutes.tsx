import PostDetails from 'components/postDetails/PostDetails';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

// const Home = React.lazy(() => import('../components/Home'));
import Home from '../components/Home';

function RoutesProvider() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/posts/:postId" element={<PostDetails />} />
    </Routes>
  );
}

export default RoutesProvider;
