import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md py-4 px-6 flex justify-between items-center z-50">
      <h1 className="text-lg font-bold text-gray-800">Cold Email Campaign</h1>
      <div className="space-x-4">
        <Link href="/" className="text-gray-600 hover:text-blue-500">Home</Link>
        <Link href="/settings" className="text-gray-600 hover:text-blue-500">Settings</Link>
        <SignOutButton >
          <Button className="text-gray-600 hover:text-blue-500  bg-red-600 hover:bg-red-700 py-2 px-6 rounded-lg text-lg">
              Logout
          </Button>
          </SignOutButton>
      </div>
    </nav>
  );
}
