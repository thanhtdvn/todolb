/* global localStorage */

import axios from 'axios'

const API_URL = process.env.API_URL || 'http://localhost:3000/api'

export default axios.create({
  timeout: 10000,
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': localStorage.token
  }
})
