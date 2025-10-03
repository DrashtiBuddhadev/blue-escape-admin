import React, { useState, useEffect } from "react";
import { TimeIcon, DocsIcon, GroupIcon, BoxCubeIcon } from "../../icons";

interface ActivityItem {
  id: string;
  type: "blog" | "collection" | "experience";
  title: string;
  action: string;
  timestamp: string;
  author?: string;
}

const RecentActivity: React.FC = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchRecentActivity = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        const mockActivities: ActivityItem[] = [
          {
            id: "1",
            type: "blog",
            title: "Exploring the Temples of Angkor Wat",
            action: "published",
            timestamp: "2 hours ago",
            author: "John Doe"
          },
          {
            id: "2",
            type: "experience",
            title: "Island Hopping in Phi Phi",
            action: "created",
            timestamp: "4 hours ago",
            author: "Jane Smith"
          },
          {
            id: "3",
            type: "collection",
            title: "Southeast Asia Adventures",
            action: "updated",
            timestamp: "6 hours ago",
            author: "Mike Johnson"
          },
          {
            id: "4",
            type: "blog",
            title: "Street Food Guide to Bangkok",
            action: "draft saved",
            timestamp: "1 day ago",
            author: "Sarah Wilson"
          },
          {
            id: "5",
            type: "experience",
            title: "Scuba Diving in Koh Tao",
            action: "published",
            timestamp: "2 days ago",
            author: "David Chen"
          }
        ];

        setActivities(mockActivities);
      } catch (error) {
        console.error("Error fetching recent activity:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentActivity();
  }, []);

  const getIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "blog":
        return <DocsIcon className="w-4 h-4" />;
      case "collection":
        return <GroupIcon className="w-4 h-4" />;
      case "experience":
        return <BoxCubeIcon className="w-4 h-4" />;
      default:
        return <DocsIcon className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: ActivityItem["type"]) => {
    switch (type) {
      case "blog":
        return "text-blue-600 bg-blue-100";
      case "collection":
        return "text-green-600 bg-green-100";
      case "experience":
        return "text-purple-600 bg-purple-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Activity
        </h3>
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Recent Activity
      </h3>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${getTypeColor(activity.type)}`}>
              {getIcon(activity.type)}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {activity.title}
              </p>
              <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                <span className="capitalize">{activity.action}</span>
                <span>•</span>
                <span>{activity.author}</span>
                <span>•</span>
                <div className="flex items-center space-x-1">
                  <TimeIcon className="w-3 h-3" />
                  <span>{activity.timestamp}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
          View all activity
        </button>
      </div>
    </div>
  );
};

export default RecentActivity;