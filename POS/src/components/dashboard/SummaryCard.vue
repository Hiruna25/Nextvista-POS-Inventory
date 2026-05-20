<template>
  <div class="summary-card" :class="config.class">
    <div class="card-header">
      <div class="card-title-section">
        <h3>{{ config.title }}</h3>
      </div>
      <div class="card-icon" :class="config.class">
        <i v-if="config.icon" :class="config.icon"></i>
      </div>
    </div>

    <div class="card-value">
      <p>{{ value }}</p>
    </div>

    <div v-if="trend !== 0" class="trend" :class="trend > 0 ? 'trend-positive' : 'trend-negative'">
      <i :class="trend > 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
      <span>{{ Math.abs(trend) }}% from last month</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  value: string | number
  trend: number
  config: {
    title: string
    class: string
    icon?: string
  }
}>()
</script>

<style scoped>
.summary-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  border: 2px solid #f0f2f5;
  transition: all 0.3s ease;
  overflow: hidden;
  position: relative;
}

.summary-card:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
  border-color: #e8ecf1;
  transform: translateY(-4px);
}

.summary-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.summary-card:hover::before {
  opacity: 1;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.card-title-section h3 {
  font-size: 13px;
  color: #7f8c8d;
  margin: 0;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card-icon {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

.card-icon.warning {
  background: linear-gradient(135deg, #f39c12 0%, #d68910 100%);
}

.card-icon.danger {
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
}

.card-icon.success {
  background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
}

.card-icon.info {
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
}

.card-icon:not(.warning):not(.danger):not(.success):not(.info) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.card-value p {
  font-size: 32px;
  font-weight: 800;
  margin: 0 0 12px 0;
  color: #2c3e50;
  letter-spacing: -0.5px;
}

.trend {
  font-size: 12px;
  color: #7f8c8d;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
}

.trend i {
  font-size: 14px;
}

.trend-positive {
  color: #27ae60;
}

.trend-positive i {
  color: #27ae60;
}

.trend-negative {
  color: #e74c3c;
}

.trend-negative i {
  color: #e74c3c;
}

@media (max-width: 768px) {
  .summary-card {
    padding: 18px;
  }

  .card-value p {
    font-size: 24px;
  }

  .card-icon {
    width: 40px;
    height: 40px;
    font-size: 18px;
  }
}
</style>
