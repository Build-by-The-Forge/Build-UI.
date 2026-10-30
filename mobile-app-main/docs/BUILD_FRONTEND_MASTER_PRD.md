> **Repository note (not part of the PRD).** Adopted by the product owner on 2026-10-30 as the master PRD and source of truth for the BUILD mobile frontend. Everything below this note is converted unchanged from `BUILD-Frontend-Master-PRD.docx` (v1.0.0, "Proposed master specification").
>
> Where the text differs from this repository:
>
> - It names the repository `build-frontend` and treats the mobile app as a distinct surface (§21). **In this repository, read `build-frontend` as this Expo app.** Web-only requirements, such as browser coverage, apply only where the app runs on web.
> - The source file's numbered list items are styled as headings, so some list items appear as `###` headings.
> - The closing sections ("How I recommend we use this document" and the Appendix) are drafting notes from the document's author, not requirements.
>
> API contracts are owned by build-backend (`docs/mobile-api-conventions.md`), as §284 requires. This PRD doesn't override them, and it doesn't mean any capability it describes exists today.

**BUILD FRONTEND**

Master Product Requirements Document
Architecture Specification, UX Blueprint
and Implementation Roadmap

| Document | BUILD Frontend Master PRD |
|---|---|
| Version | 1.0.0 |
| Status | Proposed master specification |
| Product | BUILD AI CBT & Learning Platform |
| Repository | build-frontend |
| Related | build-backend, ai-service, BUILD mobile app |
| Market | Nigeria → Africa → International \| Initial: FUTA |

## Table of Contents

Press Ctrl+A then F9 to update the table of contents in Microsoft Word.

## Document Purpose & Usage Recommendation

This is the master product specification, not yet the instruction to start changing code. That distinction matters because our backend and AI service have explicit ownership boundaries, and the frontend must integrate with their actual contracts.

Recommended sequence:
1. Place the document in build-frontend/docs/BUILD_FRONTEND_MASTER_PRD.md
2. Have the coding agent audit the existing frontend repository
3. Create a traceable implementation plan mapping requirements to implementation, API contracts, tests, and dependencies
4. Implement in vertical slices — foundation and authentication first, then core academic workflows
5. Keep the three repositories coordinated — frontend is not integrated merely because its page exists

## BUILD FRONTEND

Document: BUILD Frontend Master PRD

Version: 1.0.0

Status: Proposed master specification

Product: BUILD AI CBT & Learning Platform

Repository: "build-frontend"

Related repositories: "build-backend", "ai-service", and the existing BUILD mobile application repository

Primary market: Nigeria, with an architecture that supports expansion across Africa and internationally

Initial academic ecosystem: Federal University of Technology, Akure (FUTA)

Document purpose: Establish the product requirements, frontend architecture, user experience, API integration rules, security requirements, testing strategy, implementation phases, and acceptance criteria for the BUILD frontend.

## PART I — FOUNDATIONS AND GOVERNING PRINCIPLES

### 1. Executive Summary

BUILD is an AI-powered academic learning, assessment, and examination preparation platform designed to help students learn more effectively, understand academic materials, practise examinations, and measure their progress. The frontend is the primary interface through which users interact with BUILD's academic features and services. It must provide an accessible, responsive, secure, intuitive, and reliable experience across supported devices. The frontend must integrate with the BUILD backend for business operations and the BUILD AI service for AI-powered capabilities through approved service interfaces. The objective is not merely to build a collection of pages. The objective is to build a coherent academic application in which every feature participates in a consistent learning experience.

### 2. Product Vision

BUILD aims to become an intelligent academic learning environment that combines:

- Personalised learning.
- Academic document management.
- AI-assisted explanations.
- Evidence-grounded question answering.
- Computer-based testing.
- Examination preparation.
- Intelligent question generation.
- Learning progress analytics.
- Academic knowledge organisation.
- Campus-aware educational experiences.
- Offline learning capabilities.
- A persistent, student-centred learning experience.

The frontend must make these capabilities understandable and useful without requiring users to understand the underlying AI architecture.

### 3. Product Mission

Help students transform academic materials into structured knowledge, practise what they learn, identify weaknesses, and prepare for examinations through an integrated digital learning platform.

### 4. Frontend Mission

The frontend must translate BUILD's backend and AI capabilities into reliable user experiences. It must:

### 1. Present information clearly.

### 2. Make important workflows discoverable.

### 3. Prevent avoidable user errors.

### 4. Communicate processing and system states accurately.

### 5. Preserve user progress where supported.

### 6. Handle failures without losing user work unnecessarily.

### 7. Provide consistent navigation.

### 8. Support accessibility and responsive layouts.

### 9. Respect tenant boundaries and permissions.

### 10. Provide a consistent interface across BUILD's academic features.

### 5. Product Scope

The frontend scope includes:

- Authentication interfaces.
- User onboarding.
- Academic profile setup.
- Academic dashboard.
- Course and programme organisation.
- Academic document uploads.
- Document processing status.
- AI academic chat.
- Retrieval-grounded answers and citations.
- Study and reading experiences.
- Question generation.
- Practice examinations.
- CBT examination interfaces.
- Examination results and explanations.
- Learning progress dashboards.
- Knowledge organisation and learning memory interfaces.
- Knowledge trees.
- Notifications.
- Settings and account management.
- Subscription interfaces where supported.
- Administrative interfaces where authorised.
- Campus maps and location-based academic features.
- Offline learning interfaces.
- Responsive and accessible layouts.
- Error handling, loading states, and recovery workflows.

These are product requirements, not assertions that every feature already exists in the repositories.

### 6. Non-Goals

The frontend must not independently implement:

- Authentication authority.
- Authoritative role assignment.
- Authoritative tenant membership.
- Business permissions.
- Examination scoring rules.
- Financial calculations.
- Subscription entitlement decisions.
- AI model orchestration.
- Vector search.
- Document extraction pipelines.
- Embedding generation.
- Durable indexing.
- Authoritative job retry logic.
- Academic source-of-truth records.
- Backend database migrations.
- Authoritative learning-memory storage.
- AI safety or evidence-validation rules that belong to the service layer.

The frontend may display, validate, organise, and interact with the results of these operations. It must not replace the systems responsible for them.

### 7. Relationship to Existing BUILD Specifications

The frontend must follow the established BUILD master PRD and the authoritative contracts of "build-backend" and "ai-service". The frontend team must inspect the current versions of those documents before implementing features. When requirements appear inconsistent, the team must identify the conflict explicitly rather than silently inventing a solution.

### 8. Product Principles

The frontend must follow these principles:

### 1. Correctness before visual polish.

### 2. Usability before unnecessary complexity.

### 3. Accessibility by default.

### 4. Security at every boundary.

### 5. API contracts before speculative integration.

### 6. Explicit states instead of misleading assumptions.

### 7. Progressive enhancement rather than fragile complexity.

### 8. Small, reviewable implementation increments.

### 9. Evidence-based completion claims.

### 10. Consistent experiences across product areas.

### 11. Graceful handling of unreliable connectivity.

### 12. No false claims about AI processing or completed actions.

### 9. Frontend Definition of Done

A feature is not complete merely because its page renders. A feature is complete only when:

- Its requirements are documented.
- Its API contract is verified.
- Its permissions are respected.
- Its principal user flow works.
- Loading, empty, success, and error states exist.
- Important edge cases are handled.
- Accessibility has been considered.
- Automated tests cover its critical behaviour.
- Integration tests pass where applicable.
- The implementation follows repository conventions.
- No known critical security issue remains.
- Documentation is updated.
- Remaining limitations are recorded honestly.
### 10. Separation of Requirements and Implementation Status

This document describes the intended product and engineering requirements. The implementation agent must maintain a separate status record showing whether each requirement is:

- Not started.
- Under investigation.
- Planned.
- In progress.
- Implemented.
- Tested.
- Blocked.
- Deferred.
- Accepted with a documented limitation.

A requirement must never be marked complete solely because a component, route, or page exists.

## PART II — REPOSITORY DISCOVERY AND EXISTING-SYSTEM AUDIT

### 11. Repository Discovery Comes First

Before making changes, inspect the existing "build-frontend" repository. Do not assume that the repository is empty or that its architecture matches a generic Next.js, React, or other starter project.

### 12. Inspect the Repository Structure

Inspect:

- Directory layout.
- Application entry points.
- Routing configuration.
- Page and component organisation.
- Styling system.
- Design tokens.
- Dependency manifest and lockfile.
- TypeScript configuration, if applicable.
- Build scripts.
- Linting configuration.
- Formatting configuration.
- Testing configuration.
- Environment configuration.
- API clients.
- Authentication implementation.
- State management.
- Existing UI primitives.
- Error boundaries.
- Logging and monitoring.
- Existing documentation.
- Continuous integration workflows.
- Deployment configuration.

Record findings before selecting an implementation strategy.

### 13. Establish the Existing Technology Stack

Determine the actual:

- Framework.
- Framework version.
- Language.
- Runtime requirements.
- Package manager.
- Routing library.
- Styling solution.
- Component library.
- Form library.
- Data-fetching approach.
- State-management solution.
- Testing tools.
- Build system.
- Deployment platform.

Do not replace established tools merely because another option is fashionable.

### 14. Preserve Working Functionality

Before modifying the application:

### 1. Establish the current baseline.

### 2. Run available checks.

### 3. Record existing failures.

### 4. Identify functioning routes and workflows.

### 5. Identify incomplete features.

### 6. Record architectural constraints.

### 7. Create a safe implementation plan.

Do not accidentally delete working functionality while introducing the new architecture.

### 15. Existing-Feature Inventory

Create an inventory of:

- Existing pages.
- Existing routes.
- Existing components.
- Existing API integrations.
- Existing authentication flows.
- Existing user journeys.
- Existing design patterns.
- Existing test coverage.
- Existing accessibility support.
- Existing deployment behaviour.

Map these to the master requirements.

### 16. Backend Contract Discovery

Inspect the backend's actual API contracts. Verify:

