'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
    // Convert to YYYY-MM-DD for URL, avoiding timezone shifts by using local string parts or date-fns format
    // A simple toISOString().split('T')[0] works if we are careful about UTC vs Local, 
    // but usually it's safer to use a library format that respects local time if that's the intent.
    // Let's stick to simple ISO date part for now.
    const dateString = newDate.toISOString().split('T')[0];
    router.push(`/meals?date=${dateString}`);
  };

  // Sync state if parent prop changes (e.g. back button navigation)
  React.useEffect(() => {
    setDate(initialDate);
  }, [initialDate]);

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-6">
      <header className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Daily Log</h1>
        <DateSelector date={date} onDateChange={handleDateChange} />
      </header>
      
      <main>
        <MealList meals={initialMeals} />
      </main>

      <AddMealDrawer selectedDate={date} />
    </div>
  );
}

