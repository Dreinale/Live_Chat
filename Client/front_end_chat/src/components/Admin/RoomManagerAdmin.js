import React, { useEffect, useState } from 'react'
import { getRooms, createRoom, updateRoom, deleteRoom } from "../../services/Api";
import Modal from "../Modal";

const RoomManagerAdmin = () => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [editModalIsOpen, setEditModalIsOpen] = useState(false);
    const [editRoom, setEditRoom] = useState();

    const [rooms, setRooms] = useState([]);
    const [newRoom, setNewRoom] = useState({name: '', description: ''});

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const handleInputChange = (event) => {
        setNewRoom({...newRoom, [event.target.name]: event.target.value});
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            await createRoom(newRoom.name, newRoom.description);
            closeModal();
        } catch (error) {
            alert('An error occurred while creating the room');
            console.error(error);
        }
    }

    function openModal() {
        setModalIsOpen(true);
    }

    function openEditModal(room) {
        setEditRoom(room);
        setEditModalIsOpen(true);
    }

    function closeEditModal() {
        setEditModalIsOpen(false);
    }

    function closeModal() {
        setModalIsOpen(false);
    }

    const handleDelete = async (roomId) => {
        try {
            await deleteRoom(roomId);
            const result = await getRooms();
            setRooms(result.data.rooms);
        } catch (error) {
            alert('An error occurred while deleting the room');
            console.error(error);
        }
    }

    const handleEditSubmit = async (event) => {
        event.preventDefault();

        try {
            await updateRoom(editRoom._id, editRoom.name, editRoom.description);
            closeEditModal();
        } catch (error) {
            alert('An error occurred while updating the room');
            console.error(error);
        }
    }

    function handleEditInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        setEditRoom(prevState => ({ ...prevState, [name]: value }));
    }

    useEffect(() => {
        async function fetchRooms() {
            try {
                const result = await getRooms(page, 5);
                console.log('Result from getRooms:', result);
                setRooms(result.data.chatRooms);
                setTotalPages(result.data.pages);
            } catch (error) {
                console.error("An error occurred while fetching rooms:", error);
            }
        }

        fetchRooms();
    }, [page]);
    return (
        <div className="admin-panel">
            <h1>Room Manager</h1>
            <button onClick={openModal}>Create Room</button>
            <table>
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Membres</th>
                        <th>Created At</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                {rooms && rooms.map(chatRooms => (
                    <tr key={chatRooms._id}>
                        <td>{chatRooms.name}</td>
                        <td>{chatRooms.members.length}</td>
                        <td>{new Date(chatRooms.createdAt).toLocaleDateString('fr-FR')}</td>
                        <td>
                            <button onClick={() => openEditModal(chatRooms)}>Edit</button>
                            <button onClick={() => handleDelete(chatRooms._id)}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>


            </table>
            <div className="pagination">
                <button className="Previous-button" onClick={() => setPage(page => Math.max(page - 1, 1))}>Previous Page</button>
                <p>Page {page} of {totalPages}</p>
                <button className="Next-button" onClick={() => setPage(page => Math.min(page + 1, totalPages))}>Next Page</button>
            </div>

            <Modal isOpen={modalIsOpen} onClose={closeModal} title="Create Room">
                <form onSubmit={handleSubmit}>
                    <label>
                        Nom:
                        <input type="text" name="name" onChange={handleInputChange} />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
            </Modal>

            <Modal isOpen={editModalIsOpen} onClose={closeEditModal} title="Edit Room">
                <form onSubmit={handleEditSubmit}>
                    <label>
                        Nom:
                        <input type="text" name="name"  onChange={handleEditInputChange} />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
            </Modal>
        </div>
    );
}

export default RoomManagerAdmin