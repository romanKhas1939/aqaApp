// Вбудований демо-акаунт: дозволяє зайти в застосунок без реєстрації.
// Креди показані на сторінці логіну (LoginPage.js).
export const DEMO_USER = {
  firstName: "Demo",
  lastName: "Admin",
  email: "admin",
  password: "admin123",
  city: "Kyiv",
  country: "Ukraine",
  phone: "+380501234567",
  street: "Main Street 1",
  zip: "01001",
};

// Записуємо демо-акаунт у localStorage, щоб він існував як звичайний користувач.
// Це потрібно, бо AccountPage шукає залогінений email саме у `users` і без
// запису викидає на /login.
export function seedDemoUser() {
  let users;
  try {
    users = JSON.parse(localStorage.getItem("users"));
  } catch {
    users = null;
  }
  if (!Array.isArray(users)) users = [];

  // Додаємо лише за відсутності: інакше правки профілю через "Edit"
  // скидалися б при кожному перезавантаженні. Решту користувачів не чіпаємо.
  if (!users.some((user) => user.email === DEMO_USER.email)) {
    localStorage.setItem("users", JSON.stringify([DEMO_USER, ...users]));
  }
}
