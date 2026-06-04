'use client';

import React from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { api } from '@/lib/pi-client';
import { Users, ArrowRight, UserPlus } from 'lucide-react';

interface PatientListItem {
  id: string;
  name: string;
  status: 'ACTIVE' | 'INACTIVE';
}

// fetcher usando o client já configurado
const fetcher = (url: string) => api.get(url).then(res => res.data);

export default function DashboardPage() {
  // SWR cuida de cache, revalidação e atualização automática
  const { data, error, isLoading } = useSWR('/v1/plans/dashboard', fetcher);

  // se a API não retornar no formato esperado, tratamos aqui
  const patients: PatientListItem[] =
    data && Array.isArray(data.patients)
      ? data.patients
      : [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans w-full flex justify-center">
        <div className="max-w-5xl w-full space-y-8 animate-pulse">
          <div className="border-b border-slate-200 pb-6 space-y-3">
            <div className="h-8 bg-slate-200 rounded-lg w-1/4"></div>
            <div className="h-4 bg-slate-200 rounded-lg w-1/3"></div>
          </div>
          <div className="space-y-4">
            <div className="h-6 bg-slate-200 rounded-lg w-1/6"></div>
            <div className="space-y-3">
              <div className="h-20 bg-white border border-slate-200 rounded-2xl w-full"></div>
              <div className="h-20 bg-white border border-slate-200 rounded-2xl w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans w-full">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="border-b border-slate-200 pb-6 w-full flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Health Core</h1>
            <p className="text-sm text-slate-500 mt-1">Patient Strategy & Management Panel</p>
          </div>
          
          <Link 
            href="/onboarding" 
            className="inline-flex items-center gap-2 h-11 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-colors shadow-sm self-start md:self-auto"
          >
            <UserPlus className="h-4 w-4" />
            New Patient
          </Link>
        </div>

        {/* Dashboard Grid */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Users className="h-5 w-5 text-slate-700" />
            Active Profiles
          </h2>

          {error ? (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl">
              Falha ao carregar dados do dashboard.
            </div>
          ) : patients.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-slate-200 rounded-2xl bg-white text-slate-400 text-sm">
              No patient profiles found in the database.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {patients.map((patient) => {
                const safeName = patient.name || 'Sem Nome'; 
                
                return (
                  <div 
                    key={patient.id} 
                    className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-between hover:border-slate-300 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                        {safeName.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">{safeName}</h3>
                        <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider mt-1 ${patient.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          {patient.status || 'UNKNOWN'}
                        </span>
                      </div>
                    </div>
                    
                    <Link 
                      href={`/patient/${patient.id}`} 
                      className="h-9 px-4 bg-slate-900 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm hover:bg-slate-800 transition-colors"
                    >
                      View Strategy
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
