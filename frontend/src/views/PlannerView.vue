<template>
  <div class="calendar w-full mx-auto">
    <div class="flex items-center justify-left mx-auto p-2 border-0 rounded shadow-none">
      
      <Button @click="prevMonth">
        <FontAwesomeIcon :icon="['fas', 'angle-left']" class="m font-light" />
      </Button>

      <div class="flex items-center justify-center min-w-[20ch] font-bold">
        <span @click="toggleMonthPanel" class="px-2 py-1 cursor-pointer hover:bg-gray-100 rounded">
          {{ currentMonthName }}
        </span>
        <span @click="toggleYearPanel" class="px-2 py-1 cursor-pointer hover:bg-gray-100 rounded">
          {{ currentYear }}
        </span>
      </div>
      
      <Button @click="nextMonth">
        <FontAwesomeIcon :icon="['fas', 'angle-right']" class="m font-light" />
      </Button>

      <Popover ref="monthPanel" :pt="{ root: { class: 'z-50' } }">
        <div class="grid grid-cols-3 gap-1">
          <template v-for="(m, i) in monthNames" :key="i">
            <button @click="selectMonth(i)" class="py-1 px-3 rounded hover:bg-blue-100"
              :class="{ 'bg-emerald-500 text-white': i === currentMonth }">
              {{ m }}
            </button>
          </template>
        </div>
      </Popover>

      <Popover ref="yearPanel" :pt="{ root: { class: 'z-50' } }">
        <div class="grid grid-cols-2 gap-1">
          <template v-for="y in yearRange" :key="y">
            <button @click="selectYear(y)" class="py-1 px-3 rounded hover:bg-blue-100"
              :class="{ 'bg-emerald-500 text-white': y === currentYear }">
              {{ y }}
            </button>
          </template>
        </div>
      </Popover>
    </div>
  </div>
  <Accordion multiple class="mt-2">
    <AccordionPanel v-for="numberOfWeek in weekRange" :key="numberOfWeek" :value="numberOfWeek">
      <AccordionHeader>{{ numberOfWeek }} неделя </AccordionHeader>
      <AccordionContent>
        <div class="grid grid-cols-7 gap-4">
          <div v-for="(day, index) in getDaysOfWeek(numberOfWeek)" :key="day.formattedDate"
            class="w-full flex flex-col items-center justify-center font-bold rounded-xl m-2" :style="{
              background: index > 4 ? '#ef4444' : '#22d3ee',
            }">
            <span>{{ day.dayName }}</span>
            <span>{{ day.date }}</span>
          </div>
        </div>
      </AccordionContent>
    </AccordionPanel>
  </Accordion>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

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
  const weekNumber = Math.ceil((days + ((startOfYear.getDay() + 0) % 7)) / 7)
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

// === Вспомогательные функции ===

// Получить понедельник по номеру недели (ISO 8601)
function getMondayOfISOWeek(weekNumber, year) {
  const simple = new Date(year, 0, 1 + (weekNumber - 1) * 7)
  const firstDayOfWeek = simple.getDay()
  const thursday = new Date(simple.setDate(simple.getDate() + 4 - firstDayOfWeek))
  const monday = new Date(thursday.setDate(thursday.getDate() - 3))
  console.log(monday)
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
function getMonthName(month) {
  const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  return months[month];
}

const toggleMonthPanel = (event) => {
  monthPanel.value.toggleMonthPanel(event)
}

// хуки жизненного цикла
onMounted(() => {
})
</script>
