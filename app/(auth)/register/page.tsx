import Link from 'next/link';
import { AuthForm } from '@/components/auth/AuthForm';

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-600 font-bold text-white text-2xl mb-4 shadow-lg shadow-violet-600/20">
            N
          </div>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-50">
            Create an account
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Get started with NexPost
          </p>
        </div>

        <div className="bg-slate-950/50 backdrop-blur-xl border border-slate-800 py-8 px-4 shadow sm:rounded-xl sm:px-10">
          <AuthForm type="register" />
          
          <div className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-violet-500 hover:text-violet-400">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
