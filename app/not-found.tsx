import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-800 p-4">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-4xl font-bold text-indigo-600">۴۰۴</h1>
        <h2 className="text-xl font-bold">صفحه مورد نظر یافت نشد</h2>
        <p className="text-sm text-slate-500">
          مسیر درخواستی در سامانه هزار دستان وجود ندارد یا تغییر یافته است.
        </p>
        <Link
          href="/"
          className="inline-block rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
        >
          بازگشت به داشبورد
        </Link>
      </div>
    </div>
  );
}
