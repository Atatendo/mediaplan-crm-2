<template>
  <div
    class="flex flex-col border-1 border-gray-200 p-2"
    :id="eventId"
    @mouseenter="showPanel($event)"
    @mouseleave="handleContainerLeave($event)"
    ref="itemContainer"
  >
    <div class="font-bold">{{ region }}</div>
    <div class="text-justify">{{ text }}</div>
    <div class="font-bold italic">
      Отв. исп.:<br />
      {{ performer }}
    </div>
  </div>

  <Popover
    ref="itemMenu"
    :unstyled="true"
    :pt="{
      root: {
        class: 'flex flex-wrap justify-center gap-2 z-50 border-1 border-gray-200 bg-white shadow'
      }
    }"
    :style="{ minWidth: itemContainerWidth + 'px' }"
    @mouseleave="handleMenuLeave($event)"
  >
    <Button variant="text" rounded icon="pi pi-pen-to-square" size="small" v-tooltip.bottom="'Редактировать'" />
    <Button variant="text" rounded icon="pi pi-check-square" size="small" v-tooltip.bottom="'Выполнено'" />
    <Button variant="text" rounded icon="pi pi-reply" size="small" v-tooltip.bottom="'Перенос'" />
    <Button variant="text" rounded icon="pi pi-times" size="small" v-tooltip.bottom="'Отменено'" />
    <Button variant="text" rounded icon="pi pi-trash" size="small" v-tooltip.bottom="'Удалить'" />
  </Popover>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  region: String,
  text: String,
  performer: String,
  eventId: String
})

const itemMenu = ref(null)
const itemContainer = ref(null)
const itemContainerWidth = ref(0)

// Функция обновления ширины Popover вручную
const updateMenuWidth = () => {
  if (itemMenu.value && itemMenu.value.container) {
    const width = itemContainer.value.getBoundingClientRect().width
    itemMenu.value.container.style.minWidth = width + 'px'
  }
}

// Показываем Popover и обновляем ширину
const showPanel = (event) => {
  const target = itemContainer.value
  if (!target) return

  const width = target.getBoundingClientRect().width
  itemContainerWidth.value = width

  // Если Popover уже открыт — обновляем его ширину
  if (itemMenu.value && itemMenu.value.container) {
    itemMenu.value.container.style.minWidth = width + 'px'
  }

  itemMenu.value.show(event, target)
}

// Скрытие Popover при уходе с контейнера
const handleContainerLeave = (event) => {
  const relatedTarget = event.relatedTarget
  if (!itemMenu.value?.container?.contains(relatedTarget)) {
    itemMenu.value.hide(event, itemContainer.value)
  }
}

// Скрытие Popover при уходе с меню
const handleMenuLeave = (event) => {
  const relatedTarget = event.relatedTarget
  const container = itemContainer.value
  const menu = itemMenu.value?.container

  if (!menu?.contains(relatedTarget) && !container?.contains(relatedTarget)) {
    itemMenu.value.hide(event, container)
  }
}

// Наблюдатель за изменением размера контейнера
const observer = new ResizeObserver((entries) => {
  for (let entry of entries) {
    const width = entry.contentBoxSize[0].inlineSize
    itemContainerWidth.value = width
    updateMenuWidth()
  }
})

onMounted(() => {
  if (itemContainer.value) {
    observer.observe(itemContainer.value)
  }
})

onUnmounted(() => {
  observer.disconnect()
})
</script>