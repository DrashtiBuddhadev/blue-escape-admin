import React, { useState, useEffect } from "react";
import { Experience, UpdateExperienceRequest, BestTime, ExperienceContent, GalleryItem } from "../../api/types";
import { experienceService } from "../../api/services";
import { CloseIcon, PlusIcon, TrashBinIcon } from "../../icons";
import { getContinents, getCountriesByContinent, getCitiesByCountry, getCountryCodeByName } from "../../utils/locationUtils";

interface EditExperienceModalProps {
  experience: Experience;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedExperience: Experience) => void;
}

const EditExperienceModal: React.FC<EditExperienceModalProps> = ({
  experience,
  isOpen,
  onClose,
  onUpdate,
}) => {
  const [formData, setFormData] = useState<UpdateExperienceRequest>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [continents] = useState(() => getContinents());
  const [availableCountries, setAvailableCountries] = useState<{value: string, label: string, code?: string}[]>([]);
  const [availableCities, setAvailableCities] = useState<{value: string, label: string}[]>([]);

  useEffect(() => {
    if (isOpen && experience) {
      setFormData({
        title: experience.title,
        featured_media: experience.featured_media || "",
        taglines: experience.taglines || [""],
        country: experience.country || "",
        city: experience.city || "",
        region: experience.region || "",
        best_time: experience.best_time || [],
        carousel_media: experience.carousel_media || [],
        duration: experience.duration || undefined,
        price: experience.price || undefined,
        brief_description: experience.brief_description || "",
        content: experience.content || [],
        gallery: experience.gallery || [],
        story: experience.story || "",
        tags: experience.tags || [],
        active: experience.active,
      });
      setErrors({});
    }
  }, [isOpen, experience]);

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

  const handleInputChange = (field: keyof UpdateExperienceRequest, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (field === 'region') {
      setFormData(prev => ({ ...prev, country: '', city: '' }));
    } else if (field === 'country') {
      setFormData(prev => ({ ...prev, city: '' }));
    }

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const handleBestTimeChange = (index: number, field: keyof BestTime, value: string) => {
    const updatedBestTime = [...(formData.best_time || [])];
    updatedBestTime[index] = {
      ...updatedBestTime[index],
      [field]: value
    };
    handleInputChange('best_time', updatedBestTime);
  };

  const addBestTime = () => {
    const newBestTime: BestTime = { from: "", to: "" };
    handleInputChange('best_time', [...(formData.best_time || []), newBestTime]);
  };

  const removeBestTime = (index: number) => {
    const updatedBestTime = (formData.best_time || []).filter((_, i) => i !== index);
    handleInputChange('best_time', updatedBestTime);
  };

  const handleContentChange = (index: number, field: keyof ExperienceContent, value: string) => {
    const updatedContent = [...(formData.content || [])];
    updatedContent[index] = {
      ...updatedContent[index],
      [field]: value
    };
    handleInputChange('content', updatedContent);
  };

  const addContent = () => {
    const newContent: ExperienceContent = { title: "", content: "" };
    handleInputChange('content', [...(formData.content || []), newContent]);
  };

  const removeContent = (index: number) => {
    const updatedContent = (formData.content || []).filter((_, i) => i !== index);
    handleInputChange('content', updatedContent);
  };

  const handleGalleryChange = (index: number, field: keyof GalleryItem, value: string) => {
    const updatedGallery = [...(formData.gallery || [])];
    updatedGallery[index] = {
      ...updatedGallery[index],
      [field]: value
    };
    handleInputChange('gallery', updatedGallery);
  };

  const addGalleryItem = () => {
    const newGalleryItem: GalleryItem = { name: "", image: "" };
    handleInputChange('gallery', [...(formData.gallery || []), newGalleryItem]);
  };

  const removeGalleryItem = (index: number) => {
    const updatedGallery = (formData.gallery || []).filter((_, i) => i !== index);
    handleInputChange('gallery', updatedGallery);
  };

  const handleTagChange = (index: number, value: string) => {
    const updatedTags = [...(formData.tags || [])];
    updatedTags[index] = value;
    handleInputChange('tags', updatedTags);
  };

  const addTag = () => {
    handleInputChange('tags', [...(formData.tags || []), ""]);
  };

  const removeTag = (index: number) => {
    const updatedTags = (formData.tags || []).filter((_, i) => i !== index);
    handleInputChange('tags', updatedTags);
  };

  const handleTaglineChange = (index: number, value: string) => {
    const updatedTaglines = [...(formData.taglines || [])];
    updatedTaglines[index] = value;
    handleInputChange('taglines', updatedTaglines);
  };

  const addTagline = () => {
    handleInputChange('taglines', [...(formData.taglines || []), ""]);
  };

  const removeTagline = (index: number) => {
    const updatedTaglines = (formData.taglines || []).filter((_, i) => i !== index);
    handleInputChange('taglines', updatedTaglines.length > 0 ? updatedTaglines : [""]);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      newErrors.title = "Title is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Updating experience with ID:', experience.id);
      console.log('Form data being sent:', JSON.stringify(formData, null, 2));

      // Create minimal update payload to avoid backend validation issues
      const minimalUpdateData: any = {};

      // Only include fields that are explicitly allowed by backend
      if (formData.title) minimalUpdateData.title = formData.title;
      if (formData.featured_media) minimalUpdateData.featured_media = formData.featured_media;
      if (formData.country) minimalUpdateData.country = formData.country;
      if (formData.city) minimalUpdateData.city = formData.city;
      if (formData.region) minimalUpdateData.region = formData.region;
      if (formData.brief_description) minimalUpdateData.brief_description = formData.brief_description;
      if (formData.story) minimalUpdateData.story = formData.story;
      if (formData.active !== undefined) minimalUpdateData.active = formData.active;

      // Handle taglines array
      if (formData.taglines && formData.taglines.length > 0) {
        minimalUpdateData.taglines = formData.taglines.filter(tagline => tagline.trim());
      }

      // Handle arrays - only include if they have valid content
      if (formData.best_time && formData.best_time.length > 0) {
        minimalUpdateData.best_time = formData.best_time.filter(time => time.from && time.to);
      }

      if (formData.carousel_media && formData.carousel_media.length > 0) {
        minimalUpdateData.carousel_media = formData.carousel_media.filter(url => url.trim());
      }

      if (formData.content && formData.content.length > 0) {
        minimalUpdateData.content = formData.content.filter(c => c.title && c.content);
      }

      if (formData.gallery && formData.gallery.length > 0) {
        minimalUpdateData.gallery = formData.gallery.filter(g => g.name && g.image);
      }

      if (formData.tags && formData.tags.length > 0) {
        minimalUpdateData.tags = formData.tags.filter(tag => tag.trim());
      }

      if (formData.duration && formData.duration > 0) {
        minimalUpdateData.duration = formData.duration;
      }

      if (formData.price && formData.price > 0) {
        minimalUpdateData.price = formData.price;
      }

      console.log('Minimal update data being sent:', JSON.stringify(minimalUpdateData, null, 2));

      const updatedExperience = await experienceService.updateExperience(experience.id, minimalUpdateData);
      onUpdate(updatedExperience);
      onClose();
    } catch (error: any) {
      console.error('Error updating experience:', error);
      console.error('Error response data:', error?.data);
      console.error('Error status:', error?.status);

      // Extract validation errors if they exist
      let errorMessage = error?.message || 'Failed to update experience. Please try again.';
      if (error?.data?.message && Array.isArray(error.data.message)) {
        console.error('Validation errors:', error.data.message);
        errorMessage = `Validation errors:\n${error.data.message.join('\n')}`;
      }

      setErrors({ submit: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-[100000] p-4 pt-16 pb-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col my-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Edit Experience
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Error Display */}
          {errors.submit && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-600 dark:text-red-400 text-sm">{errors.submit}</p>
            </div>
          )}

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Basic Information</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title || ""}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                  errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Enter experience title"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Featured Media URL
              </label>
              <input
                type="url"
                value={formData.featured_media || ""}
                onChange={(e) => handleInputChange('featured_media', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter featured image URL"
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
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>Add Tagline</span>
                </button>
              </div>
              <div className="space-y-2">
                {(formData.taglines || []).map((tagline, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={tagline}
                      onChange={(e) => handleTaglineChange(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder={`Tagline ${index + 1}: e.g., "Adventure awaits", "Explore culture"`}
                    />
                    <button
                      type="button"
                      onClick={() => removeTagline(index)}
                      className="p-2 text-red-600 hover:text-red-700"
                    >
                      <TrashBinIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {(!formData.taglines || formData.taglines.length === 0) && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">No taglines added yet.</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Brief Description
              </label>
              <textarea
                value={formData.brief_description || ""}
                onChange={(e) => handleInputChange('brief_description', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Short summary of the experience"
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Location</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Region
                </label>
                <select
                  value={formData.region || ""}
                  onChange={(e) => handleInputChange('region', e.target.value)}
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
                  value={formData.country || ""}
                  onChange={(e) => handleInputChange('country', e.target.value)}
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
                  value={formData.city || ""}
                  onChange={(e) => handleInputChange('city', e.target.value)}
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

          {/* Best Time */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Best Time to Visit</h3>
              <button
                type="button"
                onClick={addBestTime}
                className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
              >
                <PlusIcon className="w-4 h-4" />
                <span>Add Time Range</span>
              </button>
            </div>

            {(formData.best_time || []).map((timeRange, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={timeRange.from}
                    onChange={(e) => handleBestTimeChange(index, 'from', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="From (e.g., March)"
                  />
                </div>
                <span className="text-gray-500">to</span>
                <div className="flex-1">
                  <input
                    type="text"
                    value={timeRange.to}
                    onChange={(e) => handleBestTimeChange(index, 'to', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="To (e.g., May)"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeBestTime(index)}
                  className="p-2 text-red-600 hover:text-red-700"
                >
                  <TrashBinIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Media */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Media</h3>

            {/* Carousel Media */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Carousel Media URLs
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const newCarouselMedia = [...(formData.carousel_media || []), ""];
                    handleInputChange('carousel_media', newCarouselMedia);
                  }}
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>Add Image URL</span>
                </button>
              </div>

              {(formData.carousel_media || []).map((imageUrl, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="flex-1">
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => {
                        const updatedCarouselMedia = [...(formData.carousel_media || [])];
                        updatedCarouselMedia[index] = e.target.value;
                        handleInputChange('carousel_media', updatedCarouselMedia);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Enter carousel image URL"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const updatedCarouselMedia = (formData.carousel_media || []).filter((_, i) => i !== index);
                      handleInputChange('carousel_media', updatedCarouselMedia);
                    }}
                    className="p-2 text-red-600 hover:text-red-700"
                  >
                    <TrashBinIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {(!formData.carousel_media || formData.carousel_media.length === 0) && (
                <p className="text-sm text-gray-500 dark:text-gray-400">No carousel images added yet.</p>
              )}
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Content Sections</h3>
              <button
                type="button"
                onClick={addContent}
                className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
              >
                <PlusIcon className="w-4 h-4" />
                <span>Add Section</span>
              </button>
            </div>

            {(formData.content || []).map((section, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white">Section {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeContent(index)}
                    className="p-1 text-red-600 hover:text-red-700"
                  >
                    <TrashBinIcon className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={section.title}
                    onChange={(e) => handleContentChange(index, 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Section title"
                  />
                  <textarea
                    value={section.content}
                    onChange={(e) => handleContentChange(index, 'content', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Section content"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Gallery */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Gallery</h3>
              <button
                type="button"
                onClick={addGalleryItem}
                className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
              >
                <PlusIcon className="w-4 h-4" />
                <span>Add Image</span>
              </button>
            </div>

            {(formData.gallery || []).map((item, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleGalleryChange(index, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Image name"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="url"
                    value={item.image}
                    onChange={(e) => handleGalleryChange(index, 'image', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Image URL"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeGalleryItem(index)}
                  className="p-2 text-red-600 hover:text-red-700"
                >
                  <TrashBinIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Story */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Story</h3>
            <textarea
              value={formData.story || ""}
              onChange={(e) => handleInputChange('story', e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Tell the story of this experience..."
            />
          </div>

          {/* Tags */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Tags</h3>
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
                    onChange={(e) => handleTagChange(index, e.target.value)}
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
          </div>

          {/* Duration and Price */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Pricing & Duration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Duration (days)
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.duration || ""}
                  onChange={(e) => handleInputChange('duration', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g., 3"
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
                  onChange={(e) => handleInputChange('price', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g., 24999"
                />
              </div>
            </div>
          </div>

          {/* Active Status */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Publication Status</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Control whether this experience is visible to users</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={formData.active || false}
                  onChange={(e) => handleInputChange('active', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                  {formData.active ? 'Active' : 'Inactive'}
                </span>
              </label>
            </div>
          </div>
        </form>

        {/* Footer */}
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
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Updating...' : 'Update Experience'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditExperienceModal;