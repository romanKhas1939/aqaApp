import styled from 'styled-components';
import { useState } from 'react';
import Button from '../components/ui/Button';
import { Link, useLocation } from 'react-router-dom';

const products = [
  { id: 1, name: "Leather Wallet", price: 50, image: "/images/wallet.jpeg" },
  { id: 2, name: "Smartwatch", price: 380, image: "/images/watch.jpeg" },
  { id: 3, name: "Vintage Camera", price: 630, image: "/images/photograph.jpeg" },
  { id: 4, name: "Sunglasses", price: 90, image: "/images/glass.jpeg" },
  { id: 5, name: "Tablet", price: 420, image: "/images/tablet.jpeg" },
  { id: 6, name: "Coffee Machine", price: 570, image: "/images/coffeMachine.jpeg" },
];

const priceRanges = {
  all: { label: "All prices", match: () => true },
  under100: { label: "Under $100", match: (p) => p.price < 100 },
  "100to500": { label: "$100 - $500", match: (p) => p.price >= 100 && p.price <= 500 },
  over500: { label: "Over $500", match: (p) => p.price > 500 },
};

const MAX_QUANTITY = 10;

export default function CatalogPage({ cart, setCart }) {
  const [sortOrder, setSortOrder] = useState("asc");
  const [search, setSearch] = useState("");
  const [priceRange, setPriceRange] = useState("all");
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingProductId, setLoadingProductId] = useState(null);
  const location = useLocation();

  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  const getQuantity = (productId) => quantities[productId] || 1;

  const changeQuantity = (productId, delta) => {
    setQuantities((prev) => {
      const next = Math.min(MAX_QUANTITY, Math.max(1, (prev[productId] || 1) + delta));
      return { ...prev, [productId]: next };
    });
  };

  const handleToggleCart = (product) => {
    setLoading(true);
    setLoadingProductId(product.id);
    const quantity = getQuantity(product.id);

    setTimeout(() => {
      setCart((prevCart) => {
        let updatedCart;
        if (prevCart.some((item) => item.id === product.id)) {
          updatedCart = prevCart.filter((item) => item.id !== product.id);
        } else {
          updatedCart = [...prevCart, { ...product, quantity }];
        }
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        return updatedCart;
      });

      setLoading(false);
      setLoadingProductId(null);
    }, 1500); // Затримка 1.5 секунди перед додаванням/видаленням
  };

  const handleResetFilters = () => {
    setSearch("");
    setPriceRange("all");
  };

  const visibleProducts = products
    .filter((product) => product.name.toLowerCase().includes(search.trim().toLowerCase()))
    .filter((product) => priceRanges[priceRange].match(product))
    .sort((a, b) => (sortOrder === "asc" ? a.price - b.price : b.price - a.price));

  return (
    <Container>
      <NavBar>
        <StyledNavLink to="/" className={location.pathname === "/" ? "active" : ""} id="nav-catalog">
          Catalog
        </StyledNavLink>
        <StyledNavLink to="/cart" className={location.pathname === "/cart" ? "active" : ""} id="nav-cart">
          Cart (<span id="cart-count">{cart.length}</span>)
        </StyledNavLink>
        <StyledNavLink to={isAuthenticated ? "/account" : "/login"}
                       className={location.pathname === "/account" || location.pathname === "/login" ? "active" : ""}
                       id="nav-account">
          {isAuthenticated ? "My Account" : "Login"}
        </StyledNavLink>
      </NavBar>
      <Header>
        <h1 id="catalog-title">🛍️ Welcome to Our Shop</h1>
      </Header>

      <Toolbar>
        <SearchInput
          id="catalog-search"
          type="text"
          aria-label="Search products"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <SortSelect
          id="catalog-filter-price"
          aria-label="Filter by price"
          value={priceRange}
          onChange={(e) => setPriceRange(e.target.value)}
        >
          {Object.entries(priceRanges).map(([value, { label }]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </SortSelect>
        <SortSelect
          id="sort-products"
          aria-label="Sort by price"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
        </SortSelect>
        <ResetButton id="catalog-reset-filters" type="button" onClick={handleResetFilters}>
          Reset
        </ResetButton>
      </Toolbar>

      <ResultsCount id="catalog-results-count">
        {visibleProducts.length} of {products.length} products
      </ResultsCount>

      {visibleProducts.length === 0 ? (
        <EmptyMessage id="catalog-empty-message">
          No products match your search.
        </EmptyMessage>
      ) : (
      <ProductGrid>
        {visibleProducts.map((product) => (
          <ProductCard key={product.id} id={`product-card-${product.id}`}>
            <ProductImage
              src={product.image}
              alt={product.name}
              id={`product-image-${product.id}`}
            />
            <ProductInfo>
              <h3 id={`product-name-${product.id}`}>{product.name}</h3>
              <p id={`product-price-${product.id}`}>${product.price}</p>

              {(() => {
                const inCart = cart.find((item) => item.id === product.id);
                const busy = loading && loadingProductId === product.id;
                const quantity = inCart ? (inCart.quantity || 1) : getQuantity(product.id);

                return (
                  <>
                    <QuantityControls>
                      <QuantityButton
                        id={`product-qty-decrease-${product.id}`}
                        type="button"
                        aria-label={`Decrease quantity of ${product.name}`}
                        onClick={() => changeQuantity(product.id, -1)}
                        disabled={!!inCart || busy || quantity <= 1}
                      >
                        -
                      </QuantityButton>
                      <span
                        id={`product-qty-value-${product.id}`}
                        aria-label={`Quantity of ${product.name}`}
                      >
                        {quantity}
                      </span>
                      <QuantityButton
                        id={`product-qty-increase-${product.id}`}
                        type="button"
                        aria-label={`Increase quantity of ${product.name}`}
                        onClick={() => changeQuantity(product.id, 1)}
                        disabled={!!inCart || busy || quantity >= MAX_QUANTITY}
                      >
                        +
                      </QuantityButton>
                    </QuantityControls>
                    <Button
                      className="add-to-cart"
                      id={`product-add-${product.id}`}
                      onClick={() => handleToggleCart(product)}
                      disabled={busy}
                    >
                      {busy ? 'Processing...' : inCart ? 'Remove from Cart' : 'Add to Cart'}
                    </Button>
                  </>
                );
              })()}
            </ProductInfo>
          </ProductCard>
        ))}
      </ProductGrid>
      )}
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

const Toolbar = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
`;

const SearchInput = styled.input`
    flex: 1;
    min-width: 200px;
    box-sizing: border-box;
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 16px;

    &:focus {
        outline: none;
        border-color: #22c55e;
    }
`;

const SortSelect = styled.select`
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 16px;
    background: white;
    cursor: pointer;
`;

const ResetButton = styled(Button)`
    background: white;
    color: #666;
    border: 1px solid #ddd;
    padding: 8px 16px;
    font-size: 14px;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
        border-color: #22c55e;
        color: #22c55e;
    }
`;

const ResultsCount = styled.p`
    font-size: 14px;
    color: #666;
    margin: 0 0 20px;
`;

const EmptyMessage = styled.p`
    text-align: center;
    font-size: 18px;
    color: #666;
    padding: 40px 0;
`;

const QuantityControls = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin: 10px 0;

    span {
        font-size: 16px;
        font-weight: bold;
        min-width: 24px;
    }
`;

const QuantityButton = styled(Button)`
    background: #f1f5f9;
    color: #333;
    border: 1px solid #ddd;
    padding: 4px 12px;
    font-size: 16px;
    border-radius: 5px;
    cursor: pointer;

    &:hover:not(:disabled) {
        background: #e2e8f0;
    }

    &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
    }
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
