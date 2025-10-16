import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Home } from '../../modules/home';
import { Login, SignUp, Profile, Dashboard, CompleteProfile } from '../../modules/user';
import { QuizStart, QuizQuestion, QuizReview, QuizResults, QuizPage } from '../../modules/quiz';
import { Courses, CourseDetails } from '../../modules/courses';
import { Colleges, CollegeDetails } from '../../modules/colleges';
import { Exams, ExamDetails } from '../../modules/exams';
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
          },
          {
            path: 'complete-profile',
            element: <CompleteProfile />
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
        path: 'practice-quiz',
        children: [
          {
            index: true,
            element: <QuizPage />
          },
          {
            path: 'daily',
            element: <QuizPage />
          }
        ]
      },
      {
        path: 'courses',
        children: [
          {
            index: true,
            element: <Courses />
          },
          {
            path: ':courseId',
            element: <CourseDetails />
          }
        ]
      },
      {
        path: 'colleges',
        children: [
          {
            index: true,
            element: <Colleges />
          },
          {
            path: ':id',
            element: <CollegeDetails />
          }
        ]
      },
      {
        path: 'exams',
        children: [
          {
            index: true,
            element: <Exams />
          },
          {
            path: ':id',
            element: <ExamDetails />
          }
        ]
      },
      {
        path: 'profile',
        element: <Profile />
      },
      {
        path: 'dashboard',
        element: <Dashboard />
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
