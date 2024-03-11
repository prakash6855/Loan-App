import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, message, Menu, Dropdown } from "antd";
import {
  getAdminDataFromCookie,
  isAdminLoggedIn,
  logout,
} from "../helpers/admin";
import NotFound from "./notFound";
import { useNavigate } from "react-router-dom";
import "../components/css/adminDashboard.css";

function AdminDashboard() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const loggedIn = isAdminLoggedIn();
  if (!loggedIn) {
    return <NotFound />;
  }
  const { userID, token } = getAdminDataFromCookie();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://dwdl1vlt-3000.inc1.devtunnels.ms/user/${userID}/loan/admin`,
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
        if (error?.response && error?.response?.data) {
          message.error(error?.response?.data?.message);
        } else {
          console.error("Error fetching loans:", error);
          message.error("Failed to fetch loans");
          setLoading(false);
        }
      }
    };

    fetchData();
  }, []);

  const handleApproveLoan = async (loanId) => {
    try {
      let userId;
      for (const loan of loans) {
        if (loan.id == loanId) {
          userId = loan.userId;
        }
      }
      const response = await axios.post(
        `https://dwdl1vlt-3000.inc1.devtunnels.ms/user/${userId}/loan/${loanId}?status=APPROVE`,
        {},
        {
          headers: {
            sessiontoken: token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        message.success("Loan approved successfully");
        // After approval, update the loans list
        const updatedLoans = loans.map((loan) => {
          if (loan.id === loanId) {
            return { ...loan, status: "APPROVED" };
          }
          return loan;
        });
        setLoans(updatedLoans);
      } else {
        message.error("Failed to approve loan");
      }
    } catch (error) {
      console.error("Error approving loan:", error);
      if (error.response && error?.response?.data) {
        message.error(error?.response?.data?.message);
      } else {
        message.error("Failed to approve loan");
      }
    }
  };

  const handleRejectLoan = async (loanId) => {
    try {
      let userId;
      for (const loan of loans) {
        if (loan.id == loanId) {
          userId = loan.userId;
        }
      }

      const response = await axios.post(
        `https://dwdl1vlt-3000.inc1.devtunnels.ms/user/${userId}/loan/${loanId}?status=REJECTED`,
        {},
        {
          headers: {
            sessiontoken: token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        message.success("Loan rejected successfully");
        // After rejection, update the loans list
        const updatedLoans = loans.map((loan) => {
          if (loan.id === loanId) {
            return { ...loan, status: "REJECTED" };
          }
          return loan;
        });
        setLoans(updatedLoans);
      } else {
        message.error("Failed to reject loan");
      }
    } catch (error) {
      console.error("Error rejecting loan:", error);
      if (error.response && error?.response?.data) {
        message.error(error?.response?.data?.message);
      } else {
        message.error("Failed to reject loan");
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: "Loan ID",
      dataIndex: "id",
      key: "id",
    },
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
      title: "Action",
      key: "action",
      render: (text, record) => (
        <>
          {record.status === "PENDING" && (
            <>
              <Button
                type="primary"
                onClick={() => handleApproveLoan(record.id)}
                style={{ marginRight: 8 }}
              >
                Approve
              </Button>
              <Button onClick={() => handleRejectLoan(record.id)}>
                Reject
              </Button>
            </>
          )}
        </>
      ),
    },
  ];

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h2>Admin Dashboard</h2>
        <Dropdown overlay={menu} placement="bottomRight">
          <Button type="primary">Account Options</Button>
        </Dropdown>
      </div>
      <Table dataSource={loans} columns={columns} loading={loading} />
    </div>
  );
}

export default AdminDashboard;
