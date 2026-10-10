
const API_URLS = [
  "https://api.abcz.workers.dev/api/bazardor",
  "https://api.api-store.workers.dev/api/bazardor",
];

async function fetchFromBase(baseUrl, endpoint) {
  const response = await fetch(`${baseUrl}${endpoint}`, {
    cache: "no-store",
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${endpoint}`);
  }

  return response.json();
}

async function fetchAPI(endpoint) {
  let lastError;

  for (const baseUrl of API_URLS) {
    try {
      return await fetchFromBase(baseUrl, endpoint);
    } catch (error) {
      lastError = error;
      console.error(`API failed: ${baseUrl}${endpoint}`, error);
    }
  }

  throw lastError || new Error(`Unable to fetch ${endpoint}`);
}

function extractArray(data, key) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.[key])) return data[key];
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

// Get all products
export async function getProducts() {
  const data = await fetchAPI("/products");
  return extractArray(data, "products");
}

// Get all categories
export async function getCategories() {
  const data = await fetchAPI("/categories");
  return extractArray(data, "categories");
}

// Get one product by slug or ID
export async function getProduct(slug) {
  try {
    const products = await getProducts();

    const product = products.find(
      (item) =>
        String(item.slug) === String(slug) ||
        String(item.id) === String(slug) ||
        String(item._id) === String(slug)
    );

    if (product) return product;
  } catch (error) {
    console.error("Product list lookup failed:", error);
  }

  try {
    const data = await fetchAPI(
      `/products/${encodeURIComponent(slug)}`
    );

    if (data && !data.error) {
      return data.product ?? data.data ?? data;
    }
  } catch (error) {
    console.error("Product details lookup failed:", error);
  }

  return null;
}

// Get one category by slug
export async function getCategory(slug) {
  try {
    const data = await fetchAPI(
      `/categories/${encodeURIComponent(slug)}`
    );

    return data.category ?? data.data ?? data;
  } catch (error) {
    console.error("Category lookup failed:", error);
    return null;
  }
}
