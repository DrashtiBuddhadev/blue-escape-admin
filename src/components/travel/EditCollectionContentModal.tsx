import React, { useState, useEffect } from "react";
import { CollectionContent, UpdateCollectionContentRequest, Feature, Tag } from "../../api/types";
import { collectionService, tagService } from "../../api/services";
import { CloseIcon, PlusIcon, TrashBinIcon } from "../../icons";
import { getContinents, getCountriesByContinent, getAllCountriesByContinent, getCitiesByCountry, getCountryCodeByName } from "../../utils/locationUtils";

interface EditCollectionContentModalProps {
  content: CollectionContent;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedContent: CollectionContent) => void;
}

const EditCollectionContentModal: React.FC<EditCollectionContentModalProps> = ({
  content,
  isOpen,
  onClose,
  onUpdate,
}) => {
  const [formData, setFormData] = useState<UpdateCollectionContentRequest & { about_destination_description?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [continents] = useState(() => getContinents());
  const [availableCountries, setAvailableCountries] = useState<{value: string, label: string, code?: string}[]>([]);
  const [availableCities, setAvailableCities] = useState<{value: string, label: string}[]>([]);
  const [allCountriesByContinent] = useState(() => getAllCountriesByContinent());
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen && content) {
      console.log('Initializing edit modal with content:', content);
      console.log('Content features:', content.features);
      console.log('Content about_destination:', content.about_destination);

      // Safe initialization with fallbacks
      const safeFeatures = Array.isArray(content.features) && content.features.length > 0
        ? content.features.map(feature => ({
            title: feature.title || "",
            content: feature.content || "",
            images: Array.isArray(feature.images) ? feature.images : (feature.images ? [feature.images] : [""])
          }))
        : [{ title: "", content: "", images: [""] }];

      let aboutDestinationDescription = "";
      const aboutDest = content.about_destination;

      // Handle the actual backend format: {description: "content"}
      if (aboutDest && typeof aboutDest === 'object' && 'description' in aboutDest) {
        aboutDestinationDescription = aboutDest.description || "";
      } else if (Array.isArray(aboutDest) && aboutDest.length > 0) {
        // Fallback for any legacy data that might still be in array format
        aboutDestinationDescription = aboutDest.map(dest => dest.description || dest.content || "").filter(Boolean).join("\n\n");
      }

      setFormData({
        property_name: content.property_name || "",
        featured_img: content.featured_img || "",
        hero_media: content.hero_media || "",
        about_collection: content.about_collection || "",
        features: safeFeatures,
        about_destination_description: aboutDestinationDescription,
        region: content.region || "",
        country: content.country || "",
        city: content.city || "",
        active: content.active !== undefined ? content.active : true,
      });
      setSelectedTags(content.tags || []);
      setErrors({});

      console.log('Initialized formData:', {
        features: safeFeatures,
        about_destination_description: aboutDestinationDescription
      });

      // Fetch tags when modal opens
      fetchTags();
    }
  }, [isOpen, content]);

  useEffect(() => {
    // Update available countries when region filter changes
    if (formData.region) {
      const countries = getCountriesByContinent(formData.region);
      setAvailableCountries(countries);
    } else {
      // Get all countries from all continents
      const allCountries = Object.values(allCountriesByContinent)
        .flatMap(continent => continent.countries)
        .map(country => ({ value: country.name, label: country.name, code: country.isoCode }))
        .sort((a, b) => a.label.localeCompare(b.label));
      setAvailableCountries(allCountries);
    }
  }, [formData.region, allCountriesByContinent]);

  useEffect(() => {
    // Update available cities when country changes
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

  const fetchTags = async () => {
    try {
      const data = await tagService.getTags();
      setAvailableTags(data);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  const handleTagToggle = (tagName: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tagName)) {
        return prev.filter(t => t !== tagName);
      } else {
        return [...prev, tagName];
      }
    });
  };

  const handleInputChange = (field: keyof UpdateCollectionContentRequest, value: any) => {
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

  const handleFeatureChange = (index: number, field: keyof Feature, value: string) => {
    const updatedFeatures = [...(formData.features || [])];
    updatedFeatures[index] = {
      ...updatedFeatures[index],
      [field]: value
    };
    handleInputChange('features', updatedFeatures);
  };

  const handleFeatureImageChange = (featureIndex: number, imageIndex: number, value: string) => {
    try {
      const updatedFeatures = [...(formData.features || [])];
      if (!updatedFeatures[featureIndex]) {
        console.error('Feature not found at index:', featureIndex);
        return;
      }

      const currentFeature = updatedFeatures[featureIndex];
      const updatedImages = Array.isArray(currentFeature.images)
        ? [...currentFeature.images]
        : [""];

      updatedImages[imageIndex] = value;
      updatedFeatures[featureIndex] = {
        ...currentFeature,
        images: updatedImages
      };
      handleInputChange('features', updatedFeatures);
    } catch (error) {
      console.error('Error updating feature image:', error);
    }
  };

  const addFeatureImage = (featureIndex: number) => {
    try {
      const updatedFeatures = [...(formData.features || [])];
      if (!updatedFeatures[featureIndex]) {
        console.error('Feature not found at index:', featureIndex);
        return;
      }

      const currentFeature = updatedFeatures[featureIndex];
      const currentImages = Array.isArray(currentFeature.images) ? currentFeature.images : [""];

      if (currentImages.length >= 5) {
        console.warn('Maximum 5 images allowed per feature');
        return;
      }

      updatedFeatures[featureIndex] = {
        ...currentFeature,
        images: [...currentImages, ""]
      };
      handleInputChange('features', updatedFeatures);
    } catch (error) {
      console.error('Error adding feature image:', error);
    }
  };

  const removeFeatureImage = (featureIndex: number, imageIndex: number) => {
    try {
      const updatedFeatures = [...(formData.features || [])];
      if (!updatedFeatures[featureIndex]) {
        console.error('Feature not found at index:', featureIndex);
        return;
      }

      const currentFeature = updatedFeatures[featureIndex];
      const updatedImages = Array.isArray(currentFeature.images)
        ? [...currentFeature.images]
        : [""];

      if (updatedImages.length <= 1) {
        console.warn('At least one image field is required');
        return;
      }

      updatedImages.splice(imageIndex, 1);
      updatedFeatures[featureIndex] = {
        ...currentFeature,
        images: updatedImages
      };
      handleInputChange('features', updatedFeatures);
    } catch (error) {
      console.error('Error removing feature image:', error);
    }
  };

  const addFeature = () => {
    const newFeature: Feature = {
      title: "",
      content: "",
      images: [""]
    };
    handleInputChange('features', [...(formData.features || []), newFeature]);
  };

  const removeFeature = (index: number) => {
    const updatedFeatures = [...(formData.features || [])];
    updatedFeatures.splice(index, 1);
    handleInputChange('features', updatedFeatures);
  };

  const handleDestinationDescriptionChange = (value: string) => {
    handleInputChange('about_destination_description', value);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.region?.trim()) {
      newErrors.region = "Region is required";
    }

    if (!formData.country?.trim()) {
      newErrors.country = "Country is required";
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
      console.log('Updating collection content with ID:', content.id);
      console.log('Form data being sent:', JSON.stringify(formData, null, 2));

      // Create minimal update payload to avoid validation errors
      // Note: collection_id should NOT be sent in update requests as per API spec
      const minimalUpdateData: any = {};

      // TEMPORARY: Test one field at a time to isolate the validation issue
      // Since active toggle works, let's test about_destination only first

      console.log('DEBUGGING: Testing about_destination only');

      // About destination - only include if there's actual content
      if (formData.about_destination_description && formData.about_destination_description.trim() !== "") {
        minimalUpdateData.about_destination = {
          description: formData.about_destination_description.trim()
        };
        console.log('DEBUGGING: Adding about_destination:', minimalUpdateData.about_destination);
      }

      // Tags - add selected tags if any
      if (selectedTags.length > 0) {
        minimalUpdateData.tags = selectedTags;
        console.log('DEBUGGING: Adding tags:', minimalUpdateData.tags);
      }

      // If about_destination works, we'll add other fields back one by one
      // For now, commenting out other fields to isolate the issue:

      // if (formData.featured_img && formData.featured_img.trim() !== "") {
      //   minimalUpdateData.featured_img = formData.featured_img.trim();
      // }
      // if (formData.hero_media && formData.hero_media.trim() !== "") {
      //   minimalUpdateData.hero_media = formData.hero_media.trim();
      // }
      // if (formData.about_collection && formData.about_collection.trim() !== "") {
      //   minimalUpdateData.about_collection = formData.about_collection.trim();
      // }
      // if (formData.region && formData.region.trim() !== "") {
      //   minimalUpdateData.region = formData.region.trim();
      // }
      // if (formData.country && formData.country.trim() !== "") {
      //   minimalUpdateData.country = formData.country.trim();
      // }
      // if (formData.city && formData.city.trim() !== "") {
      //   minimalUpdateData.city = formData.city.trim();
      // }

      // Features - TEMPORARILY DISABLED for testing
      // if (formData.features && Array.isArray(formData.features) && formData.features.length > 0) {
      //   const cleanFeatures = formData.features
      //     .map(feature => {
      //       if (!feature || typeof feature !== 'object') return null;
      //       const cleanImages = Array.isArray(feature.images)
      //         ? feature.images.filter(img => img && typeof img === 'string' && img.trim() !== "")
      //         : [];
      //       const title = (feature.title || "").trim();
      //       const content = (feature.content || "").trim();
      //       if (title || content) {
      //         return { title, content, images: cleanImages };
      //       }
      //       return null;
      //     })
      //     .filter(Boolean);
      //   if (cleanFeatures.length > 0) {
      //     console.log('Sending clean features:', JSON.stringify(cleanFeatures, null, 2));
      //     minimalUpdateData.features = cleanFeatures;
      //   }
      // }

      console.log('Final PATCH payload:', JSON.stringify(minimalUpdateData, null, 2));
      console.log('Update URL will be:', `/collections/content/${content.id}`);
      console.log('Full API URL will be:', `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1'}/collections/content/${content.id}`);

      const updatedContent = await collectionService.updateCollectionContent(content.id, minimalUpdateData);
      console.log('Update response:', updatedContent);
      onUpdate(updatedContent);
      onClose();
    } catch (error: any) {
      console.error('Error updating collection content:', error);
      console.error('Error response data:', error?.data);
      console.error('Error status:', error?.status);

      let errorMessage = error?.message || 'Failed to update collection content. Please try again.';
      if (error?.data?.message) {
        if (Array.isArray(error.data.message)) {
          console.error('Validation errors:', error.data.message);
          errorMessage = `Validation errors:\n${error.data.message.join('\n')}`;
        } else {
          console.error('Error message:', error.data.message);
          errorMessage = `Error: ${error.data.message}`;
        }
      } else if (error?.response?.data?.message) {
        if (Array.isArray(error.response.data.message)) {
          console.error('Validation errors:', error.response.data.message);
          errorMessage = `Validation errors:\n${error.response.data.message.join('\n')}`;
        } else {
          console.error('Error message:', error.response.data.message);
          errorMessage = `Error: ${error.response.data.message}`;
        }
      }

      setErrors({ submit: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    console.log('EditCollectionContentModal: isOpen is false, not rendering');
    return null;
  }

  console.log('EditCollectionContentModal: Rendering modal with content:', content?.id);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-[100000] p-4 pt-8 pb-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col my-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Edit Location Content
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content - Scrollable */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Error Display */}
            {errors.submit && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-600 dark:text-red-400 text-sm whitespace-pre-line">{errors.submit}</p>
              </div>
            )}

            {/* Status Toggle */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <label className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Status:</span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={formData.active || false}
                    onChange={(e) => handleInputChange('active', e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    onClick={() => handleInputChange('active', !formData.active)}
                    className={`w-11 h-6 rounded-full transition-colors cursor-pointer ${
                      formData.active ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full transition-transform transform ${
                        formData.active ? 'translate-x-6' : 'translate-x-1'
                      } mt-1`}
                    />
                  </div>
                </div>
                <span className={`text-sm font-medium ${
                  formData.active ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {formData.active ? 'Active' : 'Inactive'}
                </span>
              </label>
            </div>

            {/* Property Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Property Name
              </label>
              <input
                type="text"
                value={formData.property_name || ""}
                onChange={(e) => handleInputChange('property_name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., Amankora, Amanzoe, Amanruya"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Specific property name under this collection (optional)
              </p>
            </div>

            {/* Featured Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Featured Image URL
              </label>
              <input
                type="url"
                value={formData.featured_img || ""}
                onChange={(e) => handleInputChange('featured_img', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter featured image URL (for card display)"
              />
            </div>

            {/* Hero Media */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Hero Media URL
              </label>
              <input
                type="url"
                value={formData.hero_media || ""}
                onChange={(e) => handleInputChange('hero_media', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter hero media URL (for detail view)"
              />
            </div>

            {/* About Collection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                About Collection
              </label>
              <textarea
                value={formData.about_collection || ""}
                onChange={(e) => handleInputChange('about_collection', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Describe this collection and what makes it special"
              />
            </div>

            {/* Location Selection */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Location</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Region */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Region *
                  </label>
                  <select
                    value={formData.region || ""}
                    onChange={(e) => handleInputChange('region', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.region ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <option value="">Select Region</option>
                    {continents.map((continent) => (
                      <option key={continent.value} value={continent.value}>
                        {continent.label}
                      </option>
                    ))}
                  </select>
                  {errors.region && <p className="text-red-500 text-xs mt-1">{errors.region}</p>}
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Country *
                  </label>
                  <select
                    value={formData.country || ""}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    disabled={!formData.region}
                    className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.country ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } ${!formData.region ? 'opacity-50' : ''}`}
                  >
                    <option value="">Select Country</option>
                    {availableCountries.map((country) => (
                      <option key={country.value} value={country.value}>
                        {country.label}
                      </option>
                    ))}
                  </select>
                  {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    City
                  </label>
                  <select
                    value={formData.city || ""}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    disabled={!formData.country}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">{!formData.country ? "Select Country First" : "Select City"}</option>
                    {availableCities.map(city => (
                      <option key={city.value} value={city.value}>{city.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Tags Section */}
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tags</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Select Tags (Multiple)
                </label>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {availableTags.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                      No tags available. Create tags first from the Tags page.
                    </p>
                  ) : (
                    availableTags.map(tag => (
                      <label
                        key={tag.id}
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedTags.includes(tag.name)}
                          onChange={() => handleTagToggle(tag.name)}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {tag.name}
                        </span>
                      </label>
                    ))
                  )}
                </div>

                {/* Selected Tags Preview */}
                {selectedTags.length > 0 && (
                  <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/40 rounded-lg border border-green-200 dark:border-green-800">
                    <h4 className="text-sm font-medium text-green-900 dark:text-green-100 mb-2">
                      Selected Tags ({selectedTags.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTags.map(tagName => (
                        <span
                          key={tagName}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-200 dark:bg-green-900/60 text-green-800 dark:text-green-200"
                        >
                          {tagName}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Features Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Features</h3>
                <button
                  type="button"
                  onClick={addFeature}
                  className="inline-flex items-center space-x-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>Add Feature</span>
                </button>
              </div>

              {formData.features?.map((feature, index) => {
                // Safety check for feature structure
                if (!feature || typeof feature !== 'object') {
                  console.warn(`Invalid feature at index ${index}:`, feature);
                  return null;
                }

                return (
                  <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900 dark:text-white">Feature {index + 1}</h4>
                      {(formData.features?.length || 0) > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <TrashBinIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Feature Title
                    </label>
                    <input
                      type="text"
                      value={feature.title}
                      onChange={(e) => handleFeatureChange(index, "title", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., Beautiful Beaches, Rich Culture"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Feature Content
                    </label>
                    <textarea
                      value={feature.content}
                      onChange={(e) => handleFeatureChange(index, "content", e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Describe this feature in detail"
                    />
                  </div>

                  {/* Feature Images */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Feature Images ({feature.images?.length || 0}/5)
                      </label>
                      {(feature.images?.length || 0) < 5 && (
                        <button
                          type="button"
                          onClick={() => addFeatureImage(index)}
                          className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 text-sm font-medium flex items-center space-x-1"
                        >
                          <PlusIcon className="w-4 h-4" />
                          <span>Add Image</span>
                        </button>
                      )}
                    </div>
                    <div className="space-y-2">
                      {Array.isArray(feature.images) ? feature.images.map((imageUrl, imgIndex) => (
                        <div key={imgIndex} className="flex items-center space-x-2">
                          <input
                            type="url"
                            value={imageUrl || ""}
                            onChange={(e) => handleFeatureImageChange(index, imgIndex, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder={`Feature image URL ${imgIndex + 1}`}
                          />
                          {(feature.images?.length || 0) > 1 && (
                            <button
                              type="button"
                              onClick={() => removeFeatureImage(index, imgIndex)}
                              className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 rounded-lg transition-colors"
                            >
                              <TrashBinIcon className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      )) : (
                        <div className="text-gray-500 text-sm">No images available</div>
                      )}
                    </div>
                  </div>
                </div>
                );
              })}
            </div>

            {/* About Destination Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">About Destination</h3>

              <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-purple-50/50 dark:bg-purple-900/10">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Destination Description
                </label>
                <textarea
                  value={formData.about_destination_description || ""}
                  onChange={(e) => handleDestinationDescriptionChange(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Describe this destination, its culture, attractions, and what makes it special..."
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Provide a comprehensive description of the destination that will help users understand what makes this location unique.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors mr-3"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              {isSubmitting ? 'Updating...' : 'Update Content'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCollectionContentModal;
