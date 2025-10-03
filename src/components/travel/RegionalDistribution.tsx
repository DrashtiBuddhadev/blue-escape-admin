import React, { useState, useEffect } from "react";

interface RegionData {
  region: string;
  count: number;
  percentage: number;
  color: string;
}

const RegionalDistribution: React.FC = () => {
  const [regionData, setRegionData] = useState<RegionData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchRegionalData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));

        const mockData: RegionData[] = [
          { region: "Asia", count: 42, percentage: 45, color: "bg-blue-500" },
          { region: "Europe", count: 28, percentage: 30, color: "bg-green-500" },
          { region: "Americas", count: 15, percentage: 16, color: "bg-purple-500" },
          { region: "Africa", count: 8, percentage: 9, color: "bg-orange-500" },
        ];

        setRegionData(mockData);
      } catch (error) {
        console.error("Error fetching regional data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRegionalData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Content by Region
        </h3>
        <div className="space-y-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="flex items-center justify-between mb-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Content by Region
      </h3>

      <div className="space-y-4">
        {regionData.map((region, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {region.region}
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {region.count}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  ({region.percentage}%)
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${region.color}`}
                style={{ width: `${region.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Total: {regionData.reduce((sum, region) => sum + region.count, 0)} pieces of content
        </div>
      </div>
    </div>
  );
};

export default RegionalDistribution;