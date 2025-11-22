'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { stackServerApp } from '@/stack/server';

export async function updateProfile(formData: FormData) {
  const user = await stackServerApp.getUser();
  if (!user) {
    throw new Error('Unauthorized');
  }

  const defaultMealType = formData.get('defaultMealType') as string;
  // Handling multi-select tags from FormData can be tricky depending on how they are submitted.
  // A simple way is comma-separated string or multiple entries with same name.
  // Let's assume a simplified comma-separated string for now or multiple checkboxes.
  const dietaryTagsStr = formData.get('dietaryTags') as string;
  const dietaryTags = dietaryTagsStr ? dietaryTagsStr.split(',').map(t => t.trim()).filter(Boolean) : [];

  await prisma.preference.upsert({
    where: {
      userId: user.id,
    },
    update: {
      defaultMealType,
      dietaryTags,
    },
    create: {
      userId: user.id,
      defaultMealType,
      dietaryTags,
    },
  });

  revalidatePath('/profile');
  return { success: true };
}

