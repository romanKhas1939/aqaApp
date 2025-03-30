import styled from "styled-components";
import Button from "./ui/Button";

export default function ProductCard({ product, addToCart }) {
  return (
    <Card>
      <ProductName>{product.name}</ProductName>
      <ProductPrice>${product.price}</ProductPrice>
      <AddToCartButton onClick={() => addToCart(product)}>Add to Basket</AddToCartButton>
    </Card>
  );
}

// Styled-components
const Card = styled.div`
  border: 1px solid #ddd;
  padding: 16px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProductName = styled.h2`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #333;
`;

const ProductPrice = styled.p`
  font-size: 16px;
  color: #666;
  margin-bottom: 10px;
`;

const AddToCartButton = styled(Button)`
  background: #22c55e;
  color: white;
  padding: 10px 16px;
  font-size: 14px;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background: #1eab55;
  }
`;

