export const metadata = {
  title: 'عادات ذرية',
  description: 'تطبيق تتبع العادات',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  )
}
