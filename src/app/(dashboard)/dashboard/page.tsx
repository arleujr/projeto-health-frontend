'use client';

import React from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { api } from '@/lib/pi-client';
import { Users, ArrowRight, UserPlus } from 'lucide-react';
import { ProfessionalWidgets } from './components/ProfessionalWidgets'; // Ajuste o caminho se necessário

interface PatientListItem {
  id: string;
  name: string;
  status: 'ACTIVE' | 'INACTIVE';
}

const fetcher = (url: string) => api.get(url).then(res => res.data);

export default function DashboardPage() {
  const { data, error, isLoading } = useSWR('/v1/plans/dashboard', fetcher);

  const patients: PatientListItem[] = data && Array.isArray(data.patients) ? data.patients : [];
  
  // 🟢 NO FUTURO: Pegue isso do seu AuthContext ou da resposta do SWR (ex: data.user.role)
  const userRole = data?.user?.role || 'PROFISSIONAL'; 
  const userName = data?.user?.name || 'Profissional';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 md:p-10 flex justify-center w-full">
        <div className="max-w-5xl w-full space-y-8 animate-pulse">
          <div className="h-32 bg-slate-200 rounded-2xl w-full"></div>
          <div className="h-20 bg-slate-200 rounded-xl w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans w-full">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* ===================================================================== */}
        {/* 1. ROLE-BASED RENDERING (O Painel Inteligente)                        */}
        {/* ===================================================================== */}
        {userRole === 'PROFISSIONAL' && (
          <ProfessionalWidgets 
            userName={userName}
            professionalType="Especialista"
            patients={patients} // Passando a lista real para o widget contar
            stats={data?.stats} // Passando os status extras do backend (se existirem)
          />
        )}

        {/* Header da Lista de Pacientes */}
        <div className="border-b border-slate-200 pb-4 pt-6 w-full flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="h-6 w-6 text-indigo-600" />
            Meus Pacientes
          </h2>
          <Link 
            href="/onboarding" 
            className="inline-flex items-center gap-2 h-10 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-colors shadow-sm"
          >
            <UserPlus className="h-4 w-4" />
            Novo Paciente
          </Link>
        </div>

        {/* ===================================================================== */}
        {/* 2. LISTA REAL DE PACIENTES (O que você já tinha)                      */}
        {/* ===================================================================== */}
        <div>
          {error ? (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl">
              Falha ao carregar dados do dashboard.
            </div>
          ) : patients.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-slate-200 rounded-2xl bg-white text-slate-400 text-sm">
              Nenhum paciente encontrado.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {patients.map((patient) => {
                const safeName = patient.name || 'Sem Nome'; 
                return (
                  <div key={patient.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-between hover:border-indigo-300 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
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
                      className="h-9 px-4 bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors"
                    >
                      Acessar War Room
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