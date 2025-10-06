import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { CreateBlogRequest, BlogContent } from "../../api/types";
import { blogService } from "../../api/services";
import PageMeta from "../../components/common/PageMeta";
import { PlusIcon, TrashBinIcon, ChevronLeftIcon } from "../../icons";
import { getContinents, getCountriesByContinent, getCitiesByCountry, getCountryCodeByName } from "../../utils/locationUtils";
import SearchableSelect from "../../components/form/SearchableSelect";

const CreateBlog: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateBlogRequest>({
    title: "",
    featured_media: "",
    hero_media: "",
    tags: [],
    tagline: [],
    excerpt: "",
    content: [{ title: "", content: "" }],
    region: "",
    country: "",
    city: "",
    author_name: "",
    about_author: "",
    read_time: "",
    active: true,
    published_at: "",
  });

  const [readTimeValue, setReadTimeValue] = useState<number>(5);
  const [readTimeUnit, setReadTimeUnit] = useState<string>("minutes");

  const [continents] = useState(() => getContinents());
  const [availableCountries, setAvailableCountries] = useState<{value: string, label: string, code?: string}[]>([]);
  const [availableCities, setAvailableCities] = useState<{value: string, label: string}[]>([]);

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

  const handleInputChange = (field: keyof CreateBlogRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (field === 'region') {
      setFormData(prev => ({ ...prev, country: '', city: '' }));
    } else if (field === 'country') {
      setFormData(prev => ({ ...prev, city: '' }));
    }
  };

  const handleContentChange = (index: number, field: keyof BlogContent, value: string) => {
    const newContent = [...formData.content];
    newContent[index] = { ...newContent[index], [field]: value };
    setFormData(prev => ({ ...prev, content: newContent }));
  };

  const addContentSection = () => {
    setFormData(prev => ({
      ...prev,
      content: [...prev.content, { title: "", content: "" }]
    }));
  };

  const removeContentSection = (index: number) => {
    if (formData.content.length > 1) {
      const newContent = formData.content.filter((_, i) => i !== index);
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

  const handleTitleChange = (title: string) => {
    handleInputChange("title", title);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || formData.content.some(c => !c.title || !c.content)) {
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
      await blogService.createBlog(submitData);
      alert("Blog created successfully!");
      navigate("/blogs");
    } catch (error) {
      console.error("Error creating blog:", error);
      alert("Failed to create blog. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageMeta
        title="Create Blog | Blue Escape Travel Admin"
        description="Create a new travel blog post"
      />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/blogs")}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Create Blog Post
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Write a new travel blog article
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Info */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Basic Information
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e: any) => handleTitleChange(e.target.value)}
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
                      onChange={(e: any) => handleTaglineChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Explore the pristine beaches of Thailand"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Excerpt
                    </label>
                    <textarea
                      value={formData.excerpt}
                      onChange={(e: any) => handleInputChange("excerpt", e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Brief description of the blog post"
                    />
                  </div>
                </div>
              </div>

              {/* Content Sections */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Content Sections
                  </h2>
                  <button
                    type="button"
                    onClick={addContentSection}
                    className="inline-flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <PlusIcon className="w-4 h-4" />
                    <span>Add Section</span>
                  </button>
                </div>

                <div className="space-y-6">
                  {formData.content.map((section, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          Section {index + 1}
                        </h3>
                        {formData.content.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeContentSection(index)}
                            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                          >
                            <TrashBinIcon className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Section Title *
                          </label>
                          <input
                            type="text"
                            value={section.title}
                            onChange={(e: any) => handleContentChange(index, "title", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Section title"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Content *
                          </label>
                          <textarea
                            value={section.content}
                            onChange={(e: any) => handleContentChange(index, "content", e.target.value)}
                            rows={6}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Section content"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Media */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Media
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Featured Image URL
                    </label>
                    <input
                      type="url"
                      value={formData.featured_media}
                      onChange={(e: any) => handleInputChange("featured_media", e.target.value)}
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
                      value={formData.hero_media}
                      onChange={(e: any) => handleInputChange("hero_media", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com/hero.jpg"
                    />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Location
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Region
                    </label>
                    <select
                      value={formData.region}
                      onChange={(e: any) => handleInputChange("region", e.target.value)}
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
                      value={formData.country}
                      onChange={(e: any) => handleInputChange("country", e.target.value)}
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
                      value={formData.city}
                      onChange={(value) => handleInputChange("city", value)}
                      options={availableCities}
                      placeholder={!formData.country ? "Select Country First" : "Select City"}
                      disabled={!formData.country}
                      emptyMessage={!formData.country ? "Please select a country first" : "No cities available"}
                    />
                  </div>
                </div>
              </div>

              {/* Author & Meta */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Author & Meta
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Author Name
                    </label>
                    <input
                      type="text"
                      value={formData.author_name}
                      onChange={(e: any) => handleInputChange("author_name", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Author name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      About Author
                    </label>
                    <textarea
                      value={formData.about_author}
                      onChange={(e: any) => handleInputChange("about_author", e.target.value)}
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
                        onChange={(e: any) => handleReadTimeChange(parseInt(e.target.value) || 1, readTimeUnit)}
                        className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="5"
                      />
                      <select
                        value={readTimeUnit}
                        onChange={(e: any) => handleReadTimeChange(readTimeValue, e.target.value)}
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
                            onChange={(e: any) => handleTagChange(index, e.target.value)}
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
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Add tags for better categorization. Each tag can contain spaces.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Publish Date
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.published_at}
                      onChange={(e: any) => handleInputChange("published_at", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="active"
                      checked={formData.active}
                      onChange={(e: any) => handleInputChange("active", e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="active" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Publish immediately
                    </label>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
                  >
                    {loading ? "Creating..." : "Create Blog"}
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/blogs")}
                    className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateBlog;