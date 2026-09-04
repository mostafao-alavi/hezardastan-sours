import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'هزار دستان — پلتفرم جمع‌آوری و مدیریت محتوای وب',
  description: 'پلتفرم جمع‌آوری و ذخیره‌سازی محتوای کامل اخبار و مقالات وب در Cloudflare D1',
  openGraph: {
    title: 'هزار دستان — پلتفرم جمع‌آوری و مدیریت محتوای وب',
    description: 'پلتفرم جمع‌آوری و ذخیره‌سازی محتوای کامل اخبار و مقالات وب در Cloudflare D1',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'هزار دستان — پلتفرم جمع‌آوری و مدیریت محتوای وب',
    description: 'پلتفرم جمع‌آوری و ذخیره‌سازی محتوای کامل اخبار و مقالات وب در Cloudflare D1',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="fa" dir="rtl">
      <body suppressHydrationWarning className="bg-slate-50 text-slate-900 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
