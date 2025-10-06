import React, { useState, useEffect } from "react";
import { Tag } from "../../api/types";
import { tagService } from "../../api/services";
import PageMeta from "../../components/common/PageMeta";
import { PlusIcon, PencilIcon, TrashBinIcon, CheckLineIcon, CloseLineIcon, TagIcon } from "../../icons";

const TagList: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [editingTagName, setEditingTagName] = useState("");
  const [newTagName, setNewTagName] = useState("");
  const [isAddingNew, setIsAddingNew] = useState(false);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await tagService.getTags();
      setTags(data);
    } catch (error: any) {
      console.error('Error fetching tags:', error);
      setError(error?.message || 'Failed to fetch tags. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) {
      alert('Tag name cannot be empty');
      return;
    }

    try {
      const newTag = await tagService.createTag({ name: newTagName.trim() });
      setTags([...tags, newTag]);
      setNewTagName("");
      setIsAddingNew(false);
    } catch (error: any) {
      console.error('Error creating tag:', error);
      alert(error?.message || 'Failed to create tag. Please try again.');
    }
  };

  const handleStartEdit = (tag: Tag) => {
    setEditingTagId(tag.id);
    setEditingTagName(tag.name);
  };

  const handleCancelEdit = () => {
    setEditingTagId(null);
    setEditingTagName("");
  };

  const handleSaveEdit = async (id: string) => {
    if (!editingTagName.trim()) {
      alert('Tag name cannot be empty');
      return;
    }

    try {
      const updatedTag = await tagService.updateTag(id, { name: editingTagName.trim() });
      setTags(tags.map(tag => tag.id === id ? updatedTag : tag));
      setEditingTagId(null);
      setEditingTagName("");
    } catch (error: any) {
      console.error('Error updating tag:', error);
      alert(error?.message || 'Failed to update tag. Please try again.');
    }
  };

  const handleDeleteTag = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tag?')) {
      return;
    }

    try {
      await tagService.deleteTag(id);
      setTags(tags.filter(tag => tag.id !== id));
    } catch (error: any) {
      console.error('Error deleting tag:', error);
      alert(error?.message || 'Failed to delete tag. Please try again.');
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
    <>
      <PageMeta
        title="Categories | Blue Escape Travel Admin"
        description="Manage categories for organizing travel content"
      />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Categories
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage categories for organizing collection content
            </p>
          </div>

          <button
            onClick={() => setIsAddingNew(true)}
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="text-red-600 dark:text-red-400">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                    Error loading categories
                  </h3>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                    {error}
                  </p>
                </div>
              </div>
              <button
                onClick={fetchTags}
                className="ml-4 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {loading ? (
            <div className="p-6">
              <div className="space-y-4">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="animate-pulse flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : !error && tags.length === 0 && !isAddingNew ? (
            <div className="text-center py-12">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <TagIcon className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No categories found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Get started by creating your first category.
              </p>
              <button
                onClick={() => setIsAddingNew(true)}
                className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <PlusIcon className="w-4 h-4" />
                <span>Add Category</span>
              </button>
            </div>
          ) : !error ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Category Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Last Updated
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {/* New Tag Row */}
                  {isAddingNew && (
                    <tr className="bg-blue-50 dark:bg-blue-900/20">
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={newTagName}
                          onChange={(e) => setNewTagName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleCreateTag();
                            if (e.key === 'Escape') {
                              setIsAddingNew(false);
                              setNewTagName("");
                            }
                          }}
                          placeholder="Enter category name"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          autoFocus
                        />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        -
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        -
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center space-x-2">
                          <button
                            onClick={handleCreateTag}
                            className="p-2 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                            title="Save"
                          >
                            <CheckLineIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setIsAddingNew(false);
                              setNewTagName("");
                            }}
                            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            title="Cancel"
                          >
                            <CloseLineIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}

                  {/* Existing Tags */}
                  {tags.map((tag) => (
                    <tr key={tag.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4">
                        {editingTagId === tag.id ? (
                          <input
                            type="text"
                            value={editingTagName}
                            onChange={(e) => setEditingTagName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveEdit(tag.id);
                              if (e.key === 'Escape') handleCancelEdit();
                            }}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            autoFocus
                          />
                        ) : (
                          <div className="flex items-center space-x-2">
                            <TagIcon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {tag.name}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(tag.created_at)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(tag.updated_at)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {editingTagId === tag.id ? (
                          <div className="inline-flex items-center space-x-2">
                            <button
                              onClick={() => handleSaveEdit(tag.id)}
                              className="p-2 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                              title="Save"
                            >
                              <CheckLineIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                              title="Cancel"
                            >
                              <CloseLineIcon className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="inline-flex items-center space-x-2">
                            <button
                              onClick={() => handleStartEdit(tag)}
                              className="p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <PencilIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteTag(tag.id)}
                              className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <TrashBinIcon className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>

        {/* Stats */}
        {!loading && !error && tags.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total: {tags.length} {tags.length !== 1 ? 'categories' : 'category'}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TagList;
