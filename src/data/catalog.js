const getImagePath = (path) => {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  return `${import.meta.env.BASE_URL}${cleanPath}`
}

const CATALOG = [
  { id: 'pizza-1', title: 'С креветками и трюфелями', price: 600, img: '/images/pizza/mix.png', description: 'Домашняя паста феттуччине сливочный соус, креветки, трюфельное масло, черный перец, пармезан. 350 г' },
  { id: 'pizza-2', title: 'С креветками и трюфелями', price: 600, img: '/images/pizza/sirnaya.png', description: 'Домашняя паста феттуччине сливочный соус, креветки, трюфельное масло, черный перец, пармезан. 350 г' },
  { id: 'pizza-3', title: 'С креветками и трюфелями', price: 600, img: '/images/pizza/sgribami.png', description: 'Домашняя паста феттуччине сливочный соус, креветки, трюфельное масло, черный перец, пармезан. 350 г' },
  { id: 'pizza-4', title: 'С креветками и трюфелями', price: 600, img: '/images/pizza/sousnaya.png', description: 'Домашняя паста феттуччине сливочный соус, креветки, трюфельное масло, черный перец, пармезан. 350 г' },

  { id: 'pasta-1', title: 'Тальятелле с морепродуктами', price: 520, img: '/images/pasta/паста1.jpg', description: 'Домашняя паста тальятелле сливочный соус, креветки, мидии пармезан. 300 г' },
  { id: 'pasta-2', title: 'Пенне с томатами', price: 480, img: '/images/pasta/паста2.jpg', description: 'Пенне ригате томатный соус, базилик, пармезан' },
  { id: 'pasta-3', title: 'Спагетти карбонара', price: 550, img: '/images/pasta/паста3.jpg', description: 'Спагетти, бекон, сливки, яйцо, пармезан' },
  { id: 'pasta-4', title: 'Равиоли с рикоттой', price: 590, img: '/images/pasta/паста4.jpg', description: 'Равиоли с рикоттой сливочный соус, орегано' },
  { id: 'pasta-5', title: 'Лазанья классическая', price: 610, img: '/images/pasta/паста5.jpg', description: 'Лазанья с мясом томатный соус, сыр моцарелла' },
  { id: 'pasta-6', title: 'Феттуччине с грибами', price: 530, img: '/images/pasta/паста6.jpg', description: 'Феттуччине, сливочный соус, грибы' },

  { id: 'salad-1', title: 'Цезарь с курицей', price: 420, img: '/images/salad/салат1.jpg', description: 'Салат ромэн, курица, пармезан' },
  { id: 'salad-2', title: 'Греческий', price: 380, img: '/images/salad/салат2.jpg', description: 'Огурцы, помидоры, фета, оливки' },
  { id: 'salad-3', title: 'Нисуаз', price: 450, img: '/images/salad/салат3.jpg', description: 'Тунец, яйца, картофель, фасоль' },
  { id: 'salad-4', title: 'Овощной', price: 330, img: '/images/salad/салат4.jpg', description: 'Ассорти свежих овощей с соусом' },

  { id: 'soup-1', title: 'Томатный суп', price: 320, img: '/images/soup/суп1.jpg', description: 'Томатный бульон с базиликом и гренками' },
  { id: 'soup-2', title: 'Крем-суп из шампиньонов', price: 350, img: '/images/soup/суп2.jpg', description: 'Нежный крем c шампиньонами пармезан, сливки' },
  { id: 'soup-3', title: 'Уха', price: 380, img: '/images/soup/суп3.jpg', description: 'Классическая уха с лососем и зеленью' },
  { id: 'soup-4', title: 'Суп с морепродуктами', price: 420, img: '/images/soup/суп4.jpg', description: 'Креветки, мидии, сливочный бульон' },
  { id: 'soup-5', title: 'Окрошка', price: 290, img: '/images/soup/суп5.jpg', description: 'Освежающая окрошка на кефире с зеленью' },

  { id: 'des-1', title: 'Синабон', price: 220, img: '/images/desert/синабон.jpg', description: 'С теплыми корицами' },
  { id: 'des-2', title: 'Пончики', price: 180, img: '/images/desert/пончики.jpg', description: 'Домашние' },
  { id: 'des-3', title: 'Персиковый', price: 200, img: '/images/desert/персиковый.jpg', description: 'С фруктовым пюре' },
  { id: 'des-4', title: 'Блины с медом', price: 170, img: '/images/desert/блинысмедом.jpg', description: 'Теплые блины' },
  { id: 'des-5', title: 'Кекс', price: 150, img: '/images/desert/кекс.jpg', description: 'Шоколадная начинка' },

  { id: 'drink-1', title: 'Кола', price: 120, img: '/images/drink/кола.jpg', description: 'Газированный напиток, 330 мл' },
  { id: 'drink-2', title: 'Фанта', price: 120, img: '/images/drink/фанта.jpg', description: 'Апельсиновая фанта, 330 мл' },
  { id: 'drink-3', title: 'Спрайт', price: 120, img: '/images/drink/спрайт.jpg', description: 'Лимонно‑лайм газированный напиток, 330 мл' },
  { id: 'drink-4', title: 'Липтон', price: 130, img: '/images/drink/липтон.jpg', description: 'Холодный чай Lipton, 330 мл' }
].map(item => ({ ...item, img: getImagePath(item.img) }))

export default CATALOG
