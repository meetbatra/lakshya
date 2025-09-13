import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Home } from '../../modules/home';
import { Login, SignUp, Profile } from '../../modules/user';
import { QuizStart, QuizQuestion, QuizReview, QuizResults } from '../../modules/quiz';
import { Courses } from '../../modules/courses';
import { Colleges } from '../../modules/colleges';
import Layout from '../layouts/Layout';
import NotFound from '../pages/NotFound';

// Create router configuration
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'auth',
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
        path: 'quiz',
        children: [
          {
            index: true,
            element: <Navigate to="/quiz/start" replace />
          },
          {
            path: 'start',
            element: <QuizStart />
          },
          {
            path: 'question',
            element: <QuizQuestion />
          },
          {
            path: 'review',
            element: <QuizReview />
          },
          {
            path: 'results',
            element: <QuizResults />
          }
        ]
      },
      {
        path: 'courses',
        element: <Courses />
      },
      {
        path: 'colleges',
        element: <Colleges />
      },
      {
        path: 'profile',
        element: <Profile />
      },
      {
        path: '*',
        element: <NotFound />
      }
    ]
  }
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
