import React, { useState, useEffect } from "react";
import { Collection, CollectionContent } from "../../api/types";
import { collectionService } from "../../api/services";
import { CloseIcon, LocationIcon, GroupIcon } from "../../icons";

interface ViewCollectionModalProps {
  collection: Collection;
  isOpen: boolean;
  onClose: () => void;
}

const ViewCollectionModal: React.FC<ViewCollectionModalProps> = ({ collection, isOpen, onClose }) => {
  const [locationContents, setLocationContents] = useState<CollectionContent[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && collection) {
      fetchLocationContents();
    }
  }, [isOpen, collection]);

  const fetchLocationContents = async () => {
    try {
      setLoading(true);
      console.log('Fetching location contents for collection:', collection.id);
      const contents = await collectionService.getContentsByCollection(collection.id);
      console.log('Fetched location contents:', contents.length, 'items');
      setLocationContents(contents);
    } catch (error) {
      console.error('Error fetching location contents:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getLocationName = (content: CollectionContent) => {
    const parts = [];
    if (content.city) parts.push(content.city);
    if (content.country) parts.push(content.country);
    if (content.region && parts.length === 0) parts.push(content.region);
    return parts.length > 0 ? parts.join(', ') : 'Unknown Location';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-[100000] p-4 pt-16 pb-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col my-4">
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            View Collection
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Collection Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <GroupIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {collection.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Travel Collection
                </p>
              </div>
            </div>
          </div>

          {/* Collection Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 dark:text-white">Collection Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Created:</span>
                  <span className="text-gray-900 dark:text-white">{formatDate(collection.created_at)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Last Updated:</span>
                  <span className="text-gray-900 dark:text-white">{formatDate(collection.updated_at)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Total Locations:</span>
                  <span className="text-gray-900 dark:text-white">{locationContents.length}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 dark:text-white">Location Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Active Locations:</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">
                    {locationContents.filter(content => content.active).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Inactive Locations:</span>
                  <span className="text-red-600 dark:text-red-400 font-medium">
                    {locationContents.filter(content => !content.active).length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Location Contents */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Location-Based Content</h3>

            {loading ? (
              <div className="text-center py-8">
                <div className="text-gray-500 dark:text-gray-400">Loading location contents...</div>
              </div>
            ) : locationContents.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 dark:text-gray-500 mb-2">
                  <LocationIcon className="w-12 h-12 mx-auto" />
                </div>
                <p className="text-gray-500 dark:text-gray-400">
                  No location content added to this collection yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {locationContents.map((content) => (
                  <div
                    key={content.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3"
                  >
                    {/* Location Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <LocationIcon className="w-4 h-4 text-blue-500" />
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {getLocationName(content)}
                        </h4>
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        content.active
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                      }`}>
                        {content.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    {/* Location Details */}
                    <div className="space-y-2 text-sm">
                      {content.region && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Region:</span>
                          <span className="text-gray-900 dark:text-white">{content.region}</span>
                        </div>
                      )}
                      {content.country && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Country:</span>
                          <span className="text-gray-900 dark:text-white">{content.country}</span>
                        </div>
                      )}
                      {content.city && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500 dark:text-gray-400">City:</span>
                          <span className="text-gray-900 dark:text-white">{content.city}</span>
                        </div>
                      )}
                    </div>

                    {/* Content Preview */}
                    {content.about_collection && (
                      <div className="text-sm">
                        <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                          {content.about_collection}
                        </p>
                      </div>
                    )}

                    {/* About Destinations */}
                    {content.about_destination && content.about_destination.length > 0 && (
                      <div className="space-y-2">
                        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">Destinations:</h5>
                        <div className="space-y-1">
                          {content.about_destination.map((destination, index) => (
                            <div key={index} className="text-sm">
                              <div className="font-medium text-gray-600 dark:text-gray-400">
                                {destination.title || `Destination ${index + 1}`}
                              </div>
                              {destination.content && (
                                <div className="text-gray-500 dark:text-gray-500 text-xs mt-1 line-clamp-2">
                                  {destination.content}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Features & Destinations Count */}
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>
                        {content.features?.length || 0} feature{(content.features?.length || 0) !== 1 ? 's' : ''}
                      </span>
                      <span>
                        {content.about_destination?.length || 0} destination{(content.about_destination?.length || 0) !== 1 ? 's' : ''}
                      </span>
                    </div>

                    {/* Created Date */}
                    <div className="text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
                      Created {formatDate(content.created_at)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer - Fixed */}
        <div className="flex items-center justify-end p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0 bg-white dark:bg-gray-800">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewCollectionModal;