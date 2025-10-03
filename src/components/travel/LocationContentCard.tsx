import React, { useState } from "react";
import { CollectionContent } from "../../api/types";
import { LocationIcon, PencilIcon, EyeIcon, TrashBinIcon, FileIcon } from "../../icons";

interface LocationContentCardProps {
  content: CollectionContent;
  onEdit: (content: CollectionContent) => void;
  onView: (content: CollectionContent) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, newActiveStatus: boolean) => Promise<void>;
}

const LocationContentCard: React.FC<LocationContentCardProps> = ({
  content,
  onEdit,
  onView,
  onDelete,
  onToggleActive
}) => {
  const getLocationName = () => {
    const parts = [];
    if (content.city) parts.push(content.city);
    if (content.country) parts.push(content.country);
    if (content.region && parts.length === 0) parts.push(content.region);
    return parts.length > 0 ? parts.join(', ') : 'Unknown Location';
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this location content? This action cannot be undone.')) {
      onDelete(content.id);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
      {/* Featured Image */}
      <div className="aspect-video w-full bg-gray-100 dark:bg-gray-700 relative">
        {content.featured_img ? (
          <img
            src={content.featured_img}
            alt={getLocationName()}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
            <div className="text-center">
              <FileIcon className="w-12 h-12 mx-auto mb-2" />
              <p className="text-sm">No featured image</p>
            </div>
          </div>
        )}

        {/* Fallback for broken images */}
        <div className="hidden w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500 absolute inset-0 bg-gray-100 dark:bg-gray-700">
          <div className="text-center">
            <FileIcon className="w-12 h-12 mx-auto mb-2" />
            <p className="text-sm">Image not available</p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            content.active
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
          }`}>
            {content.active ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Property Name (if exists) */}
        {content.property_name && (
          <div className="flex items-center">
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
              {content.property_name}
            </span>
          </div>
        )}

        {/* Location Header */}
        <div className="flex items-center space-x-2">
          <LocationIcon className="w-4 h-4 text-blue-500 flex-shrink-0" />
          <h3 className="font-semibold text-gray-900 dark:text-white truncate">
            {getLocationName()}
          </h3>
        </div>

        {/* About Collection Preview */}
        {content.about_collection && (
          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 leading-relaxed">
            {content.about_collection}
          </p>
        )}

        {/* Content Summary */}
        <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
            <span>{content.features?.length || 0} features</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
            <span>{content.about_destination?.length || 0} destinations</span>
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onView(content)}
              className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              title="View content"
            >
              <EyeIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                console.log('Edit button clicked for content:', content.id);
                onEdit(content);
              }}
              className="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Edit content"
            >
              <PencilIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center space-x-2">
            {/* Active Toggle */}
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={content.active}
                onChange={(e) => onToggleActive(content.id, e.target.checked)}
                className="sr-only"
              />
              <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                content.active ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}>
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    content.active ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </div>
            </label>

            <button
              onClick={handleDelete}
              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              title="Delete content"
            >
              <TrashBinIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationContentCard;