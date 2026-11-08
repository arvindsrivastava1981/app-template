const _storage = new Map();

export async function withRequestCache(fn) {
  const prev = _storage.get('context');
  _storage.set('context', new Map());
  try {
    return await fn();
  } finally {
    _storage.set('context', prev);
  }
}

export async function requestCache(key, compute) {
  const store = _storage.get('context');
  if (!store) {
    const value = await compute();
    _storage.set('context', new Map([[key, value]]));
    return value;
  }
  if (store.has(key)) {
    return store.get(key);
  }
  const value = await compute();
  store.set(key, value);
  return value;
}

export function requestCacheGet(key) {
  const store = _storage.get('context');
  if (!store) return undefined;
  return store.get(key);
}

export function requestCacheHas(key) {
  const store = _storage.get('context');
  return !!(store && store.has(key));
}

export function requestCacheSet(key, value) {
  const store = _storage.get('context');
  if (store) {
    store.set(key, value);
  }
}