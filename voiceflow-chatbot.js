// voiceflow-chatbot.js
class VoiceflowChatbot {
  constructor() {
    // Replace with your Voiceflow project details
    this.voiceflowProjectID = '67c96cd4ed49fe3b61824730'; // Your provided project ID
    this.container = document.getElementById('voiceflow-chatbot-embed');
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    
    // Check if user is authenticated
    chrome.storage.local.get(['supabaseSession'], (result) => {
      if (!result.supabaseSession) {
        console.error('User not authenticated');
        return;
      }
      
      // Get user information from Supabase session
      const userEmail = result.supabaseSession.user.email;
      const userId = result.supabaseSession.user.id;
      
      this.loadVoiceflowChatbot(userId, userEmail);
    });
  }

  loadVoiceflowChatbot(userId, userEmail) {
    // Clear the container
    this.container.innerHTML = '';
    
    // Load Voiceflow widget using the new embed code
    const script = document.createElement('script');
    script.type = 'text/javascript';
    
    script.onload = () => {
      window.voiceflow.chat.load({
        verify: { projectID: this.voiceflowProjectID },
        url: 'https://general-runtime.voiceflow.com',
        versionID: 'production',
        voice: {
          url: "https://runtime-api.voiceflow.com"
        },
        render: {
          mode: 'embedded',
          target: this.container
        },
        // Add user context
        user: {
          name: userEmail,
          id: userId
        }
      });
    };
    
    script.src = "https://cdn.voiceflow.com/widget-next/bundle.mjs";
    document.head.appendChild(script);
    
    this.initialized = true;
  }
}

// Create and export instance
window.voiceflowChatbot = new VoiceflowChatbot(); 