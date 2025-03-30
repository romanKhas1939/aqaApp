import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import NavBarComponent from "../components/NavBarComponent";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function AccountPage({ cartCount, setCartCount }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
      const currentEmail = localStorage.getItem("currentUser");

      if (!isAuthenticated || !currentEmail) {
        navigate("/login");
      } else {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const currentUser = users.find(user => user.email === currentEmail);

        if (currentUser) {
          setUser(currentUser);
          setEditedUser(currentUser);

          setTimeout(() => {
            const allOrders = JSON.parse(localStorage.getItem("orders")) || [];
            const userOrders = allOrders.filter(order => order.email === currentEmail);
            setOrders(userOrders);

            const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
            setCartCount(storedCart.length);
          }, 1000);
        } else {
          navigate("/login");
        }
      }
      setLoading(false);
    }, 1500);
  }, [navigate, setCartCount]);

  const handleLogout = () => {
    setTimeout(() => {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("currentUser");
      navigate("/login");
    }, 1000);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
  };

  const handleSaveChanges = () => {
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const updatedUsers = users.map(u => (u.email === editedUser.email ? editedUser : u));
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      setUser(editedUser);
      setIsEditing(false);
    }, 800);
  };

  return (
    <Container>
      <NavBarComponent cartCount={cartCount} />
      <Content>
        <h1>👤 My Account</h1>
        {loading ? (
          <LoadingMessage>Loading...</LoadingMessage>
        ) : user ? (
          <ProfileSection>
            <HeaderRow>
              <h2>Personal Information</h2>
              {!isEditing && <EditButton onClick={handleEditToggle} id="account-edit-button">Edit</EditButton>}
            </HeaderRow>
            {isEditing ? (
              <FormContainer>
                <StyledInput id="account-input-firstname" type="text" name="firstName" value={editedUser.firstName} onChange={handleInputChange} />
                <StyledInput id="account-input-lastname" type="text" name="lastName" value={editedUser.lastName} onChange={handleInputChange} />
                <StyledInput id="account-input-phone" type="text" name="phone" value={editedUser.phone} onChange={handleInputChange} />
                <StyledInput id="account-input-street" type="text" name="street" value={editedUser.street} onChange={handleInputChange} />
                <StyledInput id="account-input-city" type="text" name="city" value={editedUser.city} onChange={handleInputChange} />
                <StyledInput id="account-input-zip" type="text" name="zip" value={editedUser.zip} onChange={handleInputChange} />
                <ButtonContainer>
                  <SaveButton id="account-save-button" onClick={handleSaveChanges}>Save</SaveButton>
                  <CancelButton id="account-cancel-button" onClick={handleEditToggle}>Cancel</CancelButton>
                </ButtonContainer>
              </FormContainer>
            ) : (
              <InfoContainer>
                <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Phone:</strong> {user.phone}</p>
                <p><strong>Address:</strong> {user.street}, {user.city}, {user.country}</p>
                <p><strong>ZIP Code:</strong> {user.zip}</p>
              </InfoContainer>
            )}
            <LogoutButton id="account-logout-button" onClick={handleLogout}>Logout</LogoutButton>
          </ProfileSection>
        ) : (
          <LoadingMessage>Error loading account details.</LoadingMessage>
        )}
        <OrdersSection>
          <h2>📦 My Orders</h2>
          {orders.length === 0 ? (
            <p>You have not made any orders yet.</p>
          ) : (
            orders.map((order, index) => (
              <OrderCard key={index} id={`account-order-${index}`}>
                <h3>Order #{index + 1}</h3>
                <p><strong>Date:</strong> {order.date}</p>
                <p><strong>Total Amount:</strong> ${order.total}</p>
                <p><strong>Items:</strong></p>
                <ul>
                  {order.items.map((item, i) => (
                    <li key={i}>{item.name} - ${item.price} x {item.quantity}</li>
                  ))}
                </ul>
              </OrderCard>
            ))
          )}
        </OrdersSection>
        <Footer>
          This application was developed by Khas Roman as part of the "AQA for Beginners: Practical Testing with Playwright + JavaScript" course. All rights reserved. If you encounter this application outside the intended course context, it may have been shared without the author's consent. For any inquiries, please contact Khas Roman at <a href="mailto:romakhasss@gmail.com">romakhasss@gmail.com</a> or via <a href="https://www.linkedin.com/in/roman-khas-64b10b194" target="_blank" rel="noopener noreferrer">LinkedIn</a>.
        </Footer>
      </Content>
    </Container>
  );
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    background: #f3f4f6;
`;

const Content = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 900px;
    padding: 20px;
`;

const ProfileSection = styled.div`
    background: #f8f9fa;
    padding: 15px;
    border-radius: 10px;
    margin-bottom: 20px;
    width: 100%;
`;

const HeaderRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const FormContainer = styled.div`
    text-align: left;
`;

const InfoContainer = styled.div`
    text-align: left;
`;

const StyledInput = styled(Input)`
    width: 100%;
    margin-bottom: 10px;
    padding: 12px;
    font-size: 16px;
    border: 1px solid #ddd;
    border-radius: 5px;
`;

const EditButton = styled(Button)`
    background: #007bff;
    color: white;
    padding: 10px 15px;
    font-size: 14px;
    border-radius: 6px;
    cursor: pointer;
    &:hover {
        background: #0056b3;
    }
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: space-evenly;
    margin-top: 15px;
`;

const SaveButton = styled(Button)`
    background: #28a745;
    color: white;
    padding: 12px 25px;
    font-size: 16px;
    border-radius: 6px;
    cursor: pointer;
`;

const CancelButton = styled(Button)`
    background: #6c757d;
    color: white;
    padding: 12px 25px;
    font-size: 16px;
    border-radius: 6px;
    cursor: pointer;
`;

const LogoutButton = styled(Button)`
    background: #d9534f;
    color: white;
    padding: 14px 30px;
    font-size: 18px;
    border-radius: 8px;
    cursor: pointer;
    display: block;
    margin: 20px auto 0;
`;

const OrdersSection = styled.div`
    background: white;
    padding: 25px;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 900px;
    margin-top: 20px;
`;

const OrderCard = styled.div`
    border-bottom: 1px solid #ddd;
    padding: 15px;
    &:last-child {
        border-bottom: none;
    }
`;

const LoadingMessage = styled.p`
    text-align: center;
    font-size: 18px;
    color: #666;
`;

const Footer = styled.footer`
  font-size: 13px;
  color: #777;
  margin-top: 40px;
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
