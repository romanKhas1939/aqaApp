import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

const europeanCountries = [
  "Germany", "France", "Italy", "Spain", "Netherlands", "Belgium", "Sweden",
  "Poland", "Austria", "Switzerland", "Norway", "Denmark", "Finland", "Portugal",
  "Ireland", "Czech Republic", "Hungary", "Greece", "Ukraine"
];

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [zip, setZip] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    if (!firstName || !lastName || !email || !password || !city || !country || !phone || !street || !zip) {
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
    if (!/^\d{5,10}$/.test(zip)) {
      setErrorMessage("ZIP code must be between 5-10 digits.");
      return false;
    }
    if (country === "Ukraine" && !/^\+380\d{9}$/.test(phone)) {
      setErrorMessage("For Ukraine, phone number must start with +380 and have 12 digits.");
      return false;
    }
    if (!/^\+\d{7,15}$/.test(phone)) {
      setErrorMessage("Enter a valid phone number (e.g., +49123456789).");
      return false;
    }
    return true;
  };

  const handleRegister = () => {
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      if (users.some(user => user.email === email)) {
        setErrorMessage("User with this email already exists.");
        setLoading(false);
        return;
      }

      const newUser = { firstName, lastName, email, password, city, country, phone, street, zip };
      const updatedUsers = [...users, newUser];
      localStorage.setItem("users", JSON.stringify(updatedUsers));

      setSuccessMessage("🎉 Registration successful! Redirecting to login...");

      setTimeout(() => navigate("/login"), 3000);
      setLoading(false);
    }, 1500);
  };

  return (
    <Container>
      <RegisterBox>
        <h2 id="register-title">📝 Create an Account</h2>

        {errorMessage && <ErrorMessage id="register-error">{errorMessage}</ErrorMessage>}
        {successMessage && <SuccessMessage id="register-success">{successMessage}</SuccessMessage>}

        <StyledInput id="register-first-name" type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        <StyledInput id="register-last-name" type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        <StyledInput id="register-email" type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
        <StyledInput id="register-password" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <StyledInput id="register-city" type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />

        <StyledSelect id="register-country" value={country} onChange={(e) => setCountry(e.target.value)}>
          <option value="">Select Country</option>
          {europeanCountries.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </StyledSelect>

        <StyledInput id="register-phone" type="text" placeholder={country === "Ukraine" ? "+380XXXXXXXXX" : "Phone (+49123456789)"} value={phone} onChange={(e) => setPhone(e.target.value)} />
        <StyledInput id="register-street" type="text" placeholder="Street and House Number" value={street} onChange={(e) => setStreet(e.target.value)} />
        <StyledInput id="register-zip" type="text" placeholder="ZIP Code" value={zip} onChange={(e) => setZip(e.target.value)} />

        <StyledButton id="register-button" onClick={handleRegister} disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </StyledButton>
      </RegisterBox>
    </Container>
  );
}


// ✅ Стилі
const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background: #f3f4f6;
`;

const RegisterBox = styled.div`
    background: white;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    text-align: center;
    width: 400px;

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

const StyledSelect = styled.select`
    width: 100%;
    margin-bottom: 10px;
    padding: 12px;
    font-size: 16px;
    border: 1px solid #ddd;
    border-radius: 5px;
    background: white;
    cursor: pointer;
`;

const StyledButton = styled(Button)`
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

const SuccessMessage = styled.p`
    color: #22c55e;
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
`;
