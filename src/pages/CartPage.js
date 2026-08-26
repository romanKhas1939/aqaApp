import styled from "styled-components";
import Button from "../components/ui/Button";
import { useNavigate } from "react-router-dom";
import NavBarComponent from "../components/NavBarComponent";
import { useState } from "react";

export default function CartPage({ cart, setCart }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingProductId, setLoadingProductId] = useState(null);
  const [pendingRemoval, setPendingRemoval] = useState(null); // товар, для якого відкрито модалку
  const [removing, setRemoving] = useState(false);

  // ✅ Захист від `undefined`
  const safeCart = Array.isArray(cart) ? cart : [];

  const handleProceedToCheckout = () => {
    setLoading(true);

    setTimeout(() => {
      const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

      if (isAuthenticated) {
        navigate("/checkout");
      } else {
        // Позначку ставимо лише коли справді відправляємо на логін — інакше вона
        // лишалася б у сховищі назавжди й кидала на /checkout після будь-якого входу.
        localStorage.setItem("redirectAfterLogin", "/checkout");
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

  // Видалення підтверджується в модалці: клік по "Remove from Cart" лише відкриває її.
  const handleRemoveClick = (product) => {
    setPendingRemoval(product);
  };

  const handleCancelRemoval = () => {
    if (removing) return; // під час видалення закривати нічим
    setPendingRemoval(null);
  };

  const handleConfirmRemoval = () => {
    if (!pendingRemoval) return;
    const productId = pendingRemoval.id;
    setRemoving(true);

    setTimeout(() => {
      setCart((prevCart) => {
        const updatedCart = prevCart.filter((item) => item.id !== productId);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        window.dispatchEvent(new Event("storage")); // 🔄 Оновлюємо кошик у NavBar
        return updatedCart;
      });

      setRemoving(false);
      setPendingRemoval(null);
    }, 1500); // Затримка 1.5 секунди перед видаленням товару
  };

  const totalAmount = safeCart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  return (
    <Container>
      <NavBarComponent cartCount={safeCart.length} />

      <Header>
        <h1 id="cart-title">🛒 Your Shopping Cart</h1>
      </Header>

      {safeCart.length === 0 ? (
        <EmptyMessage id="cart-empty-message">Your cart is empty.</EmptyMessage>
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
                    onClick={() => handleRemoveClick(product)}
                    id={`cart-item-remove-${product.id}`}
                    disabled={loading && loadingProductId === product.id}
                  >
                    Remove from Cart
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

      {pendingRemoval && (
        <ModalOverlay id="cart-remove-modal" onClick={handleCancelRemoval}>
          <ModalBox
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-remove-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="cart-remove-modal-title">Remove item?</h2>
            <p id="cart-remove-modal-text">
              Are you sure you want to remove <strong>{pendingRemoval.name}</strong> from your cart?
            </p>
            <ModalActions>
              <CancelButton
                id="cart-remove-cancel"
                type="button"
                onClick={handleCancelRemoval}
                disabled={removing}
              >
                Cancel
              </CancelButton>
              <ConfirmButton
                id="cart-remove-confirm"
                type="button"
                onClick={handleConfirmRemoval}
                disabled={removing}
              >
                {removing ? "Removing..." : "Yes, remove"}
              </ConfirmButton>
            </ModalActions>
          </ModalBox>
        </ModalOverlay>
      )}
    </Container>
  );
}

// ✅ **Стилі**
const ModalOverlay = styled.div`
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    z-index: 1000;
`;

const ModalBox = styled.div`
    background: white;
    border-radius: 10px;
    padding: 24px;
    width: 400px;
    max-width: 100%;
    box-sizing: border-box;
    text-align: center;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);

    h2 {
        font-size: 20px;
        margin: 0 0 12px;
        color: #333;
    }

    p {
        font-size: 15px;
        color: #666;
        margin: 0 0 20px;
        line-height: 1.5;
    }
`;

const ModalActions = styled.div`
    display: flex;
    gap: 12px;
    justify-content: center;
`;

const CancelButton = styled(Button)`
    background: white;
    color: #666;
    border: 1px solid #ddd;
    padding: 10px 20px;
    font-size: 15px;
    border-radius: 5px;
    cursor: pointer;

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const ConfirmButton = styled(Button)`
    background: #d9534f;
    color: white;
    padding: 10px 20px;
    font-size: 15px;
    border-radius: 5px;
    cursor: pointer;

    &:disabled {
        background: #ccc;
        cursor: not-allowed;
    }
`;

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

