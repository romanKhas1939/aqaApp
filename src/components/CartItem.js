import styled from "styled-components";
import Button from "./ui/Button";

export default function CartItem({ item, increaseQuantity, decreaseQuantity, removeItem }) {
  return (
    <CartContainer>
      <ProductInfo>
        <ProductImage src={item.image || "https://via.placeholder.com/80"} alt={item.name} />
        <ProductText>
          <h3>{item.name}</h3>
          <p>${item.price} x {item.quantity}</p>
        </ProductText>
      </ProductInfo>
      <ActionContainer>
        <QuantityButton onClick={() => decreaseQuantity(item.id)}>-</QuantityButton>
        <Quantity>{item.quantity}</Quantity>
        <QuantityButton onClick={() => increaseQuantity(item.id)}>+</QuantityButton>
        <RemoveButton onClick={() => removeItem(item.id)}>Remove</RemoveButton>
      </ActionContainer>
    </CartContainer>
  );
}

// ✅ **Styled Components**
const CartContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    background-color: #f7f7f7;
`;

const ProductInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
`;

const ProductImage = styled.img`
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 8px;
    border: 1px solid #ddd;
`;

const ProductText = styled.div`
    h3 {
        font-size: 18px;
        font-weight: bold;
        color: #333;
    }
    p {
        color: #666;
    }
`;

const ActionContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const Quantity = styled.span`
  font-size: 18px;
  font-weight: bold;
  padding: 0 8px;
  min-width: 24px;
  text-align: center;
`;

const QuantityButton = styled(Button)`
  background-color: #ddd;
  padding: 8px 12px;
  font-size: 16px;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background-color: #ccc;
  }
`;

const RemoveButton = styled(Button)`
  background-color: #e63946;
  color: white;
  padding: 10px 16px;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background-color: #d62839;
  }
`;
