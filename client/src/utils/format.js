export const money = (value) => `Rs. ${value.toLocaleString('en-PK')}`;
export const telephone = (phone) => `tel:${phone.replace(/[^+\d]/g, '')}`;
export const validPhone = (phone) =>
  /^[+\d\s()-]{7,20}$/.test(phone) && phone.replace(/\D/g, '').length >= 7;

export const localDate = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export function readLocal(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export function writeLocal(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}