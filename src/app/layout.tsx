import './globals.css'
import { Inter } from 'next/font/google'
import axios from "axios";

const inter = Inter({ subsets: ['latin'] })

axios.defaults.withCredentials = true

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>Web Manajemen User & Pegawai</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css" />
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.bundle.min.js"></script>
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