- Authentication endpoints.
- Session or token behaviour.
- User-profile endpoints.
- Organisation and membership endpoints.
- Academic structure endpoints.
- Course endpoints.
- Upload endpoints.
- Ingestion-job endpoints.
- Chat endpoints.
- Examination endpoints.
- Question endpoints.
- Result endpoints.
- Notification endpoints.
- Subscription endpoints.
- Administrative endpoints.
- Error schemas.
- Pagination conventions.
- Rate-limit behaviour.
- Permission failures.
- Idempotency requirements.

Only document endpoints that actually exist or are explicitly approved for implementation.

### 17. AI-Service Contract Discovery

Inspect the AI service's public interface and the backend's corresponding integration. Identify:

- Supported AI workflows.
- Request and response schemas.
- Chat streaming behaviour.
- Retrieval and citation structures.
- Document processing states.
- Question-generation responses.
- Explanation responses.
- Error responses.
- Timeout behaviour.
- Cancellation behaviour.
- Usage limits.
- Model availability signals.
- Offline capabilities, if exposed.
- Any existing compatibility requirements.

The frontend must not invent direct AI-service endpoints merely because they appear convenient.

### 18. API Contract Gap Register

When a required feature has no usable contract, record:

- Feature name.
- Required user action.
- Required request.
- Required response.
- Permission requirements.
- Error scenarios.
- Current contract status.
- Responsible repository.
- Blocking dependencies.
- Proposed resolution.

The frontend may use a clearly isolated mock adapter for local UI development, but must not represent mock behaviour as production integration.

### 19. Baseline Verification Report

Produce a report containing:

- Repository structure.
- Framework and dependency inventory.
- Existing feature map.
- Existing test results.
- Existing build status.
- Backend integration status.
- AI-service integration status.
- Major architectural gaps.
- Security risks.
- Accessibility gaps.
- Recommended implementation phases.
### 20. Discovery Exit Gate

Do not begin a large-scale rewrite until the repository audit establishes what already exists and what needs to change. The audit must inform the implementation plan.

## PART III — SYSTEM ARCHITECTURE AND OWNERSHIP

### 21. High-Level Architecture

BUILD consists of distinct systems with explicit responsibilities. Frontend Responsible for:

- Rendering the user interface.
- User interactions.
- Form handling.
- Client-side presentation state.
- Request initiation.
- Navigation.
- Presentation-level validation.
- Rendering server-authoritative results.
- Communicating loading, progress, and error states.
- Local caching where safe and supported.
- Offline user experiences.

Backend Responsible for:

- Business rules.
- Authoritative user and organisation records.
- Authentication and authorisation enforcement.
- Tenant membership.
- Academic domain records.
- Document metadata.
- Upload authorisation.
- Ingestion-job lifecycle.
- Examination records and authoritative scoring.
- Subscription entitlements.
- Notifications and other business operations.
- API contracts and persistence.

AI Service Responsible for:

- AI inference.
- Document extraction and OCR.
- Normalisation and chunking.
- Embedding generation.
- Durable indexing.
- Retrieval.
- Grounded question answering.
- Question generation.
- Explanations.
- AI orchestration.
- AI-specific processing and validation.

Mobile Application The existing mobile repository remains a distinct application surface. The web frontend and mobile application should share documented product semantics and API contracts where appropriate, without requiring identical layouts or interaction patterns.

### 22. Source-of-Truth Rules

The frontend must treat backend responses as authoritative for business state. Examples include:

- Whether a user is authenticated.
- Which organisations the user belongs to.
- Which role applies to a membership.
- Whether the user can access a course.
- Whether a document is ready.
- Whether an examination has been submitted.
- Whether an answer was accepted.
- Whether a subscription is active.
- Whether a job succeeded or failed.

Local state must not override these facts.

### 23. AI-Service Access Boundary

The frontend must communicate with the backend's approved AI-facing APIs unless an explicit architecture decision authorises another path. It must not expose internal AI-service credentials, private service addresses, privileged service tokens, or internal orchestration details.

### 24. API Contract-First Development

For each integration:

### 1. Locate the authoritative contract.

### 2. Define or generate client types where practical.

### 3. Implement the request adapter.

### 4. Validate response assumptions.

### 5. Handle known errors.

### 6. Test success and failure scenarios.

### 7. Integrate the feature UI.

Do not build large amounts of UI around guessed request and response shapes.

### 25. Generated Types

Where OpenAPI or another authoritative schema exists, use generated or schema-derived types when appropriate. Avoid maintaining duplicated request and response definitions that drift from the backend.

### 26. API Client Layer

Provide a central API-client architecture with:

- A single configuration source.
- Environment-specific base URLs.
- Request cancellation.
- Timeouts.
- Safe request logging.
- Response parsing.
- Error normalisation.
- Authentication integration.
- Correlation identifiers where available.
- Consistent handling of HTTP errors.
- Typed request and response interfaces.

The exact implementation must fit the existing stack.

### 27. Domain-Service Layer

Organise API interactions by domain rather than embedding network logic throughout components. Possible domains include:

- Authentication.
- Users.
- Organisations.
- Academic structure.
- Courses.
- Documents.
- Ingestion.
- Chat.
- Questions.
- Examinations.
- Results.
- Learning analytics.
- Maps.
- Notifications.
- Subscriptions.

Only create services for supported or approved functionality.

### 28. UI, Domain and Transport Separation

Components should not need to know every detail of the backend transport protocol. Separate:

- UI components.
- Presentation state.
- Domain-level actions.
- API transport.
- Response transformation.
- Error handling.

This separation must remain practical rather than creating unnecessary abstractions.

### 29. Server State and Client State

Use appropriate strategies for: Server state

- User profile.
- Academic structure.
- Documents.
- Ingestion status.
- Questions.
- Examination attempts.
- Results.
- Notifications.
- Subscription status.

Client state

- Open menus.
- Active tabs.
- Unsaved form inputs.
- Dialog visibility.
- Temporary presentation preferences.
- Current selection before submission.

Do not duplicate server state unnecessarily in unrelated global stores.

### 30. State Consistency

After a successful mutation, update or invalidate affected server-state queries. For important state transitions, prefer re-fetching or reconciling with the authoritative response instead of assuming the local optimistic state was accepted.

### 31. Optimistic Updates

Optimistic updates may be used for low-risk interactions when rollback is straightforward. Do not use them to fabricate authoritative success for:

- Examination submissions.
- Payment operations.
- Document readiness.
- Subscription activation.
- AI job completion.
- Permission changes.
### 32. Cross-Repository Compatibility

The frontend must support the documented contracts of the deployed backend and AI service. A feature is not integration-ready merely because its frontend and backend branches compile independently.

### 33. Architecture Decision Records

Record significant decisions involving:

- Routing.
- Authentication.
- API integration.
- State management.
- Design system.
- Offline storage.
- Map architecture.
- AI interaction patterns.
- Security.
- Deployment.
- Accessibility.

Each record should explain the context, decision, alternatives, trade-offs, and consequences.

### 34. Avoid Unnecessary Microservices and Abstractions

The frontend must not introduce extra services, state stores, component frameworks, or infrastructure without a clear requirement. Prefer a maintainable architecture that fits the actual application.

### 35. Architecture Exit Gate

The architecture is acceptable when:

- Ownership boundaries are documented.
- API contracts are identified.
- State ownership is clear.
- Authentication is integrated safely.
- Error handling is consistent.
- Domain logic is not scattered across UI components.
- The application can evolve without rewriting every feature.
## PART IV — INFORMATION ARCHITECTURE AND NAVIGATION

### 36. Information Architecture

Organise the application around student goals rather than internal service names. The primary information hierarchy should include:

### 1. Home and dashboard.

### 2. My learning.

### 3. Courses and academic materials.

### 4. AI study assistant.

### 5. Practice and examinations.

### 6. Learning progress.

### 7. Knowledge organisation.

### 8. Campus map.

### 9. Notifications.

### 10. Account and settings.

Additional navigation items should appear only when supported and relevant to the current user's permissions.

### 37. Role-Aware Navigation

Navigation must reflect the user's authorised capabilities. Students should not see privileged administrative actions merely because an administrative route exists. Hiding an action in the UI is not authorisation enforcement; the backend must still enforce permissions.

### 38. Responsive Navigation

Use an appropriate navigation model for the screen size and product context. For example:

- Sidebar or top-level navigation on larger screens.
- Compact navigation on small screens.
- Clear page titles and breadcrumbs where useful.
- Keyboard-accessible menus.
- Visible active states.
- Predictable back-navigation behaviour.

Do not force the same navigation layout onto every device.

### 39. Route Definitions

Maintain a documented route inventory. For each route, define:

- Purpose.
- Required authentication.
- Required role or permission.
- Required route parameters.
- Data dependencies.
- Loading state.
- Error state.
- Empty state.
- Navigation entry point.
- Expected behaviour when accessed directly.
### 40. Route Protection

Protected routes must verify the actual authentication and authorisation state. Unauthenticated users should be directed through the appropriate authentication flow. Authenticated users lacking permission should receive an appropriate access-denied experience.

### 41. Deep Links

Where supported, direct links to documents, courses, examination results, or other resources must preserve the intended destination after authentication. The backend must independently verify that the user can access the requested resource.

### 42. Unknown Routes

Provide a useful not-found page. Do not silently redirect every unknown route to the dashboard.

### 43. Navigation State

Preserve relevant navigation context when appropriate. Examples include:

- Returning to a course after viewing a document.
- Returning to the correct results page.
- Restoring a previous document list filter.
- Preserving an unfinished form when safe.

Do not preserve sensitive state in an unsafe location.

### 44. Navigation Exit Gate

A user must be able to identify where they are, understand the available actions, and move between major learning activities without confusing or dead-end routes.

## PART V — DESIGN SYSTEM AND VISUAL LANGUAGE

### 45. Design System Objective

BUILD should have a coherent visual identity across academic workflows. The interface must feel like one product rather than unrelated pages assembled from different component libraries.

### 46. Design Tokens

Establish central design tokens for:

- Brand colours.
- Semantic colours.
- Typography.
- Spacing.
- Border radii.
- Elevation.
- Shadows.
- Layout widths.
- Breakpoints.
- Z-index layers.
- Focus indicators.
- Motion durations.
- Disabled-state opacity.

