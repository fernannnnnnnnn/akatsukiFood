// File: lib/edgeConfig.js
import { createClient } from '@vercel/edge-config';

// Kita membuat klien 'ec' secara manual
// menggunakan variabel environment 'EDGE_CONFIG' yang Vercel sediakan
export const ec = createClient(process.env.EDGE_CONFIG);