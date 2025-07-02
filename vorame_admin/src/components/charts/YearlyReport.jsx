import React, { Component } from "react";
import Chart from "react-apexcharts";

class YearlyReportChart extends Component {
    constructor(props) {
        super(props);

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
                    name: "Paid Users",
                    data: this.props.data ? this.props.data[0].data : [], // Data for Paid Users
                },
                {
                    name: "Free Users",
                    data: this.props.data ? this.props.data[1].data : [], // Data for Free Users
                },
            ],
        };
    }

    render() {
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
