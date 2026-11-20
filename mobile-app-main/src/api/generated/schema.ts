// Generated from contracts/mobile/openapi.yaml by scripts/api-codegen.mjs. Do not edit.
// Contract: build-backend contracts/mobile/openapi.yaml at e9067edf9d01e68fa81f3929b5a8ee019c5d0fcf
// Contract sha256: 8d15f0e31f329dc6b0902dbafb8ddefffa0557ad6e07eb5b3b1c2371ce736a83
/* eslint-disable */
export type paths = {
    readonly "/identity/users": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly get?: never;
        readonly put?: never;
        /**
         * Register a student account
         * @description A bodyless 202, identical whether or not the email already has an account, so registration can't be used to discover accounts. A 202 means the request is recorded and survives a restart, not that a new account exists: a worker looks for the account afterwards. A verification email follows for a new account, usually within a few seconds, and signing in before then can answer AUTH_INVALID_CREDENTIALS. Registering again is safe. A failure to record the request answers 500.
         */
        readonly post: operations["registerUser"];
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/identity/authenticate": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly get?: never;
        readonly put?: never;
        /** Sign in */
        readonly post: operations["authenticate"];
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/identity/refresh": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly get?: never;
        readonly put?: never;
        /**
         * Rotate the refresh token
         * @description Clients allow one refresh at a time per session, and save the new refresh token before using the new access token. Reusing a rotated token revokes the session. After AUTH_REFRESH_INVALID the client signs out and never retries that token.
         */
        readonly post: operations["refreshSession"];
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/identity/logout": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly get?: never;
        readonly put?: never;
        /** Revoke this session */
        readonly post: operations["logout"];
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/identity/logout-all": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly get?: never;
        readonly put?: never;
        /** Revoke every session of this user */
        readonly post: operations["logoutAll"];
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/identity/me": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        /** The signed-in user */
        readonly get: operations["getCurrentUser"];
        readonly put?: never;
        readonly post?: never;
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/identity/memberships": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        /**
         * Tenants this user can select
         * @description Small by nature, so unpaginated. An unverified user sees memberships but can't use them yet.
         */
        readonly get: operations["listMemberships"];
        readonly put?: never;
        readonly post?: never;
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/identity/verify-email": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly get?: never;
        readonly put?: never;
        /** Confirm an email address with the emailed token */
        readonly post: operations["verifyEmail"];
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/identity/resend-verification": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly get?: never;
        readonly put?: never;
        /**
         * Send the verification email again
         * @description The response doesn't reveal whether the account exists.
         */
        readonly post: operations["resendVerification"];
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/identity/forgot-password": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly get?: never;
        readonly put?: never;
        /**
         * Request a password reset email
         * @description The response doesn't reveal whether the account exists.
         */
        readonly post: operations["forgotPassword"];
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/identity/reset-password": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly get?: never;
        readonly put?: never;
        /** Set a new password with the emailed token */
        readonly post: operations["resetPassword"];
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/identity/change-password": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly get?: never;
        readonly put?: never;
        /** Change the password of the signed-in user */
        readonly post: operations["changePassword"];
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/tenants/{slug}/join": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly get?: never;
        readonly put?: never;
        /**
         * Join a tenant under its join policy
         * @description Requires a verified email. Repeating it returns the existing membership. An unknown tenant and a refused join give the same TENANT_ACCESS_DENIED.
         */
        readonly post: operations["joinTenant"];
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/invitations/accept": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly get?: never;
        readonly put?: never;
        /** Accept a tenant invitation with its emailed token */
        readonly post: operations["acceptInvitation"];
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/catalogue/faculties": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        /** Active faculties of the tenant */
        readonly get: operations["listFaculties"];
        readonly put?: never;
        readonly post?: never;
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/catalogue/departments": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        /** Active departments of the tenant */
        readonly get: operations["listDepartments"];
        readonly put?: never;
        readonly post?: never;
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/catalogue/programmes": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        /** Active programmes of the tenant */
        readonly get: operations["listProgrammes"];
        readonly put?: never;
        readonly post?: never;
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/catalogue/courses": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        /** Published courses of the tenant */
        readonly get: operations["listCourses"];
        readonly put?: never;
        readonly post?: never;
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/catalogue/courses/{course_id}": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        /** One published course */
        readonly get: operations["getCourse"];
        readonly put?: never;
        readonly post?: never;
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/catalogue/courses/{course_id}/topics": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        /** Active topics of a course */
        readonly get: operations["listTopics"];
        readonly put?: never;
        readonly post?: never;
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/catalogue/topics/{topic_id}/learning-outcomes": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        /** Active learning outcomes of a topic */
        readonly get: operations["listLearningOutcomes"];
        readonly put?: never;
        readonly post?: never;
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/catalogue/topics/{topic_id}/reference-materials": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        /** Active reference materials of a topic's course */
        readonly get: operations["listReferenceMaterials"];
        readonly put?: never;
        readonly post?: never;
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/academic/profile": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        /**
         * The student's academic profile in the tenant
         * @description Programme, level and enrolled courses. Before the first save it answers 200 with every field null, no courses and complete false. A programme the student can no longer read reads as null with complete false, and an enrolled course the student can no longer read is left out. Student memberships only.
         */
        readonly get: operations["getAcademicProfile"];
        /**
         * Replace the student's academic profile
         * @description Replaces the programme, level and courses as a whole. Of two concurrent saves, the stored profile is exactly one of them, never a mix. Each reference must be one a student of this tenant can read: an active programme of an active department, an active level, and active courses under an active department and faculty. Anything else is VALIDATION_FAILED naming the field, the same answer whether it doesn't exist, belongs to another tenant or is archived. Student memberships only.
         */
        readonly put: operations["putAcademicProfile"];
        readonly post?: never;
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/content/my-documents": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        /**
         * Documents this student uploaded in this tenant
         * @description My Shelf. The filters match the shelf form's values; an unfilled document matches no filter.
         */
        readonly get: operations["listMyDocuments"];
        readonly put?: never;
        /**
         * Upload a private document and queue it for ingestion
         * @description The raw document is the request body. The document is private to this student. A success means the document and its queued ingestion job are committed together, so a successful upload can't be left permanently unqueued. A failure before that commit leaves no document, and any stored bytes are removed later. Type, size and SHA-256 come from the bytes; the Content-Type header decides nothing. The same key and bytes return the original document with 200. Nothing in any response shows whether another student holds the same file.
         */
        readonly post: operations["uploadMyDocument"];
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/content/my-documents/{asset_id}": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        /**
         * One of this student's documents, including its ingestion state
         * @description Poll this with bounded backoff to follow ingestion.
         */
        readonly get: operations["getMyDocument"];
        readonly put?: never;
        readonly post?: never;
        /**
         * Delete one of this student's documents
         * @description Once this succeeds, the document can't be listed, opened, retrieved or newly cited, and its derived data leaves active retrieval. Repeating it after success returns RESOURCE_NOT_FOUND.
         */
        readonly delete: operations["deleteMyDocument"];
        readonly options?: never;
        readonly head?: never;
        /**
         * Fill in the shelf form for one of this student's documents
         * @description Sets only the fields sent; null clears one. course_id must be an active course of this tenant, and level one the tenant offers. Nothing here publishes the document or changes who can read it.
         */
        readonly patch: operations["updateMyDocument"];
        readonly trace?: never;
    };
    readonly "/content/my-documents/{asset_id}/retry": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly get?: never;
        readonly put?: never;
        /**
         * Retry ingestion of a failed document
         * @description Only when ingestion.retry_available is true. A repeat while the retry is in progress returns the document's current state and starts nothing new.
         */
        readonly post: operations["retryMyDocument"];
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/content/my-documents/{asset_id}/publication-request": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly get?: never;
        readonly put?: never;
        /**
         * Ask to publish one of this student's documents to the tenant shelf
         * @description Records the student's consent and rights declaration, each with the wording version they accepted. While the tenant's mode is own_work_automatic, an own_work declaration shared with the tenant publishes at once, if the document is ready, scanned clean and its bytes aren't on the tenant's takedown blocklist. Anything else becomes requested and stays private. The answer reveals nothing about any other student. Publishing never makes a document usable in anyone's answers. A repeat returns the current state.
         */
        readonly post: operations["requestPublication"];
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/content/my-documents/{asset_id}/publication": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly get?: never;
        readonly put?: never;
        readonly post?: never;
        /**
         * Withdraw a publication or a pending request
         * @description Effective at once: the document leaves the shelf at this commit. A repeat, or a document that was never published, returns the current state.
         */
        readonly delete: operations["withdrawPublication"];
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/content/tenant-shelf": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        /**
         * Documents published to this tenant's shelf
         * @description Discoverable only by authorized students of this tenant, never the open internet. A document leaves the shelf at the commit any publication condition stops holding. No item names its uploader. Open one through /content/assets/{asset_id}.
         */
        readonly get: operations["listTenantShelf"];
        readonly put?: never;
        readonly post?: never;
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/content/tenant-shelf/{asset_id}/report": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly get?: never;
        readonly put?: never;
        /**
         * Report a published document to the tenant's takedown contact
         * @description Only a student who can see the document can report it. One active report per account per document: a repeat changes nothing. The uploader is never told who reported. Three reports from distinct students hide the document until the takedown contact reviews it; hiding is not a takedown and changes no rights or AI eligibility.
         */
        readonly post: operations["reportShelfDocument"];
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/content/sources": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        /**
         * Shared sources this student may read
         * @description Never includes another student's personal source.
         */
        readonly get: operations["listSources"];
        readonly put?: never;
        readonly post?: never;
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/content/sources/{source_id}/assets": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        /**
         * Ready documents in a shared source
         * @description Only material whose rights and audience have been verified for students.
         */
        readonly get: operations["listSourceDocuments"];
        readonly put?: never;
        readonly post?: never;
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/content/assets/{asset_id}": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        /**
         * One document this student may read
         * @description Another student's private document gives the same RESOURCE_NOT_FOUND as one that doesn't exist.
         */
        readonly get: operations["getDocument"];
        readonly put?: never;
        readonly post?: never;
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/content/assets/{asset_id}/content": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        /**
         * The document's bytes, for opening it in the app
         * @description Streamed by the backend, which authorizes every request, so there is no reusable URL and no storage address reaches the client. Supports Range requests. A failure uses the JSON error envelope.
         */
        readonly get: operations["getDocumentContent"];
        readonly put?: never;
        readonly post?: never;
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/assessment/assessments": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        /**
         * Published assessments of the tenant
         * @description Drafts never appear. Questions are available only through an attempt.
         */
        readonly get: operations["listAssessments"];
        readonly put?: never;
        readonly post?: never;
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/assessment/assessments/{assessment_id}": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        /**
         * One published assessment
         * @description A draft gives the same RESOURCE_NOT_FOUND as an assessment that doesn't exist.
         */
        readonly get: operations["getAssessment"];
        readonly put?: never;
        readonly post?: never;
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/assessment/assessments/{assessment_id}/attempts": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly get?: never;
        readonly put?: never;
        /**
         * Start an attempt, or return the one in progress
         * @description Follows the assessment's attempt_policy, which the server enforces. A new attempt needs every earlier attempt to be finalized and attempts_used below max_attempts.
         */
        readonly post: operations["startAttempt"];
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/assessment/attempts": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        /** This student's attempts in this tenant */
        readonly get: operations["listAttempts"];
        readonly put?: never;
        readonly post?: never;
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/assessment/attempts/{attempt_id}": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        /** One of this student's attempts */
        readonly get: operations["getAttempt"];
        readonly put?: never;
        readonly post?: never;
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/assessment/attempts/{attempt_id}/questions": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        /**
         * The attempt's immutable question snapshot
         * @description Never contains answer keys or explanations.
         */
        readonly get: operations["getAttemptQuestions"];
        readonly put?: never;
        readonly post?: never;
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/assessment/attempts/{attempt_id}/answers": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        /** Answers saved so far */
        readonly get: operations["getAttemptAnswers"];
        readonly put?: never;
        readonly post?: never;
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/assessment/attempts/{attempt_id}/answers/{assessment_question_id}": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly get?: never;
        /**
         * Save the answer to one question
         * @description A repeat leaves one answer.
         */
        readonly put: operations["saveAnswer"];
        readonly post?: never;
        /**
         * Remove the answer to one question
         * @description A repeat succeeds and leaves no answer.
         */
        readonly delete: operations["deleteAnswer"];
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/assessment/attempts/{attempt_id}/submit": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly get?: never;
        readonly put?: never;
        /**
         * Submit the attempt
         * @description Grades the saved answers once. A repeat returns the submitted attempt and never grades again, so a client that lost the response can safely retry. Submitting after expires_at succeeds and grades what was saved in time.
         */
        readonly post: operations["submitAttempt"];
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/assessment/attempts/{attempt_id}/result": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        /**
         * The graded result of a submitted attempt
         * @description Available only once result_visibility permits it, otherwise RESULT_NOT_RELEASED. Per-question feedback is a separate condition: is_correct and awarded_marks stay null until result and feedback are both permitted. Neither setting overrides the other, and no other route returns this feedback.
         */
        readonly get: operations["getAttemptResult"];
        readonly put?: never;
        readonly post?: never;
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/ai/conversations": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        /** This student's conversations in this tenant */
        readonly get: operations["listConversations"];
        readonly put?: never;
        /** Start an empty conversation */
        readonly post: operations["createConversation"];
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/ai/conversations/{conversation_id}": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        /** One of this student's conversations */
        readonly get: operations["getConversation"];
        readonly put?: never;
        readonly post?: never;
        /**
         * Delete one of this student's conversations
         * @description Repeating it after success returns RESOURCE_NOT_FOUND.
         */
        readonly delete: operations["deleteConversation"];
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/ai/conversations/{conversation_id}/messages": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        /** Messages of a conversation */
        readonly get: operations["listMessages"];
        readonly put?: never;
        /**
         * Ask a question in a conversation
         * @description Every question enforces ownership and eligibility: answers come only from this student's personal knowledge and institutional knowledge they're eligible for, and only from documents whose latest ingestion is ready. The turn is stored only after the AI step succeeds. The same key returns the stored turn without asking again. Each turn is answered on its own: the question doesn't see earlier turns in this contract version.
         */
        readonly post: operations["sendMessage"];
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
};
export type webhooks = Record<string, never>;
export type components = {
    schemas: {
        readonly Empty: Record<string, never>;
        readonly Meta: {
            readonly request_id: string;
        };
        readonly PageMeta: components["schemas"]["Meta"] & {
            readonly pagination: {
                readonly total: number;
                readonly limit: number;
                readonly offset: number;
            };
        };
        readonly SuccessEnvelope: {
            /** @constant */
            readonly success: true;
            readonly data: unknown;
            readonly error: null;
            readonly meta: components["schemas"]["Meta"];
        };
        readonly PageEnvelope: {
            /** @constant */
            readonly success: true;
            readonly data: readonly unknown[];
            readonly error: null;
            readonly meta: components["schemas"]["PageMeta"];
        };
        readonly ErrorEnvelope: {
            /** @constant */
            readonly success: false;
            readonly data: null;
            readonly error: components["schemas"]["Error"];
            readonly meta: components["schemas"]["Meta"];
        };
        readonly Error: {
            readonly code: components["schemas"]["ErrorCode"];
            /** @description Safe to show, and may change. Branch on code. */
            readonly message: string;
            readonly details: null | components["schemas"]["ValidationDetails"] | components["schemas"]["DuplicateDetails"];
        };
        /** @enum {string} */
        readonly ErrorCode: "TENANT_REQUIRED" | "TOKEN_INVALID" | "EMPTY_UPLOAD" | "AUTH_INVALID_CREDENTIALS" | "AUTH_TOKEN_INVALID" | "AUTH_REFRESH_INVALID" | "ACCOUNT_NOT_ACTIVE" | "EMAIL_VERIFICATION_REQUIRED" | "TENANT_ACCESS_DENIED" | "PERMISSION_DENIED" | "BAD_REQUEST" | "CURRENT_PASSWORD_INCORRECT" | "RESOURCE_NOT_FOUND" | "METHOD_NOT_ALLOWED" | "CONFLICT" | "UPLOAD_READ_TIMEOUT" | "IDEMPOTENCY_KEY_REUSED" | "DUPLICATE_CONTENT" | "INGESTION_NOT_RETRYABLE" | "ATTEMPT_ALREADY_SUBMITTED" | "ATTEMPT_EXPIRED" | "ATTEMPT_NOT_SUBMITTED" | "ATTEMPT_LIMIT_REACHED" | "RESULT_NOT_RELEASED" | "UPLOAD_TOO_LARGE" | "UNSUPPORTED_MEDIA_TYPE" | "RANGE_NOT_SATISFIABLE" | "DOCUMENT_NOT_AVAILABLE" | "DOCUMENT_NOT_READY" | "SHELF_PUBLICATION_OFF" | "VALIDATION_FAILED" | "RATE_LIMITED" | "INTERNAL_ERROR" | "AI_UPSTREAM_ERROR" | "AI_UNAVAILABLE" | "ANSWER_WITHHELD" | "TURN_IN_PROGRESS" | "OBJECT_STORAGE_UNAVAILABLE" | "SERVICE_UNAVAILABLE";
        readonly ValidationDetails: {
            readonly fields: readonly {
                readonly field: string;
                readonly code: string;
                readonly message: string;
            }[];
        };
        readonly DuplicateDetails: {
            /** @description Always one of the caller's own documents. */
            readonly existing_asset_id: string;
        };
        readonly RegisterRequest: {
            /** Format: email */
            readonly email: string;
            readonly password: string;
        };
        readonly AuthenticateRequest: {
            /** Format: email */
            readonly email: string;
            readonly password: string;
            /** @description An opaque ID the app keeps for this install. It's recorded for the user once the password verifies. If it belongs to another user, the session has no device and the sign-in still succeeds. */
            readonly device_id?: string;
            readonly user_agent?: string;
        };
        readonly RefreshRequest: {
            readonly refresh_token: string;
        };
        readonly TokenRequest: {
            readonly token: string;
        };
        readonly EmailRequest: {
            /** Format: email */
            readonly email: string;
        };
        readonly ResetPasswordRequest: {
            readonly token: string;
            readonly password: string;
        };
        readonly ChangePasswordRequest: {
            readonly current_password: string;
            readonly new_password: string;
            /** @default true */
            readonly revoke_other_sessions: boolean;
        };
        readonly AuthSession: {
            readonly user_id: string;
            readonly session_id: string;
            readonly device_id?: string | null;
            readonly access_token: string;
            /** @constant */
            readonly token_type: "Bearer";
            readonly expires_in: number;
            readonly refresh_token: string;
        };
        readonly RevokedSessions: {
            readonly revoked_sessions: number;
        };
        readonly User: {
            readonly id: string;
            /** Format: email */
            readonly email: string;
            readonly status: string;
            readonly email_verified: boolean;
        };
        readonly Membership: {
            readonly tenant_slug: string;
            readonly tenant_name: string;
            readonly membership_id: string;
            readonly role: string;
        };
        readonly Faculty: {
            readonly id: string;
            readonly name: string;
            readonly slug: string;
        };
        readonly Department: {
            readonly id: string;
            readonly faculty_id: string;
            readonly name: string;
            readonly slug: string;
        };
        /** @description Department and faculty are read from the programme, so they can't disagree with it. complete is true when a readable programme and a level are set. */
        readonly AcademicProfile: {
            readonly programme: null | components["schemas"]["ProfileProgramme"];
            readonly department: null | components["schemas"]["ProfileUnit"];
            readonly faculty: null | components["schemas"]["ProfileUnit"];
            /** @description A level code of the tenant, such as 300 */
            readonly level: number | null;
            /** @description Ordered by code, then id */
            readonly courses: readonly components["schemas"]["ProfileCourse"][];
            readonly complete: boolean;
            /** Format: date-time */
            readonly updated_at: string | null;
        };
        readonly ProfileProgramme: {
            readonly id: string;
            readonly name: string;
            readonly code: string;
        };
        readonly ProfileUnit: {
            readonly id: string;
            readonly name: string;
        };
        readonly ProfileCourse: {
            readonly id: string;
            readonly code: string;
            readonly title: string;
            readonly level: number;
            readonly semester: number;
            readonly credit_units: number;
        };
        readonly AcademicProfileUpdate: {
            readonly programme_id: string;
            readonly level: number;
            /** @description May be empty */
            readonly course_ids: readonly string[];
        };
        readonly Programme: {
            readonly id: string;
            readonly faculty_id: string;
            readonly department_id: string;
            readonly name: string;
            readonly slug: string;
            readonly code: string;
            readonly duration_years: number;
        };
        readonly Course: {
            readonly id: string;
            readonly department_id: string;
            readonly code: string;
            readonly title: string;
            readonly slug: string;
            readonly credit_units: number;
            readonly level: number;
            readonly semester: number;
            readonly description?: string | null;
        };
        readonly Topic: {
            readonly id: string;
            readonly course_id: string;
            readonly title: string;
            readonly slug: string;
            readonly description?: string | null;
            readonly sequence: number;
        };
        readonly LearningOutcome: {
            readonly id: string;
            readonly topic_id: string;
            readonly sequence: number;
            readonly description: string;
        };
        readonly ReferenceMaterial: {
            readonly id: string;
            readonly course_id: string;
            readonly title: string;
            readonly material_type: string;
            readonly url?: string | null;
        };
        readonly Source: {
            readonly id: string;
            readonly name: string;
            readonly source_type: string;
            readonly authority_level: string;
            readonly description?: string | null;
            readonly author_name?: string | null;
            readonly publisher?: string | null;
            readonly isbn_or_doi?: string | null;
            readonly source_url?: string | null;
        };
        readonly Document: {
            readonly id: string;
            readonly source_id: string;
            /** @description The file's display name */
            readonly title: string;
            /** @enum {string} */
            readonly mime_type: "application/pdf" | "image/png" | "image/jpeg";
            readonly size_bytes: number;
            /** @description Compare with the client's own hash to confirm the bytes arrived. */
            readonly content_sha256: string;
            /**
             * @description Who may view and manage the original document.
             * @enum {string}
             */
            readonly ownership: "personal" | "shared";
            /**
             * @description Whose answers its extracted content may support. Separate from ownership: being indexed never makes a personal document available to anyone else.
             * @enum {string}
             */
            readonly knowledge_scope: "personal" | "institutional";
            readonly ingestion: components["schemas"]["Ingestion"];
            /** @description From the shelf form */
            readonly course_id: string | null;
            readonly level: components["schemas"]["Level"];
            readonly semester: components["schemas"]["Semester"];
            readonly document_type: components["schemas"]["DocumentType"];
            readonly publication: components["schemas"]["Publication"];
            /** Format: date-time */
            readonly created_at: string;
            /** Format: date-time */
            readonly updated_at: string;
        };
        /**
         * @description The study level. 600 only where the tenant offers it; the tenant's levels decide, not this list.
         * @enum {integer|null}
         */
        readonly Level: 100 | 200 | 300 | 400 | 500 | 600 | null;
        /** @enum {integer|null} */
        readonly Semester: 1 | 2 | 3 | null;
        /**
         * @description The student's own description of their file. Past or upcoming examination papers aren't a type: they're never a student's own work.
         * @enum {string|null}
         */
        readonly DocumentType: "lecture_notes" | "summary" | "assignment" | "project_report" | "slides" | "other" | null;
        /** @description private is the default. published: discoverable by authorized students of this tenant only. requested: waiting for a review that isn't available yet, still private. hidden: three distinct students reported it, so it's off the shelf until the tenant's takedown contact reviews it. withdrawn by the owner, or taken_down by the tenant. None of these changes the document's knowledge_scope. */
        readonly Publication: {
            /** @enum {string} */
            readonly status: "private" | "requested" | "published" | "hidden" | "withdrawn" | "taken_down";
            /**
             * @description tenant whenever status is published or hidden; never the open internet
             * @enum {string|null}
             */
            readonly audience: "tenant" | null;
        };
        /** @description A published document as other students see it. It never names the uploader. */
        readonly ShelfDocument: {
            readonly id: string;
            readonly title: string;
            /** @enum {string} */
            readonly mime_type: "application/pdf" | "image/png" | "image/jpeg";
            readonly size_bytes: number;
            readonly course_id: string | null;
            readonly level: components["schemas"]["Level"];
            readonly semester: components["schemas"]["Semester"];
            readonly document_type: components["schemas"]["DocumentType"];
            /** @enum {string} */
            readonly audience: "tenant";
            /** Format: date-time */
            readonly published_at: string;
        };
        readonly ShelfReport: {
            /** @enum {string} */
            readonly reason: "not_own_work" | "examination_material" | "inappropriate" | "other";
            readonly detail?: string;
        };
        readonly PublicationRequest: {
            /** @description The consent wording the student accepted */
            readonly consent_version: string;
            readonly declaration: components["schemas"]["RightsDeclaration"];
        };
        /** @description What the student says about this document's rights. Recorded as what they said, not as legal clearance. Only own_work, shared with the tenant, can publish without review. */
        readonly RightsDeclaration: {
            /** @enum {string} */
            readonly rights_basis: "own_work" | "lecturer_provided" | "institution_licensed" | "publisher_licensed" | "public_domain" | "unknown";
            /** @enum {string} */
            readonly audience: "tenant";
            /** @enum {string} */
            readonly redistribution: "tenant_only" | "permitted";
            /** @description The declaration wording the student accepted */
            readonly declaration_version: string;
        };
        readonly DocumentForm: {
            readonly title?: string;
            readonly course_id?: string | null;
            readonly level?: components["schemas"]["Level"];
            readonly semester?: components["schemas"]["Semester"];
            readonly document_type?: components["schemas"]["DocumentType"];
        };
        readonly Ingestion: {
            /**
             * @description Only ready means the document can be used in answers. quarantined: waiting for its security scan; nothing opens or processes it until the scan accepts it, and an accepted document moves straight to queued. rejected: the scan refused the file; it's never served or processed, and the owner can only delete it. The scan's findings are never shown.
             * @enum {string}
             */
            readonly status: "uploaded" | "quarantined" | "rejected" | "queued" | "processing" | "extracted" | "chunked" | "indexed" | "ready" | "failed";
            /** @description The student can call retry now. */
            readonly retry_available: boolean;
            readonly failure_code: string | null;
            /** @description Safe to show. Never contains internal details. */
            readonly failure_message: string | null;
        };
        readonly Assessment: {
            readonly id: string;
            readonly course_id: string;
            readonly title: string;
            readonly instructions: string;
            readonly duration_minutes: number;
            readonly passing_score: number;
            readonly question_count: number;
            readonly attempt_policy: components["schemas"]["AttemptPolicy"];
            /** @description The attempts the caller has started, finalized or not. */
            readonly attempts_used: number;
        };
        /** @description Combinations outside these rules can't be stored. A retake needs retake_after_submission true, and exactly then max_attempts is null or above 1. after_final_attempt needs a limit, since it's never reached without one. */
        readonly AttemptPolicy: {
            /**
             * @description A label for how the assessment is used. It changes no enforcement.
             * @enum {string}
             */
            readonly kind: "practice" | "formal";
            /** @description The most attempts one student may start, finalized or not. Null means no limit. */
            readonly max_attempts: number | null;
            /** @description Whether another attempt may follow a finalized one, up to max_attempts. */
            readonly retake_after_submission: boolean;
            /**
             * @description Whether the result can be read at all. immediate means once this attempt is finalized; after_release means once it's finalized and staff have released results.
             * @enum {string}
             */
            readonly result_visibility: "immediate" | "after_release";
            /**
             * @description Whether per-question feedback can be read, as a condition separate from result_visibility. Both must permit it. immediate means once this attempt is finalized; after_final_attempt means once attempts_used equals max_attempts and all are finalized; after_release uses the same staff release as results.
             * @enum {string}
             */
            readonly feedback_timing: "immediate" | "after_final_attempt" | "after_release" | "never";
            /**
             * @description Which finalized attempt stands as the student's outcome. Each attempt's own result is unchanged.
             * @enum {string}
             */
            readonly scoring_policy: "best" | "latest" | "first";
        } & (unknown & unknown);
        readonly Attempt: {
            readonly id: string;
            readonly assessment_id: string;
            /** @enum {string} */
            readonly status: "in_progress" | "submitted";
            /** Format: date-time */
            readonly started_at: string;
            /**
             * Format: date-time
             * @description Set by the server. Answers are refused after it. Clients show time from this value.
             */
            readonly expires_at: string;
            /** Format: date-time */
            readonly submitted_at: string | null;
        };
        readonly AttemptQuestions: {
            readonly attempt_id: string;
            readonly assessment_id: string;
            readonly questions: readonly components["schemas"]["AttemptQuestion"][];
        };
        readonly AttemptQuestion: {
            readonly assessment_question_id: string;
            readonly sequence: number;
            readonly prompt: string;
            readonly marks: number;
            readonly options: readonly {
                readonly position: number;
                readonly text: string;
            }[];
        };
        readonly SaveAnswerRequest: {
            readonly selected_option_index: number;
        };
        readonly AttemptAnswer: {
            readonly attempt_id: string;
            readonly assessment_question_id: string;
            readonly selected_option_index: number;
            /** Format: date-time */
            readonly updated_at: string;
        };
        readonly AttemptAnswers: {
            readonly attempt_id: string;
            readonly answers: readonly components["schemas"]["AttemptAnswer"][];
        };
        readonly AttemptResult: {
            readonly attempt_id: string;
            readonly assessment_id: string;
            readonly total_score: number;
            readonly max_score: number;
            readonly percentage: number;
            readonly passed: boolean;
            /** Format: date-time */
            readonly graded_at: string;
            readonly breakdown: readonly components["schemas"]["QuestionResult"][];
        };
        /** @description Never contains the correct answer, a correct option, answer-key text or an explanation. On a two-option question is_correct reveals the answer, so feedback timing is a security boundary. An unanswered question scores zero. */
        readonly QuestionResult: {
            readonly assessment_question_id: string;
            readonly selected_option_index: number | null;
            /** @description Null until result and feedback are both permitted. */
            readonly awarded_marks: number | null;
            readonly max_marks: number;
            /** @description Null until result and feedback are both permitted. */
            readonly is_correct: boolean | null;
        };
        readonly Conversation: {
            readonly id: string;
            /** @description Set by the server from the first question. Null until then. */
            readonly title: string | null;
            /** Format: date-time */
            readonly created_at: string;
            /** Format: date-time */
            readonly updated_at: string;
            /**
             * Format: date-time
             * @description When an institution-specific policy removes it. Null means no such policy applies, not that it's kept forever; the default retention period still applies.
             */
            readonly expires_at: string | null;
        };
        readonly SendMessageRequest: {
            readonly message: string;
        };
        readonly ConversationMessage: {
            readonly id: string;
            /** @enum {string} */
            readonly role: "student" | "assistant";
            /** @description A redacted answer holds a fixed notice instead of its text. */
            readonly content: string;
            /** @description True when the answer used a document, cited or not, that was since deleted or that this student can no longer read. Its text and citations are then gone, and citations is empty. Always false for a student's message. */
            readonly redacted: boolean;
            /** @description Null for a student's message. */
            readonly grounded: boolean | null;
            readonly citations: readonly components["schemas"]["Citation"][];
            /** Format: date-time */
            readonly created_at: string;
        };
        readonly ChatAnswer: {
            readonly answer: string;
            /** @description False means the fixed "not covered" reply, with no citations. */
            readonly grounded: boolean;
            readonly citations: readonly components["schemas"]["Citation"][];
            readonly conversation_id: string;
            readonly request_id: string;
        };
        readonly Citation: {
            /** @description Matches the [n] in the answer text. */
            readonly number: number;
            readonly source_id: string;
            readonly asset_id: string;
            readonly title: string;
            readonly page_start: number | null;
            readonly page_end: number | null;
            /** @description From the cited passage. Never generated. */
            readonly excerpt: string;
        };
    };
    responses: {
        /** @description Done */
        readonly EmptySuccess: {
            headers: {
                readonly [name: string]: unknown;
            };
            content: {
                readonly "application/json": components["schemas"]["SuccessEnvelope"] & {
                    readonly data?: components["schemas"]["Empty"];
                };
            };
        };
        /** @description A new session or rotated tokens */
        readonly SessionIssued: {
            headers: {
                readonly [name: string]: unknown;
            };
            content: {
                readonly "application/json": components["schemas"]["SuccessEnvelope"] & {
                    readonly data?: components["schemas"]["AuthSession"];
                };
            };
        };
        /** @description How many sessions were revoked */
        readonly RevokedSessions: {
            headers: {
                readonly [name: string]: unknown;
            };
            content: {
                readonly "application/json": components["schemas"]["SuccessEnvelope"] & {
                    readonly data?: components["schemas"]["RevokedSessions"];
                };
            };
        };
        /** @description The membership. 201 if new, 200 if it already existed */
        readonly MembershipResult: {
            headers: {
                readonly [name: string]: unknown;
            };
            content: {
                readonly "application/json": components["schemas"]["SuccessEnvelope"] & {
                    readonly data?: components["schemas"]["Membership"];
                };
            };
        };
        /** @description The document. On upload, 201 if new and 200 on a replay */
        readonly DocumentResult: {
            headers: {
                readonly [name: string]: unknown;
            };
            content: {
                readonly "application/json": components["schemas"]["SuccessEnvelope"] & {
                    readonly data?: components["schemas"]["Document"];
                };
            };
        };
        /** @description The attempt. On start, 201 if new and 200 if one was in progress */
        readonly AttemptResult: {
            headers: {
                readonly [name: string]: unknown;
            };
            content: {
                readonly "application/json": components["schemas"]["SuccessEnvelope"] & {
                    readonly data?: components["schemas"]["Attempt"];
                };
            };
        };
        /** @description The conversation. On create, 201 if new and 200 on a replay */
        readonly ConversationResult: {
            headers: {
                readonly [name: string]: unknown;
            };
            content: {
                readonly "application/json": components["schemas"]["SuccessEnvelope"] & {
                    readonly data?: components["schemas"]["Conversation"];
                };
            };
        };
        /** @description TENANT_REQUIRED */
        readonly TenantRequired: {
            headers: {
                readonly [name: string]: unknown;
            };
            content: {
                readonly "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description AUTH_TOKEN_INVALID. Refresh once, then retry the request once */
        readonly Unauthorized: {
            headers: {
                readonly [name: string]: unknown;
            };
            content: {
                readonly "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description EMAIL_VERIFICATION_REQUIRED, PERMISSION_DENIED or TENANT_ACCESS_DENIED. An unknown tenant and a tenant the user doesn't belong to look the same */
        readonly Forbidden: {
            headers: {
                readonly [name: string]: unknown;
            };
            content: {
                readonly "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description RESOURCE_NOT_FOUND. Also used for another tenant's resources, another student's private resources and unpublished resources, with an identical response */
        readonly NotFound: {
            headers: {
                readonly [name: string]: unknown;
            };
            content: {
                readonly "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description ATTEMPT_ALREADY_SUBMITTED or ATTEMPT_EXPIRED */
        readonly AttemptClosed: {
            headers: {
                readonly [name: string]: unknown;
            };
            content: {
                readonly "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description VALIDATION_FAILED, with field errors. Submitted values are never echoed */
        readonly ValidationFailed: {
            headers: {
                readonly [name: string]: unknown;
            };
            content: {
                readonly "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description RATE_LIMITED. The response doesn't reveal which limit fired */
        readonly RateLimited: {
            headers: {
                readonly "Retry-After"?: number;
                readonly [name: string]: unknown;
            };
            content: {
                readonly "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description INTERNAL_ERROR. Never contains exception text */
        readonly InternalError: {
            headers: {
                readonly [name: string]: unknown;
            };
            content: {
                readonly "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description AI_UNAVAILABLE or OBJECT_STORAGE_UNAVAILABLE */
        readonly Unavailable: {
            headers: {
                readonly "Retry-After"?: number;
                readonly [name: string]: unknown;
            };
            content: {
                readonly "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
    };
    parameters: {
        /** @description The selected tenant. Context, not proof; membership is checked on every request. */
        readonly TenantSlug: string;
        readonly IdempotencyKey: string;
        readonly ShelfLevel: 100 | 200 | 300 | 400 | 500 | 600;
        readonly ShelfCourseId: string;
        readonly Limit: number;
        readonly Offset: number;
        readonly CourseId: string;
        readonly TopicId: string;
        readonly AssetId: string;
        readonly AssessmentId: string;
        readonly AttemptId: string;
        readonly AssessmentQuestionId: string;
        readonly ConversationId: string;
    };
    requestBodies: never;
    headers: never;
    pathItems: never;
};
export type $defs = Record<string, never>;
export interface operations {
    readonly registerUser: {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly requestBody: {
            readonly content: {
                readonly "application/json": components["schemas"]["RegisterRequest"];
            };
        };
        readonly responses: {
            /** @description Accepted, with no response body */
            readonly 202: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content?: never;
            };
            readonly 422: components["responses"]["ValidationFailed"];
            readonly 429: components["responses"]["RateLimited"];
            readonly 500: components["responses"]["InternalError"];
        };
    };
    readonly authenticate: {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly requestBody: {
            readonly content: {
                readonly "application/json": components["schemas"]["AuthenticateRequest"];
            };
        };
        readonly responses: {
            readonly 200: components["responses"]["SessionIssued"];
            /** @description AUTH_INVALID_CREDENTIALS, with the same response for an unknown account and a wrong password */
            readonly 401: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description ACCOUNT_NOT_ACTIVE */
            readonly 403: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            readonly 422: components["responses"]["ValidationFailed"];
            readonly 429: components["responses"]["RateLimited"];
            readonly 500: components["responses"]["InternalError"];
        };
    };
    readonly refreshSession: {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly requestBody: {
            readonly content: {
                readonly "application/json": components["schemas"]["RefreshRequest"];
            };
        };
        readonly responses: {
            readonly 200: components["responses"]["SessionIssued"];
            /** @description AUTH_REFRESH_INVALID. Expired, revoked and reused tokens look the same */
            readonly 401: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            readonly 422: components["responses"]["ValidationFailed"];
            readonly 429: components["responses"]["RateLimited"];
            readonly 500: components["responses"]["InternalError"];
        };
    };
    readonly logout: {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly requestBody?: never;
        readonly responses: {
            readonly 200: components["responses"]["EmptySuccess"];
            readonly 401: components["responses"]["Unauthorized"];
            readonly 429: components["responses"]["RateLimited"];
            readonly 500: components["responses"]["InternalError"];
        };
    };
    readonly logoutAll: {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly requestBody?: never;
        readonly responses: {
            readonly 200: components["responses"]["RevokedSessions"];
            /** @description CURRENT_PASSWORD_INCORRECT. Not 401, which tells a client to refresh and retry */
            readonly 400: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            readonly 401: components["responses"]["Unauthorized"];
            readonly 429: components["responses"]["RateLimited"];
            readonly 500: components["responses"]["InternalError"];
        };
    };
    readonly getCurrentUser: {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly requestBody?: never;
        readonly responses: {
            /** @description The user */
            readonly 200: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["SuccessEnvelope"] & {
                        readonly data?: components["schemas"]["User"];
                    };
                };
            };
            readonly 401: components["responses"]["Unauthorized"];
            readonly 429: components["responses"]["RateLimited"];
            readonly 500: components["responses"]["InternalError"];
        };
    };
    readonly listMemberships: {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly requestBody?: never;
        readonly responses: {
            /** @description Memberships */
            readonly 200: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["SuccessEnvelope"] & {
                        readonly data?: readonly components["schemas"]["Membership"][];
                    };
                };
            };
            readonly 401: components["responses"]["Unauthorized"];
            readonly 429: components["responses"]["RateLimited"];
            readonly 500: components["responses"]["InternalError"];
        };
    };
    readonly verifyEmail: {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly requestBody: {
            readonly content: {
                readonly "application/json": components["schemas"]["TokenRequest"];
            };
        };
        readonly responses: {
            readonly 200: components["responses"]["EmptySuccess"];
            /** @description TOKEN_INVALID. Expired, used and unknown tokens look the same */
            readonly 400: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            readonly 422: components["responses"]["ValidationFailed"];
            readonly 429: components["responses"]["RateLimited"];
            readonly 500: components["responses"]["InternalError"];
        };
    };
    readonly resendVerification: {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly requestBody: {
            readonly content: {
                readonly "application/json": components["schemas"]["EmailRequest"];
            };
        };
        readonly responses: {
            readonly 200: components["responses"]["EmptySuccess"];
            readonly 422: components["responses"]["ValidationFailed"];
            readonly 429: components["responses"]["RateLimited"];
            readonly 500: components["responses"]["InternalError"];
        };
    };
    readonly forgotPassword: {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly requestBody: {
            readonly content: {
                readonly "application/json": components["schemas"]["EmailRequest"];
            };
        };
        readonly responses: {
            readonly 200: components["responses"]["EmptySuccess"];
            readonly 422: components["responses"]["ValidationFailed"];
            readonly 429: components["responses"]["RateLimited"];
            readonly 500: components["responses"]["InternalError"];
        };
    };
    readonly resetPassword: {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly requestBody: {
            readonly content: {
                readonly "application/json": components["schemas"]["ResetPasswordRequest"];
            };
        };
        readonly responses: {
            readonly 200: components["responses"]["EmptySuccess"];
            /** @description TOKEN_INVALID. Expired, used and unknown tokens look the same */
            readonly 400: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            readonly 422: components["responses"]["ValidationFailed"];
            readonly 429: components["responses"]["RateLimited"];
            readonly 500: components["responses"]["InternalError"];
        };
    };
    readonly changePassword: {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly requestBody: {
            readonly content: {
                readonly "application/json": components["schemas"]["ChangePasswordRequest"];
            };
        };
        readonly responses: {
            readonly 200: components["responses"]["RevokedSessions"];
            /** @description CURRENT_PASSWORD_INCORRECT. Not 401, which tells a client to refresh and retry */
            readonly 400: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            readonly 401: components["responses"]["Unauthorized"];
            readonly 422: components["responses"]["ValidationFailed"];
            readonly 429: components["responses"]["RateLimited"];
            readonly 500: components["responses"]["InternalError"];
        };
    };
    readonly joinTenant: {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path: {
                readonly slug: string;
            };
            readonly cookie?: never;
        };
        readonly requestBody?: never;
        readonly responses: {
            readonly 200: components["responses"]["MembershipResult"];
            readonly 201: components["responses"]["MembershipResult"];
            readonly 401: components["responses"]["Unauthorized"];
            /** @description EMAIL_VERIFICATION_REQUIRED or TENANT_ACCESS_DENIED */
            readonly 403: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            readonly 422: components["responses"]["ValidationFailed"];
            readonly 429: components["responses"]["RateLimited"];
            readonly 500: components["responses"]["InternalError"];
        };
    };
    readonly acceptInvitation: {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly requestBody: {
            readonly content: {
                readonly "application/json": components["schemas"]["TokenRequest"];
            };
        };
        readonly responses: {
            readonly 200: components["responses"]["MembershipResult"];
            /** @description TOKEN_INVALID. Expired, used, unknown and other users' tokens look the same */
            readonly 400: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            readonly 401: components["responses"]["Unauthorized"];
            /** @description EMAIL_VERIFICATION_REQUIRED */
            readonly 403: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            readonly 422: components["responses"]["ValidationFailed"];
            readonly 429: components["responses"]["RateLimited"];
            readonly 500: components["responses"]["InternalError"];
        };
    };
    readonly listFaculties: {
        readonly parameters: {
            readonly query?: {
                readonly limit?: components["parameters"]["Limit"];
                readonly offset?: components["parameters"]["Offset"];
            };
            readonly header: {
                /** @description The selected tenant. Context, not proof; membership is checked on every request. */
                readonly "X-Tenant-Slug": components["parameters"]["TenantSlug"];
            };
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly requestBody?: never;
        readonly responses: {
            /** @description Faculties, ordered by name then id */
            readonly 200: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["PageEnvelope"] & {
                        readonly data?: readonly components["schemas"]["Faculty"][];
                    };
                };
            };
            readonly 400: components["responses"]["TenantRequired"];
            readonly 401: components["responses"]["Unauthorized"];
            readonly 403: components["responses"]["Forbidden"];
            readonly 422: components["responses"]["ValidationFailed"];
            readonly 429: components["responses"]["RateLimited"];
            readonly 500: components["responses"]["InternalError"];
        };
    };
    readonly listDepartments: {
        readonly parameters: {
            readonly query?: {
                readonly faculty_id?: string;
                readonly limit?: components["parameters"]["Limit"];
                readonly offset?: components["parameters"]["Offset"];
            };
            readonly header: {
                /** @description The selected tenant. Context, not proof; membership is checked on every request. */
                readonly "X-Tenant-Slug": components["parameters"]["TenantSlug"];
            };
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly requestBody?: never;
        readonly responses: {
            /** @description Departments, ordered by name then id */
            readonly 200: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["PageEnvelope"] & {
                        readonly data?: readonly components["schemas"]["Department"][];
                    };
                };
            };
            readonly 400: components["responses"]["TenantRequired"];
            readonly 401: components["responses"]["Unauthorized"];
            readonly 403: components["responses"]["Forbidden"];
            readonly 422: components["responses"]["ValidationFailed"];
            readonly 429: components["responses"]["RateLimited"];
            readonly 500: components["responses"]["InternalError"];
        };
    };
    readonly listProgrammes: {
        readonly parameters: {
            readonly query?: {
                readonly department_id?: string;
                readonly limit?: components["parameters"]["Limit"];
                readonly offset?: components["parameters"]["Offset"];
            };
            readonly header: {
                /** @description The selected tenant. Context, not proof; membership is checked on every request. */
                readonly "X-Tenant-Slug": components["parameters"]["TenantSlug"];
            };
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly requestBody?: never;
        readonly responses: {
            /** @description Programmes, ordered by name then id */
            readonly 200: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["PageEnvelope"] & {
                        readonly data?: readonly components["schemas"]["Programme"][];
                    };
                };
            };
            readonly 400: components["responses"]["TenantRequired"];
            readonly 401: components["responses"]["Unauthorized"];
            readonly 403: components["responses"]["Forbidden"];
            readonly 422: components["responses"]["ValidationFailed"];
            readonly 429: components["responses"]["RateLimited"];
            readonly 500: components["responses"]["InternalError"];
        };
    };
    readonly listCourses: {
        readonly parameters: {
            readonly query?: {
                readonly department_id?: string;
                readonly limit?: components["parameters"]["Limit"];
                readonly offset?: components["parameters"]["Offset"];
            };
            readonly header: {
                /** @description The selected tenant. Context, not proof; membership is checked on every request. */
                readonly "X-Tenant-Slug": components["parameters"]["TenantSlug"];
            };
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly requestBody?: never;
        readonly responses: {
            /** @description Courses, ordered by code then id. Unpublished courses never appear */
            readonly 200: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["PageEnvelope"] & {
                        readonly data?: readonly components["schemas"]["Course"][];
                    };
                };
            };
            readonly 400: components["responses"]["TenantRequired"];
            readonly 401: components["responses"]["Unauthorized"];
            readonly 403: components["responses"]["Forbidden"];
            readonly 422: components["responses"]["ValidationFailed"];
            readonly 429: components["responses"]["RateLimited"];
            readonly 500: components["responses"]["InternalError"];
        };
    };
    readonly getCourse: {
        readonly parameters: {
            readonly query?: never;
            readonly header: {
                /** @description The selected tenant. Context, not proof; membership is checked on every request. */
                readonly "X-Tenant-Slug": components["parameters"]["TenantSlug"];
            };
            readonly path: {
                readonly course_id: components["parameters"]["CourseId"];
            };
            readonly cookie?: never;
        };
        readonly requestBody?: never;
        readonly responses: {
            /** @description The course */
            readonly 200: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["SuccessEnvelope"] & {
                        readonly data?: components["schemas"]["Course"];
                    };
                };
            };
            readonly 400: components["responses"]["TenantRequired"];
            readonly 401: components["responses"]["Unauthorized"];
            readonly 403: components["responses"]["Forbidden"];
            readonly 404: components["responses"]["NotFound"];
            readonly 429: components["responses"]["RateLimited"];
            readonly 500: components["responses"]["InternalError"];
        };
    };
    readonly listTopics: {
        readonly parameters: {
            readonly query?: {
                readonly limit?: components["parameters"]["Limit"];
                readonly offset?: components["parameters"]["Offset"];
            };
            readonly header: {
                /** @description The selected tenant. Context, not proof; membership is checked on every request. */
                readonly "X-Tenant-Slug": components["parameters"]["TenantSlug"];
            };
            readonly path: {
                readonly course_id: components["parameters"]["CourseId"];
            };
            readonly cookie?: never;
        };
        readonly requestBody?: never;
        readonly responses: {
            /** @description Topics, ordered by sequence then id */
            readonly 200: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["PageEnvelope"] & {
                        readonly data?: readonly components["schemas"]["Topic"][];
                    };
                };
            };
            readonly 400: components["responses"]["TenantRequired"];
            readonly 401: components["responses"]["Unauthorized"];
            readonly 403: components["responses"]["Forbidden"];
            readonly 404: components["responses"]["NotFound"];
            readonly 422: components["responses"]["ValidationFailed"];
            readonly 429: components["responses"]["RateLimited"];
            readonly 500: components["responses"]["InternalError"];
        };
    };
    readonly listLearningOutcomes: {
        readonly parameters: {
            readonly query?: {
                readonly limit?: components["parameters"]["Limit"];
                readonly offset?: components["parameters"]["Offset"];
            };
            readonly header: {
                /** @description The selected tenant. Context, not proof; membership is checked on every request. */
                readonly "X-Tenant-Slug": components["parameters"]["TenantSlug"];
            };
            readonly path: {
                readonly topic_id: components["parameters"]["TopicId"];
            };
            readonly cookie?: never;
        };
        readonly requestBody?: never;
        readonly responses: {
            /** @description Learning outcomes, ordered by sequence then id */
            readonly 200: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["PageEnvelope"] & {
                        readonly data?: readonly components["schemas"]["LearningOutcome"][];
                    };
                };
            };
            readonly 400: components["responses"]["TenantRequired"];
            readonly 401: components["responses"]["Unauthorized"];
            readonly 403: components["responses"]["Forbidden"];
            readonly 404: components["responses"]["NotFound"];
            readonly 422: components["responses"]["ValidationFailed"];
            readonly 429: components["responses"]["RateLimited"];
            readonly 500: components["responses"]["InternalError"];
        };
    };
    readonly listReferenceMaterials: {
        readonly parameters: {
            readonly query?: {
                readonly limit?: components["parameters"]["Limit"];
                readonly offset?: components["parameters"]["Offset"];
            };
            readonly header: {
                /** @description The selected tenant. Context, not proof; membership is checked on every request. */
                readonly "X-Tenant-Slug": components["parameters"]["TenantSlug"];
            };
            readonly path: {
                readonly topic_id: components["parameters"]["TopicId"];
            };
            readonly cookie?: never;
        };
        readonly requestBody?: never;
        readonly responses: {
            /** @description Reference materials, ordered by title then id */
            readonly 200: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["PageEnvelope"] & {
                        readonly data?: readonly components["schemas"]["ReferenceMaterial"][];
                    };
                };
            };
            readonly 400: components["responses"]["TenantRequired"];
            readonly 401: components["responses"]["Unauthorized"];
            readonly 403: components["responses"]["Forbidden"];
            readonly 404: components["responses"]["NotFound"];
            readonly 422: components["responses"]["ValidationFailed"];
            readonly 429: components["responses"]["RateLimited"];
            readonly 500: components["responses"]["InternalError"];
        };
    };
    readonly getAcademicProfile: {
        readonly parameters: {
            readonly query?: never;
            readonly header: {
                /** @description The selected tenant. Context, not proof; membership is checked on every request. */
                readonly "X-Tenant-Slug": components["parameters"]["TenantSlug"];
            };
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly requestBody?: never;
        readonly responses: {
            /** @description The profile */
            readonly 200: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["SuccessEnvelope"] & {
                        readonly data?: components["schemas"]["AcademicProfile"];
                    };
                };
            };
            readonly 400: components["responses"]["TenantRequired"];
            readonly 401: components["responses"]["Unauthorized"];
            readonly 403: components["responses"]["Forbidden"];
            readonly 429: components["responses"]["RateLimited"];
            readonly 500: components["responses"]["InternalError"];
        };
    };
    readonly putAcademicProfile: {
        readonly parameters: {
            readonly query?: never;
            readonly header: {
                /** @description The selected tenant. Context, not proof; membership is checked on every request. */
                readonly "X-Tenant-Slug": components["parameters"]["TenantSlug"];
            };
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly requestBody: {
            readonly content: {
                readonly "application/json": components["schemas"]["AcademicProfileUpdate"];
            };
        };
        readonly responses: {
            /** @description The stored profile */
            readonly 200: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["SuccessEnvelope"] & {
                        readonly data?: components["schemas"]["AcademicProfile"];
                    };
                };
            };
            readonly 400: components["responses"]["TenantRequired"];
            readonly 401: components["responses"]["Unauthorized"];
            readonly 403: components["responses"]["Forbidden"];
            readonly 422: components["responses"]["ValidationFailed"];
            readonly 429: components["responses"]["RateLimited"];
            readonly 500: components["responses"]["InternalError"];
        };
    };
    readonly listMyDocuments: {
        readonly parameters: {
            readonly query?: {
                readonly level?: components["parameters"]["ShelfLevel"];
                readonly course_id?: components["parameters"]["ShelfCourseId"];
                readonly limit?: components["parameters"]["Limit"];
                readonly offset?: components["parameters"]["Offset"];
            };
            readonly header: {
                /** @description The selected tenant. Context, not proof; membership is checked on every request. */
                readonly "X-Tenant-Slug": components["parameters"]["TenantSlug"];
            };
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly requestBody?: never;
        readonly responses: {
            /** @description Documents, newest first, then by id */
            readonly 200: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["PageEnvelope"] & {
                        readonly data?: readonly components["schemas"]["Document"][];
                    };
                };
            };
            readonly 400: components["responses"]["TenantRequired"];
            readonly 401: components["responses"]["Unauthorized"];
            readonly 403: components["responses"]["Forbidden"];
            readonly 422: components["responses"]["ValidationFailed"];
            readonly 429: components["responses"]["RateLimited"];
            readonly 500: components["responses"]["InternalError"];
        };
    };
    readonly uploadMyDocument: {
        readonly parameters: {
            readonly query?: {
                /** @description Display name only, percent-encoded */
                readonly file_name?: string;
            };
            readonly header: {
                /** @description The selected tenant. Context, not proof; membership is checked on every request. */
                readonly "X-Tenant-Slug": components["parameters"]["TenantSlug"];
                readonly "Idempotency-Key": components["parameters"]["IdempotencyKey"];
            };
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly requestBody: {
            readonly content: {
                readonly "application/octet-stream": string;
            };
        };
        readonly responses: {
            readonly 200: components["responses"]["DocumentResult"];
            readonly 201: components["responses"]["DocumentResult"];
            /** @description TENANT_REQUIRED or EMPTY_UPLOAD */
            readonly 400: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            readonly 401: components["responses"]["Unauthorized"];
            readonly 403: components["responses"]["Forbidden"];
            /** @description UPLOAD_READ_TIMEOUT. Retry with the same key */
            readonly 408: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description IDEMPOTENCY_KEY_REUSED, or DUPLICATE_CONTENT when this student already holds these bytes. existing_asset_id only ever names the caller's own document */
            readonly 409: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description UPLOAD_TOO_LARGE */
            readonly 413: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description UNSUPPORTED_MEDIA_TYPE. PDF, PNG and JPEG are accepted */
            readonly 415: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            readonly 422: components["responses"]["ValidationFailed"];
            readonly 429: components["responses"]["RateLimited"];
            readonly 500: components["responses"]["InternalError"];
            readonly 503: components["responses"]["Unavailable"];
        };
    };
    readonly getMyDocument: {
        readonly parameters: {
            readonly query?: never;
            readonly header: {
                /** @description The selected tenant. Context, not proof; membership is checked on every request. */
                readonly "X-Tenant-Slug": components["parameters"]["TenantSlug"];
            };
            readonly path: {
                readonly asset_id: components["parameters"]["AssetId"];
            };
            readonly cookie?: never;
        };
        readonly requestBody?: never;
        readonly responses: {
            readonly 200: components["responses"]["DocumentResult"];
            readonly 400: components["responses"]["TenantRequired"];
            readonly 401: components["responses"]["Unauthorized"];
            readonly 403: components["responses"]["Forbidden"];
            readonly 404: components["responses"]["NotFound"];
            readonly 429: components["responses"]["RateLimited"];
            readonly 500: components["responses"]["InternalError"];
        };
    };
    readonly deleteMyDocument: {
        readonly parameters: {
            readonly query?: never;
            readonly header: {
                /** @description The selected tenant. Context, not proof; membership is checked on every request. */
                readonly "X-Tenant-Slug": components["parameters"]["TenantSlug"];
            };
            readonly path: {
                readonly asset_id: components["parameters"]["AssetId"];
            };
            readonly cookie?: never;
        };
        readonly requestBody?: never;
        readonly responses: {
            readonly 200: components["responses"]["EmptySuccess"];
            readonly 400: components["responses"]["TenantRequired"];
            readonly 401: components["responses"]["Unauthorized"];
            readonly 403: components["responses"]["Forbidden"];
            readonly 404: components["responses"]["NotFound"];
            readonly 429: components["responses"]["RateLimited"];
            readonly 500: components["responses"]["InternalError"];
        };
    };
    readonly updateMyDocument: {
        readonly parameters: {
            readonly query?: never;
            readonly header: {
                /** @description The selected tenant. Context, not proof; membership is checked on every request. */
                readonly "X-Tenant-Slug": components["parameters"]["TenantSlug"];
            };
            readonly path: {
                readonly asset_id: components["parameters"]["AssetId"];
            };
            readonly cookie?: never;
        };
        readonly requestBody: {
            readonly content: {
                readonly "application/json": components["schemas"]["DocumentForm"];
            };
        };
        readonly responses: {
            readonly 200: components["responses"]["DocumentResult"];
            readonly 400: components["responses"]["TenantRequired"];
            readonly 401: components["responses"]["Unauthorized"];
            readonly 403: components["responses"]["Forbidden"];
            readonly 404: components["responses"]["NotFound"];
            readonly 422: components["responses"]["ValidationFailed"];
            readonly 429: components["responses"]["RateLimited"];
            readonly 500: components["responses"]["InternalError"];
        };
    };
    readonly retryMyDocument: {
        readonly parameters: {
            readonly query?: never;
            readonly header: {
                /** @description The selected tenant. Context, not proof; membership is checked on every request. */
                readonly "X-Tenant-Slug": components["parameters"]["TenantSlug"];
            };
            readonly path: {
                readonly asset_id: components["parameters"]["AssetId"];
            };
            readonly cookie?: never;
        };
        readonly requestBody?: never;
        readonly responses: {
            readonly 200: components["responses"]["DocumentResult"];
            readonly 400: components["responses"]["TenantRequired"];
            readonly 401: components["responses"]["Unauthorized"];
            readonly 403: components["responses"]["Forbidden"];
            readonly 404: components["responses"]["NotFound"];
            /** @description INGESTION_NOT_RETRYABLE */
            readonly 409: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            readonly 429: components["responses"]["RateLimited"];
            readonly 500: components["responses"]["InternalError"];
        };
    };
    readonly requestPublication: {
        readonly parameters: {
            readonly query?: never;
            readonly header: {
                /** @description The selected tenant. Context, not proof; membership is checked on every request. */
                readonly "X-Tenant-Slug": components["parameters"]["TenantSlug"];
            };
            readonly path: {
                readonly asset_id: components["parameters"]["AssetId"];
            };
            readonly cookie?: never;
        };
        readonly requestBody: {
            readonly content: {
                readonly "application/json": components["schemas"]["PublicationRequest"];
            };
        };
        readonly responses: {
            readonly 200: components["responses"]["DocumentResult"];
            readonly 400: components["responses"]["TenantRequired"];
            readonly 401: components["responses"]["Unauthorized"];
            readonly 403: components["responses"]["Forbidden"];
            readonly 404: components["responses"]["NotFound"];
            /** @description DOCUMENT_NOT_READY, or SHELF_PUBLICATION_OFF while the tenant's shelf is off */
            readonly 409: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            readonly 422: components["responses"]["ValidationFailed"];
            readonly 429: components["responses"]["RateLimited"];
            readonly 500: components["responses"]["InternalError"];
        };
    };
    readonly withdrawPublication: {
        readonly parameters: {
            readonly query?: never;
            readonly header: {
                /** @description The selected tenant. Context, not proof; membership is checked on every request. */
                readonly "X-Tenant-Slug": components["parameters"]["TenantSlug"];
            };
            readonly path: {
                readonly asset_id: components["parameters"]["AssetId"];
            };
            readonly cookie?: never;
        };
        readonly requestBody?: never;
        readonly responses: {
            readonly 200: components["responses"]["DocumentResult"];
            readonly 400: components["responses"]["TenantRequired"];
            readonly 401: components["responses"]["Unauthorized"];
            readonly 403: components["responses"]["Forbidden"];
            readonly 404: components["responses"]["NotFound"];
            readonly 429: components["responses"]["RateLimited"];
            readonly 500: components["responses"]["InternalError"];
        };
    };
    readonly listTenantShelf: {
        readonly parameters: {
            readonly query?: {
                readonly level?: components["parameters"]["ShelfLevel"];
                readonly course_id?: components["parameters"]["ShelfCourseId"];
                readonly limit?: components["parameters"]["Limit"];
                readonly offset?: components["parameters"]["Offset"];
            };
            readonly header: {
                /** @description The selected tenant. Context, not proof; membership is checked on every request. */
                readonly "X-Tenant-Slug": components["parameters"]["TenantSlug"];
            };
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly requestBody?: never;
        readonly responses: {
            /** @description Published documents, newest publication first, then by id */
            readonly 200: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["PageEnvelope"] & {
                        readonly data?: readonly components["schemas"]["ShelfDocument"][];
                    };
                };
            };
            readonly 400: components["responses"]["TenantRequired"];
            readonly 401: components["responses"]["Unauthorized"];
            readonly 403: components["responses"]["Forbidden"];
            readonly 422: components["responses"]["ValidationFailed"];
            readonly 429: components["responses"]["RateLimited"];
            readonly 500: components["responses"]["InternalError"];
        };
    };
    readonly reportShelfDocument: {
        readonly parameters: {
            readonly query?: never;
            readonly header: {
                /** @description The selected tenant. Context, not proof; membership is checked on every request. */
                readonly "X-Tenant-Slug": components["parameters"]["TenantSlug"];
            };
            readonly path: {
                readonly asset_id: components["parameters"]["AssetId"];
            };
            readonly cookie?: never;
        };
        readonly requestBody: {
            readonly content: {
                readonly "application/json": components["schemas"]["ShelfReport"];
            };
        };
        readonly responses: {
            readonly 200: components["responses"]["EmptySuccess"];
            readonly 400: components["responses"]["TenantRequired"];
            readonly 401: components["responses"]["Unauthorized"];
            readonly 403: components["responses"]["Forbidden"];
            readonly 404: components["responses"]["NotFound"];
            readonly 422: components["responses"]["ValidationFailed"];
            readonly 429: components["responses"]["RateLimited"];
            readonly 500: components["responses"]["InternalError"];
        };
    };
    readonly listSources: {
        readonly parameters: {
            readonly query?: {
                readonly limit?: components["parameters"]["Limit"];
                readonly offset?: components["parameters"]["Offset"];
            };
            readonly header: {
                /** @description The selected tenant. Context, not proof; membership is checked on every request. */
                readonly "X-Tenant-Slug": components["parameters"]["TenantSlug"];
            };
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly requestBody?: never;
        readonly responses: {
            /** @description Sources, ordered by name then id */
            readonly 200: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["PageEnvelope"] & {
                        readonly data?: readonly components["schemas"]["Source"][];
                    };
                };
            };
            readonly 400: components["responses"]["TenantRequired"];
            readonly 401: components["responses"]["Unauthorized"];
            readonly 403: components["responses"]["Forbidden"];
            readonly 422: components["responses"]["ValidationFailed"];
            readonly 429: components["responses"]["RateLimited"];
            readonly 500: components["responses"]["InternalError"];
        };
    };
    readonly listSourceDocuments: {
        readonly parameters: {
            readonly query?: {
                readonly limit?: components["parameters"]["Limit"];
                readonly offset?: components["parameters"]["Offset"];
            };
            readonly header: {
                /** @description The selected tenant. Context, not proof; membership is checked on every request. */
                readonly "X-Tenant-Slug": components["parameters"]["TenantSlug"];
            };
            readonly path: {
                readonly source_id: string;
            };
            readonly cookie?: never;
        };
        readonly requestBody?: never;
        readonly responses: {
            /** @description Documents, newest first, then by id. Superseded and revoked versions never appear */
            readonly 200: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["PageEnvelope"] & {
                        readonly data?: readonly components["schemas"]["Document"][];
                    };
                };
            };
            readonly 400: components["responses"]["TenantRequired"];
            readonly 401: components["responses"]["Unauthorized"];
            readonly 403: components["responses"]["Forbidden"];
            readonly 404: components["responses"]["NotFound"];
            readonly 422: components["responses"]["ValidationFailed"];
            readonly 429: components["responses"]["RateLimited"];
            readonly 500: components["responses"]["InternalError"];
        };
    };
    readonly getDocument: {
        readonly parameters: {
            readonly query?: never;
            readonly header: {
                /** @description The selected tenant. Context, not proof; membership is checked on every request. */
                readonly "X-Tenant-Slug": components["parameters"]["TenantSlug"];
            };
            readonly path: {
                readonly asset_id: components["parameters"]["AssetId"];
            };
            readonly cookie?: never;
        };
        readonly requestBody?: never;
        readonly responses: {
            readonly 200: components["responses"]["DocumentResult"];
            readonly 400: components["responses"]["TenantRequired"];
            readonly 401: components["responses"]["Unauthorized"];
            readonly 403: components["responses"]["Forbidden"];
            readonly 404: components["responses"]["NotFound"];
            readonly 429: components["responses"]["RateLimited"];
            readonly 500: components["responses"]["InternalError"];
        };
    };
    readonly getDocumentContent: {
        readonly parameters: {
            readonly query?: never;
            readonly header: {
                /** @description The selected tenant. Context, not proof; membership is checked on every request. */
                readonly "X-Tenant-Slug": components["parameters"]["TenantSlug"];
                readonly Range?: string;
            };
            readonly path: {
                readonly asset_id: components["parameters"]["AssetId"];
            };
            readonly cookie?: never;
        };
        readonly requestBody?: never;
        readonly responses: {
            /** @description The whole document */
            readonly 200: {
                headers: {
                    readonly ETag?: string;
                    readonly "Accept-Ranges"?: string;
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/pdf": string;
                    readonly "image/png": string;
                    readonly "image/jpeg": string;
                };
            };
            /** @description The requested range */
            readonly 206: {
                headers: {
                    readonly ETag?: string;
                    readonly "Content-Range"?: string;
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/pdf": string;
                    readonly "image/png": string;
                    readonly "image/jpeg": string;
                };
            };
            readonly 400: components["responses"]["TenantRequired"];
            readonly 401: components["responses"]["Unauthorized"];
            readonly 403: components["responses"]["Forbidden"];
            readonly 404: components["responses"]["NotFound"];
            /** @description DOCUMENT_NOT_AVAILABLE: the owner's document is quarantined or rejected by its security scan, so its bytes aren't served, to its owner included */
            readonly 409: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description RANGE_NOT_SATISFIABLE */
            readonly 416: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            readonly 429: components["responses"]["RateLimited"];
            readonly 500: components["responses"]["InternalError"];
            readonly 503: components["responses"]["Unavailable"];
        };
    };
    readonly listAssessments: {
        readonly parameters: {
            readonly query?: {
                readonly course_id?: string;
                readonly limit?: components["parameters"]["Limit"];
                readonly offset?: components["parameters"]["Offset"];
            };
            readonly header: {
                /** @description The selected tenant. Context, not proof; membership is checked on every request. */
                readonly "X-Tenant-Slug": components["parameters"]["TenantSlug"];
            };
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly requestBody?: never;
        readonly responses: {
            /** @description Assessments, newest first, then by id */
            readonly 200: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["PageEnvelope"] & {
                        readonly data?: readonly components["schemas"]["Assessment"][];
                    };
                };
            };
            readonly 400: components["responses"]["TenantRequired"];
            readonly 401: components["responses"]["Unauthorized"];
            readonly 403: components["responses"]["Forbidden"];
            readonly 422: components["responses"]["ValidationFailed"];
            readonly 429: components["responses"]["RateLimited"];
            readonly 500: components["responses"]["InternalError"];
        };
    };
    readonly getAssessment: {
        readonly parameters: {
            readonly query?: never;
            readonly header: {
                /** @description The selected tenant. Context, not proof; membership is checked on every request. */
                readonly "X-Tenant-Slug": components["parameters"]["TenantSlug"];
            };
            readonly path: {
                readonly assessment_id: components["parameters"]["AssessmentId"];
            };
            readonly cookie?: never;
        };
        readonly requestBody?: never;
        readonly responses: {
            /** @description The assessment, without its questions */
            readonly 200: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["SuccessEnvelope"] & {
                        readonly data?: components["schemas"]["Assessment"];
                    };
                };
            };
            readonly 400: components["responses"]["TenantRequired"];
            readonly 401: components["responses"]["Unauthorized"];
            readonly 403: components["responses"]["Forbidden"];
            readonly 404: components["responses"]["NotFound"];
            readonly 429: components["responses"]["RateLimited"];
            readonly 500: components["responses"]["InternalError"];
        };
    };
    readonly startAttempt: {
        readonly parameters: {
            readonly query?: never;
            readonly header: {
                /** @description The selected tenant. Context, not proof; membership is checked on every request. */
                readonly "X-Tenant-Slug": components["parameters"]["TenantSlug"];
            };
            readonly path: {
                readonly assessment_id: components["parameters"]["AssessmentId"];
            };
            readonly cookie?: never;
        };
        readonly requestBody?: never;
        readonly responses: {
            readonly 200: components["responses"]["AttemptResult"];
            readonly 201: components["responses"]["AttemptResult"];
            readonly 400: components["responses"]["TenantRequired"];
            readonly 401: components["responses"]["Unauthorized"];
            readonly 403: components["responses"]["Forbidden"];
            readonly 404: components["responses"]["NotFound"];
            /** @description ATTEMPT_LIMIT_REACHED */
            readonly 409: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            readonly 429: components["responses"]["RateLimited"];
            readonly 500: components["responses"]["InternalError"];
        };
    };
    readonly listAttempts: {
        readonly parameters: {
            readonly query?: {
                readonly limit?: components["parameters"]["Limit"];
                readonly offset?: components["parameters"]["Offset"];
            };
            readonly header: {
                /** @description The selected tenant. Context, not proof; membership is checked on every request. */
                readonly "X-Tenant-Slug": components["parameters"]["TenantSlug"];
            };
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly requestBody?: never;
        readonly responses: {
            /** @description Attempts, newest first, then by id */
            readonly 200: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["PageEnvelope"] & {
                        readonly data?: readonly components["schemas"]["Attempt"][];
                    };
                };
            };
            readonly 400: components["responses"]["TenantRequired"];
            readonly 401: components["responses"]["Unauthorized"];
            readonly 403: components["responses"]["Forbidden"];
            readonly 422: components["responses"]["ValidationFailed"];
            readonly 429: components["responses"]["RateLimited"];
            readonly 500: components["responses"]["InternalError"];
        };
    };
    readonly getAttempt: {
        readonly parameters: {
            readonly query?: never;
            readonly header: {
                /** @description The selected tenant. Context, not proof; membership is checked on every request. */
                readonly "X-Tenant-Slug": components["parameters"]["TenantSlug"];
            };
            readonly path: {
                readonly attempt_id: components["parameters"]["AttemptId"];
            };
            readonly cookie?: never;
        };
        readonly requestBody?: never;
        readonly responses: {
            readonly 200: components["responses"]["AttemptResult"];
            readonly 400: components["responses"]["TenantRequired"];
            readonly 401: components["responses"]["Unauthorized"];
            readonly 403: components["responses"]["Forbidden"];
            readonly 404: components["responses"]["NotFound"];
            readonly 429: components["responses"]["RateLimited"];
            readonly 500: components["responses"]["InternalError"];
        };
    };
    readonly getAttemptQuestions: {
        readonly parameters: {
            readonly query?: never;
            readonly header: {
                /** @description The selected tenant. Context, not proof; membership is checked on every request. */
                readonly "X-Tenant-Slug": components["parameters"]["TenantSlug"];
            };
            readonly path: {
                readonly attempt_id: components["parameters"]["AttemptId"];
            };
            readonly cookie?: never;
        };
        readonly requestBody?: never;
        readonly responses: {
            /** @description Questions, in sequence */
            readonly 200: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["SuccessEnvelope"] & {
                        readonly data?: components["schemas"]["AttemptQuestions"];
                    };
                };
            };
            readonly 400: components["responses"]["TenantRequired"];
            readonly 401: components["responses"]["Unauthorized"];
            readonly 403: components["responses"]["Forbidden"];
            readonly 404: components["responses"]["NotFound"];
            readonly 429: components["responses"]["RateLimited"];
            readonly 500: components["responses"]["InternalError"];
        };
    };
    readonly getAttemptAnswers: {
        readonly parameters: {
            readonly query?: never;
            readonly header: {
                /** @description The selected tenant. Context, not proof; membership is checked on every request. */
                readonly "X-Tenant-Slug": components["parameters"]["TenantSlug"];
            };
            readonly path: {
                readonly attempt_id: components["parameters"]["AttemptId"];
            };
            readonly cookie?: never;
        };
        readonly requestBody?: never;
        readonly responses: {
            /** @description Saved answers */
            readonly 200: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["SuccessEnvelope"] & {
                        readonly data?: components["schemas"]["AttemptAnswers"];
                    };
                };
            };
            readonly 400: components["responses"]["TenantRequired"];
            readonly 401: components["responses"]["Unauthorized"];
            readonly 403: components["responses"]["Forbidden"];
            readonly 404: components["responses"]["NotFound"];
            readonly 429: components["responses"]["RateLimited"];
            readonly 500: components["responses"]["InternalError"];
        };
    };
    readonly saveAnswer: {
        readonly parameters: {
            readonly query?: never;
            readonly header: {
                /** @description The selected tenant. Context, not proof; membership is checked on every request. */
                readonly "X-Tenant-Slug": components["parameters"]["TenantSlug"];
            };
            readonly path: {
                readonly attempt_id: components["parameters"]["AttemptId"];
                readonly assessment_question_id: components["parameters"]["AssessmentQuestionId"];
            };
            readonly cookie?: never;
        };
        readonly requestBody: {
            readonly content: {
                readonly "application/json": components["schemas"]["SaveAnswerRequest"];
            };
        };
        readonly responses: {
            /** @description The saved answer */
            readonly 200: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["SuccessEnvelope"] & {
                        readonly data?: components["schemas"]["AttemptAnswer"];
                    };
                };
            };
            readonly 400: components["responses"]["TenantRequired"];
            readonly 401: components["responses"]["Unauthorized"];
            readonly 403: components["responses"]["Forbidden"];
            readonly 404: components["responses"]["NotFound"];
            readonly 409: components["responses"]["AttemptClosed"];
            readonly 422: components["responses"]["ValidationFailed"];
            readonly 429: components["responses"]["RateLimited"];
            readonly 500: components["responses"]["InternalError"];
        };
    };
    readonly deleteAnswer: {
        readonly parameters: {
            readonly query?: never;
            readonly header: {
                /** @description The selected tenant. Context, not proof; membership is checked on every request. */
                readonly "X-Tenant-Slug": components["parameters"]["TenantSlug"];
            };
            readonly path: {
                readonly attempt_id: components["parameters"]["AttemptId"];
                readonly assessment_question_id: components["parameters"]["AssessmentQuestionId"];
            };
            readonly cookie?: never;
        };
        readonly requestBody?: never;
        readonly responses: {
            readonly 200: components["responses"]["EmptySuccess"];
            readonly 400: components["responses"]["TenantRequired"];
            readonly 401: components["responses"]["Unauthorized"];
            readonly 403: components["responses"]["Forbidden"];
            readonly 404: components["responses"]["NotFound"];
            readonly 409: components["responses"]["AttemptClosed"];
            readonly 429: components["responses"]["RateLimited"];
            readonly 500: components["responses"]["InternalError"];
        };
    };
    readonly submitAttempt: {
        readonly parameters: {
            readonly query?: never;
            readonly header: {
                /** @description The selected tenant. Context, not proof; membership is checked on every request. */
                readonly "X-Tenant-Slug": components["parameters"]["TenantSlug"];
            };
            readonly path: {
                readonly attempt_id: components["parameters"]["AttemptId"];
            };
            readonly cookie?: never;
        };
        readonly requestBody?: never;
        readonly responses: {
            readonly 200: components["responses"]["AttemptResult"];
            readonly 400: components["responses"]["TenantRequired"];
            readonly 401: components["responses"]["Unauthorized"];
            readonly 403: components["responses"]["Forbidden"];
            readonly 404: components["responses"]["NotFound"];
            readonly 429: components["responses"]["RateLimited"];
            readonly 500: components["responses"]["InternalError"];
        };
    };
    readonly getAttemptResult: {
        readonly parameters: {
            readonly query?: never;
            readonly header: {
                /** @description The selected tenant. Context, not proof; membership is checked on every request. */
                readonly "X-Tenant-Slug": components["parameters"]["TenantSlug"];
            };
            readonly path: {
                readonly attempt_id: components["parameters"]["AttemptId"];
            };
            readonly cookie?: never;
        };
        readonly requestBody?: never;
        readonly responses: {
            /** @description The result */
            readonly 200: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["SuccessEnvelope"] & {
                        readonly data?: components["schemas"]["AttemptResult"];
                    };
                };
            };
            readonly 400: components["responses"]["TenantRequired"];
            readonly 401: components["responses"]["Unauthorized"];
            readonly 403: components["responses"]["Forbidden"];
            readonly 404: components["responses"]["NotFound"];
            /** @description ATTEMPT_NOT_SUBMITTED or RESULT_NOT_RELEASED */
            readonly 409: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            readonly 429: components["responses"]["RateLimited"];
            readonly 500: components["responses"]["InternalError"];
        };
    };
    readonly listConversations: {
        readonly parameters: {
            readonly query?: {
                readonly limit?: components["parameters"]["Limit"];
                readonly offset?: components["parameters"]["Offset"];
            };
            readonly header: {
                /** @description The selected tenant. Context, not proof; membership is checked on every request. */
                readonly "X-Tenant-Slug": components["parameters"]["TenantSlug"];
            };
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly requestBody?: never;
        readonly responses: {
            /** @description Conversations, most recently updated first, then by id */
            readonly 200: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["PageEnvelope"] & {
                        readonly data?: readonly components["schemas"]["Conversation"][];
                    };
                };
            };
            readonly 400: components["responses"]["TenantRequired"];
            readonly 401: components["responses"]["Unauthorized"];
            readonly 403: components["responses"]["Forbidden"];
            readonly 422: components["responses"]["ValidationFailed"];
            readonly 429: components["responses"]["RateLimited"];
            readonly 500: components["responses"]["InternalError"];
        };
    };
    readonly createConversation: {
        readonly parameters: {
            readonly query?: never;
            readonly header: {
                /** @description The selected tenant. Context, not proof; membership is checked on every request. */
                readonly "X-Tenant-Slug": components["parameters"]["TenantSlug"];
                readonly "Idempotency-Key": components["parameters"]["IdempotencyKey"];
            };
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly requestBody?: never;
        readonly responses: {
            readonly 200: components["responses"]["ConversationResult"];
            readonly 201: components["responses"]["ConversationResult"];
            readonly 400: components["responses"]["TenantRequired"];
            readonly 401: components["responses"]["Unauthorized"];
            readonly 403: components["responses"]["Forbidden"];
            readonly 422: components["responses"]["ValidationFailed"];
            readonly 429: components["responses"]["RateLimited"];
            readonly 500: components["responses"]["InternalError"];
        };
    };
    readonly getConversation: {
        readonly parameters: {
            readonly query?: never;
            readonly header: {
                /** @description The selected tenant. Context, not proof; membership is checked on every request. */
                readonly "X-Tenant-Slug": components["parameters"]["TenantSlug"];
            };
            readonly path: {
                readonly conversation_id: components["parameters"]["ConversationId"];
            };
            readonly cookie?: never;
        };
        readonly requestBody?: never;
        readonly responses: {
            readonly 200: components["responses"]["ConversationResult"];
            readonly 400: components["responses"]["TenantRequired"];
            readonly 401: components["responses"]["Unauthorized"];
            readonly 403: components["responses"]["Forbidden"];
            readonly 404: components["responses"]["NotFound"];
            readonly 429: components["responses"]["RateLimited"];
            readonly 500: components["responses"]["InternalError"];
        };
    };
    readonly deleteConversation: {
        readonly parameters: {
            readonly query?: never;
            readonly header: {
                /** @description The selected tenant. Context, not proof; membership is checked on every request. */
                readonly "X-Tenant-Slug": components["parameters"]["TenantSlug"];
            };
            readonly path: {
                readonly conversation_id: components["parameters"]["ConversationId"];
            };
            readonly cookie?: never;
        };
        readonly requestBody?: never;
        readonly responses: {
            readonly 200: components["responses"]["EmptySuccess"];
            readonly 400: components["responses"]["TenantRequired"];
            readonly 401: components["responses"]["Unauthorized"];
            readonly 403: components["responses"]["Forbidden"];
            readonly 404: components["responses"]["NotFound"];
            readonly 429: components["responses"]["RateLimited"];
            readonly 500: components["responses"]["InternalError"];
        };
    };
    readonly listMessages: {
        readonly parameters: {
            readonly query?: {
                readonly limit?: components["parameters"]["Limit"];
                readonly offset?: components["parameters"]["Offset"];
            };
            readonly header: {
                /** @description The selected tenant. Context, not proof; membership is checked on every request. */
                readonly "X-Tenant-Slug": components["parameters"]["TenantSlug"];
            };
            readonly path: {
                readonly conversation_id: components["parameters"]["ConversationId"];
            };
            readonly cookie?: never;
        };
        readonly requestBody?: never;
        readonly responses: {
            /** @description Messages, oldest first, then by id */
            readonly 200: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["PageEnvelope"] & {
                        readonly data?: readonly components["schemas"]["ConversationMessage"][];
                    };
                };
            };
            readonly 400: components["responses"]["TenantRequired"];
            readonly 401: components["responses"]["Unauthorized"];
            readonly 403: components["responses"]["Forbidden"];
            readonly 404: components["responses"]["NotFound"];
            readonly 422: components["responses"]["ValidationFailed"];
            readonly 429: components["responses"]["RateLimited"];
            readonly 500: components["responses"]["InternalError"];
        };
    };
    readonly sendMessage: {
        readonly parameters: {
            readonly query?: never;
            readonly header: {
                /** @description The selected tenant. Context, not proof; membership is checked on every request. */
                readonly "X-Tenant-Slug": components["parameters"]["TenantSlug"];
                readonly "Idempotency-Key": components["parameters"]["IdempotencyKey"];
            };
            readonly path: {
                readonly conversation_id: components["parameters"]["ConversationId"];
            };
            readonly cookie?: never;
        };
        readonly requestBody: {
            readonly content: {
                readonly "application/json": components["schemas"]["SendMessageRequest"];
            };
        };
        readonly responses: {
            /** @description The answer */
            readonly 200: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["SuccessEnvelope"] & {
                        readonly data?: components["schemas"]["ChatAnswer"];
                    };
                };
            };
            readonly 400: components["responses"]["TenantRequired"];
            readonly 401: components["responses"]["Unauthorized"];
            readonly 403: components["responses"]["Forbidden"];
            readonly 404: components["responses"]["NotFound"];
            /** @description IDEMPOTENCY_KEY_REUSED with a different message, or TURN_IN_PROGRESS while this key's earlier request is still being answered. Retry the same key after Retry-After seconds; it returns the stored turn once there is one */
            readonly 409: {
                headers: {
                    readonly "Retry-After"?: number;
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            readonly 422: components["responses"]["ValidationFailed"];
            readonly 429: components["responses"]["RateLimited"];
            readonly 500: components["responses"]["InternalError"];
            /** @description AI_UPSTREAM_ERROR. No answer is stored */
            readonly 502: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description AI_UNAVAILABLE or OBJECT_STORAGE_UNAVAILABLE, or ANSWER_WITHHELD: a document the answer used stopped being readable by this student while it was generated, so the whole answer is withheld, cited or not, and nothing is stored. Retryable: a retry retrieves afresh and leaves that document out */
            readonly 503: {
                headers: {
                    readonly "Retry-After"?: number;
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
        };
    };
}
