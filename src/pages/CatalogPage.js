import styled from 'styled-components';
import { useState } from 'react';
import Button from '../components/ui/Button';
import { Link, useLocation } from 'react-router-dom';

const products = [
  { id: 1, name: "Leather Wallet", price: 50, image: "/images/wallet.jpeg" },
  { id: 2, name: "Smartwatch", price: 380, image: "/images/watch.jpeg" },
  { id: 3, name: "Vintage Camera", price: 630, image: "/images/photograph.jpeg" },
  { id: 4, name: "Glass", price: 90, image: "/images/glass.jpeg" },
  { id: 5, name: "Tablet", price: 420, image: "/images/tablet.jpeg" },
  { id: 6, name: "Coffee machine", price: 570, image: "/images/coffeMachine.jpeg" },
];

export default function CatalogPage({ cart, setCart }) {
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(false);
  const [loadingProductId, setLoadingProductId] = useState(null);
  const location = useLocation();

  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  const handleToggleCart = (product) => {
    setLoading(true);
    setLoadingProductId(product.id);

    setTimeout(() => {
      setCart((prevCart) => {
        let updatedCart;
        if (prevCart.some((item) => item.id === product.id)) {
          updatedCart = prevCart.filter((item) => item.id !== product.id);
        } else {
          updatedCart = [...prevCart, product];
        }
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        return updatedCart;
      });

      setLoading(false);
      setLoadingProductId(null);
    }, 1500); // Затримка 1.5 секунди перед додаванням/видаленням
  };

  const sortedProducts = [...products].sort((a, b) =>
    sortOrder === "asc" ? a.price - b.price : b.price - a.price
  );

  return (
    <Container>
      <NavBar>
        <StyledNavLink to="/" className={location.pathname === "/" ? "active" : ""} id="nav-catalog">
          Catalog
        </StyledNavLink>
        <StyledNavLink to="/cart" className={location.pathname === "/cart" ? "active" : ""} id="nav-cart">
          Basket (<span id="cart-count">{cart.length}</span>)
        </StyledNavLink>
        <StyledNavLink to={isAuthenticated ? "/account" : "/login"}
                       className={location.pathname === "/account" || location.pathname === "/login" ? "active" : ""}
                       id="nav-account">
          {isAuthenticated ? "My Account" : "Login"}
        </StyledNavLink>
      </NavBar>
      <Header>
        <h1 id="catalog-title">🛍️ Welcome to Our Shop</h1>
        <SortSelect id="sort-products" onChange={(e) => setSortOrder(e.target.value)}>
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
        </SortSelect>
      </Header>
      <ProductGrid>
        {sortedProducts.map((product) => (
          <ProductCard key={product.id} id={`product-card-${product.id}`}>
            <ProductImage
              src={product.image}
              alt={product.name}
              id={`product-image-${product.id}`}
            />
            <ProductInfo>
              <h3 id={`product-name-${product.id}`}>{product.name}</h3>
              <p id={`product-price-${product.id}`}>${product.price}</p>
              <Button
                className="add-to-cart"
                id={`product-add-${product.id}`}
                onClick={() => handleToggleCart(product)}
                disabled={loading && loadingProductId === product.id}
              >
                {loading && loadingProductId === product.id ? 'Processing...' :
                  cart.some((item) => item.id === product.id) ? 'Remove from Basket' : 'Add to Basket'}
              </Button>
            </ProductInfo>
          </ProductCard>
        ))}
      </ProductGrid>
      <Footer>
        This application was developed by Khas Roman as part of the "AQA for Beginners: Practical Testing with Playwright + JavaScript" course. All rights reserved. If you encounter this application outside the intended course context, it may have been shared without the author's consent. For any inquiries, please contact Khas Roman at <a href="mailto:romakhasss@gmail.com">romakhasss@gmail.com</a> or via <a href="https://www.linkedin.com/in/roman-khas-64b10b194" target="_blank" rel="noopener noreferrer">LinkedIn</a>.
      </Footer>
    </Container>
  );
}

// ✅ **Стилі**
const Container = styled.div`
    padding: 20px;
    max-width: 1200px;
    margin: auto;
`;

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
    color: #333;
    font-weight: bold;
    padding: 8px 16px;
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

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 20px;
`;

const SortSelect = styled.select`
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 16px;
`;

const ProductGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
`;

const ProductCard = styled.div`
    background: white;
    border-radius: 10px;
    padding: 15px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    text-align: center;
`;

const ProductImage = styled.img`
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 8px;
`;

const ProductInfo = styled.div`
    margin-top: 10px;
    h3 {
        font-size: 18px;
        margin: 10px 0;
    }
    p {
        font-size: 16px;
        color: #666;
    }
    .add-to-cart {
        background: #22c55e;
        color: white;
        padding: 10px;
        border-radius: 5px;
        font-size: 14px;
        cursor: pointer;
        &:disabled {
            background: #ccc;
            cursor: not-allowed;
        }
    }
`;

const Footer = styled.footer`
    font-size: 13px;
    color: #777;
    margin: 40px auto 0;
    padding-top: 20px;
    border-top: 1px solid #ccc;
    text-align: center;
    max-width: 800px;
    line-height: 1.6;
    a {
        color: #007bff;
        text-decoration: none;
    }
    a:hover {
        text-decoration: underline;
    }
`;
