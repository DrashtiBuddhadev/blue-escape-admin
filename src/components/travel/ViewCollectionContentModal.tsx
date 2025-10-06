import React from "react";
import { CollectionContent } from "../../api/types";
import { CloseIcon, LocationIcon, FileIcon } from "../../icons";

interface ViewCollectionContentModalProps {
  content: CollectionContent;
  isOpen: boolean;
  onClose: () => void;
}

const ViewCollectionContentModal: React.FC<ViewCollectionContentModalProps> = ({
  content,
  isOpen,
  onClose,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getLocationName = () => {
    const parts = [];
    if (content.city) parts.push(content.city);
    if (content.country) parts.push(content.country);
    if (content.region && parts.length === 0) parts.push(content.region);
    return parts.length > 0 ? parts.join(', ') : 'Unknown Location';
  };

  const isVideoUrl = (url: string): boolean => {
    if (!url) return false;
    return url.includes('youtube.com') ||
           url.includes('youtu.be') ||
           url.includes('vimeo.com') ||
           url.includes('player.vimeo.com') ||
           url.endsWith('.mp4') ||
           url.endsWith('.webm') ||
           url.endsWith('.ogg');
  };

  const getEmbedUrl = (url: string): string => {
    // YouTube formats
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    // Vimeo - if already embed URL, return as is
    if (url.includes('player.vimeo.com')) {
      return url;
    }
    if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    // Direct video files or other embeds
    return url;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-[100000] p-4 pt-8 pb-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col my-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            View Location Content
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
          {/* Status and Location Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <LocationIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                {content.property_name && (
                  <h2 className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                    {content.property_name}
                  </h2>
                )}
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {getLocationName()}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Location-Based Content
                </p>
              </div>
            </div>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              content.active
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
            }`}>
              {content.active ? 'Active' : 'Inactive'}
            </span>
          </div>

          {/* Featured Image */}
          {content.featured_img && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Featured Image</h3>
              <div className="aspect-video w-full bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                <img
                  src={content.featured_img}
                  alt={`Featured - ${getLocationName()}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="hidden w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                  <div className="text-center">
                    <FileIcon className="w-12 h-12 mx-auto mb-2" />
                    <p className="text-sm">Featured image not available</p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                This image is displayed in card listings
              </p>
            </div>
          )}

          {/* Hero Media */}
          {content.hero_media && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Hero Media</h3>
              <div className="aspect-video w-full bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                {isVideoUrl(content.hero_media) ? (
                  <iframe
                    src={getEmbedUrl(content.hero_media)}
                    title={`Hero Video - ${getLocationName()}`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <>
                    <img
                      src={content.hero_media}
                      alt={`Hero - ${getLocationName()}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <div className="hidden w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                      <div className="text-center">
                        <FileIcon className="w-12 h-12 mx-auto mb-2" />
                        <p className="text-sm">Hero media not available</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {isVideoUrl(content.hero_media)
                  ? 'This video is displayed in the detail view'
                  : 'This image is displayed in the detail view'}
              </p>
            </div>
          )}

          {/* About Collection */}
          {content.about_collection && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">About Collection</h3>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {content.about_collection}
                </p>
              </div>
            </div>
          )}

          {/* Location Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 dark:text-white">Location Details</h3>
              <div className="space-y-2 text-sm">
                {content.region && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Region:</span>
                    <span className="text-gray-900 dark:text-white font-medium">{content.region}</span>
                  </div>
                )}
                {content.country && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Country:</span>
                    <span className="text-gray-900 dark:text-white font-medium">{content.country}</span>
                  </div>
                )}
                {content.city && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">City:</span>
                    <span className="text-gray-900 dark:text-white font-medium">{content.city}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 dark:text-white">Content Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Features:</span>
                  <span className="text-blue-600 dark:text-blue-400 font-medium">
                    {content.features?.length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Destinations:</span>
                  <span className="text-purple-600 dark:text-purple-400 font-medium">
                    {(() => {
                      const aboutDest = content.about_destination;
                      if (Array.isArray(aboutDest)) {
                        return aboutDest.length;
                      } else if (aboutDest && typeof aboutDest === 'object' && 'description' in aboutDest) {
                        return aboutDest.description ? 1 : 0;
                      }
                      return 0;
                    })()}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 dark:text-white">Timestamps</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Created:</span>
                  <span className="text-gray-900 dark:text-white">{formatDate(content.created_at)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Updated:</span>
                  <span className="text-gray-900 dark:text-white">{formatDate(content.updated_at)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          {(() => {
            console.log('Features data:', content.features);
            return content.features && content.features.length > 0;
          })() && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Features</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {content.features.map((feature, index) => {
                  console.log(`Feature ${index}:`, feature);
                  return (
                    <div
                      key={index}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3"
                    >
                    <div className="flex items-start justify-between">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {feature.title || `Feature ${index + 1}`}
                      </h4>
                      <span className="text-xs text-gray-500 dark:text-gray-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded">
                        Feature
                      </span>
                    </div>

                    {feature.content && (
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                        {feature.content}
                      </p>
                    )}

                    {(() => {
                      // Handle both formats: {media: [urls]} (new) and [urls] (legacy)
                      let imageUrls: string[] = [];

                      if (feature.images) {
                        if (typeof feature.images === 'object' && 'media' in feature.images && Array.isArray(feature.images.media)) {
                          // New format: {media: [urls]}
                          imageUrls = feature.images.media;
                        } else if (Array.isArray(feature.images)) {
                          // Legacy format: [urls]
                          imageUrls = feature.images;
                        }
                      }

                      return imageUrls.length > 0 && (
                        <div className="space-y-3">
                          <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">Images ({imageUrls.length})</h5>
                          <div className="grid grid-cols-2 gap-2">
                            {imageUrls.map((imageUrl, imgIndex) => (
                              <div key={imgIndex} className="aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 relative">
                                <img
                                  src={imageUrl}
                                  alt={`${feature.title || `Feature ${index + 1}`} - Image ${imgIndex + 1}`}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    target.nextElementSibling?.classList.remove('hidden');
                                  }}
                                />
                                <div className="hidden w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500 absolute inset-0 bg-gray-100 dark:bg-gray-700">
                                  <div className="text-center">
                                    <FileIcon className="w-6 h-6 mx-auto mb-1" />
                                    <p className="text-xs">Image not available</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })()}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* About Destination */}
          {(() => {
            const aboutDest = content.about_destination;

            if (!aboutDest) return false;

            if (Array.isArray(aboutDest)) {
              return aboutDest.length > 0;
            } else if (typeof aboutDest === 'object' && 'description' in aboutDest) {
              return aboutDest.description && aboutDest.description.trim().length > 0;
            }

            return false;
          })() && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">About Destination</h3>
              <div className="space-y-4">
                {(() => {
                  const aboutDest = content.about_destination;

                  if (Array.isArray(aboutDest)) {
                    return aboutDest.map((destination, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-4 bg-purple-50/50 dark:bg-purple-900/10"
                      >
                        <div className="flex items-start justify-between">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {destination.title || `Destination ${index + 1}`}
                          </h4>
                          <span className="text-xs text-gray-500 dark:text-gray-400 bg-purple-100 dark:bg-purple-900/30 px-3 py-1 rounded-full font-medium">
                            Destination Info
                          </span>
                        </div>

                        {destination.content && (
                          <div className="prose prose-sm max-w-none">
                            <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                              {destination.content}
                            </div>
                          </div>
                        )}

                        {destination.description && (
                          <div className="space-y-2">
                            <h5 className="text-sm font-medium text-gray-900 dark:text-white">Additional Description:</h5>
                            <div className="prose prose-sm max-w-none">
                              <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                                {destination.description}
                              </div>
                            </div>
                          </div>
                        )}

                        {!destination.content && !destination.description && (
                          <div className="text-gray-500 dark:text-gray-400 italic text-sm">
                            No content available for this destination section.
                          </div>
                        )}

                        <div className="text-xs text-gray-500 dark:text-gray-400 pt-3 border-t border-purple-200 dark:border-purple-800/30">
                          Destination section {index + 1} of {aboutDest.length}
                        </div>
                      </div>
                    ));
                  } else if (typeof aboutDest === 'object' && 'description' in aboutDest) {
                    return (
                      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-4 bg-purple-50/50 dark:bg-purple-900/10">
                        <div className="flex items-start justify-between">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Destination Information
                          </h4>
                          <span className="text-xs text-gray-500 dark:text-gray-400 bg-purple-100 dark:bg-purple-900/30 px-3 py-1 rounded-full font-medium">
                            Destination Info
                          </span>
                        </div>

                        <div className="prose prose-sm max-w-none">
                          <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                            {aboutDest.description}
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return null;
                })()}
              </div>
            </div>
          )}

          {/* Collection Reference */}
          {content.collection && (
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Part of Collection</h3>
              <p className="text-gray-900 dark:text-white font-medium">{content.collection.name}</p>
            </div>
          )}
        </div>

        {/* Footer */}
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

export default ViewCollectionContentModal;