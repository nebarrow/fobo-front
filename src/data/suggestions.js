import CATALOG from './catalog'

const SUGGESTION_IDS = ['pasta-3', 'des-1', 'des-2', 'drink-1', 'pasta-1', 'salad-1']

const SUGGESTIONS = CATALOG.filter(item => SUGGESTION_IDS.includes(item.id)).map(item => ({
  id: item.id,
  title: item.title,
  price: item.price,
  img: item.img,
  description: item.description
}))

export default SUGGESTIONS
