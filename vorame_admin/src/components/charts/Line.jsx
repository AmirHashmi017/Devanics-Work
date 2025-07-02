import React, { Component } from 'react'
import Chart from "react-apexcharts";

class LineChart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            options: {
                chart: {
                    type: 'line',
                    toolbar: {
                        show: false
                    },
                },
                series: [{
                    name: 'Users Data',
                    data: [200, 320, 430, 540, 650]
                }],
                xaxis: {
                    labels: {
                        show: false // Hide X-axis labels
                    },
                    axisBorder: {
                        show: false // Hide X-axis border/line
                    },
                    axisTicks: {
                        show: false // Hide X-axis ticks
                    }
                },
                yaxis: {
                    labels: {
                        show: false // Hide Y-axis labels
                    },
                    axisBorder: {
                        show: false // Hide Y-axis border/line
                    },
                    axisTicks: {
                        show: false // Hide Y-axis ticks
                    }
                },
                grid: {
                    show: false // Hide grid lines
                }
            },
            series: [
                {
                    name: "Users",
                    data: [630, 240, 845, 220, 849, 160, 870, 191]
                }
            ],
            stroke: {
                curve: 'smooth',
            },


        };
    }

    render() {
        return (
            <div className="app">
                <div className="row">
                    <div className="mixed-chart">
                        <Chart
                            options={this.state.options}
                            series={this.state.series}
                            type="line"

                            width="150"
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default LineChart