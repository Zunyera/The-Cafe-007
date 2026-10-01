export const restaurant = {
  name: 'Café 007',
  tagline: "Let's Hangout...",
  phones: ['067-3751007', '0300-1294007', '0311-1134007'],
  address: '1-km Vehari Road, Near NADRA Office, Mailsi',
  delivery: 'Free Delivery on Orders Over Rs. 500',
  facebook: 'https://www.facebook.com/Cafe007Mailsi',
  instagram: 'https://www.instagram.com/cafe007.mailsi/',
  directions: 'https://www.google.com/maps/search/?api=1&query=Cafe+007+1-km+Vehari+Road+Near+NADRA+Office+Mailsi',
};

export const branches = [
  { id: 'mailsi', name: 'Mailsi', menuLabel: 'Mailsi', address: restaurant.address, phones: restaurant.phones, hours: null, delivery: true },
  { id: 'burewala', name: 'Burewala', menuLabel: 'MAIN BRANCH BUREWALA', address: null, phones: [], hours: null, delivery: null, isMain: true },
  { id: 'islamabad', name: 'Islamabad', menuLabel: 'Islamabad (Enclave / Bahria)', address: null, phones: [], hours: null, delivery: null },
  { id: 'sialkot', name: 'Sialkot', menuLabel: 'Sialkot', address: null, phones: [], hours: null, delivery: null },
  { id: 'daska', name: 'Daska', menuLabel: 'Daska', address: null, phones: [], hours: null, delivery: null },
  { id: 'gaggo', name: 'Gaggo', menuLabel: 'Gaggo', address: null, phones: [], hours: null, delivery: null },
  { id: 'machiwal', name: 'Machiwal', menuLabel: 'Machiwal', address: null, phones: [], hours: null, delivery: null },
  { id: '455-eb-brw', name: '455/EB BRW', menuLabel: '455/EB BRW', address: null, phones: [], hours: null, delivery: null },
  { id: 'garhamore', name: 'Garhamore', menuLabel: 'Garhamore', address: null, phones: [], hours: null, delivery: null },
  { id: 'ghaziabad', name: 'Ghaziabad', menuLabel: 'Ghaziabad', address: null, phones: [], hours: null, delivery: null },
];