import React from 'react';
import { getImagePath } from '../utils/paths';

const MessengerPill = ({ src, alt, className = '' }) => (
  <div className={`messenger-pill ${className}`}>
    <img src={src} alt={alt} />
  </div>
);

export default function Footer() {
  return (
    <footer className="site-footer w-full">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:hidden mb-6">
          <div className="flex items-center justify-between mb-4">
            <img src={getImagePath("/images/logo.png")} alt="Fibo Pasta Bar" className="h-10 w-auto" />
            <div className="text-right">
              <div className="footer-phone text-xl">8 499 391-84-49</div>
              <button className="footer-call-btn mt-2 text-xs px-3 py-1.5">Заказать звонок</button>
            </div>
          </div>
        </div>

        <div className="footer-inner grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="footer-left">
            <img src={getImagePath("/images/logo.png")} alt="Fibo Pasta Bar" className="hidden sm:block h-12 w-auto mb-4" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-14 gap-y-2">
              <a href="#" className="footer-link">Калорийность и состав</a>
              <a href="#" className="footer-link">Правовая информация</a>
            </div>

            <div className="footer-col-title mt-3">Мы в соцсетях</div>

            <div className="grid sm:hidden grid-cols-3 gap-x-4 gap-y-2 mt-2 items-start footer-socials">
              <div className="space-y-2">
                <a href="#" className="footer-link">YouTube</a>
                <a href="#" className="footer-link">Instagram</a>
              </div>
              <div className="space-y-2">
                <a href="#" className="footer-link">Facebook</a>
                <a href="#" className="footer-link">ВКонтакте</a>
              </div>
              <div className="space-y-2 footer-address">
                <div className="footer-muted footer-nowrap">Москва ул. Проспект</div>
                <div className="footer-muted">Вернадского 86Б</div>
              </div>
            </div>

            <div className="hidden sm:grid grid-cols-3 gap-x-14 gap-y-2 mt-2 items-start footer-socials">
              <div className="space-y-2">
                <a href="#" className="footer-link">YouTube</a>
                <a href="#" className="footer-link">Instagram</a>
              </div>
              <div className="space-y-2">
                <a href="#" className="footer-link">Facebook</a>
                <a href="#" className="footer-link">ВКонтакте</a>
              </div>
              <div className="space-y-2 footer-address">
                <div className="footer-muted footer-nowrap">Москва ул. Проспект</div>
                <div className="footer-muted">Вернадского 86Б</div>
              </div>
            </div>

            <div className="footer-bottom hidden sm:flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6 lg:mt-8">
              <div className="footer-muted text-xs sm:text-sm">YaBao Все права защищены © 2021</div>
                <div className="payment-icons flex items-center gap-3 sm:gap-4">
                  <span className="payment-icon payment-icon--visa" aria-label="Visa" />
                  <span className="payment-icon payment-icon--paypal" aria-label="PayPal" />
                  <span className="payment-icon payment-icon--mastercard" aria-label="Mastercard" />
                </div>
            </div>
          </div>

          <div className="footer-right footer-right-shift">
            <div className="footer-title text-xs sm:text-sm">ОСТАЛИСЬ ВОПРОСЫ? А МЫ ВСЕГДА НА СВЯЗИ:</div>

            <div className="flex sm:hidden gap-2 mt-4 overflow-x-auto footer-messenger-row">
              <MessengerPill src={getImagePath("/images/footer/viber.png")} alt="Viber" />
              <MessengerPill src={getImagePath("/images/footer/skype.png")} alt="Skype" />
              <MessengerPill src={getImagePath("/images/footer/telegram.png")} alt="Telegram" />
              <MessengerPill src={getImagePath("/images/footer/facebook.png")} alt="Facebook" />
              <MessengerPill src={getImagePath("/images/footer/vk.png")} alt="VK" />
              <MessengerPill src={getImagePath("/images/footer/signal.png")} alt="Signal" />
            </div>

            <button className="footer-write-btn sm:hidden mt-2">Написать нам</button>

            <div className="hidden sm:flex md:hidden items-center gap-3 mt-4 w-full">
              <MessengerPill src={getImagePath("/images/footer/viber.png")} alt="Viber" />
              <MessengerPill src={getImagePath("/images/footer/skype.png")} alt="Skype" />
              <MessengerPill src={getImagePath("/images/footer/telegram.png")} alt="Telegram" />
              <MessengerPill src={getImagePath("/images/footer/facebook.png")} alt="Facebook" />
              <MessengerPill src={getImagePath("/images/footer/vk.png")} alt="VK" />
              <MessengerPill src={getImagePath("/images/footer/signal.png")} alt="Signal" />
              <button className="footer-write-btn leading-tight text-xs sm:text-sm flex-1 min-w-0">Написать нам</button>
            </div>

            <div className="hidden md:block">
              <div className="messenger-grid-desktop grid grid-cols-4 gap-2 mt-4">
                <MessengerPill src={getImagePath("/images/footer/viber.png")} alt="Viber" />
                <MessengerPill src={getImagePath("/images/footer/skype.png")} alt="Skype" />
                <MessengerPill src={getImagePath("/images/footer/signal.png")} alt="Signal" />
                <MessengerPill src={getImagePath("/images/footer/telegram.png")} alt="Telegram" />
                <MessengerPill src={getImagePath("/images/footer/facebook.png")} alt="Facebook" />
                <MessengerPill src={getImagePath("/images/footer/vk.png")} alt="VK" />
                <button className="footer-write-btn footer-write-btn-desktop leading-tight text-xs sm:text-sm col-span-2">Написать нам</button>
              </div>
            </div>

            <div className="footer-bottom-mobile sm:hidden flex flex-row items-center justify-between gap-3 mt-4">
              <div className="footer-muted text-xs">YaBao Все права защищены © 2021</div>
              <div className="payment-icons flex items-center gap-3">
                <span className="payment-icon payment-icon--visa" aria-label="Visa" />
                <span className="payment-icon payment-icon--paypal" aria-label="PayPal" />
                <span className="payment-icon payment-icon--mastercard" aria-label="Mastercard" />
              </div>
            </div>

            <div className="hidden sm:flex md:hidden items-center gap-4 mt-6">
              <div className="footer-phone">8 499 391-84-49</div>
              <button className="footer-call-btn flex-shrink-0">Заказать звонок</button>
            </div>

            <div className="hidden md:block">
              <div className="footer-phone mt-6">8 499 391-84-49</div>
              <button className="footer-call-btn mt-3">Заказать звонок</button>
            </div>
          </div>
        </div>
      </div>

      <img
        className="footer-watermark"
        src={getImagePath("/images/footer/pizzapastafibo.png")}
        alt="pizza pasta fibo"
      />
    </footer>
  );
}
