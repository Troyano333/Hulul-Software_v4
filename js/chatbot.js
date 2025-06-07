 function toggleChatbot() {
      const chatbot = document.querySelector('.chatbot-container');
      chatbot.classList.toggle('active');
    }

    function sendMessage() {
      const input = document.querySelector('.chat-input');
      const messageText = input.value.trim();
      if (!messageText) return;

      const messages = document.querySelector('.chatbot-messages');
      const userMessage = document.createElement('div');
      userMessage.className = 'message user-message';
      userMessage.innerHTML = messageText + '<div class="message-timestamp">' + getCurrentTime() + '</div>';
      messages.appendChild(userMessage);
      input.value = '';

      showTypingIndicator();
      setTimeout(() => {
        const botMessage = document.createElement('div');
        botMessage.className = 'message bot-message';
        botMessage.innerHTML = getBotResponse(messageText) + '<div class="message-timestamp">' + getCurrentTime() + '</div>';
        messages.appendChild(botMessage);
        hideTypingIndicator();
        messages.scrollTop = messages.scrollHeight;
      }, 1000);
    }

    function handleKeyPress(event) {
      if (event.key === 'Enter') {
        sendMessage();
      }
    }

    function getCurrentTime() {
      const now = new Date();
      return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    function showTypingIndicator() {
      const messages = document.querySelector('.chatbot-messages');
      let typingIndicator = document.querySelector('.typing-indicator');
      if (!typingIndicator) {
        typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        typingIndicator.innerHTML = '<div class="dot"></div><div class="dot"></div><div class="dot"></div>';
        messages.appendChild(typingIndicator);
      }
      typingIndicator.style.display = 'flex';
      messages.scrollTop = messages.scrollHeight;
    }

    function hideTypingIndicator() {
      const typingIndicator = document.querySelector('.typing-indicator');
      if (typingIndicator) {
        typingIndicator.style.display = 'none';
      }
    }

    function getBotResponse(message) {
      message = message.toLowerCase();
      if (message.includes('eventos') || message.includes('conciertos')) {
        return '🎵 ¡Tenemos eventos increíbles! Mira los destacados: <a href="#">Silvestre Dangond</a>, <a href="#">DJ Chawala</a> y <a href="#">DJ Tremendo</a>. ¿Quieres reservar para alguno?';
      } else if (message.includes('reservas') || message.includes('palcos') || message.includes('mesas')) {
        return '🎫 Puedes reservar palcos (VIP, Plata, Básico) o mesas (VIP, Plata, Básica). ¿Cuál te interesa?';
      } else if (message.includes('productos') || message.includes('bebidas')) {
        return '🍾 Ofrecemos botellas de licor premium, estándar y nacional, además de mezcladores y bebidas energéticas. ¿Quieres el catálogo completo?';
      } else if (message.includes('hulul') || message.includes('información')) {
        return '📄 Hulul Discoteck te ofrece la mejor experiencia en discotecas con palcos y mesas exclusivas. ¿Quieres saber más sobre nosotros?';
      } else if (message.includes('soporte') || message.includes('contacto')) {
        return '🆘 ¡Estamos aquí para ayudarte! Contáctanos por <a href="#">WhatsApp</a> o <a href="#">Instagram</a>, o escríbenos tu duda ahora.';
      } else {
        return '🤔 No estoy seguro de qué me preguntas. Prueba con: eventos, reservas, productos, información sobre Hulul o soporte.';
      }
    }

    document.querySelectorAll('.menu-option').forEach(option => {
      option.addEventListener('click', () => {
        const messages = document.querySelector('.chatbot-messages');
        const userMessage = document.createElement('div');
        userMessage.className = 'message user-message';
        userMessage.innerHTML = option.textContent + '<div class="message-timestamp">' + getCurrentTime() + '</div>';
        messages.appendChild(userMessage);

        showTypingIndicator();
        setTimeout(() => {
          const botMessage = document.createElement('div');
          botMessage.className = 'message bot-message';
          botMessage.innerHTML = getBotResponse(option.textContent) + '<div class="message-timestamp">' + getCurrentTime() + '</div>';
          messages.appendChild(botMessage);
          hideTypingIndicator();
          messages.scrollTop = messages.scrollHeight;
        }, 1000);
      });
    });