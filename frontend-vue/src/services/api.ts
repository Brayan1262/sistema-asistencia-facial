import axios from "axios";

export const apiJava = axios.create({
  baseURL: "http://localhost:8080/api",
});

export const apiFace = axios.create({
  baseURL: "http://localhost:5001/api",
});