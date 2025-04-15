import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const dummyOtp = "123456";

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setStep(2);
    Swal.fire({
      icon: "info",
      title: "Kode OTP telah dikirim",
      text: "Gunakan kode OTP dummy: 123456",
      timer: 2500,
      showConfirmButton: false,
    });
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (otp === dummyOtp) {
      Swal.fire({
        icon: "success",
        title: "Verifikasi Berhasil!",
        text: "Silakan login kembali.",
        timer: 2000,
        showConfirmButton: false,
      });
      setTimeout(() => navigate("/login"), 2000);
    } else {
      Swal.fire({
        icon: "error",
        title: "OTP Salah!",
        text: "Silakan coba lagi.",
      });
    }
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center min-vh-100 bg-light"
    >
      <Card
        style={{ maxWidth: "420px", width: "100%" }}
        className="p-4 shadow rounded-4"
      >
        <h4 className="text-center mb-4">
          {step === 1 ? "Lupa Kata Sandi" : "Verifikasi OTP"}
        </h4>
        <Form onSubmit={step === 1 ? handleEmailSubmit : handleOtpSubmit}>
          {step === 1 ? (
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="masukkan email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
          ) : (
            <Form.Group className="mb-3" controlId="otp">
              <Form.Label>Kode OTP</Form.Label>
              <Form.Control
                type="text"
                placeholder="masukkan kode OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <Form.Text className="text-muted">
                OTP dummy: <strong>123456</strong>
              </Form.Text>
            </Form.Group>
          )}

          <Button
            type="submit"
            className="w-100 mt-3"
            style={{ backgroundColor: "#2c5eff", border: "none" }}
          >
            {step === 1 ? "Kirim OTP" : "Verifikasi"}
          </Button>
        </Form>
      </Card>
    </Container>
  );
}

export default ForgotPassword;
