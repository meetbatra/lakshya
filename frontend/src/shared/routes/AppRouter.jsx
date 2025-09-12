import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Home } from '../../modules/home';
import { Login, SignUp, Profile } from '../../modules/user';
import { Quiz } from '../../modules/quiz';
import { Courses } from '../../modules/courses';
import { Colleges } from '../../modules/colleges';
import NotFound from '../pages/NotFound';

// Create router configuration
const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    errorElement: <NotFound />
  },
  {
    path: '/auth',
    children: [
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'signup',
        element: <SignUp />
      }
    ]
  },
  {
    path: '/quiz',
    element: <Quiz />
  },
  {
    path: '/courses',
    element: <Courses />
  },
  {
    path: '/colleges',
    element: <Colleges />
  },
  {
    path: '/profile',
    element: <Profile />
  },
  {
    path: '*',
    element: <NotFound />
  }
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
