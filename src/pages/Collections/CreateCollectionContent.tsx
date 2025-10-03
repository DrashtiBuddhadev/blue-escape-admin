import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { CreateCollectionContentRequest, Collection, Feature, Tag } from "../../api/types";
import { collectionService, tagService } from "../../api/services";
import PageMeta from "../../components/common/PageMeta";
import { PlusIcon, TrashBinIcon, ChevronLeftIcon } from "../../icons";
import { getContinents, getCountriesByContinent, getCitiesByCountry, getCountryCodeByName } from "../../utils/locationUtils";

const CreateCollectionContent: React.FC = () => {
  const navigate = useNavigate();
  const { collectionId } = useParams<{ collectionId: string }>();
  const [loading, setLoading] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [formData, setFormData] = useState<CreateCollectionContentRequest & { about_destination_description?: string }>({
    collection_id: collectionId || "",
    property_name: "",
    featured_img: "",
    hero_media: "",
    about_collection: "",
    features: [{ title: "", content: "", images: { media: [""] } }],
    about_destination_description: "",
    region: "",
    country: "",
    city: "",
    active: true,
  });

  const [continents] = useState(() => getContinents());
  const [availableCountries, setAvailableCountries] = useState<{value: string, label: string, code?: string}[]>([]);
  const [availableCities, setAvailableCities] = useState<{value: string, label: string}[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    fetchCollections();
    fetchTags();
  }, []);

  useEffect(() => {
    // Update available countries when region changes
    if (formData.region) {
      const countries = getCountriesByContinent(formData.region);
      setAvailableCountries(countries);
      // Reset country and city if current country is not in new region
      const countryNames = countries.map(c => c.value);
      if (!countryNames.includes(formData.country || "")) {
        setFormData(prev => ({ ...prev, country: "", city: "" }));
        setAvailableCities([]);
      }
    } else {
      setAvailableCountries([]);
      setAvailableCities([]);
    }
  }, [formData.region]);

  useEffect(() => {
    // Update available cities when country changes
    if (formData.country) {
      const countryCode = getCountryCodeByName(formData.country);
      if (countryCode) {
        const cities = getCitiesByCountry(countryCode);
        setAvailableCities(cities);
        // Reset city if current city is not in new country
        const cityNames = cities.map(c => c.value);
        if (!cityNames.includes(formData.city || "")) {
          setFormData(prev => ({ ...prev, city: "" }));
        }
      }
    } else {
      setAvailableCities([]);
    }
  }, [formData.country, formData.region]);

  useEffect(() => {
    if (collectionId) {
      setFormData(prev => ({ ...prev, collection_id: collectionId }));
      const collection = collections.find(c => c.id === collectionId);
      setSelectedCollection(collection || null);
    }
  }, [collectionId, collections]);

  const fetchCollections = async () => {
    try {
      const data = await collectionService.getCollections();
      setCollections(data);
    } catch (error) {
      console.error("Error fetching collections:", error);
    }
  };

  const fetchTags = async () => {
    try {
      const data = await tagService.getTags();
      setAvailableTags(data);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  const handleInputChange = (field: keyof CreateCollectionContentRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFeatureChange = (index: number, field: keyof Feature, value: any) => {
    const newFeatures = [...formData.features!];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const handleFeatureImageChange = (featureIndex: number, imageIndex: number, value: string) => {
    const newFeatures = [...formData.features!];
    const newImages = [...(newFeatures[featureIndex].images?.media || [])];
    newImages[imageIndex] = value;
    newFeatures[featureIndex] = {
      ...newFeatures[featureIndex],
      images: { media: newImages }
    };
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const addFeatureImage = (featureIndex: number) => {
    const newFeatures = [...formData.features!];
    newFeatures[featureIndex] = {
      ...newFeatures[featureIndex],
      images: { media: [...(newFeatures[featureIndex].images?.media || []), ""] }
    };
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const removeFeatureImage = (featureIndex: number, imageIndex: number) => {
    const newFeatures = [...formData.features!];
    const newImages = [...(newFeatures[featureIndex].images?.media || [])];
    newImages.splice(imageIndex, 1);
    newFeatures[featureIndex] = {
      ...newFeatures[featureIndex],
      images: { media: newImages }
    };
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...(prev.features || []), { title: "", content: "", images: { media: [""] } }]
    }));
  };

  const removeFeature = (index: number) => {
    if (formData.features!.length > 1) {
      const newFeatures = formData.features!.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, features: newFeatures }));
    }
  };

  const handleAboutDestinationChange = (value: string) => {
    setFormData(prev => ({ ...prev, about_destination_description: value }));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.collection_id) {
      alert("Please select a collection");
      return;
    }

    setLoading(true);
    try {
      // Transform the data to match backend format
      const submitData: CreateCollectionContentRequest = {
        collection_id: formData.collection_id,
        property_name: formData.property_name,
        featured_img: formData.featured_img,
        hero_media: formData.hero_media,
        about_collection: formData.about_collection,
        features: formData.features,
        about_destination: formData.about_destination_description
          ? {
              description: formData.about_destination_description
            }
          : undefined,
        region: formData.region,
        country: formData.country,
        city: formData.city,
        tags: selectedTags.length > 0 ? selectedTags : undefined,
        active: formData.active,
      };

      await collectionService.createCollectionContent(submitData);
      navigate(`/collections/${formData.collection_id}`);
    } catch (error) {
      console.error("Error creating collection content:", error);
      alert("Failed to create collection content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageMeta
        title="Create Collection Content | Blue Escape Travel Admin"
        description="Add content to a travel destination collection"
      />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/collections")}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Create Collection Content
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Add destinations and features to a collection
                {selectedCollection && ` - ${selectedCollection.name}`}
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
                      Collection *
                    </label>
                    <select
                      value={formData.collection_id}
                      onChange={(e) => {
                        handleInputChange("collection_id", e.target.value);
                        const collection = collections.find(c => c.id === e.target.value);
                        setSelectedCollection(collection || null);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                      disabled={!!collectionId}
                    >
                      <option value="">Select a collection</option>
                      {collections.map(collection => (
                        <option key={collection.id} value={collection.id}>
                          {collection.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Property Name
                    </label>
                    <input
                      type="text"
                      value={formData.property_name}
                      onChange={(e) => handleInputChange("property_name", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., Amankora, Amanzoe, Amanruya"
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Specific property name under this collection (optional)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      About Collection
                    </label>
                    <textarea
                      value={formData.about_collection}
                      onChange={(e) => handleInputChange("about_collection", e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Describe this collection and what makes it special"
                    />
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Features
                  </h2>
                  <button
                    type="button"
                    onClick={addFeature}
                    className="inline-flex items-center space-x-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    <PlusIcon className="w-4 h-4" />
                    <span>Add Feature</span>
                  </button>
                </div>

                <div className="space-y-6">
                  {formData.features?.map((feature, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          Feature {index + 1}
                        </h3>
                        {formData.features!.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeFeature(index)}
                            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                          >
                            <TrashBinIcon className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="space-y-4">
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

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Feature Images (1-5 images)
                            </label>
                            {feature.images.media.length < 5 && (
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
                          <div className="space-y-3">
                            {feature.images.media.map((imageUrl, imgIndex) => (
                              <div key={imgIndex} className="flex items-center space-x-2">
                                <input
                                  type="url"
                                  value={imageUrl}
                                  onChange={(e) => handleFeatureImageChange(index, imgIndex, e.target.value)}
                                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                  placeholder={`Feature image URL ${imgIndex + 1}`}
                                />
                                {feature.images.media.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeFeatureImage(index, imgIndex)}
                                    className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                  >
                                    <TrashBinIcon className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Add 1-5 images to showcase this feature
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* About Destination */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  About Destination
                </h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Destination Description
                  </label>
                  <textarea
                    value={formData.about_destination_description || ""}
                    onChange={(e) => handleAboutDestinationChange(e.target.value)}
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
                      value={formData.featured_img}
                      onChange={(e) => handleInputChange("featured_img", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="https://example.com/featured.jpg"
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Featured image for card display
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Hero Image URL
                    </label>
                    <input
                      type="url"
                      value={formData.hero_media}
                      onChange={(e) => handleInputChange("hero_media", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="https://example.com/hero.jpg"
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Main hero image for the collection content
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
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                      onChange={(e) => handleInputChange("country", e.target.value)}
                      disabled={!formData.region}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">
                        {!formData.region ? "Select Region First" : "Select Country"}
                      </option>
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
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      disabled={!formData.country}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">
                        {!formData.country ? "Select Country First" : "Select City"}
                      </option>
                      {availableCities.map(city => (
                        <option key={city.value} value={city.value}>{city.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Location Preview */}
                  {(formData.region || formData.country || formData.city) && (
                    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                        Location Preview
                      </h3>
                      <div className="text-sm text-blue-700 dark:text-blue-300">
                        <span className="font-semibold">{selectedCollection?.name || 'Collection'}</span>
                        {formData.city && <span>, {formData.city}</span>}
                        {formData.country && <span>, {formData.country}</span>}
                        {formData.region && !formData.country && <span>, {formData.region}</span>}
                      </div>
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                        This will be the location identifier for your collection content
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Tags
                </h2>

                <div className="space-y-4">
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
                  </div>

                  {/* Selected Tags Preview */}
                  {selectedTags.length > 0 && (
                    <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <h3 className="text-sm font-medium text-green-900 dark:text-green-100 mb-2">
                        Selected Tags ({selectedTags.length})
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedTags.map(tagName => (
                          <span
                            key={tagName}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200"
                          >
                            {tagName}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                        Will be sent as: {JSON.stringify(selectedTags)}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Status */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Status
                </h2>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="active"
                    checked={formData.active}
                    onChange={(e) => handleInputChange("active", e.target.checked)}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor="active" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Active (visible to users)
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg transition-colors"
                  >
                    {loading ? "Creating..." : "Create Content"}
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/collections")}
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

export default CreateCollectionContent;