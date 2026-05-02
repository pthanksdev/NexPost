'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/Input';

const composerSchema = z.object({
  url: z.string().url().optional().or(z.literal('')),
  twitter: z.string().max(280),
  linkedin: z.string().max(3000),
  threads: z.string().max(500),
  platforms: z.array(z.string()).min(1, 'Select at least one platform'),
});

type ComposerData = z.infer<typeof composerSchema>;

export function SocialPostComposer({ accounts }: { accounts: any }) {
  const { register, handleSubmit, watch, setValue, formState: { isSubmitting } } = useForm<ComposerData>({
    resolver: zodResolver(composerSchema),
    defaultValues: { platforms: [] }
  });

  const platforms = watch('platforms');
  const twitterText = watch('twitter') || '';
  const linkedinText = watch('linkedin') || '';
  const threadsText = watch('threads') || '';

  const togglePlatform = (platform: string) => {
    if (platforms.includes(platform)) {
      setValue('platforms', platforms.filter(p => p !== platform));
    } else {
      setValue('platforms', [...platforms, platform]);
    }
  };

  const onSubmit = async (data: ComposerData) => {
    try {
      const promises = data.platforms.map(platform => 
        fetch(`/api/social/${platform}/post`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            message: data[platform as keyof ComposerData], 
            url: data.url 
          }),
        }).then(res => res.json())
      );

      await Promise.all(promises);
      toast({ title: 'Success', description: 'Posted to selected platforms', variant: 'success' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to post', variant: 'destructive' });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex gap-4">
        {['twitter', 'linkedin', 'threads'].map(platform => {
          const isConnected = accounts?.[platform]?.connected;
          const isSelected = platforms.includes(platform);
          return (
            <Button
              key={platform}
              type="button"
              variant={isSelected ? 'default' : 'outline'}
              disabled={!isConnected}
              onClick={() => togglePlatform(platform)}
              className="capitalize"
            >
              {platform}
            </Button>
          );
        })}
      </div>

      <div>
        <label className="text-sm text-slate-400">Attach Link (Optional)</label>
        <Input {...register('url')} placeholder="https://..." className="mt-1" />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div>
          <label className="text-sm font-medium flex justify-between text-slate-300">
            Twitter <span className={twitterText.length > 280 ? 'text-red-500' : ''}>{twitterText.length}/280</span>
          </label>
          <Textarea {...register('twitter')} rows={5} className="mt-2" placeholder="What's happening?" disabled={!platforms.includes('twitter')} />
        </div>
        <div>
          <label className="text-sm font-medium flex justify-between text-slate-300">
            LinkedIn <span className={linkedinText.length > 3000 ? 'text-red-500' : ''}>{linkedinText.length}/3000</span>
          </label>
          <Textarea {...register('linkedin')} rows={5} className="mt-2" placeholder="Share an update..." disabled={!platforms.includes('linkedin')} />
        </div>
        <div>
          <label className="text-sm font-medium flex justify-between text-slate-300">
            Threads <span className={threadsText.length > 500 ? 'text-red-500' : ''}>{threadsText.length}/500</span>
          </label>
          <Textarea {...register('threads')} rows={5} className="mt-2" placeholder="Start a thread..." disabled={!platforms.includes('threads')} />
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting || platforms.length === 0} className="w-full">
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Post to Selected Platforms
      </Button>
    </form>
  );
}
