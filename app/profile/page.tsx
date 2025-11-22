import { stackServerApp } from "@/stack/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { ProfileForm } from "./profile-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function ProfilePage() {
  const user = await stackServerApp.getUser();

  if (!user) {
    redirect("/handler/sign-in");
  }

  const preferences = await prisma.preference.findUnique({
    where: { userId: user.id },
  });

  return (
    <div className="container max-w-md mx-auto p-4 space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <Button variant="outline" asChild size="sm">
            <Link href="/handler/sign-out">Sign Out</Link>
        </Button>
      </div>
      
      <ProfileForm 
        initialPreferences={preferences} 
        userEmail={user.primaryEmail || ''} 
      />
    </div>
  );
}

