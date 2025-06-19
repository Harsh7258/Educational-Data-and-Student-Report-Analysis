export const doughnutChartConfig = (data, labels) => ({
  type: "doughnut",
  data: {
    labels: labels.length > 0 ? labels : ["No Data"],
    datasets: [
      {
        label: "Enrollment Count",
        data: data.length > 0 ? data : [1], // Prevents empty chart error
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
        borderWidth: 1,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Most Popular Course",
      },
    },
  },
});

export const stackedBarGraphConfig = (labels, passRates, failRates) => ({
  type: "bar",
  data: {
    labels,
    datasets: [
      {
        label: "Pass Rate (%)",
        data: passRates,
        backgroundColor: "#4CAF50",
        stack: "Stack 0",
      },
      {
        label: "Fail Rate (%)",
        data: failRates,
        backgroundColor: "#F44336",
        stack: "Stack 0",
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Quiz Pass/Fail Rates",
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        beginAtZero: true,
        max: 100,
      },
    },
  },
});

export const lineGraphConfig = (labels, currentData, previousData) => ({
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Current Avg Performance",
          data: currentData,
          fill: false,
          borderColor: "#36A2EB",
          tension: 0.3,
        },
        {
          label: "Previous Avg Performance",
          data: previousData,
          fill: false,
          borderColor: "#FF6384",
          tension: 0.3,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "Average Quiz Performance Over Time",
        },
        legend: {
          position: "top",
        },
      },
    },
});