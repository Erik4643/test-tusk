import { METHODS } from 'utils/constants';

interface FetchDataOptions {
  body?: BodyInit;
  headers?: HeadersInit;
  method?: string;
  params?: Record<string, string>;
}

export const fetchUserData = async (url: string, options: FetchDataOptions = {}): Promise<any> => {
  try {
    const params = new URLSearchParams(options.params).toString();

    const response = await fetch(`${process.env.REACT_APP_API_URL}${url}?${params}`, {
      method: options.method || METHODS.GET,
      body: options.body,
      headers: options.headers,
    });

    const data = await response.json();

    if (response.ok) {
      return data;
    }

    console.error('Error:', data);
    return null;
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
};
