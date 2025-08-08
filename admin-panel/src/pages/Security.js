import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { securityApi, estateApi } from '../services/api';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Shield, 
  Building2,
  Mail,
  Phone,
  User,
  Key,
  X,
  Search,
  Eye,
  EyeOff
} from 'lucide-react';
import toast from 'react-hot-toast';

const SecurityPage = () => {
  const [selectedSecurity, setSelectedSecurity] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('create');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    badgeNumber: '',
    password: '',
    estateId: '',
    shift: 'day', // day, night, 24h
    accessLevel: 'basic' // basic, advanced, supervisor
  });

  const queryClient = useQueryClient();

  // Fetch data
  const { data: securityPersonnel, isLoading, error: securityError } = useQuery('security', securityApi.getAll, {
    retry: 1,
    onError: (error) => {
      console.error('Error fetching security personnel:', error);
    }
  });
  const { data: estates, error: estatesError } = useQuery('estates', estateApi.getAll, {
    retry: 1,
    onError: (error) => {
      console.error('Error fetching estates:', error);
    }
  });

  // Mutations
  const createSecurity = useMutation(securityApi.create, {
    onSuccess: () => {
      queryClient.invalidateQueries('security');
      toast.success('Security personnel created successfully');
      setShowModal(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create security personnel');
    }
  });

  const updateSecurity = useMutation(
    (data) => securityApi.update(selectedSecurity._id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('security');
        toast.success('Security personnel updated successfully');
        setShowModal(false);
        resetForm();
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update security personnel');
      }
    }
  );

  const deleteSecurity = useMutation(securityApi.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries('security');
      toast.success('Security personnel deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete security personnel');
    }
  });

  const assignToEstate = useMutation(
    ({ securityId, estateId }) => securityApi.assignToEstate(securityId, estateId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('security');
        toast.success('Security personnel assigned to estate successfully');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to assign security personnel');
      }
    }
  );

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      badgeNumber: '',
      password: '',
      estateId: '',
      shift: 'day',
      accessLevel: 'basic'
    });
    setSelectedSecurity(null);
  };

  const handleCreate = () => {
    setModalType('create');
    setShowModal(true);
    resetForm();
  };

  const handleEdit = (security) => {
    setModalType('edit');
    setSelectedSecurity(security);
    setFormData({
      name: security.name,
      email: security.email,
      phone: security.phone || '',
      badgeNumber: security.badgeNumber || '',
      password: '',
      estateId: security.estateId || '',
      shift: security.shift || 'day',
      accessLevel: security.accessLevel || 'basic'
    });
    setShowModal(true);
  };

  const handleDelete = (security) => {
    if (window.confirm(`Are you sure you want to delete ${security.name}?`)) {
      deleteSecurity.mutate(security._id);
    }
  };

  const handleAssignEstate = (securityId, estateId) => {
    assignToEstate.mutate({ securityId, estateId });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (modalType === 'create') {
      createSecurity.mutate(formData);
    } else {
      const updateData = { ...formData };
      if (!updateData.password) {
        delete updateData.password;
      }
      updateSecurity.mutate(updateData);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Filter security personnel
  const filteredSecurity = securityPersonnel?.filter(security => {
    const matchesSearch = security.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         security.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         security.badgeNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getShiftBadge = (shift) => {
    const badges = {
      day: 'badge-success',
      night: 'badge-warning',
      '24h': 'badge-info'
    };
    return badges[shift] || 'badge-secondary';
  };

  const getAccessLevelBadge = (level) => {
    const badges = {
      basic: 'badge-info',
      advanced: 'badge-warning',
      supervisor: 'badge-danger'
    };
    return badges[level] || 'badge-secondary';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  if (securityError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading security personnel</h3>
          <p className="text-gray-600 mb-4">Failed to load security personnel. Please try again later.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Security Management</h1>
          <p className="text-gray-600">Manage security personnel and access control</p>
        </div>
        <button
          onClick={handleCreate}
          className="btn btn-primary flex items-center"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Security
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search security personnel..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10"
              />
            </div>
            
            <div className="text-sm text-gray-600">
              {filteredSecurity?.length || 0} security personnel found
            </div>
          </div>
        </div>
      </div>

      {/* Security Personnel Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSecurity?.map((security) => (
          <div key={security._id} className="card hover:shadow-lg transition-shadow">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-purple-600 mr-2" />
                  <h3 className="font-semibold text-gray-900">{security.name}</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(security)}
                    className="p-1 text-gray-400 hover:text-blue-600"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(security)}
                    className="p-1 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="card-body">
              <div className="space-y-3">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">{security.email}</span>
                </div>
                
                {security.phone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">{security.phone}</span>
                  </div>
                )}
                
                {security.badgeNumber && (
                  <div className="flex items-center">
                    <Key className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">Badge: {security.badgeNumber}</span>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Shift:</span>
                  <span className={`badge ${getShiftBadge(security.shift)}`}>
                    {security.shift}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Access Level:</span>
                  <span className={`badge ${getAccessLevelBadge(security.accessLevel)}`}>
                    {security.accessLevel}
                  </span>
                </div>
              </div>
              
              {/* Estate Assignment */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Building2 className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">
                      {security.estate ? security.estate.name : 'Not assigned'}
                    </span>
                  </div>
                  {!security.estate && estates && (
                    <select
                      onChange={(e) => handleAssignEstate(security._id, e.target.value)}
                      className="text-xs border border-gray-300 rounded px-2 py-1"
                      defaultValue=""
                    >
                      <option value="">Assign Estate</option>
                      {estates.map((estate) => (
                        <option key={estate._id} value={estate._id}>
                          {estate.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {(!filteredSecurity || filteredSecurity.length === 0) && (
        <div className="text-center py-12">
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No security personnel found</h3>
          <p className="text-gray-600 mb-4">Get started by adding your first security personnel.</p>
          <button onClick={handleCreate} className="btn btn-primary">
            <Plus className="mr-2 h-4 w-4" />
            Add Security
          </button>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {modalType === 'create' ? 'Add Security Personnel' : 'Edit Security Personnel'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
                
                <div>
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
                
                <div>
                  <label className="form-label">Badge Number</label>
                  <input
                    type="text"
                    name="badgeNumber"
                    value={formData.badgeNumber}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
              </div>
              
              {modalType === 'create' && (
                <div>
                  <label className="form-label">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="form-input pr-10"
                      required={modalType === 'create'}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Shift</label>
                  <select
                    name="shift"
                    value={formData.shift}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  >
                    <option value="day">Day Shift</option>
                    <option value="night">Night Shift</option>
                    <option value="24h">24 Hour</option>
                  </select>
                </div>
                
                <div>
                  <label className="form-label">Access Level</label>
                  <select
                    name="accessLevel"
                    value={formData.accessLevel}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  >
                    <option value="basic">Basic Access</option>
                    <option value="advanced">Advanced Access</option>
                    <option value="supervisor">Supervisor Access</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="form-label">Assign to Estate (Optional)</label>
                <select
                  name="estateId"
                  value={formData.estateId}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="">Select Estate</option>
                  {estates?.map((estate) => (
                    <option key={estate._id} value={estate._id}>
                      {estate.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createSecurity.isLoading || updateSecurity.isLoading}
                  className="btn btn-primary"
                >
                  {createSecurity.isLoading || updateSecurity.isLoading ? (
                    <>
                      <div className="spinner mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    modalType === 'create' ? 'Create Security' : 'Update Security'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurityPage; 