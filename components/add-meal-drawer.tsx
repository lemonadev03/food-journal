'use client';

import * as React from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { addMeal } from '@/app/actions';

interface AddMealDrawerProps {
  selectedDate?: Date;
}

export function AddMealDrawer({ selectedDate }: AddMealDrawerProps) {
  const [open, setOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    // Append the currently selected date context so the server knows which day we are logging for
    if (selectedDate) {
      formData.append('date', selectedDate.toISOString());
    }

    try {
      await addMeal(formData);
      toast.success('Meal added successfully');
      setOpen(false);
      // Reset form? The drawer unmounts/remounts might handle this, or we can ref the form.
    } catch (error) {
      toast.error('Failed to add meal');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <div className="hidden md:block">
        <DrawerTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Meal
          </Button>
        </DrawerTrigger>
      </div>

      
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Add Meal</DrawerTitle>
            <DrawerDescription>What did you eat today?</DrawerDescription>
          </DrawerHeader>
          <form onSubmit={onSubmit} className="p-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">Meal Description</Label>
              <Input
                id="description"
                name="description"
                placeholder="e.g., Oatmeal with berries"
                required
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity (Optional)</Label>
              <Input
                id="quantity"
                name="quantity"
                placeholder="e.g., 1 bowl"
              />
            </div>
            <DrawerFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Meal
              </Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

