import { z } from "zod";

// =============================================================================
// Requests
// =============================================================================
export const LoginRequestSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});
export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export const TwoFactorRequestSchema = z.object({
  authCode: z.string().min(1),
});
export type TwoFactorRequest = z.infer<typeof TwoFactorRequestSchema>;

// =============================================================================
// Responses
// =============================================================================

/**
 * 403 with `code: "mfa_required"` is the *expected* response after step 1.
 * The login flow then proceeds to /2fa_check.
 */
export const LoginResponseSchema = z
  .object({
    code: z.string().optional(),
    message: z.string().optional(),
  })
  .passthrough();
export type LoginResponse = z.infer<typeof LoginResponseSchema>;

/**
 * The 2FA verification endpoint returns either a token in the body or the
 * token is set as a session cookie / authorization header. The schema is
 * permissive — token extraction logic lives in the auth client.
 */
export const TwoFactorResponseSchema = z
  .object({
    token: z.string().optional(),
    access_token: z.string().optional(),
    accessToken: z.string().optional(),
    bearerToken: z.string().optional(),
    code: z.string().optional(),
    data: z
      .object({
        token: z.string().optional(),
        access_token: z.string().optional(),
      })
      .partial()
      .optional(),
  })
  .passthrough();
export type TwoFactorResponse = z.infer<typeof TwoFactorResponseSchema>;

export const MeResponseSchema = z
  .object({
    id: z.string().optional(),
    username: z.string().optional(),
    email: z.string().optional(),
  })
  .passthrough();
export type MeResponse = z.infer<typeof MeResponseSchema>;

// =============================================================================
// Domain
// =============================================================================
export interface AuthCredentialsInput {
  username: string;
  password: string;
  totpSecret: string;
}

export interface AuthResult {
  success: boolean;
  bearerToken?: string;
  error?: string;
}
