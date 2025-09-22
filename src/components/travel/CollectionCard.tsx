import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { Collection, CollectionContent } from "../../api/types";
import { collectionService } from "../../api/services";
import { PencilIcon, TrashBinIcon, EyeIcon, GroupIcon, LocationIcon } from "../../icons";

interface CollectionCardProps {
  collection: Collection;
  onDelete?: (id: string) => void;
}

const CollectionCard: React.FC<CollectionCardProps> = ({ collection, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [locationCount, setLocationCount] = useState<number>(0);
  const [topLocations, setTopLocations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLocationData();
  }, [collection.id]);

  const fetchLocationData = async () => {
    try {
      setLoading(true);
      const contents = await collectionService.getContentsByCollection(collection.id);
      setLocationCount(contents.length);

      // Get top 2 location names for preview
      const locations = contents
        .map(content => {
          const parts = [];
          if (content.city) parts.push(content.city);
          if (content.country) parts.push(content.country);
          if (content.region && parts.length === 0) parts.push(content.region);
          return parts.length > 0 ? parts.join(', ') : 'Unknown Location';
        })
        .slice(0, 2);
      setTopLocations(locations);
    } catch (error) {
      console.error('Error fetching location data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;

    if (window.confirm("Are you sure you want to delete this collection?")) {
      setIsDeleting(true);
      try {
        await onDelete(collection.id);
      } catch (error) {
        console.error("Error deleting collection:", error);
      } finally {
        setIsDeleting(false);
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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <GroupIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {collection.name}
            </h3>

            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              Created {formatDate(collection.created_at)}
            </div>

            {/* Location Information */}
            <div className="flex items-center space-x-2">
              <LocationIcon className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {loading ? (
                  <span className="animate-pulse">Loading locations...</span>
                ) : locationCount > 0 ? (
                  <>
                    <span className="font-medium text-blue-600 dark:text-blue-400">
                      {locationCount} location{locationCount !== 1 ? 's' : ''}
                    </span>
                    {topLocations.length > 0 && (
                      <span className="ml-1">
                        - {topLocations.join(', ')}
                        {locationCount > 2 && <span className="text-gray-400"> +{locationCount - 2} more</span>}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-gray-400">No locations added</span>
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 ml-4">
          <Link
            to={`/collections/${collection.id}`}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            title="View Collection"
          >
            <EyeIcon className="w-4 h-4" />
          </Link>
          <Link
            to={`/collections/${collection.id}/edit`}
            className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
            title="Edit Collection"
          >
            <PencilIcon className="w-4 h-4" />
          </Link>
          {onDelete && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
              title="Delete Collection"
            >
              <TrashBinIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              to={`/collections/${collection.id}`}
              className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              View Details & Locations
            </Link>
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-400">
            Last updated {formatDate(collection.updated_at)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionCard;