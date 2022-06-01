import axios from 'axios';
const BASE_URL_RESOURCE = 'http://localhost:5000';
const BASE_URL_AUTH = 'http://localhost:4000';

/**
 * The axios instance that fetches data from the authentication server.
 */
export const axiosAuth = axios.create({
  baseURL: BASE_URL_AUTH,
  headers: { 'Content-Type': 'application/json'},
  withCredentials: true
})

/**
 * The axios instance that fetches data from the resource server.
 */
export const axiosResource = axios.create({
  baseURL: BASE_URL_RESOURCE,
  headers: { 'Content-Type': 'application/json'},
  withCredentials: true
})