// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
// import { Chart } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
} from 'chart.js'
// @ts-ignore
import { Chart } from 'react-chartjs-2';
// ChartJS.register(ArcElement, Tooltip, Legend);
ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController
);

export default ChartJS;
