import styled from "styled-components";
import { Link } from "react-router-dom";

const NavBar = styled.nav`
  background: #333;
  color: white;
  padding: 16px;
  display: flex;
  justify-content: space-between;
`;

const StyledLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 18px;
  &:hover {
    text-decoration: underline;
  }
`;

export default function Header({ cartCount }) {
  return (
    <NavBar>
      <StyledLink to="/">Catalog</StyledLink>
      <StyledLink to="/cart">Basket ({cartCount})</StyledLink>
      <StyledLink to="/login">My Account</StyledLink>
    </NavBar>
  );
}

