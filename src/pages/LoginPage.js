import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function LoginPage({ setIsAuthenticated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const users = JSON.parse(localStorage.getItem("users")) || [
    { email: "test@example.com", password: "password123" }
  ];

  const validateForm = () => {
    if (!email || !password) {
      setErrorMessage("All fields are required.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      return false;
    }
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return false;
    }
    return true;
  };

  const handleLogin = () => {
    setErrorMessage("");
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    setTimeout(() => {
      const userExists = users.find(user => user.email === email && user.password === password);
      if (userExists) {
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("currentUser", email);
        setIsAuthenticated(true);

        const redirectPath = localStorage.getItem("redirectAfterLogin") || "/";
        localStorage.removeItem("redirectAfterLogin");
        navigate(redirectPath);
      } else {
        setErrorMessage("Incorrect email or password!");
      }
      setLoading(false);
    }, 1500);
  };

  const handleRegisterRedirect = () => {
    navigate("/register");
  };

  return (
    <Container>
      <LoginBox>
        <h2 id="login-title">🔑 Login to Your Account</h2>

        {errorMessage && <ErrorMessage id="login-error">{errorMessage}</ErrorMessage>}

        <StyledInput
          id="login-email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <StyledInput
          id="login-password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <StyledButton id="login-button" onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </StyledButton>
        <RegisterButton id="login-register-button" onClick={handleRegisterRedirect}>Register</RegisterButton>
      </LoginBox>
      <Footer>
        This application was developed by Khas Roman as part of the "AQA for Beginners: Practical Testing with Playwright + JavaScript" course. All rights reserved. If you encounter this application outside the intended course context, it may have been shared without the author's consent. For any inquiries, please contact Khas Roman at <a href="mailto:romakhasss@gmail.com">romakhasss@gmail.com</a> or via <a href="https://www.linkedin.com/in/roman-khas-64b10b194" target="_blank" rel="noopener noreferrer">LinkedIn</a>.
      </Footer>
    </Container>
  );
}

// ✅ Стилі
const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background: #f3f4f6;
`;

const LoginBox = styled.div`
    background: white;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    text-align: center;
    width: 350px;

    h2 {
        font-size: 24px;
        margin-bottom: 20px;
        color: #333;
    }
`;

const StyledInput = styled(Input)`
    width: 100%;
    margin-bottom: 10px;
    padding: 12px;
    font-size: 16px;
    border: 1px solid #ddd;
    border-radius: 5px;
`;

const StyledButton = styled(Button)`
    width: 100%;
    background: #22c55e;
    color: white;
    padding: 12px;
    font-size: 16px;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 10px;

    &:hover {
        background: #1eab55;
    }
`;

const RegisterButton = styled(Button)`
    width: 100%;
    background: #007bff;
    color: white;
    padding: 12px;
    font-size: 16px;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 10px;

    &:hover {
        background: #0056b3;
    }
`;

const ErrorMessage = styled.p`
    color: red;
    font-size: 14px;
    margin-bottom: 10px;
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
