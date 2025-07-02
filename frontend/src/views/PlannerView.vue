<template>
  <div class="calendar w-full mx-auto">
    <div class="flex items-center">
      <Button></Button>
      <div class="ml-2 mr-2">
        {{ formattedMonthYearTitle }} 
      </div>
      <Button></Button>
    </div>
    <Accordion multiple>
      <AccordionPanel v-for="numberOfWeek in 10" :key="numberOfWeek" :value="numberOfWeek">
        <AccordionHeader>{{ numberOfWeek }} неделя </AccordionHeader>
        <AccordionContent> {{ numberOfWeek }} неделя </AccordionContent>
      </AccordionPanel>
    </Accordion>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// реактивное состояние
const count = ref(0)
const currentDate = ref(new Date())

const formattedMonthYear = computed(() => {
  const date = currentDate.value
  const month = date.toLocaleString('ru', { month: 'long' })
  const year = date.getFullYear()
  const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1)
  return `${capitalizedMonth} ${year}`
})



const currentMonthNumber = currentDate.value.getMonth()

// функции которые мутируют состояние и вызывают обновления
function increment() {
  count.value++
}

// хуки жизненного цикла
onMounted(() => {
  console.log(`Стартовое значение счётчика — ${count.value}.`)
})
</script>