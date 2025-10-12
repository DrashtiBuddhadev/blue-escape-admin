import React, { useState, useEffect } from "react";
import { DocsIcon, GroupIcon, BoxCubeIcon, TagIcon } from "../../icons";
import { blogService, collectionService, experienceService, tagService } from "../../api/services";

interface MetricData {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const TravelMetrics = () => {
  const [metrics, setMetrics] = useState<MetricData[]>([
    {
      title: "Total Blogs",
      value: 0,
      icon: <DocsIcon />,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Collection Content",
      value: 0,
      icon: <GroupIcon />,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Experiences",
      value: 0,
      icon: <BoxCubeIcon />,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Tags",
      value: 0,
      icon: <TagIcon />,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ]);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        // Fetch real counts from API services
        const [blogs, collectionContents, experiences, tags] = await Promise.all([
          blogService.getBlogs({}),
          collectionService.getAllCollectionContents(),
          experienceService.getExperiences({}),
          tagService.getTags()
        ]);

        setMetrics(prev => [
          { ...prev[0], value: blogs.total },
          { ...prev[1], value: collectionContents.total },
          { ...prev[2], value: experiences.total },
          { ...prev[3], value: tags.length },
        ]);
      } catch (error) {
        console.error("Error fetching metrics:", error);
      }
    };

    fetchMetrics();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {metric.title}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {metric.value}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${metric.bgColor} ${metric.color}`}>
              {metric.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TravelMetrics;