import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

interface EquityCurveProps {
    dataPoints: { date: string; value: number; rawDate: string }[];
}

export function EquityCurve({ dataPoints }: EquityCurveProps) {
    const isProfit = dataPoints.length > 0 && dataPoints[dataPoints.length - 1].value >= 0;
    const lineColor = isProfit ? '#10b981' : '#ef4444';
    const fillColor = isProfit ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)';

    const data = {
        labels: dataPoints.map(d => d.date),
        datasets: [
            {
                label: 'Cumulative P&L',
                data: dataPoints.map(d => d.value),
                borderColor: lineColor,
                backgroundColor: fillColor,
                tension: 0.4,
                fill: true,
                pointRadius: 4,
                pointBackgroundColor: '#1f2937', // Dark gray
                pointBorderColor: lineColor,
                pointHoverRadius: 6,
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
            tooltip: {
                mode: 'index' as const,
                intersect: false,
                backgroundColor: '#1f2937',
                titleColor: '#f3f4f6',
                bodyColor: '#e5e7eb',
                borderColor: '#374151',
                borderWidth: 1,
                callbacks: {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    label: (context: any) => {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
                        }
                        return label;
                    }
                }
            },
        },
        scales: {
            x: {
                grid: {
                    color: '#374151',
                    drawBorder: false,
                },
                ticks: {
                    color: '#9ca3af',
                }
            },
            y: {
                grid: {
                    color: '#374151',
                    drawBorder: false,
                },
                ticks: {
                    color: '#9ca3af',
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    callback: (value: any) => {
                        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumSignificantDigits: 3 }).format(value);
                    }
                }
            },
        },
        interaction: {
            mode: 'nearest' as const,
            axis: 'x' as const,
            intersect: false
        }
    };

    if (dataPoints.length === 0) {
        return (
            <div className="h-full w-full flex items-center justify-center text-gray-500 text-sm">
                Not enough data to display chart
            </div>
        );
    }

    return <Line options={options} data={data} />;
}
