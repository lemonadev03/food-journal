'use client';

import * as React from 'react';
import { Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
    DrawerClose,
    DrawerFooter,
} from '@/components/ui/drawer';
import { cn } from '@/lib/utils';

interface TimeSelectorProps {
    value: string; // Format: "HH:mm"
    onChange: (value: string) => void;
    className?: string;
    isEditing?: boolean;
}

export function TimeSelector({ value, onChange, className, isEditing }: TimeSelectorProps) {
    const [open, setOpen] = React.useState(false);
    const [selectedHour, setSelectedHour] = React.useState<number>(0);
    const [selectedMinute, setSelectedMinute] = React.useState<number>(0);
    const hoursRef = React.useRef<HTMLDivElement>(null);
    const minutesRef = React.useRef<HTMLDivElement>(null);

    // Parse initial value
    React.useEffect(() => {
        if (value) {
            const [h, m] = value.split(':').map(Number);
            if (!isNaN(h) && !isNaN(m)) {
                setSelectedHour(h);
                // Round minutes to nearest 5 to match available options
                setSelectedMinute(Math.round(m / 5) * 5);
            }
        } else {
            const now = new Date();
            setSelectedHour(now.getHours());
            const minutes = now.getMinutes();
            setSelectedMinute(Math.round(minutes / 5) * 5);
        }
    }, [value, open]);

    // Auto-scroll to selected time
    React.useEffect(() => {
        if (open) {
            // Small timeout to ensure DOM is ready and layout is stable
            const timer = setTimeout(() => {
                if (hoursRef.current) {
                    const button = hoursRef.current.children[0].children[selectedHour] as HTMLElement;
                    if (button) {
                        button.scrollIntoView({ block: 'center', behavior: 'smooth' });
                    }
                }
                if (minutesRef.current) {
                    // Find index of selected minute (0, 5, 10...)
                    const minuteIndex = selectedMinute / 5;
                    const button = minutesRef.current.children[0].children[minuteIndex] as HTMLElement;
                    if (button) {
                        button.scrollIntoView({ block: 'center', behavior: 'smooth' });
                    }
                }
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [open]); // Run when drawer opens

    const handleSave = () => {
        const formattedHour = selectedHour.toString().padStart(2, '0');
        const formattedMinute = selectedMinute.toString().padStart(2, '0');
        onChange(`${formattedHour}:${formattedMinute}`);
        setOpen(false);
    };

    const hours = Array.from({ length: 24 }, (_, i) => i);
    const minutes = Array.from({ length: 12 }, (_, i) => i * 5); // 0, 5, 10... 55

    return (
        <Drawer open={open} onOpenChange={setOpen} shouldScaleBackground={false}>
            <DrawerTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        "w-full justify-start text-left font-normal h-12 text-lg border-input",
                        // Base background
                        "bg-muted/30",
                        // Hover states
                        isEditing 
                            ? "hover:bg-blue-50 hover:text-blue-900 focus-visible:ring-blue-600" 
                            : "hover:bg-muted/50 hover:text-foreground",
                        !value && "text-muted-foreground",
                        className
                    )}
                >
                    <Clock className={cn(
                        "mr-2 h-5 w-5",
                        isEditing ? "text-blue-500" : "text-muted-foreground"
                    )} />
                    {value ? (
                        <span>
                            {new Date(0, 0, 0, parseInt(value.split(':')[0]), parseInt(value.split(':')[1])).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                        </span>
                    ) : (
                        <span>Pick a time</span>
                    )}
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                        <DrawerTitle className="text-center">Select Time</DrawerTitle>
                    </DrawerHeader>
                    <div className="p-4 pb-0">
                        <div className="flex items-center justify-center gap-4 h-[200px]">
                            {/* Hours */}
                            <div ref={hoursRef} className="h-full overflow-y-auto w-20 text-center no-scrollbar snap-y snap-mandatory py-20">
                                <div className="space-y-2">
                                    {hours.map((h) => (
                                        <button
                                            key={h}
                                            type="button"
                                            onClick={() => setSelectedHour(h)}
                                            className={cn(
                                                "block w-full py-2 text-xl font-medium transition-colors snap-center rounded-md",
                                                selectedHour === h
                                                    ? cn("text-primary-foreground scale-110", isEditing ? "bg-blue-600" : "bg-primary")
                                                    : "text-muted-foreground hover:text-foreground"
                                            )}
                                        >
                                            {h.toString().padStart(2, '0')}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="text-2xl font-bold text-muted-foreground">:</div>

                            {/* Minutes */}
                            <div ref={minutesRef} className="h-full overflow-y-auto w-20 text-center no-scrollbar snap-y snap-mandatory py-20">
                                <div className="space-y-2">
                                    {minutes.map((m) => (
                                        <button
                                            key={m}
                                            type="button"
                                            onClick={() => setSelectedMinute(m)}
                                            className={cn(
                                                "block w-full py-2 text-xl font-medium transition-colors snap-center rounded-md",
                                                selectedMinute === m
                                                    ? cn("text-primary-foreground scale-110", isEditing ? "bg-blue-600" : "bg-primary")
                                                    : "text-muted-foreground hover:text-foreground"
                                            )}
                                        >
                                            {m.toString().padStart(2, '0')}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <DrawerFooter>
                        <Button 
                            onClick={handleSave} 
                            className={cn(
                                "w-full h-12 text-lg",
                                isEditing ? "bg-blue-600 hover:bg-blue-700" : ""
                            )}
                        >
                            Set Time
                        </Button>
                        <DrawerClose asChild>
                            <Button variant="outline" className="w-full h-12">Cancel</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
