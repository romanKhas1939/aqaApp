import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import NavBarComponent from "../components/NavBarComponent";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function CheckoutPage({ setCartCount }) {
  const navigate = useNavigate();
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [cart, setCart] = useState([]);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    if (!isAuthenticated) {
      navigate("/login");
    }

    setTimeout(() => {
      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCart(storedCart);
    }, 1000); // Затримка перед завантаженням товарів
  }, [navigate]);

  const user = JSON.parse(localStorage.getItem("users"))?.[0] || {};
  const totalAmount = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

  const validatePayment = () => {
    if (!paymentDetails.cardNumber.match(/^\d{16}$/)) {
      setErrorMessage("Card number must be 16 digits.");
      return false;
    }
    if (!paymentDetails.expiryDate.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
      setErrorMessage("Expiry date must be in MM/YY format.");
      return false;
    }
    if (!paymentDetails.cvv.match(/^\d{3}$/)) {
      setErrorMessage("CVV must be 3 digits.");
      return false;
    }
    return true;
  };

  const handlePayment = () => {
    setErrorMessage("");
    if (!validatePayment()) return;

    setLoadingPayment(true);
    setTimeout(() => {
      const storedOrders = JSON.parse(localStorage.getItem("orders")) || [];
      const currentEmail = localStorage.getItem("currentUser");

      const newOrder = {
        email: currentEmail,
        date: new Date().toLocaleDateString(),
        total: totalAmount.toFixed(2),
        items: cart,
      };

      const updatedOrders = [...storedOrders, newOrder];
      localStorage.setItem("orders", JSON.stringify(updatedOrders));

      setTimeout(() => {
        localStorage.removeItem("cart");
        setCart([]);
        setCartCount(0);
        localStorage.setItem("cart", JSON.stringify([]));
        window.dispatchEvent(new Event("storage"));
        setOrderConfirmed(true);
        setLoadingPayment(false);
      }, 5000); // Затримка перед підтвердженням платежу
    }, 1500);
  };

  return (
    <Container>
      <NavBarWrapper>
        <NavBarComponent cartCount={cart.length} />
      </NavBarWrapper>
      <Content>
        <CheckoutBox id="checkout-box">
          <h2 id="checkout-title">💳 Checkout</h2>

          {orderConfirmed ? (
            <SuccessMessage id="checkout-success">✅ Payment Successful! Your order is being processed.</SuccessMessage>
          ) : (
            <>
              <h3>Payment Details</h3>
              {errorMessage && <ErrorMessage id="checkout-error">{errorMessage}</ErrorMessage>}
              <StyledInput type="text" placeholder="Card Number (16 digits)" value={paymentDetails.cardNumber} onChange={(e) => setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })} />
              <Row>
                <StyledInput type="text" placeholder="MM/YY" value={paymentDetails.expiryDate} onChange={(e) => setPaymentDetails({ ...paymentDetails, expiryDate: e.target.value })} />
                <StyledInput type="text" placeholder="CVV (3 digits)" value={paymentDetails.cvv} onChange={(e) => setPaymentDetails({ ...paymentDetails, cvv: e.target.value })} />
              </Row>
              <TotalPayment>Total Payment: <strong>${totalAmount.toFixed(2)}</strong></TotalPayment>
              <PayButton onClick={handlePayment}>{loadingPayment ? "Processing..." : "Pay Now"}</PayButton>
            </>
          )}
        </CheckoutBox>
      </Content>
    </Container>
  );
}


// ✅ Стилі
const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    background: #f3f4f6;
`;

const NavBarWrapper = styled.div`
    width: 100%;
`;

const Content = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    flex: 1;
`;

const CheckoutBox = styled.div`
    background: white;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    text-align: center;
    width: 400px;
`;

const InfoBox = styled.div`
    text-align: left;
    background: #f8f9fa;
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 20px;
`;

const StyledInput = styled(Input)`
    width: 100%;
    margin-bottom: 10px;
    padding: 12px;
    font-size: 16px;
`;

const Row = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 10px;
`;

const PayButton = styled(Button)`
    width: 100%;
    background: #22c55e;
    color: white;
    padding: 12px;
    font-size: 18px;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 10px;

    &:hover {
        background: #1eab55;
    }
`;

const SuccessMessage = styled.p`
    color: #22c55e;
    font-size: 18px;
    font-weight: bold;
    margin-top: 20px;
`;

const ErrorMessage = styled.p`
    color: red;
    font-size: 14px;
    margin-bottom: 10px;
`;

const TotalPayment = styled.p`
    font-size: 20px;
    font-weight: bold;
    color: #333;
    margin-top: 15px;
`;
