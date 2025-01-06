<script setup>
import { ref } from "vue";
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const props = defineProps({
  question: Object,
});

// Generate dynamic colors for the bars
const generateBarColors = () => {
  const colors = props.question.answers.map((_, index) =>
    index === props.question.correctOption ? "#28A745" : "#C62300"
  );
  return colors;
};

const chartData = ref({
  labels: ["A", "B", "C", "D", "No Answer"],
  datasets: [
    {
      label: "Player Answers",
      backgroundColor: generateBarColors(),
      data: [...props.question.answers, props.question.noAnswer],
    },
  ],
});

const chartOptions = ref({
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
});
</script>

<template>
  <section class="mb-8">
    <h2 class="text-2xl font-semibold mb-4">Answer Statistics</h2>
    <div class="bg-secondary p-4 rounded-lg">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
  </section>
</template>