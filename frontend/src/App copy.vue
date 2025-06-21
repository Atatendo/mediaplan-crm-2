<template>    
    <div class="container">
        <Dock :model="menuItems">
            
        </Dock>
        <div id="NavBar">
            <SystemClock />
        </div>
        <div id="MainBar">
            <div class="MainContainer">
                <Modal :dateId="dateId" :isOpen="isModalOpen" :regions="regions" :performers="performers"
                    @submit="handleSubmit" @cancel="closeModal" />
                <div class="mainHeader">
                    <WeekChanger :weekNumber="currentWeekNumber" @week-action="handleWeekAction" />
                    <div class="main" :style="{ paddingRight: this.scrollWidth}">
                        <div class="" v-for="(day, index) in weekDays" :key="index">
                            <div :class="index >= 5 ? 'dayOfWeekEnd dateId' : 'dayOfWeek dateId'">
                                {{ day.dayOfWeek }}<br />
                                {{ day.date }}
                            </div>
                        </div>
                    </div>
                </div>     
                <div class="main isScroll scrollable">
                        <div class="dayEventsList" v-for="(day, index) in weekDays" :key="index"
                            :id="day.formattedDate">
                            <ItemPost v-for="event in getEventsForDay(day.formattedDate)" :key="event.id" :eventId="event.id"
                        :region="event.region" :text="event.text" :performer="event.performer"
                        @deleteEvent="deleteEvent" />
                        <AddEventButton @openModal="handleOpenmodal" :dateId="day.formattedDate" />
                        </div>
                    </div>
            </div>
        </div>

    </div>

</template>

