import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UserSignUp() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (values) => {
    try {
      setLoading(true);
      const response = await axios.post(
        "https://dwdl1vlt-3000.inc1.devtunnels.ms/user/sign_up",
        values
      );

      if (response.status === 201) {
        message.success("User Created Successfully");
      } else {
        message.error("Failed to create user");
      }
    } catch (error) {
      console.error("Error signing up:", error);
      message.error("Failed to create user");
    } finally {
      setLoading(false);
      navigate("/");
    }
  };

  return (
    <div className="admin-login-container">
      <h2>User Sign Up</h2>
      <Form onFinish={handleSignUp}>
        <Form.Item
          name="name"
          rules={[{ required: true, message: "Please enter your name" }]}
        >
          <Input placeholder="Name" />
        </Form.Item>
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
            Sign Up
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default UserSignUp;
