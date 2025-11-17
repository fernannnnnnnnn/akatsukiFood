import { createClient } from '@vercel/edge-config';

export const ec = createClient({ token: process.env.VERCEL_EDGE_CONFIG });