import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Loader2, Eye, EyeOff, Info, ArrowRight, Github, Mail, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function LoginForm() {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  // Reset state when changing tabs
  useEffect(() => {
    setError(null);
    setSuccess(null);
    setPasswordStrength(0);
  }, [activeTab]);

  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    setPasswordStrength(strength);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (activeTab === 'signup') {
      checkPasswordStrength(newPassword);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return 'bg-gray-200 dark:bg-gray-700';
    if (passwordStrength === 1) return 'bg-red-500';
    if (passwordStrength === 2) return 'bg-orange-500';
    if (passwordStrength === 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (activeTab === 'signup') {
        if (!agreedToTerms) {
          setError('Please agree to the Terms of Service and Privacy Policy');
          setLoading(false);
          return;
        }
        if (passwordStrength < 3) {
          setError('Please use a stronger password');
          setLoading(false);
          return;
        }
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) throw signUpError;
        setSuccess('Account created! Please check your email to verify your account.');
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
      }
    } catch (error: any) {
      console.error('Error:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      setSuccess('Password reset instructions sent to your email');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container bg-gradient-to-b from-transparent to-muted/20 px-4 py-8 mx-auto">
      <div className="w-full max-w-[400px] mx-auto">
        <Card className="shadow-xl border-muted/20 overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,theme(colors.blue.100/10%),transparent_70%)]" />
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_bottom_left,theme(colors.green.100/10%),transparent_70%)]" />
          
          <CardHeader className="space-y-2 pb-4">
            <div className="flex justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-2"
              >
                <Lock className="h-5 w-5 text-primary" />
              </motion.div>
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-center">
              TetherHealth Chat
            </CardTitle>
            <CardDescription className="text-center">
              Your secure medical chat assistant
            </CardDescription>
            
            {/* Tabs */}
            <div className="flex items-center justify-center rounded-lg border p-1 mt-4 bg-muted/30">
              <motion.div className="grid grid-cols-2 w-full gap-1">
                <Button
                  type="button"
                  variant={activeTab === 'login' ? 'default' : 'ghost'}
                  className={cn(
                    "relative w-full",
                    activeTab === 'login' ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => setActiveTab('login')}
                >
                  Login
                  {activeTab === 'login' && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-foreground"
                      layoutId="activeTab"
                    />
                  )}
                </Button>
                <Button
                  type="button"
                  variant={activeTab === 'signup' ? 'default' : 'ghost'}
                  className={cn(
                    "relative w-full",
                    activeTab === 'signup' ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => setActiveTab('signup')}
                >
                  Sign Up
                  {activeTab === 'signup' && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-foreground"
                      layoutId="activeTab"
                    />
                  )}
                </Button>
              </motion.div>
            </div>
          </CardHeader>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4 pt-2">
                  {/* Success Message */}
                  <AnimatePresence>
                    {success && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-3 rounded-md bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 flex items-start gap-2"
                      >
                        <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{success}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Error Message */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-3 rounded-md bg-destructive/10 text-destructive flex items-start gap-2"
                      >
                        <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{error}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <div className="space-y-1">
                    <Label 
                      htmlFor="email" 
                      className={cn(
                        "transition-colors",
                        emailFocused && "text-primary"
                      )}
                    >
                      Email
                    </Label>
                    <div className={cn(
                      "flex items-center px-3 py-2 rounded-md border transition-all duration-200",
                      emailFocused ? "border-primary ring-1 ring-primary/20" : "border-input"
                    )}>
                      <Mail className={cn("mr-2 h-4 w-4 opacity-70", emailFocused && "text-primary")} />
                      <input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setEmailFocused(true)}
                        onBlur={() => setEmailFocused(false)}
                        required
                        autoComplete="email"
                        className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground text-foreground"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <Label 
                        htmlFor="password"
                        className={cn(
                          "transition-colors",
                          passwordFocused && "text-primary"
                        )}
                      >
                        Password
                      </Label>
                      {activeTab === 'login' && (
                        <button
                          type="button"
                          onClick={handleForgotPassword}
                          className="text-xs font-medium text-primary hover:text-primary/90 hover:underline transition-colors"
                        >
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <div 
                      className={cn(
                        "flex items-center px-3 py-2 rounded-md border transition-all duration-200",
                        passwordFocused ? "border-primary ring-1 ring-primary/20" : "border-input"
                      )}
                    >
                      <Lock className={cn("mr-2 h-4 w-4 opacity-70", passwordFocused && "text-primary")} />
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={handlePasswordChange}
                        onFocus={() => setPasswordFocused(true)}
                        onBlur={() => setPasswordFocused(false)}
                        required
                        autoComplete={activeTab === 'login' ? 'current-password' : 'new-password'}
                        className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground text-foreground"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-muted-foreground hover:text-foreground ml-2 focus:outline-none transition-colors"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    
                    {activeTab === 'signup' && (
                      <div className="mt-2 space-y-1.5">
                        <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex">
                          {[...Array(4)].map((_, i) => (
                            <div
                              key={i}
                              className={cn(
                                "h-full transition-all duration-300 mr-0.5 last:mr-0 rounded-full",
                                i < passwordStrength ? getPasswordStrengthColor() : "bg-gray-200 dark:bg-gray-700"
                              )}
                              style={{ width: '25%' }}
                            />
                          ))}
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Info size={12} className="mr-1" />
                          {passwordStrength === 0 && "Use 8+ characters with letters, numbers & symbols"}
                          {passwordStrength === 1 && "Weak password - add uppercase letters"}
                          {passwordStrength === 2 && "Moderate password - add numbers"}
                          {passwordStrength === 3 && "Good password - consider adding symbols"}
                          {passwordStrength === 4 && "Strong password - excellent job!"}
                        </div>
                      </div>
                    )}
                  </div>

                  {activeTab === 'signup' && (
                    <div className="flex items-start space-x-2 mt-2">
                      <div className="flex items-center h-5 mt-1">
                        <input
                          type="checkbox"
                          id="terms"
                          checked={agreedToTerms}
                          onChange={(e) => setAgreedToTerms(e.target.checked)}
                          className="h-4 w-4 rounded border-input focus:ring-primary focus:ring-offset-0 text-primary"
                        />
                      </div>
                      <div>
                        <label htmlFor="terms" className="text-sm text-muted-foreground">
                          I agree to the{' '}
                          <a href="#" className="text-primary font-medium hover:underline">
                            Terms of Service
                          </a>{' '}
                          and{' '}
                          <a href="#" className="text-primary font-medium hover:underline">
                            Privacy Policy
                          </a>
                        </label>
                      </div>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="flex flex-col space-y-4 pt-2">
                  <Button
                    type="submit"
                    className={cn(
                      "w-full font-medium transition-all",
                      loading && "opacity-80"
                    )}
                    disabled={loading || (activeTab === 'signup' && !agreedToTerms)}
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {activeTab === 'login' ? 'Signing in...' : 'Creating account...'}
                      </>
                    ) : (
                      <>
                        {activeTab === 'login' ? 'Sign In' : 'Create Account'}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>

                  <div className="relative w-full">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-muted" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full font-medium"
                      onClick={() => {
                        // Handle GitHub login
                      }}
                    >
                      <Github className="mr-2 h-4 w-4" />
                      GitHub
                    </Button>
                  </div>
                </CardFooter>
              </form>
            </motion.div>
          </AnimatePresence>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-4">
          By signing in, you agree to our{' '}
          <a href="#" className="text-primary hover:underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-primary hover:underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
} 