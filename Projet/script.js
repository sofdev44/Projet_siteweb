// Récupère les éléments du DOM
const menuButton = document.getElementById('menu-button');
const mobileMenu = document.getElementById('mobile-menu');



  tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        'eefrei-dark': '#0f172a',
                        'eefrei-blue': '#003366',
                        'eefrei-light': '#3b82f6',
                        'eefrei-sky': '#e0f2fe',
                    },
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                    },
                }
            }
        }

// Ajoute l'écouteur d'événement au clic sur le bouton
if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', () => {
        // Alterne la classe 'hidden' pour afficher/masquer le menu
        mobileMenu.classList.toggle('hidden');
    });

}

document.addEventListener('DOMContentLoaded', () => {
    
    /* --- 1. Gestion du Menu Mobile (Existant) --- */
    const menuButton = document.getElementById('menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    /* --- 2. Injection et Gestion du Chatbot --- */
    initChatbot();
});

function initChatbot() {
    // A. Création de l'interface HTML du Chatbot (injectée dynamiquement)
    const chatbotHTML = `
        <div id="chatbot-widget">
            <!-- La fenêtre de discussion (cachée par défaut) -->
            <div id="chat-window" class="hidden">
                <div class="chat-header">
                    <div class="chat-title">
                        <span class="bot-avatar">🤖</span>
                        <span>Assistant Pôle Info</span>
                    </div>
                    <button id="close-chat" aria-label="Fermer">✕</button>
                </div>
                <div id="chat-messages">
                    <div class="message bot-message">
                        Bonjour ! Je suis l'assistant virtuel. 🎓<br>
                        Je peux répondre à vos questions sur les <strong>admissions</strong>, les <strong>formations</strong> ou la <strong>vie étudiante</strong>.
                    </div>
                </div>
                <div class="chat-input-area">
                    <input type="text" id="user-input" placeholder="Posez votre question ici..." />
                    <button id="send-btn">➤</button>
                </div>
            </div>

            <!-- Le bouton rond pour ouvrir le chat -->
            <button id="chatbot-trigger">
                💬
            </button>
        </div>
    `;

    // B. Ajout du HTML à la fin du corps de la page
    document.body.insertAdjacentHTML('beforeend', chatbotHTML);

    // C. Récupération des éléments injectés
    const trigger = document.getElementById('chatbot-trigger');
    const window = document.getElementById('chat-window');
    const closeBtn = document.getElementById('close-chat');
    const sendBtn = document.getElementById('send-btn');
    const userInput = document.getElementById('user-input');
    const messagesContainer = document.getElementById('chat-messages');

    // D. Gestion des Événements (Ouvrir/Fermer)
    trigger.addEventListener('click', () => {
        window.classList.toggle('hidden');
        if (!window.classList.contains('hidden')) {
            userInput.focus(); // Met le focus sur l'input à l'ouverture
        }
    });

    closeBtn.addEventListener('click', () => {
        window.classList.add('hidden');
    });

    // E. Gestion de l'envoi de message
    function sendMessage() {
        const text = userInput.value.trim();
        if (text === "") return;

        // 1. Affiche le message de l'utilisateur
        addMessage(text, 'user-message');
        userInput.value = '';

        // 2. Simule la réflexion et cherche la réponse
        showTypingIndicator();

        // Récupération des données depuis le fichier JSON
        fetch('intents.json')
            .then(response => response.json())
            .then(data => {
                const botResponse = findResponse(text, data);
                
                // Petit délai pour le réalisme (600ms)
                setTimeout(() => {
                    removeTypingIndicator();
                    addMessage(botResponse, 'bot-message');
                }, 600);
            })
            .catch(err => {
                console.error("Erreur chargement JSON:", err);
                removeTypingIndicator();
                addMessage("Désolé, je n'arrive pas à accéder à ma base de connaissances pour le moment.", 'bot-message');
            });
    }

    // Écouteurs pour l'envoi
    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    // --- Fonctions Utilitaires ---

    // Ajoute une bulle de message dans la conversation
    function addMessage(text, className) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${className}`;
        msgDiv.innerHTML = text; // innerHTML permet d'utiliser des balises <br> ou <strong> dans les réponses JSON
        messagesContainer.appendChild(msgDiv);
        scrollToBottom();
    }

    // Algorithme de recherche de réponse par mots-clés
    function findResponse(input, data) {
        const lowerInput = input.toLowerCase();
        
        // Parcourt tous les "intents" (intentions) du JSON
        for (const intent of data.intents) {
            for (const keyword of intent.keywords) {
                // Si un mot-clé est trouvé dans la phrase de l'utilisateur
                if (lowerInput.includes(keyword)) {
                    return intent.response;
                }
            }
        }
        // Si aucune correspondance trouvée
        return data.default;
    }

    function scrollToBottom() {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function showTypingIndicator() {
        const loader = document.createElement('div');
        loader.id = 'typing-indicator';
        loader.className = 'message bot-message typing';
        loader.innerHTML = '<span>.</span><span>.</span><span>.</span>';
        messagesContainer.appendChild(loader);
        scrollToBottom();
    }

    function removeTypingIndicator() {
        const loader = document.getElementById('typing-indicator');
        if (loader) loader.remove();
    }
}

