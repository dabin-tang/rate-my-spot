import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Layout from '../shared/components/Layout';

// Placeholder Pages (will be replaced as features are implemented)
const PlaceholderPage = ({ title }: { title: string }) => (
  <div style={{ padding: '40px', textAlign: 'center' }}>
    <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>{title}</h2>
    <p style={{ color: '#666', marginTop: '10px' }}>This page is under construction.</p>
  </div>
);

import { CreatePostPage } from '../features/posts/pages/CreatePostPage';

import { DiscoverFeedPage } from '../features/posts/pages/DiscoverFeedPage';

const UserProfile = () => <PlaceholderPage title="My Profile" />;

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <DiscoverFeedPage />,
      },
      {
        path: 'post/create',
        element: <CreatePostPage />,
      },
      {
        path: 'profile',
        element: <UserProfile />,
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      }
    ],
  },
]);

export const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};
