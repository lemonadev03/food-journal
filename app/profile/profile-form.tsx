'use client';

import * as React from 'react';
import { Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { updateProfile } from './actions';

interface ProfileFormProps {
  initialPreferences?: {
    defaultMealType: string | null;
    dietaryTags: string[];
  } | null;
  userEmail?: string;
}

export function ProfileForm({ initialPreferences, userEmail }: ProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    try {
      await updateProfile(formData);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>Manage your preferences and settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={userEmail || ''} disabled className="bg-muted" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="defaultMealType">Default Meal Type</Label>
            <Select name="defaultMealType" defaultValue={initialPreferences?.defaultMealType || "Breakfast"}>
              <SelectTrigger>
                <SelectValue placeholder="Select a meal type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Breakfast">Breakfast</SelectItem>
                <SelectItem value="Lunch">Lunch</SelectItem>
                <SelectItem value="Dinner">Dinner</SelectItem>
                <SelectItem value="Snack">Snack</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">This will be the default selection when adding a new meal.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dietaryTags">Dietary Tags</Label>
            <Input 
              id="dietaryTags" 
              name="dietaryTags" 
              placeholder="e.g. Vegan, Gluten-Free (comma separated)" 
              defaultValue={initialPreferences?.dietaryTags.join(', ') || ''}
            />
            <p className="text-xs text-muted-foreground">Tags help categorize your meals (optional).</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}

