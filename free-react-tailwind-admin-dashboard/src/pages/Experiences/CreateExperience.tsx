import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { CreateExperienceRequest, BestTime, ExperienceContent, GalleryItem } from "../../api/types";
import { experienceService } from "../../api/services";
import PageMeta from "../../components/common/PageMeta";
import { PlusIcon, TrashBinIcon, ChevronLeftIcon } from "../../icons";
import { getContinents, getCountriesByContinent, getStatesByCountry, getCitiesByCountry, getCountryCodeByName } from "../../utils/locationUtils";

const CreateExperience: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateExperienceRequest>({
    title: "",
    featured_media: "",
    taglines: [""],
    country: "",
    city: "",
    region: "",
    best_time: [{ from: "", to: "" }],
    carousel_media: [""],
    brief_description: "",
    content: [{ title: "", content: "" }],
    gallery: [{ name: "", image: "" }],
    story: "",
    tags: [],
    duration: undefined,
    price: undefined,
  });

  const [continents] = useState(() => getContinents());
  const [availableCountries, setAvailableCountries] = useState<{value: string, label: string, code?: string}[]>([]);
  const [availableStates, setAvailableStates] = useState<{value: string, label: string, code?: string}[]>([]);
  const [availableCities, setAvailableCities] = useState<{value: string, label: string}[]>([]);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Update available countries when region changes
  useEffect(() => {
    if (formData.region) {
      const countries = getCountriesByContinent(formData.region);
      setAvailableCountries(countries);
    } else {
      setAvailableCountries([]);
    }
    setAvailableStates([]);
    setAvailableCities([]);
  }, [formData.region]);

  // Update available states and cities when country changes
  useEffect(() => {
    if (formData.country) {
      const countryCode = getCountryCodeByName(formData.country);
      if (countryCode) {
        const states = getStatesByCountry(countryCode);
        const cities = getCitiesByCountry(countryCode);
        setAvailableStates(states);
        setAvailableCities(cities);
      }
    } else {
      setAvailableStates([]);
      setAvailableCities([]);
    }
  }, [formData.country]);

  const handleInputChange = (field: keyof CreateExperienceRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Reset dependent fields when parent location changes
    if (field === 'region') {
      setFormData(prev => ({ ...prev, country: '', city: '' }));
    } else if (field === 'country') {
      setFormData(prev => ({ ...prev, city: '' }));
    }
  };

  const handleBestTimeChange = (index: number, field: keyof BestTime, value: string) => {
    const newBestTime = [...formData.best_time!];
    newBestTime[index] = { ...newBestTime[index], [field]: value };
    setFormData(prev => ({ ...prev, best_time: newBestTime }));
  };

  const addBestTime = () => {
    setFormData(prev => ({
      ...prev,
      best_time: [...(prev.best_time || []), { from: "", to: "" }]
    }));
  };

  const removeBestTime = (index: number) => {
    if (formData.best_time!.length > 1) {
      const newBestTime = formData.best_time!.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, best_time: newBestTime }));
    }
  };

  const handleContentChange = (index: number, field: keyof ExperienceContent, value: string) => {
    const newContent = [...formData.content!];
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
    if (formData.content!.length > 1) {
      const newContent = formData.content!.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, content: newContent }));
    }
  };

  const handleGalleryChange = (index: number, field: keyof GalleryItem, value: string) => {
    const newGallery = [...formData.gallery!];
    newGallery[index] = { ...newGallery[index], [field]: value };
    setFormData(prev => ({ ...prev, gallery: newGallery }));
  };

  const addGalleryItem = () => {
    setFormData(prev => ({
      ...prev,
      gallery: [...(prev.gallery || []), { name: "", image: "" }]
    }));
  };

  const removeGalleryItem = (index: number) => {
    if (formData.gallery!.length > 1) {
      const newGallery = formData.gallery!.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, gallery: newGallery }));
    }
  };

  const handleCarouselMediaChange = (index: number, value: string) => {
    const newCarouselMedia = [...(formData.carousel_media || [])];
    newCarouselMedia[index] = value;
    setFormData(prev => ({ ...prev, carousel_media: newCarouselMedia }));
  };

  const addCarouselImage = () => {
    setFormData(prev => ({
      ...prev,
      carousel_media: [...(prev.carousel_media || []), ""]
    }));
  };

  const removeCarouselImage = (index: number) => {
    const newCarouselMedia = (formData.carousel_media || []).filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, carousel_media: newCarouselMedia.length > 0 ? newCarouselMedia : [""] }));
  };

  const handleTaglineChange = (index: number, value: string) => {
    const newTaglines = [...(formData.taglines || [])];
    newTaglines[index] = value;
    setFormData(prev => ({ ...prev, taglines: newTaglines }));
  };

  const addTagline = () => {
    setFormData(prev => ({
      ...prev,
      taglines: [...(prev.taglines || []), ""]
    }));
  };

  const removeTagline = (index: number) => {
    const newTaglines = (formData.taglines || []).filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, taglines: newTaglines.length > 0 ? newTaglines : [""] }));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      alert("Please enter a title");
      return;
    }

    setLoading(true);
    try {
      // Filter out empty carousel media URLs, taglines, and tags before submitting
      const submitData = {
        ...formData,
        carousel_media: formData.carousel_media?.filter(url => url.trim() !== "") || [],
        taglines: formData.taglines?.filter(tagline => tagline.trim() !== "") || [],
        tags: formData.tags?.filter(tag => tag.trim() !== "") || []
      };

      await experienceService.createExperience(submitData);
      alert("Experience created successfully!");
      navigate("/experiences");
    } catch (error) {
      console.error("Error creating experience:", error);
      alert("Failed to create experience. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageMeta
        title="Create Experience | Blue Escape Travel Admin"
        description="Create a new travel experience"
      />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/experiences")}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Create Experience
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Create a new travel experience or activity
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
                      onChange={(e: any) => handleInputChange("title", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="e.g., Island Hopping in Phi Phi"
                      required
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Taglines
                      </label>
                      <button
                        type="button"
                        onClick={addTagline}
                        className="inline-flex items-center space-x-1 px-2 py-1 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
                      >
                        <PlusIcon className="w-3 h-3" />
                        <span>Add Tagline</span>
                      </button>
                    </div>
                    <div className="space-y-2">
                      {(formData.taglines || []).map((tagline, index) => (
                        <div key={index} className="flex space-x-2">
                          <input
                            type="text"
                            value={tagline}
                            onChange={(e: any) => handleTaglineChange(index, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder={`Tagline ${index + 1}: e.g., "Explore the world", "Adventure awaits"`}
                          />
                          <button
                            type="button"
                            onClick={() => removeTagline(index)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                            title="Remove tagline"
                          >
                            <TrashBinIcon className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      {(!formData.taglines || formData.taglines.length === 0) && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                          No taglines added yet. Click "Add Tagline" to get started.
                        </p>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Add compelling taglines for the experience (comma-separated phrases)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Brief Description
                    </label>
                    <textarea
                      value={formData.brief_description}
                      onChange={(e: any) => handleInputChange("brief_description", e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Short overview of what this experience offers"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Story
                    </label>
                    <textarea
                      value={formData.story}
                      onChange={(e: any) => handleInputChange("story", e.target.value)}
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Tell the full story of this experience"
                    />
                  </div>
                </div>
              </div>

              {/* Best Time to Visit */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Best Time to Visit
                  </h2>
                  <button
                    type="button"
                    onClick={addBestTime}
                    className="inline-flex items-center space-x-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                  >
                    <PlusIcon className="w-4 h-4" />
                    <span>Add Period</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.best_time?.map((period, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          Period {index + 1}
                        </h3>
                        {formData.best_time!.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeBestTime(index)}
                            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                          >
                            <TrashBinIcon className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            From
                          </label>
                          <select
                            value={period.from}
                            onChange={(e: any) => handleBestTimeChange(index, "from", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          >
                            <option value="">Select month</option>
                            {months.map(month => (
                              <option key={month} value={month}>{month}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            To
                          </label>
                          <select
                            value={period.to}
                            onChange={(e: any) => handleBestTimeChange(index, "to", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          >
                            <option value="">Select month</option>
                            {months.map(month => (
                              <option key={month} value={month}>{month}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
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
                    className="inline-flex items-center space-x-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                  >
                    <PlusIcon className="w-4 h-4" />
                    <span>Add Section</span>
                  </button>
                </div>

                <div className="space-y-6">
                  {formData.content?.map((section, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          Section {index + 1}
                        </h3>
                        {formData.content!.length > 1 && (
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
                            Section Title
                          </label>
                          <input
                            type="text"
                            value={section.title}
                            onChange={(e: any) => handleContentChange(index, "title", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="e.g., Activities, What's Included"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Content
                          </label>
                          <textarea
                            value={section.content}
                            onChange={(e: any) => handleContentChange(index, "content", e.target.value)}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Section content"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gallery */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Gallery
                  </h2>
                  <button
                    type="button"
                    onClick={addGalleryItem}
                    className="inline-flex items-center space-x-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                  >
                    <PlusIcon className="w-4 h-4" />
                    <span>Add Photo</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.gallery?.map((item, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          Photo {index + 1}
                        </h3>
                        {formData.gallery!.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeGalleryItem(index)}
                            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                          >
                            <TrashBinIcon className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Photo Name
                          </label>
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e: any) => handleGalleryChange(index, "name", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="e.g., Sunset View, Beach Scene"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Image URL
                          </label>
                          <input
                            type="url"
                            value={item.image}
                            onChange={(e: any) => handleGalleryChange(index, "image", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="https://example.com/photo.jpg"
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
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="https://example.com/featured.jpg"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Carousel Media URLs
                      </label>
                      <button
                        type="button"
                        onClick={addCarouselImage}
                        className="inline-flex items-center space-x-1 px-2 py-1 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
                      >
                        <PlusIcon className="w-3 h-3" />
                        <span>Add Image</span>
                      </button>
                    </div>
                    <div className="space-y-2">
                      {(formData.carousel_media || []).map((imageUrl, index) => (
                        <div key={index} className="flex space-x-2">
                          <input
                            type="url"
                            value={imageUrl}
                            onChange={(e: any) => handleCarouselMediaChange(index, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder={`https://example.com/carousel-${index + 1}.jpg`}
                          />
                          <button
                            type="button"
                            onClick={() => removeCarouselImage(index)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                            title="Remove image"
                          >
                            <TrashBinIcon className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      {(!formData.carousel_media || formData.carousel_media.length === 0) && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                          No carousel images added yet. Click "Add Image" to get started.
                        </p>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Add multiple images for the carousel display
                    </p>
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
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
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
                    <select
                      value={formData.city}
                      onChange={(e: any) => handleInputChange("city", e.target.value)}
                      disabled={!formData.country}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">{!formData.country ? "Select Country First" : "Select City"}</option>
                      {availableCities.map(city => (
                        <option key={city.value} value={city.value}>{city.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Additional Details
                </h2>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Tags
                      </label>
                      <button
                        type="button"
                        onClick={addTag}
                        className="inline-flex items-center space-x-1 px-2 py-1 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
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
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder={`Tag ${index + 1}: e.g., "adventure travel", "cultural experience"`}
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Duration (days)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={formData.duration || ""}
                        onChange={(e: any) => handleInputChange("duration", e.target.value ? parseInt(e.target.value) : undefined)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="e.g., 12"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Price (₹)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.price || ""}
                        onChange={(e: any) => handleInputChange("price", e.target.value ? parseInt(e.target.value) : undefined)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="e.g., 450000"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-lg transition-colors"
                  >
                    {loading ? "Creating..." : "Create Experience"}
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/experiences")}
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

export default CreateExperience;