import NavigationComponent  from "../components/NavigationComponent";
import Chat from "../components/ChatComponent";
import { useState } from 'react';
import '../css/pages/ChatHome.css';

export const ChatHomePage = () => {
    const [selectedRoomId, setSelectedRoomId] = useState(null);

    const handleSelectRoom = (roomId) => {
        setSelectedRoomId(roomId);
    };

    return (
        <div className="chat-container">
            <NavigationComponent onSelectRoom={handleSelectRoom} />
            <Chat roomId={selectedRoomId} />
        </div>
    )
}
