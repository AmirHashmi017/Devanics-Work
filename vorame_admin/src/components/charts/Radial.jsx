import React, { Component } from "react";
import Chart from "react-apexcharts";

class DualRadialChart extends Component {
    constructor(props) {
        super(props);

        const totalUsers = this.props.totalUsers;
        const paidUsers = this.props.paidUsers;
        const freeUsers = this.props.freeUsers;

        const paidPercentage = (paidUsers / totalUsers) * 100;
        const freePercentage = (freeUsers / totalUsers) * 100;

        this.state = {
            options: {
                chart: {
                    type: "radialBar",
                },
                plotOptions: {
                    radialBar: {
                        startAngle: 0,
                        endAngle: 360,
                        hollow: {
                            size: "60%",
                        },
                        track: {
                            background: "#222222", // Light gray for unfilled parts
                            strokeWidth: "100%",
                        },
                        dataLabels: {
                            show: true, // Always display data labels
                            name: {
                                show: true,
                            },
                            value: {
                                show: false, // Disable default value as we'll add custom text
                            },
                        },
                    },
                },
                labels: ["Paid Users", "Free Users"], // Outer and inner labels
                fill: {
                    colors: ["#000", "#D3D5DA"], // Black for paid, gray for free
                },
            },
            series: [paidPercentage, freePercentage], // Paid and free percentages
            totalUsers, // Total users to display inside the chart
        };
    }

    render() {
        return (
            <div className="dual-radial-chart" style={{ position: "relative" }}>
                <Chart
                    options={this.state.options}
                    series={this.state.series}
                    type="radialBar"
                    height="300"
                />
                {/* Add custom text in the center */}
                <div
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        textAlign: "center",
                    }}
                >
                    <div style={{ fontSize: "16px", color: "#666" }}>Total Users</div>
                    <div style={{ fontSize: "24px", fontWeight: "bold", color: "#000" }}>
                        {this.props.totalUsers}
                    </div>
                </div>
            </div>
        );
    }
}

export default DualRadialChart;
