"use client"

import { FileText, Shield, CheckCircle, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react";

const AnalogWatch = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);

  const watchSize = 80;
  const fixedPosition = {
    top: "15vh",
    left: "10vw",
    zIndex: 1,
  };

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourRotation = (hours * 30 + minutes * 0.5) % 360;
  const minuteRotation = (minutes * 6 + seconds * 0.1) % 360;
  const secondRotation = (seconds * 6) % 360;

  return (
    <div
      style={{
        ...fixedPosition,
        width: `${watchSize}px`,
        height: `${watchSize}px`,
        borderRadius: "50%",
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        position: "fixed",
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Watch Face */}
      <div
        style={{
          width: `${watchSize * 0.8}px`,
          height: `${watchSize * 0.8}px`,
          borderRadius: "50%",
          backgroundColor: "rgba(0, 0, 0, 0.1)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          position: "relative",
        }}
      >
        {/* Hour Hand */}
        <motion.div
          style={{
            width: "30%",
            height: "3px",
            backgroundColor: "gray",
            position: "absolute",
            top: "50%",
            left: "50%",
            transformOrigin: "left center",
            transform: `translate(-50%, -50%) rotate(${hourRotation}deg)`,
          }}
        />
        {/* Minute Hand */}
        <motion.div
          style={{
            width: "40%",
            height: "2px",
            backgroundColor: "lightgray",
            position: "absolute",
            top: "50%",
            left: "50%",
            transformOrigin: "left center",
            transform: `translate(-50%, -50%) rotate(${minuteRotation}deg)`,
          }}
        />
        {/* Second Hand */}
        <motion.div
          style={{
            width: "45%",
            height: "1px",
            backgroundColor: "white",
            position: "absolute",
            top: "50%",
            left: "50%",
            transformOrigin: "left center",
            transform: `translate(-50%, -50%) rotate(${secondRotation}deg)`,
          }}
        />
        {/* Center Dot */}
        <div
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            backgroundColor: "white",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>
    </div>
  );
};

export default function UndertrialPrisoner() {
  const features = [
    {
      icon: <Shield className="w-6 h-6 text-primary" />,
      title: "Case Number",
      description: "Track the real-time status of your bail application and case updates.",
    },
    {
      icon: null, // Removed LucideClock here
      title: "Name of Undertrial Prisoner",
      description: "Upload and manage necessary legal documents securely for your bail application.",
    },
    {
      icon: null, // Removed LucideClock here
      title: "Documents for Submission",
      description: "Upload and manage necessary legal documents securely for your bail application.",
    },
    {
      icon: <CheckCircle className="w-6 h-6 text-primary" />,
      title: "Automated Eligibility Check",
      description: "AI-powered bail eligibility assessment based on your case details.",
    },
    {
      icon: <FileText className="w-6 h-6 text-primary" />,
      title: "Legal Assistance",
      description: "Connect with legal aid providers for assistance in your case.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 relative overflow-hidden">
      {/* Animated background dots */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute opacity-30"
            animate={{
              x: ["0%", "100%", "0%"],
              y: ["0%", "100%", "0%"],
            }}
            transition={{
              duration: Math.random() * 10 + 20,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `radial-gradient(circle, ${
                ["#10B981", "#3B82F6", "#8B5CF6"][Math.floor(Math.random() * 3)]
              }33 0%, transparent 70%)`,
              width: `${Math.random() * 400 + 200}px`,
              height: `${Math.random() * 400 + 200}px`,
            }}
          />
        ))}
        {/* Fixed Analog Watch */}
        <AnalogWatch />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-white">Bail Reckoner</div>
          <div className="hidden md:flex space-x-6">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="#features" className="text-gray-300 hover:text-white transition-colors">
              Features
            </Link>
            <Link href="#about" className="text-gray-300 hover:text-white transition-colors">
              About
            </Link>
          </div>
          <Button variant="outline" className="text-white border-white/20 hover:bg-white/10">
            Contact Us
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Empowering Undertrial Prisoners with Legal Assistance
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Track your case, manage documents, and check bail eligibility using our AI-powered platform.
            </p>
            <Button size="lg" className="mr-4">
              Get Started
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white/20 hover:bg-white/10">
              Learn More
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-20 border-t border-white/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Key Features</h2>
            <p className="text-gray-300">Essential tools to support undertrial prisoners during the bail process.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
              >
                <div className="bg-white/10 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Undertrial Prisoner Form Card */}
      <section className="relative z-10 py-10 border-t border-white/10"> {/* Added top border for separation */}
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold text-white mb-6 text-center">
                Undertrial Prisoner Form
              </h1>
              <form className="space-y-6">
                {/* ... form elements ... */}
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 border-t border-white/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Take Control of Your Legal Rights</h2>
            <p className="text-xl text-gray-300 mb-8">
              Gain access to legal aid and bail tracking with our powerful platform.
            </p>
            <Button size="lg" className="mr-4">
              Get Started Now
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white/20 hover:bg-white/10">
              Contact Legal Aid
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}