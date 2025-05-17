// popup.js
document.addEventListener('DOMContentLoaded', function() {
  // Login button click handler
  document.getElementById('login-button').addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (!email || !password) {
      alert('Please enter both email and password');
      return;
    }
    
    const result = await window.supabaseAuth.login(email, password);
    
    if (!result.success) {
      alert(`Login failed: ${result.message}`);
    }
  });
  
  // Sign up button click handler
  document.getElementById('signup-button').addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (!email || !password) {
      alert('Please enter both email and password');
      return;
    }
    
    const result = await window.supabaseAuth.signUp(email, password);
    
    if (result.success) {
      alert('Sign up successful! You can now log in.');
    } else {
      alert(`Sign up failed: ${result.message}`);
    }
  });
  
  // Logout button click handler
  document.getElementById('logout-button').addEventListener('click', async () => {
    await window.supabaseAuth.logout();
  });
  
  // Check if user is already logged in
  chrome.storage.local.get(['supabaseSession'], (result) => {
    if (result.supabaseSession) {
      // User is logged in, initialize Voiceflow chatbot
      document.getElementById('login-form').style.display = 'none';
      document.getElementById('user-info').style.display = 'block';
      document.getElementById('user-email').textContent = result.supabaseSession.user.email;
      document.getElementById('chatbot-container').style.display = 'block';
      
      // Initialize Voiceflow chatbot
      window.voiceflowChatbot.init();
    }
  });
}); 