Use the repository's existing design system if one is already established and suitable.

### 47. Colour System

Define semantic colours for:

- Primary actions.
- Secondary actions.
- Success.
- Warning.
- Error.
- Informational messages.
- Backgrounds.
- Surfaces.
- Borders.
- Text.
- Disabled controls.
- Focus states.

Do not communicate important meaning through colour alone.

### 48. Typography

Define a consistent typographic hierarchy for:

- Page titles.
- Section headings.
- Card headings.
- Body text.
- Supporting text.
- Form labels.
- Metadata.
- Academic content.
- Mathematical notation.
- Code or structured technical content.

Academic material must remain readable at supported screen sizes.

### 49. Spacing and Layout

Use a consistent spacing scale. Avoid arbitrary margins and padding that produce inconsistent layouts. Ensure long academic documents, question explanations, and data tables remain usable on small screens.

### 50. Component Library

Create or standardise reusable components such as:

- Buttons.
- Text fields.
- Search fields.
- Select controls.
- Checkboxes.
- Radio groups.
- Switches.
- Cards.
- Dialogs.
- Drawers.
- Tabs.
- Dropdowns.
- Tooltips.
- Badges.
- Alerts.
- Toasts.
- Tables.
- Pagination.
- Progress indicators.
- Skeletons.
- Empty states.
- Error states.
- File-upload controls.
- Breadcrumbs.
- Navigation elements.

Do not duplicate components without a meaningful reason.

### 51. Component Variants

Important components should have documented variants and states. For example, buttons should support appropriate loading, disabled, destructive, primary, and secondary states. Components must not expose combinations that create contradictory visual or interaction behaviour.

### 52. Iconography

Use a consistent icon system. Icons that trigger actions must have accessible names. Decorative icons should not create unnecessary screen-reader noise.

### 53. Motion and Animation

Motion should communicate transitions and feedback. Avoid animations that obstruct learning, delay important actions, or create accessibility problems. Respect reduced-motion preferences.

### 54. Dark Mode

Inspect existing support before implementing a theme system. If dark mode is supported or approved, ensure all major learning workflows remain readable and contrast-compliant. Do not implement a superficial dark mode that breaks document rendering or examination screens.

### 55. Responsive Behaviour

Test at representative:

- Small mobile widths.
- Large mobile widths.
- Tablet widths.
- Laptop widths.
- Large desktop widths.

These are layout test categories, not a requirement to hard-code every possible device.

### 56. Design Consistency Gate

New pages must reuse the approved design tokens and components unless the requirements justify a documented exception.

## PART VI — AUTHENTICATION, IDENTITY AND ONBOARDING

### 57. Authentication Overview

The frontend must provide the authentication experiences supported by the backend. It must not assume that every identity provider, authentication method, or recovery mechanism is available.

### 58. Authentication Discovery

Verify the backend's actual support for:

- Sign-up.
- Sign-in.
- Sign-out.
- Email verification.
- Password recovery.
- Session refresh.
- Session revocation.
- Multi-factor authentication.
- External identity providers.
- Account recovery.

Implement only supported flows or explicitly approved additions.

### 59. Sign-Up Interface

The sign-up interface must:

- Explain required fields.
- Validate input format.
- Show actionable errors.
- Prevent accidental repeated submissions.
- Communicate successful completion accurately.
- Follow the backend's verification requirements.
- Avoid exposing whether sensitive accounts exist where enumeration is a concern.
### 60. Sign-In Interface

The sign-in interface must:

- Support the configured authentication method.
- Handle invalid credentials safely.
- Display appropriate loading states.
- Prevent repeated submissions while a request is pending.
- Handle expired sessions.
- Provide accessible form errors.
- Avoid exposing credentials in logs or URLs.
### 61. Session Management

Follow the backend's session and token contract. For browser-based applications, prefer secure cookie-based sessions where supported by the architecture. If tokens must be used, follow the approved storage and renewal design. Do not place long-lived sensitive credentials in browser local storage by default.

### 62. Sign-Out

Sign-out must follow the authoritative session-revocation contract. Clear local session state and protected cached data as appropriate. Do not merely redirect the user while leaving a valid local authentication state behind.

### 63. Session Expiry

When a session expires:

- Stop treating the user as authenticated.
- Preserve unsaved work where safe.
- Explain the situation.
- Initiate the approved reauthentication flow.
- Resume the intended action only when doing so is safe and supported.

Never silently repeat a sensitive mutation after reauthentication without ensuring that it remains appropriate.

### 64. Multi-Organisation Identity

A user may have memberships in multiple organisations or academic contexts. The frontend must represent the active context clearly when the backend supports context switching. It must never assume that a user has the same permissions in every organisation.

### 65. Active Membership

When an active organisation or membership is selected, scope relevant data requests to that context according to the API contract. The backend remains responsible for verifying membership and resource access.

### 66. Onboarding

Onboarding should collect the minimum information needed to establish a useful academic experience. Possible information includes:

- Name or display name.
- Institution.
- Programme.
- Department.
- Academic level.
- Semester.
- Courses.
- Learning preferences.

Only request information supported by the product and necessary for the relevant workflow.

### 67. Onboarding Progress

If onboarding can be resumed, display accurate progress and restore saved steps according to backend capabilities. Do not assume that a locally completed form was persisted successfully.

### 68. Academic Context

Represent academic context explicitly. For FUTA, programme, department, course, level, and semester selection must follow the authoritative academic structure rather than a collection of arbitrary strings.

### 69. Profile Management

Provide profile editing for fields the backend allows the user to modify. Respect server-side validation and permission rules.

### 70. Identity Acceptance Gate

Authentication and onboarding are complete only when session handling, protected navigation, membership context, and error handling work together correctly.

## PART VII — DASHBOARD AND PERSONAL LEARNING HOME

### 71. Dashboard Objective

The dashboard should help users answer:

- What should I study next?
- Which courses am I working on?
- Which materials have I uploaded?
- What is currently processing?
- What should I practise?
- How is my learning progressing?
- Are there actions requiring my attention?
### 72. Dashboard Data

Use actual backend data where available. Potential sections include:

- Welcome and academic context.
- Current courses.
- Recent academic materials.
- Recent AI study sessions.
- Upcoming or available examinations.
- Recent results.
- Learning progress.
- Pending document processing.
- Notifications.
- Suggested next actions.

Do not display fabricated progress statistics.

### 73. Personalisation

Personalise the dashboard using authorised and available information. Personalisation must not imply that the AI knows something about the user unless that information is actually available.

### 74. Empty Dashboard

New users should receive clear guidance about the next useful action. Avoid empty cards that merely say there is no data.

### 75. Dashboard Loading

Use skeletons or appropriate loading indicators without creating large layout shifts. Where independent sections load separately, one failed section should not necessarily prevent unrelated sections from appearing.

### 76. Dashboard Failure

If data cannot be loaded, show a meaningful error and retry action where appropriate. Do not display stale data as current without indicating its status when freshness matters.

### 77. Dashboard Acceptance Gate

The dashboard must provide a useful, accurate summary of the user's actual academic activity and support navigation to the relevant workflows.

## PART VIII — ACADEMIC STRUCTURE, COURSES AND MATERIALS

### 78. Academic Hierarchy

Represent the academic hierarchy supported by the backend. A possible hierarchy is: Institution → Faculty or School → Department or Programme → Academic Level → Semester → Course → Materials. The actual hierarchy must follow the authoritative data model.

### 79. Academic Data Integrity

Do not create unofficial academic records in the frontend. For example, the application must not invent a course or department merely because a user enters a similar name.

### 80. FUTA Academic Structure

Use verified FUTA academic structures and the backend's authoritative catalogue. Respect established distinctions in the academic data model, including:

- Data Science as DTS where that is the authoritative code.
- Mathematical Sciences as MTS.
- Industrial Mathematics as a programme or discipline within the appropriate structure rather than an automatically invented separate department.
- Industrial Chemistry as distinct from generic Chemistry.
- Architecture and Computing as distinct academic structures where the official catalogue specifies them.

Do not hard-code these mappings independently in multiple frontend components.

### 81. Course Listing

Course listings should support relevant metadata such as:

- Course code.
- Course title.
- Academic level.
- Semester.
- Course description.
- Associated materials.
- Available practice activities.

Only display fields supplied by the authoritative data source.

### 82. Course Details

A course page should provide a coherent entry point to:

- Course information.
- Academic materials.
- Reading activities.
- Related AI study sessions.
- Practice questions.
- Available examinations.
- Relevant learning progress.

Unavailable capabilities should not appear as functioning actions.

### 83. Search and Filtering

Where supported, provide useful filtering by:

- Course.
- Semester.
- Academic level.
- Document type.
- Processing status.
- Upload date.

Filtering must preserve the correct academic and tenant context.

### 84. Course Acceptance Gate

Users must be able to find and navigate their authorised academic courses without relying on hard-coded assumptions.

## PART IX — ACADEMIC DOCUMENT UPLOAD AND INGESTION

### 85. Upload Experience Objective

Document upload is a foundational BUILD workflow. The frontend must make it easy to submit academic materials while ensuring users understand what happens after upload.

### 86. Supported Material Types

Discover the actual supported file types and size limits from the backend contract. Possible materials include:

- Lecture notes.
- Course handouts.
- PDFs.
- Past examination questions.
- Personal summaries.
- Academic documents.
- Other supported learning resources.

Do not advertise file types that the backend cannot process.

### 87. Upload Interface

Provide an upload interface that supports the approved file-selection methods. Where appropriate, include:

- File picker.
- Drag-and-drop.
- File name.
- File size.
- File type.
- Upload progress.
- Validation errors.
- Removal before submission.
- Retry options.
### 88. Client-Side Validation

Perform useful preliminary checks for file size, extension, and supported formats. These checks improve the experience but are not security boundaries. The backend must perform authoritative validation.

### 89. Academic Upload Chat

BUILD's academic upload experience should support a conversational workflow where appropriate. Users should be able to submit academic material and receive useful clarification requests rather than being forced through an unnecessarily rigid form. The interface may ask for missing information such as:

