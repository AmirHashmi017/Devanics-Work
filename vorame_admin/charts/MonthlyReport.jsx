import React, { Component } from "react";
import Chart from "react-apexcharts";

class MonthlyReportChart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            options: {
                chart: {
                    type: "bar",
                    stacked: false, // Columns side by side
                    toolbar: {
                        show: false, // Disable the toolbar (Download SVG, etc.)
                    },
                },
                plotOptions: {
                    bar: {
                        horizontal: false, // Vertical bars
                        barWidth: "18px", // Set each column width to 18px
                        columnSpacing: 5, // Gap between columns (paid and free within the same day)
                    },
                },
                colors: ["#222222", "#D3D5DA"], // Black for paid, gray for free
                dataLabels: {
                    enabled: false, // Disable data labels
                },
                tooltip: {
                    shared: true,
                    intersect: false,
                },
                legend: {
                    show: false, // Disable the legend (this removes "Paid User" and "Free User" labels above)
                },
                xaxis: {
                    categories: [
                        "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"
                    ], // Days of the month (1 to 31)
                    labels: {
                        style: {
                            colors: "#000", // Color for the x-axis labels
                            fontSize: "12px", // Font size for the x-axis labels
                        },
                    },
                },
                yaxis: {
                    labels: {
                        show: false, // Hide the y-axis labels
                    },
                },
                fill: {
                    opacity: 1,
                },
                grid: {
                    show: false, // Hide the grid lines
                },
            },
            series: [
                {
                    name: "Paid Users",
                    data: this.props.data.map(item => item.paid),  // Extract 'paid' values for graph
                },
                {
                    name: "Free Users",
                    data: this.props.data.map(item => item.free),  // Extract 'free' values for graph
                }
            ]
        };
    }

    render() {
        return (
            <div className="monthly-report-chart">
                <Chart
                    options={this.state.options}
                    series={this.state.series}
                    type="bar"
                    height="290"
                />
            </div>
        );
    }
}

export default MonthlyReportChart;
