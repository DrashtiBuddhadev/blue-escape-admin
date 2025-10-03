import React from "react";
import { Blog } from "../../api/types";
import { CloseIcon, TimeIcon, LocationIcon } from "../../icons";

interface ViewBlogModalProps {
  blog: Blog;
  isOpen: boolean;
  onClose: () => void;
}

const ViewBlogModal: React.FC<ViewBlogModalProps> = ({ blog, isOpen, onClose }) => {

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-[100000] p-4 pt-16 pb-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col my-4">
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            View Blog Post
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
          {blog.hero_media && (
            <div className="w-full aspect-video rounded-lg overflow-hidden">
              <img
                src={blog.hero_media}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Title and Basic Info */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {blog.title}
            </h1>

            {blog.tagline && blog.tagline.length > 0 && (
              <div className="space-y-1">
                {blog.tagline.map((line, index) => (
                  <p key={index} className="text-lg text-blue-600 dark:text-blue-400 font-medium">
                    {line}
                  </p>
                ))}
              </div>
            )}

            {blog.excerpt && (
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                {blog.excerpt}
              </p>
            )}
          </div>

          {/* Meta Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 dark:text-white">Publication Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Status:</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    blog.active
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                  }`}>
                    {blog.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                {blog.published_at && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Published:</span>
                    <span className="text-gray-900 dark:text-white">{formatDate(blog.published_at)}</span>
                  </div>
                )}
                {blog.read_time && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Read Time:</span>
                    <div className="flex items-center space-x-1">
                      <TimeIcon className="w-3 h-3" />
                      <span className="text-gray-900 dark:text-white">{blog.read_time}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 dark:text-white">Location</h3>
              <div className="space-y-2 text-sm">
                {(blog.region || blog.country || blog.city) ? (
                  <div className="flex items-start space-x-2">
                    <LocationIcon className="w-4 h-4 mt-0.5 text-gray-400" />
                    <div className="space-y-1">
                      {blog.city && <div className="text-gray-900 dark:text-white">{blog.city}</div>}
                      {blog.country && <div className="text-gray-600 dark:text-gray-400">{blog.country}</div>}
                      {blog.region && <div className="text-gray-500 dark:text-gray-500">{blog.region}</div>}
                    </div>
                  </div>
                ) : (
                  <span className="text-gray-500 dark:text-gray-400">No location specified</span>
                )}
              </div>
            </div>
          </div>

          {/* Featured Image */}
          {blog.featured_media && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Featured Image</h3>
              <div className="w-full max-w-md rounded-lg overflow-hidden">
                <img
                  src={blog.featured_media}
                  alt={blog.title}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          )}

          {/* Content Sections */}
          {blog.content && blog.content.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Content</h3>
              <div className="space-y-6">
                {blog.content.map((section, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4 space-y-2">
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

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Author Information */}
          {(blog.author_name || blog.about_author) && (
            <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Author</h3>
              <div className="space-y-2">
                {blog.author_name && (
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">{blog.author_name}</span>
                  </div>
                )}
                {blog.about_author && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {blog.about_author}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div>
              <span className="font-medium">Created:</span> {formatDate(blog.created_at)}
            </div>
            <div>
              <span className="font-medium">Last Updated:</span> {formatDate(blog.updated_at)}
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

export default ViewBlogModal;