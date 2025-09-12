# Frontend Modular Architecture

This project follows a modular architecture pattern to organize features and maintain clean code separation.

## Directory Structure

```
src/
├── modules/                    # Feature-based modules
│   ├── user/                  # User authentication and profile
│   │   ├── api/              # User-related API calls
│   │   ├── components/       # User-specific components
│   │   ├── pages/            # Login, SignUp, Profile pages
│   │   ├── store/            # User state management
│   │   ├── validation/       # User form validation
│   │   └── index.js          # Module exports
│   │
│   ├── quiz/                 # Career assessment quiz
│   │   ├── components/       # Quiz-specific components
│   │   ├── pages/            # Quiz pages
│   │   └── index.js          # Module exports
│   │
│   ├── courses/              # Course browsing and details
│   │   ├── components/       # Course-specific components
│   │   ├── pages/            # Course listing and detail pages
│   │   └── index.js          # Module exports
│   │
│   ├── colleges/             # College browsing and details
│   │   ├── components/       # College-specific components
│   │   ├── pages/            # College listing and detail pages
│   │   └── index.js          # Module exports
│   │
│   └── home/                 # Landing page and hero section
│       ├── components/       # Home-specific components (HeroSection)
│       ├── pages/            # Home page
│       └── index.js          # Module exports
│
├── shared/                   # Shared resources
│   ├── components/           # Reusable components (Navbar)
│   ├── pages/               # Shared pages (NotFound)
│   └── routes/              # Router configuration
│
├── components/               # UI library components (shadcn/ui)
│   └── ui/                  # Button, Card, Input, etc.
│
├── lib/                     # Utility libraries
├── assets/                  # Static assets
└── App.jsx                  # Main application component
```

## Module Structure

Each module follows a consistent structure:

- **api/**: Module-specific API calls and services
- **components/**: Components used only within this module
- **pages/**: Page components for this module
- **store/**: State management (when needed)
- **validation/**: Form validation schemas
- **index.js**: Exports all public components/pages

## Benefits

1. **Separation of Concerns**: Each module handles a specific feature
2. **Scalability**: Easy to add new features as separate modules
3. **Maintainability**: Changes to one module don't affect others
4. **Reusability**: Shared components are clearly separated
5. **Team Collaboration**: Different developers can work on different modules

## Import Patterns

### Module Exports
```javascript
// From modules/user/index.js
export { default as Login } from './pages/Login';
export { default as SignUp } from './pages/SignUp';
export { default as Profile } from './pages/Profile';
```

### Clean Imports
```javascript
// In router or other files
import { Login, SignUp, Profile } from '../../modules/user';
import { Quiz } from '../../modules/quiz';
import { Courses } from '../../modules/courses';
```

## Adding New Features

1. Create a new module directory under `src/modules/`
2. Add the standard subdirectories (components, pages, etc.)
3. Create an `index.js` file with exports
4. Update the router if needed
5. Add any shared components to `src/shared/components/`

## Module Dependencies

- Modules should not directly import from each other
- Use `shared/` for cross-module components
- API calls should be centralized in each module's `api/` folder
- State management should be module-specific unless global state is needed
