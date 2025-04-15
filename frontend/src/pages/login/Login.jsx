// src/pages/Login.jsx
import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../api/api";
import welDesktop from "../../assets/welcome.svg";
import welMobile from "../../assets/welcome-mobile.svg";
import Swal from "sweetalert2";
import "./Login.css";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData);
      Swal.fire({
        icon: "success",
        title: "Login Berhasil",
        timer: 1500,
        showConfirmButton: false,
      });
      navigate("/dashboard"); // Ganti dengan rute yang sesuai
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Gagal Login",
        text: err?.response?.data?.message || "Terjadi kesalahan",
      });
    }
  };

  return (
    <Container
      fluid
      className="login-container d-flex align-items-center justify-content-center min-vh-100 bg-light"
    >
      <div
        className="login-card shadow rounded-4 overflow-hidden w-100 fade-slide-in"
        style={{ maxWidth: "900px" }}
      >
        <Row className="g-0 flex-column-reverse flex-md-row">
          {/* Ilustrasi Desktop */}
          <Col
            md={6}
            className="text-white d-none d-md-flex align-items-center justify-content-center p-4"
            style={{ backgroundColor: "#2c5eff" }}
          >
            <div className="text-center">
              <img
                src={welDesktop}
                alt="Welcome"
                className="img-fluid mb-3"
                style={{ maxHeight: "220px" }}
              />
              <h4 className="fw-semibold">Selamat Datang Sahabat</h4>
            </div>
          </Col>

          {/* Form Login */}
          <Col
            xs={12}
            md={6}
            className="bg-white p-4 p-md-5 d-flex align-items-center justify-content-center"
          >
            <div className="w-100">
              {/* Ilustrasi Mobile */}
              <div className="d-block d-md-none text-center mb-3">
                <img
                  src={welMobile}
                  alt="Welcome"
                  className="img-fluid mb-2"
                  style={{ maxHeight: "180px" }}
                />
                <h5 style={{ Color: "#2c5eff" }}>
                  Selamat Datang Sahabat
                </h5>
              </div>

              <h4 className="mb-4 text-center">Login</h4>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Masukkan email"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Kata Sandi</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Masukkan kata sandi"
                    required
                  />
                </Form.Group>

                <div className="d-flex justify-content-between flex-wrap gap-2 mb-3">
                  <Link
                    to="/fksku"
                    className="text-decoration-none"
                    style={{ color: "#2c5eff" }}
                  >
                    Lupa kata sandi?
                  </Link>
                  <Link
                    to="/register"
                    className="text-decoration-none"
                    style={{ color: "#2c5eff" }}
                  >
                    Belum punya akun?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-100"
                  style={{ backgroundColor: "#2c5eff" }}
                >
                  Masuk
                </Button>
              </Form>
            </div>
          </Col>
        </Row>
      </div>
    </Container>
  );
}

export default Login;
