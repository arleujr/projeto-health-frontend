import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Activity, Users, ClipboardList, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Premium Dashboard Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-sans">General Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Real-time clinical monitoring and pending prescriptions.
        </p>
      </div>

      {/* 🚀 HIGH-TICKET BENTO GRID LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[160px]">
        
        {/* Card 1: Active Plans Metric (1 col, 1 row) */}
        <ErrorBoundary fallbackMessage="Failed to load Active Plans metric.">
          <Card className="md:col-span-1 rounded-2xl border-slate-100 shadow-sm transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Active Plans</CardTitle>
              <Activity className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent className="pt-2">
              <div className="text-4xl font-bold tracking-tight text-slate-900">--</div>
              <p className="text-xs text-muted-foreground mt-1">Patients currently evolving</p>
            </CardContent>
          </Card>
        </ErrorBoundary>

        {/* Card 2: Pending Actions Metric (1 col, 1 row) */}
        <ErrorBoundary fallbackMessage="Failed to load Pending Actions metric.">
          <Card className="md:col-span-1 rounded-2xl border-slate-100 shadow-sm transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Pending Actions</CardTitle>
              <Users className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent className="pt-2">
              <div className="text-4xl font-bold tracking-tight text-slate-900">--</div>
              <p className="text-xs text-muted-foreground mt-1">Awaiting immediate prescription</p>
            </CardContent>
          </Card>
        </ErrorBoundary>

        {/* Card 3: Adherence Rate Metric (1 col, 1 row) */}
        <ErrorBoundary fallbackMessage="Failed to load Adherence Rate metric.">
          <Card className="md:col-span-1 rounded-2xl border-slate-100 shadow-sm transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Adherence Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent className="pt-2">
              <div className="text-4xl font-bold tracking-tight text-slate-900">--%</div>
              <p className="text-xs text-muted-foreground mt-1">Average routines completed</p>
            </CardContent>
          </Card>
        </ErrorBoundary>

        {/* Card 4: PENDING ACTIONS LIST (2 cols wide, 2 rows high) */}
        <ErrorBoundary fallbackMessage="Critical failure inside the Priority Queue block.">
          <Card className="md:col-span-2 md:row-span-2 rounded-2xl border-slate-100 shadow-sm flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="text-lg font-semibold tracking-tight">Priority Queue</CardTitle>
              <CardDescription>Linked patients without an active plan in the ecosystem.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex items-center justify-center border-t border-dashed border-slate-100 m-6 rounded-xl bg-slate-50/50">
              <div className="text-center space-y-1">
                <ClipboardList className="h-8 w-8 text-slate-300 mx-auto" />
                <p className="text-sm font-medium text-slate-400">Fetching live queue from TanStack Query...</p>
              </div>
            </CardContent>
          </Card>
        </ErrorBoundary>

        {/* Card 5: Interactive Hub / Quick Actions (1 col wide, 2 rows high) */}
        <ErrorBoundary fallbackMessage="Failed to load Quick Actions hub.">
          <Card className="md:col-span-1 md:row-span-2 rounded-2xl border-slate-100 shadow-sm bg-slate-950 text-white flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="text-lg font-medium tracking-tight text-slate-200">Zero-Friction Hub</CardTitle>
              <CardDescription className="text-slate-400">Quick onboarding generation.</CardDescription>
            </CardHeader>
            <CardContent className="pb-6">
              <p className="text-xs text-slate-400 leading-relaxed">
                Use this modular space to trigger temporary OTP tokens for test environment or link new clinical profiles directly.
              </p>
              <div className="w-full h-12 mt-6 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-xs font-medium text-slate-300 cursor-pointer hover:bg-slate-800 transition-colors">
                Generate Onboarding Link
              </div>
            </CardContent>
          </Card>
        </ErrorBoundary>

      </div>
    </div>
  );
}