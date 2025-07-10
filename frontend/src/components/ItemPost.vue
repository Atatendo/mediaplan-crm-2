<template>
    <div class="flex flex-col border-1 border-gray-200 p-2" :id="eventId" @mouseenter="showPanel($event)"
        @mouseleave="handleContainerLeave($event)" ref="itemContainer">
        <div class="font-bold">{{ region }}</div>
        <div class="text-justify">{{ text }}</div>
        <div class="font-bold italic">
            Отв. исп.:
            <br />
            {{ performer }}
        </div>
    </div>
    <Popover ref="itemMenu" :unstyled="true"
        :pt="{ root: { class: 'flex justify-center z-50 border-1 border-gray-200 bg-white shadow' } }"
        :style="{ minWidth: itemContainerWidth + 'px' }" @mouseleave="handleMenuLeave($event)">
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
const itemContainerWidth = ref(0)

const props = defineProps({
  region: String,
  text: String,
  performer: String,
  eventId: String
})

const showPanel = (event) => {
    const customTarget = itemContainer.value;
    if (customTarget) {
        itemContainerWidth.value = itemContainer.value.getBoundingClientRect().width;
        itemMenu.value.show(event, customTarget);
    }
}

const handleContainerLeave = (event) => {
    const customTarget = itemContainer.value;
    const relatedTarget = event.relatedTarget;
    if (!itemMenu.value.container.contains(relatedTarget)) {
        itemMenu.value.hide(event, customTarget);
    }
}

const handleMenuLeave = (event) => {
    const customTarget = itemContainer.value;
    const relatedTarget = event.relatedTarget;
    if (!itemMenu.value.container.contains(relatedTarget) && !itemContainer.value.contains(relatedTarget)) {
        itemMenu.value.hide(event, customTarget);
    }
}
</script>