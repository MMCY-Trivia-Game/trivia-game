<template>
    <!--Overview card-->
    <section class="grid grid-cols-1 gap-4 mb-4  md:grid-cols-2 lg:grid-cols-5 ">
        <DashboardCard v-for="dashboard in dashboards.dashboardOverViewCard " :title="dashboard.title"
            :icon="dashboard.icon" :number="dashboard.number" />
    </section>

    <!---->
    <section class="mt-5 grid grid-cols-1 gap-4 mb-4  md:grid-cols-2 lg:grid-cols-2">
        <div class="bg-white p-5 rounded-md">
            <p class="text-primary font-bold">Top category</p>
            <apexchart type="bar" height="350" :options="dashboards.chartMostCategory.chartOptions"
                :series="dashboards.chartMostCategory.series">
            </apexchart>
        </div>

        <div class="bg-white p-5 rounded-md">
            <p class="text-primary font-bold">Number of Game played</p>
            <apexchart type="area" height="350" :options="dashboards.chartGamePLayed.chartOptions"
                :series="dashboards.chartGamePLayed.series">
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
import DashboardCard from '@/components/admin-component/ui/DashboardCard.vue'
import DashboardGameStatus from '@/components/admin-component/ui/DashboardGameStatus.vue'
import { ref } from 'vue'
import { PlayIcon, Squares2X2Icon, QuestionMarkCircleIcon, UserPlusIcon, RectangleGroupIcon } from '@heroicons/vue/24/solid';
import ResponseImage from '@/assets/Responsive-rafiki.svg'
import PlayerImage from '@/assets/player-bro.svg'
import ScoreImage from '@/assets/score.svg'
import { useDashboardStore } from '@/stores/admin/dashboardStore.js';
import { onMounted } from 'vue';
import { computed } from 'vue';

const dashboardStore = useDashboardStore()

onMounted(async () => {
    await dashboardStore.fetchStats()
})

const dashboards = computed(() => {
    return {
        dashboardOverViewCard: [{
            title: 'Active Games',
            icon: PlayIcon,
            number: dashboardStore?.stats?.dashboard?.activeGamesCount || "-",
        },
        {
            title: 'Players',
            icon: Squares2X2Icon,
            number: dashboardStore?.stats?.dashboard?.activeGamesCount || "-",
        },
        {
            title: 'Questions',
            icon: QuestionMarkCircleIcon,
            number: dashboardStore.stats?.dashboard?.questionCount || "-",
        },
        {
            title: 'Active Creators',
            icon: UserPlusIcon,
            number: dashboardStore.stats?.dashboard?.activeCreatorCount || "-",
        },
        {
            title: 'games hosted',
            icon: RectangleGroupIcon,
            number: dashboardStore.stats?.dashboard?.totalGamesCount || "-",
        }

        ],
        chartMostCategory: {

            series: [{
                name: 'Category',
                data: dashboardStore.stats?.topCategories?.map((item) => item.count)
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
                    categories: dashboardStore.stats?.topCategories?.map((item) => item._id),
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


        },
        //monthlyGamePlayers
        chartGamePLayed: {
            series: [{
                name: "Games",
                data: dashboardStore.stats?.monthlyGamePlayers?.map((item) => item.count) || [null]
            }],
            chartOptions: {
                chart: {
                    height: 350,
                    type: 'area',
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
                    categories: dashboardStore.stats?.monthlyGamePlayers?.map((item) => item.month + "-" + item.year) || [0],
                }
            }
        }

    }
})




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

