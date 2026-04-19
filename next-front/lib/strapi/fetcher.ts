export const fetcher = async (
  url: string,
  args: RequestInit & { data?: unknown } = {}
) => {
  const { data, ...options } = args;

  const path = `${process.env.NEXT_PUBLIC_API_URL}${url}`;

  const response = await fetch(path, {
    ...options,
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.json();
};
