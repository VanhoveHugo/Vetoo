import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const WeightChart = ({ weights }) => {
  const chartData = {
    labels: weights.map((weight) => new Date(weight.date).toLocaleDateString()),
    datasets: [
      {
        label: "Poids",
        data: weights.map((weight) => weight.weight),
        borderColor: "rgba(253, 147, 64, 1)",
        backgroundColor: "rgba(254, 180, 122, 0.2)",
        animation: {
          duration: 2000,
        },
        tension: 0.3,
        cubicInterpolationMode: "monotone",
        categoryPercentage: 0.5,
        barPercentage: 0.5,
        categorySpacing: 0,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
  };

  return (
    <div style={{ width: "100%", height: "180px", overflow: "hidden" }}>
      <div style={{ width: "100%", height: "200px", marginTop: "-25px" }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default WeightChart;
