"use client";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = () => {
    const data = {
        datasets: [
            {
            label:'Data' ,
            data: [1250,2500,3414],
            backgroundColor: [
                '#0747b6',
                '#2265d8',
                '#2f91fa'
            ]
            }
        ],
        labels:['Label1','label2','label3']
    }
return <Doughnut 
    data={data} 
    options={{
        cutout: '60%',
        plugins: {
            legend: {
                display: false,
            }
        }
    }}
    />;

}
export default DoughnutChart
