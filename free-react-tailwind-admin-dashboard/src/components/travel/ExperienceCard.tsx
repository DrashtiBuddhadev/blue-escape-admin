import React, { useState } from "react";
import { Experience } from "../../api/types";
import { PencilIcon, TrashBinIcon, EyeIcon, TimeIcon } from "../../icons";

interface ExperienceCardProps {
  experience: Experience;
  onDelete?: (id: string) => void;
  onEdit?: (experience: Experience) => void;
  onView?: (experience: Experience) => void;
  onToggleActive?: (id: string, newActiveStatus: boolean) => void;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({ experience, onDelete, onEdit, onView, onToggleActive }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTogglingActive, setIsTogglingActive] = useState(false);

  const handleDelete = async () => {
    if (!onDelete) return;

    if (window.confirm("Are you sure you want to permanently delete this experience? This action cannot be undone.")) {
      setIsDeleting(true);
      try {
        await onDelete(experience.id);
      } catch (error) {
        console.error("Error deleting experience:", error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(experience);
    }
  };

  const handleView = () => {
    if (onView) {
      onView(experience);
    }
  };

  const handleToggleActive = async () => {
    if (!onToggleActive) return;

    setIsTogglingActive(true);
    try {
      await onToggleActive(experience.id, !experience.active);
    } catch (error) {
      console.error("Error toggling experience active status:", error);
    } finally {
      setIsTogglingActive(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getBestTimeText = () => {
    if (!experience.best_time || experience.best_time.length === 0) return null;
    const timeRange = experience.best_time[0];
    return `${timeRange.from} - ${timeRange.to}`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {experience.featured_media ? (
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={experience.featured_media}
            alt={experience.title}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="aspect-video w-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
          <span className="text-gray-400 dark:text-gray-500 text-sm">No Image</span>
        </div>
      )}

      <div className="p-6">
        {/* Title and Action Buttons */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
              {experience.title}
            </h3>
          </div>

          <div className="flex items-center space-x-2 ml-4">
            {onView && (
              <button
                onClick={handleView}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                title="View Experience"
              >
                <EyeIcon className="w-4 h-4" />
              </button>
            )}
            {onEdit && (
              <button
                onClick={handleEdit}
                className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                title="Edit Experience"
              >
                <PencilIcon className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                title="Delete Experience"
              >
                <TrashBinIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Location Tags */}
        <div className="flex items-center space-x-2 mb-3">
          {experience.region && (
            <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-2 py-1 rounded-full text-xs">
              {experience.region}
            </span>
          )}
          {experience.country && (
            <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded-full text-xs">
              {experience.country}
            </span>
          )}
          {experience.city && (
            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full text-xs">
              {experience.city}
            </span>
          )}
        </div>

        {/* Best Time and Active Status */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col space-y-1">
            {getBestTimeText() && (
              <div className="flex items-center space-x-1">
                <TimeIcon className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-600 dark:text-gray-400">{getBestTimeText()}</span>
              </div>
            )}
            <div className="flex items-center space-x-3 text-xs text-gray-600 dark:text-gray-400">
              {experience.duration && (
                <span>🕐 {experience.duration} days</span>
              )}
              {experience.price && (
                <span>₹{experience.price.toLocaleString()}</span>
              )}
            </div>
          </div>

          <div className="flex items-center">
            {onToggleActive && (
              <>
                <button
                  onClick={handleToggleActive}
                  disabled={isTogglingActive}
                  className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 ${
                    experience.active
                      ? 'bg-green-600 dark:bg-green-500'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                  title={`${experience.active ? 'Deactivate' : 'Activate'} experience`}
                >
                  <span
                    className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                      experience.active ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className={`ml-2 text-xs font-medium ${
                  experience.active
                    ? 'text-green-800 dark:text-green-300'
                    : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {isTogglingActive ? 'Updating...' : (experience.active ? 'Active' : 'Inactive')}
                </span>
              </>
            )}
            {!onToggleActive && (
              <span className={`text-xs font-medium ${
                experience.active
                  ? 'text-green-800 dark:text-green-300'
                  : 'text-gray-600 dark:text-gray-400'
              }`}>
                {experience.active ? 'Active' : 'Inactive'}
              </span>
            )}
          </div>
        </div>

        {/* Created Date */}
        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Created {formatDate(experience.created_at)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard;