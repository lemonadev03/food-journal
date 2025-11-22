'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { AddMealDrawer } from '@/components/add-meal-drawer';
import { DateSelector } from '@/components/date-selector';
import { MealList } from '@/components/meal-list';

// We receive initialMeals and initialDate from the server component
// but we also manage local state for the date selector to allow client-side navigation 
// which then updates the URL to fetch new data.
interface MealsViewProps {
  initialMeals: any[]; // specific type used in MealList
  initialDate: Date;
}

export function MealsView({ initialMeals, initialDate }: MealsViewProps) {
  const router = useRouter();
  const [date, setDate] = React.useState<Date>(initialDate);

  // When date changes, update URL query param
  const handleDateChange = (newDate: Date) => {
    setDate(newDate);
    const dateString = newDate.toISOString().split('T')[0];
    router.push(`/meals?date=${dateString}`);
  };

  // Sync state if parent prop changes (e.g. back button navigation)
  React.useEffect(() => {
    setDate(initialDate);
  }, [initialDate]);

  return (
    <div className="w-full max-w-md mx-auto flex flex-col h-[calc(100dvh-5rem)] md:h-[100dvh] overflow-hidden bg-background">
      <header className="flex-none z-40 w-full p-4 pb-2 bg-background">
        <div className="flex flex-col gap-3">
           <div className="flex items-center justify-between px-1">
               <h1 className="text-2xl font-bold tracking-tight text-foreground">Daily Log</h1>
           </div>
           <DateSelector date={date} onDateChange={handleDateChange} />
        </div>
      </header>
      
      <main className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth">
        <MealList meals={initialMeals} />
      </main>

      <div className="fixed bottom-8 right-8 z-30 hidden md:block animate-in zoom-in duration-300">
         <AddMealDrawer selectedDate={date} />
      </div>
    </div>
  );
}
