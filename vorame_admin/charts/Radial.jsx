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
                    events: {
                        dataPointMouseEnter: (event, chartContext, config) => {
                            this.handleHover(config.seriesIndex);
                        },
                        dataPointMouseLeave: () => {
                            this.handleHoverLeave();
                        },
                    },
                },
                plotOptions: {
                    radialBar: {
                        startAngle: 0,
                        endAngle: 360,
                        hollow: {
                            size: "60%",
                        },
                        track: {
                            background: "#E5E7EB",
                            strokeWidth: "100%",
                        },
                        dataLabels: {
                            show: false,
                        },
                    },
                },
                labels: ["Paid Users", "Free Users"],
                fill: {
                    colors: ["#222222", "#D3D5DA"],
                },
                legend: {
                    show: false,
                },
                tooltip: {
                    enabled: false,
                },
            },
            series: [paidPercentage, freePercentage],
            totalUsers,
            paidUsers,
            freeUsers,
            hoveredLabel: "Total Users",
            hoveredValue: totalUsers,
        };
    }

    handleHover = (seriesIndex) => {
        if (seriesIndex === 0) {
            // Paid Users (dark section)
            this.setState({
                hoveredLabel: "Paid Users",
                hoveredValue: this.state.paidUsers,
            });
        } else if (seriesIndex === 1) {
            // Free Users (light section)
            this.setState({
                hoveredLabel: "Free Users",
                hoveredValue: this.state.freeUsers,
            });
        }
    };

    handleHoverLeave = () => {
        this.setState({
            hoveredLabel: "Total Users",
            hoveredValue: this.state.totalUsers,
        });
    };

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
                        pointerEvents: "none",
                    }}
                >
                    <div style={{ fontSize: "16px", color: "#666" }}>
                        {this.state.hoveredLabel}
                    </div>
                    <div style={{ fontSize: "24px", fontWeight: "bold", color: "#000" }}>
                        {this.state.hoveredValue}
                    </div>
                </div>
            </div>
        );
    }
}

export default DualRadialChart;