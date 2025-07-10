<template>
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
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue'
import { MONTHS } from '@/constants/date'

const props = defineProps(['currentDate'])
const emit = defineEmits(['update:currentDate'])

const currentDate = ref(new Date());
const currentMonthNumber = ref(currentDate.value.getMonth());
const currentYear = ref(currentDate.value.getFullYear());

const popupContainerRef = ref(null);
const isPopoverVisible = ref(false);
const monthPanel = ref();
const yearPanel = ref();

const isMonthPanelShow = ref(false);
const isYearPanelShow = ref(false);

const calendarMode = ref('monthYear');

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
  monthPanel.value.toggle(event, customTarget);
}

const showMonthPanel = () => {
  isMonthPanelShow.value = true;
}

const hideMonthPanel = () => {
  isMonthPanelShow.value = false;
}

function selectMonth(month) {
  currentMonthNumber.value = month;
  monthStructureUpdate();
  monthPanel.value.hide();
}

function nextMonth() {
  if (currentMonthNumber.value === 11) {
    currentMonthNumber.value = 0;
    currentYear.value++;
  } else {
    currentMonthNumber.value++;
  }
  monthStructureUpdate();
}

function prevMonth() {
  if (currentMonthNumber.value === 0) {
    currentMonthNumber.value = 11;
    currentYear.value--;
  } else {
    currentMonthNumber.value--;
  }
  monthStructureUpdate();
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
  currentYear.value = year;
  monthStructureUpdate();
  yearPanel.value.hide();
}

function nextYear() {
  currentYear.value++;
  monthStructureUpdate();
}

function prevYear() {
  currentYear.value--;
  monthStructureUpdate();
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

</script>