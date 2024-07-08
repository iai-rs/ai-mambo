import "~/styles/globals.css";

import { Inter } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import TopBar from "../components/TopBar";
import { SessionProvider } from "next-auth/react";
import { auth } from "~/auth";
import { ThemeProvider } from "~/contexts/ThemeContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "INSTITUT ZA ONKOLOGIJU I RADIOLOGIJU SRBIJE", // TODO: title
  description: "INSTITUT ZA ONKOLOGIJU I RADIOLOGIJU SRBIJE", // TODO: description
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <div>
          <SessionProvider session={session}>
            <ThemeProvider>
              <TopBar />
              <TRPCReactProvider>{children}</TRPCReactProvider>
            </ThemeProvider>
          </SessionProvider>
        </div>
      </body>
    </html>
  );
}
