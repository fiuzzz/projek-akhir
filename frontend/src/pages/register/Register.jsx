// src/pages/Register.jsx
import React, { useState } from "react";
import { Container, Col, Form, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { register } from "../../api/api"; // Impor fungsi register dari api.js
import welDesktop from "../../assets/welcome.svg";
import welMobile from "../../assets/welcome-mobile.svg";
import "./Register.css";

function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false); // Tambahkan state loading untuk menampilkan loading spinner

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Mulai loading

    try {
      const response = await register(form); // Panggil fungsi register
      Swal.fire({
        icon: "success",
        title: "Registrasi Berhasil!",
        text: "Silakan login dengan akun Anda.",
        timer: 2000,
        showConfirmButton: false,
      });
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Registrasi Gagal",
        text: err.response?.data?.message || "Terjadi kesalahan, coba lagi.",
      });
    } finally {
      setLoading(false); // Selesai loading
    }
  };

  return (
    <Container
      fluid
      className="d-flex align-items-center justify-content-center min-vh-100 bg-light"
    >
      <div
        className="shadow-lg rounded-4 overflow-hidden d-flex flex-column flex-md-row w-100 fade-slide-in"
        style={{
          maxWidth: "900px",
          backgroundColor: "white",
          minHeight: "400px",
          height: "auto",
        }}
      >
        {/* Ilustrasi - mobile & tablet */}
        <Col xs={12} className="d-block d-md-none text-center p-4">
          <img
            src={welMobile}
            alt="Register"
            className="img-fluid"
            style={{ maxHeight: "180px" }}
          />
          <h5 className=" mt-3" style={{ color: "#2c5eff" }}>
            Selamat Datang Sahabat
          </h5>
        </Col>

        {/* Formulir */}
        <Col xs={12} md={6} className="p-4 p-md-5">
          <h4 className="mb-4 text-center">Daftar</h4>
          <Form onSubmit={handleSubmit}>
            {step === 1 && (
              <>
                <Form.Group className="mb-3" controlId="firstName">
                  <Form.Label>Nama Depan</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstname"
                    value={form.firstname}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="lastName">
                  <Form.Label>Nama Belakang</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastname"
                    value={form.lastname}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </>
            )}
            {step === 2 && (
              <>
                <Form.Group className="mb-3" controlId="username">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </>
            )}
            {step === 3 && (
              <>
                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Kata Sandi</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="confirmPassword">
                  <Form.Label>Konfirmasi Kata Sandi</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </>
            )}
            <div className="d-flex justify-content-between mt-4">
              {step > 1 && (
                <Button variant="outline-secondary" onClick={prevStep}>
                  Kembali
                </Button>
              )}
              {step < 3 && (
                <Button
                  onClick={nextStep}
                  style={{ backgroundColor: "#2c5eff", border: "none" }}
                >
                  Selanjutnya
                </Button>
              )}
              {step === 3 && (
                <Button
                  type="submit"
                  style={{ backgroundColor: "#2c5eff", border: "none" }}
                  disabled={loading} // Disable tombol saat loading
                >
                  {loading ? "Mendaftar..." : "Daftar"}
                </Button>
              )}
            </div>
          </Form>
        </Col>

        {/* Ilustrasi - desktop */}
        <Col
          md={6}
          className="d-none d-md-flex align-items-center justify-content-center"
          style={{ backgroundColor: "#2c5eff" }}
        >
          <div className="text-center p-4">
            <img
              src={welDesktop}
              alt="Register"
              className="img-fluid"
              style={{ maxHeight: "240px" }}
            />
            <h5 className="text-white mt-3">Selamat Datang Sahabat</h5>
          </div>
        </Col>
      </div>
    </Container>
  );
}

export default Register;
