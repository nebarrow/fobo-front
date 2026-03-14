import React from 'react'
import { getImagePath } from '../utils/paths'

const promos = [
  { id: 1, img: '/images/action/action1.png', big: true, alt: 'Акция: торты на заказ' },
  { id: 2, img: '/images/action/action1.png', alt: 'Акция: торты на заказ' },
  { id: 3, img: '/images/action/action1.png', alt: 'Акция: торты на заказ' },
  { id: 4, img: '/images/action/action1.png', alt: 'Акция: торты на заказ' },
  { id: 5, img: '/images/action/action1.png', alt: 'Акция: торты на заказ' }
].map(p => ({ ...p, img: getImagePath(p.img) }))

export default function Promotions({ onNavigate }) {
  return (
    <section className="promotions-section">
      <div className="promotions-wrapper">
        <h2 className="promotions-title">Наши <span className="promotions-accent">акции</span></h2>
        <div className="promotions-grid" aria-label="Сетка акций">
          {promos.map(p => (
            <div
              key={p.id}
              className={"promo-card" + (p.big ? ' promo-card--big' : '')}
            >
              <img src={p.img} alt={p.alt} className="promo-img" loading="lazy" />
            </div>
          ))}
        </div>
        <div className="promotions-cta">
          <button 
            className="promotions-btn"
            onClick={() => onNavigate?.('promotions')}
          >
            Все акции
          </button>
        </div>
      </div>
    </section>
  )
}
