import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../components/css/AdminLogin.scss";

function UserLogin() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    try {
      setLoading(true);
      const response = await axios.post(
        "https://dwdl1vlt-3000.inc1.devtunnels.ms/user/login",
        values
      );

      if (response.status === 200) {
        // Save token and user ID in cookie
        document.cookie = `token=${response.data.token}`;
        document.cookie = `userID=${response.data.userID}`;
        document.cookie = `isAdmin=${false}`;
        // Redirect to dashboard or desired route
        // Navigate to dashboard or desired route
        // Example: navigate('/dashboard');
        message.success("Login successful");
        navigate("/");
      } else {
        message.error("Login failed");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        message.error("Invalid Credentials");
      } else {
        console.error("Error logging in:", error);
        message.error("Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <h2>User Login</h2>
      <Form onFinish={handleLogin}>
        <Form.Item
          name="username"
          rules={[{ required: true, message: "Please enter your username" }]}
        >
          <Input placeholder="Username" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please enter your password" }]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default UserLogin;
