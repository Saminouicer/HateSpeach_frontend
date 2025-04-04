import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ confidenceData }) => {
    const data = {
        labels: ['No Hate Speech','Hate Speech' ],
        datasets: [
            {
                data: confidenceData,
                backgroundColor: ['#32CD32','#FF6347'],
                hoverOffset: 4,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                position: 'bottom',
            },
        },
    };

    return (
        <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center' }}>
            <Pie data={data} options={options} />
        </div>
    );
};

export default PieChart;
