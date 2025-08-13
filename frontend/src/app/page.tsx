import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
  <div className="min-h-screen flex items-center justify-center">
    <Link
      href="/interview"
    className="items-center text-center bg-black text-amber-50 text-2xl border px-6 py-3 rounded-lg hover:bg-gray-800">Start the interview</Link>
  </div>  
  );
}