- Course.
- Programme.
- Academic level.
- Semester.
- Document type.
- Document ownership or authorisation.
- Other metadata required by the ingestion workflow.

Ask only for information that is missing, ambiguous, or required.

### 90. Upload Classification

If the AI or backend classifies an uploaded document, present the classification and its confidence or uncertainty only when the contract exposes meaningful information. Allow users to correct classification where the product supports correction. Do not invent confidence scores.

### 91. Upload Consent and Ownership

Where required, the interface must obtain appropriate declarations or confirmations before submitting material. Do not present a declaration as legal advice or imply that user confirmation removes all copyright obligations.

### 92. Upload Initiation

A successful file transfer is not the same as successful ingestion. The UI must distinguish:

### 1. File selection.

### 2. Local validation.

### 3. Upload in progress.

### 4. Upload accepted.

### 5. Ingestion queued.

### 6. Extraction or OCR.

### 7. Normalisation.

### 8. Chunking.

### 9. Indexing.

### 10. Ready.

### 11. Failed or requiring user action.

The exact displayed states must map to the authoritative backend state machine.

### 93. Ingestion State Mapping

The existing ingestion model includes states such as: "uploaded → queued → processing → extracted → chunked → indexed → ready" Failure, retry, cancellation, and other intermediate states must follow the actual API contract. The frontend must not independently invent state transitions.

### 94. Meaning of Ready

The UI may display Document ingested successfully only when the authoritative service confirms the document has reached the defined "ready" state. For BUILD, readiness means the validated, durable indexing work has completed. A successful upload response alone must not trigger the success message.

### 95. Ingestion Progress

If the backend exposes progress information, render it accurately. If exact progress is unavailable, use truthful status labels such as:

- Upload complete.
- Waiting for processing.
- Processing document.
- Preparing searchable content.
- Finalising indexing.
- Ready.
- Processing failed.

Do not fabricate percentages or promise completion times without reliable evidence.

### 96. Polling and Event Updates

Use the existing event, polling, or streaming contract to update ingestion status. Polling must be bounded and cleaned up when components unmount or the user leaves the relevant page. Respect server rate limits.

### 97. Refresh and Recovery

Users should be able to return to a document and see its authoritative current status. A browser refresh must not falsely restart ingestion or create duplicate jobs.

### 98. Failed Ingestion

Display actionable errors where available. Distinguish between failures that the system can retry automatically and cases requiring user intervention. Do not promise automatic recovery unless the backend contract supports it.

### 99. Duplicate Upload Protection

Follow the backend's duplicate detection and idempotency rules. The frontend should prevent accidental repeated submissions where practical but must not be the sole defence against duplicates.

### 100. Document Details

A document detail view should expose appropriate information such as:

- Document name.
- Course association.
- Upload date.
- Processing state.
- Available actions.
- Extracted content or preview where supported.
- Relevant failure information.
- Retry or correction actions where authorised.
### 101. Document Deletion

Deletion must follow the backend's ownership, permission, and lifecycle rules. The UI must not imply that deleting a local display entry deletes the authoritative document and its indexed content.

### 102. Upload Acceptance Gate

The upload experience is complete only when the frontend correctly represents the difference between file transfer, ingestion progress, durable indexing, and readiness.

## PART X — AI CHAT AND STUDY ASSISTANT

### 103. AI Study Assistant Objective

The study assistant should help students understand academic material and ask useful questions about their courses and uploaded resources.

### 104. Conversation Interface

Provide:

- Conversation history where supported.
- Message composer.
- Send action.
- Loading or generation state.
- Error recovery.
- Citation rendering.
- Source-document navigation.
- Clear indication of the selected academic context.
- Appropriate controls for supported conversation operations.
### 105. Conversation Context

When the user selects a course, document, or other academic context, communicate that context through the approved API contract. The frontend must not silently attach unrelated documents or switch contexts without indicating the change.

### 106. Message State

Represent relevant message states, including:

- Draft.
- Sending.
- Accepted.
- Generating.
- Completed.
- Failed.
- Cancelled, if supported.

Do not mark a message as successfully answered before the relevant response has been received.

### 107. Streaming

If the API supports streaming, implement it using the documented protocol. Handle:

- Connection interruption.
- Partial output.
- Cancellation.
- Completion.
- Server errors.
- Reconnection, where supported.

Do not build a custom streaming protocol in the frontend without an approved contract.

### 108. Retry Behaviour

Retry only when safe. If a request may already have been processed, use the backend's idempotency or conversation protocol to avoid creating unintended duplicate messages.

### 109. Source-Grounded Answers

When the AI response includes citations, render them as first-class elements. Possible citation details include:

- Source title.
- Page number.
- Relevant excerpt.
- Source type.
- Link to the document or passage.

Only display metadata that the response actually provides.

### 110. Citation Integrity

Do not fabricate citations, source passages, or page numbers. If the response has no supporting sources, do not invent them to make the interface look complete.

### 111. Source Navigation

Where possible, allow users to navigate from a citation to the corresponding source document or passage. If the cited page is unavailable, show a useful fallback rather than silently opening an unrelated location.

### 112. Insufficient Evidence

If the AI indicates that the available academic materials do not support an answer, communicate that limitation clearly. Do not present an unsupported response as a verified fact.

### 113. Conversation Persistence

Persist conversations through the approved API. Local drafts and temporary UI state must not be confused with server-persisted conversation history.

### 114. Conversation Errors

Provide actionable handling for:

- Network failures.
- Rate limits.
- Unavailable AI service.
- Invalid context.
- Permission failures.
- Expired sessions.
- Unsupported requests.
- Incomplete streamed responses.
### 115. Academic Chat Acceptance Gate

Users must be able to ask academic questions, receive the authoritative service response, inspect available supporting sources, and understand when a response is incomplete or unsupported.

## PART XI — READING, STUDY AND EXPLANATION EXPERIENCES

### 116. Reading Mode

Reading Mode should provide a focused environment for working through academic content. The exact capabilities must follow the AI-service and backend contracts. Potential capabilities include:

- Document viewing.
- Structured content.
- Highlighting.
- Navigation by page or section.
- Text selection.
- Explanations of selected passages.
- Questions about the current passage.
- Progress tracking where supported.
### 117. Academic Document Rendering

Preserve document structure and readability. For extracted text, respect:

- Paragraphs.
- Headings.
- Lists.
- Mathematical symbols.
- Equations.
- Tables where supported.
- Page boundaries where meaningful.

Do not flatten all content into an unreadable wall of text.

### 118. Mathematical Content

Mathematical content must render as accurately as the available data permits. Do not silently remove operators, superscripts, subscripts, or other meaningful symbols. If mathematical rendering fails, provide a readable fallback representation.

### 119. Selected-Text Explanations

Where supported, allow the user to request an explanation of a selected passage. Preserve the passage's source context when sending the request.

### 120. Explanation Display

Separate the original source from AI-generated explanations. Make it clear which content comes from the academic document and which content was generated by the assistant.

### 121. Explanation Quality Feedback

If feedback is supported, provide a lightweight mechanism for reporting inaccurate, confusing, or unhelpful explanations. Submit feedback through an approved API rather than storing it only in local state.

### 122. Study Progress

Display reading progress only when the system can determine it reliably. Distinguish local viewing progress from progress persisted to the backend.

### 123. Reading Acceptance Gate

Reading Mode must support focused study, preserve source readability, and distinguish original academic material from generated explanations.

## PART XII — QUESTION GENERATION AND QUESTION BANKS

### 124. Question Generation Objective

Enable users to generate useful practice questions from authorised academic material.

### 125. Generation Configuration

Where supported, allow users to configure:

- Source documents.
- Course context.
- Topic or section.
- Question type.
- Number of questions.
- Difficulty.
- Explanation preferences.
- Other documented generation parameters.

Only expose options supported by the API.

### 126. Source Selection

The user must understand which materials will inform the generation request. Do not silently include unrelated documents.

### 127. Generation Progress

Represent generation as a server operation where applicable. Do not assume that clicking Generate means questions have already been created.

### 128. Generated Question Display

Support the question formats actually returned by the service. Potential formats include:

- Multiple choice.
- True or false.
- Short answer.
- Structured response.
- Other approved academic question types.
### 129. Answer and Explanation Separation

For practice experiences, reveal answers and explanations according to the chosen learning mode. Do not expose answers prematurely during a controlled examination.

### 130. Source Attribution

Where the service supplies supporting source identifiers or passages, preserve that provenance in the UI. Question generation must not fabricate provenance.

### 131. Unsupported Questions

If the service reports that a question lacks sufficient source support or fails validation, communicate the result according to the API contract. Do not silently convert an invalid generated question into a verified question.

### 132. Question Editing

If users are permitted to edit generated questions, distinguish user-edited content from the original generated output where that distinction matters.

### 133. Saving Questions

Saving questions must be a backend-authoritative operation. The UI must distinguish generated, saved, and unsaved questions.

### 134. Question Banks

Where supported, provide question-bank organisation by course, topic, source, and other authorised metadata.

### 135. Question Generation Acceptance Gate

The interface must accurately represent generation status, source context, question structure, and authoritative save state.

## PART XIII — CBT AND EXAMINATION EXPERIENCE

### 136. CBT Objective

Provide a reliable computer-based testing experience that supports examination preparation and any authorised formal assessment workflows.

### 137. Examination Discovery

Show available examinations and practice sessions based on the backend's authoritative records and permissions. Clearly distinguish practice activities from formal examinations.

### 138. Examination Instructions

Before an attempt begins, display the relevant:

- Instructions.
- Duration.
- Number of questions.
- Allowed actions.
- Submission rules.
- Attempt constraints.
- Availability window.
- Other authoritative examination settings.

Do not invent examination rules.

### 139. Examination Start

Starting an examination must use the authoritative backend operation. Disable repeated submissions while the start request is pending. If the start request times out, reconcile the authoritative attempt state before initiating another attempt.

### 140. Examination Workspace

Provide a focused examination interface with:

- Current question.
- Answer controls.
- Question navigation.
- Progress indicator.
- Remaining time where authoritative.
- Answered and unanswered indicators.
- Review markers where supported.
- Submission controls.
### 141. Question Navigation

