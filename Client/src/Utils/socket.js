import { io } from 'socket.io-client';

export const socket = io('http://localhost:5000'); // Update if using a different port or domain
