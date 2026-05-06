import axios from "axios";

import { API_BASE_URL } from "./api";

const API_URL = `${API_BASE_URL}/auth`;

export const signup = async (data) => {
  return axios.post(`${API_URL}/signup`, data);
};

export const login = async (data) => {
  return axios.post(`${API_URL}/login`, data);
};
