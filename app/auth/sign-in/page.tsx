import type { Metadata } from "next";
import { Globe, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to Chunkify with Google or Discord through Supabase Auth."
};

export default function SignInPage() {
  return (
    <main className="grid min-h-[calc(100vh-4rem)] place-items-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign in to Chunkify</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <form action="/auth/sign-in/google" method="post">
            <Button className="w-full" type="submit">
              <Globe className="h-4 w-4" />
              Continue with Google
            </Button>
          </form>
          <form action="/auth/sign-in/discord" method="post">
            <Button className="w-full" variant="secondary" type="submit">
              <MessageCircle className="h-4 w-4" />
              Continue with Discord
            </Button>
          </form>
          <p className="pt-3 text-sm text-muted-foreground">
            Provider credentials are configured in Supabase Auth. This app never receives OAuth client secrets in the browser.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
