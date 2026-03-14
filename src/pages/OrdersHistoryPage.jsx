import { useState, useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { ordersApi } from '../api/orders'
import { useAuth } from '../contexts/AuthContext'

const STATUS_LABELS = {
  pending: 'Ожидает',
  confirmed: 'Подтверждён',
  preparing: 'Готовится',
  delivering: 'Доставляется',
  completed: 'Завершён',
  cancelled: 'Отменён',
}

export default function OrdersHistoryPage({ onNavigate }) {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState(null)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }
    ordersApi.getAll()
      .then((data) => setOrders(data.orders || data || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false))
  }, [user])

  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        <Header onNavigate={onNavigate} />
        <main className="max-w-4xl mx-auto px-4 py-16 text-center">
          <p className="text-gray-600">Войдите, чтобы увидеть историю заказов</p>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header onNavigate={onNavigate} />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#F7D22D] mb-8">История заказов</h1>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Загрузка...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 text-gray-400">У вас пока нет заказов</div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <span className="font-semibold text-gray-900">Заказ #{order.id}</span>
                    <span className="ml-3 text-sm text-gray-500">{order.createdAt ? new Date(order.createdAt).toLocaleDateString('ru-RU') : ''}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      order.status === 'completed' ? 'bg-green-100 text-green-700' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {STATUS_LABELS[order.status] || order.status}
                    </span>
                    <span className="font-bold text-[#F7D22D]">{(order.totalSum || 0).toLocaleString('ru-RU')} ₽</span>
                  </div>
                </div>

                <button
                  onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                  className="mt-3 text-xs text-[#F7D22D] font-semibold"
                >
                  {expandedId === order.id ? 'Скрыть детали' : 'Подробнее'}
                </button>

                {expandedId === order.id && (
                  <div className="mt-4 border-t pt-4 space-y-2">
                    {(order.items || []).map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-gray-700">{item.title || item.productId} × {item.qty}</span>
                        <span className="text-gray-900 font-medium">{((item.price || 0) * (item.qty || 1)).toLocaleString('ru-RU')} ₽</span>
                      </div>
                    ))}
                    {order.deliveryType && (
                      <div className="text-xs text-gray-500 mt-2">
                        Доставка: {order.deliveryType === 'pickup' ? 'Самовывоз' : order.address || 'Курьером'}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-8">
          <button onClick={() => onNavigate?.('home')} className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-2">
            <span className="text-xl">‹</span>
            <span>Вернуться в магазин</span>
          </button>
        </div>
      </main>
      <Footer />
    </div>
  )
}
