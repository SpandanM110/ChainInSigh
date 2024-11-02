import Image from "next/image";
import localFont from "next/font/local";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function Home() {
  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]`}
    >
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-3xl font-bold">Welcome to ChainInsight</h1>
        <p className="text-lg text-center sm:text-left">
          ChainInsight is your all-in-one platform for navigating the complex world of blockchain transactions and analytics. Here, we integrate cutting-edge technologies to provide you with a seamless experience in understanding and predicting blockchain interactions.
        </p>
        <h2 className="text-xl mt-4">Key Features:</h2>
        <ul className="list-disc list-inside text-sm sm:text-base">
          <li>Odos API Integration: Effortlessly explore token swap capabilities and pricing insights across multiple decentralized exchanges.</li>
          <li>Noves API Access: Gain comprehensive insights into Ethereum transactions with our powerful transaction description and preview features.</li>
          <li>Gemini AI Enhancements: Experience enhanced explanations and analyses of blockchain data.</li>
        </ul>
        <p className="text-lg text-center sm:text-left mt-4">
          At ChainInsight, we empower individuals and developers alike with the tools needed to make informed decisions in the rapidly evolving blockchain landscape. Start your journey with us today!
        </p>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        {/* Footer links can remain the same or be updated as needed */}
      </footer>
    </div>
  );
}
