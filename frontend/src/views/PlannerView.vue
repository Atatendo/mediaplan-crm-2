<template>
  <div class="calendar w-full mx-auto">
    <div class="flex items-center justify-left mx-auto p-2 border-0 rounded shadow-none">
      
      <Button @click="prevMonth" class="">
        <FontAwesomeIcon :icon="['fas', 'angle-left']" class="m font-light" />
      </Button>

      <div class="flex flex-col items-center justify-center min-w-[16ch] font-bold ml-2 mr-2">
        <span @click="toggleMonthPanel" class="px-2 py-1 cursor-pointer hover:bg-gray-200 rounded">
          {{ currentMonthName }}
        </span>
        <span @click="toggleYearPanel" class="px-2 py-1 cursor-pointer hover:bg-gray-200 rounded">
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
    <AccordionPanel v-for="week in calendarData" :value="week.weekNumber">
      <AccordionHeader>{{ week.weekNumber }} неделя </AccordionHeader>
      <AccordionContent>
        <div class="grid grid-cols-7 gap-4">
          <div v-for="day in week.days" :key="day.formattedDate"
            class="w-full flex flex-col items-center justify-center font-bold rounded-xl m-2" :style="{
              background: index > 4 ? '#ef4444' : '#22d3ee',
            }">
            <span>{{ day.dayName }}</span>
            <span>{{ day.titleDate }}</span>
          </div>
        </div>
      </AccordionContent>
    </AccordionPanel>
  </Accordion>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { MONTHS } from '@/constants/date'

const currentDate = ref(new Date())
const currentMonthNumber = ref(currentDate.value.getMonth())
const currentYear = ref(currentDate.value.getFullYear())
const calendarData = ref(null)

function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? - 6 : 1);
  return new Date(d.setDate(diff));
}

const dayNames = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];

function getDayName(date) {
  return dayNames[date.getDay()];
}

function getMonthStructure(year, month) {
  const weeks = [];
  let currentDate = getMonday(new Date(year, month, 1));

  do {
    const weekDays = [];

    for (let i = 0; i < 7; i++) {
      const current = new Date(currentDate);

      weekDays.push({
        date: formatDate(current),
        year: current.getFullYear(),
        month: current.getMonth(),
        day: current.getDate(),
        dayName: getDayName(current),
        titleDate: titleDate(current.getDate(), current.getMonth()),
        inCurrentMonth: current.getMonth() === month
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Получаем дату первого дня недели
    const firstDayOfWeek = new Date(weekDays[0].year, weekDays[0].month, weekDays[0].day);
    const weekNumber = getISOWeekNumber(firstDayOfWeek); // ✅ Передаём первый день недели

    weeks.push({
      weekNumber,
      year: weekDays[0].year,
      days: weekDays
    });

  } while (
    currentDate.getMonth() === month || // продолжаем пока месяц совпадает
    currentDate.getDay() !== 1 // или до следующего понедельника
  );

  return weeks;
}

function formatDate(date) {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${month}-${day}`;
}

function titleDate(day, month) {
    return `${day} ${MONTHS.genitive[month]}`;
}


/*const reactiveDate = computed(() => {
  return new Date(currentYear.value, currentMonthNumber.value, 1)
})*/

const currentMonthName = computed(() => {
  return MONTHS.accusativeFirstUpper[currentMonthNumber.value]
})

function getISOWeekNumber(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const dayOfWeek = d.getDay();    
    const diff = d.getDate() - d.getDay() + (d.getDay() === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));

    const yearStart = new Date(monday.getFullYear(), 0, 1);
    const yearStartMonday = new Date(yearStart);
    const startDay = yearStart.getDay();
    yearStartMonday.setDate(yearStart.getDate() + (startDay === 1 ? 0 : startDay > 1 ? 8 - startDay : 1));

    const weekNumber = Math.round((((monday - yearStartMonday) / 86400000) + yearStartMonday.getDate() - 1) / 7) + 1;
    return weekNumber;
}

function nextMonth() {
  if (currentMonthNumber.value === 11) {
      currentMonthNumber.value = 0;
      currentYear.value++; 
  } 
  else {
    currentMonthNumber.value++;
  }
  monthStructureUpdate()
}

function prevMonth() {
  if (currentMonthNumber.value === 0) {
      currentMonthNumber.value = 11;
      currentYear.value--; 
  } 
  else {
    currentMonthNumber.value--;
  }
  monthStructureUpdate()
}

function monthStructureUpdate() {
  calendarData.value = getMonthStructure(currentYear.value, currentMonthNumber.value);
}
const toggleMonthPanel = (event) => {
  monthPanel.value.toggleMonthPanel(event)
}

// хуки жизненного цикла
onMounted(() => {  
  monthStructureUpdate()
})
</script>
