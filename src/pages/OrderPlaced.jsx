import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'

function Pipeline({ step = 3 }) {
  const steps = ['Корзина', 'Оформление заказа', 'Заказ принят']
  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex items-center gap-6">
        {steps.map((label, i) => (
          <div key={label} className="flex items-center gap-4">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center ${i+1 <= step ? 'bg-amber-400 text-black font-bold' : 'bg-gray-200 text-gray-600'}`}>{i+1}</div>
            <div className={`text-sm ${i+1 <= step ? 'text-gray-800 font-semibold' : 'text-gray-500'}`}>{label}</div>
            {i < steps.length - 1 && <div className="w-12 h-[2px] bg-gray-200 mx-2" />}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function OrderPlaced({ onNavigate }) {
  return (
    <div className="min-h-screen bg-white">
      <Header onNavigate={onNavigate} />
      <Pipeline step={3} />

      <main className="max-w-5xl mx-auto px-4 py-10">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Заказ принят</h1>
          <p className="text-gray-700 mb-6">Спасибо! Ваш заказ принят и скоро будет обработан.</p>
          <div className="flex justify-center gap-4">
            <button onClick={() => onNavigate?.('home')} className="px-4 py-2 bg-amber-400 rounded font-semibold">Вернуться в магазин</button>
            <button onClick={() => onNavigate?.('contacts')} className="px-4 py-2 border rounded">Контакты</button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
