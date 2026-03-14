import React, { useState, useEffect, useCallback } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { promoApi } from '../api/promo'
import { ordersApi } from '../api/orders'

const OPEN_HOUR = 10
const CLOSE_HOUR = 23
const SLOT_STEP_MINUTES = 30
const WINDOW_MINUTES = 4 * 60

const formatMinutes = (totalMinutes) => {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

const generateTimeSlots = (now = new Date()) => {
  const openMinutes = OPEN_HOUR * 60
  const closeMinutes = CLOSE_HOUR * 60
  const currentMinutes = now.getHours() * 60 + now.getMinutes()

  if (currentMinutes < openMinutes || currentMinutes >= closeMinutes) return []

  let roundedStart = Math.ceil(currentMinutes / SLOT_STEP_MINUTES) * SLOT_STEP_MINUTES
  if (roundedStart >= closeMinutes) {
    if (currentMinutes >= closeMinutes) return []
    roundedStart = currentMinutes
  }

  const endWindow = Math.min(roundedStart + WINDOW_MINUTES, closeMinutes)
  if (roundedStart >= endWindow) return []

  const slots = []
  for (let cursor = roundedStart; cursor < endWindow; cursor += SLOT_STEP_MINUTES) {
    const slotEnd = Math.min(cursor + SLOT_STEP_MINUTES, endWindow)
    slots.push(`${formatMinutes(cursor)} - ${formatMinutes(slotEnd)}`)
  }
  return slots
}

function Pipeline({ step = 3 }) {
  const steps = ['Корзина', 'Оформление заказа', 'Заказ принят']
  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      <div className="overflow-x-auto">
        <div className="flex flex-nowrap items-center gap-3 sm:gap-6 min-w-max">
        {steps.map((label, i) => (
          <div key={label} className="flex items-center gap-4">
            <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center ${i + 1 <= step ? 'bg-[#F7D22D] text-black font-bold' : 'bg-gray-200 text-gray-600'}`}>{i + 1}</div>
            <div className={`text-xs sm:text-sm ${i + 1 <= step ? 'text-gray-800 font-semibold' : 'text-gray-500'}`}>{label}</div>
            {i < steps.length - 1 && <div className="w-12 h-[2px] bg-gray-200 mx-2" />}
          </div>
        ))}
        </div>
      </div>
    </div>
  )
}

export default function OrderDelivery({ onNavigate }) {
  const { items, totalSum, clear } = useCart()
  const { user } = useAuth()
  const [pending, setPending] = useState(null)

  const [name, setName] = useState(user?.name || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [deliveryTime, setDeliveryTime] = useState('Побыстрее')
  const [paymentType, setPaymentType] = useState('card')
  const [needChange, setNeedChange] = useState('no-change')
  const [changeFrom, setChangeFrom] = useState('')
  const paymentOptions = [
    { id: 'card', label: 'Картой на сайте', icon: <img src={`${import.meta.env.BASE_URL}images/payment.png`} alt="Оплата картой" className="w-5 h-4" loading="lazy" /> },
    { id: 'cash', label: 'Наличными' },
  ]
  const [notify, setNotify] = useState(true)
  const [note, setNote] = useState('')
  const [showTimeModal, setShowTimeModal] = useState(false)
  const [timeSlots, setTimeSlots] = useState([])
  const [promo, setPromo] = useState('')
  const [applied, setApplied] = useState(null)
  const [discount, setDiscount] = useState(0)
  const [promoLoading, setPromoLoading] = useState(false)
  const [isEditingName, setIsEditingName] = useState(false)
  const [isEditingPhone, setIsEditingPhone] = useState(false)
  const [isEditingAddress, setIsEditingAddress] = useState(false)
  const [editableAddress, setEditableAddress] = useState('')
  const [placing, setPlacing] = useState(false)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('pendingOrder')
      if (raw) setPending(JSON.parse(raw))
    } catch { setPending(null) }
  }, [])

  useEffect(() => {
    if (user) {
      if (user.name && !name) setName(user.name)
      if (user.phone && !phone) setPhone(user.phone)
    }
  }, [user])

  const refreshTimeSlots = useCallback(() => {
    const slots = generateTimeSlots()
    setTimeSlots(slots)
    setDeliveryTime((prev) => {
      if (!slots.length) return 'Заведение закрыто'
      if (prev === 'Побыстрее' || slots.includes(prev)) return prev
      return slots[0]
    })
  }, [])

  useEffect(() => { refreshTimeSlots() }, [refreshTimeSlots])
  useEffect(() => { if (showTimeModal) refreshTimeSlots() }, [showTimeModal, refreshTimeSlots])

  useEffect(() => {
    if (pending?.applied && pending.applied !== 'INVALID') {
      setApplied(pending.applied)
      setDiscount(pending.discount || 0)
    }
    if (pending?.promo) setPromo(pending.promo)
    if (pending) {
      const addressTypeLine = pending?.addressName?.trim()
      const addressDetailsLine = [pending?.addressStreet, pending?.addressHouse, pending?.addressFlat]
        .map((v) => v?.trim()).filter(Boolean).join(', ') || pending?.addressLine
      const addr = pending?.deliveryType === 'pickup'
        ? 'Самовывоз'
        : (addressTypeLine || addressDetailsLine)
          ? `${addressTypeLine || 'Адрес'}\n${addressDetailsLine || 'Адрес не указан'}`
          : 'Адрес не указан'
      setEditableAddress(addr)
    }
  }, [pending])

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

  const finalSum = totalSum - discount

  const addressTypeLine = pending?.addressName?.trim()
  const addressDetailsLine = [pending?.addressStreet, pending?.addressHouse, pending?.addressFlat]
    .map((v) => v?.trim()).filter(Boolean).join(', ') || pending?.addressLine
  const formattedAddress = pending?.deliveryType === 'pickup'
    ? 'Самовывоз'
    : (addressTypeLine || addressDetailsLine)
      ? `${addressTypeLine || 'Адрес'}\n${addressDetailsLine || 'Адрес не указан'}`
      : 'Адрес не указан'

  const placeFinalOrder = async () => {
    if (!name.trim()) { alert('Пожалуйста, укажите имя'); return }
    if (!phone.trim()) { alert('Пожалуйста, укажите номер телефона'); return }

    setPlacing(true)
    try {
      await ordersApi.create({
        items: items.map((it) => ({ productId: it.id, qty: it.qty })),
        deliveryType: pending?.deliveryType || 'delivery',
        address: editableAddress,
        deliveryTime,
        paymentType,
        changeFrom: paymentType === 'cash' && needChange === 'with-change' ? changeFrom : null,
        promoCode: applied && applied !== 'INVALID' ? applied : null,
        note,
        name,
        phone,
      })
    } catch {}

    clear()
    sessionStorage.removeItem('pendingOrder')
    setPlacing(false)
    onNavigate?.('order-placed')
  }

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Montserrat', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial" }}>
      <Header onNavigate={onNavigate} />
      <Pipeline step={3} />

      <main className="max-w-6xl mx-auto px-3 sm:px-4 pb-6 sm:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <section className="lg:col-span-2 bg-white rounded-xl shadow-sm p-4 sm:p-6 md:p-8">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0E0C0D] mb-4 sm:mb-6">
              Заказ на доставку
            </h1>

            <div className="space-y-5">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Имя</label>
                {isEditingName ? (
                <input value={name} onChange={(e) => setName(e.target.value)} onBlur={() => setIsEditingName(false)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#F7D22D]"
                  style={{ background: '#F3F3F7' }} placeholder="Ваше имя" autoFocus />
                ) : (
                  <div className="flex items-center justify-between rounded-md px-4 py-2.5 text-sm" style={{ background: '#F3F3F7' }}>
                    <span className="truncate">{name || 'Ваше имя'}</span>
                    <button type="button" onClick={() => setIsEditingName(true)} className="text-xs font-semibold text-[#F7D22D] ml-3 whitespace-nowrap">Изменить</button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Номер телефона</label>
                {isEditingPhone ? (
                <input value={phone} onChange={(e) => setPhone(e.target.value)} onBlur={() => setIsEditingPhone(false)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#F7D22D]"
                  style={{ background: '#F3F3F7' }} placeholder="+7 999 999-99-99" autoFocus />
                ) : (
                  <div className="flex items-center justify-between rounded-md px-4 py-2.5 text-sm" style={{ background: '#F3F3F7' }}>
                    <span className="truncate">{phone || '+7 999 999-99-99'}</span>
                    <button type="button" onClick={() => setIsEditingPhone(true)} className="text-xs font-semibold text-[#F7D22D] ml-3 whitespace-nowrap">Изменить</button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Адрес доставки</label>
                {isEditingAddress ? (
                <textarea value={editableAddress} onChange={(e) => setEditableAddress(e.target.value)} onBlur={() => setIsEditingAddress(false)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-md text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-[#F7D22D]"
                    style={{ background: '#F3F3F7' }} rows={3} autoFocus />
                ) : (
                  <div className="relative">
                    <div className="flex items-start justify-between rounded-md px-4 py-2.5 text-sm min-h-[80px]" style={{ background: '#F3F3F7' }}>
                      <span className="truncate whitespace-pre-line flex-1">{editableAddress || formattedAddress || 'Адрес не указан'}</span>
                      <button type="button" onClick={() => { if (!pending) { onNavigate?.('checkout') } else { setIsEditingAddress(true) } }}
                        className="text-xs font-semibold text-[#F7D22D] ml-3 whitespace-nowrap">Изменить</button>
                    </div>
                  </div>
                )}
              </div>

              {pending?.deliveryType !== 'pickup' && (
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Время доставки</label>
                  <div className="flex items-center justify-between rounded-md px-4 py-2.5 text-sm" style={{ background: '#F3F3F7' }}>
                    <span className="truncate">{deliveryTime}</span>
                    <button type="button" onClick={() => setShowTimeModal(true)} className="text-xs font-semibold text-[#F7D22D] ml-3 whitespace-nowrap">Изменить</button>
                  </div>
                </div>
              )}

              <div>
                <label className="block font-semibold mb-1.5 sm:mb-2" style={{ color: '#F7D22D', fontSize: '22px' }}>Промокод</label>
                <div className="flex" style={{ maxWidth: '353px', maxHeight: '43px' }}>
                  <input value={promo} onChange={(e) => setPromo(e.target.value)}
                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-l-md text-sm focus:outline-none focus:ring-2 focus:ring-[#F7D22D]"
                    style={{ height: '43px' }} placeholder="Введите промокод" />
                  <button type="button" onClick={applyPromo} disabled={promoLoading}
                    className={`px-5 py-2.5 text-sm font-semibold rounded-r-md ${applied && applied !== 'INVALID' ? 'bg-green-500 text-white' : 'bg-[#F7D22D] text-black hover:opacity-90'}`}
                    style={{ height: '43px' }}>
                    {promoLoading ? '...' : applied && applied !== 'INVALID' ? 'Применён' : 'Применить'}
                  </button>
                </div>
                {applied === 'INVALID' && <div className="mt-2 text-xs text-red-600">Неверный промокод</div>}
                {applied && applied !== 'INVALID' && <div className="mt-2 text-xs text-green-600">Промокод применён: скидка {discount} ₽</div>}
              </div>

              <div className="mt-4">
                <div className="payment-panel rounded-[6px] p-4 sm:p-6" style={{ background: '#F1F2F599' }}>
                  <h2 className="text-[28px] font-semibold text-[#FF2E65] mb-4">Способы оплаты</h2>
                  <div className="space-y-3">
                    {paymentOptions.map((option) => (
                      <label key={option.id} className="flex items-center gap-3 text-sm sm:text-base font-semibold text-[#1D1D1F] cursor-pointer">
                        <span className="w-5 h-5 rounded-full border-2 border-[#FF2E65] flex items-center justify-center">
                          <span className={`w-2 h-2 rounded-full ${paymentType === option.id ? 'bg-[#FF2E65]' : 'bg-transparent'}`} />
                        </span>
                        <input type="radio" name="pay" className="sr-only" checked={paymentType === option.id} onChange={() => setPaymentType(option.id)} />
                        {option.icon}
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>

                  {paymentType === 'cash' && (
                    <div className="mt-6 space-y-3 text-sm font-semibold text-[#505050]">
                      {needChange === 'with-change' && (
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <span>С какой суммы подготовить сдачу?</span>
                          <input value={changeFrom} onChange={(e) => setChangeFrom(e.target.value)}
                            className="px-4 py-2 border border-[#CFCFD4] rounded-lg text-base font-semibold text-[#1F1F1F] w-full sm:w-40 focus:outline-none focus:ring-1 focus:ring-[#FF2E65]"
                            placeholder="1000 ₽" />
                        </div>
                      )}
                      <div className="flex items-center gap-3">
                        <button type="button" onClick={() => setNeedChange((prev) => prev === 'no-change' ? 'with-change' : 'no-change')}
                          className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-lg border text-sm font-semibold whitespace-nowrap transition ${needChange === 'no-change' ? 'border-[#FF2E65] text-[#FF2E65]' : 'border-[#CFCFD4] text-[#555]'}`}>
                          <span className="inline-flex w-4 h-4 border-2 border-current rounded-[4px] items-center justify-center">
                            {needChange === 'no-change' && <span className="w-2 h-2 bg-current rounded-[2px]" />}
                          </span>
                          Без сдачи
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4 mt-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Комментарий к заказу</label>
                  <textarea value={note} onChange={(e) => setNote(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-md text-sm resize-none" rows={3}
                    placeholder="Например: позвоните, когда подъедете" />
                </div>
                <label className="flex items-start gap-2 text-xs text-gray-600 cursor-pointer">
                  <input type="checkbox" checked={notify} onChange={() => setNotify((v) => !v)} className="mt-0.5" />
                  <span>Сообщать о бонусах, акциях и новых продуктах</span>
                </label>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <button type="button" onClick={() => onNavigate?.('checkout')} className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-2">
                  <span className="text-xl">‹</span>
                  <span>Вернуться к корзине</span>
                </button>
                <button type="button" onClick={placeFinalOrder} disabled={items.length === 0 || placing}
                  className="sm:ml-auto px-6 py-3 bg-[#F7D22D] rounded-lg text-sm md:text-base font-semibold shadow hover:brightness-95 disabled:opacity-50 w-full sm:w-auto justify-center">
                  {placing ? 'Оформление...' : `Оформить заказ на ${finalSum.toLocaleString('ru-RU')} ₽`}
                </button>
              </div>
            </div>
          </section>

          <aside className="bg-white rounded-xl shadow-sm p-4 sm:p-6 h-fit">
            <h2 className="text-base sm:text-lg font-bold text-[#F7D22D] mb-4">Состав заказа</h2>
            <div className="space-y-4">
              {items.length === 0 ? (
                <div className="text-sm text-gray-500">Корзина пуста</div>
              ) : (
                <div className="space-y-4">
                  {items.flatMap((it) => {
                    const qty = it.qty || 1
                    return Array.from({ length: qty }, (_, index) => (
                      <div key={`${it.id}-${index}`} className="space-y-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-[#0E0C0D] text-sm sm:text-base">{it.title} за {it.price.toLocaleString('ru-RU')} ₽</div>
                            {it.description && <div className="text-xs sm:text-sm text-gray-500 mt-1">{it.description}</div>}
                          </div>
                          <div className="font-bold text-[#0E0C0D] text-sm sm:text-base whitespace-nowrap">{it.price.toLocaleString('ru-RU')} ₽</div>
                        </div>
                      </div>
                    ))
                  })}
                </div>
              )}

              <div className="pt-4 border-t border-gray-200 space-y-3">
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-[#0E0C0D]">Сумма заказа</span>
                  <span className="font-bold text-[#0E0C0D]">{totalSum.toLocaleString('ru-RU')} ₽</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm sm:text-base">
                    <span className="text-[#0E0C0D]">Скидка</span>
                    <span className="font-bold text-green-600">-{discount.toLocaleString('ru-RU')} ₽</span>
                  </div>
                )}
                <div className="text-center text-sm text-gray-500">Бесплатная доставка</div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
      {showTimeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowTimeModal(false)} />
          <div className="relative bg-[#E7F0FB] rounded-2xl w-full max-w-lg mx-4 p-6 shadow-xl">
            <button className="absolute top-4 right-4 text-2xl text-[#F7D22D] leading-none" onClick={() => setShowTimeModal(false)}>×</button>
            <h2 className="text-xl md:text-2xl font-bold text-[#3F3F3F] mb-5">Время доставки</h2>
            {timeSlots.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <button type="button" onClick={() => { setDeliveryTime('Побыстрее'); setShowTimeModal(false) }}
                className={`text-xs sm:text-sm py-2 px-3 rounded-lg bg-white shadow-sm border transition ${deliveryTime === 'Побыстрее' ? 'border-[#F7D22D] text-[#3F3F3F] font-semibold' : 'border-transparent text-gray-700 hover:border-[#F7D22D]/60'}`}>
                Побыстрее
              </button>
              {timeSlots.map((slot) => (
                <button key={slot} type="button" onClick={() => { setDeliveryTime(slot); setShowTimeModal(false) }}
                  className={`text-xs sm:text-sm py-2 px-3 rounded-lg bg-white shadow-sm border transition ${deliveryTime === slot ? 'border-[#F7D22D] text-[#3F3F3F] font-semibold' : 'border-transparent text-gray-700 hover:border-[#F7D22D]/60'}`}>
                  {slot}
                </button>
              ))}
            </div>
            ) : (
              <div className="text-sm text-gray-600 bg-white rounded-lg p-4">
                Сегодня мы принимаем заказы с 10:00 до 23:00. Попробуйте позже.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
