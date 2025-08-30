"use client";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <main className="container mx-auto w-full px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-white md:text-5xl mb-8">Settings</h1>
        <Card className="max-w-2xl border-white/10 bg-white/5 backdrop-blur-lg text-white">
          <CardHeader><CardTitle>Profile Information</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue="Hon. Judge Alex Carter" className="bg-slate-800/50 border-white/20" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" defaultValue="alex.carter@judiciary.gov" className="bg-slate-800/50 border-white/20" />
            </div>
            <div className="flex justify-end">
              <Button>Save Changes</Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  );
}
