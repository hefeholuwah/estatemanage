import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { estateApi, userApi, securityApi } from '../services/api';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Shield, 
  Building2,
  MapPin,
  Phone,
  Mail,
  Calendar,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

const Estates = () => {
  const [selectedEstate, setSelectedEstate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('create'); // 'create' or 'edit'
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    description: '',
    contactPhone: '',
    contactEmail: '',
    totalUnits: '',
    amenities: ''
  });

  const queryClient = useQueryClient();

  // Fetch estates
  const { data: estates, isLoading, error: estatesError } = useQuery('estates', estateApi.getAll, {
    retry: 1,
    onError: (error) => {
      console.error('Error fetching estates:', error);
    }
  });

  // Fetch users and security for assignment
  const { data: users, error: usersError } = useQuery('users', userApi.getAll, {
    retry: 1,
    onError: (error) => {
      console.error('Error fetching users:', error);
    }
  });
  const { data: securityPersonnel, error: securityError } = useQuery('security', securityApi.getAll, {
    retry: 1,
    onError: (error) => {
      console.error('Error fetching security personnel:', error);
    }
  });

  // Mutations
  const createEstate = useMutation(estateApi.create, {
    onSuccess: () => {
      queryClient.invalidateQueries('estates');
      toast.success('Estate created successfully');
      setShowModal(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create estate');
    }
  });

  const updateEstate = useMutation(
    (data) => estateApi.update(selectedEstate._id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('estates');
        toast.success('Estate updated successfully');
        setShowModal(false);
        resetForm();
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update estate');
      }
    }
  );

  const deleteEstate = useMutation(estateApi.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries('estates');
      toast.success('Estate deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete estate');
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      description: '',
      contactPhone: '',
      contactEmail: '',
      totalUnits: '',
      amenities: ''
    });
    setSelectedEstate(null);
  };

  const handleCreate = () => {
    setModalType('create');
    setShowModal(true);
    resetForm();
  };

  const handleEdit = (estate) => {
    setModalType('edit');
    setSelectedEstate(estate);
    setFormData({
      name: estate.name,
      address: estate.address,
      description: estate.description,
      contactPhone: estate.contactPhone,
      contactEmail: estate.contactEmail,
      totalUnits: estate.totalUnits,
      amenities: estate.amenities
    });
    setShowModal(true);
  };

  const handleDelete = (estate) => {
    if (window.confirm(`Are you sure you want to delete ${estate.name}?`)) {
      deleteEstate.mutate(estate._id);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (modalType === 'create') {
      createEstate.mutate(formData);
    } else {
      updateEstate.mutate(formData);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  if (estatesError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Building2 className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading estates</h3>
          <p className="text-gray-600 mb-4">Failed to load estates. Please try again later.</p>
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
          <h1 className="text-2xl font-bold text-gray-900">Estate Management</h1>
          <p className="text-gray-600">Manage all estates in the system</p>
        </div>
        <button
          onClick={handleCreate}
          className="btn btn-primary flex items-center"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Estate
        </button>
      </div>

      {/* Estates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {estates?.map((estate) => (
          <div key={estate._id} className="card hover:shadow-lg transition-shadow">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Building2 className="h-5 w-5 text-blue-600 mr-2" />
                  <h3 className="font-semibold text-gray-900">{estate.name}</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(estate)}
                    className="p-1 text-gray-400 hover:text-blue-600"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(estate)}
                    className="p-1 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="card-body">
              <div className="space-y-3">
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                  <span className="text-sm text-gray-600">{estate.address}</span>
                </div>
                
                {estate.contactPhone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">{estate.contactPhone}</span>
                  </div>
                )}
                
                {estate.contactEmail && (
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">{estate.contactEmail}</span>
                  </div>
                )}
                
                {estate.totalUnits && (
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">{estate.totalUnits} units</span>
                  </div>
                )}
                
                {estate.description && (
                  <p className="text-sm text-gray-600 mt-2">{estate.description}</p>
                )}
              </div>
              
              {/* Estate Stats */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-gray-600">
                      {estate.users?.length || 0} Users
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 text-purple-500 mr-2" />
                    <span className="text-gray-600">
                      {estate.security?.length || 0} Security
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {(!estates || estates.length === 0) && (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No estates found</h3>
          <p className="text-gray-600 mb-4">Get started by creating your first estate.</p>
          <button onClick={handleCreate} className="btn btn-primary">
            <Plus className="mr-2 h-4 w-4" />
            Add Estate
          </button>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {modalType === 'create' ? 'Create New Estate' : 'Edit Estate'}
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
                  <label className="form-label">Estate Name</label>
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
                  <label className="form-label">Contact Phone</label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
              </div>
              
              <div>
                <label className="form-label">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              
              <div>
                <label className="form-label">Contact Email</label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Total Units</label>
                  <input
                    type="number"
                    name="totalUnits"
                    value={formData.totalUnits}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
                
                <div>
                  <label className="form-label">Amenities</label>
                  <input
                    type="text"
                    name="amenities"
                    value={formData.amenities}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Pool, Gym, Parking..."
                  />
                </div>
              </div>
              
              <div>
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="form-input"
                  rows="3"
                />
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
                  disabled={createEstate.isLoading || updateEstate.isLoading}
                  className="btn btn-primary"
                >
                  {createEstate.isLoading || updateEstate.isLoading ? (
                    <>
                      <div className="spinner mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    modalType === 'create' ? 'Create Estate' : 'Update Estate'
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

export default Estates; 