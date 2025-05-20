import React, { useEffect } from 'react';
import './Chatbot.css';

const Chatbot = () => {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://www.chatbase.co/embed.min.js';
        script.async = true;
        script.setAttribute('chatbotId', 'RdZv_7jl_t-gDph_2L5AF');
        script.onload = () => {
            console.log('Chatbase script loaded successfully');
        };
        script.onerror = () => {
            console.error('Failed to load Chatbase script');
        };
        document.body.appendChild(script);

        const handleClickOutside = (event) => {
            const chatbotContainer = document.querySelector('.chatbase-widget') ||
                document.querySelector('iframe.chatbase-widget-iframe');
            if (chatbotContainer && !chatbotContainer.contains(event.target)) {
                if (window.Chatbase_API && typeof window.Chatbase_API.hideWidget === 'function') {
                    window.Chatbase_API.hideWidget();
                } else {
                    chatbotContainer.style.display = 'none';
                }
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
        };
    }, []);

    return null;
};

export default Chatbot;