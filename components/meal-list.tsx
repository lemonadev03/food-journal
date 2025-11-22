'use client';

import * as React from 'react';
import { Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { deleteMeal } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Define a type for the Meal object that matches what Prisma returns
// Ideally we import this from a shared types file or infer from Prisma client
interface Meal {
  id: string;
  description: string;
  quantity: string | null;
  consumedAt: Date;
}

interface MealListProps {
  meals: Meal[];
}

export function MealList({ meals }: MealListProps) {
  const [optimisticMeals, setOptimisticMeals] = React.useOptimistic<Meal[], string>(
    meals,
    (state, mealIdToRemove) => state.filter((meal) => meal.id !== mealIdToRemove)
  );

  async function handleDelete(id: string) {
    setOptimisticMeals(id);
    try {
      await deleteMeal(id);
      toast.success('Meal deleted');
    } catch (error) {
      toast.error('Failed to delete meal');
      console.error(error);
      // In a real app, we might want to rollback the optimistic update here, 
      // but useOptimistic is reset on server revalidation anyway.
    }
  }

  if (optimisticMeals.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No meals logged for this day.</p>
        <p className="text-sm">Click the + button to add one!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-24"> {/* Add padding bottom for mobile nav/fab */}
      {optimisticMeals.map((meal) => (
        <Card key={meal.id} className="overflow-hidden">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-medium leading-none">{meal.description}</p>
              <div className="flex gap-2 text-sm text-muted-foreground">
                <span>{format(new Date(meal.consumedAt), 'h:mm a')}</span>
                {meal.quantity && (
                  <>
                    <span>•</span>
                    <span>{meal.quantity}</span>
                  </>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-destructive"
              onClick={() => handleDelete(meal.id)}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

