// supabase-auth.js
class SupabaseAuth {
  constructor() {
    // Supabase project credentials
    this.supabaseUrl = 'https://tmguihmzkyggyuzutzqd.supabase.co';
    this.supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtZ3VpaG16a3lnZ3l1enV0enFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwNzUwMTAsImV4cCI6MjA2MjY1MTAxMH0.aq7Ai_d3E-3xy3R3Fi-lE5l-qwvDayEB0kXnUSzfHsQ';
    this.supabase = null;
    
    this.initSupabase();
  }

  initSupabase() {
    this.supabase = supabase.createClient(this.supabaseUrl, this.supabaseKey);
    
    // Check if user is already logged in
    chrome.storage.local.get(['supabaseSession'], async (result) => {
      if (result.supabaseSession) {
        try {
          const { data, error } = await this.supabase.auth.getUser(result.supabaseSession.access_token);
          if (error) throw error;
          if (data.user) {
            this.onLoginSuccess(result.supabaseSession);
          }
        } catch (err) {
          console.error('Session error:', err);
          this.logout(); // Clear invalid session
        }
      }
    });
  }

  async signUp(email, password) {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (data.user && data.session) {
        this.onLoginSuccess(data.session);
        return { success: true, user: data.user };
      } else {
        return { 
          success: false, 
          message: 'Please check your email to confirm your account.' 
        };
      }
    } catch (error) {
      console.error('Sign-up error:', error);
      return { success: false, message: error.message };
    }
  }

  async login(email, password) {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      this.onLoginSuccess(data.session);
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: error.message };
    }
  }

  async logout() {
    try {
      await this.supabase.auth.signOut();
      chrome.storage.local.remove(['supabaseSession']);
      
      // Update UI
      document.getElementById('login-form').style.display = 'block';
      document.getElementById('user-info').style.display = 'none';
      document.getElementById('chatbot-container').style.display = 'none';
      
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, message: error.message };
    }
  }

  onLoginSuccess(session) {
    // Save session to chrome storage
    chrome.storage.local.set({ 'supabaseSession': session });
    
    // Update UI
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('user-info').style.display = 'block';
    document.getElementById('user-email').textContent = session.user.email;
    document.getElementById('chatbot-container').style.display = 'block';
    
    // Initialize Voiceflow chatbot after successful login
    if (window.voiceflowChatbot) {
      window.voiceflowChatbot.init();
    }
  }
}

// Create and export instance
window.supabaseAuth = new SupabaseAuth(); 