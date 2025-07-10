<template>
  <div class="flex flex-col border-1 border-gray-200 p-2" :id="eventId" @mouseenter="showPanel($event)" @mouseleave="hidePanel($event)" ref="itemContainer">



    <div class="title">{{ region }}</div>
    <div class="text">{{ text }}</div>
    <div class="sign">
      Отв. исп.:
      <br />
      {{ performer }}
    </div>
  </div>
  <Popover ref="itemMenu" :unstyled="true" :pt="{ root: { class: 'z-50 border-1 border-gray-200 bg-white shadow' } }">
      <Button variant="text" rounded icon="pi pi-pen-to-square" :size="small" v-tooltip.bottom="'Редактировать'" />
      <Button variant="text" rounded icon="pi pi-check-square" :size="small" v-tooltip.bottom="'Выполнено'" />
      <Button variant="text" rounded icon="pi pi-reply" :size="small" v-tooltip.bottom="'Перенос'" />
      <Button variant="text" rounded icon="pi pi-times" :size="small" v-tooltip.bottom="'Отменено'" />
      <Button variant="text" rounded icon="pi pi-trash" :size="small" v-tooltip.bottom="'Удалить'" />
  </Popover>
</template>

<script setup>
import { ref } from 'vue';

const itemMenu = ref(null)
const itemContainer = ref(null)

const showPanel = (event) => {
  const customTarget = itemContainer.value;
  itemMenu.value.show(event, customTarget);

}
const hidePanel = (event) => {
  const customTarget = itemContainer.value;
  itemMenu.value.hide(event, customTarget);
  }
</script>