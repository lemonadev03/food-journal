import { stackServerApp } from "@/stack/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const user = await stackServerApp.getUser();

  if (user) {
    redirect("/meals");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] p-4 text-center space-y-8 animate-in fade-in duration-700">
      <div className="space-y-4 max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl md:text-7xl text-foreground">
          Track Your Nutrition <br className="hidden sm:inline" />
          <span className="text-primary">Effortlessly</span>
        </h1>
        <p className="max-w-[600px] mx-auto text-muted-foreground md:text-xl/relaxed lg:text-xl/relaxed leading-relaxed">
          A clean, modern food journal designed for mobile first. Log meals, track habits, and stay consistent with ease.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs sm:max-w-md justify-center pt-4">
        <Button asChild size="lg" className="h-12 text-base font-semibold rounded-full shadow-lg shadow-primary/20 transition-transform hover:scale-105">
          <Link href="/handler/signup">Get Started</Link>
        </Button>
        <Button variant="outline" asChild size="lg" className="h-12 text-base font-medium rounded-full border-2 hover:bg-muted/50">
          <Link href="/handler/sign-in">Sign In</Link>
        </Button>
      </div>
    </div>
  );
}
