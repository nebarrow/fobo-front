import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useAuth } from '../contexts/AuthContext'

export default function ProfilePage({ onNavigate }) {
  const { user, updateUser, logout } = useAuth()
  const [isEditingName, setIsEditingName] = useState(false)
  const [isEditingPhone, setIsEditingPhone] = useState(false)
  const [isEditingBirthday, setIsEditingBirthday] = useState(false)
  const [name, setName] = useState(user?.name || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [birthdayDay, setBirthdayDay] = useState('')
  const [birthdayMonth, setBirthdayMonth] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setPhone(user.phone || '')
      if (user.birthday) {
        const parts = user.birthday.split(' ')
        setBirthdayDay(parts[0] || '')
        setBirthdayMonth(parts.slice(1).join(' ') || '')
      }
    }
  }, [user])

  const handleSaveName = async () => {
    if (!name.trim()) return
    setSaving(true)
    try {
      await updateUser({ name: name.trim() })
    } catch {}
    setSaving(false)
    setIsEditingName(false)
  }

  const handleSavePhone = async () => {
    if (!phone.trim()) return
    setSaving(true)
    try {
      await updateUser({ phone: phone.trim() })
    } catch {}
    setSaving(false)
    setIsEditingPhone(false)
  }

  const handleSaveBirthday = async () => {
    if (!birthdayDay || !birthdayMonth) return
    setSaving(true)
    try {
      await updateUser({ birthday: `${birthdayDay} ${birthdayMonth}` })
    } catch {}
    setSaving(false)
    setIsEditingBirthday(false)
  }

  const handleLogout = () => {
    if (confirm('Вы уверены, что хотите выйти?')) {
      logout()
      onNavigate?.('home')
    }
  }

  return (
    <div
      className="min-h-screen bg-white"
      style={{
        fontFamily:
          "'Montserrat', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
      }}
    >
      <Header onNavigate={onNavigate} />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#F7D22D]">Личный кабинет</h1>
            <div className="w-12 h-12 rounded-full bg-[#F7D22D] flex items-center justify-center text-white text-xl font-bold">
              {user?.name?.[0]?.toUpperCase() || 'E'}
            </div>
          </div>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-[#F7D22D] mb-6">Личные данные</h2>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Имя</label>
              {isEditingName ? (
                <div className="flex items-center gap-3">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={handleSaveName}
                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F7D22D]"
                    style={{ background: '#F3F3F7' }}
                    autoFocus
                    disabled={saving}
                  />
                  <button
                    onClick={handleSaveName}
                    disabled={saving}
                    className="px-4 py-2.5 text-sm font-semibold text-[#F7D22D] hover:opacity-70"
                  >
                    {saving ? '...' : 'Сохранить'}
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between rounded-lg px-4 py-2.5 text-sm" style={{ background: '#F3F3F7' }}>
                  <span>{user?.name || 'Не указано'}</span>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="text-xs font-semibold text-[#F7D22D] ml-3 whitespace-nowrap"
                  >
                    Изменить
                  </button>
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Номер телефона</label>
              {isEditingPhone ? (
                <div className="flex items-center gap-3">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F7D22D]"
                    style={{ background: '#F3F3F7' }}
                    placeholder="+7 999 999-99-99"
                    autoFocus
                    disabled={saving}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSavePhone}
                      disabled={saving}
                      className="px-4 py-2.5 text-sm font-semibold text-[#F7D22D] hover:opacity-70"
                    >
                      {saving ? '...' : 'Сохранить'}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingPhone(false)
                        setPhone(user?.phone || '')
                      }}
                      className="px-4 py-2.5 text-sm font-semibold text-gray-600 hover:opacity-70"
                    >
                      Отменить
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between rounded-lg px-4 py-2.5 text-sm" style={{ background: '#F3F3F7' }}>
                  <span>{user?.phone || 'Не указано'}</span>
                  <button
                    onClick={() => setIsEditingPhone(true)}
                    className="text-xs font-semibold text-[#F7D22D] ml-3 whitespace-nowrap"
                  >
                    Изменить
                  </button>
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">День рождения</label>
              {isEditingBirthday ? (
                <div className="flex items-center gap-3">
                  <div className="flex gap-2 flex-1">
                    <input
                      type="text"
                      value={birthdayDay}
                      onChange={(e) => setBirthdayDay(e.target.value.replace(/\D/g, '').slice(0, 2))}
                      className="py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F7D22D]"
                      style={{ background: '#F3F3F7', minWidth: '140px', paddingLeft: '16px', paddingRight: '16px' }}
                      placeholder="День"
                      disabled={saving}
                    />
                    <input
                      type="text"
                      value={birthdayMonth}
                      onChange={(e) => setBirthdayMonth(e.target.value)}
                      className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F7D22D]"
                      style={{ background: '#F3F3F7' }}
                      placeholder="Месяц"
                      disabled={saving}
                    />
                  </div>
                  <button
                    onClick={handleSaveBirthday}
                    disabled={saving}
                    className="px-4 py-2.5 text-sm font-semibold text-gray-600 hover:opacity-70"
                  >
                    {saving ? '...' : 'Сохранить'}
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between rounded-lg px-4 py-2.5 text-sm" style={{ background: '#F3F3F7' }}>
                  <span>{user?.birthday || 'Не указано'}</span>
                  <button
                    onClick={() => setIsEditingBirthday(true)}
                    className="text-xs font-semibold text-[#F7D22D] ml-3 whitespace-nowrap"
                  >
                    Изменить
                  </button>
                </div>
              )}
            </div>

          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-[#F7D22D] mb-4">Подписки</h2>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-[#F7D22D] flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>
              <span className="text-sm text-gray-700">Сообщать о бонусах, акциях и новых продуктах</span>
              <div className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 text-xs">
                i
              </div>
            </div>
          </section>

          <div className="pt-6 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-300 transition"
            >
              Выйти
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
