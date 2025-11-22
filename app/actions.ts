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
  const id = formData.get('id') as string;
  
  if (!description) {
    throw new Error('Description is required');
  }

  let consumedAt = new Date();
  if (dateStr) {
    // Trust the client to send the full timestamp (Date + Time)
    consumedAt = new Date(dateStr);
  }

  if (id) {
    // Edit existing meal
    const existingMeal = await prisma.meal.findUnique({
        where: { id },
    });

    if (!existingMeal || existingMeal.userId !== user.id) {
        throw new Error('Unauthorized or meal not found');
    }

    await prisma.meal.update({
        where: { id },
        data: {
            description,
            quantity,
            consumedAt,
        },
    });
  } else {
    // Create new meal
    await prisma.meal.create({
        data: {
          userId: user.id,
          description,
          quantity,
          consumedAt,
        },
    });
  }

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

export async function getUniqueMealDescriptions() {
    const user = await stackServerApp.getUser();
    if (!user) {
        return [];
    }

    // Group by description to get unique entries
    // Prisma doesn't support distinct on findMany deeply efficiently with large datasets but for per-user it's fine.
    // Or we can just fetch all distinct descriptions.
    const uniqueMeals = await prisma.meal.findMany({
        where: {
            userId: user.id,
        },
        distinct: ['description'],
        select: {
            description: true,
        },
        orderBy: {
            description: 'asc',
        }
    });

    return uniqueMeals.map(m => m.description);
}
