import styled from "styled-components";
import Button from "../components/ui/Button";
import { useNavigate } from "react-router-dom";
import NavBarComponent from "../components/NavBarComponent";
import { useState } from "react";

export default function CartPage({ cart, setCart }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingProductId, setLoadingProductId] = useState(null);

  // ✅ Захист від `undefined`
  const safeCart = Array.isArray(cart) ? cart : [];

  const handleProceedToCheckout = () => {
    setLoading(true);

    setTimeout(() => {
      localStorage.setItem("redirectAfterLogin", "/checkout");
      const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

      if (isAuthenticated) {
        navigate("/checkout");
      } else {
        alert("You need to log in to proceed to checkout.");
        navigate("/login");
      }

      setLoading(false);
    }, 2000); // Затримка 2 секунди перед переходом до оплати
  };

  const handleIncreaseQuantity = (productId) => {
    setLoading(true);
    setLoadingProductId(productId);

    setTimeout(() => {
      setCart((prevCart) => {
        const updatedCart = prevCart.map((item) =>
          item.id === productId ? { ...item, quantity: (item.quantity || 1) + 1 } : item
        );
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        window.dispatchEvent(new Event("storage")); // 🔄 Оновлюємо кошик у NavBar
        return updatedCart;
      });

      setLoading(false);
      setLoadingProductId(null);
    }, 1000); // Затримка 1 секунда перед зміною кількості
  };

  const handleDecreaseQuantity = (productId) => {
    setLoading(true);
    setLoadingProductId(productId);

    setTimeout(() => {
      setCart((prevCart) => {
        let updatedCart = prevCart
          .map((item) => {
            if (item.id === productId) {
              if (item.quantity > 1) {
                return { ...item, quantity: item.quantity - 1 }; // ✅ Мінімум 1
              } else {
                return null; // ❌ Позначаємо товар для видалення
              }
            }
            return item;
          })
          .filter(Boolean); // ❌ Видаляємо лише товари, позначені як `null`

        localStorage.setItem("cart", JSON.stringify(updatedCart));
        window.dispatchEvent(new Event("storage")); // 🔄 Оновлюємо кошик у NavBar

        return updatedCart.length > 0 ? updatedCart : []; // ❗ Якщо корзина порожня, оновлюємо стан
      });

      setLoading(false);
      setLoadingProductId(null);
    }, 1000); // Затримка 1 секунда перед зменшенням кількості
  };

  const handleRemoveFromCart = (productId) => {
    setLoading(true);
    setLoadingProductId(productId);

    setTimeout(() => {
      setCart((prevCart) => {
        const updatedCart = prevCart.filter((item) => item.id !== productId);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        window.dispatchEvent(new Event("storage")); // 🔄 Оновлюємо кошик у NavBar
        return updatedCart;
      });

      setLoading(false);
      setLoadingProductId(null);
    }, 1500); // Затримка 1.5 секунди перед видаленням товару
  };

  const totalAmount = safeCart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  return (
    <Container>
      <NavBarComponent cartCount={safeCart.length} />

      <Header>
        <h1 id="cart-title">🛒 Your Shopping Basket</h1>
      </Header>

      {safeCart.length === 0 ? (
        <EmptyMessage id="cart-empty-message">Your basket is empty.</EmptyMessage>
      ) : (
        <>
          <ProductGrid>
            {safeCart.map((product) => (
              <ProductCard key={product.id} id={`cart-item-${product.id}`}>
                <ProductImage src={product.image} alt={product.name} id={`cart-item-image-${product.id}`} />
                <ProductInfo>
                  <h3 id={`cart-item-name-${product.id}`}>{product.name}</h3>
                  <p id={`cart-item-price-${product.id}`}>${product.price}</p>
                  <QuantityControls>
                    <Button
                      onClick={() => handleDecreaseQuantity(product.id)}
                      id={`cart-item-decrease-${product.id}`}
                      disabled={loading && loadingProductId === product.id}
                    >
                      {loading && loadingProductId === product.id ? "..." : "-"}
                    </Button>
                    <span id={`cart-item-quantity-${product.id}`}>{product.quantity || 1}</span>
                    <Button
                      onClick={() => handleIncreaseQuantity(product.id)}
                      id={`cart-item-increase-${product.id}`}
                      disabled={loading && loadingProductId === product.id}
                    >
                      {loading && loadingProductId === product.id ? "..." : "+"}
                    </Button>
                  </QuantityControls>
                  <Button
                    className="remove-from-cart"
                    onClick={() => handleRemoveFromCart(product.id)}
                    id={`cart-item-remove-${product.id}`}
                    disabled={loading && loadingProductId === product.id}
                  >
                    {loading && loadingProductId === product.id ? "Removing..." : "Remove from Basket"}
                  </Button>
                </ProductInfo>
              </ProductCard>
            ))}
          </ProductGrid>
          <TotalContainer>
            <h2 id="cart-total">Total: ${totalAmount.toFixed(2)}</h2>
            <CheckoutButton onClick={handleProceedToCheckout} id="cart-checkout-button" disabled={loading}>
              {loading ? "Processing..." : "Proceed to Checkout"}
            </CheckoutButton>
          </TotalContainer>
        </>
      )}
    </Container>
  );
}

// ✅ **Стилі**
const Container = styled.div`
    padding: 20px;
    max-width: 1200px;
    margin: auto;
`;

const Header = styled.div`
    text-align: center;
    margin-bottom: 20px;
`;

const EmptyMessage = styled.p`
    text-align: center;
    font-size: 18px;
    color: #666;
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
    .remove-from-cart {
        background: #d9534f;
        color: white;
        padding: 10px;
        border-radius: 5px;
        font-size: 14px;
        cursor: pointer;
    }
`;

const QuantityControls = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin: 10px 0;

    span {
        font-size: 18px;
        font-weight: bold;
    }
`;

const TotalContainer = styled.div`
    text-align: center;
    font-size: 22px;
    font-weight: bold;
    background: #f8f9fa;
    padding: 15px;
    border-radius: 10px;
    margin-top: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const CheckoutButton = styled(Button)`
    background: #ff8c00;
    color: white;
    padding: 12px 24px;
    font-size: 20px;
    font-weight: bold;
    cursor: pointer;
    margin-top: 10px;
    display: inline-block;
    border-radius: 8px;
    transition: 0.3s;
`;

