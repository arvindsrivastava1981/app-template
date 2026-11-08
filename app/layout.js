import "./globals.css";
import { ToasterProvider } from "@/components/ui/Toaster";
import VersionBanner from "@/components/ui/VersionBanner";
import { APP_NAME } from "@/lib/public/branding";

export function generateMetadata() {
  return {
    title: { default: APP_NAME, template: `%s | ${APP_NAME}` },
    description: "App Template — Authentication, user management, and admin dashboard.",
    authors: [{ name: APP_NAME }],
    creator: APP_NAME,
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
    openGraph: {
      type: "website",
      locale: "en_US",
      url: "/",
      siteName: APP_NAME,
      title: APP_NAME,
      description: "App Template — Authentication, user management, and admin dashboard.",
    },
    twitter: {
      card: "summary_large_image",
      title: APP_NAME,
      description: "App Template — Authentication, user management, and admin dashboard.",
    },
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        <VersionBanner />
        <ToasterProvider>{children}</ToasterProvider>
      </body>
    </html>
  );
}