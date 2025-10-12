import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { Experience, ExperienceListParams } from "../../api/types";
import { experienceService } from "../../api/services";
import ExperienceCard from "../../components/travel/ExperienceCard";
import EditExperienceModal from "../../components/travel/EditExperienceModal";
import ViewExperienceModal from "../../components/travel/ViewExperienceModal";
import PageMeta from "../../components/common/PageMeta";
import Pagination from "../../components/common/Pagination";
import { PlusIcon, GridIcon, ListIcon, BoxCubeIcon } from "../../icons";
import { getContinents, getCountriesByContinent, getAllCountriesByContinent } from "../../utils/locationUtils";

const ExperienceList: React.FC = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ExperienceListParams>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedViewExperience, setSelectedViewExperience] = useState<Experience | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [continents] = useState(() => getContinents());
  const [availableCountries, setAvailableCountries] = useState<{value: string, label: string}[]>([]);
  const [allCountriesByContinent] = useState(() => getAllCountriesByContinent());
  const tags = ['adventure', 'culture', 'nature', 'food', 'beaches', 'mountains', 'urban', 'relaxation'];

  useEffect(() => {
    fetchExperiences();
  }, [filters, currentPage, itemsPerPage]);

  useEffect(() => {
    // Update available countries when region filter changes
    if (filters.region) {
      const countries = getCountriesByContinent(filters.region);
      setAvailableCountries(countries);
    } else {
      // Get all countries from all continents
      const allCountries = Object.values(allCountriesByContinent)
        .flatMap(continent => continent.countries)
        .map(country => ({ value: country.name, label: country.name }))
        .sort((a, b) => a.label.localeCompare(b.label));
      setAvailableCountries(allCountries);
    }
  }, [filters.region, allCountriesByContinent]);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const apiFilters = {
        ...filters,
        page: currentPage,
        limit: itemsPerPage,
      };
      
      console.log('Fetching experiences with filters:', apiFilters);
      const response = await experienceService.getExperiences(apiFilters);
      console.log('Fetched experiences:', response.data?.length, 'experiences');
      
      setExperiences(response.data);
      setTotalItems(response.total);
      setTotalPages(response.totalPages);
    } catch (error: any) {
      console.error('Error fetching experiences:', error);
      console.error('Error details:', {
        message: error?.message,
        status: error?.status,
        data: error?.data
      });
      setError(error?.message || 'Failed to fetch experiences. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExperience = async (id: string) => {
    try {
      await experienceService.deleteExperience(id);
      setExperiences(experiences.filter(experience => experience.id !== id));
    } catch (error: any) {
      console.error('Error deleting experience:', error);
      alert(error?.message || 'Failed to delete experience. Please try again.');
    }
  };

  const handleEditExperience = (experience: Experience) => {
    setSelectedExperience(experience);
    setEditModalOpen(true);
  };

  const handleViewExperience = (experience: Experience) => {
    setSelectedViewExperience(experience);
    setViewModalOpen(true);
  };

  const handleToggleActive = async (id: string, newActiveStatus: boolean) => {
    try {
      console.log('Toggling experience active status:', { id, newActiveStatus });
      const updatedExperience = await experienceService.updateExperience(id, { active: newActiveStatus });
      console.log('Update response:', updatedExperience);
      setExperiences(experiences.map(experience => experience.id === id ? updatedExperience : experience));
    } catch (error: any) {
      console.error('Error updating experience active status:', error);
      console.error('Error details:', {
        message: error?.message,
        status: error?.status,
        data: error?.data
      });
      alert(error?.message || 'Failed to update experience status. Please try again.');
      throw error; // Re-throw to trigger the ExperienceCard error handling
    }
  };

  const handleUpdateExperience = (updatedExperience: Experience) => {
    setExperiences(experiences.map(experience => experience.id === updatedExperience.id ? updatedExperience : experience));
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedExperience(null);
  };

  const handleCloseViewModal = () => {
    setViewModalOpen(false);
    setSelectedViewExperience(null);
  };

  const handleFilterChange = (key: keyof ExperienceListParams, value: string) => {
    console.log('Filter change:', { key, value });
    setCurrentPage(1); // Reset to first page when filters change
    const newFilters = {
      ...filters,
      [key]: value || undefined
    };
    console.log('New filters:', newFilters);
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setCurrentPage(1);
    setFilters({});
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setCurrentPage(1);
    setItemsPerPage(newItemsPerPage);
  };

  return (
    <>
      <PageMeta
        title="Experiences | Blue Escape Travel Admin"
        description="Manage travel experiences and activities"
      />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Travel Experiences
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage exciting travel activities and unique experiences
            </p>
          </div>

          <Link
            to="/experiences/create"
            className="inline-flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Create Experience</span>
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Continent
              </label>
              <select
                value={filters.region || ''}
                onChange={(e: any) => handleFilterChange('region', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Continents</option>
                {continents.map(continent => (
                  <option key={continent.value} value={continent.value}>{continent.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Country
              </label>
              <select
                value={filters.country || ''}
                onChange={(e: any) => handleFilterChange('country', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Countries</option>
                {availableCountries.map(country => (
                  <option key={country.value} value={country.value}>{country.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tag
              </label>
              <select
                value={filters.tag || ''}
                onChange={(e) => handleFilterChange('tag', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Tags</option>
                {tags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                View
              </label>
              <div className="flex items-center space-x-2">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Clear
                </button>

                <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-2 ${viewMode === 'grid'
                      ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <GridIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-2 border-l border-gray-300 dark:border-gray-600 ${viewMode === 'list'
                      ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <ListIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="text-red-600 dark:text-red-400">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                    Error loading experiences
                  </h3>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                    {error}
                  </p>
                </div>
              </div>
              <button
                onClick={fetchExperiences}
                className="ml-4 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        {!error && loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="aspect-video bg-gray-200 dark:bg-gray-700"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : !error && experiences.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <BoxCubeIcon className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No experiences found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Get started by creating your first travel experience.
            </p>
            <Link
              to="/experiences/create"
              className="inline-flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Create Experience</span>
            </Link>
          </div>
        ) : !error ? (
          <div className={viewMode === 'grid'
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
          }>
            {experiences.map((experience) => (
              <ExperienceCard
                key={experience.id}
                experience={experience}
                onDelete={handleDeleteExperience}
                onEdit={handleEditExperience}
                onView={handleViewExperience}
                onToggleActive={handleToggleActive}
              />
            ))}
          </div>
        ) : null}

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
            loading={loading}
          />
        )}

        {/* Edit Modal */}
        {selectedExperience && (
          <EditExperienceModal
            experience={selectedExperience}
            isOpen={editModalOpen}
            onClose={handleCloseEditModal}
            onUpdate={handleUpdateExperience}
          />
        )}

        {/* View Modal */}
        {selectedViewExperience && (
          <ViewExperienceModal
            experience={selectedViewExperience}
            isOpen={viewModalOpen}
            onClose={handleCloseViewModal}
          />
        )}
      </div>
    </>
  );
};

export default ExperienceList;