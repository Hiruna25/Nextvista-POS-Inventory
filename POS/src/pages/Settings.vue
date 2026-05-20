/**
 * Settings Page
 * Application and system settings
 */

<template>
  <div class="settings-page">
    <div class="page-header">
      <h2>Settings</h2>
      <p class="text-gray-600">Manage application settings and preferences</p>
    </div>

    <div class="settings-grid">
      <!-- General Settings -->
      <div class="settings-section">
        <h3>General Settings</h3>
        <div class="settings-form">
          <div class="form-group">
            <label>Store Name</label>
            <input v-model="settings.storeName" type="text" class="form-input" />
          </div>
          <div class="form-group">
            <label>Store Email</label>
            <input v-model="settings.storeEmail" type="email" class="form-input" />
          </div>
          <div class="form-group">
            <label>Store Phone</label>
            <input v-model="settings.storePhone" type="tel" class="form-input" />
          </div>
          <div class="form-group">
            <label>Store Address</label>
            <textarea v-model="settings.storeAddress" class="form-input" rows="3"></textarea>
          </div>
        </div>
      </div>

      <!-- Inventory Settings -->
      <div class="settings-section">
        <h3>Inventory Settings</h3>
        <div class="settings-form">
          <div class="form-group">
            <label>
              <input v-model="settings.autoReorder" type="checkbox" />
              Enable Auto Reorder
            </label>
          </div>
          <div class="form-group">
            <label>Min Stock Level (Default)</label>
            <input v-model.number="settings.minStockLevel" type="number" class="form-input" />
          </div>
          <div class="form-group">
            <label>Reorder Point %</label>
            <input v-model.number="settings.reorderPoint" type="number" class="form-input" min="0" max="100" />
            <small>Triggers reorder when stock falls below this percentage</small>
          </div>
        </div>
      </div>

      <!-- POS Settings -->
      <div class="settings-section">
        <h3>POS Settings</h3>
        <div class="settings-form">
          <div class="form-group">
            <label>Receipt Printer</label>
            <select v-model="settings.receiptPrinter" class="form-input">
              <option value="">Select Printer</option>
              <option value="printer1">Receipt Printer 1</option>
              <option value="printer2">Receipt Printer 2</option>
            </select>
          </div>
          <div class="form-group">
            <label>
              <input v-model="settings.showBarcode" type="checkbox" />
              Show Barcode on Receipt
            </label>
          </div>
          <div class="form-group">
            <label>Currency</label>
            <select v-model="settings.currency" class="form-input">
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Email Settings -->
      <div class="settings-section">
        <h3>Email Settings</h3>
        <div class="settings-form">
          <div class="form-group">
            <label>SMTP Server</label>
            <input v-model="settings.smtpServer" type="text" class="form-input" placeholder="smtp.gmail.com" />
          </div>
          <div class="form-group">
            <label>SMTP Port</label>
            <input v-model.number="settings.smtpPort" type="number" class="form-input" />
          </div>
          <div class="form-group">
            <label>
              <input v-model="settings.enableEmailNotifications" type="checkbox" />
              Enable Email Notifications
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Save Button -->
    <div class="settings-actions">
      <button class="btn-save" @click="saveSettings">
        <i class="fas fa-save"></i> Save Settings
      </button>
      <button class="btn-reset" @click="resetSettings">
        <i class="fas fa-undo"></i> Reset
      </button>
    </div>

    <!-- Danger Zone -->
    <div class="danger-zone">
      <h3>Danger Zone</h3>
      <p>These actions are irreversible</p>
      <div class="danger-actions">
        <button class="btn-danger" @click="exportData">
          <i class="fas fa-download"></i> Export All Data
        </button>
        <button class="btn-danger" @click="resetDatabase">
          <i class="fas fa-trash-alt"></i> Reset Database
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { logger } from '@/utils/logger'

const settings = reactive({
  storeName: 'My Store',
  storeEmail: 'store@example.com',
  storePhone: '+1 (555) 123-4567',
  storeAddress: '123 Main St, City, State',
  autoReorder: true,
  minStockLevel: 10,
  reorderPoint: 25,
  receiptPrinter: 'printer1',
  showBarcode: true,
  currency: 'USD',
  smtpServer: 'smtp.gmail.com',
  smtpPort: 587,
  enableEmailNotifications: true
})

const originalSettings = { ...settings }

const saveSettings = () => {
  logger.info('Settings saved', settings)
}

const resetSettings = () => {
  Object.assign(settings, originalSettings)
  logger.info('Settings reset')
}

const exportData = () => {
  if (confirm('Export all data? This may take a moment.')) {
    logger.info('Exporting data...')
  }
}

const resetDatabase = () => {
  if (confirm('Are you sure? This will delete all data and cannot be undone.')) {
    if (confirm('This action cannot be reversed. Type "DELETE" to confirm.')) {
      logger.info('Database reset')
    }
  }
}
</script>

<style scoped>
.settings-page {
  animation: fadeIn 0.3s ease-in;
}

.page-header {
  margin-bottom: 30px;
}

.page-header h2 {
  margin: 0 0 5px 0;
  font-size: 28px;
  color: #1f2937;
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
  margin-bottom: 30px;
}

.settings-section {
  background: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.settings-section h3 {
  margin: 0 0 20px 0;
  font-size: 18px;
  color: #1f2937;
  border-bottom: 2px solid #f3f4f6;
  padding-bottom: 10px;
}

.settings-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  font-size: 14px;
  color: #1f2937;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-group input[type="checkbox"] {
  cursor: pointer;
  width: 16px;
  height: 16px;
}

.form-input {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-group small {
  font-size: 12px;
  color: #6b7280;
}

.settings-actions {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
}

.btn-save,
.btn-reset {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-save {
  background-color: #10b981;
  color: white;
}

.btn-save:hover {
  background-color: #059669;
}

.btn-reset {
  background-color: #f3f4f6;
  color: #6b7280;
}

.btn-reset:hover {
  background-color: #e5e7eb;
}

.danger-zone {
  background: #fef2f2;
  border: 2px solid #fee2e2;
  border-radius: 8px;
  padding: 25px;
}

.danger-zone h3 {
  margin: 0 0 5px 0;
  color: #dc2626;
  font-size: 18px;
}

.danger-zone p {
  margin: 0 0 20px 0;
  color: #991b1b;
  font-size: 14px;
}

.danger-actions {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.btn-danger {
  padding: 10px 20px;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  transition: background-color 0.3s ease;
}

.btn-danger:hover {
  background-color: #dc2626;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .settings-grid {
    grid-template-columns: 1fr;
  }

  .settings-actions {
    flex-direction: column;
  }

  .btn-save,
  .btn-reset {
    width: 100%;
    justify-content: center;
  }

  .danger-actions {
    flex-direction: column;
  }

  .btn-danger {
    width: 100%;
    justify-content: center;
  }
}
</style>
