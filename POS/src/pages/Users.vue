/**
 * Users Management Page
 * Manage application users and permissions
 */

<template>
  <div class="users-page">
    <div class="page-header">
      <div>
        <h2>Users Management</h2>
        <p class="text-gray-600">Manage application users and permissions</p>
      </div>
      <button class="btn-primary" @click="showNewUserModal = true">
        <i class="fas fa-plus"></i> Add User
      </button>
    </div>

    <!-- Users Table -->
    <div class="table-container">
      <div v-if="isLoading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading users...</p>
      </div>
      <table v-else class="data-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Permissions</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td class="font-medium">{{ user.username }}</td>
            <td>{{ user.email }}</td>
            <td>
              <span class="badge badge-primary">{{ user.roles[0] || 'user' }}</span>
            </td>
            <td>
              <span class="permissions-count">{{ user.permissions?.length || 0 }} permissions</span>
            </td>
            <td>
              <span class="badge badge-success">Active</span>
            </td>
            <td class="actions-cell">
              <button class="btn-sm btn-edit" @click="editUser(user)" title="Edit">
                <i class="fas fa-edit"></i>
              </button>
              <button v-if="user.id !== authStore.user?.id" class="btn-sm btn-delete" @click="deleteUser(user.id)" title="Delete">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="!isLoading && users.length === 0" class="empty-state">
        <i class="fas fa-users"></i>
        <h3>No users found</h3>
      </div>
    </div>

    <!-- New User Modal -->
    <div v-if="showNewUserModal" class="modal-overlay" @click.self="showNewUserModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Add New User</h2>
          <button class="btn-close" @click="showNewUserModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Username</label>
            <input v-model="newUser.username" type="text" class="form-input" placeholder="Enter username" />
          </div>
          <div class="form-group">
            <label>Email</label>
            <input v-model="newUser.email" type="email" class="form-input" placeholder="Enter email" />
          </div>
          <div class="form-group">
            <label>Password</label>
            <input v-model="newUser.password" type="password" class="form-input" placeholder="Enter password" />
          </div>
          <div class="form-group">
            <label>Role</label>
            <select v-model="newUser.role" class="form-input">
              <option value="user">User</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div class="modal-actions">
            <button class="btn-cancel" @click="showNewUserModal = false">Cancel</button>
            <button class="btn-submit" @click="createUser">Create User</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'
import { userService } from '@/services/userService'
import { logger } from '@/utils/logger'

const authStore = useAuthStore()
const appStore = useAppStore()

const users = ref<any[]>([])
const isLoading = ref(false)
const showNewUserModal = ref(false)
const newUser = ref({
  username: '',
  email: '',
  password: '',
  role: 'user'
})

// Fetch all users from backend
const fetchUsers = async () => {
  try {
    isLoading.value = true
    const response = await userService.getAllUsers(1, 100)
    
    if (response && response.data) {
      users.value = response.data.map(user => ({
        id: user.id,
        username: user.username,
        email: user.email,
        roles: user.roles || ['user'],
        permissions: user.permissions || [],
        createdAt: new Date().toISOString()
      }))
      logger.info(`Loaded ${users.value.length} users from backend`)
    } else {
      logger.warn('Failed to fetch users from backend')
      appStore.addNotification('Failed to load users', 'error')
    }
  } catch (error) {
    logger.error('Error fetching users', error)
    appStore.addNotification('Error loading users', 'error')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  logger.info('Users page loaded')
  fetchUsers()
})

const editUser = (user: any) => {
  logger.debug('Edit user', { id: user.id })
  appStore.addNotification('Edit functionality coming soon', 'info')
}

const deleteUser = async (id: string) => {
  if (confirm('Are you sure you want to delete this user?')) {
    try {
      const success = await userService.deleteUser(id)
      if (success) {
        users.value = users.value.filter(u => u.id !== id)
        appStore.addNotification('User deleted successfully', 'success')
        logger.info('User deleted')
      } else {
        appStore.addNotification('Failed to delete user', 'error')
      }
    } catch (error) {
      logger.error('Error deleting user', error)
      appStore.addNotification('Error deleting user', 'error')
    }
  }
}

const createUser = async () => {
  try {
    if (!newUser.value.username || !newUser.value.email || !newUser.value.password) {
      appStore.addNotification('Please fill in all fields', 'warning')
      return
    }

    isLoading.value = true
    const userData = {
      username: newUser.value.username,
      email: newUser.value.email,
      password: newUser.value.password,
      roles: [newUser.value.role],
      permissions: []
    }

    const createdUser = await userService.createUser(userData)
    if (createdUser) {
      users.value.push({
        id: createdUser.id,
        username: createdUser.username,
        email: createdUser.email,
        roles: createdUser.roles || [newUser.value.role],
        permissions: createdUser.permissions || []
      })
      appStore.addNotification('User created successfully', 'success')
      showNewUserModal.value = false
      // Reset form
      newUser.value = { username: '', email: '', password: '', role: 'user' }
      logger.info('User created', userData)
    } else {
      appStore.addNotification('Failed to create user', 'error')
    }
  } catch (error) {
    logger.error('Error creating user', error)
    appStore.addNotification('Error creating user', 'error')
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.users-page {
  animation: fadeIn 0.3s ease-in;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
}

.page-header h2 {
  margin: 0 0 5px 0;
  font-size: 28px;
  color: #1f2937;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

.table-container {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table thead {
  background-color: #f9fafb;
  border-bottom: 2px solid #e5e7eb;
}

.data-table th {
  padding: 15px;
  text-align: left;
  font-weight: 600;
  color: #1f2937;
  font-size: 13px;
}

.data-table tbody tr {
  border-bottom: 1px solid #f3f4f6;
}

.data-table td {
  padding: 15px;
  color: #1f2937;
  font-size: 14px;
}

.font-medium {
  font-weight: 500;
}

.badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.badge-primary {
  background-color: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.badge-success {
  background-color: rgba(16, 185, 129, 0.1);
  color: #059669;
}

.permissions-count {
  font-size: 12px;
  color: #6b7280;
}

.actions-cell {
  display: flex;
  gap: 8px;
}

.btn-sm {
  padding: 6px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.btn-edit {
  background-color: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.btn-delete {
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #9ca3af;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #6b7280;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h2 {
  margin: 0;
  font-size: 20px;
}

.btn-close {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #6b7280;
}

.modal-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  font-size: 14px;
  color: #1f2937;
}

.form-input {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
}

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

.btn-cancel {
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  color: #6b7280;
  cursor: pointer;
  font-size: 14px;
}

.btn-submit {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background-color: #3b82f6;
  color: white;
  cursor: pointer;
  font-size: 14px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
