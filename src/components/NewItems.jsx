import React from 'react'
import { getImagePath } from '../utils/paths'

const items = Array.from({ length: 4 }).map((_, i) => ({
  id: i + 1,
  title: 'Карбонара',
  priceFrom: 120,
  img: getImagePath('/images/pizza/karbonara.png')
}))

export default function NewItems() {
  return (
    <section className="new-items-section">
      <h2 className="new-items-title">Новинки</h2>
      <div className="new-items-list" role="list">
        {items.map(item => (
          <div key={item.id} className="new-items-item" role="listitem">
            <img src={item.img} alt={item.title} className="new-items-img" />
            <div className="new-items-info">
              <div className="new-items-name">{item.title}</div>
              <div className="new-items-price">от {item.priceFrom} Р</div>
            </div>
          </div>
        ))}
      </div>
      <img src={getImagePath("/images/viglyadivaushiy_man.png")} alt="Мужчина" className="new-items-man" loading="lazy" />
    </section>
  )
}

