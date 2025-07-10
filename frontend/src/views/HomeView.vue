<template>
  <div 
    @mouseenter="showPanel" 
    @mouseleave="hidePanel"
    :class="['test-box', { hovered: isHovered }]"
  >
    Наведи на меня
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isHovered = ref(false)

const showPanel = () => {
  isHovered.value = true;
}

const hidePanel = () => {
  isHovered.value = false;
}
</script>

<style scoped>
.test-box {
  padding: 20px;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  width: 200px;
  text-align: center;
  transition: all 0.2s ease;
}

.test-box.hovered {
  background-color: #d0ebff;
  border-color: #007bff;
  transform: scale(1.05);
}
</style>