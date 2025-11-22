'use client';

import * as React from 'react';
import { Trash2, Utensils } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { deleteMeal } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { AddMealDrawer } from '@/components/add-meal-drawer';

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
  
  // State for the editing drawer
  const [editingMeal, setEditingMeal] = React.useState<Meal | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  async function handleDelete(e: React.MouseEvent, id: string) {
    e.stopPropagation(); // Prevent triggering the row click (edit)
    setOptimisticMeals(id);
    try {
      await deleteMeal(id);
      toast.success('Meal deleted');
    } catch (error) {
      toast.error('Failed to delete meal');
      console.error(error);
    }
  }

  function handleEditClick(meal: Meal) {
      setEditingMeal(meal);
      setIsDrawerOpen(true);
  }

  function onDrawerOpenChange(open: boolean) {
      setIsDrawerOpen(open);
      if (!open) {
          // Add a small delay to clear selected meal so animation finishes smoothly
          setTimeout(() => setEditingMeal(null), 300);
      }
  }

  if (optimisticMeals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center space-y-4 text-muted-foreground animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-muted/50 p-4 rounded-full">
          <Utensils className="h-8 w-8 opacity-50" />
        </div>
        <div className="space-y-1">
          <p className="font-medium text-foreground">No meals logged yet</p>
          <p className="text-sm">Start your day by adding a meal</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24">
        <div className="space-y-3">
        {optimisticMeals.map((meal) => (
            <div 
                key={meal.id} 
                onClick={() => handleEditClick(meal)}
                className="group relative flex items-center justify-between p-4 bg-card rounded-xl border shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-[0.98]"
            >
            <div className="flex flex-col gap-1.5">
                <span className="text-[11px] uppercase tracking-wider font-mono text-muted-foreground/70">
                {format(new Date(meal.consumedAt), 'h:mm a')}
                </span>
                <span className="font-medium text-foreground text-[15px] leading-tight">{meal.description}</span>
            </div>
            
            <div className="flex items-center gap-3">
                {meal.quantity && (
                <span className="text-xs font-medium text-muted-foreground bg-secondary px-2.5 py-1 rounded-full">
                    {meal.quantity}
                </span>
                )}
                <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
                onClick={(e) => handleDelete(e, meal.id)}
                >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
                </Button>
            </div>
            </div>
        ))}
        </div>
        
        {/* Reuse the AddMealDrawer for editing */}
        <AddMealDrawer 
            open={isDrawerOpen} 
            onOpenChange={onDrawerOpenChange}
            mealToEdit={editingMeal}
        />
    </div>
  );
}
