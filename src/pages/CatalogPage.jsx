import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useCart } from '../contexts/CartContext'
import { productsApi } from '../api/products'

const CATEGORIES = {
  pizza:  { title: 'Пицца',   cols: 'lg:grid-cols-4' },
  pasta:  { title: 'Паста',   cols: 'lg:grid-cols-3' },
  soup:   { title: 'Супы',    cols: 'lg:grid-cols-3' },
  salad:  { title: 'Салаты',  cols: 'lg:grid-cols-3' },
  drink:  { title: 'Напитки', cols: 'lg:grid-cols-4' },
  desert: { title: 'Десерты', cols: 'lg:grid-cols-3' },
}

const SORT_OPTIONS = [
  { value: '',           label: 'По умолчанию' },
  { value: 'price_asc',  label: 'Цена: по возрастанию' },
  { value: 'price_desc', label: 'Цена: по убыванию' },
  { value: 'title_asc',  label: 'Название: А-Я' },
]

const PAGE_SIZE = 12

function ProductCard({ p, onAdd }) {
  const desc = p.desc || (p.description ? [p.description] : [])
  return (
    <div className="product-card bg-white rounded-lg shadow-md p-6 flex flex-col relative">
      <div className="image-wrap mb-4">
        <img src={p.img || p.image} alt={p.title} className="product-img" />
      </div>
      <h3 className="text-[18px] font-semibold text-gray-700 mb-2">{p.title}</h3>
      <div className="text-sm text-gray-500 mb-4">
        {desc.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>
      <div className="mt-auto flex items-center justify-between product-footer">
        <div className="price-block">
          <div className="product-price font-bold text-lg">{p.price} ₽</div>
        </div>
        <button className="add-btn text-black font-semibold px-4 py-2 rounded-full" onClick={() => onAdd(p)}>
          В корзину
        </button>
      </div>
    </div>
  )
}

export default function CatalogPage({ category, onNavigate }) {
  const { addItem } = useCart()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  const cat = CATEGORIES[category] || { title: category, cols: 'lg:grid-cols-3' }
  const totalPages = Math.ceil(total / PAGE_SIZE)

  useEffect(() => {
    setPage(1)
  }, [category, sort])

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    productsApi
      .getAll({ category, sort, page, limit: PAGE_SIZE })
      .then((data) => {
        if (cancelled) return
        setProducts(data.items || data)
        setTotal(data.total ?? (data.items || data).length)
      })
      .catch(() => {
        if (cancelled) return
        setProducts([])
        setTotal(0)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [category, sort, page])

  return (
    <div className="min-h-screen bg-white">
      <Header onNavigate={onNavigate} />
      <main className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <h1 className="text-2xl font-bold">{cat.title}</h1>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-md text-sm bg-white"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Загрузка...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-gray-400">Товары не найдены</div>
        ) : (
          <>
            <div className={`grid grid-cols-1 sm:grid-cols-2 ${cat.cols} gap-6`}>
              {products.map((p) => (
                <ProductCard key={p.id} p={p} onAdd={(prod) => addItem(prod)} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-3 py-1 rounded border border-gray-200 text-sm disabled:opacity-30"
                >
                  ‹
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={`px-3 py-1 rounded text-sm ${
                      n === page
                        ? 'bg-[#F7D22D] text-black font-semibold'
                        : 'border border-gray-200 text-gray-600'
                    }`}
                  >
                    {n}
                  </button>
                ))}
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1 rounded border border-gray-200 text-sm disabled:opacity-30"
                >
                  ›
                </button>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}
