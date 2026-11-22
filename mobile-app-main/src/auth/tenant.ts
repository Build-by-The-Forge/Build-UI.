import { call, type ApiClient } from '@/api/client';
import { ApiError } from '@/api/errors';

/**
 * ready         the student can use the tenant
 * verify-email  the email isn't confirmed, so tenant routes would answer 403
 * denied        the tenant refused the join (TENANT_ACCESS_DENIED)
 */
export type TenantAccess = 'ready' | 'verify-email' | 'denied';

export type TenantAccessResult = { readonly access: TenantAccess; readonly email: string };

/**
 * Makes sure the signed-in student belongs to the tenant this build serves,
 * joining under the tenant's join policy when they don't yet. The backend
 * decides: this only reads the outcome. A new account has no membership, and
 * without one no tenant-scoped screen works.
 */
export async function ensureTenantAccess(
  client: ApiClient,
  slug: string,
  signal?: AbortSignal,
): Promise<TenantAccessResult> {
  const user = await call(client.GET('/identity/me', { signal }));
  if (!user.email_verified) return { access: 'verify-email', email: user.email };

  const memberships = await call(client.GET('/identity/memberships', { signal }));
  if (memberships.some((m) => m.tenant_slug === slug)) return { access: 'ready', email: user.email };

  try {
    await call(client.POST('/tenants/{slug}/join', { params: { path: { slug } }, signal }));
    return { access: 'ready', email: user.email };
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.code === 'EMAIL_VERIFICATION_REQUIRED') return { access: 'verify-email', email: user.email };
      if (error.code === 'TENANT_ACCESS_DENIED') return { access: 'denied', email: user.email };
    }
    throw error;
  }
}
