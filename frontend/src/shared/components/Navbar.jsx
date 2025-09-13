import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '../../components/ui/navigation-menu';
import { UserAvatar, useAuth } from '../../modules/user';
import { Menu, X, GraduationCap, Target, Users, BookOpen } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLoginClick = () => {
    navigate('/auth/login');
  };

  const handleSignUpClick = () => {
    navigate('/auth/signup');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActivePage = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { 
      name: 'Quiz', 
      path: '/quiz', 
      icon: Target,
      description: 'Take our career assessment'
    },
    { 
      name: 'Courses', 
      path: '/courses', 
      icon: BookOpen,
      description: 'Explore available courses'
    },
    { 
      name: 'Colleges', 
      path: '/colleges', 
      icon: GraduationCap,
      description: 'Find the best colleges'
    }
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* App Name/Logo on the left */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Target className="h-5 w-5 text-white" />
              </div>
              <span>Lakshya</span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center">
            <NavigationMenu>
              <NavigationMenuList className="space-x-1">
                {navItems.map((item) => (
                  <NavigationMenuItem key={item.path}>
                    <NavigationMenuLink asChild>
                      <Link 
                        to={item.path} 
                        className={`group inline-flex h-10 w-max items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-all hover:bg-blue-50 hover:text-blue-700 focus:bg-blue-50 focus:text-blue-700 focus:outline-none ${
                          isActivePage(item.path) 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'text-gray-700'
                        }`}
                      >
                        <item.icon className="h-4 w-4 mr-2" />
                        {item.name}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Desktop Auth buttons or User Avatar */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">Welcome back!</span>
                <UserAvatar />
              </div>
            ) : (
              <>
                <Button 
                  variant="ghost"
                  onClick={handleLoginClick}
                  className="font-medium text-gray-700 hover:text-blue-700 hover:bg-blue-50"
                >
                  Sign In
                </Button>
                <Button 
                  onClick={handleSignUpClick}
                  className="font-medium bg-blue-600 hover:bg-blue-700 px-6"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {isAuthenticated && <UserAvatar />}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="p-2"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4">
            <div className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActivePage(item.path)
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-gray-500">{item.description}</div>
                  </div>
                </Link>
              ))}
            </div>
            
            {!isAuthenticated && (
              <div className="border-t border-gray-100 pt-4 mt-4 space-y-2">
                <Button 
                  variant="ghost"
                  onClick={handleLoginClick}
                  className="w-full justify-start font-medium text-gray-700 cursor-pointer"
                >
                  Sign In
                </Button>
                <Button 
                  onClick={handleSignUpClick}
                  className="w-full justify-start font-medium bg-blue-600 hover:bg-blue-700 cursor-pointer"
                >
                  Get Started
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
