'use client'

import { useRouter } from "next/navigation";
import Link from "next/link";
import { SignedIn, SignUpButton, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import Image from "next/image";

const LandingPage = () => {

    const router = useRouter();

 



    return ( 
        <div className="flex justify-start items-center min-h-screen pl-10">
            <motion.div 
                initial={{ x: "0vw", opacity: 0 }}  // Starts from the center
                animate={{ x: "-4vw", opacity: 1 }}  //Moves left
                transition={{ type: "spring", stiffness: 50, duration: 1.5 }}  //Extended duration
                className="w-[450px] overflow-hidden"  // Ensures no part of image is hidden
            >

          <Image src={"/gamma-campaign.png"} width={450} height={450} alt="Gamma Logo"/>

        </motion.div>
            
        <motion.div 
            initial={{ opacity: 0, x: 0 }}  //Starts at the center
            animate={{ opacity: 1, x: "5vw" }}  //Slides slightly right
            transition={{ delay: 1.5, duration: 1.2, ease: "easeInOut" }}  // delayed to start after logo settles
            className="ml-10 text-gray-300 w-[300px] flex flex-col items-center gap-6"
        >
          <h1 className="text-4xl font-black tracking-widest text-center text-black"> 
            Implement a hassles-free campaign with us
          </h1>

          {/* Motion Div for Get Started Button */}
          <motion.div
              initial={{ opacity: 0, y: 50 }}  //Starts lower
              animate={{ opacity: 1, y: 0 }}  //Moves up into position
              transition={{ delay: 2, duration: 1.2, ease: "easeOut" }}  // Delayed for smooth appearance
              className="mt-6"
          >

            <SignedIn>
            <Button className="bg-blue-500 hover:bg-blue-700 px-6 py-3 text-lg rounded-full shadow-lg mr-4"
                onClick={() => router.push("/campaign")}
                >
                Back To Campaign
            </Button>
            </SignedIn>

            <SignedOut>
                <SignUpButton mode="modal" forceRedirectUrl="/campaign">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg text-lg">
                    Get Started
                </Button>
                </SignUpButton>
            </SignedOut>
          </motion.div>

        </motion.div>
        </div>
     );
}
 
export default LandingPage;











