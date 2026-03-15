import React, { useState, useMemo } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useCart } from '../contexts/CartContext'
import { bffApi } from '../api/bff'
import { promoApi } from '../api/promo'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'

function Pipeline({ step = 2 }) {
  const steps = ['Корзина', 'Оформление заказа', 'Заказ принят']
  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      <div className="sm:px-6 overflow-x-auto">
        <div className="flex flex-nowrap items-center gap-3 sm:gap-6 min-w-max">
          {steps.map((label, i) => (
            <div key={label} className="flex items-center gap-4">
              <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center ${i+1 <= step ? 'bg-[#F7D22D] text-black font-bold' : 'bg-gray-200 text-gray-600'}`}>{i+1}</div>
              <div className={`text-xs sm:text-sm ${i+1 <= step ? 'text-gray-800 font-semibold' : 'text-gray-500'}`}>{label}</div>
              {i < steps.length - 1 && <div className="w-12 h-[2px] bg-gray-200 mx-2" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage({ onNavigate }) {
  const { items, increment, decrement, removeItem, clear, addItem, totalSum } = useCart()
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [deliveryType, setDeliveryType] = useState('delivery')
  const [addressStreet, setAddressStreet] = useState('')
  const [addressHouse, setAddressHouse] = useState('')
  const [addressFlat, setAddressFlat] = useState('')
  const [addressName, setAddressName] = useState('')
  const [addressComment, setAddressComment] = useState('')
  const [promo, setPromo] = useState('')
  const [applied, setApplied] = useState(null)
  const [discount, setDiscount] = useState(0)
  const [promoLoading, setPromoLoading] = useState(false)
  const [suggSwiper, setSuggSwiper] = useState(null)
  const [suggestions, setSuggestions] = useState([])

  const prevSugg = () => suggSwiper?.slidePrev()
  const nextSugg = () => suggSwiper?.slideNext()

  useMemo(() => {
    bffApi.getHome()
      .then((data) => setSuggestions(data.suggestions || []))
      .catch(() => setSuggestions([]))
  }, [])

  const finalSum = totalSum - discount

  const applyPromo = async () => {
    if (!promo.trim()) return
    setPromoLoading(true)
    try {
      const data = await promoApi.validate(promo.trim())
      if (data.valid) {
        setApplied(promo.trim().toUpperCase())
        setDiscount(data.discount || Math.round(totalSum * (data.percent || 10) / 100))
      } else {
        setApplied('INVALID')
        setDiscount(0)
      }
    } catch {
      setApplied('INVALID')
      setDiscount(0)
    } finally {
      setPromoLoading(false)
    }
  }

  const placeOrder = () => {
    setShowAddressModal(true)
  }

  const confirmAddressAndPlace = () => {
    if (deliveryType === 'delivery' && (!addressStreet.trim() || !addressHouse.trim())) {
      alert('Пожалуйста, укажите улицу и дом для доставки')
      return
    }
    const combinedAddressLine = [addressStreet, addressHouse, addressFlat]
      .map((v) => v?.trim())
      .filter(Boolean)
      .join(', ')

    try {
      const pending = {
        deliveryType,
        addressName,
        addressComment,
        promo: applied && applied !== 'INVALID' ? applied : '',
        applied,
        discount,
        addressLine: combinedAddressLine,
        addressStreet,
        addressHouse,
        addressFlat,
      }
      sessionStorage.setItem('pendingOrder', JSON.stringify(pending))
    } catch (e) {}
    setShowAddressModal(false)
    onNavigate?.('order')
  }

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Montserrat', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial" }}>
      <Header onNavigate={onNavigate} />
      <Pipeline step={2} />

      <main className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="lg:col-span-3 bg-white lg:bg-transparent rounded-xl lg:rounded-none p-3 sm:p-4 lg:p-6 shadow-sm lg:shadow-none">
            <h2 className="text-[#F7D22D] text-lg sm:text-xl font-bold mb-4">Ваш заказ</h2>

            {items.length === 0 ? (
              <div className="text-gray-600">Ваша корзина пуста</div>
            ) : (
              <div className="space-y-0 divide-y divide-gray-200">
                {items.map(item => (
                  <div key={item.id} className="py-3 sm:py-4 border-b border-gray-200">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="flex-none">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden flex items-center justify-center">
                          <img src={item.img || item.image} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 text-sm sm:text-base leading-tight">{item.title}</div>
                        <div className="hidden sm:block text-xs sm:text-sm text-gray-500 mt-1 leading-tight">
                          {item.description || ''}
                        </div>
                      </div>

                      <div className="flex-none sm:w-20 text-right">
                        <div className="text-base sm:text-lg font-bold text-amber-400">{item.price} ₽</div>
                      </div>

                      <div className="hidden sm:flex flex-none">
                        <div className="flex items-center bg-white border border-gray-200 rounded-full px-2 py-1 gap-2">
                          <button className="w-7 h-7 flex items-center justify-center text-gray-600 rounded-full" onClick={() => decrement(item.id)}>-</button>
                          <div className="px-2 sm:px-3 text-center text-sm">{item.qty}</div>
                          <button className="w-7 h-7 flex items-center justify-center text-gray-600 rounded-full" onClick={() => increment(item.id)}>+</button>
                        </div>
                      </div>

                      <button onClick={() => removeItem(item.id)} className="hidden sm:flex ml-2 sm:ml-3 w-8 h-8 items-center justify-center border border-gray-200 rounded-full text-gray-400 hover:border-amber-400 hover:text-amber-400">
                        ×
                      </button>
                    </div>

                    <div className="flex sm:hidden items-center justify-between mt-3 pl-[68px]">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center bg-white border border-gray-200 rounded-full px-1.5 py-0.5 gap-1.5">
                          <button className="w-6 h-6 flex items-center justify-center text-gray-600 rounded-full text-sm" onClick={() => decrement(item.id)}>-</button>
                          <div className="px-2 text-center text-xs">{item.qty}</div>
                          <button className="w-6 h-6 flex items-center justify-center text-gray-600 rounded-full text-sm" onClick={() => increment(item.id)}>+</button>
                        </div>
                        <button onClick={() => removeItem(item.id)} className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-full text-gray-400 hover:border-amber-400 hover:text-amber-400 text-sm">
                          ×
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {items.length > 0 && suggestions.length > 0 && (
                  <div className="hidden sm:block mt-6 border-t pt-6">
                    <h3 className="text-[#F7D22D] text-base sm:text-lg font-semibold mb-4">Добавить к заказу?</h3>

                    <div className="relative w-full">
                      <button
                        className="hidden lg:block absolute top-1/2 -translate-y-1/2 left-0 -translate-x-full z-20"
                        onClick={prevSugg}
                        aria-label="prev"
                      >
                        <img src={`${import.meta.env.BASE_URL}images/prev.svg`} alt="prev" />
                      </button>

                      <button
                        className="hidden lg:block absolute top-1/2 -translate-y-1/2 right-0 translate-x-full z-20"
                        onClick={nextSugg}
                        aria-label="next"
                      >
                        <img src={`${import.meta.env.BASE_URL}images/next.svg`} alt="next" />
                      </button>

                      <Swiper
                        modules={[Autoplay]}
                        loop
                        autoplay={{ delay: 4500, disableOnInteraction: false }}
                        speed={450}
                        slidesPerView={1.2}
                        spaceBetween={12}
                        onInit={setSuggSwiper}
                        breakpoints={{
                          320: { slidesPerView: 1.1, spaceBetween: 10 },
                          640: { slidesPerView: 1.5, spaceBetween: 12 },
                          768: { slidesPerView: 1.8, spaceBetween: 12 },
                          1024: { slidesPerView: 2.2, spaceBetween: 14 },
                          1280: { slidesPerView: 3, spaceBetween: 16 }
                        }}
                      >
                        {suggestions.map(s => (
                          <SwiperSlide key={s.id} className="select-none">
                            <div
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); addItem(s) } }}
                              onClick={() => addItem(s)}
                              className="flex items-center gap-3 sm:gap-4 p-3 bg-white rounded shadow-sm cursor-pointer h-[99px]"
                              style={{ border: '1.5px solid rgba(229,231,235,1)' }}
                            >
                              <div className="flex-none w-[70px] h-[70px] bg-white rounded overflow-hidden flex items-center justify-center">
                                <img src={s.img || s.image} alt={s.title} className="max-w-[70px] max-h-[70px] object-contain" />
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-gray-900 leading-tight truncate">{s.title}</div>
                                <div className="text-xs text-pink-600 mt-1">{s.price} ₽</div>
                              </div>
                            </div>
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </div>
                  </div>
                )}
              </div>
            )}

          </section>

        </div>
      </main>

      <div className="max-w-5xl mx-auto px-3 sm:px-4 pb-4 sm:pb-6">
        <div className="flex flex-col min-[810px]:flex-row items-stretch min-[810px]:items-center justify-between gap-6">
          <div className="w-full min-[810px]:w-1/2 min-[810px]:pl-4 lg:pl-6">
              <div className="bg-transparent shadow-none">
                <h3 className="text-pink-600 font-semibold mb-2">Промокод</h3>
              <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2 xs:gap-0 max-w-md">
                <input
                  value={promo}
                  onChange={(e) => setPromo(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-md xs:rounded-l-md xs:rounded-r-none text-sm"
                  placeholder="Введите промокод"
                />
                <button
                  onClick={applyPromo}
                  disabled={promoLoading}
                  className="px-4 py-2 bg-[#F7D22D] rounded-md xs:rounded-r-md xs:rounded-l-none text-sm font-semibold disabled:opacity-50"
                >
                  {promoLoading ? '...' : 'Применить'}
                </button>
              </div>
            </div>
            {applied === 'INVALID' && <div className="text-sm text-red-600 mt-2">Неверный промокод</div>}
            {applied && applied !== 'INVALID' && <div className="text-sm text-green-600 mt-2">Промокод применён: скидка {discount} ₽</div>}

            <div className="mt-9">
              <button onClick={() => onNavigate?.('home')} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800">
                <span className="text-xl">‹</span>
                <span>Вернуться в магазин</span>
              </button>
            </div>
          </div>

          <div className="w-full min-[810px]:w-1/2 flex justify-start items-center min-[810px]:mt-0 lg:mt-7">
            <div className="w-full max-w-sm flex flex-col items-end">
              <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 w-full">
                <div
                  className="font-bold text-base sm:text-lg"
                  style={{
                    color: '#0E0C0D',
                    maxWidth: '190px',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                  }}
                >
                  Сумма заказа:
                </div>
                <div
                  className="font-extrabold text-amber-400 text-xl sm:text-2xl"
                  style={{
                    maxWidth: '139px',
                    display: 'inline-block',
                  }}
                >
                  {finalSum} ₽
                </div>
              </div>
              {discount > 0 && <div className="mt-1 text-sm text-gray-600">Скидка: -{discount} ₽</div>}

              <div className="mt-4">
                <button disabled={items.length === 0} onClick={placeOrder} className="w-full sm:w-auto justify-center px-6 sm:px-8 py-3 bg-[#F7D22D] rounded-[8px] text-black font-semibold shadow hover:opacity-95 disabled:opacity-50 flex items-center gap-3 text-sm sm:text-base">
                  <span>Оформить заказ</span>
                  <span className="text-sm">›</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowAddressModal(false)} />

          <div className="relative bg-white rounded-lg w-full max-w-xl mx-4 p-6 shadow-lg">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600" onClick={() => setShowAddressModal(false)}>✕</button>
            <h3 className="text-2xl font-bold text-[#F7D22D] mb-4">Куда доставить?</h3>

            <div className="flex gap-3 mb-4">
              <button
                className={`px-4 py-2 rounded ${deliveryType === 'delivery' ? 'bg-[#F7D22D] text-black' : 'bg-white border border-gray-200 text-gray-600'}`}
                onClick={() => setDeliveryType('delivery')}
              >Доставка</button>
              <button
                className={`px-4 py-2 rounded ${deliveryType === 'pickup' ? 'bg-[#F7D22D] text-black' : 'bg-white border border-gray-200 text-gray-600'}`}
                onClick={() => setDeliveryType('pickup')}
              >Самовывоз</button>
            </div>

            {deliveryType === 'delivery' ? (
              <div className="space-y-3">
                <input
                  value={addressStreet}
                  onChange={(e) => setAddressStreet(e.target.value)}
                  placeholder="Улица"
                  className="w-full px-3 py-2 border rounded text-sm"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    value={addressHouse}
                    onChange={(e) => setAddressHouse(e.target.value)}
                    placeholder="Дом"
                    className="px-3 py-2 border rounded text-sm"
                  />
                  <input
                    value={addressFlat}
                    onChange={(e) => setAddressFlat(e.target.value)}
                    placeholder="Квартира"
                    className="px-3 py-2 border rounded text-sm"
                  />
                </div>
                <input value={addressName} onChange={(e) => setAddressName(e.target.value)} placeholder="Название адреса (например, Дом или Работа)" className="w-full px-3 py-2 border rounded text-sm" />
                <textarea value={addressComment} onChange={(e) => setAddressComment(e.target.value)} placeholder="Комментарий к адресу" className="w-full px-3 py-2 border rounded text-sm h-24" />
              </div>
            ) : null}

            <div className="mt-6 flex items-center justify-between">
              {deliveryType === 'delivery' ? (
                <>
                  <button onClick={() => setShowAddressModal(false)} className="px-4 py-2 text-sm text-gray-600">Отмена</button>
                  <button onClick={confirmAddressAndPlace} className="px-4 py-2 bg-[#F7D22D] rounded text-sm font-semibold">Подтвердить адрес</button>
                </>
              ) : (
                <button onClick={confirmAddressAndPlace} className="w-full px-4 py-2 bg-[#F7D22D] rounded text-sm font-semibold">Подтвердить</button>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
