import { Roboto } from "next/font/google";
import "./globals.css";
import TwitterNavbar from "../components/Navbar";
import { AuthProvider } from '@/app/providers';

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
});

export const metadata = {
  title: {
    template: 'CloneX | Your social network - %s',
    default: 'CloneX | Your social network - Home'
  },
  description: "Just a simple X clone",
  keywords: "social, network, share, online, meet people",
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} ${roboto.className} antialiasing bg-black min-h-screen`}>
        <AuthProvider>
          <div className="flex flex-col md:flex-row min-h-screen relative">
            <div className="md:fixed md:w-[250px] md:h-screen z-40">
              <TwitterNavbar />
            </div>
            <main className="flex-1 w-full md:w-[calc(100%-250px)] md:ml-[250px] pt-16 md:pt-4 pb-16 md:pb-0 px-4 md:px-8 bg-black text-white overflow-x-hidden">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}