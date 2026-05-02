'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Home, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0f] px-6 text-center overflow-hidden relative">
      {/* Background Animated Blobs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute -top-24 -left-24 w-96 h-96 bg-violet-600/30 rounded-full blur-[120px] pointer-events-none"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          rotate: [0, -90, 0],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-24 -right-24 w-96 h-96 bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none"
      />

      <div className="relative mb-8 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <motion.h1 
            animate={{ 
              textShadow: [
                "0 0 0px rgba(124, 58, 237, 0)",
                "0 0 20px rgba(124, 58, 237, 0.3)",
                "0 0 0px rgba(124, 58, 237, 0)"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-[12rem] md:text-[18rem] font-black leading-none text-slate-900/40 select-none tracking-tighter"
          >
            404
          </motion.h1>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-600 font-bold text-white text-3xl shadow-[0_0_50px_-12px_rgba(124,58,237,0.8)] border border-white/20">
                N
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="z-10"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-slate-50 mb-4 tracking-tight">
          Lost in the void?
        </h2>
        <p className="text-slate-400 max-w-md mb-12 text-lg leading-relaxed">
          We couldn&apos;t find the page you were looking for. It might have drifted away into deep space.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/">
              <Button variant="default" className="rounded-full px-10 h-12 text-base font-medium shadow-lg shadow-violet-600/20">
                <Home className="mr-2 h-4 w-4" />
                Back Home
              </Button>
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/blog">
              <Button variant="outline" className="rounded-full px-10 h-12 text-base font-medium border-slate-800 hover:bg-slate-900">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Explore Feed
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Floating Particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-violet-500/40 rounded-full"
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: Math.random() * 5 + 5,
            repeat: Infinity,
            delay: Math.random() * 5
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`
          }}
        />
      ))}
    </div>
  );
}

