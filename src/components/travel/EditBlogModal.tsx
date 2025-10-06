import React, { useState, useEffect } from "react";
import { Blog, UpdateBlogRequest, BlogContent } from "../../api/types";
import { blogService } from "../../api/services";
import { CloseIcon, PlusIcon, TrashBinIcon } from "../../icons";
import { getContinents, getCountriesByContinent, getCitiesByCountry, getCountryCodeByName } from "../../utils/locationUtils";
import SearchableSelect from "../form/SearchableSelect";

interface EditBlogModalProps {
  blog: Blog;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedBlog: Blog) => void;
}

const EditBlogModal: React.FC<EditBlogModalProps> = ({ blog, isOpen, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<UpdateBlogRequest>({});
  const [readTimeValue, setReadTimeValue] = useState<number>(5);
  const [readTimeUnit, setReadTimeUnit] = useState<string>("minutes");

  const [continents] = useState(() => getContinents());
  const [availableCountries, setAvailableCountries] = useState<{value: string, label: string, code?: string}[]>([]);
  const [availableCities, setAvailableCities] = useState<{value: string, label: string}[]>([]);

  useEffect(() => {
    if (blog && isOpen) {
      setFormData({
        title: blog.title,
        featured_media: blog.featured_media || "",
        hero_media: blog.hero_media || "",
        tags: blog.tags || [],
        tagline: blog.tagline || [],
        excerpt: blog.excerpt || "",
        content: blog.content && blog.content.length > 0 ? blog.content : [{ title: "", content: "" }],
        region: blog.region || "",
        country: blog.country || "",
        city: blog.city || "",
        author_name: blog.author_name || "",
        about_author: blog.about_author || "",
        read_time: blog.read_time || "",
        active: blog.active ?? true,
        published_at: blog.published_at || "",
      });

      // Extract read time value and unit
      if (blog.read_time) {
        const match = blog.read_time.match(/(\d+)\s*(min|hr|sec)/);
        if (match) {
          setReadTimeValue(parseInt(match[1]));
          setReadTimeUnit(match[2] === "min" ? "minutes" : match[2] === "hr" ? "hours" : "seconds");
        }
      }
    }
  }, [blog, isOpen]);

  useEffect(() => {
    if (formData.region) {
      const countries = getCountriesByContinent(formData.region);
      setAvailableCountries(countries);
    } else {
      setAvailableCountries([]);
      setAvailableCities([]);
    }
  }, [formData.region]);

  useEffect(() => {
    if (formData.country) {
      const countryCode = getCountryCodeByName(formData.country);
      if (countryCode) {
        const cities = getCitiesByCountry(countryCode);
        setAvailableCities(cities);
      }
    } else {
      setAvailableCities([]);
    }
  }, [formData.country]);

  const handleInputChange = (field: keyof UpdateBlogRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (field === 'region') {
      setFormData(prev => ({ ...prev, country: '', city: '' }));
    } else if (field === 'country') {
      setFormData(prev => ({ ...prev, city: '' }));
    }
  };

  const handleContentChange = (index: number, field: keyof BlogContent, value: string) => {
    const newContent = [...(formData.content || [])];
    newContent[index] = { ...newContent[index], [field]: value };
    setFormData(prev => ({ ...prev, content: newContent }));
  };

  const addContentSection = () => {
    setFormData(prev => ({
      ...prev,
      content: [...(prev.content || []), { title: "", content: "" }]
    }));
  };

  const removeContentSection = (index: number) => {
    if ((formData.content?.length || 0) > 1) {
      const newContent = formData.content?.filter((_, i) => i !== index) || [];
      setFormData(prev => ({ ...prev, content: newContent }));
    }
  };

  const handleTagChange = (index: number, value: string) => {
    const newTags = [...(formData.tags || [])];
    newTags[index] = value;
    setFormData(prev => ({ ...prev, tags: newTags }));
  };

  const addTag = () => {
    setFormData(prev => ({
      ...prev,
      tags: [...(prev.tags || []), ""]
    }));
  };

  const removeTag = (index: number) => {
    const newTags = (formData.tags || []).filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, tags: newTags.length > 0 ? newTags : [] }));
  };

  const handleTaglineChange = (value: string) => {
    const tagline = value.trim() ? [value] : [];
    setFormData(prev => ({ ...prev, tagline }));
  };

  const handleReadTimeChange = (value: number, unit: string) => {
    setReadTimeValue(value);
    setReadTimeUnit(unit);
    const readTime = `${value} ${unit === "minutes" ? "min" : unit === "hours" ? "hr" : "sec"} read`;
    setFormData(prev => ({ ...prev, read_time: readTime }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || formData.content?.some(c => !c.title || !c.content)) {
      alert("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      // Filter out empty tags before submitting
      const submitData = {
        ...formData,
        tags: formData.tags?.filter(tag => tag.trim() !== "") || []
      };
      const updatedBlog = await blogService.updateBlog(blog.id, submitData);
      onUpdate(updatedBlog);
      onClose();
    } catch (error: any) {
      console.error("Error updating blog:", error);
      alert("Failed to update blog. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-[100000] p-4 pt-16 pb-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col my-4">
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Edit Blog Post
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Basic Information</h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title || ""}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter blog title"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tagline
                    </label>
                    <input
                      type="text"
                      value={formData.tagline?.[0] || ""}
                      onChange={(e) => handleTaglineChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Explore the pristine beaches of Thailand"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Excerpt
                    </label>
                    <textarea
                      value={formData.excerpt || ""}
                      onChange={(e) => handleInputChange("excerpt", e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Brief description of the blog post"
                    />
                  </div>
                </div>

                {/* Media */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Media</h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Featured Image URL
                    </label>
                    <input
                      type="url"
                      value={formData.featured_media || ""}
                      onChange={(e) => handleInputChange("featured_media", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Hero Image URL
                    </label>
                    <input
                      type="url"
                      value={formData.hero_media || ""}
                      onChange={(e) => handleInputChange("hero_media", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com/hero.jpg"
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Location</h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Region
                    </label>
                    <select
                      value={formData.region || ""}
                      onChange={(e) => handleInputChange("region", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Region</option>
                      {continents.map(continent => (
                        <option key={continent.value} value={continent.value}>{continent.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Country
                    </label>
                    <select
                      value={formData.country || ""}
                      onChange={(e) => handleInputChange("country", e.target.value)}
                      disabled={!formData.region}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">{!formData.region ? "Select Region First" : "Select Country"}</option>
                      {availableCountries.map(country => (
                        <option key={country.value} value={country.value}>{country.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      City
                    </label>
                    <SearchableSelect
                      value={formData.city || ""}
                      onChange={(value) => handleInputChange("city", value)}
                      options={availableCities}
                      placeholder={!formData.country ? "Select Country First" : "Select City"}
                      disabled={!formData.country}
                      emptyMessage={!formData.country ? "Please select a country first" : "No cities available"}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Content Sections */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Content Sections</h3>
                    <button
                      type="button"
                      onClick={addContentSection}
                      className="inline-flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                    >
                      <PlusIcon className="w-4 h-4" />
                      <span>Add Section</span>
                    </button>
                  </div>

                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {(formData.content && formData.content.length > 0 ? formData.content : [{ title: "", content: "" }]).map((section, index) => (
                      <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                            Section {index + 1}
                          </h4>
                          {(formData.content?.length || 0) > 1 && (
                            <button
                              type="button"
                              onClick={() => removeContentSection(index)}
                              className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                            >
                              <TrashBinIcon className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Section Title *
                            </label>
                            <input
                              type="text"
                              value={section.title}
                              onChange={(e) => handleContentChange(index, "title", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                              placeholder="Section title"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Content *
                            </label>
                            <textarea
                              value={section.content}
                              onChange={(e) => handleContentChange(index, "content", e.target.value)}
                              rows={4}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                              placeholder="Section content"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Author & Meta */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Author & Meta</h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Author Name
                    </label>
                    <input
                      type="text"
                      value={formData.author_name || ""}
                      onChange={(e) => handleInputChange("author_name", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Author name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      About Author
                    </label>
                    <textarea
                      value={formData.about_author || ""}
                      onChange={(e) => handleInputChange("about_author", e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Brief author bio"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Read Time
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        min="1"
                        max="999"
                        value={readTimeValue}
                        onChange={(e) => handleReadTimeChange(parseInt(e.target.value) || 1, readTimeUnit)}
                        className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="5"
                      />
                      <select
                        value={readTimeUnit}
                        onChange={(e) => handleReadTimeChange(readTimeValue, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="seconds">Seconds</option>
                        <option value="minutes">Minutes</option>
                        <option value="hours">Hours</option>
                      </select>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Preview: {formData.read_time || "5 min read"}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Tags
                      </label>
                      <button
                        type="button"
                        onClick={addTag}
                        className="inline-flex items-center space-x-1 px-2 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                      >
                        <PlusIcon className="w-3 h-3" />
                        <span>Add Tag</span>
                      </button>
                    </div>
                    <div className="space-y-2">
                      {(formData.tags || []).map((tag, index) => (
                        <div key={index} className="flex space-x-2">
                          <input
                            type="text"
                            value={tag}
                            onChange={(e) => handleTagChange(index, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder={`Tag ${index + 1}: e.g., "travel tips", "adventure guide"`}
                          />
                          <button
                            type="button"
                            onClick={() => removeTag(index)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                            title="Remove tag"
                          >
                            <TrashBinIcon className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      {(!formData.tags || formData.tags.length === 0) && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                          No tags added yet. Click "Add Tag" to get started.
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Publish Date
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.published_at || ""}
                      onChange={(e) => handleInputChange("published_at", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="active"
                      checked={formData.active ?? true}
                      onChange={(e) => handleInputChange("active", e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="active" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Published
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer - Fixed */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0 bg-white dark:bg-gray-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="edit-blog-form"
            disabled={loading}
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
          >
            {loading ? "Updating..." : "Update Blog"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditBlogModal;