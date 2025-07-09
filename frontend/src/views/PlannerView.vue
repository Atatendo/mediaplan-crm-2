<template>
  <div class="calendar w-full mx-auto">
    <div class="flex items-center justify-left mx-auto p-2 border-0 rounded shadow-none">
      <div class="flex flex-col w-100" ref="popupContainerRef">
        <!-- Отрисовка календаря обычный режим -->
        <div v-if="calendarMode === 'monthYear'" class="flex justify-between w-full items-center">
          <Button @click="prevMonth" variant="text" rounded>
            <FontAwesomeIcon :icon="['fas', 'angle-left']" class="m font-light" />
          </Button>
          <div class="flex items-center justify-center font-bold ml-2 mr-2">
            <span @click="toggleMonthPanel($event)" class="px-2 py-1 cursor-pointer hover:bg-gray-200 rounded">
              {{ currentMonthName }} {{ currentYear }}
            </span>
          </div>
          <Button @click="nextMonth" variant="text" rounded>
            <FontAwesomeIcon :icon="['fas', 'angle-right']" class="m font-light" />
          </Button>
        </div>
        <!-- Отрисовка календаря месяцы года -->
        <div v-if="calendarMode === 'month'" class="flex justify-center w-full items-center">
          
          <div class="flex items-center justify-center font-bold ml-2 mr-2">            
            <span @click="toggleYearPanel($event)" class="px-2 py-1 cursor-pointer hover:bg-gray-200 rounded">
              {{ currentYear }}
            </span>
          </div>
        </div>
        <!-- Отрисовка календаря декада -->
        <div v-if="calendarMode === 'decade'" class="flex justify-center w-full items-center">
          <div class="flex items-center justify-center font-bold ml-2 mr-2">
            <span @click="toggleMonthPanel($event)" class="px-2 py-1 cursor-pointer hover:bg-gray-200 rounded">
              {{ startDecade }} &ndash; {{ endDecade }}
            </span>
          </div>
        </div>
      </div>
      <Popover ref="monthPanel" :unstyled="true" :pt="{ root: { class: 'w-100 z-50 border-1 border-gray-200 bg-white shadow' } }" @show="showMonthPanel" @hide="hideMonthPanel">
        <div class="flex justify-between">
          <Button @click="prevYear" variant="text" rounded>
            <FontAwesomeIcon :icon="['fas', 'angle-left']" class="m font-light" />
          </Button>
          <div class="grid grid-cols-3 gap-1 p-4">
            <button v-for="(m, i) in MONTHS.accusativeFirstUpper" :key="i" @click="selectMonth(i)" class="py-1 px-3 rounded hover:bg-blue-100" :class="{ 'bg-emerald-500 text-white shadow': i === currentMonthNumber }" >
              {{ m }}
            </button>
          </div>       
          <Button @click="nextYear" variant="text" rounded>
            <FontAwesomeIcon :icon="['fas', 'angle-right']" class="m font-light" />
          </Button> 
        </div>        
      </Popover>
      <Popover ref="yearPanel" :unstyled="true" :pt="{ root: { class: 'w-100 z-50 border-1 border-gray-200 bg-white' } }" @show="showYearPanel" @hide="hideYearPanel">        
        <div class="flex justify-between">
          <Button @click="prevDecade" variant="text" rounded>
            <FontAwesomeIcon :icon="['fas', 'angle-left']" class="m font-light" />
          </Button>
          <div class="grid grid-cols-2 gap-1 w-full p-4">
            <button v-for="y in YEARS" :key="y" @click="selectYear(y)" class="py-1 px-3 rounded hover:bg-blue-100" :class="{ 'bg-emerald-500 text-white': y === currentYear }">
              {{ y }}
            </button>
          </div>
          <Button @click="nextDecade" variant="text" rounded>
            <FontAwesomeIcon :icon="['fas', 'angle-right']" class="m font-light" />
          </Button>
        </div>
      </Popover>      
    </div>
    <Accordion multiple class="mt-2">
      <AccordionPanel v-for="week in calendarData" :value="week.weekNumber" :key="week.weekNumber">
        <AccordionHeader
          >{{ week.weekNumber }} неделя | c {{ week.days[0].titleDate }} по
          {{ week.days[6].titleDate }}</AccordionHeader
        >
        <AccordionContent>
          <div class="grid grid-cols-7 gap-2" mt-2>
            <div v-for="day in week.days" :key="day.date">
              <div
                class="w-full flex flex-col items-center justify-center font-bold rounded-xl"
                :style="{
                  background: day.dayIndex > 4 ? '#ef4444' : '#22d3ee',
                }"
              >
                <span>{{ day.dayName }}</span>
                <span>{{ day.titleDate }}</span>
              </div>
              <div class="flex flex-col justify-center mt-2 gap-2">
                <ItemPost
                  v-for="event in eventsByDate[day.date]"
                  :key="event.id"
                  :region="event.region"
                  :text="event.text"
                  :performer="event.performer"
                />
                <Button
                  class="mx-auto max-w-fit"
                  :key="day.date"
                  @click="() => addEvent(day.currentDate)"
                >
                  <FontAwesomeIcon :icon="['fas', 'plus']" />
                </Button>
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionPanel>
    </Accordion>
    <Dialog
      v-model:visible="visible"
      modal
      closeOnEscape
      header="Добавить мероприятие"
      :pt="{
        headerActions: {
          style: { display: 'none' },
        },
      }"
      @update:visible="onHide"
      :style="{ width: '25rem' }"
    >
      <div class="flex flex-col gap-4">
        <div>
          <DatePicker
            v-model="selectedDate"
            dateFormat="dd.mm.yy"
            :showIcon="true"
            class="w-full"
          />
        </div>
        <div>
          <Select
            v-if="PERFORMER === 'admin'"
            v-model="selectedCity"
            :options="cities"
            optionLabel="name"
            placeholder="Выберите регион"
            class="w-full"
          />
        </div>
        <div>
          <Textarea
            v-model="value3"
            size="large"
            placeholder="Введите описание мероприятия"
            rows="6"
            class="w-full"
          />
        </div>
        <div>
          <Select
            v-model="selectedPerformer"
            :options="performers"
            optionLabel="name"
            placeholder="Выберите исполнителя"
            class="w-full"
          />
        </div>
        <div class="flex justify-center gap-4">
          <Button
            type="button"
            label="Отменить"
            severity="secondary"
            @click="visible = false"
          ></Button>
          <Button type="button" label="Добавить" @click="visible = false"></Button>
        </div>
      </div>
    </Dialog>
    <ConfirmDialog></ConfirmDialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watchEffect } from 'vue'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'

import { MONTHS } from '@/constants/date'

const confirm = useConfirm()
const toast = useToast()

onMounted(() => {
})

/*   Тестирование   */
const PERFORMER = 'admin'

/*   Управление календарём   */

const popupContainerRef = ref(null)
const isPopoverVisible = ref(false)
const monthPanel = ref()
const yearPanel = ref()

const isMonthPanelShow = ref(false);
const isYearPanelShow = ref(false);

const calendarMode = ref('monthYear')

const decadeOffset = ref(0); 

watchEffect(() => {
  if (!isMonthPanelShow.value && !isYearPanelShow.value) {
    calendarMode.value = 'monthYear';
    decadeOffset.value = 0;
  }
  else if (isMonthPanelShow.value && !isYearPanelShow.value) {
    calendarMode.value = 'month';
  }
  else if (!isMonthPanelShow.value && isYearPanelShow.value) {
    calendarMode.value = 'decade';
  }
})

const toggleMonthPanel = (event) => {
  const customTarget = popupContainerRef.value;
  monthPanel.value.toggle(event, customTarget)
}

const showMonthPanel = () => {
  isMonthPanelShow.value = true;
}

const hideMonthPanel = () => {
  isMonthPanelShow.value = false;
}

function selectMonth(month) {
  currentMonthNumber.value = month
  monthStructureUpdate()
  monthPanel.value.hide()
}

function nextMonth() {
  if (currentMonthNumber.value === 11) {
    currentMonthNumber.value = 0
    currentYear.value++
  } else {
    currentMonthNumber.value++
  }
  monthStructureUpdate()
}

function prevMonth() {
  if (currentMonthNumber.value === 0) {
    currentMonthNumber.value = 11
    currentYear.value--
  } else {
    currentMonthNumber.value--
  }
  monthStructureUpdate()
}

const toggleYearPanel = (event) => {
  const customTarget = popupContainerRef.value;
  yearPanel.value.toggle(event, customTarget);
}

const showYearPanel = () => {
  isYearPanelShow.value = true;
}

const hideYearPanel = () => {
  isYearPanelShow.value = false;
}

function selectYear(year) {
  currentYear.value = year
  monthStructureUpdate()
  yearPanel.value.hide()
}

function nextYear() {
  currentYear.value++
  monthStructureUpdate()
}

function prevYear() {
  currentYear.value--
  monthStructureUpdate()
}

const startDecade = computed(() => {
  const base = Math.floor(currentYear.value / 10) * 10;
  return base + decadeOffset.value;
});

const endDecade = computed(() => { 
  const end = startDecade.value + 9;
  return end;
})

const YEARS = computed(() => {
  const decade = [];
  for (let i = 0; i < 10; i++) {
    decade.push(startDecade.value + i);
  }
  return decade;
});

function nextDecade() {
  decadeOffset.value += 10;
}

function prevDecade() {
  decadeOffset.value -= 10;
}

/*   Модальное окно добавление записи   */

const selectedCity = ref()
const selectedPerformer = ref()
const selectedDate = ref(null)
const value3 = ref()

const visible = ref(false)

function addEvent(date) {
  visible.value = true
  selectedDate.value = date
}

function clearModal() {
  selectedCity.value = null
}

function onHide() {
  confirm1()
}

const confirm1 = () => {
  confirm.require({
    message: 'Are you sure you want to proceed?',
    header: 'Confirmation',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true,
    },
    acceptProps: {
      label: 'Save',
    },
    accept: () => {
      toast.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 })
    },
    reject: () => {
      toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 })
    },
  })
}

/*   Отрисовка сетки мероприятий   */

const currentDate = ref(new Date())
const currentMonthNumber = ref(currentDate.value.getMonth())
const currentYear = ref(currentDate.value.getFullYear())
const calendarData = ref(null)

function getMonday(date) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  return new Date(d.setDate(diff))
}

const dayNames = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота']

const eventsByDate = computed(() => {
  const map = {}
  eventsData.value.forEach((event) => {
    const date = event.date
    if (!map[date]) map[date] = []
    map[date].push(event)
  })
  return map
})

function getDayName(date) {
  return dayNames[date.getDay()]
}

function getMonthStructure(year, month) {
  const weeks = []
  let currentDate = getMonday(new Date(year, month, 1))

  do {
    const weekDays = []

    for (let i = 0; i < 7; i++) {
      const current = new Date(currentDate)

      weekDays.push({
        currentDate: current,
        date: formatDate(current),
        year: current.getFullYear(),
        month: current.getMonth(),
        day: current.getDate(),
        dayName: getDayName(current),
        dayIndex: i,
        titleDate: titleDate(current.getDate(), current.getMonth()),
        inCurrentMonth: current.getMonth() === month,
      })

      currentDate.setDate(currentDate.getDate() + 1)
    }

    // Получаем дату первого дня недели
    const firstDayOfWeek = new Date(weekDays[0].year, weekDays[0].month, weekDays[0].day)
    const weekNumber = getISOWeekNumber(firstDayOfWeek) // ✅ Передаём первый день недели

    weeks.push({
      weekNumber,
      year: weekDays[0].year,
      days: weekDays,
    })
  } while (
    currentDate.getMonth() === month || // продолжаем пока месяц совпадает
    currentDate.getDay() !== 1 // или до следующего понедельника
  )

  return weeks
}

function formatDate(date) {
  const d = new Date(date)
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${month}-${day}`
}

function titleDate(day, month) {
  return `${day} ${MONTHS.genitive[month]}`
}

const currentMonthName = computed(() => {
  return MONTHS.accusativeFirstUpper[currentMonthNumber.value]
})

function getISOWeekNumber(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  const dayOfWeek = d.getDay()
  const diff = d.getDate() - d.getDay() + (d.getDay() === 0 ? -6 : 1)
  const monday = new Date(d.setDate(diff))

  const yearStart = new Date(monday.getFullYear(), 0, 1)
  const yearStartMonday = new Date(yearStart)
  const startDay = yearStart.getDay()
  yearStartMonday.setDate(
    yearStart.getDate() + (startDay === 1 ? 0 : startDay > 1 ? 8 - startDay : 1)
  )

  const weekNumber =
    Math.round(((monday - yearStartMonday) / 86400000 + yearStartMonday.getDate() - 1) / 7) + 1
  return weekNumber
}

function monthStructureUpdate() {
  calendarData.value = getMonthStructure(currentYear.value, currentMonthNumber.value)
}

// хуки жизненного цикла
onMounted(() => {
  monthStructureUpdate()
})

const performers = ref([
  { name: 'Иванов', code: 'NY' },
  { name: 'Петров', code: 'RM' },
  { name: 'Сидоров', code: 'LDN' },
  { name: 'Зайцев', code: 'IST' },
])

const cities = ref([
  { name: 'New York', code: 'NY' },
  { name: 'Rome', code: 'RM' },
  { name: 'London', code: 'LDN' },
  { name: 'Istanbul', code: 'IST' },
  { name: 'Paris', code: 'PRS' },
])

const eventsData = ref([
  // 📅 Июнь 2025
  {
    id: 1,
    region: 'Москва',
    text: 'Концерт группы "Любэ"',
    performer: 'Любэ',
    date: '2025-06-30',
  },

  // 📅 Июль 2025
  {
    id: 2,
    region: 'Санкт-Петербург',
    text: 'Выставка современного искусства',
    performer: 'Галерея "Арт-Пространство"',
    date: '2025-07-03',
  },
  {
    id: 3,
    region: 'Екатеринбург',
    text: 'Технологическая конференция',
    performer: 'IT Experts Group',
    date: '2025-07-05',
  },
  {
    id: 4,
    region: 'Новосибирск',
    text: 'Научный симпозиум',
    performer: 'Сибирская академия наук',
    date: '2025-07-06',
  },
  {
    id: 5,
    region: 'Казань',
    text: 'Фестиваль татарской культуры',
    performer: 'Национальный культурный центр',
    date: '2025-07-08',
  },
  {
    id: 6,
    region: 'Сочи',
    text: 'Музыкальный фестиваль «Black Sea Fest»',
    performer: 'DJ Max & Friends',
    date: '2025-07-10',
  },
  {
    id: 7,
    region: 'Владивосток',
    text: 'Фудмаркет у моря',
    performer: 'Local Street Food',
    date: '2025-07-12',
  },
  {
    id: 8,
    region: 'Москва',
    text: 'Фестиваль уличной еды',
    performer: 'Street Food Team',
    date: '2025-07-15',
  },
  {
    id: 9,
    region: 'Санкт-Петербург',
    text: 'Джазовый вечер на набережной',
    performer: 'Jazz Band',
    date: '2025-07-17',
  },
  {
    id: 10,
    region: 'Екатеринбург',
    text: 'Рок-фестиваль',
    performer: 'Rock Legends',
    date: '2025-07-19',
  },
  {
    id: 11,
    region: 'Новосибирск',
    text: 'Праздник города',
    performer: 'Городская администрация',
    date: '2025-07-20',
  },
  {
    id: 12,
    region: 'Казань',
    text: 'Международная ярмарка ремёсел',
    performer: 'Гильдия мастеров',
    date: '2025-07-22',
  },
  {
    id: 13,
    region: 'Сочи',
    text: 'Фестиваль кино и документальных фильмов',
    performer: 'Киносоюз РФ',
    date: '2025-07-24',
  },
  {
    id: 14,
    region: 'Владивосток',
    text: 'Фестиваль азиатского кино',
    performer: 'Дальневосточный киноклуб',
    date: '2025-07-27',
  },
  {
    id: 15,
    region: 'Москва',
    text: 'Концерт молодых исполнителей',
    performer: 'PRIMORSK Music School',
    date: '2025-07-29',
  },
  {
    id: 16,
    region: 'Санкт-Петербург',
    text: 'Театрализованное представление "Гроза"',
    performer: 'Академический театр драмы',
    date: '2025-07-31',
  },

  // 📅 Август 2025
  {
    id: 17,
    region: 'Екатеринбург',
    text: 'Выставка технологий будущего',
    performer: 'Tech Future Lab',
    date: '2025-08-01',
  },
  {
    id: 18,
    region: 'Новосибирск',
    text: 'Кино под открытым небом',
    performer: 'Киноклуб "Свет"',
    date: '2025-08-03',
  },
])
</script>
