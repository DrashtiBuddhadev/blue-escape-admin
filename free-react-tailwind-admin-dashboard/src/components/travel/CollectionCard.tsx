import React, { useState } from "react";
import { Link } from "react-router";
import { Collection } from "../../api/types";
import { PencilIcon, TrashBinIcon, EyeIcon, GroupIcon } from "../../icons";

interface CollectionCardProps {
  collection: Collection;
  onDelete?: (id: string) => void;
  onEdit?: (collection: Collection) => void;
  onView?: (collection: Collection) => void;
}

const CollectionCard: React.FC<CollectionCardProps> = ({ collection, onDelete, onEdit, onView }) => {
  const [isDeleting, setIsDeleting] = useState(false);

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

            <div className="text-sm text-gray-500 dark:text-gray-400">
              Created {formatDate(collection.created_at)}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 ml-4">
          {onView ? (
            <button
              onClick={() => onView(collection)}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              title="View Collection"
            >
              <EyeIcon className="w-4 h-4" />
            </button>
          ) : (
            <Link
              to={`/collections/${collection.id}`}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              title="View Collection"
            >
              <EyeIcon className="w-4 h-4" />
            </Link>
          )}
          {onEdit ? (
            <button
              onClick={() => onEdit(collection)}
              className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
              title="Edit Collection"
            >
              <PencilIcon className="w-4 h-4" />
            </button>
          ) : (
            <Link
              to={`/collections/${collection.id}/edit`}
              className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
              title="Edit Collection"
            >
              <PencilIcon className="w-4 h-4" />
            </Link>
          )}
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
            Updated {formatDate(collection.updated_at)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionCard;