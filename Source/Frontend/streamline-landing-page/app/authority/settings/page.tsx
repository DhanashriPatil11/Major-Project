"use client";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FileSearch } from "lucide-react";

const archivedCases = [
  { id: 'C-67890', defendant: 'Jane Smith', decision: 'Approved', date: '2025-08-15' },
  { id: 'C-54321', defendant: 'Peter Jones', decision: 'Rejected', date: '2025-08-12' },
  // ... more mock data
];

export default function ArchivePage() {
  return (
    <main className="container mx-auto w-full px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-white md:text-5xl mb-4">Case Archive</h1>
        <p className="text-lg text-gray-300 mb-8">Search and review past case decisions.</p>
        <Card className="border-white/10 bg-white/5 text-white backdrop-blur-lg">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Archived Cases</CardTitle>
              <div className="relative w-72">
                <FileSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input placeholder="Search by Case ID or Defendant..." className="pl-10 bg-slate-800/50 border-white/20"/>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="p-4">Case ID</th>
                  <th className="p-4">Defendant</th>
                  <th className="p-4">Final Decision</th>
                  <th className="p-4">Date Decided</th>
                </tr>
              </thead>
              <tbody>
                {archivedCases.map(c => (
                  <tr key={c.id} className="border-b border-white/10 hover:bg-white/5">
                    <td className="p-4 font-mono">{c.id}</td>
                    <td className="p-4">{c.defendant}</td>
                    <td className="p-4"><span className={c.decision === 'Approved' ? 'text-emerald-400' : 'text-red-400'}>{c.decision}</span></td>
                    <td className="p-4">{c.date}</td>
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
