import { useEffect, useState } from 'react'
import { useCart } from '../contexts/CartContext'
import { bffApi } from '../api/bff'
import { getImagePath } from '../utils/paths'

export default function CartPanel({ open, onClose, onCheckout }) {
  const { items, increment, decrement, removeItem, clear, totalSum, addItem } = useCart()
  const [suggestions, setSuggestions] = useState([])

  useEffect(() => {
    if (open) {
      bffApi.getHome()
        .then((data) => setSuggestions((data.suggestions || []).slice(0, 2)))
        .catch(() => setSuggestions([]))
    }
  }, [open])

  return (
    <div className={`fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`}>
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden={!open}
      />

      <aside
        className={`cart-drawer absolute right-0 top-0 h-full w-full sm:w-[460px] md:w-[520px] lg:w-[560px] bg-white shadow-lg p-6 overflow-auto transform transition-transform duration-300 ease-in-out ${open ? 'translate-x-0 pointer-events-auto' : 'translate-x-full pointer-events-none'}`}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Корзина</h3>
          <div className="flex items-center gap-2">
            <button className="text-sm text-red-600" onClick={clear}>Очистить</button>
            <button className="text-sm font-semibold" onClick={onClose}>Закрыть</button>
          </div>
        </div>

        {suggestions.length > 0 && (
          <div className="mb-4">
            <div className="text-sm text-gray-600 mb-2">Добавить к заказу?</div>
            <div className="flex flex-col sm:flex-row gap-3">
              {suggestions.map(s => (
                <div key={s.id} className="bg-white rounded p-2 flex items-center gap-3 w-full sm:w-1/2 border border-gray-200">
                  <div className="flex-none">
                    <img src={getImagePath(s.img || s.image)} alt={s.title} className="w-12 h-12 object-cover" style={{ border: 'none', display: 'block' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate">{s.title}</div>
                    <div className="text-xs text-gray-600">{s.price} ₽</div>
                  </div>
                  <div className="flex-none">
                    <button onClick={() => addItem(s)} className="px-3 py-1 bg-amber-400 rounded text-sm font-semibold">Добавить</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {items.length === 0 ? (
          <div className="text-gray-600">Ваша корзина пуста</div>
        ) : (
          <div className="space-y-4">
            {items.map(item => (
              <div key={item.id} className="flex items-center gap-4">
                <img src={getImagePath(item.img || item.image)} alt={item.title} className="w-20 h-20 object-cover rounded-md flex-none" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{item.title}</div>
                  <div className="text-sm text-gray-600 mt-1">{(item.price || 0)} ₽</div>
                </div>
                <div className="flex items-center gap-2 flex-none">
                  <button className="px-3 py-1 bg-white border border-gray-200 rounded" onClick={() => decrement(item.id)}>-</button>
                  <div className="px-3 text-center min-w-[36px]">{item.qty}</div>
                  <button className="px-3 py-1 bg-white border border-gray-200 rounded" onClick={() => increment(item.id)}>+</button>
                </div>
                <div className="flex-none ml-2">
                  <button className="text-sm text-red-600" onClick={() => removeItem(item.id)}>Удалить</button>
                </div>
              </div>
            ))}

            <div className="border-t pt-4 flex items-center justify-between">
              <div className="font-semibold">Итого</div>
              <div className="font-bold text-lg">{totalSum} ₽</div>
            </div>

            <div className="flex gap-3">
              <button
                className="flex-1 px-4 py-2 bg-amber-400 hover:bg-amber-300 rounded-full font-semibold"
                onClick={() => {
                  if (onCheckout) onCheckout()
                }}
              >
                Оформить заказ
              </button>
              <button className="px-4 py-2 border rounded-full" onClick={onClose}>Продолжить покупки</button>
            </div>
          </div>
        )}
      </aside>
    </div>
  )
}
