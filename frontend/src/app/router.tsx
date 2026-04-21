import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Layout from '../shared/components/Layout';

import { CreatePostPage } from '../features/posts/pages/CreatePostPage';

import { DiscoverFeedPage } from '../features/posts/pages/DiscoverFeedPage';
import { ProfilePage } from '../features/users/pages/ProfilePage';
import { SearchPage } from '../pages/SearchPage';
import { AdminLoginPage } from '../features/admin/pages/AdminLoginPage';

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
        element: <ProfilePage />,
      },
      {
        path: 'search',
        element: <SearchPage />,
      },
      {
        path: 'user/:id',
        element: <ProfilePage />,
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      }
    ],
  },
  {
    path: '/admin/login',
    element: <AdminLoginPage />,
  },
]);

export const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};
