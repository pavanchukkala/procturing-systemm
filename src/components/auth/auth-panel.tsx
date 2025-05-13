"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AuthForm } from './auth-form';
import type { UserRole } from '@/contexts/auth-context';
import { User, Briefcase } from 'lucide-react';

interface AuthPanelProps {
  role: UserRole;
  title: string;
  description: string;
  icon: React.ElementType;
}

export function AuthPanel({ role, title, description, icon: Icon }: AuthPanelProps) {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <Card className="w-full max-w-md shadow-2xl bg-card/80 backdrop-blur-md border-border/50 transform transition-all duration-300 hover:scale-[1.01] hover:shadow-primary/20">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 p-3 bg-primary/20 rounded-full w-fit">
          <Icon className="h-10 w-10 text-primary" />
        </div>
        <CardTitle className="text-3xl font-bold">{title}</CardTitle>
        <CardDescription className="text-muted-foreground text-base">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="signin" className="w-full" onValueChange={(value) => setIsSignUp(value === 'signup')}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <AuthForm role={role} isSignUp={false} onToggleMode={() => setIsSignUp(true)} />
          </TabsContent>
          <TabsContent value="signup">
            <AuthForm role={role} isSignUp={true} onToggleMode={() => setIsSignUp(false)} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
