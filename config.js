/**
 * UZUPEŁNIJ TEN PLIK PRZED PUBLIKACJĄ.
 * To jedyne miejsce, w którym trzeba wpisać dane kontaktowe i zmienić ceny.
 */
window.EFOIL_CONFIG = {
  brandName: "eFoil Szczecin",

  // Przykład telefonu: "+48 501 234 567"
  phone: "+48 660 479 286",

  // Przykład e-maila: "rezerwacje@twojadomena.pl"
  email: "info@efoilszczecin.pl",

  // Opcjonalnie, same cyfry z kodem kraju, np. "48501234567"
  whatsapp: "",

  pickupNote: "Szczecin — dokładne miejsce odbioru ustalamy przy rezerwacji",
  deposit: "3 000 zł",

  // Ostateczny cennik wynajmu używany na stronie i w formularzu.
  prices: {
    1: { amount: 600, label: "1 dzień" },
    2: { amount: 1050, label: "2 dni" },
    3: { amount: 1400, label: "Weekend · 3 dni" },
    5: { amount: 2000, label: "5 dni" },
    7: { amount: 2500, label: "7 dni" }
  }
};
