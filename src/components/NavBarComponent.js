import { useEffect, useState } from "react";
import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";

export default function NavBarComponent() {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const updateCartCount = () => {
      setLoading(true);

      setTimeout(() => {
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCartCount(storedCart.length);
        setLoading(false);
      }, 1000); // Затримка 1 секунда перед оновленням кошика
    };

    updateCartCount(); // Завантажуємо одразу

    window.addEventListener("storage", updateCartCount);
    return () => window.removeEventListener("storage", updateCartCount);
  }, []);

  return (
    <NavBar>
      <StyledNavLink to="/" className={location.pathname === "/" ? "active" : ""}>
        Catalog
      </StyledNavLink>
      <StyledNavLink to="/cart" className={location.pathname === "/cart" ? "active" : ""}>
        {loading ? "Basket (…)" : `Basket (${cartCount})`}
      </StyledNavLink>
      <StyledNavLink to={isAuthenticated ? "/account" : "/login"} className={location.pathname.includes("/account") || location.pathname.includes("/login") ? "active" : ""}>
        {isAuthenticated ? "My Account" : "Login"}
      </StyledNavLink>
    </NavBar>
  );
}

// ✅ Styled Components
const NavBar = styled.nav`
    display: flex;
    justify-content: center;
    gap: 20px;
    padding: 15px 0;
    background: #f8f9fa;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    margin-bottom: 20px;
`;

const StyledNavLink = styled(Link)`
    text-decoration: none;
    font-size: 18px;
    font-weight: bold;
    padding: 8px 16px;
    color: #333;
    transition: 0.3s;

    &.active {
        color: #22c55e;
        font-weight: bold;
        border-bottom: 2px solid #22c55e;
    }

    &:hover {
        color: #22c55e;
    }
`;
