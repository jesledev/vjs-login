import { useState, useEffect } from "react";
import axios from "axios";

const Dashboard = () => {
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
    });

    // Fetch all users
    useEffect(() => {
        const fetchUsers = async () => {
            const res = await axios.get("http://localhost:5000/users");
            setUsers(res.data);
        };
        fetchUsers();
    }, []);

    // Handle input changes for the form
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle edit button click
    const handleEdit = (user) => {
        setEditingUser(user);
        setFormData(user);
    };

    // Handle form submission for updating
    const handleUpdate = async (e) => {
        e.preventDefault();
        if (editingUser) {
            await axios.put(`http://localhost:5000/users/${editingUser.id}`, formData);
            setUsers((prev) =>
                prev.map((user) =>
                    user.id === editingUser.id ? { ...user, ...formData } : user
                )
            );
            setEditingUser(null);
            setFormData({ firstname: "", lastname: "", email: "", phone: "" });
        }
    };

    // Handle delete button click
    const handleDelete = async (id) => {
        if (window.confirm("Do you really want to delete this user?")) {
            await axios.delete(`http://localhost:5000/users/${id}`);
            setUsers((prev) => prev.filter((user) => user.id !== id));
        }
    };

    return (
        <div>
            <h1>Dashboard</h1>

            <h2>Users</h2>
            <ul>
                {users.map((user) => (
                    <li
                        key={user.id}
                        style={{
                            padding: "10px",
                            borderBottom: "1px solid #ccc",
                            cursor: "pointer",
                        }}
                        onClick={() => setSelectedUserId(user.id === selectedUserId ? null : user.id)}
                    >
                        {user.firstname} {user.lastname} - {user.email} - {user.phone}

                        {/* Boutons Modifier/Supprimer uniquement pour l'utilisateur sélectionné */}
                        {selectedUserId === user.id && (
                            <div style={{ marginTop: "5px" }}>
                                <button onClick={() => handleEdit(user)}>Edit</button>
                                <button onClick={() => handleDelete(user.id)}>Delete</button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>

            {editingUser && (
                <div>
                    <h2>Edit users</h2>
                    <form onSubmit={handleUpdate}>
                        <input
                            name="firstname"
                            placeholder="First name"
                            value={formData.firstname}
                            onChange={handleChange}
                        />
                        <input
                            name="lastname"
                            placeholder="Last name"
                            value={formData.lastname}
                            onChange={handleChange}
                        />
                        <input
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <input
                            name="phone"
                            placeholder="Phone number"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                        <button type="submit">Update</button>
                        <button type="button" onClick={() => setEditingUser(null)}>
                            Cancel
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
