'use client';

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { MessageSquare, Briefcase, MessageCircle, AlertCircle, CheckCircle2 } from 'lucide-react';

interface PlatformCardProps {
  platform: 'twitter' | 'linkedin' | 'threads';
  account: any;
  connectUrl: string;
}

export function PlatformCard({ platform, account, connectUrl }: PlatformCardProps) {
  const isConnected = account?.connected;

  const icons = {
    twitter: MessageSquare,
    linkedin: Briefcase,
    threads: MessageCircle,
  };
  const Icon = icons[platform];

  const handleConnect = () => {
    window.location.href = connectUrl;
  };

  return (
    <Card className="flex flex-col h-full border-slate-800">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium capitalize flex items-center gap-2">
          <Icon className="h-5 w-5" />
          {platform}
        </CardTitle>
        <Badge variant={isConnected ? 'success' : 'secondary'}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </Badge>
      </CardHeader>
      <CardContent className="flex-1">
        {isConnected ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span className="text-sm font-medium text-slate-200">
                @{account.username || account.displayName}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-4 text-sm text-slate-400">
              Auto-posting is <span className="font-semibold text-slate-200">{account.autoPost ? 'Enabled' : 'Disabled'}</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-6 text-center space-y-3">
            <AlertCircle className="h-8 w-8 text-slate-500" />
            <p className="text-sm text-slate-400">Connect to automatically share your published posts.</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          variant={isConnected ? 'outline' : 'default'} 
          className="w-full"
          onClick={handleConnect}
        >
          {isConnected ? 'Reconnect / Update' : `Connect ${platform}`}
        </Button>
      </CardFooter>
    </Card>
  );
}
