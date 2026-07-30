/**
 * UZUPEŁNIJ TEN PLIK PRZED PUBLIKACJĄ.
 * To jedyne miejsce, w którym trzeba wpisać dane kontaktowe i zmienić ceny.
 */
window.EFOIL_CONFIG = {
  brandName: "eFoil Szczecin",

  // Przykład telefonu: "+48 501 234 567"
  phone: "",

  // Przykład e-maila: "rezerwacje@twojadomena.pl"
  email: "",

  // Opcjonalnie, same cyfry z kodem kraju, np. "48501234567"
  whatsapp: "",

  pickupNote: "Szczecin — dokładne miejsce odbioru ustalamy przy rezerwacji",
  deposit: "3 000–5 000 zł",

  // Cennik startowy. Wartości „from” są używane w kalkulatorze zapytania.
  prices: {
    1: { from: 600, to: 650, label: "1 dzień" },
    2: { from: 1050, to: 1150, label: "2 dni" },
    3: { from: 1400, to: 1500, label: "Weekend · 3 dni" },
    5: { from: 2200, to: 2400, label: "5 dni" },
    7: { from: 2600, to: 2800, label: "7 dni" }
  }
};
