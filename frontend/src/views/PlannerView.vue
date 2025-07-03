<template>
  <div class="calendar w-full mx-auto">
    <div class="flex items-center">
      <Button @click="prevMonth">
        <FontAwesomeIcon :icon="['fas', 'angle-left']" class="m font-light" />
      </Button>
      <div class="flex items-center justify-center min-w-[20ch] font-bold">
        {{ formattedMonthYearTitle }}
      </div>
      <Button @click="nextMonth">
        <FontAwesomeIcon :icon="['fas', 'angle-right']" class="m font-light" />
      </Button>
    </div>
    <Accordion multiple>
      <AccordionPanel v-for="numberOfWeek in weekRange" :key="numberOfWeek" :value="numberOfWeek">
        <AccordionHeader>{{ numberOfWeek }} неделя </AccordionHeader>
        <AccordionContent>
          <div class="grid grid-cols-7 gap-4">
            <div v-for="day in getDaysOfWeek(week)" :key="day.formattedDate" class="flex items-center justify-center border-1 rounded-10 flex bg-teal-400 m-2">
            {{ day.dayName }}
          </div>
          </div>
          
        </AccordionContent>
      </AccordionPanel>
    </Accordion>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

// реактивное состояние
//const numberOfWeekStart =ref(1)
const numberOfWeekEnd = ref(5)
const currentDate = ref(new Date())
const currentMonthNumber = ref(currentDate.value.getMonth())

const reactiveDate = computed(() => {
  const year = currentDate.value.getFullYear()
  return new Date(year, currentMonthNumber.value, 1)
})

const formattedMonthYearTitle = computed(() => {
  const date = reactiveDate.value
  const month = date.toLocaleString('ru', { month: 'long' })
  const year = date.getFullYear()
  const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1)
  return `${capitalizedMonth} ${year}`
})

const firstWeekOfMonth = computed(() => {
  const startOfYear = new Date(reactiveDate.value.getFullYear(), 0, 1)
  const days = Math.floor((reactiveDate.value - startOfYear) / (24 * 60 * 60 * 1000))
  const weekNumber = Math.ceil((days + ((startOfYear.getDay() + 1) % 7)) / 7)
  if (weekNumber === 53) return 1
  return weekNumber
})

const lastWeekOfMonth = computed(() => {
  const year = reactiveDate.value.getFullYear()
  const month = reactiveDate.value.getMonth()
  const startOfYear = new Date(year, 0, 1)
  const lastDay = new Date(year, month + 1, 0)
  const days = Math.floor((lastDay - startOfYear) / (24 * 60 * 60 * 1000))
  const weekNumber = Math.ceil((days + ((startOfYear.getDay() + 1) % 7)) / 7)
  if (weekNumber === 53) return 1
  return weekNumber
})

const weekRange = computed(() => {
  const start = firstWeekOfMonth.value
  const end = lastWeekOfMonth.value
  const weeks = []
  for (let i = start; i <= end; i++) {
    weeks.push(i)
  }
  return weeks
})

const firstDayOfWeek = computed(() => {
  
})

// функции которые мутируют состояние и вызывают обновления
function nextMonth() {
  currentMonthNumber.value++
}

function prevMonth() {
  currentMonthNumber.value--
}

// === Вспомогательные функции ===

// Получить понедельник по номеру недели (ISO 8601)
function getMondayOfISOWeek(weekNumber, year) {
  const simple = new Date(year, 0, 1 + (weekNumber - 1) * 7)
  const firstDayOfWeek = simple.getDay()
  const mondayOffset = firstDayOfWeek === 1 ? 0 : firstDayOfWeek < 4 ? 1 : -3
  const thursday = new Date(simple.setDate(simple.getDate() + 4 - firstDayOfWeek))
  const monday = new Date(thursday.setDate(thursday.getDate() - 3))
  return monday
}

// Получить дни недели по её номеру
function getDaysOfWeek(weekNumber) {
  const year = reactiveDate.value.getFullYear()
  const monday = getMondayOfISOWeek(weekNumber, year)

  const daysOfWeek = [
    'Понедельник',
    'Вторник',
    'Среда',
    'Четверг',
    'Пятница',
    'Суббота',
    'Воскресенье',
  ]

  return daysOfWeek.map((dayName, index) => {
    const date = new Date(monday)
    date.setDate(monday.getDate() + index)
    return {
      dayName,
      date: `${date.getDate()} ${getMonthName(date.getMonth())}`,
      fullDate: date,
      formattedDate: formatDate(date),
    }
  })
}

// Форматирование даты
function formatDate(date) {
  const d = new Date(date)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${year}-${month}-${day}`
}

// Название месяца
function getMonthName(monthIndex) {
  const months = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ]
  return months[monthIndex]
}


// хуки жизненного цикла
onMounted(() => {
  console.log(firstWeekOfMonth.value)
  console.log(lastWeekOfMonth.value)
})
</script>