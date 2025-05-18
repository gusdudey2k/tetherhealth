import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { Organization } from '../../lib/supabase';

interface OrganizationSelectorProps {
  organizations: Organization[];
  onSelect: (organization: Organization) => void;
  onLogout: () => void;
}

export function OrganizationSelector({ organizations, onSelect, onLogout }: OrganizationSelectorProps) {
  const [selectedOrgId, setSelectedOrgId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const organization = organizations.find(org => org.id === selectedOrgId);
    if (!organization) {
      setError('Please select an organization');
      return;
    }

    if (!organization.voiceflow_api_key || !organization.voiceflow_project_id) {
      setError('Selected organization does not have Voiceflow configured');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSelect(organization);
    } catch (error) {
      setError('Failed to select organization. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (value: string) => {
    setSelectedOrgId(value);
    setError(null);
  };

  return (
    <Card className="w-[350px] shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold tracking-tight">Select Organization</CardTitle>
        <CardDescription>
          Choose an organization to continue
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Select
            value={selectedOrgId}
            onValueChange={handleChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an organization" />
            </SelectTrigger>
            <SelectContent>
              {organizations.map(org => (
                <SelectItem 
                  key={org.id} 
                  value={org.id}
                  disabled={!org.voiceflow_api_key || !org.voiceflow_project_id}
                  className={cn(
                    "cursor-pointer",
                    (!org.voiceflow_api_key || !org.voiceflow_project_id) && 
                    "text-muted-foreground cursor-not-allowed"
                  )}
                >
                  <div className="flex items-center">
                    <span>{org.name}</span>
                    {(!org.voiceflow_api_key || !org.voiceflow_project_id) && (
                      <span className="ml-2 text-xs text-muted-foreground">(Not Configured)</span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {error && (
            <div className="text-sm text-destructive font-medium">
              {error}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button
          onClick={handleSubmit}
          disabled={!selectedOrgId || isSubmitting}
          className="w-full"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : (
            'Continue'
          )}
        </Button>
        <Button
          variant="outline"
          onClick={onLogout}
          disabled={isSubmitting}
          className="w-full"
        >
          Sign Out
        </Button>
      </CardFooter>
    </Card>
  );
} 