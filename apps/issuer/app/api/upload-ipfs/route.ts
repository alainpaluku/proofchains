/**
 * PROOFCHAIN Issuer - IPFS Upload API Route
 * Handles file uploads to IPFS via Pinata on the server side
 * This keeps the JWT secret secure
 */

import { NextRequest, NextResponse } from 'next/server';
import FormData from 'form-data';
import axios from 'axios';

const PINATA_API_URL = 'https://api.pinata.cloud';

export async function POST(request: NextRequest) {
    try {
        // Get JWT from environment (server-side only)
        // Use .trim() to remove any whitespace/newline characters that could cause header errors
        const jwt = (process.env.PINATA_JWT || process.env.NEXT_PUBLIC_PINATA_JWT)?.trim();

        if (!jwt) {
            console.error('❌ PINATA_JWT not found in environment');
            console.error('Available env vars:', {
                hasPINATA_JWT: !!process.env.PINATA_JWT,
                hasNEXT_PUBLIC_PINATA_JWT: !!process.env.NEXT_PUBLIC_PINATA_JWT,
                nodeEnv: process.env.NODE_ENV
            });
            return NextResponse.json(
                { 
                    success: false, 
                    error: 'PINATA_JWT is not configured. Please add PINATA_JWT to your .env file in the root directory and restart the server.' 
                },
                { status: 500 }
            );
        }

        // Get the file from the request
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { success: false, error: 'No file provided' },
                { status: 400 }
            );
        }

        console.log('📤 Uploading file to Pinata IPFS...', file.name, file.size, 'bytes');

        // Convert File to Buffer for Pinata
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Create FormData for Pinata
        const pinataFormData = new FormData();
        pinataFormData.append('file', buffer, {
            filename: file.name,
            contentType: file.type,
        });

        // Optional: Add metadata
        const metadata = JSON.stringify({
            name: file.name,
            keyvalues: {
                project: 'PROOFCHAIN',
                type: file.type,
            }
        });
        pinataFormData.append('pinataMetadata', metadata);

        // Optional: Pin options
        const options = JSON.stringify({
            cidVersion: 1,
        });
        pinataFormData.append('pinataOptions', options);

        // Upload to Pinata using axios (better FormData support)
        const response = await axios.post(
            `${PINATA_API_URL}/pinning/pinFileToIPFS`,
            pinataFormData,
            {
                headers: {
                    'Authorization': `Bearer ${jwt}`,
                    ...pinataFormData.getHeaders(),
                },
                maxBodyLength: Infinity,
                maxContentLength: Infinity,
            }
        );

        const ipfsHash = response.data.IpfsHash;
        const url = `ipfs://${ipfsHash}`;

        console.log('✅ File uploaded to IPFS via Pinata:', ipfsHash);

        return NextResponse.json({
            success: true,
            ipfsHash,
            url,
        });
    } catch (error: any) {
        console.error('❌ Pinata upload error:', error);
        
        let errorMessage = 'Failed to upload to IPFS';
        
        if (error.response) {
            // Axios error with response
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
            errorMessage = error.response.data?.error || error.response.data?.message || `Pinata API error: ${error.response.status}`;
        } else if (error.request) {
            // Request made but no response
            console.error('No response received:', error.request);
            errorMessage = 'No response from Pinata API. Please check your internet connection.';
        } else {
            // Error setting up request
            errorMessage = error.message || 'Failed to upload to IPFS';
        }
        
        return NextResponse.json(
            { 
                success: false, 
                error: errorMessage
            },
            { status: 500 }
        );
    }
}

