import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Layout from '../shared/components/Layout';

import { CreatePostPage } from '../features/posts/pages/CreatePostPage';

import { DiscoverFeedPage } from '../features/posts/pages/DiscoverFeedPage';
import { ProfilePage } from '../features/users/pages/ProfilePage';
import { SearchPage } from '../pages/SearchPage';
import { AdminLoginPage } from '../features/admin/pages/AdminLoginPage';
import { AdminLayout } from '../features/admin/components/AdminLayout';
import { AdminDashboard } from '../features/admin/pages/AdminDashboard';
import { AdminUserManagementPage } from '../features/admin/pages/AdminUserManagementPage';
import { AdminSpotManagementPage } from '../features/admin/pages/AdminSpotManagementPage';
import { AdminCategoryManagementPage } from '../features/admin/pages/AdminCategoryManagementPage';
import { AdminPostManagementPage } from '../features/admin/pages/AdminPostManagementPage';
import { AdminCommentManagementPage } from '../features/admin/pages/AdminCommentManagementPage';
import { AdminReviewManagementPage } from '../features/admin/pages/AdminReviewManagementPage';
import { AdminReportManagementPage } from '../features/admin/pages/AdminReportManagementPage';


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
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        path: 'dashboard',
        element: <AdminDashboard />,
      },
      {
        path: 'user-management',
        element: <AdminUserManagementPage />,
      },
      {
        path: 'spot-management',
        element: <AdminSpotManagementPage />,
      },
      {
        path: 'category-management',
        element: <AdminCategoryManagementPage />,
      },
      {
        path: 'post-management',
        element: <AdminPostManagementPage />,
      },
      {
        path: 'comment-management',
        element: <AdminCommentManagementPage />,
      },
      {
        path: 'review-management',
        element: <AdminReviewManagementPage />,
      },
      {
        path: 'report-management',
        element: <AdminReportManagementPage />,
      },
      {
        index: true,
        element: <Navigate to="dashboard" replace />,
      }
    ]
  }
]);

export const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};
