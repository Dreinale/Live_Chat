import React, {useEffect, useState, useRef} from 'react';
import {getChatMessages, getChatRooms, getUsers, postMessage, socket, addReaction, getReactionsByMessageId, getReactionsByReactionId} from '../services/Api';
import InfiniteScroll from 'react-infinite-scroller';
import '../css/components/Chat.css';
import {getUsername} from "../utils/Token";
import Linkify from 'react-linkify';
import { MentionsInput, Mention } from 'react-mentions';
import messageSound from './Message.mp3';
import ReactionPanel from './ReactionPanel';

const Chat = ({ roomId }) => {
    const messagesEndRef = useRef(null);
    const loggedInUsername = getUsername();
    const pageSize = 10;
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [hasMoreItems, setHasMoreItems] = useState(true);
    const [page, setPage] = useState(1);
    const [users, setUsers] = useState([]);
    const [chatRoomMembers, setChatRoomMembers] = useState([]);
    const [reactionPanelOpen, setReactionPanelOpen] = useState(null);

    const handleInputChange = (event) => {
        setMessage(event.target.value);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    const sendMessage = async () => {
        if (message.trim() === '') {
            console.error('Erreur : Le message ne peut pas être vide');
            return;
        }

        const chatRoomId = roomId;
        const createdAt = new Date().toISOString();
        const sendBy = loggedInUsername;
        await postMessage(chatRoomId, message);
        setMessage('');
        //console.log('Message envoyé: ' + message);
        socket.emit('message', { roomId: chatRoomId, message: message, sendBy: sendBy, createdAt: createdAt });
    }

    useEffect(() => {
        const getMessages = async (request, response) => {
            if (!roomId) {
                return;
            }
            const newMessages = await getChatMessages(roomId, page);

            if (newMessages.data.messages && Array.isArray(newMessages.data.messages)) {

                for (const message of newMessages.data.messages) {
                    const reactionsResponse = await getReactionsByMessageId(message._id);
                    console.log('Reactions: ', reactionsResponse.data);


                    const reactionIds = [];
                    for (const reaction of reactionsResponse.data) {
                        reactionIds.push(reaction.reactionId);
                    }

                    const reactionEmoji = [];
                    for (const reactionId of reactionIds) {
                        try {
                            const emojiResponse = await getReactionsByReactionId(reactionId);



                            console.log('Emoji : ', emojiResponse.data);
                            reactionEmoji.push(emojiResponse.data.Emoji);
                        } catch (error) {
                            console.error('Erreur lors de la récupération de l\'emoji:', error);
                        }
                    }

                    console.log('reactionEmoji: ', reactionEmoji);
                    console.log('Reaction IDs: ', reactionIds);
                    message.reactions = reactionEmoji;
                }


                //console.log('New messages:', newMessages);
                if (newMessages && newMessages.data && newMessages.data.messages
                    && newMessages.data.messages.length > 0) {
                    const sortedMessages = newMessages.data.messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                    setMessages(sortedMessages);

                }
            }
        };

        getMessages().then(r => console.log('Messages loaded'));

        setMessages([]);
        setPage(1);
        setHasMoreItems(true);
    }, [roomId]);

    const handledMessageIds = new Set();

    const handleNewMessage = (newMessage) => {
        console.log('handleNewMessage called with:', newMessage);

        // Check if the message has a sendBy and has not been handled yet
        if (newMessage.sendBy && !handledMessageIds.has(newMessage._id)) {
            handledMessageIds.add(newMessage._id);

            setMessages((prevMessages) => [...prevMessages, newMessage]);

            // Check if the user is not on the page
            if (document.hidden) {
                // Send a message to the service worker
                navigator.serviceWorker.ready.then(function(registration) {
                    console.log('Sending message to service worker:', newMessage + '\n sendby ' + newMessage.sendBy + ' message ' + newMessage.message);
                    registration.active.postMessage(newMessage);
                });
            }
            handledMessageIds.delete(newMessage._id);
        }
    };

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                socket.on('message', handleNewMessage);
            } else {
                socket.off('message', handleNewMessage);
            }
        };

        socket.on('reactionAdded', async ({ messageId, reactionId }) => {
            // Trouver le message avec l'ID correspondant dans l'état actuel
            const messageToUpdate = messages.find(msg => msg._id === messageId);

            if (messageToUpdate) {
                // Récupérer l'emoji correspondant au reactionId
                try {
                    const emojiResponse = await getReactionsByReactionId(reactionId);
                    const newEmoji = emojiResponse.data.Emoji;

                    // Ajouter le nouvel emoji à son tableau de réactions
                    const updatedReactions = [...messageToUpdate.reactions, newEmoji];

                    // Créer une nouvelle version du message avec les réactions mises à jour
                    const updatedMessage = { ...messageToUpdate, reactions: updatedReactions };

                    // Mettre à jour l'état global des messages
                    const updatedMessages = messages.map(msg => msg._id === messageId ? updatedMessage : msg);
                    setMessages(updatedMessages);

                } catch (error) {
                    console.error('Erreur lors de la récupération de l\'emoji:', error);
                }
            }
        });


        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            socket.off('reactionAdded');
        };
    }, [messages]);


    useEffect(scrollToBottom, [messages]);

    useEffect(() => {
        socket.on('message', (newMessage) => {
            setMessages((prevMessages) => [...prevMessages, newMessage ]);

            //Si ce n'est pas le currentUser qui envoie le message, on joue le son
            if (newMessage.sendBy !== loggedInUsername) {
                // Play a sound
                const audio = new Audio(messageSound);
                audio.play().catch(error => console.error("Error playing sound:", error));
            }
        });
        return () => {
            socket.off('message');
        };
    }, []);

    useEffect(() => {
        if (roomId) {
            socket.emit('joinRoom', roomId);
        }
        return () => {
            socket.emit('leaveRoom', roomId);
        };
    }, [roomId]);

    useEffect(() => {
        async function fetchUsers() {
            try {
                const result = await getUsers(); // Appelez votre fonction pour obtenir les utilisateurs
                setUsers(result.data.users.map(user => ({ id: user._id, display: user.username }))); // Mettez à jour l'état avec le résultat
                //console.log('Users:', result.data.users)
            } catch (error) {
                console.error("An error occurred while fetching users:", error);
            }
        }

        fetchUsers();
    }, []);

    useEffect(() => {
        async function fetchChatRoomMembers() {
            try {
                const result = await getChatRooms(); // Appelez votre fonction pour obtenir les salles de chat
                const currentChatRoom = result.data.chatRooms.find(chatRoom => chatRoom._id === roomId); // Trouvez la salle de chat actuelle
                if (currentChatRoom) {
                    setChatRoomMembers(currentChatRoom.members.map(member => member.username)); // Mettez à jour l'état avec le résultat
                }
            } catch (error) {
                console.error("An error occurred while fetching chat room members:", error);
            }
        }

        fetchChatRoomMembers();
    }, [roomId]);

    const loadReactionsForMessages = async (messages) => {
        for (const message of messages) {
            const reactionsResponse = await getReactionsByMessageId(message._id);
            const reactionIds = [];
            for (const reaction of reactionsResponse.data) {
                reactionIds.push(reaction.reactionId);
            }
            const reactionEmoji = [];
            for (const reactionId of reactionIds) {
                try {
                    const emojiResponse = await getReactionsByReactionId(reactionId);
                    reactionEmoji.push(emojiResponse.data.Emoji);
                } catch (error) {
                    console.error('Erreur lors de la récupération de l\'emoji:', error);
                }
            }
            message.reactions = reactionEmoji;
        }
    };

    const loadMessages = () => {
        if (roomId && hasMoreItems) {
            getChatMessages(roomId, page)
                .then(async response => {
                    //console.log('Loaded messages:', response.data.messages);
                    if (response.data.messages && response.data.messages.length > 0) {
                        let newMessages = response.data.messages;

                        await loadReactionsForMessages(newMessages);

                        setMessages(prevMessages => {
                            const uniqueNewMessages = newMessages.filter(
                                (newMsg) => !prevMessages.some((prevMsg) => prevMsg._id === newMsg._id)
                            );
                            const allMessages = [...prevMessages, ...uniqueNewMessages];
                            // Tri des messages par date
                            allMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

                            return allMessages;
                        });
                        //console.log('Loaded messages:', response.data.messages.length);
                        setPage(page + 1);
                        if (response.data.messages.length < pageSize) {
                            setHasMoreItems(false);
                        }
                    } else {
                        setHasMoreItems(false);
                    }
                    //console.log('Has more items:', hasMoreItems);
                })
                .catch(error => {
                    console.error('Erreur lors de la récupération des messages:', error);
                });
        }
    };

    function isValidDate(dateString) {
        const date = new Date(dateString);
        return !isNaN(date.getTime());
    }

    function parseMessage(message ) {
        const loggedInUsername = getUsername();

        return message.split(' ').map((word, index) => {
            if (word.startsWith('@') && (word.substring(1) === loggedInUsername || word.substring(1).toLowerCase() === 'everyone')) {
                return <b key={index} className="ping">{word}</b>;
            } else {
                return word;
            }
        }).reduce((prev, current, index) => {
            if (index === 0) {
                return [current];
            } else {
                return [...prev, ' ', current];
            }
        }, []);
    }

    const generateSuggestions = (search) => {
        const everyone = { id: 'everyone', display: 'everyone' };
        if (search === '') {
            return [everyone, ...users.filter(user => chatRoomMembers.includes(user.display))];
        } else {
            const filteredUsers = users.filter(user => user.display.toLowerCase().startsWith(search.toLowerCase()) && chatRoomMembers.includes(user.display));
            return [everyone, ...filteredUsers];
        }
    };

    const handleReact = async (message, reactionId) => {
        try {
            console.log('Trying to add reaction to message:', message._id, 'with reaction ID:', reactionId);
            const response = await addReaction(message._id, reactionId);

            if (!response.ok && (response.status !== 201 && response.status !== 200)) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Mettre à jour l'état pour afficher la nouvelle réaction
            setMessages((prevMessages) => {
                return prevMessages.map((msg) => {
                    if (msg._id === message._id) {
                        return { ...msg, reactions: [...(msg.reactions || []), reactionId] };
                    } else {
                        return msg;
                    }
                });
            });
        } catch (error) {
            console.error(`An error occurred while adding the reaction: ${error}`);
        }
    };

    return (
        <div className="chat">
            <div className="chat-messages" style={{ height: '200px', overflow: 'auto' }}>
                <InfiniteScroll
                    pageStart={0}
                    loadMore={loadMessages}
                    hasMore={hasMoreItems}
                    loader={
                        <div className="loader">
                            {messages.length === 0 && roomId === null ? (
                                <p key={0}>Select a room!</p>
                            ) : messages.length === 0 ? (
                                <p key={0}>Enter the first message!</p>
                            ) : (
                                <p key={0}>Loading...</p>
                            )}
                        </div>
                    }
                    isReverse={true}
                    useWindow={false}
                >

                    {messages.map((messageObject, index) => {
                        if (messageObject && messageObject.message && messageObject.message.trim() !== '') {
                            return (
                                <div key={messageObject._id || index} className={`chat-message-container ${messageObject.sendBy === loggedInUsername ? 'outgoing' : 'incoming'}`}>
                                    <div className="chat-message">
                                        <div className="message-user">
                                            {messageObject.sendBy} {isValidDate(messageObject.createdAt) ? new Date(messageObject.createdAt).toLocaleString() : 'Invalid Date'}
                                        </div>
                                        <div>
                                            <Linkify>
                                                <p key={index}>{parseMessage(messageObject.message)}</p>
                                            </Linkify>

                                            <button className="reaction-button" onClick={() => setReactionPanelOpen(reactionPanelOpen === messageObject._id ? null : messageObject._id)}>
                                                +
                                            </button>
                                            {reactionPanelOpen === messageObject._id && <ReactionPanel message={messageObject} onReact={handleReact} />}

                                            {messageObject.reactions && [...new Set(messageObject.reactions)].map((uniqueEmoji, reactionIndex) => (
                                                <span key={reactionIndex} className="reaction">
                                                {uniqueEmoji}
                                                    <span className="reaction-count">
                                                    {messageObject.reactions.filter(emoji => emoji === uniqueEmoji).length}
                                                </span>
                                            </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        } else {
                            return null;
                        }
                    })}


                    <div ref={messagesEndRef} />
                </InfiniteScroll>
            </div>
            <MentionsInput type="text" className="chat-input" value={message} onChange={handleInputChange}>
                <Mention
                    trigger="@"
                    data={generateSuggestions}
                    markup="@__display__"
                    renderSuggestion={(suggestion, search, highlightedDisplay, index, focused) => {
                        return (
                            <div className={`user ${focused ? 'focused' : ''}`}>
                                {highlightedDisplay}
                            </div>
                        );
                    }}
                />
            </MentionsInput>
            <button className="chat-send-button" onClick={sendMessage}>Send</button>
        </div>
    );
};

export default Chat;
