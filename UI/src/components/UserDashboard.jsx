import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  Tag,
  Button,
  Menu,
  Dropdown,
  Form,
  Input,
  message,
  InputNumber,
} from "antd";
import { getUserDataFromCookie, isUserLoggedIn, logout } from "../helpers/user";
import NotFound from "./notFound";
import { useNavigate } from "react-router-dom";
import "../components/css/userDashboard.css";

function UserDashboard() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [paymentAmount, setRepaymentAmount] = useState(0);

  const loggedIn = isUserLoggedIn();
  if (!loggedIn) {
    return <NotFound />;
  }

  const { userID, token } = getUserDataFromCookie();
  const fetchLoans = async () => {
    try {
      const response = await axios.get(
        `https://dwdl1vlt-3000.inc1.devtunnels.ms/user/${userID}/loan`,
        {
          headers: {
            sessiontoken: token,
            "Content-Type": "application/json",
          },
        }
      );
      setLoans(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching loans:", error);
      setError("Error fetching loans");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, [userID, token]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleNewLoan = async (values) => {
    try {
      const response = await axios.post(
        `https://dwdl1vlt-3000.inc1.devtunnels.ms/user/${userID}/loan`,
        values,
        {
          headers: {
            sessiontoken: token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        message.success("Loan requested successfully");
        // Fetch loans again to update the list
        fetchLoans();
        form.resetFields();
      } else {
        message.error("Failed to request loan");
      }
    } catch (error) {
      console.error("Error requesting loan:", error);
      message.error("Failed to request loan");
    }
  };

  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  const handleRepaymentAmountChange = (value) => {
    setRepaymentAmount(value);
  };

  const handleRepayment = async (loanId) => {
    try {
      const response = await axios.post(
        `https://dwdl1vlt-3000.inc1.devtunnels.ms/user/${userID}/loan/${loanId}/repayment`,
        { amount: paymentAmount },
        {
          headers: {
            sessiontoken: token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        message.success("Loan repayment successful");
        // Fetch loans again to update the list
        fetchLoans();
      } else {
        message.error("Failed to repay loan");
      }
    } catch (error) {
      console.error("Error repaying loan:", error);
      if (error.response && error.response.data) {
        message.error(error.response.data.message);
      } else {
        message.error("Failed to repay loan");
      }
    }
  };

  const columns = [
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
    },
    {
      title: "Term",
      dataIndex: "term",
      key: "term",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Repayments",
      key: "repayments",
      width: "40%",
      render: (text, record) => (
        <ul>
          {record.Repayments.map((repayment) => (
            <li key={repayment.id}>
              Amount: {repayment.amount}, Status:{" "}
              <Tag color={repayment.status === "PAID" ? "green" : "red"}>
                {repayment.status}
              </Tag>
              {repayment.status === "PENDING" && (
                <>
                  <InputNumber
                    min={repayment.amount}
                    defaultValue={repayment.amount}
                    onChange={handleRepaymentAmountChange}
                  />
                  <Button onClick={() => handleRepayment(record.id)}>
                    Repay
                  </Button>
                </>
              )}
              <br />
              Date: {repayment.dateToBeRepaid}
            </li>
          ))}
        </ul>
      ),
    },
  ];

  return (
    <div className="user-dashboard">
      <div className="user-header">
        <h2>User Dashboard</h2>
        <Dropdown overlay={menu} placement="bottomRight">
          <Button type="primary">Account Options</Button>
        </Dropdown>
      </div>
      <Form form={form} onFinish={handleNewLoan} layout="inline">
        <Form.Item
          name="amount"
          rules={[{ required: true, message: "Please enter the loan amount" }]}
        >
          <Input placeholder="Loan Amount" />
        </Form.Item>
        <Form.Item
          name="term"
          rules={[{ required: true, message: "Please enter the loan term" }]}
        >
          <Input placeholder="Loan Term" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Request New Loan
          </Button>
        </Form.Item>
      </Form>
      <Table
        dataSource={loans}
        columns={columns}
        size="middle"
        bordered="true"
        loading={loading}
      />
    </div>
  );
}

export default UserDashboard;
