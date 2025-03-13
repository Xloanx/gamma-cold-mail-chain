'use client'

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { toast, Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { MdLocalPhone } from "react-icons/md";
import { Upload } from "lucide-react";
import Navbar from "@/components/navbar"; // Import Navbar
import { motion } from "framer-motion";

export default function ColdEmailCampaign() {
  const [company_name, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [engagement_level, setEngagementLevel] = useState(5);
  const [objection, setObjection] = useState("");
  const [recipient_email, setRecipientEmail] = useState("");
  const [recipient_phone, setRecipientPhone] = useState("");
  const [csvFile, setCsvFile] = useState(null);
  const [generatedEmail, setGeneratedEmail] = useState("");
  const [engagementAdvice, setEngagementAdvice] = useState("");
  const [generatedData, setGeneratedData] = useState("");
  const [status, setStatus] = useState("");
  const [insurance_company_name, setMyCompanyName] = useState("");
  const [sender_name, setSenderName] = useState("");
  const [sender_email, setSenderEmail] = useState("");
  const [isCalling, setIsCalling] = useState(false);

  const dummy_script = "Hello! This is an automated call. Thank you for testing our service."

   // Load values from cookies on component mount
   useEffect(() => {
    setMyCompanyName(Cookies.get("my_company_name") || "");
    setSenderName(Cookies.get("sender_name") || "");
    setSenderEmail(Cookies.get("sender_email") || "");
  }, []);
  
  const handleGenerateCampaign = async () => {
    try{
    const response = await fetch("http://127.0.0.1:8000/api/email/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        recipient_email,
        recipient_phone,
        company_name, 
        industry,
        engagement_level,
        objection,
        insurance_company_name,
        sender_name,
        sender_email 
      }),
    });
    const data = await response.json();
    console.log(data);
    setGeneratedEmail(data.email);
    setEngagementAdvice(data.advise)
    setGeneratedData(data);
    setStatus(data.message);
    toast.success("Email generated successfully!");
    } catch (error) {
      console.error("Error generating email:", error);
      toast.error("Failed to generate email.");
    }
  };

  const handleSendCampaign = async () => {
    try{
    const response = await fetch("http://127.0.0.1:8000/api/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        sender_email,
        recipient_email,
        subject : generatedData.subject, 
        generatedEmail
      }),
    });
    const data = await response.json();
    console.log(data)
    setStatus(data.message);
    toast.success("Email sent successfully!");
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to send email.");
    }
  };

  const handleCall = async () => {
    setIsCalling(true);
    try {
        const response = await fetch('http://127.0.0.1:8000/api/call', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                recipient_phone: generatedData.recipient_phone || recipient_phone,
                call_script: generatedData.call_script || dummy_script
            }),
        });
        console.log(response)
        const data = await response.json();
        console.log(data);

        if (response.ok) {
            toast.success("Call initiated!");
        } else {
            toast.error("Error: " + data.detail);
        }
    } catch (error) {
        toast.error("Failed to initiate call.");
    } finally {
        setIsCalling(false);
    }
};


  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-500 to-purple-700">
      <Toaster position="top-right" /> {/* Toast Notification Component */}

      {/* Fixed Navbar at the top */}
      <Navbar className="fixed top-0 left-0 w-full z-50 bg-white shadow-md" />

      {/* Centered form container */}
      <div className="flex justify-center items-center min-h-screen pt-16">
        <div className="max-w-2xl w-full p-6 space-y-6 border rounded-lg shadow-lg bg-white">
          <h1 className="text-xl font-bold text-center">AI Cold Email Campaign</h1>
          <Input placeholder="Company Name" value={company_name} onChange={(e) => setCompanyName(e.target.value)} />
          <Input placeholder="Industry" value={industry} onChange={(e) => setIndustry(e.target.value)} />
          <label>Engagement Level: {engagement_level}</label>
          <Slider 
            min={1} 
            max={10} 
            step={1} 
            value={[engagement_level]} 
            onValueChange={(val) => setEngagementLevel(val[0])} 
          />

          <Textarea placeholder="Potential Objections" value={objection} onChange={(e) => setObjection(e.target.value)} />
          <Input placeholder="Contact Email" value={recipient_email} onChange={(e) => setRecipientEmail(e.target.value)} />
          <Input placeholder="Phone Number" value={recipient_phone} onChange={(e) => setRecipientPhone(e.target.value)} />
          
          <div className="flex items-center space-x-4">
            <input type="file" accept=".csv" onChange={(e) => setCsvFile(e.target.files[0])} />
            <Upload />
          </div>

          <Button onClick={handleGenerateCampaign} className="bg-blue-500 text-white hover:bg-blue-600">Generate Email</Button>

          <Card>
            <CardContent>
              <h2 className="font-semibold">Email Preview</h2>
              <Textarea value={generatedEmail} onChange={(e) => setGeneratedEmail(e.target.value)} rows={7}/>
              <h2 className="font-semibold mt-4">Engagement Advice</h2>
              <p>{engagementAdvice}</p>
            </CardContent>
          </Card>

          <Button onClick={handleGenerateCampaign} className="bg-green-500 text-white hover:bg-green-600 mr-4">Generate Email</Button>
          <Button onClick={handleSendCampaign} className="bg-blue-500 text-white hover:bg-blue-600 mr-4">Send Campaign</Button>
          <motion.button
                onClick={handleCall}
                className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center justify-center"
                whileTap={{ scale: 0.9 }}
                animate={isCalling ? { scale: [1, 1.1, 1], transition: { repeat: Infinity, duration: 0.8 } } : {}}
            >
                <MdLocalPhone className="mr-2" />
                {isCalling ? "Calling..." : "Initiate Cold Call"}
            </motion.button>
          {/* {status && <p className="text-green-600">Status: {status}</p>} */}
        </div>
      </div>
    </div>
  );
}