Users should be able to navigate between questions without losing valid answers. Clearly communicate the difference between unanswered, answered, and marked-for-review questions.

### 142. Answer Persistence

Follow the backend's answer-saving and examination-attempt contract. If answers are autosaved, show a truthful saving state. Do not claim an answer is saved until the appropriate acknowledgement or authoritative state is available.

### 143. Connectivity Loss

When connectivity is interrupted:

- Preserve answers locally where safe and supported.
- Communicate that synchronisation may be incomplete.
- Retry according to the documented API behaviour.
- Avoid overwriting newer server state with stale local state.
- Provide recovery guidance.

Offline answer storage must not be treated as authoritative submission.

### 144. Examination Timer

Use the backend's authoritative timing rules. Client-side countdowns are presentation aids and must not extend the examination's actual allowed duration. Handle refreshes and clock discrepancies according to the API contract.

### 145. Examination Submission

Submission is a critical operation. The interface must:

- Explain the consequences.
- Prevent accidental repeated submissions.
- Display pending submission state.
- Handle ambiguous network outcomes safely.
- Reconcile the authoritative attempt status.
- Confirm success only when the backend confirms it.
### 146. Examination Results

Display authoritative results and any permitted review information. Possible information includes:

- Score.
- Correctness.
- Explanations.
- Topic-level performance.
- Question review.
- Examination completion status.

Respect examination policies that restrict answer disclosure.

### 147. Examination Integrity

The frontend must not claim to prevent cheating through client-side controls alone. Any integrity enforcement must be designed and enforced by the appropriate server-side systems.

### 148. CBT Acceptance Gate

The examination flow must survive refreshes, network interruptions, and ambiguous requests without fabricating successful starts, saves, or submissions.

## PART XIV — LEARNING ANALYTICS AND PERSONALISATION

### 149. Learning Analytics Objective

Help students understand their progress and make useful decisions about what to study next.

### 150. Analytics Data Sources

Use authoritative backend results and supported learning analytics. Do not derive official academic performance solely from local interaction events.

### 151. Dashboard Metrics

Potential metrics include:

- Questions attempted.
- Practice completion.
- Examination results.
- Topic-level performance.
- Learning activity over time.
- Course progress.
- Areas requiring further study.

Only display metrics whose definitions and data sources are documented.

### 152. Metric Definitions

For each metric, document:

- Meaning.
- Source.
- Calculation authority.
- Time window.
- Update frequency.
- Limitations.

Do not label an arbitrary activity count as mastery.

### 153. Learning Recommendations

Display recommendations supplied by the backend or approved AI workflow. Explain the basis of a recommendation when meaningful information is available.

### 154. Confidence and Uncertainty

Avoid communicating recommendations as guarantees. Where the system exposes uncertainty or insufficient evidence, represent it appropriately.

### 155. Progress Visualisation

Use charts and summaries that are readable, accessible, and useful. Provide a textual alternative for important chart information.

### 156. Analytics Acceptance Gate

Analytics must be traceable to authoritative data and must not overstate what the available evidence demonstrates.

## PART XV — KNOWLEDGE TREES AND LEARNING MEMORY

### 157. Knowledge Tree Objective

Knowledge Trees should help users organise and explore relationships between academic concepts.

### 158. Knowledge Tree Data

Use the authoritative structures supplied by the backend or AI service. Do not fabricate relationships and present them as verified academic knowledge.

### 159. Tree Navigation

Support an appropriate way to explore:

- Concepts.
- Parent and child relationships.
- Topics.
- Related materials.
- Supporting sources where available.

Ensure tree navigation remains usable on small screens.

### 160. Tree Accessibility

Provide a keyboard-accessible and screen-reader-friendly alternative to purely visual tree interactions.

### 161. Learning Memory

Learning Memory may represent supported preferences, learning history, or other approved educational context. The interface must explain what is stored and how it is used when the product exposes that information.

### 162. Memory Management

Users should have appropriate controls over supported memory features. Available controls must match the backend's actual capabilities. Do not promise deletion, editing, or retention behaviour that the backend does not implement.

### 163. Memory Privacy

Avoid unnecessarily exposing sensitive learning information in public or shared views. Do not send hidden or unrelated profile information to AI requests.

### 164. Knowledge Acceptance Gate

Knowledge Trees and Learning Memory must represent supported, authoritative information and expose clear controls for the operations the product actually allows.

## PART XVI — FUTA MAPS AND LOCATION-BASED LEARNING

### 165. Product Commitment

FUTA Maps is part of the broader BUILD roadmap. It must be treated as a real product capability rather than an incidental third-party map embed.

### 166. Mapping Architecture

The intended direction includes:

- OpenStreetMap data.
- MapLibre for React Native where appropriate to the mobile application.
- A BUILD-owned verified campus-place catalogue.
- Routing.
- Offline maps.
- Academic campus discovery.

The web frontend must use a compatible mapping approach appropriate to its actual framework and deployment environment. Do not assume that a React Native mapping component can be copied directly into a web application.

### 167. Campus Catalogue

Campus places should come from an authoritative, maintained catalogue. Potential place categories include:

- Academic buildings.
- Departments.
- Lecture halls.
- Laboratories.
- Libraries.
- Student services.
- Other verified campus facilities.
### 168. Place Information

Where supported, a place may expose:

- Name.
- Category.
- Description.
- Coordinates.
- Opening information.
- Accessibility information.
- Related academic details.

Do not fabricate campus coordinates or opening hours.

### 169. Map Search

Provide search and filtering appropriate to the available catalogue.

### 170. Routing

Where routing is available, display the route and any supported travel information. Do not imply that a route is accessible or currently usable unless the data supports that claim.

### 171. Location Permissions

Request location access only when needed. Explain why location is requested and provide a useful alternative when permission is denied.

### 172. Offline Maps

Offline map support must follow the approved data, licensing, storage, and synchronisation architecture. Do not promise that the entire campus map is available offline until the relevant data has been downloaded and verified.

### 173. Map Acceptance Gate

Campus maps must use appropriate data sources, clear location-permission handling, and truthful online/offline status indicators.

## PART XVII — OFFLINE LEARNING AND SYNCHRONISATION

### 174. Product Commitment

Offline AI and offline learning are long-term BUILD commitments. They must be designed as deliberate capabilities with explicit consistency and resource constraints.

### 175. Offline Capability Discovery

Determine which operations are supported offline by the current architecture. Do not imply that all online features are available without connectivity.

### 176. Offline Model Architecture

The broader roadmap includes a replaceable local AI model and stronger online AI providers. The frontend must integrate with the approved offline interface rather than embedding model-specific logic throughout the UI.

### 177. Capability Indicators

Communicate whether the user is:

- Online.
- Offline.
- Using local inference.
- Waiting for online inference.
- Synchronising changes.
- Waiting for a required download.
- Unable to perform an operation offline.

Only show these states when they can be determined reliably.

### 178. Offline Data Selection

Define which documents and other learning resources may be stored locally. Consider storage limits, access permissions, data sensitivity, and user control.

### 179. Local Storage

Use appropriate storage mechanisms for the target platform. Protect sensitive cached data and avoid storing credentials or privileged tokens in unsafe locations.

### 180. Synchronisation Queue

Where offline mutations are supported, use an explicit synchronisation protocol. Each queued operation must have sufficient identity and idempotency information to avoid accidental duplicate processing.

### 181. Conflict Resolution

Define conflict handling for operations that may have changed on the server while the device was offline. Do not silently overwrite newer authoritative data.

### 182. Synchronisation Visibility

Show pending, successful, and failed synchronisation states where appropriate. Users must be able to distinguish locally saved work from server-confirmed work.

### 183. Offline Examinations

Offline examination behaviour requires a separate explicit product and security decision. Do not assume that offline formal examinations are allowed merely because offline practice is supported.

### 184. Offline Acceptance Gate

Offline support is complete only for the specific operations whose local storage, execution, and synchronisation behaviour have been implemented and tested.

## PART XVIII — NOTIFICATIONS, SETTINGS AND ACCOUNT MANAGEMENT

### 185. Notifications

Display notifications supplied by the backend. Potential categories include:

- Document processing.
- Examination activity.
- Learning reminders.
- System announcements.
- Account events.

Only show categories that are actually supported.

### 186. Notification State

Where supported, distinguish read and unread notifications and reflect changes in the authoritative service.

### 187. Notification Navigation

A notification may deep-link to its related resource only when the destination is valid and authorised.

### 188. User Preferences

Provide settings for preferences supported by the backend, such as:

- Interface preferences.
- Notification preferences.
- Accessibility preferences.
- Theme preferences.
- Supported learning preferences.

Do not present local-only preferences as synchronised account settings.

### 189. Account Security

Provide appropriate account-security information and actions supported by the backend.

### 190. Account Deletion

If account deletion is supported, explain its consequences and follow the authoritative deletion workflow. Do not implement deletion as a local UI action.

### 191. Settings Acceptance Gate

Changes to persisted settings must be confirmed by the authoritative service, and failures must not leave the interface claiming a successful update.

## PART XIX — SUBSCRIPTIONS, PAYMENTS AND ENTITLEMENTS

### 192. Subscription Interfaces

Subscription-related pages should exist only for the subscription capabilities supported by BUILD.

### 193. Plan Presentation

Display plan names, prices, features, and limits from authoritative configuration. Avoid duplicating pricing and entitlement rules across frontend components.

### 194. Entitlement Enforcement

The frontend may hide or explain unavailable features, but the backend must enforce entitlement restrictions.

### 195. Payment Flow

If payment processing is supported, use the approved payment-provider integration and backend workflow. Do not treat a browser redirect or client-side success message as proof of payment.

### 196. Payment Reconciliation

After an ambiguous payment result, reconcile the authoritative transaction status before showing success or prompting another payment.

### 197. Subscription Acceptance Gate

The frontend must never grant paid access solely because a local action or redirect appeared successful.

## PART XX — ADMINISTRATION AND PRIVILEGED WORKFLOWS

### 198. Administrative Scope

Administrative functionality must follow the actual backend role and permission model. Potential areas include:

- User administration.
- Organisation management.
- Academic catalogue management.
- Content oversight.
- Platform monitoring.
- Supported operational controls.

