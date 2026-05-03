const APP_ID = process.env.THREADS_APP_ID!;
const APP_SECRET = process.env.THREADS_APP_SECRET!;
const CALLBACK_URL = process.env.THREADS_CALLBACK_URL!;

export function getThreadsAuthorizationUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: APP_ID,
    redirect_uri: CALLBACK_URL,
    scope: 'threads_basic,threads_content_publish',
    response_type: 'code',
    state,
  });
  return `https://threads.net/oauth/authorize?${params.toString()}`;
}

export async function exchangeThreadsCodeForTokens(code: string) {
  // 1. Get short-lived token
  const shortResponse = await fetch('https://graph.threads.net/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: APP_ID,
      client_secret: APP_SECRET,
      grant_type: 'authorization_code',
      redirect_uri: CALLBACK_URL,
      code,
    }),
  });

  if (!shortResponse.ok) throw new Error('Failed to get short-lived Threads token');
  const shortData = await shortResponse.json();

  // 2. Exchange for long-lived token (60 days)
  const longResponse = await fetch(
    `https://graph.threads.net/access_token?grant_type=th_exchange_token&client_secret=${APP_SECRET}&access_token=${shortData.access_token}`
  );

  if (!longResponse.ok) throw new Error('Failed to get long-lived Threads token');
  const longData = await longResponse.json();

  return {
    access_token: longData.access_token,
    user_id: shortData.user_id,
  };
}

export async function getThreadsProfile(accessToken: string) {
  const response = await fetch(
    `https://graph.threads.net/v1.0/me?fields=id,username,threads_profile_picture_url,threads_biography&access_token=${accessToken}`
  );
  if (!response.ok) throw new Error('Failed to fetch Threads profile');
  return response.json();
}

export async function postToThreads(accessToken: string, userId: string, text: string) {
  // 1. Create Media Container
  const createResponse = await fetch(
    `https://graph.threads.net/v1.0/${userId}/threads`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        media_type: 'TEXT',
        text,
        access_token: accessToken,
      }),
    }
  );

  if (!createResponse.ok) {
     const err = await createResponse.text();
     throw new Error(`Failed to create Threads container: ${err}`);
  }
  const { id: containerId } = await createResponse.json();

  // 2. Publish Container
  const publishResponse = await fetch(
    `https://graph.threads.net/v1.0/${userId}/threads_publish`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        creation_id: containerId,
        access_token: accessToken,
      }),
    }
  );

  if (!publishResponse.ok) {
     const err = await publishResponse.text();
     throw new Error(`Failed to publish Threads post: ${err}`);
  }
  return publishResponse.json();
}
