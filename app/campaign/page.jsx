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
import { Upload, Download } from "lucide-react";
import Navbar from "@/components/navbar"; // Import Navbar
import { motion } from "framer-motion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function ColdEmailCampaign() {
  const [company_name, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [engagement_level, setEngagementLevel] = useState(5);
  const [objection, setObjection] = useState("");
  const [recipient_email, setRecipientEmail] = useState("");
  const [recipient_phone, setRecipientPhone] = useState("");
  const [acceptedFile, setAcceptedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [generatedEmail, setGeneratedEmail] = useState("");
  const [engagementAdvice, setEngagementAdvice] = useState("");
  const [generatedData, setGeneratedData] = useState("");
  const [insurance_company_name, setMyCompanyName] = useState("");
  const [sender_name, setSenderName] = useState("");
  const [sender_email, setSenderEmail] = useState("");
  const [isCalling, setIsCalling] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [sending, setSending] = useState(false);
  const [mode, setMode] = useState("Single");
  const [downloadUrl, setDownloadUrl] = useState("");



  const dummy_script = "Hello! This is an automated call. Thank you for testing our service."

   // Load values from cookies on component mount
   useEffect(() => {
    setMyCompanyName(Cookies.get("my_company_name") || "");
    setSenderName(Cookies.get("sender_name") || "");
    setSenderEmail(Cookies.get("sender_email") || "");
  }, []);
  
  const handleGenerateCampaign = async () => {
    setIsGenerating(true)
    try{
    const response = await fetch("https://gamma-cold-reach.onrender.com/api/email/generate", {
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
    toast.success("Email generated successfully!");
    } catch (error) {
      console.error("Error generating email:", error);
      toast.error("Failed to generate email.");
    }
    finally{
      setIsGenerating(false)
    }
  };

  const handleSendCampaign = async () => {
    setSending(true); // Disable button
    try{
    const response = await fetch("https://gamma-cold-reach.onrender.com/api/email/send", {
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
    toast.success("Email sent successfully!");
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to send email.");
    }
    finally{
      setSending(false); // Re-enable button after completion
    }
  };

  const handleCall = async () => {
    setIsCalling(true);
    try {
        const response = await fetch('https://gamma-cold-reach.onrender.com/api/call', {
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


const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["text/csv", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];
    if (!validTypes.includes(file.type)) {
      toast.error("Only CSV or Excel files are allowed!");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should not exceed 5MB.");
      return;
    }

    setAcceptedFile(file);
    toast.success("File selected successfully!");
  };

  const handleUploadAndSend = async () => {
    if (!acceptedFile) {
      toast.error("Please select an appropriate file first.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", acceptedFile);
    formData.append("insurance_company_name", insurance_company_name);
    formData.append("sender_name", sender_name);
    formData.append("sender_email", sender_email);

    try { //https://gamma-ec-auto-01.onrender.com/generate_batch
      const response = await fetch("https://gamma-cold-reach.onrender.com/api/upload", { 
        method: "POST",
        body: formData,
      });

      console.log(response)
      const data = await response.json();
      if (response.ok) {
        toast.success("Campaign sent successfully!");
        setDownloadUrl(data.file_url); // Store download URL from API response
      } else {
        toast.error("Upload failed: " + data.detail);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file.");
    } finally {
      setUploading(false);
    }
  };



const handleDownload = async () => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/download/${csvFile.name}`);
    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Campaign_Report.csv";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } else {
      toast.error("Report not ready yet.");
    }
  } catch (error) {
    console.error("Error downloading file:", error);
    toast.error("Failed to download report.");
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

          <div>
            <label className="font-semibold">Select Mode:</label>
            <RadioGroup
              defaultValue="Single"
              onValueChange={setMode}
              className="flex space-x-4 mt-2"
            >
              <RadioGroupItem value="Single" id="single" />
              <label htmlFor="single">Single</label>

              <RadioGroupItem value="Batch" id="batch" />
              <label htmlFor="batch">Batch</label>
            </RadioGroup>
          </div>


          <Input placeholder="Company Name" value={company_name} onChange={(e) => setCompanyName(e.target.value)} disabled={mode === "Batch"}/>
          <Input placeholder="Industry" value={industry} onChange={(e) => setIndustry(e.target.value)} disabled={mode === "Batch"}/>
          <label>Engagement Level: {engagement_level}</label>
          <Slider 
            min={1} 
            max={10} 
            step={1} 
            value={[engagement_level]} 
            onValueChange={(val) => setEngagementLevel(val[0])} 
            disabled={mode === "Batch"}
          />

          <Textarea placeholder="Potential Objections" value={objection} onChange={(e) => setObjection(e.target.value)} disabled={mode === "Batch"}/>
          <Input placeholder="Contact Email" value={recipient_email} onChange={(e) => setRecipientEmail(e.target.value)} disabled={mode === "Batch"}/>
          <Input placeholder="Phone Number" value={recipient_phone} onChange={(e) => setRecipientPhone(e.target.value)} disabled={mode === "Batch"}/>

          {/* File Upload Section */}
          {mode === "Batch" && (
            <div className="flex items-center space-x-4">
              <input type="file" accept=".csv" onChange={handleFileChange} />
              <Upload />
            </div>
          )}

          <Button onClick={handleUploadAndSend} 
                  className="bg-blue-500 text-white hover:bg-blue-600" 
                  disabled={uploading || mode === "Single" }
          >
            {uploading ? "Uploading..." :  "Upload & Send Campaign"}
          </Button>
        
          {/* File Upload Section ends here*/}

          {/* NEW DOWNLOAD BUTTON */}
          {downloadUrl && (
            <Button onClick={handleDownload} className="bg-green-500 text-white hover:bg-green-600 flex items-center">
              <Download className="mr-2" /> Download Report
            </Button>
          )}



          <Card>
            <CardContent>
              <h2 className="font-semibold">Email Preview</h2>
              <Textarea value={generatedEmail} onChange={(e) => setGeneratedEmail(e.target.value)} rows={7} disabled={mode === "Batch"}/>
              <h2 className="font-semibold mt-4">Engagement Advice</h2>
              <p>{engagementAdvice}</p>
            </CardContent>
          </Card>

          <Button onClick={handleGenerateCampaign} 
                  className="bg-green-500 text-white hover:bg-green-600 mr-4" 
                  disabled={isGenerating || mode === "Batch"}>{isGenerating ? "Generating ...": "Generate Email"}</Button>
          <Button onClick={handleSendCampaign} 
                  className="bg-blue-500 text-white hover:bg-blue-600 mr-4"
                  disabled={sending || mode === "Batch"}>{sending ? "Sending..." : "Send Campaign"}</Button>
          <motion.button
                onClick={handleCall}
                className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center justify-center"
                whileTap={{ scale: 0.9 }}
                animate={isCalling ? { scale: [1, 1.1, 1], transition: { repeat: Infinity, duration: 0.8 } } : {}}
                disabled={mode === "Batch"}
            >
                <MdLocalPhone className="mr-2" />
                {isCalling ? "Calling..." : "Initiate Cold Call"}
            </motion.button>
        </div>
      </div>
    </div>
  );
}