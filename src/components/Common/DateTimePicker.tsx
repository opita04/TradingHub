import { Calendar, Clock } from 'lucide-react';

interface DateTimePickerProps {
    date: string;
    time: string;
    onDateChange: (date: string) => void;
    onTimeChange: (time: string) => void;
}

export function DateTimePicker({ date, time, onDateChange, onTimeChange }: DateTimePickerProps) {
    return (
        <div className="grid grid-cols-2 gap-4">
            <div className="relative">
                <label className="block text-xs font-medium text-gray-400 mb-1">Date</label>
                <div className="relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors">
                        <Calendar size={16} />
                    </div>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => onDateChange(e.target.value)}
                        className="w-full bg-[#1a1f2e] border border-[#334155] rounded-lg py-2.5 pl-10 pr-4 text-sm text-gray-200 focus:border-blue-500 transition-colors [&::-webkit-calendar-picker-indicator]:invert-[.5] [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                    />
                </div>
            </div>

            <div className="relative">
                <label className="block text-xs font-medium text-gray-400 mb-1">Time</label>
                <div className="relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors">
                        <Clock size={16} />
                    </div>
                    <input
                        type="time"
                        value={time}
                        onChange={(e) => onTimeChange(e.target.value)}
                        className="w-full bg-[#1a1f2e] border border-[#334155] rounded-lg py-2.5 pl-10 pr-4 text-sm text-gray-200 focus:border-blue-500 transition-colors [&::-webkit-calendar-picker-indicator]:invert-[.5] [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                    />
                </div>
            </div>
        </div>
    );
}