<script>
import axios from 'axios';
import ItemPost from './components/ItemPost.vue';
import AddEventButton from './components/Buttons/AddEventButton.vue';
import SystemClock from './components/SystemClock.vue';
import WeekChanger from './components/WeekChanger.vue';
import Modal from './components/modals/addEvent.vue';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export default {
    name: 'App',
    components: {
        ItemPost,
        SystemClock,
        AddEventButton,
        Modal,
        WeekChanger
    },
    data() {
        return {
            isModalOpen: false,            
            regions: ['Новосибирская область', 'Томская область', 'Республика Тыва'],
            performers: [],
            currentDate: new Date(),
            events: [],
            isFetching: false,
            isDataBaseAvalable: '',
            dateId: '',
            scrollWidth: '0px',
            dbStatus: null,
            stompClient: null // реактивное состояние для клиента
        };
    },
    computed: {
        currentWeekNumber() {
            const startOfYear = new Date(this.currentDate.getFullYear(), 0, 1);
            const days = Math.floor((this.currentDate - startOfYear) / (24 * 60 * 60 * 1000));
            const weekNumber = Math.ceil((days + ((startOfYear.getDay() + 1) % 7)) / 7);
            return weekNumber === 53 ? 1 : weekNumber;
        },
        weekDays() {
            const daysOfWeek = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];
            const weekStart = new Date(this.currentDate);
            weekStart.setDate(this.currentDate.getDate() - this.currentDate.getDay() + 1);

            return daysOfWeek.map((day, index) => {
                const date = new Date(weekStart);
                date.setDate(weekStart.getDate() + index);

                return {
                    dayOfWeek: day,
                    date: `${date.getDate()} ${this.getMonthName(date.getMonth())}`,
                    formattedDate: this.formatDate(date)
                };
            });
        }
    },
    methods: {
        handleOpenmodal(id) {
            this.dateId = id;
            this.isModalOpen = true;
        },
        closeModal() {
            this.isModalOpen = false;
        },
        async handleSubmit() {
            this.closeModal();
            await this.fetchEvents();
        },
        async handleWeekAction(action) {
            if (action === 'next') {
                this.nextWeek();
            } else if (action === 'previous') {
                this.previousWeek();
            }
            await this.fetchEvents();
        },
        getMonthName(month) {
            const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
            return months[month];
        },
        nextWeek() {
            this.currentDate = new Date(this.currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
        },
        previousWeek() {
            this.currentDate = new Date(this.currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        },
        formatDate(date) {
            const year = String(date.getFullYear());
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        },
        updateScrollBarWidth() {
            let div = document.createElement('div');
            div.style.overflowY = 'scroll';
            div.style.width = '50px';
            div.style.height = '50px';
            document.body.appendChild(div);
            this.scrollWidth = `${div.offsetWidth - div.clientWidth}px`;
            div.remove();
        },
        async deleteEvent(eventId) {
            try {
                await axios.delete(`${import.meta.env.VITE_API_URL}/api/events/${eventId}`);
                await this.fetchEvents();
            } catch (error) {
                console.error('Ошибка при удалении события:', error);
            }
        },
        async fetchEvents() {
            if (this.isFetching) return; // защита от повторного запуска
            this.isFetching = true;
            const healthInfo = await axios.get(`${import.meta.env.VITE_API_URL}/api/health`);
            if (healthInfo.data.status === "UP") {
                try {
                    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/events`);
                    this.events = response.data;  
                    this.isDataBaseAvalable = true;
                } catch (error) {
                    console.error('Ошибка при получении событий:', error);
                } finally {
                    this.isFetching = false;
                }
            }
            else this.isDataBaseAvalable = false;
            
        },
        getEventsForDay(date) {
            return this.events.filter(event => event.eventDate === date);
        },
        
     initWebSocket() {
    const sockJsUrl = '/ws'; // например: http://localhost

    const client = new Client({
        webSocketFactory: () => new SockJS(sockJsUrl), 
        debug: (msg) => console.log('STOMP Debug:', msg),
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
    });

    this.stompClient = client;

    client.onConnect = (frame) => {
        console.log("✅ Подключились к STOMP", frame);

        client.subscribe('/topic/db-health', (message) => {
            const payload = JSON.parse(message.body);
            this.dbStatus = payload;
            this.isDataBaseAvalable = payload.status === 'UP';
        });

        client.subscribe('/topic/events', (message) => {
            const event = JSON.parse(message.body);
            const index = this.events.findIndex(e => e.id === event.id);
            if (index === -1) {
                this.events.push(event);
            } else {
                this.events[index] = event;
            }
        });
    };

    client.onStompError = (frame) => {
        console.error("❌ STOMP Ошибка:", frame.headers.message);
    };

    client.onWebSocketClose = () => {
        console.warn("⚠️ Соединение закрыто");
    };

    client.onWebSocketError = (event) => {
        console.error("🔴 Ошибка WebSocket:", event);
    };

    client.activate(); // активируем клиент
}
        
    },
    mounted() {
        this.updateScrollBarWidth();
        this.fetchEvents();
        this.initWebSocket(); 
    }
};
</script>

<style>
.dayOfWeek {
    color: rgb(0, 86, 179);
    background-color: rgba(243, 243, 243, 0.8);
    font-weight: bold;
    padding-top: 10px;
    padding-bottom: 10px;
    border-radius: 5px;
}

.dayOfWeekEnd {
    color: white;
    background-color: rgba(0, 86, 179, 0.8);
    font-weight: bold;
    padding-top: 10px;
    padding-bottom: 10px;
    border-radius: 5px;
}

.main {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-column-gap: 5px;
    width: stretch;
    padding-top: 10px;
}

.main2 {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-column-gap: 5px;
    width: stretch;
    padding-top: 10px;
}


.isScroll {
    padding-right: 10px;
    margin-right: -10px;
    overflow-y: scroll;
    overflow-x: hidden;
    scrollbar-color: #000;
    height: calc(100% - 150px);
}

.dateId {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    box-shadow: 5px 5px 15px 0px rgba(0, 0, 0, 0.3);

}

.mainHeader {
    display: grid;
    width: stretch;
    border-bottom: solid 2px rgba(255, 255, 255, 0.8);
    border-top: solid 2px rgba(255, 255, 255, 0.8);
    /*background: linear-gradient(135deg, #87CEEB, #4682B4);*/
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 10px 10px;
    margin: 0px -10px;
}

.MainContainer {
    display: flex;
    flex-wrap: nowrap;
    flex-direction: column;    
    justify-content: center;
    align-content: stretch;
    height: 100%;
    width: calc(100vw);
    color: 111;
    padding-right: 10px;
    padding-left: 10px;
    font-family: inherit;
    overflow: hidden;
}

#MainBar {
    height: calc(100vh - 50px);
    width: 100vw;
    display: flex;
    position: fixed;
}


#NavBar {
    display: flex;
    height: 70px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

}

#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    width: 100vw;
    height: 100vh;
    position: absolute;
    top: 0px;
    left: 0px;
    background-image: url('@/backgrounds/fon_1.jpg'); /* Путь к твоей картинке */
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}

#DataBaseNotAvalable {
    color: red;
    font-size: 30px;
    font-weight: 900;
    background-color: rgba(243, 243, 243, 0.8);
    padding: 20px;
    margin: auto;
    margin-top: 35px;
    border-radius: 15px;
}

body {
    margin: 0;
    padding: 0;
    font-family: Arial, sans-serif;
    color: #fff;
    /*background: linear-gradient(135deg, #87CEEB, #4682B4);*/
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    overflow: hidden;
}


 
.scrollable {
    scrollbar-color: rgba(0, 0, 0, 0) transparent;
    transition: 0.8s;
}

.scrollable:hover {
    scrollbar-color: rgba(243, 243, 243, 0.4) transparent;
    transition: 0.8s;
}

.scrollable::-webkit-scrollbar-track {
    border-radius: 6px;
}

.scrollable::-webkit-scrollbar-thumb {
    border-radius: 5px;
}
</style>
