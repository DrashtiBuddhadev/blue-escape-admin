import React, { useState, useEffect } from "react";
import { Collection, UpdateCollectionRequest } from "../../api/types";
import { collectionService } from "../../api/services";
import { CloseIcon } from "../../icons";

interface EditCollectionModalProps {
  collection: Collection;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedCollection: Collection) => void;
}

const EditCollectionModal: React.FC<EditCollectionModalProps> = ({
  collection,
  isOpen,
  onClose,
  onUpdate,
}) => {
  const [formData, setFormData] = useState<UpdateCollectionRequest>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen && collection) {
      setFormData({
        name: collection.name,
      });
      setErrors({});
    }
  }, [isOpen, collection]);

  const handleInputChange = (field: keyof UpdateCollectionRequest, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Collection name is required";
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
      console.log('Updating collection with ID:', collection.id);
      console.log('Form data being sent:', JSON.stringify(formData, null, 2));

      const updatedCollection = await collectionService.updateCollection(collection.id, formData);
      console.log('Update response:', updatedCollection);
      onUpdate(updatedCollection);
      onClose();
    } catch (error: any) {
      console.error('Error updating collection:', error);
      console.error('Error response data:', error?.data);
      console.error('Error status:', error?.status);

      let errorMessage = error?.message || 'Failed to update collection. Please try again.';
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100000] p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Edit Collection
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Error Display */}
          {errors.submit && (
            <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-600 dark:text-red-400 text-sm whitespace-pre-line">{errors.submit}</p>
            </div>
          )}

          {/* Collection Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Collection Name *
            </label>
            <input
              type="text"
              value={formData.name || ""}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="Enter collection name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Updating...' : 'Update Collection'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCollectionModal;