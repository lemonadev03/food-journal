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
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 text-center space-y-6">
      <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
        Track Your Nutrition <br className="hidden sm:inline" />
        <span className="text-primary">Effortlessly</span>
      </h1>
      <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
        A clean, modern food journal designed for mobile first. Log meals, track habits, and stay consistent.
      </p>
      <div className="flex gap-4">
        <Button asChild size="lg">
          <Link href="/handler/signup">Get Started</Link>
        </Button>
        <Button variant="outline" asChild size="lg">
          <Link href="/handler/sign-in">Sign In</Link>
        </Button>
      </div>
    </div>
  );
}