These features must not be assumed to exist merely because they are listed here.

### 199. Role-Aware Administrative UI

Administrative controls should appear only for authorised users. The backend must independently enforce every privileged action.

### 200. Destructive Operations

For destructive actions:

- Explain the consequence.
- Require appropriate confirmation.
- Prevent accidental duplicate submissions.
- Display the authoritative outcome.
- Provide a safe recovery path where supported.
### 201. Administrative Auditability

Where the backend exposes audit history, present it clearly and without allowing unauthorised modification.

### 202. Administrative Acceptance Gate

Privileged interfaces must enforce least-privilege presentation and rely on server-side authorisation for actual security.

## PART XXI — FORMS, SEARCH, FEEDBACK AND USER INTERACTION

### 203. Form Design

Forms should be concise, understandable, and accessible. Use labels, instructions, and validation messages that help users correct errors.

### 204. Validation Timing

Use appropriate validation timing for each workflow. Avoid showing errors before the user has had a reasonable opportunity to enter information.

### 205. Server Validation

Treat server validation as authoritative. Map server errors to relevant fields where possible.

### 206. Unsaved Changes

Warn users before leaving a page when doing so would risk losing meaningful unsaved work. Do not create unnecessary warnings for harmless navigation.

### 207. Search

Search interfaces should communicate:

- Search scope.
- Query state.
- Results.
- Empty results.
- Errors.
- Available filters.
### 208. Feedback

Provide feedback mechanisms for supported product workflows. Do not create fake submission success for feedback that has not been accepted by the service.

### 209. Destructive Actions

Use confirmation for irreversible or high-impact actions. Make destructive buttons visually and semantically distinct.

### 210. Interaction Acceptance Gate

Users must receive understandable feedback for important actions, including validation failures, network failures, and successful completion.

## PART XXII — ACCESSIBILITY AND INCLUSIVE DESIGN

### 211. Accessibility Standard

Target WCAG 2.2 Level AA where applicable. Use semantic HTML and native platform capabilities where appropriate.

### 212. Keyboard Navigation

All critical web workflows must be operable using a keyboard. Ensure focus order is logical and visible.

### 213. Screen Readers

Provide accessible names, descriptions, form labels, and meaningful status announcements.

### 214. Contrast

Text, controls, and focus indicators must satisfy applicable contrast requirements.

### 215. Colour Independence

Do not use colour as the only way to indicate success, failure, selection, or examination state.

### 216. Reduced Motion

Respect operating-system and browser reduced-motion preferences.

### 217. Text Scaling

The interface must remain usable when text is enlarged.

### 218. Accessible Errors

Validation errors must be associated with their corresponding fields. Important failures should be announced appropriately without overwhelming users.

### 219. Accessible Academic Content

Preserve meaningful structure in documents, explanations, questions, tables, and mathematical content.

### 220. Accessibility Testing

Combine automated checks with keyboard testing and manual review of important workflows. Automated accessibility checks alone are insufficient.

## PART XXIII — SECURITY, PRIVACY AND TRUST

### 221. Security Objective

The frontend must protect user information, minimise exposure of sensitive data, and respect the backend's security model.

### 222. Authentication Security

Follow the approved session architecture. Do not expose authentication secrets in URLs, logs, analytics events, or error messages.

### 223. Authorisation

The UI is not an authorisation boundary. The backend must verify every protected resource and mutation.

### 224. Tenant Isolation

Do not mix data from different organisations, memberships, or academic contexts. When the active context changes, ensure relevant cached data and queries are reconciled.

### 225. Cross-Tenant Cache Safety

Include the necessary tenant or membership context in client-side cache keys where appropriate. Clear or isolate sensitive cached data when the authenticated identity or active context changes. Never rely on cache-key discipline instead of backend access controls.

### 226. XSS Prevention

Render user-generated content safely. Avoid unsafe HTML insertion unless content has been appropriately sanitised and the design has been reviewed.

### 227. CSRF Protection

If cookie-based authentication is used, follow the backend's CSRF protection contract.

### 228. Content Security

Follow the approved Content Security Policy and related browser-security configuration. Do not weaken security controls merely to make a third-party widget work.

### 229. File Upload Security

Do not assume a file is safe because its extension or MIME type looks correct. Follow the backend's upload protocol and use only authorised upload destinations.

### 230. Sensitive Logging

Do not log:

- Passwords.
- Access tokens.
- Session secrets.
- Private document contents.
- Unnecessary personal information.
- Privileged service credentials.
- Full sensitive request payloads.
### 231. Privacy-Aware Analytics

Collect only approved product analytics. Avoid sending academic content, private conversations, or sensitive identifiers to third-party analytics systems without an explicit, reviewed design.

### 232. Error Disclosure

Display useful errors without exposing stack traces, secrets, internal service addresses, or implementation details.

### 233. Dependency Security

Keep dependencies controlled and maintained. Run the repository's approved dependency and security checks. Investigate serious findings rather than automatically suppressing them.

### 234. Security Acceptance Gate

The frontend must not bypass backend permissions, expose privileged credentials, or allow a client-side state change to masquerade as an authorised operation.

## PART XXIV — PERFORMANCE AND RELIABILITY

### 235. Performance Objective

The frontend should feel responsive under realistic network and device conditions.

### 236. Performance Baseline

Measure the current application before optimising it. Record relevant build size, route performance, network activity, and user-visible latency.

### 237. Loading Strategy

Load data and components according to their importance and actual dependencies. Avoid blocking an entire page on unrelated content.

### 238. Code Splitting

Use route-level or feature-level code splitting where supported and beneficial. Do not add complexity without measurable value.

### 239. Large Documents

Avoid loading unnecessarily large academic documents or rendering every page when only a small section is needed.

### 240. Long Lists

Use appropriate pagination, virtualisation, or incremental loading for large collections.

### 241. Request Deduplication

Avoid repeated identical requests caused by unnecessary component remounts or duplicated effects.

### 242. Cancellation

Cancel obsolete requests where supported. Do not allow stale responses to overwrite newer state.

### 243. Retry Strategy

Retries must be bounded and must respect idempotency and server rate limits. Do not retry every failed mutation blindly.

### 244. Error Boundaries

Use suitable error boundaries or equivalent mechanisms so a local rendering failure does not unnecessarily destroy the entire application.

### 245. Reliability Acceptance Gate

The application must recover gracefully from ordinary network failures, expired sessions, server errors, and interrupted user workflows.

## PART XXV — OBSERVABILITY AND DIAGNOSTICS

### 246. Frontend Logging

Use structured, privacy-aware logging where appropriate.

### 247. Correlation

Propagate correlation identifiers when the API supports them. This helps connect a frontend failure to backend or AI-service diagnostics.

### 248. Error Reporting

Use the approved error-reporting system if one exists. Avoid introducing a third-party service without reviewing its privacy and security implications.

### 249. User-Facing Errors

User-facing errors should explain what happened and what the user can do next.

### 250. Operational Diagnostics

Where appropriate, capture:

- Route failures.
- API failures.
- Upload failures.
- Ingestion-status polling failures.
- AI request failures.
- Examination submission failures.
- Synchronisation failures.

Do not capture sensitive payloads merely to make debugging easier.

### 251. Observability Acceptance Gate

Important failures must be diagnosable without exposing confidential academic or account data.

## PART XXVI — TESTING STRATEGY

### 252. Testing Philosophy

Tests must verify behaviour and correctness rather than merely increasing coverage numbers.

### 253. Unit Tests

Test:

- Utility functions.
- State transitions.
- Validation logic.
- Error mapping.
- Presentation helpers.
- Permission-dependent rendering.
- API response transformation.
### 254. Component Tests

Test important component states and interactions. Examples include:

- Form validation.
- Modal confirmation.
- Upload selection.
- Loading states.
- Citation rendering.
- Examination navigation.
- Accessible status announcements.
### 255. API Contract Tests

Verify frontend expectations against authoritative request and response schemas where possible.

### 256. Integration Tests

Test workflows that cross multiple frontend layers. Examples include:

- Login and protected navigation.
- Upload and ingestion status.
- Chat and citation rendering.
- Examination answer persistence.
- Session expiry during an operation.
### 257. End-to-End Tests

Prioritise critical user journeys. At minimum, develop tests for the following where the corresponding backend features exist. Journey A — Authentication Sign in → load profile → enter dashboard → sign out. Journey B — Academic Setup Complete onboarding → select academic context → view authorised courses. Journey C — Document Ingestion Upload academic material → observe processing → reach authoritative "ready" → reopen the document. Journey D — Grounded Chat Select a source document → ask a question → receive a response → inspect the available citations. Journey E — Practice Questions Select academic material → generate questions → answer them → review the supported explanations. Journey F — CBT Start examination → answer questions → persist answers → submit → view the authoritative result. Journey G — Tenant Isolation Switch or change authorised context → verify that previously cached data from another context is not exposed. Journey H — Interrupted Network Interrupt connectivity during a supported workflow → restore connectivity → verify safe recovery without duplicate mutations.

### 258. Mocking Policy

Mocks are appropriate for isolated frontend development and component tests. Critical integration gates must also run against the real service boundaries when required. Do not use a mock to claim that backend integration has been verified.

### 259. Accessibility Tests

Include automated accessibility checks and manual verification of important journeys.

### 260. Visual Regression

Use visual regression testing where it provides meaningful protection for important layouts. Do not let screenshot tests replace functional assertions.

### 261. Browser Coverage

Support the browsers required by the product's target audience and deployment environment. Document the supported browser matrix.

### 262. Responsive Tests

Verify key journeys at representative screen sizes.

### 263. Test Data

Use synthetic or explicitly authorised test data. Do not commit private academic documents, production credentials, or real user data unnecessarily.

### 264. Flaky Tests

Investigate intermittent failures. Capture sufficient diagnostics to determine whether the problem lies in timing, infrastructure, test assumptions, or application behaviour. Do not weaken meaningful tests merely to make CI green.

### 265. Test Acceptance Gate

All required checks must pass before merge. Existing failures must be identified and distinguished from regressions.

## PART XXVII — DEVELOPMENT WORKFLOW AND CODE QUALITY

