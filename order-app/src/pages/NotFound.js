import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
    const navigate = useNavigate();

    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f8f9fa',
        fontFamily: 'Arial, sans-serif',
        color: '#333',
        textAlign: 'center'
    };

    const headingStyle = {
        fontSize: '3rem',
        marginBottom: '1rem'
    };

    const subtextStyle = {
        fontSize: '1.2rem',
        marginBottom: '2rem'
    };

    const buttonStyle = {
        padding: '10px 20px',
        fontSize: '1rem',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    };

    return (
        <div style={containerStyle}>
            <h1 style={headingStyle}>404 - Page Not Found</h1>
            <p style={subtextStyle}>Oops! The page you're looking for doesn't exist.</p>
            <button style={buttonStyle} onClick={() => navigate('/')}>
                Go to Home
            </button>
        </div>
    );
};

export default NotFoundPage;
