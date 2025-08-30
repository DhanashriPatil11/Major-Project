"use client";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
    { title: "Total Cases Reviewed", value: "1,204" },
    { title: "Approval Rate", value: "68.2%" },
    { title: "Average Decision Time", value: "48 Hours" },
];

export default function AnalyticsPage() {
  return (
    <main className="container mx-auto w-full px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-white md:text-5xl mb-8">Performance Analytics</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {stats.map(stat => (
            <Card key={stat.title} className="border-white/10 bg-white/5 backdrop-blur-lg text-white">
              <CardHeader><CardTitle className="text-lg text-gray-300 font-medium">{stat.title}</CardTitle></CardHeader>
              <CardContent><p className="text-4xl font-bold">{stat.value}</p></CardContent>
            </Card>
          ))}
        </div>
        <Card className="border-white/10 bg-white/5 backdrop-blur-lg text-white">
            <CardHeader><CardTitle>Case Decisions Over Time (Placeholder)</CardTitle></CardHeader>
            <CardContent>
                <div className="h-64 w-full flex items-end gap-2 p-4 bg-slate-800/50 rounded-lg">
                    <div className="w-full bg-blue-500 rounded-t-md" style={{height: '60%'}}></div>
                    <div className="w-full bg-blue-500 rounded-t-md" style={{height: '40%'}}></div>
                    <div className="w-full bg-blue-500 rounded-t-md" style={{height: '75%'}}></div>
                    <div className="w-full bg-blue-500 rounded-t-md" style={{height: '80%'}}></div>
                    {/* ... more bars */}
                </div>
            </CardContent>
        </Card>
      </motion.div>
    </main>
  );
}
