export const handleResponse = async (response: Response) => {
  if (!response.ok) {
    throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
  }

  const contentType = response.headers.get('Content-Type');

  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }

  const text = await response.text();

  if (text === 'OK') {
    return { status: 'OK' };
  }

  throw new Error(`Ошибка - ${text}`);
};

export const fetchWithCookies = async <T>(
  url: string,
  options?: object
): Promise<T> => {
  const response = await fetch(url, {
    ...options,
    credentials: 'include',
  });
  return handleResponse(response);
};
