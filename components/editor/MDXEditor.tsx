'use client';

import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createPostSchema, CreatePostData } from '@/lib/validations';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardContent } from '@/components/ui/Card';
import { Bold, Italic, Heading1, Heading2, List, Image as ImageIcon, Link as LinkIcon, Code, Eye, EyeOff, Save, Loader2, Play } from 'lucide-react';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export function MDXEditor({ initialData, isEditing = false }: { initialData?: any, isEditing?: boolean }) {
  const router = useRouter();
  const [isPreview, setIsPreview] = React.useState(false);
  const [mdxSource, setMdxSource] = React.useState<any>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<any>({
    resolver: zodResolver(createPostSchema),
    defaultValues: initialData || {
      title: '',
      content: '',
      excerpt: '',
      status: 'draft',
      tags: [],
    },
  });

  const content = watch('content');
  const title = watch('title');

  // Parse MDX for preview
  React.useEffect(() => {
    if (isPreview && content) {
      serialize(content).then(source => setMdxSource(source));
    }
  }, [isPreview, content]);

  const insertText = (before: string, after: string = '') => {
    const textarea = document.getElementById('mdx-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end);
    const newContent = content.substring(0, start) + before + selected + after + content.substring(end);
    
    setValue('content', newContent, { shouldDirty: true });
    
    // Reset focus
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selected.length);
    }, 0);
  };

  const handleGenerateAI = async () => {
    if (!title) {
      toast({ title: 'Error', description: 'Please enter a title first', variant: 'destructive' });
      return;
    }
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, type: 'generate' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setValue('content', data.content, { shouldDirty: true });
      toast({ title: 'Success', description: 'Content generated successfully', variant: 'success' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setIsGenerating(false);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      const endpoint = isEditing ? `/api/posts/${initialData.id}` : '/api/posts';
      const method = isEditing ? 'PATCH' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error);

      toast({ title: 'Success', description: `Post ${isEditing ? 'updated' : 'created'} successfully`, variant: 'success' });
      router.push('/dashboard/posts');
      router.refresh();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center justify-between">
        <Input
          {...register('title')}
          placeholder="Post Title..."
          className="text-3xl font-bold bg-transparent border-0 px-0 h-14 focus-visible:ring-0 placeholder:text-slate-600"
        />
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => setIsPreview(!isPreview)}>
            {isPreview ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {isPreview ? 'Write' : 'Preview'}
          </Button>
          <Button type="button" variant="secondary" onClick={handleGenerateAI} disabled={isGenerating}>
            {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
            AI Gen
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-slate-800">
            {!isPreview && (
              <div className="flex flex-wrap items-center gap-1 p-2 border-b border-slate-800 bg-slate-900/50 rounded-t-lg">
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => insertText('**', '**')}><Bold className="w-4 h-4" /></Button>
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => insertText('*', '*')}><Italic className="w-4 h-4" /></Button>
                <div className="w-px h-4 bg-slate-800 mx-1" />
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => insertText('# ')}><Heading1 className="w-4 h-4" /></Button>
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => insertText('## ')}><Heading2 className="w-4 h-4" /></Button>
                <div className="w-px h-4 bg-slate-800 mx-1" />
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => insertText('- ')}><List className="w-4 h-4" /></Button>
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => insertText('[', '](url)')}><LinkIcon className="w-4 h-4" /></Button>
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => insertText('![alt](', ')')}><ImageIcon className="w-4 h-4" /></Button>
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => insertText('```\n', '\n```')}><Code className="w-4 h-4" /></Button>
              </div>
            )}
            <CardContent className="p-0">
              {isPreview ? (
                <div className="prose prose-invert max-w-none p-6 min-h-[500px]">
                  {mdxSource ? <MDXRemote {...mdxSource} /> : 'Nothing to preview...'}
                </div>
              ) : (
                <Textarea
                  id="mdx-textarea"
                  {...register('content')}
                  placeholder="Write your markdown here..."
                  className="min-h-[500px] border-0 rounded-none rounded-b-lg resize-y bg-slate-950 font-mono focus-visible:ring-0 p-6"
                />
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-300">Status</label>
                <select {...register('status')} className="mt-1 block w-full rounded-md border border-slate-800 bg-slate-950 py-2 px-3 text-sm text-slate-50">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>

              {watch('status') === 'scheduled' && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="text-sm font-medium text-slate-300">Schedule Date & Time</label>
                  <Input 
                    type="datetime-local" 
                    {...register('scheduledAt')} 
                    className="mt-1"
                    min={new Date().toISOString().slice(0, 16)}
                    required
                  />
                  <p className="text-xs text-slate-500 mt-1">Select a future date and time.</p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-slate-300">Excerpt</label>
                <Textarea {...register('excerpt')} rows={3} className="mt-1 text-sm" placeholder="Brief summary..." />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-semibold text-slate-200">SEO Settings</h3>
              <div>
                <label className="text-sm text-slate-400">Meta Title</label>
                <Input {...register('seo.metaTitle')} className="mt-1" />
              </div>
              <div>
                <label className="text-sm text-slate-400">Meta Description</label>
                <Textarea {...register('seo.metaDescription')} rows={2} className="mt-1" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
