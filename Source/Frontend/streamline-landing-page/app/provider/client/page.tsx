"use client";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

const clients = [
  { id: 'C-12345', name: 'John Doe', status: 'Awaiting Hearing' },
  { id: 'C-98765', name: 'Michael Brown', status: 'Bail Granted' },
];

export default function ClientsPage() {
  return (
    <main className="container mx-auto w-full px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-4xl font-bold text-white md:text-5xl mb-2">Client Management</h1>
                <p className="text-lg text-gray-300">View and manage all your active clients.</p>
            </div>
            <Button><UserPlus className="mr-2 h-5 w-5"/>Add New Client</Button>
        </div>
        <Card className="border-white/10 bg-white/5 text-white backdrop-blur-lg">
          <CardHeader>
              <CardTitle>Client Roster</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="p-4">Client ID</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Case Status</th>
                </tr>
              </thead>
              <tbody>
                {clients.map(c => (
                  <tr key={c.id} className="border-b border-white/10 hover:bg-white/5">
                    <td className="p-4 font-mono">{c.id}</td>
                    <td className="p-4">{c.name}</td>
                    <td className="p-4"><span className={c.status === 'Bail Granted' ? 'text-emerald-400' : 'text-amber-400'}>{c.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  );
}
