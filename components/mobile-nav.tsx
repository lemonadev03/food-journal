'use client';

import * as React from 'react';
import { Home, User, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
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
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { addMeal } from '@/app/actions';

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  // We might want to grab the date from the URL or context if possible
  // But since this is a global nav, let's default to "now" unless we are on the meals page with a date param.
  const searchParams = useSearchParams();
  const dateParam = searchParams.get('date');

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    if (dateParam) {
      // If we are looking at a specific date, let's assume the user wants to add to THAT date
      // We need to reconstruct a date object or pass the string. The action expects an ISO string or handles it.
      // Let's try to pass it as is if it's a valid date string part, but the action expects ISO time.
      // Best effort:
      try {
        const selectedDate = new Date(dateParam);
        if (!isNaN(selectedDate.getTime())) {
           formData.append('date', selectedDate.toISOString());
        }
      } catch (e) {
        // ignore
      }
    }

    try {
      await addMeal(formData);
      toast.success('Meal added successfully');
      setOpen(false);
    } catch (error) {
      toast.error('Failed to add meal');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden z-50 pb-safe">
        <div className="flex items-center justify-around h-16">
          <Link 
            href="/meals" 
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-xl transition-colors min-w-[4rem]",
              pathname.startsWith('/meals') 
                ? 'text-primary bg-primary/10' 
                : 'text-muted-foreground hover:bg-muted/50'
            )}
          >
            <Home className="h-6 w-6" />
            <span className="text-[10px] font-medium">Meals</span>
          </Link>
          
          <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-lg -mt-6 hover:bg-primary/90 hover:text-primary-foreground"
              >
                <PlusCircle className="h-8 w-8" />
                <span className="sr-only">Add Meal</span>
              </Button>
            </DrawerTrigger>
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

          <Link 
            href="/profile" 
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-xl transition-colors min-w-[4rem]",
              pathname.startsWith('/profile') 
                ? 'text-primary bg-primary/10' 
                : 'text-muted-foreground hover:bg-muted/50'
            )}
          >
            <User className="h-6 w-6" />
            <span className="text-[10px] font-medium">Profile</span>
          </Link>
        </div>
      </nav>
    </>
  );
}
