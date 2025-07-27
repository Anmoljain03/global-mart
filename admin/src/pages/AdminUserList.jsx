import React, { useEffect, useState } from "react";

const AdminUserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");
    const API_BASE = "http://localhost:4000";

    const fetchUsers = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/user/get-users`, {
                headers: {
                    "Content-Type": "application/json",
                    token,
                },
            });

            const contentType = res.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("Expected JSON, got HTML");
            }

            const data = await res.json();
            if (data.success) {
                setUsers(data.users);
            } else {
                alert(data.message || "Failed to fetch users");
            }
        } catch (err) {
            alert("Error fetching users");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async (userId, currentStatus) => {
        try {
            const res = await fetch(`${API_BASE}/api/user/${userId}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    token,
                },
                body: JSON.stringify({ status: !currentStatus }),
            });

            const data = await res.json();
            if (data.success) {
                fetchUsers(); // Refresh
            } else {
                alert(data.message || "Failed to update status");
            }
        } catch (err) {
            alert("Error updating user status");
            console.error(err);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div style={{ padding: "0.2rem" }}>
            <h2 style={{ marginBottom: "1.5rem" }}>All Users</h2>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ textAlign: "left", borderBottom: "2px solid #ccc" }}>
                            <th style={{ padding: "12px" }}>Name</th>
                            <th style={{ padding: "12px" }}>Email</th>
                            <th style={{ padding: "12px" }}>Phone</th>
                            <th style={{ padding: "12px" }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id} style={{ borderBottom: "1px solid #eee" }}>
                                <td style={{ padding: "12px" }}>{user.name}</td>
                                <td style={{ padding: "12px" }}>{user.email}</td>
                                <td style={{ padding: "12px" }}>{user.phone || "N/A"}</td>
                                <td style={{ padding: "12px" }}>
                                    <button
                                        onClick={() => toggleStatus(user._id, user.status)}
                                        style={{
                                            padding: "6px 14px",
                                            backgroundColor: user.status ? "#e74c3c" : "#2ecc71",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: "5px",
                                            cursor: "pointer",
                                        }}
                                    >
                                        {user.status ? "Disable" : "Enable"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminUserList;
