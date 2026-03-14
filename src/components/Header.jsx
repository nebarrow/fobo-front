import React from 'react'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import CartPanel from './CartPanel'
import LoginModal from './LoginModal'
import { useState } from 'react'
import { getImagePath } from '../utils/paths'

const categories = [
  'Главная','Пицца','Паста','Супы','Салаты','Напитки','Десерты','Акции','Контакты'
]

export default function Header({ onNavigate }) {
  const { totalCount } = useCart()
  const { user } = useAuth()

  const [cartOpen, setCartOpen] = useState(false)
  const [loginModalOpen, setLoginModalOpen] = useState(false)

  return (
    <header className="site-header bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-10 min-w-0">
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigate?.('home') }} className="flex items-center shrink-0">
              <img src={getImagePath("/images/logo.png")} alt="logo" className="logo h-12 w-auto" />
            </a>
              <div className="hidden md:flex flex-col text-sm">
              <div className="flex items-center gap-2 text-[14px] font-medium text-gray-700">
                <span>Доставка пасты <span className="accent font-semibold">Москва</span></span>
              </div>
              <div className="flex items-center gap-3 text-[13px] text-gray-700 mt-1 font-semibold">
                <span className="flex items-center gap-1"><img src={getImagePath("/images/yandexeat.png")} alt="Яндекс Еда" className="h-4" /><span className="text-gray-700">Яндекс еда</span></span>
                <span className="h-1 w-1 rounded-full bg-gray-400 inline-block" />
                <span className="text-gray-700 flex items-center gap-1"><span className="font-semibold">4.8</span><span className="accent">★</span></span>
                <span className="h-1 w-1 rounded-full bg-gray-400 inline-block" />
                <span className="text-gray-700">Время доставки <span className="text-gray-500">от 31 мин</span></span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <button className="hidden md:inline-flex px-6 py-2 rounded-full bg-white border border-gray-200 hover:bg-gray-50 text-sm font-medium text-gray-700 transition">Заказать звонок</button>
            <a href="tel:+74993918449" className="text-lg sm:text-xl font-bold accent tracking-tight">8 499 391-84-49</a>
          </div>
        </div>
        <div className="flex items-center justify-between pb-3">
          <nav className="hidden xl:flex items-center gap-10 text-[15px] font-medium text-gray-700">
            {categories.map(item => (
              item === 'Пицца' ? (
                <a
                  key={item}
                  href="#pizza"
                  onClick={(e) => { e.preventDefault(); onNavigate?.('pizza') }}
                  className="hover:text-amber-600 transition"
                >{item}</a>
              ) : item === 'Паста' ? (
                <a
                  key={item}
                  href="#pasta"
                  onClick={(e) => { e.preventDefault(); onNavigate?.('pasta') }}
                  className="hover:text-amber-600 transition"
                >{item}</a>
              ) : item === 'Десерты' ? (
                <a
                  key={item}
                  href="#desert"
                  onClick={(e) => { e.preventDefault(); onNavigate?.('desert') }}
                  className="hover:text-amber-600 transition"
                >{item}</a>
              ) : item === 'Напитки' ? (
                <a
                  key={item}
                  href="#drink"
                  onClick={(e) => { e.preventDefault(); onNavigate?.('drink') }}
                  className="hover:text-amber-600 transition"
                >{item}</a>
              ) : item === 'Контакты' ? (
                <a
                  key={item}
                  href="#contacts"
                  onClick={(e) => { e.preventDefault(); onNavigate?.('contacts') }}
                  className="hover:text-amber-600 transition"
                >{item}</a>
              ) : item === 'Салаты' ? (
                <a
                  key={item}
                  href="#salad"
                  onClick={(e) => { e.preventDefault(); onNavigate?.('salad') }}
                  className="hover:text-amber-600 transition"
                >{item}</a>
              ) : item === 'Главная' ? (
                <a
                  key={item}
                  href="#home"
                  onClick={(e) => { e.preventDefault(); onNavigate?.('home') }}
                  className="hover:text-amber-600 transition"
                >{item}</a>
              ) : item === 'Супы' ? (
                <a
                  key={item}
                  href="#soup"
                  onClick={(e) => { e.preventDefault(); onNavigate?.('soup') }}
                  className="hover:text-amber-600 transition"
                >{item}</a>
              ) : item === 'Акции' ? (
                <a
                  key={item}
                  href="#promotions"
                  onClick={(e) => { e.preventDefault(); onNavigate?.('promotions') }}
                  className="hover:text-amber-600 transition"
                >{item}</a>
              ) : (
                <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-amber-600 transition">{item}</a>
              )
            ))}
          </nav>
          <div className="flex items-center gap-6 ml-8">
            {user ? (
              <button
                onClick={() => onNavigate?.('profile')}
                className="text-sm font-medium text-gray-600 hover:text-amber-600"
              >
                {user.name}
              </button>
            ) : (
              <button
                onClick={() => setLoginModalOpen(true)}
                className="text-sm font-medium text-gray-600 hover:text-amber-600"
              >
                Войти
              </button>
            )}
            <button
              onClick={() => { console.log('Header: cart button clicked'); setCartOpen(true) }}
              aria-expanded={cartOpen}
              className="cart-inline relative inline-flex items-center gap-2 px-5 py-2 rounded-md text-sm font-semibold transition whitespace-nowrap accent-bg"
            >
              <span className="cart-label">Корзина</span>
              <span className="cart-sep">|</span>
              <span className="cart-count">{totalCount}</span>
            </button>
            <CartPanel
              open={cartOpen}
              onClose={() => setCartOpen(false)}
              onCheckout={() => { setCartOpen(false); onNavigate?.('checkout') }}
            />
            <LoginModal
              isOpen={loginModalOpen}
              onClose={() => setLoginModalOpen(false)}
            />
          </div>
        </div>
          <div className="xl:hidden -mx-4 px-4 pb-3 overflow-x-auto">
          <div className="flex gap-5 text-sm font-medium whitespace-nowrap">
            {categories.map(item => (
              item === 'Пицца' ? (
                <a key={item} href="#pizza" onClick={(e) => { e.preventDefault(); onNavigate?.('pizza') }} className="py-1 hover:text-amber-600 flex-shrink-0">{item}</a>
              ) : item === 'Паста' ? (
                <a key={item} href="#pasta" onClick={(e) => { e.preventDefault(); onNavigate?.('pasta') }} className="py-1 hover:text-amber-600 flex-shrink-0">{item}</a>
              ) : item === 'Десерты' ? (
                <a key={item} href="#desert" onClick={(e) => { e.preventDefault(); onNavigate?.('desert') }} className="py-1 hover:text-amber-600 flex-shrink-0">{item}</a>
              ) : item === 'Напитки' ? (
                <a key={item} href="#drink" onClick={(e) => { e.preventDefault(); onNavigate?.('drink') }} className="py-1 hover:text-amber-600 flex-shrink-0">{item}</a>
              ) : item === 'Контакты' ? (
                <a key={item} href="#contacts" onClick={(e) => { e.preventDefault(); onNavigate?.('contacts') }} className="py-1 hover:text-amber-600 flex-shrink-0">{item}</a>
              ) : item === 'Салаты' ? (
                <a key={item} href="#salad" onClick={(e) => { e.preventDefault(); onNavigate?.('salad') }} className="py-1 hover:text-amber-600 flex-shrink-0">{item}</a>
              ) : item === 'Главная' ? (
                <a key={item} href="#home" onClick={(e) => { e.preventDefault(); onNavigate?.('home') }} className="py-1 hover:text-amber-600 flex-shrink-0">{item}</a>
              ) : item === 'Супы' ? (
                <a key={item} href="#soup" onClick={(e) => { e.preventDefault(); onNavigate?.('soup') }} className="py-1 hover:text-amber-600 flex-shrink-0">{item}</a>
              ) : item === 'Акции' ? (
                <a key={item} href="#promotions" onClick={(e) => { e.preventDefault(); onNavigate?.('promotions') }} className="py-1 hover:text-amber-600 flex-shrink-0">{item}</a>
              ) : (
                <a key={item} href={`#${item.toLowerCase()}`} className="py-1 hover:text-amber-600 flex-shrink-0">{item}</a>
              )
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}
