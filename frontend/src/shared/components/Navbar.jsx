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
import lakshyaLogo from '../../assets/lakshya-logo.png';

// Add custom styles for animations
const mobileMenuStyles = `
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

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
    // For quiz pages, check if current path starts with /quiz
    if (path === '/quiz') {
      return location.pathname.startsWith('/quiz');
    }
    // For courses pages, check if current path starts with /courses
    if (path === '/courses') {
      return location.pathname.startsWith('/courses');
    }
    // For other pages, use exact match
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
    <>
      <style>{mobileMenuStyles}</style>
      <nav className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center h-20">
          {/* App Name/Logo on the left */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
            >
              <div className="rounded-lg flex items-center justify-center">
                <img 
                  src={lakshyaLogo} 
                  alt="Lakshya Logo" 
                  className="h-12 w-auto object-contain"
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links - Absolutely centered */}
          <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2">
            <NavigationMenu>
              <NavigationMenuList className="space-x-1">
                {navItems.map((item) => (
                  <NavigationMenuItem key={item.path}>
                    <NavigationMenuLink asChild>
                      <Link 
                        to={item.path} 
                        className={`group inline-flex h-10 w-max items-center justify-center rounded-lg px-4 py-2 text-[1rem] font-medium transition-all hover:bg-blue-50 hover:text-blue-700 focus:bg-blue-50 focus:text-blue-700 focus:outline-none ${
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

          {/* Desktop Auth buttons or User Avatar - On the right */}
          <div className="hidden md:flex items-center space-x-3 ml-auto">
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
          <div className="md:hidden flex items-center space-x-2 ml-auto">
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

        {/* Mobile Navigation Menu - Enhanced Overlay with Better Animation */}
        <div className={`md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md shadow-xl border-t border-gray-100 z-50 transform transition-all duration-300 ease-out ${
          isMobileMenuOpen 
            ? 'opacity-100 translate-y-0 scale-100' 
            : 'opacity-0 -translate-y-4 scale-95 pointer-events-none'
        }`}>
          <div className="py-6 px-4">
            <div className="space-y-1">
              {navItems.map((item, index) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-4 px-4 py-4 rounded-xl transition-all duration-300 ease-out transform ${
                    isActivePage(item.path)
                      ? 'bg-blue-100/80 text-blue-700 scale-[1.02] shadow-md'
                      : 'text-gray-700 hover:bg-gray-50/80 hover:scale-[1.01] hover:shadow-sm active:scale-[0.98]'
                  }`}
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animation: isMobileMenuOpen ? 'slideInUp 0.4s ease-out forwards' : 'none'
                  }}
                >
                  <div className={`p-2 rounded-lg transition-all duration-300 ${
                    isActivePage(item.path)
                      ? 'bg-blue-200/50 text-blue-700'
                      : 'bg-gray-100/50 text-gray-600 group-hover:bg-gray-200/50'
                  }`}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-base">{item.name}</div>
                    <div className="text-sm text-gray-500 leading-tight">{item.description}</div>
                  </div>
                </Link>
              ))}
            </div>
            
            {!isAuthenticated && (
              <div className="border-t border-gray-200/50 pt-6 mt-6 space-y-3">
                <Button 
                  variant="ghost"
                  onClick={() => {
                    handleLoginClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full justify-center font-semibold text-gray-700 py-3 rounded-xl transition-all duration-300 hover:bg-gray-50/80 hover:scale-[1.01] active:scale-[0.98] hover:shadow-sm"
                  style={{
                    animation: isMobileMenuOpen ? 'slideInUp 0.5s ease-out forwards' : 'none',
                    animationDelay: `${navItems.length * 50 + 100}ms`
                  }}
                >
                  Sign In
                </Button>
                <Button 
                  onClick={() => {
                    handleSignUpClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full justify-center font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 py-3 rounded-xl transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] hover:shadow-lg"
                  style={{
                    animation: isMobileMenuOpen ? 'slideInUp 0.5s ease-out forwards' : 'none',
                    animationDelay: `${navItems.length * 50 + 150}ms`
                  }}
                >
                  Get Started
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
    </>
  );
};

export default Navbar;
