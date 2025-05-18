import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import { LoginForm } from './components/auth/LoginForm';
import { ChatWindow } from './components/chat/ChatWindow';
import { Card, CardContent } from './components/ui/card';
import { Loader2 } from 'lucide-react';
import { OrganizationSelector } from './components/auth/OrganizationSelector';
import type { Organization } from './lib/supabase';

function App() {
  const [session, setSession] = useState<any>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('App mounted');
    
    // Get initial session and stored organization
    const initializeApp = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Initial session:', session);
        setSession(session);

        if (session?.user) {
          // Try to get stored organization
          const { organization } = await chrome.storage.local.get(['organization']);
          if (organization) {
            console.log('Found stored organization:', organization);
            setSelectedOrganization(organization);
          }

          // Fetch organization memberships
          const { data: memberships, error } = await supabase
            .from('organization_members')
            .select(`
              organizations (
                id,
                name,
                voiceflow_api_key,
                voiceflow_project_id,
                voiceflow_config
              )
            `)
            .eq('user_id', session.user.id);

          if (error) {
            console.error('Error fetching organizations:', error);
            return;
          }

          if (memberships) {
            const orgs = memberships
              .map(m => {
                const org = (m as any).organizations;
                return org ? {
                  id: org.id as string,
                  name: org.name as string,
                  voiceflow_api_key: org.voiceflow_api_key as string | null,
                  voiceflow_project_id: org.voiceflow_project_id as string | null,
                  voiceflow_config: org.voiceflow_config as string | null
                } : null;
              })
              .filter((org): org is Organization => org !== null);
            
            console.log('Fetched organizations:', orgs);
            setOrganizations(orgs);

            // Validate stored organization is still valid
            if (organization && !orgs.some(org => org.id === organization.id)) {
              console.log('Stored organization no longer valid');
              setSelectedOrganization(null);
              await chrome.storage.local.remove(['organization']);
            }
          }
        }
      } catch (error) {
        console.error('Error initializing app:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('Auth state changed:', session);
      setSession(session);
      
      if (!session?.user) {
        setOrganizations([]);
        setSelectedOrganization(null);
        await chrome.storage.local.remove(['organization']);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleOrganizationSelect = async (organization: Organization) => {
    setSelectedOrganization(organization);
    await chrome.storage.local.set({ organization });
    console.log('Organization data stored:', organization);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    await chrome.storage.local.remove(['organization']);
    setSession(null);
    setSelectedOrganization(null);
    setOrganizations([]);
  };

  if (isLoading) {
    return (
      <Card className="w-[350px] shadow-lg">
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (!session) {
    return <LoginForm />;
  }

  if (!selectedOrganization) {
    return (
      <OrganizationSelector
        organizations={organizations}
        onSelect={handleOrganizationSelect}
        onLogout={handleLogout}
      />
    );
  }

  if (!selectedOrganization.voiceflow_api_key || !selectedOrganization.voiceflow_project_id) {
    return (
      <Card className="w-[350px] shadow-lg">
        <CardContent className="p-8 text-center space-y-2">
          <p className="text-sm text-destructive">Configuration Error</p>
          <p className="text-sm text-muted-foreground">
            Voiceflow configuration is missing for {selectedOrganization.name}. Please contact your administrator.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <ChatWindow
      voiceflowApiKey={selectedOrganization.voiceflow_api_key}
      voiceflowProjectId={selectedOrganization.voiceflow_project_id}
      voiceflowConfig={selectedOrganization.voiceflow_config || undefined}
    />
  );
}

export default App; 