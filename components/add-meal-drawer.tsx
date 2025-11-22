'use client';

import * as React from 'react';
import { Plus, Loader2, Clock, Pencil, Quote } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
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
import { addMeal, getUniqueMealDescriptions } from '@/app/actions';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface AddMealDrawerProps {
  selectedDate?: Date;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  mealToEdit?: {
    id: string;
    description: string;
    quantity: string | null;
    consumedAt: Date;
  } | null;
}

const MESSAGES = [
  "Hey, are you really hungry?",
  "You know you would look a lot nicer if you were skinnier.",
  "Back again, fat fuck?",
  "Do you really need to eat that?",
  "Think about your goals.",
  "Water is zero calories. Just saying.",
  "Nothing tastes as good as skinny feels.",
  "Are you eating out of boredom?",
  "The baddies are waiting for you to get fit.",
  "You hate fat people.",
  "Being fat is one of the gayest things you can do.",
];

export function AddMealDrawer({ selectedDate, trigger, open: controlledOpen, onOpenChange: setControlledOpen, mealToEdit }: AddMealDrawerProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [randomMessage, setRandomMessage] = React.useState("");
  
  // Suggestion state
  const [description, setDescription] = React.useState("");
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const [filteredSuggestions, setFilteredSuggestions] = React.useState<string[]>([]);
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
  
  // Load suggestions on mount
  React.useEffect(() => {
    getUniqueMealDescriptions().then(setSuggestions).catch(console.error);
  }, []);

  // Filter suggestions as user types
  React.useEffect(() => {
    if (description) {
      const lower = description.toLowerCase();
      const filtered = suggestions.filter(s => s.toLowerCase().includes(lower) && s.toLowerCase() !== lower);
      setFilteredSuggestions(filtered.slice(0, 5)); // Limit to top 5
      setIsPopoverOpen(filtered.length > 0);
    } else {
      setFilteredSuggestions([]);
      setIsPopoverOpen(false);
    }
  }, [description, suggestions]);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? setControlledOpen! : setInternalOpen;

  React.useEffect(() => {
    if (open) {
      setRandomMessage(MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);
      if (mealToEdit) {
        setDescription(mealToEdit.description);
      } else {
        setDescription("");
      }
    }
  }, [open, mealToEdit]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    // Ensure description state is used if input was controlled/selected
    formData.set('description', description);
    
    const timeValue = formData.get('time') as string;
    
    const baseDate = mealToEdit 
        ? new Date(mealToEdit.consumedAt) 
        : (selectedDate ? new Date(selectedDate) : new Date());
    
    if (timeValue) {
      const [hours, minutes] = timeValue.split(':').map(Number);
      baseDate.setHours(hours, minutes);
    } else if (!mealToEdit) {
        const now = new Date();
        baseDate.setHours(now.getHours(), now.getMinutes());
    }

    formData.set('date', baseDate.toISOString());
    
    if (mealToEdit) {
        formData.append('id', mealToEdit.id);
    }

    try {
      await addMeal(formData);
      toast.success(mealToEdit ? 'Meal updated successfully' : 'Meal added successfully');
      setOpen(false);
      // Refresh suggestions after adding
      getUniqueMealDescriptions().then(setSuggestions).catch(console.error);
    } catch (error) {
      toast.error(mealToEdit ? 'Failed to update meal' : 'Failed to add meal');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const isEditing = !!mealToEdit;

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      {trigger ? (
        <DrawerTrigger asChild>
          {trigger}
        </DrawerTrigger>
      ) : (
        <div className="hidden md:block">
          <DrawerTrigger asChild>
            <Button size="lg" className="shadow-sm font-medium">
              <Plus className="mr-2 h-4 w-4" /> Add Meal
            </Button>
          </DrawerTrigger>
        </div>
      )}

      <DrawerContent className="outline-none">
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader className="text-center pt-6 pb-2">
            <DrawerTitle className="text-2xl font-semibold tracking-tight flex items-center justify-center gap-2">
                {isEditing ? <Pencil className="h-5 w-5 text-primary" /> : null}
                {isEditing ? 'Edit Meal' : 'Add Meal'}
            </DrawerTitle>
            <DrawerDescription className="text-base">
                {isEditing ? 'Update your meal details below.' : 'What did you eat today?'}
            </DrawerDescription>
          </DrawerHeader>

          {!isEditing && (
            <div className="px-6 py-2">
              <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4 text-center relative overflow-hidden">
                <Quote className="absolute top-2 left-2 h-4 w-4 text-blue-200/50 rotate-180" />
                <p className="text-sm font-medium text-blue-800/80 italic relative z-10">
                  {randomMessage}
                </p>
                <Quote className="absolute bottom-2 right-2 h-4 w-4 text-blue-200/50" />
              </div>
            </div>
          )}

          <form onSubmit={onSubmit} className="p-6 space-y-6 pt-2">
            <div className="space-y-3">
              <Label htmlFor="description" className="text-base font-medium">Meal Description</Label>
              
              <Popover open={isPopoverOpen && filteredSuggestions.length > 0} onOpenChange={setIsPopoverOpen}>
                <PopoverTrigger asChild>
                    <div className="relative">
                        <Input
                            id="description"
                            name="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="e.g., Oatmeal with berries"
                            required
                            autoFocus
                            autoComplete="off"
                            className="h-12 text-lg bg-muted/30 focus-visible:bg-background transition-colors"
                        />
                    </div>
                </PopoverTrigger>
                <PopoverContent className="p-0" align="start" onOpenAutoFocus={(e) => e.preventDefault()}>
                    <Command>
                        <CommandList>
                            <CommandGroup>
                                {filteredSuggestions.map((suggestion) => (
                                    <CommandItem
                                        key={suggestion}
                                        value={suggestion}
                                        onSelect={() => {
                                            setDescription(suggestion);
                                            setIsPopoverOpen(false);
                                        }}
                                    >
                                        {suggestion}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                    <Label htmlFor="quantity" className="text-base font-medium">Quantity <span className="text-muted-foreground font-normal text-xs">(Optional)</span></Label>
                    <Input
                        id="quantity"
                        name="quantity"
                        defaultValue={mealToEdit?.quantity || ''}
                        placeholder="e.g., 1 bowl"
                        className="h-12 text-lg bg-muted/30 focus-visible:bg-background transition-colors"
                    />
                </div>
                <div className="space-y-3">
                    <Label htmlFor="time" className="text-base font-medium">Time</Label>
                    <div className="relative">
                        <Input
                            id="time"
                            name="time"
                            type="time"
                            defaultValue={mealToEdit ? format(new Date(mealToEdit.consumedAt), 'HH:mm') : format(new Date(), 'HH:mm')}
                            required
                            className="h-12 text-lg bg-muted/30 focus-visible:bg-background transition-colors pl-10"
                        />
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                    </div>
                </div>
            </div>

            <DrawerFooter className="px-0 pt-2">
              <Button type="submit" size="lg" className="h-12 text-base font-semibold w-full" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? 'Save Changes' : 'Save Meal'}
              </Button>
              <DrawerClose asChild>
                <Button variant="ghost" size="lg" className="h-12 w-full">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
