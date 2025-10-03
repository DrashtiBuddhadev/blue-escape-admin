import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { Collection, CollectionContent } from "../../api/types";
import { collectionService } from "../../api/services";
import PageMeta from "../../components/common/PageMeta";
import {
  PlusIcon,
  ChevronLeftIcon,
  LocationIcon,
  EyeIcon,
  PencilIcon,
  TrashBinIcon,
  GroupIcon
} from "../../icons";

const CollectionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [collectionContents, setCollectionContents] = useState<CollectionContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchCollection();
      fetchCollectionContents();
    }
  }, [id]);

  const fetchCollection = async () => {
    try {
      setLoading(true);
      const collection = await collectionService.getCollectionById(id!);
      setCollection(collection);
    } catch (error) {
      console.error('Error fetching collection:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCollectionContents = async () => {
    try {
      setContentLoading(true);
      const contents = await collectionService.getContentsByCollection(id!);
      setCollectionContents(contents);
    } catch (error) {
      console.error('Error fetching collection contents:', error);
    } finally {
      setContentLoading(false);
    }
  };

  const handleDeleteContent = async (contentId: string) => {
    if (window.confirm("Are you sure you want to delete this location content?")) {
      try {
        await collectionService.deleteCollectionContent(contentId);
        setCollectionContents(prev => prev.filter(content => content.id !== contentId));
      } catch (error) {
        console.error('Error deleting collection content:', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getLocationLabel = (content: CollectionContent) => {
    const parts = [];
    if (content.city) parts.push(content.city);
    if (content.country) parts.push(content.country);
    if (content.region && parts.length === 0) parts.push(content.region);
    return parts.length > 0 ? parts.join(', ') : 'Location not specified';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Collection not found
        </h3>
        <Link
          to="/collections"
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
        >
          Back to Collections
        </Link>
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title={`${collection.name} | Blue Escape Travel Admin`}
        description={`Manage location-based content for ${collection.name} collection`}
      />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/collections')}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {collection.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage location-based content for this collection
              </p>
            </div>
          </div>

          <Link
            to={`/collections/${collection.id}/content/create`}
            className="inline-flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Add Location Content</span>
          </Link>
        </div>

        {/* Collection Info */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <GroupIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Collection Information
              </h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Created:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">
                    {formatDate(collection.created_at)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Last Updated:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">
                    {formatDate(collection.updated_at)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Locations:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">
                    {collectionContents.length} location{collectionContents.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Location Content */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Location-Based Content
          </h2>

          {contentLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="animate-pulse bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : collectionContents.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <LocationIcon className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No location content found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Add location-specific content to showcase this collection in different destinations.
              </p>
              <Link
                to={`/collections/${collection.id}/content/create`}
                className="inline-flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <PlusIcon className="w-4 h-4" />
                <span>Add First Location</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {collectionContents.map((content) => (
                <div
                  key={content.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <LocationIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {collection.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {getLocationLabel(content)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {content.about_collection && (
                      <div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                          {content.about_collection}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-1">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          content.active
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          {content.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                          title="View Content"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <Link
                          to={`/collections/${collection.id}/content/${content.id}/edit`}
                          className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors"
                          title="Edit Content"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteContent(content.id)}
                          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                          title="Delete Content"
                        >
                          <TrashBinIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Created {formatDate(content.created_at)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CollectionDetail;