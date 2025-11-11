'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const isDashboard = pathname?.startsWith('/dashboard');

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-bold text-teal-600">
              Flex Living
            </Link>
            
            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/properties"
                className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                  pathname === '/properties'
                    ? 'text-teal-600 bg-teal-50'
                    : 'text-gray-700 hover:text-teal-600 hover:bg-gray-50'
                }`}
              >
                Properties
              </Link>
              {session && (
                <Link
                  href="/dashboard/reviews"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                    isDashboard
                      ? 'text-teal-600 bg-teal-50'
                      : 'text-gray-700 hover:text-teal-600 hover:bg-gray-50'
                  }`}
                >
                  Dashboard
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {session ? (
              <>
                <span className="text-sm text-gray-700">
                  {session.user?.name || session.user?.email}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-teal-600 transition"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

