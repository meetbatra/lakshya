import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faSpinner, 
  faMapMarkerAlt, 
  faUniversity,
  faGraduationCap,
  faPhone,
  faEnvelope,
  faGlobe,
  faFilter,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import { useCollegesStore } from '../store/collegesStore';
import { useAuth } from '../../user/store/userStore';
import BookmarkButton from '../../../shared/components/BookmarkButton';

const Colleges = () => {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const { user } = useAuth();
  
  const {
    colleges,
    loading,
    error,
    searchQuery,
    filters,
    filterOptions,
    autoFiltersApplied,
    fetchAllColleges,
    fetchFilterOptions,
    updateFilters,
    setSearchQuery,
    clearFilters,
    clearAllFilters,
    applyAutoFilters,
    clearError,
    getFilteredColleges
  } = useCollegesStore();

  // Get filtered colleges for display
  const filteredColleges = getFilteredColleges();

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const initializeColleges = async () => {
      await fetchFilterOptions();
      await fetchAllColleges();
      
      // Apply auto-filters if user is logged in and has a state
      if (user && user.state) {
        applyAutoFilters(user);
      }
    };
    
    initializeColleges();
  }, [user]);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    // No API call needed - filtering happens client-side with getFilteredColleges()
  };

  const handleFilterChange = (filterType, value) => {
    updateFilters({ [filterType]: value });
  };

  const handleCollegeClick = (college) => {
    navigate(`/colleges/${college._id}`, { 
      state: { collegeName: college.name } 
    });
  };

  // Helper function to get college type badge color
  const getTypeColor = (type) => {
    switch (type) {
      case 'government': return 'bg-green-100 text-green-800';
      case 'private': return 'bg-blue-100 text-blue-800';
      case 'deemed': return 'bg-purple-100 text-purple-800';
      case 'autonomous': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="h-full bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent mb-4">
              College Directory
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Explore top colleges and universities across India. Find the perfect institution for your academic journey.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-xl mx-auto relative">
              <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search colleges by name, location, or type..."
                value={searchQuery}
                onChange={handleSearch}
                className="pl-11 py-3 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Auto-Filter Message */}
        {autoFiltersApplied && (
          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <AlertDescription className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="h-4 w-4 mr-2 text-blue-600 flex-shrink-0" />
                <span className="text-blue-800 text-sm">
                  Colleges are automatically filtered according to your state ({filters.state})
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 self-start sm:self-auto"
              >
                <FontAwesomeIcon icon={faTimes} className="h-4 w-4 mr-1" />
                Clear Filter
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Filters */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 transition-all duration-200 hover:scale-105 hover:shadow-md ${showFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : ''}`}
            >
              <FontAwesomeIcon 
                icon={faFilter} 
                className={`h-4 w-4 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} 
              />
              Filters
            </Button>
            
            {(filters.type !== 'all' || filters.state !== 'all' || searchQuery) && (
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="text-sm text-gray-600"
              >
                Clear all filters
              </Button>
            )}
          </div>

          {showFilters && (
            <div className="mb-6 overflow-hidden">
              <Card className="transform transition-all duration-300 ease-in-out animate-in slide-in-from-top-2 fade-in-0">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Type Filter */}
                    <div className="transform transition-all duration-200 hover:scale-105">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        College Type
                      </label>
                      <select
                        value={filters.type}
                        onChange={(e) => handleFilterChange('type', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-400 focus:scale-105"
                      >
                        <option value="all">All Types</option>
                        {filterOptions.types?.map(type => (
                          <option key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* State Filter */}
                    <div className="transform transition-all duration-200 hover:scale-105">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State
                      </label>
                      <select
                        value={filters.state}
                        onChange={(e) => handleFilterChange('state', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-400 focus:scale-105"
                      >
                        <option value="all">All States</option>
                        {filterOptions.states?.map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>

                    {/* Sort By */}
                    <div className="transform transition-all duration-200 hover:scale-105">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sort By
                      </label>
                      <select
                        value={filters.sortBy}
                        onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-400 focus:scale-105"
                      >
                        <option value="name">Name</option>
                        <option value="location.state">State</option>
                        <option value="type">Type</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <FontAwesomeIcon icon={faSpinner} className="h-6 w-6 text-blue-600 animate-spin mr-3" />
            <span className="text-base text-gray-600">Loading colleges...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Alert className="mb-8">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!loading && !error && (
          <>
            {/* Results Header */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {filteredColleges?.length || 0} Colleges
                  </h2>
                  <p className="text-gray-600">
                    {searchQuery || filters.type !== 'all' || filters.state !== 'all' ? 
                      `Showing ${filteredColleges?.length || 0} filtered results` : 
                      `${filteredColleges?.length || 0} colleges available`
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Colleges Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(filteredColleges || []).map((college, index) => (
                <Card 
                  key={college?._id || index} 
                  className="hover:shadow-md transition-shadow duration-200 border border-gray-200 flex flex-col h-full overflow-hidden py-0"
                >
                  {/* College Image */}
                  <div className="relative h-48 bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
                    {college?.images?.length > 0 ? (
                      <img
                        src={college.images[0]}
                        alt={college.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    
                    {/* Fallback content when no image or image fails to load */}
                    <div 
                      className={`w-full h-full flex items-center justify-center ${college?.images?.length > 0 ? 'hidden' : 'flex'}`}
                      style={{ display: college?.images?.length > 0 ? 'none' : 'flex' }}
                    >
                      <div className="text-center">
                        <FontAwesomeIcon icon={faUniversity} className="h-12 w-12 text-blue-300 mb-2" />
                        <p className="text-blue-600 font-medium text-sm">
                          {college?.shortName || college?.name?.split(' ').map(word => word[0]).join('').slice(0, 3)}
                        </p>
                      </div>
                    </div>

                    {/* College Type Badge - Positioned over image */}
                    <div className="absolute top-3 right-3">
                      <Badge className={`${getTypeColor(college?.type)} border-0 text-xs shadow-sm`}>
                        {college?.type?.charAt(0).toUpperCase() + college?.type?.slice(1)}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-6 flex flex-col flex-1">
                    <div className="flex-1">
                      {/* Header */}
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1 leading-tight">
                          {college?.name || 'Unknown College'}
                        </h3>
                        {college?.shortName && (
                          <p className="text-sm text-gray-600 font-medium">
                            {college.shortName}
                          </p>
                        )}
                      </div>

                      {/* Location */}
                      {college?.location && (
                        <div className="mb-4">
                          <div className="flex items-center text-gray-600 text-sm mb-2">
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="h-4 w-4 mr-2 text-gray-400" />
                            <span>
                              {college.location.city}
                              {college.location.state && `, ${college.location.state}`}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Contact Info */}
                      <div className="space-y-2 mb-4">
                        {college?.contact?.phone?.length > 0 && (
                          <div className="flex items-center text-gray-600 text-sm">
                            <FontAwesomeIcon icon={faPhone} className="h-4 w-4 mr-2 text-gray-400" />
                            <span>{college.contact.phone[0]}</span>
                          </div>
                        )}
                        
                        {college?.contact?.email?.length > 0 && (
                          <div className="flex items-center text-gray-600 text-sm">
                            <FontAwesomeIcon icon={faEnvelope} className="h-4 w-4 mr-2 text-gray-400" />
                            <span className="truncate">{college.contact.email[0]}</span>
                          </div>
                        )}
                        
                        {college?.contact?.website && (
                          <div className="flex items-center text-gray-600 text-sm">
                            <FontAwesomeIcon icon={faGlobe} className="h-4 w-4 mr-2 text-gray-400" />
                            <span className="truncate">Website</span>
                          </div>
                        )}
                      </div>

                      {/* Courses */}
                      {college?.courses?.length > 0 && (
                        <div className="mb-4">
                          <div className="flex items-center text-gray-600 text-sm mb-2">
                            <FontAwesomeIcon icon={faGraduationCap} className="h-4 w-4 mr-2 text-gray-400" />
                            <span>{college.courses.length} Course{college.courses.length !== 1 ? 's' : ''}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-auto">
                      <Button 
                        variant="outline" 
                        className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                        onClick={() => handleCollegeClick(college)}
                      >
                        View Full Details
                      </Button>
                      <BookmarkButton 
                        type="colleges" 
                        itemId={college._id}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* No Results */}
            {!loading && filteredColleges?.length === 0 && (
              <div className="text-center py-20">
                <FontAwesomeIcon icon={faUniversity} className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No colleges found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search criteria or filters.
                </p>
                <Button onClick={clearFilters} variant="outline">
                  Clear filters
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Colleges;
