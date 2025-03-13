'use client'

import { useState, useEffect} from "react";
import Cookies from "js-cookie";
import { toast, Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/navbar"; // Import Navbar
import { useRouter } from "next/navigation";

export default function Settings() {
  const [my_company_name, setMyCompanyName] = useState("");
  const [sender_name, setSenderName] = useState("");
  const [sender_email, setSenderEmail] = useState("");
  const router = useRouter();


// Save email settings to cookies
  const handleSaveSettings = () => {
    if (!sender_email || !sender_name || !my_company_name) {
      toast.error("Please fill in all fields before saving.");
      return;
    }

    Cookies.set("my_company_name", my_company_name, { expires: 7 });
    Cookies.set("sender_name", sender_name, { expires: 7 });
    Cookies.set("sender_email", sender_email, { expires: 7 });

    toast.success("Email settings saved successfully!");
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-500 to-purple-700">
      <Toaster position="top-right" /> {/* Toast Notification Component */}

      {/* Fixed Navbar at the top */}
      <Navbar className="fixed top-0 left-0 w-full z-50 bg-white shadow-md" />

      {/* Centered form container */}
      <div className="flex justify-center items-center min-h-screen pt-16">
        <div className="max-w-2xl w-full p-6 space-y-6 border rounded-lg shadow-lg bg-white">
          <h1 className="text-xl font-bold text-center">Settings</h1>
          <Button className="bg-blue-500 hover:bg-blue-700 px-6 py-3 text-sm rounded-full shadow-lg mr-4"
              onClick={() => router.push("/campaign")}
              >
              Back To Campaign
          </Button>
            <Card>
                <CardContent className="ml-10 text-gray-300 w-[600px] flex items-center justify-between">
                    
                    {/* Input Fields - Maintain Size & Spacing */}
                    <div className="flex flex-col flex-grow space-y-4">
                        <h5 className="text-xl font-bold text-center">Email Parameters</h5>
                        <Input 
                            placeholder="Set Your Company Name" 
                            value={my_company_name} 
                            onChange={(e) => setMyCompanyName(e.target.value)} 
                        />
                        <Input 
                            placeholder="Set the Sender's Name" 
                            value={sender_name} 
                            onChange={(e) => setSenderName(e.target.value)} 
                        />
                        <Input 
                            placeholder="Set Your Email Address Here" 
                            value={sender_email} 
                            onChange={(e) => setSenderEmail(e.target.value)} 
                        />
                    </div>

                    {/* Save Button - Aligned to the Right */}
                    <Button 
                        onClick={handleSaveSettings} 
                        className="bg-blue-500 text-white hover:bg-blue-600 ml-6"
                    >
                        Save Email Details
                    </Button>
                </CardContent>
            </Card>

          


          {/* <Card>
            <CardContent>
              <h2 className="font-semibold">Email Preview</h2>
              <Textarea value={generatedEmail} onChange={(e) => setGeneratedEmail(e.target.value)} rows={7}/>
              {/* <Textarea
                ref={textareaRef}
                value={generatedEmail}
                onChange={handleTextAreaChange}
                rows={7} // Start with a single row
                style={{ overflow: "hidden", resize: "none" }} // Prevent manual resizing
              /> */}
              {/* <h2 className="font-semibold mt-4">Engagement Advice</h2> */}
              {/* <p>{engagementAdvice}</p> */}
            {/* </CardContent>
          </Card>

          <Button onClick={handleGenerateCampaign} className="bg-green-500 text-white hover:bg-green-600 mr-4">Generate Email</Button>
          <Button onClick={handleSendCampaign} className="bg-blue-500 text-white hover:bg-blue-600 mr-4">Send Campaign</Button>
          <Button className="bg-red-500 text-white hover:bg-red-600">Initiate Cold Call</Button> */}
          {/*{status && <p className="text-green-600">Status: {status}</p>} */}
        </div>
      </div>
    </div>
  );
}
