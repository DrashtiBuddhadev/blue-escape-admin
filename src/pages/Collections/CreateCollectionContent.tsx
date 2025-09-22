import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { CreateCollectionContentRequest, Collection, Feature, AboutDestination } from "../../api/types";
import { collectionService } from "../../api/services";
import PageMeta from "../../components/common/PageMeta";
import { PlusIcon, TrashBinIcon, ChevronLeftIcon } from "../../icons";

const CreateCollectionContent: React.FC = () => {
  const navigate = useNavigate();
  const { collectionId } = useParams<{ collectionId: string }>();
  const [loading, setLoading] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [formData, setFormData] = useState<CreateCollectionContentRequest>({
    collection_id: collectionId || "",
    hero_media: "",
    about_collection: "",
    features: [{ title: "", content: "", images: ["", ""] }],
    about_destination: [{ title: "", content: "" }],
    region: "",
    country: "",
    city: "",
    active: true,
  });

  const regions = ["Asia", "Europe", "Americas", "Africa", "Oceania"];

  const locationData = {
    Asia: {
      countries: {
        Thailand: ["Bangkok", "Phuket", "Chiang Mai", "Koh Samui", "Pattaya"],
        Japan: ["Tokyo", "Kyoto", "Osaka", "Hiroshima", "Nara"],
        Malaysia: ["Kuala Lumpur", "Penang", "Langkawi", "Malacca"],
        Singapore: ["Singapore"],
        India: ["Mumbai", "Delhi", "Goa", "Jaipur", "Udaipur", "Kerala"],
        Indonesia: ["Bali", "Jakarta", "Yogyakarta", "Lombok"]
      }
    },
    Europe: {
      countries: {
        France: ["Paris", "Nice", "Lyon", "Marseille", "Cannes"],
        Italy: ["Rome", "Florence", "Venice", "Milan", "Naples"],
        Spain: ["Madrid", "Barcelona", "Seville", "Valencia"],
        Germany: ["Berlin", "Munich", "Frankfurt", "Hamburg"],
        Netherlands: ["Amsterdam", "Rotterdam", "The Hague"],
        "United Kingdom": ["London", "Edinburgh", "Manchester", "Liverpool"]
      }
    },
    Americas: {
      countries: {
        "United States": ["New York", "Los Angeles", "Chicago", "Miami", "Las Vegas"],
        Canada: ["Toronto", "Vancouver", "Montreal", "Calgary"],
        Mexico: ["Mexico City", "Cancun", "Playa del Carmen", "Puerto Vallarta"],
        Brazil: ["Rio de Janeiro", "São Paulo", "Salvador", "Brasília"]
      }
    },
    Africa: {
      countries: {
        "South Africa": ["Cape Town", "Johannesburg", "Durban", "Port Elizabeth"],
        Egypt: ["Cairo", "Alexandria", "Luxor", "Aswan"],
        Morocco: ["Marrakech", "Casablanca", "Fez", "Rabat"],
        Kenya: ["Nairobi", "Mombasa", "Kisumu"]
      }
    },
    Oceania: {
      countries: {
        Australia: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide"],
        "New Zealand": ["Auckland", "Wellington", "Christchurch", "Queenstown"]
      }
    }
  };

  const [availableCountries, setAvailableCountries] = useState<string[]>([]);
  const [availableCities, setAvailableCities] = useState<string[]>([]);

  useEffect(() => {
    fetchCollections();
  }, []);

  useEffect(() => {
    // Update available countries when region changes
    if (formData.region && locationData[formData.region as keyof typeof locationData]) {
      const countries = Object.keys(locationData[formData.region as keyof typeof locationData].countries);
      setAvailableCountries(countries);
      // Reset country and city if current country is not in new region
      if (!countries.includes(formData.country)) {
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
    if (formData.region && formData.country && locationData[formData.region as keyof typeof locationData]) {
      const regionData = locationData[formData.region as keyof typeof locationData];
      const cities = regionData.countries[formData.country as keyof typeof regionData.countries] || [];
      setAvailableCities(cities);
      // Reset city if current city is not in new country
      if (!cities.includes(formData.city)) {
        setFormData(prev => ({ ...prev, city: "" }));
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
    const newImages = [...newFeatures[featureIndex].images];
    newImages[imageIndex] = value;
    newFeatures[featureIndex] = { ...newFeatures[featureIndex], images: newImages };
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const addFeatureImage = (featureIndex: number) => {
    const newFeatures = [...formData.features!];
    if (newFeatures[featureIndex].images.length < 5) {
      newFeatures[featureIndex].images.push("");
      setFormData(prev => ({ ...prev, features: newFeatures }));
    }
  };

  const removeFeatureImage = (featureIndex: number, imageIndex: number) => {
    const newFeatures = [...formData.features!];
    if (newFeatures[featureIndex].images.length > 2) {
      newFeatures[featureIndex].images.splice(imageIndex, 1);
      setFormData(prev => ({ ...prev, features: newFeatures }));
    }
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...(prev.features || []), { title: "", content: "", images: ["", ""] }]
    }));
  };

  const removeFeature = (index: number) => {
    if (formData.features!.length > 1) {
      const newFeatures = formData.features!.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, features: newFeatures }));
    }
  };

  const handleAboutDestinationChange = (index: number, field: keyof AboutDestination, value: string) => {
    const newAboutDestination = [...formData.about_destination!];
    newAboutDestination[index] = { ...newAboutDestination[index], [field]: value };
    setFormData(prev => ({ ...prev, about_destination: newAboutDestination }));
  };

  const addAboutDestination = () => {
    setFormData(prev => ({
      ...prev,
      about_destination: [...(prev.about_destination || []), { title: "", content: "" }]
    }));
  };

  const removeAboutDestination = (index: number) => {
    if (formData.about_destination!.length > 1) {
      const newAboutDestination = formData.about_destination!.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, about_destination: newAboutDestination }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.collection_id) {
      alert("Please select a collection");
      return;
    }

    setLoading(true);
    try {
      await collectionService.createCollectionContent(formData);
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
                              Feature Images (2-5 images)
                            </label>
                            {feature.images.length < 5 && (
                              <button
                                type="button"
                                onClick={() => addFeatureImage(index)}
                                className="text-sm text-green-600 hover:text-green-700 font-medium"
                              >
                                + Add Image
                              </button>
                            )}
                          </div>
                          <div className="space-y-3">
                            {feature.images.map((imageUrl, imageIndex) => (
                              <div key={imageIndex} className="flex items-center space-x-2">
                                <input
                                  type="url"
                                  value={imageUrl}
                                  onChange={(e) => handleFeatureImageChange(index, imageIndex, e.target.value)}
                                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                  placeholder={`Image ${imageIndex + 1} URL`}
                                />
                                {feature.images.length > 2 && (
                                  <button
                                    type="button"
                                    onClick={() => removeFeatureImage(index, imageIndex)}
                                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                                  >
                                    <TrashBinIcon className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Add 2-5 images to showcase this feature
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* About Destination */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    About Destination
                  </h2>
                  <button
                    type="button"
                    onClick={addAboutDestination}
                    className="inline-flex items-center space-x-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    <PlusIcon className="w-4 h-4" />
                    <span>Add Section</span>
                  </button>
                </div>

                <div className="space-y-6">
                  {formData.about_destination?.map((section, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          Section {index + 1}
                        </h3>
                        {formData.about_destination!.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeAboutDestination(index)}
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
                            onChange={(e) => handleAboutDestinationChange(index, "title", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="e.g., History, Culture, Climate"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Content
                          </label>
                          <textarea
                            value={section.content}
                            onChange={(e) => handleAboutDestinationChange(index, "content", e.target.value)}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Detailed information about this aspect of the destination"
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
                      disabled={!formData.region}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">
                        {!formData.region ? "Select Region First" : "Select Country"}
                      </option>
                      {availableCountries.map(country => (
                        <option key={country} value={country}>{country}</option>
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
                        <option key={city} value={city}>{city}</option>
                      ))}
                      <option value="other">Other (Custom City)</option>
                    </select>

                    {/* Custom city input for "Other" selection */}
                    {formData.city === "other" && (
                      <div className="mt-2">
                        <input
                          type="text"
                          value=""
                          onChange={(e) => handleInputChange("city", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Enter custom city name"
                          autoFocus
                        />
                      </div>
                    )}
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