import React from 'react';
import { motion } from 'motion/react';
import { Bell } from 'lucide-react';
import { SignInButton, SignUpButton } from '@clerk/react';

export default function LoginPage() {

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-12"
      >
        <div className="text-center mb-10">
          <div className="inline-flex bg-blue-100 p-4 rounded-2xl mb-4 text-blue-600">
            <Bell className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Deadline Collision Detector</h1>
          <p className="text-slate-500 mt-2">Sign in to manage your academic workload</p>
        </div>

        <div className="space-y-4">
          <SignInButton mode="modal">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-200">
              Sign In
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="w-full bg-white hover:bg-slate-50 text-blue-600 border-2 border-blue-100 font-bold py-4 rounded-xl transition-all">
              Create an Account
            </button>
          </SignUpButton>
        </div>
      </motion.div>
    </div>
  );
}