### 266. Incremental Implementation

Build the application in small, reviewable increments. Each increment should deliver a coherent capability and include its required tests.

### 267. Narrow Changes

Avoid combining unrelated features, large refactors, dependency replacements, and visual redesigns in one change.

### 268. Type Safety

Use the strongest practical type guarantees supported by the existing stack. Avoid unnecessary "any", unchecked response assumptions, and broad type assertions.

### 269. Error Handling

Do not swallow exceptions silently. Handle errors at the appropriate layer and preserve diagnostic context without exposing sensitive data.

### 270. Configuration

Centralise environment-specific configuration. Validate required settings at startup or build time where appropriate.

### 271. Environment Separation

Distinguish development, testing, staging, and production configuration. Test-only functionality must not accidentally be enabled in production.

### 272. Dependency Management

Use the repository's existing package manager and lockfile. Do not introduce overlapping libraries without a clear need.

### 273. Code Review

Review changes for:

- Correctness.
- Contract compliance.
- Security.
- Accessibility.
- State consistency.
- Error handling.
- Test quality.
- Maintainability.
- Unintended regressions.
### 274. Documentation

Update relevant documentation when architecture, configuration, routes, APIs, or development workflows change.

### 275. Completion Reporting

Every implementation report must distinguish:

- What was changed.
- What was tested.
- Which checks passed.
- Which checks failed.
- What was not tested.
- What remains incomplete.
- Any known risks.

Never claim to have run a command or inspected a file without actually doing so.

## PART XXVIII — CI/CD AND DEPLOYMENT

### 276. Continuous Integration

Use the repository's established CI system where available.

### 277. Required Checks

The required checks should include the applicable:

- Dependency installation.
- Formatting.
- Linting.
- Type checking.
- Unit tests.
- Component tests.
- Build.
- Security checks.
- Contract tests.
- Integration tests.
- End-to-end tests.
### 278. Build Reproducibility

The application must build reproducibly from a clean checkout using the documented process.

### 279. Environment Configuration

Document the environment variables required for each deployment environment. Never commit secrets.

### 280. Deployment Compatibility

Verify compatibility with the actual deployment platform and its routing, asset, and runtime behaviour.

### 281. Database and API Compatibility

Frontend deployments must account for the backend version and API contracts they depend on. Do not assume that every independently deployed service updates atomically.

### 282. Rollback

Document the process for reverting a frontend deployment when a critical regression is found.

### 283. Release Acceptance Gate

A release is ready only when its required CI checks pass, its configuration is valid, and its critical user journeys have been verified.

## PART XXIX — API EVOLUTION AND CROSS-REPOSITORY COORDINATION

### 284. API Ownership

The backend owns business API contracts. The AI service owns its internal and explicitly exposed AI contracts. The frontend consumes those contracts.

### 285. Contract Changes

A change to a request or response schema must identify its impact on the frontend and mobile application.

### 286. Backward Compatibility

Prefer changes that preserve existing clients where practical. Breaking changes require explicit coordination and migration planning.

### 287. Contract Documentation

Keep API documentation and generated client types aligned with the deployed contract.

### 288. Cross-Repository Testing

Where practical, test the frontend against a known compatible backend and AI-service configuration.

### 289. Dependency Register

Maintain a register of frontend features blocked by missing backend or AI-service functionality.

### 290. Integration Acceptance Gate

The frontend must not mark an integration complete until the actual contract, error behaviour, permissions, and critical user journey have been verified.

## PART XXX — PRODUCT CONTENT AND EDUCATIONAL TRUST

### 291. Academic Accuracy

The frontend must preserve the distinction between:

- Original academic material.
- Extracted document text.
- AI-generated explanations.
- Generated questions.
- Official examination results.
- Personal learning recommendations.
### 292. Source Attribution

Preserve source attribution wherever the backend or AI service provides it.

### 293. Uncertainty

Communicate limitations when a document is unreadable, evidence is insufficient, or a feature is unavailable.

### 294. No Fabricated Progress

Do not display fabricated study streaks, question counts, performance statistics, ingestion progress, or model confidence.

### 295. No False Completion

Do not claim that a document is indexed, an answer is saved, an examination is submitted, or a payment is complete without the appropriate authoritative confirmation.

### 296. Educational Feedback

When users report a problem with an explanation or question, use the approved feedback workflow.

### 297. Trust Acceptance Gate

The interface must help users distinguish what the platform knows, what it generated, what it verified, and what remains uncertain.

## PART XXXI — PRODUCT ROADMAP AND IMPLEMENTATION PHASES

### 298. Phase 0 — Repository Audit

Deliverables:

- Repository inventory.
- Existing architecture report.
- Existing route map.
- Dependency inventory.
- Baseline build and test report.
- Backend and AI-service contract inventory.
- Gap register.
- Risk register.
- Implementation plan.

Exit criterion: The team understands the existing application and its integration constraints.

### 299. Phase 1 — Frontend Foundation

Deliverables:

- Agreed application architecture.
- Design tokens.
- Reusable UI primitives.
- Route structure.
- API-client foundation.
- Error-handling foundation.
- Environment configuration.
- Test infrastructure.
- CI integration.

Exit criterion: The application builds reliably, uses consistent foundations, and has a tested path to the backend.

### 300. Phase 2 — Authentication and Academic Context

Deliverables:

- Sign-in and sign-up flows supported by the backend.
- Session management.
- Protected routes.
- Profile interfaces.
- Onboarding.
- Academic-context selection.
- Role-aware navigation.

Exit criterion: A user can authenticate, establish the supported academic context, and access authorised routes.

### 301. Phase 3 — Dashboard and Academic Organisation

Deliverables:

- Dashboard.
- Course listing.
- Course details.
- Academic material navigation.
- Search and filtering.
- Empty and error states.

Exit criterion: Users can navigate their actual academic structure and locate relevant resources.

### 302. Phase 4 — Upload and Ingestion

Deliverables:

- File selection.
- Upload workflow.
- Academic upload chat.
- Metadata clarification.
- Ingestion-state rendering.
- Processing recovery.
- Document details.
- Document reopening.

Exit criterion: The UI correctly represents the complete authoritative ingestion lifecycle.

### 303. Phase 5 — AI Chat and Reading

Deliverables:

- AI study interface.
- Conversation persistence.
- Context selection.
- Streaming where supported.
- Citation rendering.
- Source navigation.
- Reading Mode.
- Selected-passage explanations.

Exit criterion: Users can ask academic questions and inspect available supporting evidence.

### 304. Phase 6 — Question Generation and CBT

Deliverables:

- Question-generation configuration.
- Generated-question display.
- Question-bank integration.
- Practice workflow.
- Examination interface.
- Answer persistence.
- Submission recovery.
- Results and explanations.

Exit criterion: Supported practice and examination workflows function without false success or lost authoritative state.

### 305. Phase 7 — Learning Intelligence

Deliverables:

- Learning progress.
- Analytics.
- Knowledge Trees.
- Learning Memory interfaces.
- Supported recommendations.

Exit criterion: Personalisation and analytics use actual, documented data sources.

### 306. Phase 8 — Maps and Campus Experience

Deliverables:

- Mapping integration.
- Verified campus catalogue integration.
- Place search.
- Place details.
- Routing where supported.
- Location permissions.
- Offline map foundations.

Exit criterion: The supported campus workflows function with appropriate data and permission handling.

### 307. Phase 9 — Offline Learning

Deliverables:

- Offline capability discovery.
- Local resource management.
- Local AI integration where available.
- Synchronisation state.
- Conflict handling.
- Recovery workflows.

Exit criterion: Every claimed offline capability has a defined and tested operational boundary.

### 308. Phase 10 — Administrative and Account Features

Deliverables:

- Supported administrative screens.
- Notification interfaces.
- Settings.
- Subscription interfaces where supported.
- Account-management workflows.

Exit criterion: Each interface follows the actual backend permissions and supported operations.

### 309. Phase 11 — Hardening and Release Readiness

Deliverables:

- Accessibility review.
- Performance assessment.
- Security review.
- Cross-browser tests.
- Responsive tests.
- Cross-repository integration tests.
- Critical-path end-to-end tests.
- Deployment documentation.
- Known-limitations register.

Exit criterion: The release meets the agreed quality and operational acceptance criteria.

## PART XXXII — RELEASE GATES AND QUALITY MEASUREMENT

### 310. Gate A — Repository Integrity

- The application builds from a clean checkout.
- Existing critical workflows are preserved.
- Required linting and type checks pass.
- No unexplained dependency or configuration drift remains.
### 311. Gate B — Contract Integrity

- All integrated endpoints are documented.
- Request and response assumptions match the authoritative contracts.
- Authentication and permission failures are handled.
- No critical feature relies on an undocumented production endpoint.
### 312. Gate C — Workflow Integrity

- Authentication works.
- Academic navigation works.
- Upload and ingestion states are accurate.
- AI chat and citations work where supported.
- Question generation works where supported.
- Examination flows work where supported.
### 313. Gate D — Security

- Protected routes are handled correctly.
- Backend authorisation remains authoritative.
- Tenant-specific caches are isolated.
- No privileged credentials are exposed.
- Sensitive data is not unnecessarily logged.
- High-risk dependency findings are addressed.
### 314. Gate E — Accessibility

- Critical flows are keyboard-operable.
- Important forms are labelled.
- Focus behaviour is predictable.
- Errors and status changes are accessible.
- Contrast and text scaling are verified.
### 315. Gate F — Reliability

- Loading, empty, success, and failure states exist.
- Ambiguous operations are reconciled safely.
- Retries respect idempotency.
- Important workflows survive ordinary network interruption.
- No critical operation reports false success.
### 316. Gate G — Integration

- The frontend is tested against compatible service versions.
- Cross-repository contracts are verified.
- Critical workflows pass end-to-end.
- Unavailable features are documented honestly.
### 317. Gate H — Release

- Required CI checks pass.
- Production configuration is verified.
- Deployment and rollback procedures exist.
- Critical defects are resolved.
- Known limitations are recorded.
- The release report accurately reflects the evidence.
## PART XXXIII — REQUIREMENTS TRACEABILITY

