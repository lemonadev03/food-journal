'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { stackServerApp } from '@/stack/server';

export async function addMeal(formData: FormData) {
  const user = await stackServerApp.getUser();
  if (!user) {
    throw new Error('Unauthorized');
  }

  const description = formData.get('description') as string;
  const quantity = formData.get('quantity') as string;
  const dateStr = formData.get('date') as string;
  
  if (!description) {
    throw new Error('Description is required');
  }

  // If date is provided, use it; otherwise default to now.
  // We might want to combine the selected date with the current time if user is back-logging?
  // For MVP, let's assume "now" if logging for today, or set the time to noon if logging for past/future date without specific time?
  // Better: Let's just respect the date passed from the UI (which includes time if possible, or we default to current time on that date).
  
  let consumedAt = new Date();
  if (dateStr) {
    const selectedDate = new Date(dateStr);
    // Keep the time from "now" but use the year/month/day from selectedDate
    // This is a simple heuristic for "logging for this day".
    const now = new Date();
    selectedDate.setHours(now.getHours(), now.getMinutes(), now.getSeconds());
    consumedAt = selectedDate;
  }

  await prisma.meal.create({
    data: {
      userId: user.id,
      description,
      quantity,
      consumedAt,
    },
  });

  revalidatePath('/meals');
  return { success: true };
}

export async function deleteMeal(mealId: string) {
  const user = await stackServerApp.getUser();
  if (!user) {
    throw new Error('Unauthorized');
  }

  // Ensure the meal belongs to the user
  const meal = await prisma.meal.findUnique({
    where: { id: mealId },
  });

  if (!meal || meal.userId !== user.id) {
    throw new Error('Unauthorized or meal not found');
  }

  await prisma.meal.delete({
    where: { id: mealId },
  });

  revalidatePath('/meals');
  return { success: true };
}

