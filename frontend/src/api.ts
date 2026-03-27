import axios, { AxiosError, type AxiosResponse } from "axios";
import type {
  Pessoa,
  Categoria,
  Transacao,
  TotaisPessoa,
  TotaisCategoria,
} from "./types";

const BASE_URL = import.meta.env.VITE_API_URL;


const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Helper para extrair mensagem de erro
function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    const data = axiosError.response?.data as any;

    if (data) {
      if (typeof data === "string") return data;
      if (data.erro) return data.erro;          // <-- chave usada pelo seu backend
      if (data.message) return data.message;    // padrão de alguns serviços
      if (data.title) return data.title;        // ProblemDetails do .NET
      if (data.detail) return data.detail;      // detalhe do ProblemDetails
    }

    if (axiosError.message) return axiosError.message;
  }

  if (error instanceof Error) return error.message;
  return "Erro desconhecido";
}

// Helper para lançar erro estruturado
function throwFormattedError(error: unknown): never {
  const message = getErrorMessage(error);
  const status = axios.isAxiosError(error) ? error.response?.status : undefined;
  throw { message, status, originalError: error };
}

// ─────────────────────────────────────────
// PESSOAS
// ─────────────────────────────────────────
export async function getPessoas(): Promise<Pessoa[]> {
  try {
    const response: AxiosResponse<Pessoa[]> = await api.get("/Pessoas");
    return response.data;
  } catch (error) {
    throwFormattedError(error);
  }
}

export async function getPessoa(id: number): Promise<Pessoa> {
  try {
    const response: AxiosResponse<Pessoa> = await api.get(`/Pessoas/${id}`);
    return response.data;
  } catch (error) {
    throwFormattedError(error);
  }
}

export async function createPessoa(body: Omit<Pessoa, "id">): Promise<Pessoa> {
  try {
    const response: AxiosResponse<Pessoa> = await api.post("/Pessoas", body);
    return response.data;
  } catch (error) {
    throwFormattedError(error);
  }
}

export async function updatePessoa(id: number, body: Pessoa): Promise<Pessoa> {
  try {
    const response: AxiosResponse<Pessoa> = await api.put(`/Pessoas/${id}`, body);
    return response.data;
  } catch (error) {
    throwFormattedError(error);
  }
}

export async function deletePessoa(id: number): Promise<void> {
  try {
    await api.delete(`/Pessoas/${id}`);
  } catch (error) {
    throwFormattedError(error);
  }
}

// ─────────────────────────────────────────
// CATEGORIAS
// ─────────────────────────────────────────
export async function getCategorias(): Promise<Categoria[]> {
  try {
    const response: AxiosResponse<Categoria[]> = await api.get("/Categorias");
    return response.data;
  } catch (error) {
    throwFormattedError(error);
  }
}

export async function createCategoria(body: Omit<Categoria, "id">): Promise<Categoria> {
  try {
    const response: AxiosResponse<Categoria> = await api.post("/Categorias", body);
    return response.data;
  } catch (error) {
    throwFormattedError(error);
  }
}

// ─────────────────────────────────────────
// TRANSAÇÕES
// ─────────────────────────────────────────
export async function getTransacoes(): Promise<Transacao[]> {
  try {
    const response: AxiosResponse<Transacao[]> = await api.get("/Transacoes");
    return response.data;
  } catch (error) {
    throwFormattedError(error);
  }
}

export async function createTransacao(
  body: Omit<Transacao, "id" | "categoria" | "pessoa">
): Promise<Transacao> {
  try {
    const response: AxiosResponse<Transacao> = await api.post("/Transacoes", body);
    return response.data;
  } catch (error) {
    throwFormattedError(error);
  }
}

// ─────────────────────────────────────────
// RELATÓRIOS
// ─────────────────────────────────────────
export async function getTotaisPorPessoa(): Promise<TotaisPessoa[]> {
  try {
    const response: AxiosResponse<TotaisPessoa[]> = await api.get("/Relatorios/totais-por-pessoa");
    return response.data;
  } catch (error) {
    throwFormattedError(error);
  }
}

export async function getTotaisPorCategoria(): Promise<TotaisCategoria[]> {
  try {
    const response: AxiosResponse<TotaisCategoria[]> = await api.get("/Relatorios/totais-por-categoria");
    return response.data;
  } catch (error) {
    throwFormattedError(error);
  }
}