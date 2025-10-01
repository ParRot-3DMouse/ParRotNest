export const buildResponseError = async (res: Response): Promise<Error> => {
  const bodyText = await res.text().catch(() => "");
  const detail = bodyText ? ` - ${bodyText}` : "";
  return new Error(`Request failed with status ${res.status}${detail}`);
};

export const parseOkJson = async <T>(res: Response): Promise<T> => {
  if (!res.ok) {
    throw await buildResponseError(res);
  }
  try {
    const data = (await res.json()) as T;
    return data;
  } catch (error) {
    throw error;
  }
};
