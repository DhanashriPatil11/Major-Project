"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { User, Bell, Shield } from "lucide-react";

export default function SettingsPage() {
  // State for interactive notification toggles
  const [notifications, setNotifications] = useState({
    caseUpdates: true,
    newClients: true,
    hearingReminders: false,
  });

  return (
    <main className="container mx-auto w-full px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-white md:text-5xl mb-8">Settings</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Profile Information Card */}
          <Card className="md:col-span-2 border-white/10 bg-white/5 backdrop-blur-lg text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User /> Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" defaultValue="Alex Ray" className="bg-slate-800/50 border-white/20" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="barId">Bar Association ID</Label>
                  <Input id="barId" defaultValue="BAR-758392" className="bg-slate-800/50 border-white/20" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue="alex.ray@legalaid.org" className="bg-slate-800/50 border-white/20" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input id="password" type="password" placeholder="••••••••" className="bg-slate-800/50 border-white/20" />
              </div>
              <div className="flex justify-end pt-2">
                <Button size="lg" className="bg-white text-slate-900 hover:bg-gray-200">Save Profile</Button>
              </div>
            </CardContent>
          </Card>

          {/* Notifications Card */}
          <Card className="border-white/10 bg-white/5 backdrop-blur-lg text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell /> Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="caseUpdates" className="flex-grow">Case Status Updates</Label>
                <Switch
                  id="caseUpdates"
                  checked={notifications.caseUpdates}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, caseUpdates: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="newClients" className="flex-grow">New Client Assigned</Label>
                <Switch
                  id="newClients"
                  checked={notifications.newClients}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, newClients: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="hearingReminders" className="flex-grow">Hearing Reminders</Label>
                <Switch
                  id="hearingReminders"
                  checked={notifications.hearingReminders}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, hearingReminders: checked }))}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </main>
  );
}
