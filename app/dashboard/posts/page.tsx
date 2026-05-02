import Link from 'next/link';
import { getPosts } from '@/lib/db/queries';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { formatRelativeTime, formatNumber } from '@/lib/utils';
import { PenSquare, MoreHorizontal, Eye } from 'lucide-react';
import { auth } from '@/lib/auth';

export default async function PostsPage({
  searchParams,
}: {
  searchParams: { page?: string; status?: string };
}) {
  const session = await auth();
  const page = Number(searchParams.page) || 1;
  const status = searchParams.status;

  const { posts, total, pages } = await getPosts({
    page,
    limit: 15,
    status,
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-50">Posts</h1>
          <p className="text-slate-400 mt-2">Manage your blog content.</p>
        </div>
        <Link href="/dashboard/posts/new">
          <Button>
            <PenSquare className="mr-2 h-4 w-4" />
            Write Post
          </Button>
        </Link>
      </div>

      <div className="flex gap-2">
        <Link href="/dashboard/posts">
          <Badge variant={!status ? 'default' : 'secondary'}>All</Badge>
        </Link>
        <Link href="/dashboard/posts?status=published">
          <Badge variant={status === 'published' ? 'default' : 'secondary'}>Published</Badge>
        </Link>
        <Link href="/dashboard/posts?status=draft">
          <Badge variant={status === 'draft' ? 'default' : 'secondary'}>Drafts</Badge>
        </Link>
        <Link href="/dashboard/posts?status=scheduled">
          <Badge variant={status === 'scheduled' ? 'default' : 'secondary'}>Scheduled</Badge>
        </Link>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Views</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                No posts found.
              </TableCell>
            </TableRow>
          ) : (
            posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="font-medium">
                  <Link href={`/dashboard/posts/${post.id}/edit`} className="hover:text-violet-400 hover:underline">
                    {post.title}
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      post.status === 'published' ? 'success' :
                      post.status === 'scheduled' ? 'warning' : 'outline'
                    }
                  >
                    {post.status}
                  </Badge>
                </TableCell>
                <TableCell className="tabular-nums text-slate-400">
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {formatNumber(post.stats?.views || 0)}
                  </div>
                </TableCell>
                <TableCell className="text-slate-400 tabular-nums">
                  {formatRelativeTime(post.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/dashboard/posts/${post.id}/edit`}>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
