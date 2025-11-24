'use client';

import * as React from 'react';
import { Home, User, Plus } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { AddMealDrawer } from '@/components/add-meal-drawer';
import { Suspense } from 'react';

function MobileNavContent() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  const searchParams = useSearchParams();
  const dateParam = searchParams.get('date');

  let selectedDate: Date | undefined;
  if (dateParam) {
    const parsed = new Date(dateParam);
    if (!isNaN(parsed.getTime())) {
      selectedDate = parsed;
    }
  }

  return (
    <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 md:hidden">
      <div className="flex items-center gap-1 p-2 pl-6 pr-6 rounded-full bg-background/80 backdrop-blur-xl border border-border/50 shadow-xl shadow-black/5 ring-1 ring-black/5">
        <Link
          href="/meals"
          className={cn(
            "relative flex flex-col items-center justify-center w-10 h-10 rounded-full transition-all duration-300",
            pathname.startsWith('/meals')
              ? "text-primary bg-primary/10"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          )}
        >
          <Home className={cn("h-5 w-5", pathname.startsWith('/meals') && "fill-current")} />
          <span className="sr-only">Meals</span>
        </Link>

        <AddMealDrawer
          selectedDate={selectedDate}
          open={open}
          onOpenChange={setOpen}
          trigger={
            <Button
              size="icon"
              className="h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90 hover:scale-105 transition-all duration-300 -my-4 mx-4 border-4 border-background"
            >
              <Plus className="h-7 w-7" />
              <span className="sr-only">Add Meal</span>
            </Button>
          }
        />

        <Link
          href="/profile"
          className={cn(
            "relative flex flex-col items-center justify-center w-10 h-10 rounded-full transition-all duration-300",
            pathname.startsWith('/profile')
              ? "text-primary bg-primary/10"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          )}
        >
          <User className={cn("h-5 w-5", pathname.startsWith('/profile') && "fill-current")} />
          <span className="sr-only">Profile</span>
        </Link>
      </div>
    </nav>
  );
}

export function MobileNav() {
  return (
    <Suspense fallback={null}>
      <MobileNavContent />
    </Suspense>
  );
}
