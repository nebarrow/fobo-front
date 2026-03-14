import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function LoginModal({ isOpen, onClose }) {
  const { sendCode, verifyCode, register } = useAuth()
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [step, setStep] = useState('phone')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSendCode = async () => {
    if (!phone.trim()) {
      setError('Пожалуйста, введите номер телефона')
      return
    }
    setIsLoading(true)
    setError('')
    try {
      await sendCode(phone)
      setStep('code')
    } catch (e) {
      setError(e.message || 'Ошибка отправки кода')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyCode = async () => {
    if (!code.trim() || code.length !== 4) {
      setError('Пожалуйста, введите 4-значный код')
      return
    }
    setIsLoading(true)
    setError('')
    try {
      const data = await verifyCode(phone, code)
      if (data.isNewUser) {
        setStep('name')
      } else {
        resetAndClose()
      }
    } catch (e) {
      setError(e.message || 'Неверный код')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCompleteRegistration = async () => {
    if (!name.trim()) {
      setError('Пожалуйста, введите ваше имя')
      return
    }
    setIsLoading(true)
    setError('')
    try {
      await register(phone, code, name.trim())
      resetAndClose()
    } catch (e) {
      setError(e.message || 'Ошибка регистрации')
    } finally {
      setIsLoading(false)
    }
  }

  const resetAndClose = () => {
    onClose()
    setStep('phone')
    setPhone('')
    setCode('')
    setName('')
    setError('')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={resetAndClose}
      />
      <div className="relative bg-white rounded-2xl w-full max-w-md mx-4 p-6 sm:p-8 shadow-xl">
        <button
          className="absolute top-4 right-4 text-2xl text-[#F7D22D] leading-none hover:opacity-70"
          onClick={resetAndClose}
        >
          ×
        </button>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#F7D22D] mb-6 text-center">
          Вход на сайт
        </h2>

        {error && (
          <div className="mb-4 text-sm text-red-600 text-center">{error}</div>
        )}

        {step === 'phone' ? (
          <>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Номер телефона
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#F7D22D]"
                placeholder="+7 999 999-99-99"
                style={{ background: '#F3F3F7' }}
              />
            </div>
            <button
              onClick={handleSendCode}
              disabled={isLoading}
              className="w-full py-3 bg-[#F7D22D] rounded-lg text-base font-semibold text-gray-900 hover:opacity-90 disabled:opacity-50 transition"
            >
              {isLoading ? 'Отправка...' : 'Выслать код'}
            </button>
          </>
        ) : step === 'code' ? (
          <>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Код подтверждения
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-base text-center focus:outline-none focus:ring-2 focus:ring-[#F7D22D]"
                placeholder="0000"
                maxLength={4}
                style={{ background: '#F3F3F7' }}
                autoFocus
              />
            </div>
            <button
              onClick={handleVerifyCode}
              disabled={isLoading || code.length !== 4}
              className="w-full py-3 bg-[#F7D22D] rounded-lg text-base font-semibold text-gray-900 hover:opacity-90 disabled:opacity-50 transition mb-3"
            >
              {isLoading ? 'Проверка...' : 'Продолжить'}
            </button>
            <button
              onClick={() => {
                setStep('phone')
                setCode('')
                setError('')
              }}
              className="w-full text-sm text-gray-600 hover:text-gray-800"
            >
              Изменить номер телефона
            </button>
          </>
        ) : (
          <>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Ваше имя
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#F7D22D]"
                placeholder="Введите ваше имя"
                style={{ background: '#F3F3F7' }}
                autoFocus
              />
            </div>
            <button
              onClick={handleCompleteRegistration}
              disabled={isLoading || !name.trim()}
              className="w-full py-3 bg-[#F7D22D] rounded-lg text-base font-semibold text-gray-900 hover:opacity-90 disabled:opacity-50 transition mb-3"
            >
              {isLoading ? 'Регистрация...' : 'Завершить регистрацию'}
            </button>
            <button
              onClick={() => {
                setStep('code')
                setName('')
                setError('')
              }}
              className="w-full text-sm text-gray-600 hover:text-gray-800"
            >
              Назад
            </button>
          </>
        )}

        <p className="mt-6 text-xs text-gray-500 text-center">
          Продолжая, вы соглашаетесь со{' '}
          <a href="#" className="text-[#F7D22D] hover:underline">сбором и обработкой персональных данных</a>
          {' '}и{' '}
          <a href="#" className="text-[#F7D22D] hover:underline">пользовательским соглашением</a>
        </p>
      </div>
    </div>
  )
}
