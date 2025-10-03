import React from "react";
import { Experience } from "../../api/types";
import { CloseIcon, TimeIcon, LocationIcon } from "../../icons";

interface ViewExperienceModalProps {
  experience: Experience;
  isOpen: boolean;
  onClose: () => void;
}

const ViewExperienceModal: React.FC<ViewExperienceModalProps> = ({ experience, isOpen, onClose }) => {

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getBestTimeText = () => {
    if (!experience.best_time || experience.best_time.length === 0) return null;
    return experience.best_time.map(timeRange => `${timeRange.from} - ${timeRange.to}`).join(', ');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-[100000] p-4 pt-16 pb-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col my-4">
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            View Experience
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
          {/* Hero Section */}
          {experience.featured_media && (
            <div className="w-full aspect-video rounded-lg overflow-hidden">
              <img
                src={experience.featured_media}
                alt={experience.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Carousel Media */}
          {experience.carousel_media && experience.carousel_media.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Carousel Images</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {experience.carousel_media.map((imageUrl, index) => (
                  <div key={index} className="w-full aspect-video rounded-lg overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={`${experience.title} carousel ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Title and Basic Info */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {experience.title}
            </h1>

            {experience.taglines && experience.taglines.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {experience.taglines.map((tagline, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                  >
                    {tagline}
                  </span>
                ))}
              </div>
            )}

            {experience.brief_description && (
              <p className="text-md text-blue-600 dark:text-blue-400 font-medium">
                {experience.brief_description}
              </p>
            )}

            {experience.tags && experience.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {experience.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Meta Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 dark:text-white">Experience Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Status:</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    experience.active
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                  }`}>
                    {experience.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                {experience.duration && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Duration:</span>
                    <span className="text-gray-900 dark:text-white">{experience.duration} days</span>
                  </div>
                )}
                {experience.price && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Price:</span>
                    <span className="text-gray-900 dark:text-white">₹{experience.price.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Created:</span>
                  <span className="text-gray-900 dark:text-white">{formatDate(experience.created_at)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Last Updated:</span>
                  <span className="text-gray-900 dark:text-white">{formatDate(experience.updated_at)}</span>
                </div>
                {getBestTimeText() && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Best Time:</span>
                    <div className="flex items-center space-x-1">
                      <TimeIcon className="w-3 h-3" />
                      <span className="text-gray-900 dark:text-white">{getBestTimeText()}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 dark:text-white">Location</h3>
              <div className="space-y-2 text-sm">
                {(experience.region || experience.country || experience.city) ? (
                  <div className="flex items-start space-x-2">
                    <LocationIcon className="w-4 h-4 mt-0.5 text-gray-400" />
                    <div className="space-y-1">
                      {experience.city && <div className="text-gray-900 dark:text-white">{experience.city}</div>}
                      {experience.country && <div className="text-gray-600 dark:text-gray-400">{experience.country}</div>}
                      {experience.region && <div className="text-gray-500 dark:text-gray-500">{experience.region}</div>}
                    </div>
                  </div>
                ) : (
                  <span className="text-gray-500 dark:text-gray-400">No location specified</span>
                )}
              </div>
            </div>
          </div>

          {/* Content Sections */}
          {experience.content && experience.content.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Experience Details</h3>
              <div className="space-y-6">
                {experience.content.map((section, index) => (
                  <div key={index} className="border-l-4 border-purple-500 pl-4 space-y-2">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                      {section.title}
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {section.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Story */}
          {experience.story && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Story</h3>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {experience.story}
                </p>
              </div>
            </div>
          )}

          {/* Gallery */}
          {experience.gallery && experience.gallery.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Gallery</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {experience.gallery.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="aspect-square rounded-lg overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {item.name && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                        {item.name}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Best Time Details */}
          {experience.best_time && experience.best_time.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Best Time to Visit</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {experience.best_time.map((timeRange, index) => (
                  <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <TimeIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900 dark:text-white font-medium">
                        {timeRange.from} - {timeRange.to}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {experience.tags && experience.tags.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {experience.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div>
              <span className="font-medium">Created:</span> {formatDate(experience.created_at)}
            </div>
            <div>
              <span className="font-medium">Last Updated:</span> {formatDate(experience.updated_at)}
            </div>
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

export default ViewExperienceModal;