'use client';

import React, { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-800 p-4">
      <div className="max-w-md text-center space-y-4">
        <h2 className="text-xl font-bold text-rose-600">خطایی رخ داد</h2>
        <p className="text-sm text-slate-500">
          در اجرای سامانه خطایی رخ داده است.
        </p>
        <button
          onClick={() => reset()}
          className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
        >
          تلاش مجدد
        </button>
      </div>
    </div>
  );
}
