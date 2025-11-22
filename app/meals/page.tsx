import { stackServerApp } from "@/stack/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { MealsView } from "./meals-view";

export default async function MealsPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const user = await stackServerApp.getUser();

  if (!user) {
    redirect("/handler/sign-in");
  }
  
  const resolvedSearchParams = await searchParams;

  // Parse date from searchParams or default to today
  let targetDate = new Date();
  if (resolvedSearchParams.date) {
    const parsed = new Date(resolvedSearchParams.date);
    if (!isNaN(parsed.getTime())) {
      targetDate = parsed;
    }
  }

  // Set start and end of the target day for Prisma query
  // We want meals where consumedAt is within this day (00:00:00 to 23:59:59 local time ideally, 
  // but simplistic UTC handling often works if we are consistent. 
  // For a real app, we'd handle timezones carefully. Here we assume naive dates or UTC storage.)
  
  const startOfDay = new Date(targetDate);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(targetDate);
  endOfDay.setHours(23, 59, 59, 999);

  const meals = await prisma.meal.findMany({
    where: {
      userId: user.id,
      consumedAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
    orderBy: {
      consumedAt: 'desc',
    },
  });

  return (
    <MealsView initialMeals={meals} initialDate={targetDate} />
  );
}

