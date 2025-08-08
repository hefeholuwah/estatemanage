import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { userApi, estateApi } from '../services/api';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Building2,
  Mail,
  Phone,
  User,
  Shield,
  X,
  Search
} from 'lucide-react';
import toast from 'react-hot-toast';

const UsersPage = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('create');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'resident',
    password: '',
    estateId: ''
  });

  const queryClient = useQueryClient();

  // Fetch data
  const { data: users, isLoading, error: usersError } = useQuery('users', userApi.getAll, {
    retry: 1,
    onError: (error) => {
      console.error('Error fetching users:', error);
    }
  });
  const { data: estates, error: estatesError } = useQuery('estates', estateApi.getAll, {
    retry: 1,
    onError: (error) => {
      console.error('Error fetching estates:', error);
    }
  });

  // Mutations
  const createUser = useMutation(userApi.create, {
    onSuccess: () => {
      queryClient.invalidateQueries('users');
      toast.success('User created successfully');
      setShowModal(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create user');
    }
  });

  const updateUser = useMutation(
    (data) => userApi.update(selectedUser._id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users');
        toast.success('User updated successfully');
        setShowModal(false);
        resetForm();
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update user');
      }
    }
  );

  const deleteUser = useMutation(userApi.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries('users');
      toast.success('User deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  });

  const assignToEstate = useMutation(
    ({ userId, estateId }) => userApi.assignToEstate(userId, estateId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users');
        toast.success('User assigned to estate successfully');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to assign user');
      }
    }
  );

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'resident',
      password: '',
      estateId: ''
    });
    setSelectedUser(null);
  };

  const handleCreate = () => {
    setModalType('create');
    setShowModal(true);
    resetForm();
  };

  const handleEdit = (user) => {
    setModalType('edit');
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      password: '',
      estateId: user.estateId || ''
    });
    setShowModal(true);
  };

  const handleDelete = (user) => {
    if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      deleteUser.mutate(user._id);
    }
  };

  const handleAssignEstate = (userId, estateId) => {
    assignToEstate.mutate({ userId, estateId });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (modalType === 'create') {
      createUser.mutate(formData);
    } else {
      const updateData = { ...formData };
      if (!updateData.password) {
        delete updateData.password;
      }
      updateUser.mutate(updateData);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Filter users
  const filteredUsers = users?.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role) => {
    const badges = {
      admin: 'badge-danger',
      resident: 'badge-success',
      staff: 'badge-info'
    };
    return badges[role] || 'badge-secondary';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  if (usersError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Users className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading users</h3>
          <p className="text-gray-600 mb-4">Failed to load users. Please try again later.</p>
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
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage all users in the system</p>
        </div>
        <button
          onClick={handleCreate}
          className="btn btn-primary flex items-center"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10"
              />
            </div>
            
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="form-input"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="resident">Resident</option>
              <option value="staff">Staff</option>
            </select>
            
            <div className="text-sm text-gray-600">
              {filteredUsers?.length || 0} users found
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900">Users</h3>
        </div>
        <div className="card-body">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Estate</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(filteredUsers) && filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                          <User className="h-4 w-4 text-gray-600" />
                        </div>
                        <span className="font-medium text-gray-900">{user.name}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-600">{user.email}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${getRoleBadge(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      {user.estate ? (
                        <div className="flex items-center">
                          <Building2 className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-gray-600">{user.estate.name}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">Not assigned</span>
                      )}
                    </td>
                    <td>
                      {user.phone ? (
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-gray-600">{user.phone}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="p-1 text-gray-400 hover:text-blue-600"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user)}
                          className="p-1 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {(!filteredUsers || filteredUsers.length === 0) && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-600 mb-4">Get started by creating your first user.</p>
          <button onClick={handleCreate} className="btn btn-primary">
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </button>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {modalType === 'create' ? 'Create New User' : 'Edit User'}
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
                  <label className="form-label">Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  >
                    <option value="resident">Resident</option>
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              
              {modalType === 'create' && (
                <div>
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="form-input"
                    required={modalType === 'create'}
                  />
                </div>
              )}
              
              <div>
                <label className="form-label">Assign to Estate (Optional)</label>
                <select
                  name="estateId"
                  value={formData.estateId}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="">Select Estate</option>
                  {Array.isArray(estates) && estates.map((estate) => (
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
                  disabled={createUser.isLoading || updateUser.isLoading}
                  className="btn btn-primary"
                >
                  {createUser.isLoading || updateUser.isLoading ? (
                    <>
                      <div className="spinner mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    modalType === 'create' ? 'Create User' : 'Update User'
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

export default UsersPage; 