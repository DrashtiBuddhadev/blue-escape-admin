import React, { useState } from "react";
import { Blog } from "../../api/types";
import { PencilIcon, TrashBinIcon, EyeIcon } from "../../icons";

interface BlogCardProps {
  blog: Blog;
  onDelete?: (id: string) => void;
  onEdit?: (blog: Blog) => void;
  onView?: (blog: Blog) => void;
  onToggleActive?: (id: string, newActiveStatus: boolean) => void;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog, onDelete, onEdit, onView, onToggleActive }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTogglingActive, setIsTogglingActive] = useState(false);

  const handleDelete = async () => {
    if (!onDelete) return;

    if (window.confirm("Are you sure you want to permanently delete this blog? This action cannot be undone.")) {
      setIsDeleting(true);
      try {
        await onDelete(blog.id);
      } catch (error) {
        console.error("Error deleting blog:", error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(blog);
    }
  };

  const handleView = () => {
    if (onView) {
      onView(blog);
    }
  };

  const handleToggleActive = async () => {
    if (!onToggleActive) return;

    setIsTogglingActive(true);
    try {
      await onToggleActive(blog.id, !blog.active);
    } catch (error) {
      console.error("Error toggling blog active status:", error);
    } finally {
      setIsTogglingActive(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Featured Image */}
      {blog.featured_media ? (
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={blog.featured_media}
            alt={blog.title}
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
              {blog.title}
            </h3>
          </div>

          <div className="flex items-center space-x-2 ml-4">
            {onView && (
              <button
                onClick={handleView}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                title="View Blog"
              >
                <EyeIcon className="w-4 h-4" />
              </button>
            )}
            {onEdit && (
              <button
                onClick={handleEdit}
                className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                title="Edit Blog"
              >
                <PencilIcon className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                title="Delete Blog"
              >
                <TrashBinIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Bottom Row: Active Status and Published By */}
        <div className="flex items-center justify-between">
          <div className="text-sm">
            {blog.author_name ? (
              <span className="text-gray-600 dark:text-gray-400">
                Published by {blog.author_name}
              </span>
            ) : (
              <span className="text-gray-500 dark:text-gray-500">
                No author specified
              </span>
            )}
          </div>

          <div className="flex items-center">
            <button
              onClick={handleToggleActive}
              disabled={isTogglingActive}
              className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 ${
                blog.active
                  ? 'bg-green-600 dark:bg-green-500'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
              title={`${blog.active ? 'Deactivate' : 'Activate'} blog`}
            >
              <span
                className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                  blog.active ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`ml-2 text-xs font-medium ${
              blog.active
                ? 'text-green-800 dark:text-green-300'
                : 'text-gray-600 dark:text-gray-400'
            }`}>
              {isTogglingActive ? 'Updating...' : (blog.active ? 'Active' : 'Inactive')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;