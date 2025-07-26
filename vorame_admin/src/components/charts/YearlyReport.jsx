import React, { Component } from "react";
import Chart from "react-apexcharts";

class YearlyReportChart extends Component {
    constructor(props) {
        super(props);

        // Demo data matching the real API structure
        // Each object represents a user type with a name and a data array for each month
        const demoData = [
            {
                name: "Paid Users",
                data: [120, 150, 170, 140, 180, 200, 220, 210, 190, 230, 250, 240],
            },
            {
                name: "Free Users",
                data: [80, 90, 100, 110, 120, 130, 140, 135, 125, 140, 150, 160],
            },
        ];

        // Defensive: Ensure data is an array with at least two elements, each with a data array
        const safeData = Array.isArray(props.data) && props.data.length >= 2 && Array.isArray(props.data[0]?.data) && Array.isArray(props.data[1]?.data)
            ? props.data
            : demoData;

        this.state = {
            options: {
                chart: {
                    type: "bar",
                    stacked: false, // Columns side by side, not stacked
                    toolbar: {
                        show: false, // Disable the toolbar (Download SVG, etc.)
                    },
                },
                plotOptions: {
                    bar: {
                        horizontal: false, // Vertical bars
                        barWidth: "18px", // Set each column width to 18px
                        columnSpacing: 5, // Gap between columns (paid and free within the same month)
                    },
                },
                colors: ["#000", "#ccc"], // Black for paid, gray for free
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
                        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
                    ],
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
                    name: safeData[0].name || "Paid Users",
                    data: safeData[0].data, // Data for Paid Users
                },
                {
                    name: safeData[1].name || "Free Users",
                    data: safeData[1].data, // Data for Free Users
                },
            ],
        };
    }

    render() {
        // Defensive: If data is missing or invalid, use demo data (already handled in constructor)
        return (
            <div className="yearly-report-chart">
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

export default YearlyReportChart;
