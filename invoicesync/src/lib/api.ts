// URL de base de l'API : on privilégie la variable d'environnement, sinon fallback vers le port exposé par launchSettings.json
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5081/api";

export async function apiFetch<T>(endpoint: string, options: RequestInit & { body?: any } = {}): Promise<T> {
  const { body, ...rest } = options;

  const res = await fetch(`${API_URL}${endpoint}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(rest.headers || {})
    },
    ...rest,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    throw new Error('unauth');
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }

  // Pas de contenu
  if (res.status === 204) return {} as T;

  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    // S'il y a bien du JSON on le parse
    return res.json() as Promise<T>;
  }
  // Sinon, on retourne un objet vide / texte brut
  return {} as T;
}

export function post<T>(endpoint: string, body?: any) {
  return apiFetch<T>(endpoint, { method: 'POST', body });
}

export function get<T>(endpoint: string) {
  return apiFetch<T>(endpoint);
}

export function del<T>(endpoint: string) {
  return apiFetch<T>(endpoint, { method: 'DELETE' });
}

export function put<T>(endpoint: string, body?: any) {
  return apiFetch<T>(endpoint, { method: 'PUT', body });
} 