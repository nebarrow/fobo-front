import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function ContactsPage({ onNavigate }) {
  const mapSrc = 'https://www.google.com/maps?q=%D0%9F%D1%80%D0%BE%D1%81%D0%BF%D0%B5%D0%BA%D1%82+%D0%92%D0%B5%D1%80%D0%BD%D0%B0%D0%B4%D1%81%D0%BA%D0%BE%D0%B3%D0%BE+86%D0%91,+%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D0%B0&z=17&output=embed'

  return (
    <div className="min-h-screen bg-white">
      <Header onNavigate={onNavigate} />

      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Контакты</h1>
          <p className="text-gray-600 mt-2">Здесь вы можете найти нашу локацию, номера телефонов и режим работы.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Где мы находимся</h2>
            <div className="w-full rounded overflow-hidden shadow-sm" style={{ minHeight: 240 }}>
              <iframe
                title="map"
                src={mapSrc}
                width="100%"
                height="100%"
                className="block min-h-[240px]"
                style={{ border: 0 }}
                loading="lazy"
              />
            </div>
            <div className="mt-4 text-sm text-gray-700">
              <div className="font-semibold">Адрес</div>
              <div>Москва, проспект Вернадского, 86Б</div>
              <div className="mt-3 font-semibold">Режим работы</div>
              <div>Ежедневно: 10:00 — 23:00</div>
            </div>
          </section>

          <aside className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Связаться с нами</h2>
            <div className="text-gray-700">
              <div className="mb-3">
                <div className="text-sm font-semibold">Телефоны</div>
                <div className="mt-1">
                  <a href="tel:+74993918449" className="text-lg font-bold text-gray-900">8 499 391-84-49</a>
                </div>
                <div className="mt-1">
                  <a href="tel:+74950000000" className="text-sm text-gray-700">8 495 000-00-00 (доп. линия)</a>
                </div>
              </div>

              <div className="mb-3">
                <div className="text-sm font-semibold">E-mail</div>
                <div className="mt-1"><a href="mailto:fibo-pizza@yandex.ru" className="text-sm text-gray-700">fibo-pizza@yandex.ru</a></div>
              </div>

              <div className="mb-3">
                <div className="text-sm font-semibold">Социальные сети</div>
                <div className="mt-1 text-sm text-gray-700"><a href="https://vk.com/fibopizza" target="_blank" rel="noreferrer">vk.com/fibopizza</a></div>
              </div>

              <div className="mt-4">
                <button onClick={() => onNavigate?.('home')} className="px-4 py-2 bg-amber-400 hover:bg-amber-300 rounded-full font-semibold">Вернуться на главную</button>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  )
}
