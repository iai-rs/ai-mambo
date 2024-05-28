import "~/styles/globals.css";

import { Inter } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import TopBar from "../components/TopBar";
import { SessionProvider } from "next-auth/react";
import { auth } from "~/auth";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Title", // TODO: title
  description: "description", // TODO: description
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  console.log("SESS", { session });

  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <div className="flex flex-col">
          <SessionProvider session={session}>
            <TopBar />
            <TRPCReactProvider>{children}</TRPCReactProvider>
          </SessionProvider>
        </div>
      </body>
    </html>
  );
}
