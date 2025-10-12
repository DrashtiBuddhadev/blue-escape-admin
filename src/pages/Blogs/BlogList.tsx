import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { Blog, BlogListParams } from "../../api/types";
import { blogService } from "../../api/services";
import BlogCard from "../../components/travel/BlogCard";
import EditBlogModal from "../../components/travel/EditBlogModal";
import ViewBlogModal from "../../components/travel/ViewBlogModal";
import PageMeta from "../../components/common/PageMeta";
import Pagination from "../../components/common/Pagination";
import { PlusIcon, GridIcon, ListIcon, DocsIcon } from "../../icons";
import { getContinents, getCountriesByContinent, getAllCountriesByContinent } from "../../utils/locationUtils";

const BlogList: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<BlogListParams>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedViewBlog, setSelectedViewBlog] = useState<Blog | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [continents] = useState(() => getContinents());
  const [availableCountries, setAvailableCountries] = useState<{value: string, label: string}[]>([]);
  const [allCountriesByContinent] = useState(() => getAllCountriesByContinent());

  useEffect(() => {
    fetchBlogs();
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

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const apiFilters = {
        ...filters,
        page: currentPage,
        limit: itemsPerPage,
      };
      
      const response = await blogService.getBlogs(apiFilters);
      
      setBlogs(response.data);
      setTotalItems(response.total);
      setTotalPages(response.totalPages);
    } catch (error: any) {
      console.error('Error fetching blogs:', error);
      setError(error?.message || 'Failed to fetch blogs. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBlog = async (id: string) => {
    try {
      await blogService.deleteBlog(id);
      setBlogs(blogs.filter(blog => blog.id !== id));
    } catch (error: any) {
      console.error('Error deleting blog:', error);
      alert(error?.message || 'Failed to delete blog. Please try again.');
    }
  };

  const handleEditBlog = (blog: Blog) => {
    setSelectedBlog(blog);
    setEditModalOpen(true);
  };

  const handleViewBlog = (blog: Blog) => {
    setSelectedViewBlog(blog);
    setViewModalOpen(true);
  };

  const handleToggleActive = async (id: string, newActiveStatus: boolean) => {
    try {
      const updatedBlog = await blogService.updateBlog(id, { active: newActiveStatus });
      setBlogs(blogs.map(blog => blog.id === id ? updatedBlog : blog));
    } catch (error: any) {
      console.error('Error updating blog active status:', error);
      alert(error?.message || 'Failed to update blog status. Please try again.');
      throw error; // Re-throw to trigger the BlogCard error handling
    }
  };

  const handleUpdateBlog = (updatedBlog: Blog) => {
    setBlogs(blogs.map(blog => blog.id === updatedBlog.id ? updatedBlog : blog));
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedBlog(null);
  };

  const handleCloseViewModal = () => {
    setViewModalOpen(false);
    setSelectedViewBlog(null);
  };

  const handleFilterChange = (key: keyof BlogListParams, value: string) => {
    setCurrentPage(1); // Reset to first page when filters change
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
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
        title="Blogs | Blue Escape Travel Admin"
        description="Manage travel blogs and articles"
      />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Travel Blogs
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your travel articles and blog posts
            </p>
          </div>

          <Link
            to="/blogs/create"
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Create Blog</span>
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Continent
              </label>
              <select
                value={filters.region || ''}
                onChange={(e) => handleFilterChange('region', e.target.value)}
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
                onChange={(e) => handleFilterChange('country', e.target.value)}
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
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <GridIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-2 border-l border-gray-300 dark:border-gray-600 ${viewMode === 'list'
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
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
                    Error loading blogs
                  </h3>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                    {error}
                  </p>
                </div>
              </div>
              <button
                onClick={fetchBlogs}
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
        ) : !error && blogs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <DocsIcon className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No blogs found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Get started by creating your first travel blog post.
            </p>
            <Link
              to="/blogs/create"
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Create Blog</span>
            </Link>
          </div>
        ) : !error ? (
          <div className={viewMode === 'grid'
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
          }>
            {blogs.map((blog) => (
              <BlogCard
                key={blog.id}
                blog={blog}
                onDelete={handleDeleteBlog}
                onEdit={handleEditBlog}
                onView={handleViewBlog}
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
        {selectedBlog && (
          <EditBlogModal
            blog={selectedBlog}
            isOpen={editModalOpen}
            onClose={handleCloseEditModal}
            onUpdate={handleUpdateBlog}
          />
        )}

        {/* View Modal */}
        {selectedViewBlog && (
          <ViewBlogModal
            blog={selectedViewBlog}
            isOpen={viewModalOpen}
            onClose={handleCloseViewModal}
          />
        )}
      </div>
    </>
  );
};

export default BlogList;