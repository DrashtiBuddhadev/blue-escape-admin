import React from "react";
import TravelMetrics from "../../components/travel/TravelMetrics";
import PageMeta from "../../components/common/PageMeta";

export default function Home() {
  return (
    <>
      <PageMeta
        title="Blue Escape Travel Admin Dashboard | Travel Management System"
        description="Travel management dashboard for blogs, collections, and experiences administration"
      />
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Travel Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome to your travel content management dashboard
          </p>
        </div>

        <TravelMetrics />
      </div>
    </>
  );
}
