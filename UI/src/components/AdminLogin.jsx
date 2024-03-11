import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../components/css/AdminLogin.scss";

function AdminLogin() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    try {
      setLoading(true);
      const response = await axios.post(
        "https://dwdl1vlt-3000.inc1.devtunnels.ms/user/admin/login",
        values
      );

      if (response.status === 200) {
        const data = response.data;
        // Save token and user ID in cookie
        document.cookie = `token=${data.token}`;
        document.cookie = `userID=${data.userID}`;
        document.cookie = `isAdmin=${true}`;
        // Redirect to dashboard or desired route
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
      <h2>Admin Login</h2>
      <Form onFinish={handleLogin} size="medium">
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


export default AdminLogin;
