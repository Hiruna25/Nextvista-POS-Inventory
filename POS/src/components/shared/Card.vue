<template>
  <div class="card">
    <div v-if="$slots.header" class="card-header">
      <slot name="header"></slot>
    </div>
    <div class="card-body">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
// Component for wrapping content in a card container
</script>

<style scoped>
.card {
  background-color: white;
  border-radius: 12px;
  border: 2px solid #f0f2f5;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  margin-bottom: 20px;
  transition: all 0.3s ease;
  overflow: hidden;
}

.card:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
  border-color: #e8ecf1;
}

.card-header {
  padding: 20px 25px;
  border-bottom: 1px solid #f0f2f5;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #f5f7ff 0%, #faf9ff 100%);
  flex-wrap: wrap;
  gap: 15px;
}

.card-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 10px;
}

.card-header h2 i {
  color: #667eea;
  font-size: 20px;
}

.card-body {
  padding: 25px;
}

@media (max-width: 768px) {
  .card-header {
    padding: 15px 20px;
    flex-direction: column;
    align-items: flex-start;
  }

  .card-body {
    padding: 15px 20px;
  }
}
</style>
