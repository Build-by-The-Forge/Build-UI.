import type { ErrorCode } from './types';

/**
 * Codes the client raises itself, for failures that never reached a backend
 * envelope. They are not part of the contract's ErrorCode registry.
 */
export type ClientErrorCode = 'NETWORK_ERROR' | 'TIMEOUT';

export type FieldError = { readonly field: string; readonly code: string; readonly message: string };

// Kept in step with ErrorCode: a code added to the contract and missing here
// fails the typecheck through _AllCodesListed.
const KNOWN_CODES = [
  'TENANT_REQUIRED', 'TOKEN_INVALID', 'EMPTY_UPLOAD', 'AUTH_INVALID_CREDENTIALS',
  'AUTH_TOKEN_INVALID', 'AUTH_REFRESH_INVALID', 'ACCOUNT_NOT_ACTIVE',
  'EMAIL_VERIFICATION_REQUIRED', 'TENANT_ACCESS_DENIED', 'PERMISSION_DENIED', 'BAD_REQUEST',
  'CURRENT_PASSWORD_INCORRECT', 'RESOURCE_NOT_FOUND', 'METHOD_NOT_ALLOWED', 'CONFLICT',
  'UPLOAD_READ_TIMEOUT', 'IDEMPOTENCY_KEY_REUSED', 'DUPLICATE_CONTENT',
  'INGESTION_NOT_RETRYABLE', 'ATTEMPT_ALREADY_SUBMITTED', 'ATTEMPT_EXPIRED',
  'ATTEMPT_NOT_SUBMITTED', 'ATTEMPT_LIMIT_REACHED', 'RESULT_NOT_RELEASED', 'UPLOAD_TOO_LARGE',
  'UNSUPPORTED_MEDIA_TYPE', 'RANGE_NOT_SATISFIABLE', 'DOCUMENT_NOT_AVAILABLE',
  'DOCUMENT_NOT_READY', 'SHELF_PUBLICATION_OFF', 'VALIDATION_FAILED', 'RATE_LIMITED',
  'INTERNAL_ERROR', 'AI_UPSTREAM_ERROR', 'AI_UNAVAILABLE', 'ANSWER_WITHHELD',
  'TURN_IN_PROGRESS', 'OBJECT_STORAGE_UNAVAILABLE', 'SERVICE_UNAVAILABLE',
] as const satisfies readonly ErrorCode[];
type Exhaustive<T extends never> = T;
export type _AllCodesListed = Exhaustive<Exclude<ErrorCode, (typeof KNOWN_CODES)[number]>>;

const knownCodes: ReadonlySet<string> = new Set(KNOWN_CODES);

/** A failed API call, normalised from the error envelope or the transport. */
export class ApiError extends Error {
  override name = 'ApiError';

  constructor(
    /** What the client branches on. An unknown backend code reads as INTERNAL_ERROR. */
    readonly code: ErrorCode | ClientErrorCode,
    message: string,
    readonly status: number | null,
    readonly requestId: string | null,
    readonly fieldErrors: readonly FieldError[] = [],
    /** Seconds from Retry-After, when the backend sent one. */
    readonly retryAfter: number | null = null,
  ) {
    super(message);
  }

  get isNetwork(): boolean {
    return this.code === 'NETWORK_ERROR' || this.code === 'TIMEOUT';
  }
}

export const FALLBACK_MESSAGE = 'Something went wrong. Please try again.';

function parseRetryAfter(response: Response): number | null {
  const value = response.headers.get('Retry-After');
  if (!value) return null;
  const seconds = Number(value);
  return Number.isFinite(seconds) && seconds >= 0 ? seconds : null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/**
 * Builds an ApiError from a non-2xx response body. A body that isn't the
 * contract's error envelope (a proxy page, an empty body) becomes
 * INTERNAL_ERROR, and its text is never surfaced.
 */
export function errorFromResponse(body: unknown, response: Response): ApiError {
  const headerId = response.headers.get('X-Request-ID');
  const retryAfter = parseRetryAfter(response);
  if (isRecord(body) && body.success === false && isRecord(body.error)) {
    const error = body.error;
    const meta = isRecord(body.meta) ? body.meta : {};
    const rawCode = typeof error.code === 'string' ? error.code : '';
    const code = knownCodes.has(rawCode) ? (rawCode as ErrorCode) : 'INTERNAL_ERROR';
    const message =
      code !== rawCode || typeof error.message !== 'string' || !error.message
        ? FALLBACK_MESSAGE
        : error.message;
    const details = isRecord(error.details) ? error.details : null;
    const fields: unknown[] = details && Array.isArray(details.fields) ? details.fields : [];
    const fieldErrors = fields.filter(
      (f): f is FieldError =>
        isRecord(f) && typeof f.field === 'string' && typeof f.code === 'string' && typeof f.message === 'string',
    );
    const requestId = typeof meta.request_id === 'string' ? meta.request_id : headerId;
    return new ApiError(code, message, response.status, requestId, fieldErrors, retryAfter);
  }
  return new ApiError('INTERNAL_ERROR', FALLBACK_MESSAGE, response.status, headerId, [], retryAfter);
}

/** Wraps a fetch failure: a timeout, or no connection at all. */
export function errorFromTransport(error: unknown, requestId: string | null): ApiError {
  if (error instanceof ApiError) return error;
  if (isRecord(error) && error.name === 'TimeoutError') {
    return new ApiError('TIMEOUT', 'The request took too long. Check your connection and try again.', null, requestId);
  }
  return new ApiError('NETWORK_ERROR', "Can't reach BUILD. Check your connection and try again.", null, requestId);
}
