import { AsyncLocalStorage } from 'async_hooks';

const requestStore = new AsyncLocalStorage();

export async function withRequestCache(fn) {
  return requestStore.run(new Map(), fn);
}

export async function requestCache(key, compute) {
  const store = requestStore.getStore();
  if (!store) {
    return compute();
  }
  if (store.has(key)) {
    return store.get(key);
  }
  const value = await compute();
  store.set(key, value);
  return value;
}

export function requestCacheGet(key) {
  const store = requestStore.getStore();
  if (!store) return undefined;
  return store.get(key);
}

export function requestCacheHas(key) {
  const store = requestStore.getStore();
  if (!store) return false;
  return store.has(key);
}

export function requestCacheSet(key, value) {
  const store = requestStore.getStore();
  if (!store) return;
  store.set(key, value);
}