### 318. Requirement Identifiers

Assign stable identifiers to requirements. Suggested format:

- "FE-FOUND-*" — foundation.
- "FE-ARCH-*" — architecture.
- "FE-AUTH-*" — authentication.
- "FE-NAV-*" — navigation.
- "FE-ACADEMIC-*" — academic structure.
- "FE-UPLOAD-*" — upload and ingestion.
- "FE-CHAT-*" — AI chat.
- "FE-READ-*" — Reading Mode.
- "FE-QUESTION-*" — question generation.
- "FE-CBT-*" — examinations.
- "FE-ANALYTICS-*" — analytics.
- "FE-KNOWLEDGE-*" — Knowledge Trees and Memory.
- "FE-MAPS-*" — maps.
- "FE-OFFLINE-*" — offline support.
- "FE-SEC-*" — security.
- "FE-A11Y-*" — accessibility.
- "FE-TEST-*" — testing.
- "FE-RELEASE-*" — release readiness.
### 319. Traceability Matrix

For every requirement, record: Field - Meaning Requirement ID - Stable identifier Requirement - What the frontend must do Priority - Critical, high, medium, or low User journey - Relevant user workflow Owning layer - Frontend, backend, AI service, or shared API contract - Relevant contract or documented gap Dependencies - Required capabilities Implementation status - Actual current status Test evidence - Relevant test or CI evidence Known limitations - Outstanding issues

### 320. Requirement Priorities

Use: P0 — Critical Required for security, data integrity, or a critical launch workflow. P1 — High Required for the core usable product. P2 — Medium Important enhancement or supporting capability. P3 — Later Optional or long-term capability. Do not classify every roadmap item as P0.

### 321. Traceability Acceptance Gate

No major feature should be declared production-ready without traceable requirements and corresponding test evidence.

## PART XXXIV — RISKS AND MITIGATIONS

### 322. Contract Drift

Risk: Frontend assumptions diverge from backend or AI-service behaviour. Mitigation: Contract-first development, generated types where practical, and integration tests.

### 323. False Success States

Risk: Users believe a document is ready or an examination is submitted when the operation failed. Mitigation: Render authoritative operation states and reconcile ambiguous outcomes.

### 324. Tenant Data Leakage

Risk: Cached data from one context appears in another. Mitigation: Context-aware query keys, safe cache invalidation, and server-side authorisation.

### 325. Excessive Frontend Complexity

Risk: The application becomes difficult to maintain because too much domain logic is implemented in UI components. Mitigation: Domain-service separation and clear ownership boundaries.

### 326. Offline Data Inconsistency

Risk: Local changes conflict with newer server data. Mitigation: Explicit sync queues, idempotency, conflict handling, and authoritative reconciliation.

### 327. Poor Academic Content Rendering

Risk: Mathematical symbols, tables, or page references become unreadable. Mitigation: Document-rendering tests and representative academic fixtures.

### 328. Unreliable AI Experience

Risk: AI timeouts or partial responses create misleading UI states. Mitigation: Explicit request lifecycle states, cancellation handling, and safe recovery.

### 329. Accessibility Regression

Risk: New features become unusable for keyboard or assistive-technology users. Mitigation: Reusable accessible primitives, automated checks, and manual testing.

### 330. Scope Expansion

Risk: Long-term features delay the core application. Mitigation: Phased delivery, explicit priorities, and dependency-based sequencing.

## PART XXXV — IMPLEMENTATION AGENT OPERATING RULES

### 331. Required Operating Mode

The coding agent must operate as a senior frontend engineer responsible for implementation correctness, integration quality, security, maintainability, and delivery. It must not act as an unstructured code generator.

### 332. Inspect Before Editing

Before changing code, inspect the relevant files, contracts, tests, and existing patterns. Do not guess file paths or report inspection that did not occur.

### 333. Plan Before Large Changes

For a substantial feature, produce a short implementation plan identifying:

- Requirements.
- Existing components to reuse.
- API dependencies.
- Files likely to change.
- Risks.
- Tests.
- Acceptance criteria.

For small, obvious fixes, avoid unnecessary planning overhead.

### 334. Implement in Vertical Slices

Prefer a complete, testable user journey over many disconnected UI components. A vertical slice should include the UI, API integration, loading and error handling, and tests.

### 335. Follow Existing Conventions

Reuse established repository conventions unless there is a documented reason to change them.

### 336. No Speculative APIs

Do not invent production endpoints or response schemas. If a required capability is missing, record the contract gap and propose the appropriate cross-repository change.

### 337. No Fake Production Data

Mocks may support development and tests, but production interfaces must not silently fall back to fabricated academic data.

### 338. No Hidden Failure

Do not suppress errors, swallow failed promises, or replace a failed authoritative request with fabricated success.

### 339. No Unjustified Rewrites

Do not replace the framework, routing system, state-management architecture, or component library without a clear requirement and approved migration plan.

### 340. Security by Default

Do not bypass permission checks, expose credentials, disable security controls, or add production-accessible test hooks.

### 341. Test Every Critical Mutation

Authentication, upload, examination submission, subscription operations, and other important mutations require tests for failure and ambiguous outcomes.

### 342. Verify Before Claiming Completion

Run the relevant checks and report their actual results. If a test was not run, say so. If a failure remains, report it.

### 343. Maintain a Living Progress Register

Keep a concise implementation tracker containing:

- Requirement ID.
- Feature.
- Status.
- Relevant files.
- API dependency.
- Tests.
- Blockers.
- Next action.
### 344. Preserve Reviewability

Use narrow commits and logically grouped changes. Avoid bundling unrelated features into a single implementation step.

### 345. End-of-Task Report

Every substantial implementation task should end with:

### 1. Summary of changes.

### 2. Requirements addressed.

### 3. Important architectural decisions.

### 4. Files changed.

### 5. Tests executed.

### 6. Actual test results.

### 7. Known limitations.

### 8. Remaining blockers.

### 9. Recommended next implementation step.

## PART XXXVI — FINAL PRODUCT ACCEPTANCE CRITERIA

### 346. Functional Completeness

The frontend implements the agreed scope for the current release and does not present unsupported capabilities as operational.

### 347. Architectural Correctness

The frontend consumes authoritative service contracts and does not duplicate backend business rules or AI-service responsibilities.

### 348. User Experience

Users can complete the critical academic workflows with understandable navigation, clear feedback, and recoverable errors.

### 349. Academic Integrity

The frontend distinguishes source material, generated content, authoritative examination results, and uncertain information.

### 350. Security

Protected resources remain protected, tenant-specific information stays isolated, and sensitive credentials are not exposed.

### 351. Accessibility

Critical workflows are usable with supported assistive technologies and input methods.

### 352. Reliability

The interface handles loading, failure, retries, and ambiguous outcomes without falsely reporting success.

### 353. Integration

The application works against the intended backend and AI-service contracts.

### 354. Testing

Required unit, component, integration, accessibility, and end-to-end checks pass for the agreed release scope.

### 355. Deployment

The application builds reproducibly and has documented deployment configuration and rollback procedures.

### 356. Documentation

The repository documents the architecture, environment configuration, development workflow, routes, and important integration decisions.

### 357. Honest Release Status

The release report distinguishes verified capabilities from incomplete work, known limitations, and future roadmap items.

FINAL DIRECTIVE BUILD Frontend must be developed as a first-class component of the BUILD platform, not as a disconnected visual layer. The frontend must respect the authoritative responsibilities of "build-backend" and "ai-service", integrate through explicit contracts, preserve tenant and permission boundaries, provide coherent academic workflows, and communicate the actual state of every important operation. Implementation must proceed through repository discovery, architecture validation, phased delivery, and evidence-based acceptance gates. Do not attempt to implement every long-term feature simultaneously. Establish a reliable foundation, complete critical user journeys, prove integration correctness, and expand the product through small, reviewable, tested increments. The ultimate goal is a production-quality academic interface that makes BUILD's intelligence useful to students while preserving correctness, security, accessibility, and long-term maintainability.

How I recommend we use this document This is the master product specification, not yet the instruction to start changing code. That distinction matters because our backend and AI service have explicit ownership boundaries, and the frontend must integrate with their actual contracts. I recommend the following sequence:

### 1. Place the document in build-frontend/docs/BUILD_FRONTEND_MASTER_PRD.md. Treat it as the frontend's master requirements document, subject to repository discovery and review.

### 2. Have the coding agent audit the existing frontend repository. It should inspect the current architecture, routes, tests, backend APIs, AI-service integration, and any existing design system before making changes.

### 3. Create a traceable implementation plan. Map each applicable requirement to the existing implementation, required API contracts, tests, and unresolved dependencies.

### 4. Implement in vertical slices. Start with the foundation and authentication, then the core academic workflows, before moving into advanced AI experiences and long-term features.

### 5. Keep the three repositories coordinated. A frontend feature must not be marked integrated merely because its page exists or its mock tests pass.

One important clarification: I remember the 146-section master PRD and the 149+ section-style implementation plan, but I haven't retrieved their complete original texts in this turn. The document above is a new frontend specification based on the architecture and product decisions available in our project context; it is not a verbatim reconstruction of those earlier documents. The next useful artifact would be the agentic implementation prompt for build-frontend—the equivalent of the repository-specific prompt we used to begin the backend work. It should instruct the coding agent to inspect this PRD, audit the repository, discover the actual contracts, and build a requirements-to-tests implementation plan before editing anything.

## Appendix — Implementation Notes

One important clarification: The canonical docs/BUILD_MASTER_PRD.md had 146 sections, while the backend implementation plan followed a 149+ section-style execution approach. This frontend master PRD establishes the same discipline: a comprehensive specification followed by an implementation strategy that makes an AI coding agent inspect the existing repository, respect the architecture, implement features incrementally, and prove that they work.

Frontend must not become a second backend or independently implement AI business logic. It presents the product, manages user interactions, communicates through approved API contracts, and reflects authoritative backend and AI-service results.

Next artifact recommended: Agentic implementation prompt for build-frontend — instructing the coding agent to inspect this PRD, audit the repository, discover actual contracts, and build a requirements-to-tests implementation plan before editing anything.
