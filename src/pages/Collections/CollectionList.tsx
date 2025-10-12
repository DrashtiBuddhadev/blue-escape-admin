import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { Collection } from "../../api/types";
import { collectionService } from "../../api/services";
import CollectionCard from "../../components/travel/CollectionCard";
import EditCollectionModal from "../../components/travel/EditCollectionModal";
import ViewCollectionModal from "../../components/travel/ViewCollectionModal";
import PageMeta from "../../components/common/PageMeta";
import Pagination from "../../components/common/Pagination";
import { PlusIcon, GroupIcon } from "../../icons";

const CollectionList: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedViewCollection, setSelectedViewCollection] = useState<Collection | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchCollections();
  }, [currentPage, itemsPerPage]);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const response = await collectionService.getCollections({
        page: currentPage,
        limit: itemsPerPage,
      });
      setCollections(response.data);
      setTotalItems(response.total);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error fetching collections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCollection = async (id: string) => {
    try {
      await collectionService.deleteCollection(id);
      setCollections(collections.filter(collection => collection.id !== id));
    } catch (error) {
      console.error('Error deleting collection:', error);
    }
  };

  const handleEditCollection = (collection: Collection) => {
    setSelectedCollection(collection);
    setEditModalOpen(true);
  };

  const handleViewCollection = (collection: Collection) => {
    setSelectedViewCollection(collection);
    setViewModalOpen(true);
  };

  const handleUpdateCollection = (updatedCollection: Collection) => {
    setCollections(collections.map(collection =>
      collection.id === updatedCollection.id ? updatedCollection : collection
    ));
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedCollection(null);
  };

  const handleCloseViewModal = () => {
    setViewModalOpen(false);
    setSelectedViewCollection(null);
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setCurrentPage(1);
    setItemsPerPage(newItemsPerPage);
  };

  return (
    <>
      <PageMeta
        title="Collections | Blue Escape Travel Admin"
        description="Manage travel destination collections"
      />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Travel Collections
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Organize destinations and travel experiences into curated collections
            </p>
          </div>

          <Link
            to="/collections/create"
            className="inline-flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Create Collection</span>
          </Link>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : collections.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <GroupIcon className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No collections found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Get started by creating your first travel collection to organize destinations.
            </p>
            <Link
              to="/collections/create"
              className="inline-flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Create Collection</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((collection) => (
              <CollectionCard
                key={collection.id}
                collection={collection}
                onDelete={handleDeleteCollection}
                onEdit={handleEditCollection}
                onView={handleViewCollection}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
            loading={loading}
          />
        )}

        {/* Edit Modal */}
        {selectedCollection && (
          <EditCollectionModal
            collection={selectedCollection}
            isOpen={editModalOpen}
            onClose={handleCloseEditModal}
            onUpdate={handleUpdateCollection}
          />
        )}

        {/* View Modal */}
        {selectedViewCollection && (
          <ViewCollectionModal
            collection={selectedViewCollection}
            isOpen={viewModalOpen}
            onClose={handleCloseViewModal}
          />
        )}
      </div>
    </>
  );
};

export default CollectionList;