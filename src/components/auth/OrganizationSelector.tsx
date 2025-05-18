import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../ui/card';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { Loader2, Building2, LogOut, Check, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { Organization } from '../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

interface OrganizationSelectorProps {
  organizations: Organization[];
  onSelect: (organization: Organization) => void;
  onLogout: () => void;
}

export function OrganizationSelector({ organizations, onSelect, onLogout }: OrganizationSelectorProps) {
  const [selectedOrgId, setSelectedOrgId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Group organizations by configuration status
  const configuredOrgs = organizations.filter(org => org.voiceflow_api_key && org.voiceflow_project_id);
  const unconfiguredOrgs = organizations.filter(org => !org.voiceflow_api_key || !org.voiceflow_project_id);

  const handleSubmit = async () => {
    setError(null);
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
    setSuccess(`Connecting to ${organization.name}...`);
    
    try {
      await onSelect(organization);
    } catch (error) {
      setError('Failed to select organization. Please try again.');
      setSuccess(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (value: string) => {
    setSelectedOrgId(value);
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="bg-gradient-to-b from-transparent to-muted/20 px-4 py-8 mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-[400px] mx-auto"
      >
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
                <Building2 className="h-5 w-5 text-primary" />
              </motion.div>
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-center">
              Select Organization
            </CardTitle>
            <CardDescription className="text-center">
              Choose an organization to continue
            </CardDescription>
          </CardHeader>
          
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
                  <Check className="h-5 w-5 flex-shrink-0 mt-0.5" />
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
            
            <div className="space-y-2">
              <div 
                className={cn(
                  "relative w-full rounded-md border transition-all duration-200",
                  isOpen ? "border-primary ring-1 ring-primary/20" : "border-input",
                  (!selectedOrgId && !isOpen) && "text-muted-foreground"
                )}
              >
                <Select
                  value={selectedOrgId}
                  onValueChange={handleChange}
                  onOpenChange={setIsOpen}
                >
                  <SelectTrigger 
                    className={cn(
                      "w-full border-0 focus:ring-0 focus:ring-offset-0 bg-transparent",
                      isOpen && "text-primary"
                    )}
                  >
                    <div className="flex items-center">
                      <Building2 className={cn("mr-2 h-4 w-4 opacity-70", isOpen && "text-primary")} />
                      <SelectValue placeholder="Select an organization" />
                    </div>
                  </SelectTrigger>
                  
                  <SelectContent
                    className="max-h-[300px] overflow-y-auto border border-muted/30 shadow-lg"
                    position="popper"
                    sideOffset={5}
                  >
                    {configuredOrgs.length > 0 && (
                      <SelectGroup>
                        {configuredOrgs.length > 0 && unconfiguredOrgs.length > 0 && (
                          <SelectLabel className="text-xs font-medium text-muted-foreground px-2 py-1.5">
                            Available Organizations
                          </SelectLabel>
                        )}
                        {configuredOrgs.map(org => (
                          <SelectItem 
                            key={org.id} 
                            value={org.id}
                            className="cursor-pointer rounded-md focus:bg-primary/10 focus:text-primary relative pl-9"
                          >
                            <div className="flex items-center py-0.5">
                              <Building2 className="h-4 w-4 mr-2 text-primary/70 absolute left-2" />
                              <span className="font-medium">{org.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    )}
                    
                    {unconfiguredOrgs.length > 0 && (
                      <SelectGroup>
                        {configuredOrgs.length > 0 && unconfiguredOrgs.length > 0 && (
                          <SelectLabel className="text-xs font-medium text-muted-foreground px-2 py-1.5 pt-3 border-t mt-1">
                            Unconfigured Organizations
                          </SelectLabel>
                        )}
                        {unconfiguredOrgs.map(org => (
                          <SelectItem 
                            key={org.id} 
                            value={org.id}
                            disabled={true}
                            className="cursor-not-allowed text-muted-foreground/70 rounded-md focus:bg-muted/10 relative pl-9"
                          >
                            <div className="flex items-center py-0.5">
                              <Building2 className="h-4 w-4 mr-2 opacity-40 absolute left-2" />
                              <span>{org.name}</span>
                              <span className="ml-2 text-xs text-muted-foreground italic">(Not Configured)</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              <p className="text-xs text-muted-foreground px-1">
                {organizations.length === 0 
                  ? "No organizations found. Please contact your administrator." 
                  : configuredOrgs.length === 0 
                    ? "No configured organizations available. Please contact your administrator."
                    : `${configuredOrgs.length} organization${configuredOrgs.length !== 1 ? 's' : ''} available`
                }
              </p>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-3 pt-2 pb-4">
            <Button
              onClick={handleSubmit}
              disabled={!selectedOrgId || isSubmitting}
              className={cn(
                "w-full font-medium transition-all",
                isSubmitting && "opacity-80"
              )}
              size="lg"
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
              className="w-full font-medium"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </CardFooter>
        </Card>
        
        <p className="text-center text-xs text-muted-foreground mt-4">
          Need help accessing your organization? Contact your administrator.
        </p>
      </motion.div>
    </div>
  );
} 