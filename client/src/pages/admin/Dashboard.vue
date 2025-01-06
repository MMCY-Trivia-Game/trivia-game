<template>
    <!--Overview card-->
    <section class="grid grid-cols-1 gap-4 mb-4  md:grid-cols-2 lg:grid-cols-5 ">
        <DashboardCard v-for="dashboard in dashboardOverViewCard " :title="dashboard.title" :icon="dashboard.icon"
            :number="dashboard.number" />
    </section>

    <!---->
    <section class="mt-5 grid grid-cols-1 gap-4 mb-4  md:grid-cols-2 lg:grid-cols-2">
        <div class="bg-white p-5 rounded-md">
            <p class="text-primary font-bold">Most selected category</p>
            <apexchart type="bar" height="350" :options="chartMostCategory.chartOptions" :series="chartMostCategory.series">
            </apexchart>
        </div>

        <div class="bg-white p-5 rounded-md">
            <p class="text-primary font-bold">Number of Game played</p>
            <apexchart type="area" height="350" :options="chartGamePLayed.chartOptions" :series="chartGamePLayed.series">
            </apexchart>
        </div>
    </section>

    <!---->
    <section class="mt-5 grid grid-cols-1 gap-4 mb-4  md:grid-cols-1 lg:grid-cols-3">
        <DashboardGameStatus v-for="status in playerStat" :title="status.title" :number="status.number"
            :image="status.image" />
    </section>
</template>

<script setup>
import DashboardCard from '@/components/ui/DashboardCard.vue'
import DashboardGameStatus from '@/components/ui/DashboardGameStatus.vue'
import { ref } from 'vue'
import { PlayIcon, Squares2X2Icon, QuestionMarkCircleIcon, UserPlusIcon, RectangleGroupIcon } from '@heroicons/vue/24/solid';
import ResponseImage from '@/assets/Responsive-rafiki.svg'
import PlayerImage from '@/assets/player-bro.svg'
import ScoreImage from '@/assets/score.svg'


const dashboardOverViewCard = ref([
    {
        title: 'Active Games',
        icon: PlayIcon,
        number: 10,
    },
    {
        title: 'Players',
        icon: Squares2X2Icon,
        number: 13,
    },
    {
        title: 'Questions',
        icon: QuestionMarkCircleIcon,
        number: 16,
    },
    {
        title: 'Active Creators',
        icon: UserPlusIcon,
        number: 7,
    },
    {
        title: 'games hosted',
        icon: RectangleGroupIcon,
        number: 9,
    },
])

const chartMostCategory = {

    series: [{
        name: 'Category',
        data: [44, 55, 41, 67]
    }],
    chartOptions: {
        chart: {
            height: 350,
            type: 'bar',
            toolbar: {
                show: false
            }
        },
        plotOptions: {
            bar: {
                borderRadius: 10,
                columnWidth: '50%',
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            width: 0
        },
        grid: {
            row: {
                colors: ['#fff', '#f2f2f2']
            }
        },
        tooltip: {
            enabled: true,
            theme: 'dark',
            style: {
                fontSize: '12px',
                fontFamily: undefined
            },
        },
        xaxis: {
            labels: {
                rotate: -45
            },
            categories: ['Fun', 'Technology', 'General Knowledge', 'History'],
            tickPlacement: 'on'
        },
        yaxis: {
            title: {
                text: 'Top Categories',
            },
        },
        colors: ['#C62300'],
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'light',
                type: "horizontal",
                shadeIntensity: 0.25,
                gradientToColors: undefined,
                inverseColors: true,
                opacityFrom: 0.85,
                opacityTo: 0.85,
                stops: [50, 0, 100]
            },
        }
    },


}

const chartGamePLayed = {
    series: [{
        name: "Games",
        data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
    }],
    chartOptions: {
        chart: {
            height: 350,
            type: 'line',
            toolbar: {
                show: false
            },
            zoom: {
                enabled: false
            }
        },
        tooltip: {
            enabled: true,
            theme: 'dark',
            style: {
                fontSize: '12px',
                fontFamily: undefined
            },
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'straight'
        },
        colors: ['#C62300'],
        grid: {
            row: {
                colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.5
            },
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
        }
    }
};

const playerStat = ref([
    {
        title: 'Average response time.',
        number: 3,
        image: ResponseImage
    },
    {
        title: 'Average players per game.',
        number: 3,
        image: PlayerImage
    },
    {
        title: 'Average score per player.',
        number: 3,
        image: ScoreImage
    }
])


</script>

