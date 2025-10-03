
import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { SOCKET_URL } from '../config';
import { Message } from '../types';

export const useSocket = (userId: number | null) => {
    const socketRef = useRef<Socket | null>(null);
    // Use a ref to store the latest conversation IDs.
    // This allows the 'connect' event handler to access the latest IDs
    // without needing to be re-declared, avoiding stale closures.
    const conversationIdsRef = useRef<string[]>([]);

    useEffect(() => {
        if (!userId) {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
            return;
        }

        if (!socketRef.current) {
            const socket = io(SOCKET_URL, {
                query: { userId },
                transports: ['websocket'],
                reconnection: true,
                reconnectionAttempts: 5
            });
            socketRef.current = socket;

            socket.on('connect', () => {
                console.log('Socket connected:', socket.id);
                // When the socket connects (or reconnects), automatically rejoin conversations.
                if (conversationIdsRef.current.length > 0) {
                    socket.emit('join_conversations', conversationIdsRef.current);
                }
            });

            socket.on('disconnect', () => {
                console.log('Socket disconnected');
            });
        }

        return () => {
            if(socketRef.current && socketRef.current.connected) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };

    }, [userId]);

    const joinConversations = useCallback((conversationIds: string[]) => {
        // Update the ref with the latest conversation IDs for use on connect/reconnect.
        conversationIdsRef.current = conversationIds;
        // If we are already connected, join the rooms immediately.
        if (socketRef.current && socketRef.current.connected && conversationIds.length > 0) {
            socketRef.current.emit('join_conversations', conversationIds);
        }
    }, []);

    const onNewMessage = useCallback((handler: (data: { conversationId: string, message: Message }) => void) => {
        socketRef.current?.off('receive_message'); // Remove previous listener to avoid duplicates
        socketRef.current?.on('receive_message', handler);
    }, []);

    const sendMessage = useCallback((data: { conversationId: string, message: Message }) => {
        socketRef.current?.emit('send_message', data);
    }, []);

    const onDataUpdated = useCallback((handler: () => void) => {
        socketRef.current?.off('data_updated'); // Remove previous listener
        socketRef.current?.on('data_updated', handler);
    }, []);


    return { sendMessage, onNewMessage, joinConversations, onDataUpdated };
};