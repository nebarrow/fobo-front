import { ApolloClient, InMemoryCache, gql } from '@apollo/client'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
const GRAPHQL_URL = API_BASE.replace('/api', '/graphql')

export const apolloClient = new ApolloClient({
  uri: GRAPHQL_URL,
  cache: new InMemoryCache(),
})

export const PRODUCTS_QUERY = gql`
  query Products($category: String, $sort: String, $page: Int, $limit: Int) {
    products(category: $category, sort: $sort, page: $page, limit: $limit) {
      id
      title
      description
      price
      image
      category
    }
  }
`

export const PRODUCT_QUERY = gql`
  query Product($id: String!) {
    product(id: $id) {
      id
      title
      description
      price
      image
      category
    }
  }
`

export const SUGGESTIONS_QUERY = gql`
  query Suggestions {
    suggestions {
      id
      title
      price
      image
    }
  }
`

export const ORDERS_QUERY = gql`
  query Orders {
    orders {
      id
      status
      deliveryType
      totalPrice
      promoCode
      discount
      createdAt
      items {
        id
        quantity
        price
        product {
          id
          title
          image
        }
      }
    }
  }
`

export const ORDER_QUERY = gql`
  query Order($id: String!) {
    order(id: $id) {
      id
      status
      deliveryType
      totalPrice
      promoCode
      discount
      createdAt
      items {
        id
        quantity
        price
        product {
          id
          title
          image
        }
      }
    }
  }
`

export const CREATE_ORDER_MUTATION = gql`
  mutation CreateOrder($deliveryType: String!, $promoCode: String) {
    createOrder(deliveryType: $deliveryType, promoCode: $promoCode) {
      id
      status
      totalPrice
    }
  }
`
