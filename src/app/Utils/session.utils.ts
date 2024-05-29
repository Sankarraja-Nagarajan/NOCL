export function setSession(key: string, value: any): void {
  sessionStorage.setItem(key, value);
}

export function getSession(key: string) {
  return sessionStorage.getItem(key);
}
