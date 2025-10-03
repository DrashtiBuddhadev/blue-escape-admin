import { useState } from "react";
import { Link } from "react-router";
import { Experience } from "../../api/types";
import { PencilIcon, TrashBinIcon, EyeIcon, TimeIcon } from "../../icons";

interface ExperienceCardProps {
  experience: Experience;
  onDelete?: (id: string) => void;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({ experience, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!onDelete) return;

    if (window.confirm("Are you sure you want to delete this experience?")) {
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
      {experience.featured_media && (
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={experience.featured_media}
            alt={experience.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
              {experience.title}
            </h3>
            {experience.excerpt && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                {experience.excerpt}
              </p>
            )}
            {experience.brief_description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                {experience.brief_description}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2 ml-4">
            <Link
              to={`/experiences/${experience.id}`}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              title="View Experience"
            >
              <EyeIcon className="w-4 h-4" />
            </Link>
            <Link
              to={`/experiences/${experience.id}/edit`}
              className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
              title="Edit Experience"
            >
              <PencilIcon className="w-4 h-4" />
            </Link>
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

        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
          <div className="flex items-center space-x-4">
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

          <div className="flex items-center space-x-2">
            {getBestTimeText() && (
              <div className="flex items-center space-x-1">
                <TimeIcon className="w-3 h-3" />
                <span className="text-xs">{getBestTimeText()}</span>
              </div>
            )}
          </div>
        </div>

        {experience.tags && experience.tags.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center flex-wrap gap-2">
              {experience.tags.slice(0, 3).map((tag: string, index: number) => (
                <span
                  key={index}
                  className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded"
                >
                  #{tag}
                </span>
              ))}
              {experience.tags.length > 3 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  +{experience.tags.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>Created {formatDate(experience.created_at)}</span>
            {experience.gallery && experience.gallery.length > 0 && (
              <span>{experience.gallery.length} photo{experience.gallery.length !== 1 ? 's' : ''}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard;