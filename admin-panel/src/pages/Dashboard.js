import React from 'react';
import { useQuery } from 'react-query';
import { dashboardApi } from '../services/api';
import { 
  Building2, 
  Users, 
  Shield, 
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

const Dashboard = () => {
  const { data: stats, isLoading: statsLoading } = useQuery(
    'dashboard-stats',
    dashboardApi.getStats,
    {
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  );

  const { data: activities, isLoading: activitiesLoading } = useQuery(
    'dashboard-activities',
    dashboardApi.getRecentActivities
  );

  const { data: overview, isLoading: overviewLoading } = useQuery(
    'dashboard-overview',
    dashboardApi.getOverview
  );

  const StatCard = ({ title, value, icon: Icon, color, change }) => (
    <div className="card">
      <div className="card-body">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {change && (
              <p className={`text-sm ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {change > 0 ? '+' : ''}{change}% from last month
              </p>
            )}
          </div>
          <div className={`p-3 rounded-full ${color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>
    </div>
  );

  const ActivityItem = ({ activity }) => (
    <div className="flex items-center space-x-3 py-3 border-b border-gray-100 last:border-b-0">
      <div className="flex-shrink-0">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <Activity className="h-4 w-4 text-blue-600" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
        <p className="text-sm text-gray-500">{activity.description}</p>
      </div>
      <div className="flex-shrink-0">
        <span className="text-xs text-gray-400">{activity.time}</span>
      </div>
    </div>
  );

  if (statsLoading || activitiesLoading || overviewLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="card">
        <div className="card-body">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, Admin!
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your estate management system today.
          </p>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Estates"
          value={stats?.totalEstates || 0}
          icon={Building2}
          color="bg-blue-500"
          change={stats?.estatesChange}
        />
        <StatCard
          title="Active Users"
          value={stats?.activeUsers || 0}
          icon={Users}
          color="bg-green-500"
          change={stats?.usersChange}
        />
        <StatCard
          title="Security Personnel"
          value={stats?.securityPersonnel || 0}
          icon={Shield}
          color="bg-purple-500"
          change={stats?.securityChange}
        />
        <StatCard
          title="Today's Visitors"
          value={stats?.todayVisitors || 0}
          icon={TrendingUp}
          color="bg-orange-500"
          change={stats?.visitorsChange}
        />
      </div>

      {/* Overview and Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Overview */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">System Overview</h3>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Quick Stats</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Pending Approvals</span>
                      <span className="text-sm font-medium text-orange-600">
                        {overview?.pendingApprovals || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Active Emergencies</span>
                      <span className="text-sm font-medium text-red-600">
                        {overview?.activeEmergencies || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Maintenance Requests</span>
                      <span className="text-sm font-medium text-blue-600">
                        {overview?.maintenanceRequests || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">QR Codes Generated</span>
                      <span className="text-sm font-medium text-green-600">
                        {overview?.qrCodesGenerated || 0}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">System Status</h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm text-gray-600">Database Connected</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm text-gray-600">API Services Active</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm text-gray-600">Security Monitoring</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-yellow-500 mr-2" />
                      <span className="text-sm text-gray-600">Backup Scheduled</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
          </div>
          <div className="card-body">
            <div className="space-y-1">
              {activities?.slice(0, 5).map((activity, index) => (
                <ActivityItem key={index} activity={activity} />
              ))}
              {(!activities || activities.length === 0) && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No recent activities
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Alerts and Notifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
              Recent Alerts
            </h3>
          </div>
          <div className="card-body">
            {overview?.recentAlerts?.length > 0 ? (
              <div className="space-y-3">
                {overview.recentAlerts.slice(0, 3).map((alert, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                      <p className="text-xs text-gray-500">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                No recent alerts
              </p>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-2 gap-3">
              <button className="btn btn-primary text-sm">
                Add New Estate
              </button>
              <button className="btn btn-secondary text-sm">
                Create User
              </button>
              <button className="btn btn-success text-sm">
                Assign Security
              </button>
              <button className="btn btn-secondary text-sm">
                View Reports
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 