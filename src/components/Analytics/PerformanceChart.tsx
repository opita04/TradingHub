import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface PerformanceChartProps {
    data: { name: string; value: number }[];
    title: string;
}

export function PerformanceChart({ data, title }: PerformanceChartProps) {
    const chartData = {
        labels: data.map(d => d.name),
        datasets: [
            {
                label: 'Net P&L',
                data: data.map(d => d.value),
                backgroundColor: data.map(d => d.value >= 0 ? 'rgba(16, 185, 129, 0.6)' : 'rgba(239, 68, 68, 0.6)'),
                borderColor: data.map(d => d.value >= 0 ? '#10b981' : '#ef4444'),
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: title,
                color: '#9ca3af',
                font: { size: 14 }
            },
            tooltip: {
                backgroundColor: '#1f2937',
                titleColor: '#f3f4f6',
                bodyColor: '#e5e7eb',
                callbacks: {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    label: (context: any) => {
                        const value = context.raw as number;
                        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
                    }
                }
            }
        },
        scales: {
            x: {
                grid: { display: false, color: '#374151' },
                ticks: { color: '#9ca3af' }
            },
            y: {
                grid: { color: '#374151', drawBorder: false },
                ticks: {
                    color: '#9ca3af',
                    callback: (value: number | string) => new Intl.NumberFormat('en-US', { notation: "compact", compactDisplay: "short" }).format(Number(value))
                }
            }
        }
    };

    if (data.length === 0) {
        return <div className="h-full flex items-center justify-center text-gray-500 text-sm">No data</div>;
    }

    return <Bar options={options} data={chartData} />;
}
