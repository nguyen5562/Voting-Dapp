import axios from "axios";

const uploadFile = async (file: File) => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post(
            'https://api.pinata.cloud/pinning/pinFileToIPFS',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'pinata_api_key': process.env.NEXT_PUBLIC_PINATA_API_KEY,
                    'pinata_secret_api_key': process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY,
                },
            }
        );

        return {
            success: true,
            ipfsHash: response.data.IpfsHash,
            pinataUrl: `${process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL}/ipfs/${response.data.IpfsHash}`,
        };
    } catch (error) {
        console.error('Error uploading to IPFS:', error);
        return {
            success: false,
            error: 'Failed to upload file to IPFS',
        };
    }
}

const getFile = async (ipfsHash: string) => {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL}/ipfs/${ipfsHash}`);
        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        console.error('Error fetching from IPFS:', error);
        return {
            success: false,
            error: 'Failed to fetch file from IPFS',
        };
    }
}

export { uploadFile, getFile };