import { useState } from "react";
import { Link } from "react-router";
import { Blog } from "../../api/types";
import { PencilIcon, TrashBinIcon, EyeIcon, TimeIcon } from "../../icons";

interface BlogCardProps {
  blog: Blog;
  onDelete?: (id: string) => void;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!onDelete) return;

    if (window.confirm("Are you sure you want to delete this blog?")) {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {blog.featured_media && (
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={blog.featured_media}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
              {blog.title}
            </h3>
            {blog.excerpt && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                {blog.excerpt}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2 ml-4">
            <Link
              to={`/blogs/${blog.id}`}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              title="View Blog"
            >
              <EyeIcon className="w-4 h-4" />
            </Link>
            <Link
              to={`/blogs/${blog.id}/edit`}
              className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
              title="Edit Blog"
            >
              <PencilIcon className="w-4 h-4" />
            </Link>
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

        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-4">
            {blog.region && (
              <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full text-xs">
                {blog.region}
              </span>
            )}
            {blog.country && (
              <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded-full text-xs">
                {blog.country}
              </span>
            )}
            {blog.city && (
              <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-2 py-1 rounded-full text-xs">
                {blog.city}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {blog.read_time && (
              <div className="flex items-center space-x-1">
                <TimeIcon className="w-3 h-3" />
                <span>{blog.read_time}</span>
              </div>
            )}
            <span>•</span>
            <span>{formatDate(blog.created_at)}</span>
          </div>
        </div>

        {blog.tags && blog.tags.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center flex-wrap gap-2">
              {blog.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded"
                >
                  #{tag}
                </span>
              ))}
              {blog.tags.length > 3 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  +{blog.tags.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm">
            {blog.author_name && (
              <span className="text-gray-600 dark:text-gray-400">
                by {blog.author_name}
              </span>
            )}
          </div>

          <div className="flex items-center">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              blog.active
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
            }`}>
              {blog.active ? 'Published' : 'Draft'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;