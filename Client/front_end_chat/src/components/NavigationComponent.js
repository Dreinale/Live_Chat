import React, { useState, useEffect } from 'react';
import { getChatRooms } from '../services/Api';
import { getToken } from '../utils/Token';
import '../css/components/NavigationStyle.css';

const RoomItem = React.memo(({ room, activeRoomId, onSelect }) => (
    <li
        className={`sidebar-list-item ${activeRoomId === room._id ? 'active' : ''}`}
        onClick={() => onSelect(room)}
    >
        {room.name}
    </li>
));

const NavigationComponent = ({ onSelectRoom }) => {
    const [rooms, setRooms] = useState([]);
    const [activeRoomId, setActiveRoomId] = useState(null);

    useEffect(() => {
        const token = getToken();
        if (token) {
            getChatRooms(token)
                .then(res => {
                    if (Array.isArray(res.data.chatRooms)) {
                        setRooms(res.data.chatRooms);
                    } else {
                        console.error('res.data.chatRooms is not an array:', res.data.chatRooms);
                    }
                })
                .catch(err => console.error(err));
        }
    }, []);

    const handleRoomClick = room => {
        setActiveRoomId(room._id);
        console.log('room._id:', room._id);
        if (onSelectRoom) {
            onSelectRoom(room._id);
        }
    };

    return (
        <div className="sidebar">
            <h2>Chat Rooms</h2>
            <ul className="sidebar-list">
                {rooms.map(room => (
                    <RoomItem
                        key={room._id}
                        room={room}
                        activeRoomId={activeRoomId}
                        onSelect={handleRoomClick}
                    />
                ))}
            </ul>
        </div>
    );
};

export default NavigationComponent;
