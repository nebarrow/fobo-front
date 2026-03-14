import { useState } from 'react'
import Header from './components/Header'
import HeroSlider from './components/HeroSlider'
import NewItems from './components/NewItems'
import Promotions from './components/Promotions'
import Footer from './components/Footer'
import { getImagePath } from './utils/paths'
import CatalogPage from './pages/CatalogPage'
import ContactsPage from './pages/ContactsPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderPlaced from './pages/OrderPlaced'
import OrderDelivery from './pages/OrderDelivery'
import ProfilePage from './pages/ProfilePage'
import PromotionsPage from './pages/PromotionsPage'
import OrdersHistoryPage from './pages/OrdersHistoryPage'

const CATALOG_CATEGORIES = ['pizza', 'pasta', 'soup', 'salad', 'drink', 'desert']

export default function App() {
  const [view, setView] = useState('home')

  if (CATALOG_CATEGORIES.includes(view)) return <CatalogPage category={view} onNavigate={setView} />
  if (view === 'checkout') return <CheckoutPage onNavigate={setView} />
  if (view === 'order') return <OrderDelivery onNavigate={setView} />
  if (view === 'order-placed') return <OrderPlaced onNavigate={setView} />
  if (view === 'contacts') return <ContactsPage onNavigate={setView} />
  if (view === 'profile') return <ProfilePage onNavigate={setView} />
  if (view === 'promotions') return <PromotionsPage onNavigate={setView} />
  if (view === 'orders') return <OrdersHistoryPage onNavigate={setView} />

  return (
    <div className="min-h-screen bg-white">
      <Header onNavigate={setView} />

      <div className="bg-white py-8 promotions-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <HeroSlider />
          <NewItems />
          <Promotions onNavigate={setView} />
        </div>
        <img src={getImagePath("/images/viglyadivaushaya_woman.png")} alt="Девушка" className="promo-girl" loading="lazy" />
      </div>
      <Footer />
    </div>
  )
}
