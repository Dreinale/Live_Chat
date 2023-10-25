import React, {useEffect, useState} from "react";
import Modal from "../Modal"; // Importez votre composant Modal
import "../../css/components/UserManagerAdmin.css";
import {getAllUsersRoles, getUsers, registerUser, deleteUsers, updateUser} from "../../services/Api";

const UserManagerAdmin = () => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [editModalIsOpen, setEditModalIsOpen] = useState(false);
    const [editUser, setEditUser] = useState();

    /*
    const [selectedRoles, setSelectedRoles] = useState([]);
    */
    const [users, setUsers] = useState([]);
    const [userRoles, setUserRoles] = useState([]);
    const [newUser, setNewUser] = useState({username: '', email: '', password: ''});

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const handleInputChange = (event) => {
        setNewUser({...newUser, [event.target.name]: event.target.value});
    }

    const handleSubmit = async (event) => {
        event.preventDefault(); // empêcher le rechargement de la page

        try {
            await registerUser(newUser.email, newUser.password, newUser.username);
            // alert('User registered successfully');
            // rafraîchir la liste des utilisateurs ici

            closeModal();
        } catch (error) {
            alert('An error occurred while registering the user');
            console.error(error);
        }
    }

    function openModal() {
        setModalIsOpen(true);
    }

    function openEditModal(user) {
        setEditUser(user);
        setEditModalIsOpen(true);
    }

    function closeEditModal() {
        setEditModalIsOpen(false);
    }


    function closeModal() {
        setModalIsOpen(false);
    }

    /*
    function handleEditRoleSelection(role) {
        if (selectedRoles.includes(role)) {
            setSelectedRoles(selectedRoles.filter(selectedRole => selectedRole !== role));
        } else {
            setSelectedRoles([...selectedRoles, role]);
        }
    }
    */

    const handleDelete = async (userId) => {
        try {
            await deleteUsers(userId);
            // rafraîchir la liste des utilisateurs ici
            const result = await getUsers(); // Appelez votre fonction pour obtenir les utilisateurs
            setUsers(result.data.users); // Mettez à jour l'état avec le résultat
        } catch (error) {
            alert('An error occurred while deleting the user');
            console.error(error);
        }
    }

    const handleEditSubmit = async (event) => {
        event.preventDefault(); // empêcher le rechargement de la page

        try {
            // Mise à jour de l'utilisateur ici
            await updateUser(editUser._id, editUser.username, editUser.email, editUser.password);
            //...
            closeEditModal();
        } catch (error) {
            alert('An error occurred while updating the user');
            console.error(error);
        }
    }


    function handleEditInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        if (target.type === 'checkbox') {
            if (value) {
                // si la case est cochée, ajoutez le rôle à la liste
                setEditUser(prevState => ({
                    ...prevState,
                    roles: Array.isArray(prevState.roles) ? [...prevState.roles, target.value] : [target.value]
                }));
            } else {
                // si la case n'est pas cochée, supprimez le rôle de la liste
                setEditUser(prevState => ({
                    ...prevState,
                    roles: Array.isArray(prevState.roles) ? prevState.roles.filter(role => role !== target.value) : []
                }));
            }
        } else {
            setEditUser(prevState => ({ ...prevState, [name]: value }));
        }
    }






    // get all users by calling the getUsers function and store the result in the users variable

    useEffect(() => {
        async function fetchUsers() {
            try {
                const result = await getUsers(page, 5); // Appelez votre fonction pour obtenir les utilisateurs
                setUsers(result.data.users); // Mettez à jour l'état avec le résultat
                setTotalPages(result.data.pages);
            } catch (error) {
                console.error("An error occurred while fetching users:", error);
            }
        }

        fetchUsers(); // Appelez la fonction
    }, [page]);

    useEffect(() => {
        async function fetchUserRoles() {
            try {
                const result = await getAllUsersRoles(); // Call your function to get the user roles
                setUserRoles(result.data.userRoles); // Update the state with the result
            } catch (error) {
                console.error("An error occurred while fetching user roles:", error);
            }
        }

        fetchUserRoles(); // Call the function
    }, []);

    return (
        <div className="admin-panel">
            <h1>Admin Panel</h1>
            <div className="user-management">
                <h2>User Management</h2>
                <button onClick={openModal}>Create User</button>
                <table className="scrollable-table">

                    <thead>
                    <tr>
                        <th>Username</th>
                        <th>Role</th>
                        <th>Email</th>
                        <th>Created At</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((user, index) => {
                        const userRoleObject = userRoles.find(userRole => userRole.username === user.username);
                        const roles = userRoleObject ? userRoleObject.roles : [];
                        return (
                            <tr key={index}>
                                <td>{user.username}</td>
                                <td>
                                    <select className="role-dropdown">
                                        {roles.map((role, i) => <option key={i} value={role}>{role}</option>)}
                                    </select>
                                </td>
                                <td>{user.email}</td>
                                <td>{new Date(user.createdAt).toLocaleDateString('fr-FR')}</td>
                                <td>
                                    <button onClick={() => openEditModal(user)}>Edit</button>

                                    <button onClick={() => handleDelete(user._id)}>Delete</button>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>



                </table>
                <div className="pagination">
                    <button className="Previous-button" onClick={() => setPage(page => Math.max(page - 1, 1))}>Previous Page</button>
                    <p>Page {page} of {totalPages}</p>
                    <button className="Next-button" onClick={() => setPage(page => Math.min(page + 1, totalPages))}>Next Page</button>
                </div>
            </div>

            <Modal isOpen={modalIsOpen} onClose={closeModal} title="Create User">
                <h2>Create User</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="username">Username:</label><br />
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={newUser.username}
                        onChange={handleInputChange}
                    /><br />

                    <label htmlFor="email">Email:</label><br />
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={newUser.email}
                        onChange={handleInputChange}
                    /><br />

                    <label htmlFor="password">Password:</label><br />
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={newUser.password}
                        onChange={handleInputChange}
                    /><br />
                    <input type="submit" value="Create" />
                </form>
            </Modal>

            <Modal isOpen={editModalIsOpen} onClose={closeEditModal} title="Edit User">
                <form onSubmit={handleEditSubmit}>
                    <label htmlFor="username">Username:</label><br />
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={editUser ? editUser.username : ''}
                        onChange={handleEditInputChange}
                    /><br />

                    <label htmlFor="email">Email:</label><br />
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={editUser ? editUser.email : ''}
                        onChange={handleEditInputChange}
                    /><br />

                    <label htmlFor="password">Password:</label><br />
                    <input
                        type="password"
                        id="password"
                        name="password"
                        onChange={handleEditInputChange}
                        placeholder="Entrez un nouveau mot de passe"
                    /><br />
                    <label htmlFor="roles">Roles:</label><br />
                    <div id="roles" onChange={handleEditInputChange} >
                        <input
                            type="checkbox"
                            id="admin"
                            name="roles"
                            value="admin"
                            checked={editUser && editUser.roles && editUser.roles.includes("admin")}
                        />
                        <label htmlFor="admin">Admin</label><br />
                        <input
                            type="checkbox"
                            id="user"
                            name="roles"
                            value="user"
                            checked={editUser && editUser.roles && editUser.roles.includes("user")}
                        />
                        <label htmlFor="user">User</label><br />
                        <input
                            type="checkbox"
                            id="manager"
                            name="roles"
                            value="manager"
                            checked={editUser && editUser.roles && editUser.roles.includes("manager")}
                        />
                        <label htmlFor="commercial">Manager</label><br />
                        <input
                            type="checkbox"
                            id="commercial"
                            name="roles"
                            value="commercial"
                            checked={editUser && editUser.roles && editUser.roles.includes("commercial")}
                        />
                        <label htmlFor="commercial">Commercial</label><br />
                        <input
                            type="checkbox"
                            id="serviceClient"
                            name="roles"
                            value="serviceClient"
                            checked={editUser && editUser.roles && editUser.roles.includes("serviceClient")}
                        />
                        <label htmlFor="serviceClient">Service-client</label><br />

                        {/* Ajoutez autant d'options que vous avez de rôles */}
                    </div>

                    <input type="submit" value="Edit" />
                </form>
            </Modal>
        </div>
    );
}

export default UserManagerAdmin;