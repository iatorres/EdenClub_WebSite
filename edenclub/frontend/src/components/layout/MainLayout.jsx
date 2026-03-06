import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

export default function MainLayout() {
  return (
    <div className="noise min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-[68px]">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}