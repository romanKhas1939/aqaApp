import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { DEMO_USER } from "../demoUser";

export default function LoginPage({ setIsAuthenticated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const users = JSON.parse(localStorage.getItem("users")) || [];

  const validateForm = () => {
    if (!email || !password) {
      setErrorMessage("All fields are required.");
      return false;
    }
    // Демо-логін `admin` навмисно не є email, тож для нього перевірку пропускаємо.
    if (email !== DEMO_USER.email && !/\S+@\S+\.\S+/.test(email)) {
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

  const handleFillDemo = () => {
    setErrorMessage("");
    setEmail(DEMO_USER.email);
    setPassword(DEMO_USER.password);
  };

  return (
    <Container>
      <DemoHint id="login-demo-hint">
        <h3>👋 Demo account</h3>
        <p>No registration needed:</p>
        <DemoRow>
          <DemoLabel>Login</DemoLabel>
          <DemoValue id="login-demo-email">{DEMO_USER.email}</DemoValue>
        </DemoRow>
        <DemoRow>
          <DemoLabel>Password</DemoLabel>
          <DemoValue id="login-demo-password">{DEMO_USER.password}</DemoValue>
        </DemoRow>
        <DemoFillButton id="login-demo-fill" type="button" onClick={handleFillDemo}>
          Use demo account
        </DemoFillButton>
      </DemoHint>

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
    min-height: 100vh;
    padding: 20px;
    background: #f3f4f6;
    position: relative;
`;

const LoginBox = styled.div`
    background: white;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    text-align: center;
    /* 410px = попередні 350px вмісту + 2×30px падінгів: із border-box
       ширина на десктопі лишається тією самою, але на вузькому екрані
       коробка стискається замість того, щоб вилазити за край. */
    box-sizing: border-box;
    width: 410px;
    max-width: 100%;

    h2 {
        font-size: 24px;
        margin-bottom: 20px;
        color: #333;
    }
`;

// Абсолютне позиціонування — щоб підказка не зсувала форму з центра екрана.
const DemoHint = styled.aside`
    position: absolute;
    left: 32px;
    top: 50%;
    transform: translateY(-50%);
    background: white;
    padding: 16px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    border-left: 3px solid #22c55e;
    box-sizing: border-box;
    width: 235px;
    max-width: 100%;
    text-align: left;

    h3 {
        font-size: 15px;
        margin: 0 0 6px;
        color: #333;
    }

    p {
        font-size: 12px;
        color: #666;
        margin: 0 0 12px;
        line-height: 1.4;
    }

    /* Місця для колонки збоку вже немає — повертаємо підказку в потік над формою. */
    @media (max-width: 1050px) {
        position: static;
        transform: none;
        width: 410px;
        margin-bottom: 20px;
    }
`;

const DemoRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 6px;
`;

const DemoLabel = styled.span`
    font-size: 12px;
    color: #666;
`;

// user-select: all — один клік виділяє значення цілком, щоб зручно копіювати.
const DemoValue = styled.code`
    font-family: monospace;
    font-size: 13px;
    font-weight: bold;
    color: #166534;
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-radius: 4px;
    padding: 3px 6px;
    user-select: all;
    cursor: text;
`;

const DemoFillButton = styled(Button)`
    width: 100%;
    background: white;
    color: #22c55e;
    border: 1px solid #22c55e;
    padding: 8px;
    font-size: 12px;
    font-weight: bold;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 10px;

    &:hover {
        background: #22c55e;
        color: white;
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
