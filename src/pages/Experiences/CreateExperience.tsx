import { useState } from "react";
import { useNavigate } from "react-router";
import { CreateExperienceRequest, BestTime, ExperienceContent, GalleryItem } from "../../api/types";
import { experienceService } from "../../api/services";
import PageMeta from "../../components/common/PageMeta";
import { PlusIcon, TrashBinIcon, ChevronLeftIcon } from "../../icons";

const CreateExperience: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateExperienceRequest>({
    title: "",
    featured_media: "",
    excerpt: "",
    country: "",
    city: "",
    region: "",
    best_time: [{ from: "", to: "" }],
    carousel_images: ["", "", ""], // Initialize with 3 empty images
    brief_description: "",
    content: [{ title: "", content: "" }],
    tagline: {},
    gallery: [{ name: "", image: "" }],
    story: "",
  });

  const regions = ["Asia", "Europe", "Americas", "Africa", "Oceania"];
  const countries = ["Thailand", "Japan", "France", "Italy", "USA", "Australia"];
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handleInputChange = (field: keyof CreateExperienceRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

  const handleCarouselImageChange = (index: number, value: string) => {
    const newCarouselImages = [...formData.carousel_images!];
    newCarouselImages[index] = value;
    setFormData(prev => ({ ...prev, carousel_images: newCarouselImages }));
  };

  const addCarouselImage = () => {
    if (formData.carousel_images!.length < 8) {
      setFormData(prev => ({
        ...prev,
        carousel_images: [...prev.carousel_images!, ""]
      }));
    }
  };

  const removeCarouselImage = (index: number) => {
    if (formData.carousel_images!.length > 3) {
      const newCarouselImages = formData.carousel_images!.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, carousel_images: newCarouselImages }));
    }
  };

  const handleTaglineChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      tagline: { ...prev.tagline, [key]: value }
    }));
  };

  const addTagline = () => {
    const key = `tagline_${Object.keys(formData.tagline || {}).length + 1}`;
    handleTaglineChange(key, "");
  };

  const removeTagline = (key: string) => {
    const newTagline = { ...formData.tagline };
    delete newTagline[key];
    setFormData(prev => ({ ...prev, tagline: newTagline }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      alert("Please enter a title");
      return;
    }

    setLoading(true);
    try {
      const experience = await experienceService.createExperience(formData);
      navigate(`/experiences/${experience.id}`);
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
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="e.g., Island Hopping in Phi Phi"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Excerpt
                    </label>
                    <textarea
                      value={formData.excerpt}
                      onChange={(e) => handleInputChange("excerpt", e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Brief description of the experience"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Brief Description
                    </label>
                    <textarea
                      value={formData.brief_description}
                      onChange={(e) => handleInputChange("brief_description", e.target.value)}
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
                      onChange={(e) => handleInputChange("story", e.target.value)}
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
                            onChange={(e) => handleBestTimeChange(index, "from", e.target.value)}
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
                            onChange={(e) => handleBestTimeChange(index, "to", e.target.value)}
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
                            onChange={(e) => handleContentChange(index, "title", e.target.value)}
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
                            onChange={(e) => handleContentChange(index, "content", e.target.value)}
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
                            onChange={(e) => handleGalleryChange(index, "name", e.target.value)}
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
                            onChange={(e) => handleGalleryChange(index, "image", e.target.value)}
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
                      onChange={(e) => handleInputChange("featured_media", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="https://example.com/featured.jpg"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Carousel Images (3-8 images)
                      </label>
                      {formData.carousel_images!.length < 8 && (
                        <button
                          type="button"
                          onClick={addCarouselImage}
                          className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                        >
                          + Add Image
                        </button>
                      )}
                    </div>
                    <div className="space-y-3">
                      {formData.carousel_images?.map((imageUrl, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="url"
                            value={imageUrl}
                            onChange={(e) => handleCarouselImageChange(index, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder={`Carousel image ${index + 1} URL`}
                          />
                          {formData.carousel_images!.length > 3 && (
                            <button
                              type="button"
                              onClick={() => removeCarouselImage(index)}
                              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                            >
                              <TrashBinIcon className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Add 3-8 images for the carousel display
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
                      onChange={(e) => handleInputChange("region", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Select Region</option>
                      {regions.map(region => (
                        <option key={region} value={region}>{region}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Country
                    </label>
                    <select
                      value={formData.country}
                      onChange={(e) => handleInputChange("country", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Select Country</option>
                      {countries.map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter city name"
                    />
                  </div>
                </div>
              </div>

              {/* Taglines */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Taglines
                  </h2>
                  <button
                    type="button"
                    onClick={addTagline}
                    className="inline-flex items-center space-x-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm"
                  >
                    <PlusIcon className="w-4 h-4" />
                    <span>Add Tagline</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {Object.entries(formData.tagline || {}).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={value as string}
                        onChange={(e) => handleTaglineChange(key, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter tagline"
                      />
                      <button
                        type="button"
                        onClick={() => removeTagline(key)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                      >
                        <TrashBinIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {Object.keys(formData.tagline || {}).length === 0 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                      No taglines added yet. Click "Add Tagline" to add one.
                    </p>
                  )}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Add catchy taglines to highlight the experience
                </p>
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