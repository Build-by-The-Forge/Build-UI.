# BUILD MOBILE FRONTEND

## Repository Audit & Independent Implementation Plan

**Project:** BUILD AI CBT & Learning Platform\
**Repository:** `Build-by-The-Forge/Build-UI`\
**Application directory:** `mobile-app-main/`\
**Master specification:** [`docs/BUILD_FRONTEND_MASTER_PRD.md`](BUILD_FRONTEND_MASTER_PRD.md)\
**Plan status:** Proposed implementation plan\
**Priority:** Frontend development before backend and AI-service production readiness\
**Release policy:** Mobile application production is the final phase.

---

## Audit conclusion

The app already has a substantial UI prototype. The immediate task is to turn it into a well-structured, testable mobile client, with experiences that work on their own and clean boundaries for later integration.

The developer can start immediately on:
- navigation and design-system consistency;
- local-first experiences;
- form validation and component architecture;
- mock adapters and screen states;
- accessibility and automated tests.

The developer must not implement any of these yet:
- production authentication;
- authoritative academic data;
- AI inference;
- document ingestion;
- CBT submission or scoring;
- subscriptions;
- a production mobile release.

---

# 1. Executive Direction

This workstream prepares the BUILD mobile frontend while the Core Backend and AI Service finish their own production-readiness requirements. The frontend developer must not be idle in the meantime.

The work must still be structured so that the frontend introduces none of the following:

- Guessed API contracts.
- Duplicate business logic.
- Client-side authorization.
- Fake production functionality.
- Direct access to internal AI-service infrastructure.
- Dependencies on unfinished backend functionality.
- Premature mobile release requirements.

The immediate objectives:
1. Establish a high-quality mobile application foundation.
2. Complete the independent UI and the local-first functionality.
3. Prepare the integration adapters.
4. Verify the frontend against controlled test fixtures.

The mobile application must remain an integration-ready client. It must not become an independent implementation of the backend or the AI service.

## 1.1 Current sequencing

The intended sequence is:

1. Frontend audit and architecture preparation.
2. Frontend foundations and shared components.
3. Independent student experiences.
4. Local-first academic workflows.
5. Frontend state management and mock integration.
6. Frontend testing and integration-readiness.
7. Backend and AI-service integration when their contracts and implementations are ready.
8. Mobile production hardening and release.

**Mobile production is not part of the immediate deliverable.**

# 2. Architecture and Ownership Rules

The frontend must follow the existing BUILD architecture.

| System | Responsibility |
| --- | --- |
| Mobile frontend | UI, navigation, presentation state, forms, local experiences, client-side caching and user interactions |
| Core Backend | Authentication, authorization, tenant ownership, academic data, subscriptions, assessment lifecycle, authoritative records |
| AI Service | OCR, document processing, retrieval, grounded answers, AI generation, explanations and AI orchestration |

The frontend must never become the source of truth for backend-owned information.

## 2.1 Non-negotiable boundaries

The frontend must not independently determine:

- Whether a user is authenticated.
- Whether a user belongs to an institution.
- Whether a user can access an academic resource.
- Whether an examination is available.
- Whether an examination submission succeeded.
- Whether an answer is correct.
- Whether a subscription is active.
- Whether an uploaded document has been ingested.
- Whether an AI-generated answer is grounded.
- Whether an AI processing job succeeded.

The frontend can display these states once the backend, or the backend's AI-facing interface, supplies them.

## 2.2 AI architecture boundary

The intended online AI architecture uses the Gemini SDK behind a provider-agnostic Model Gateway.

The frontend must not:

- Integrate Gemini SDK directly into the mobile application.
- Embed Gemini or other provider credentials.
- Call internal AI-service endpoints directly.
- Implement its own retrieval system.
- Claim that generated responses are grounded without receiving the appropriate evidence and provenance.
- Assume that a local model is available simply because the device supports local storage.

Online AI functionality must use the approved backend-facing interface when that integration is ready.

Offline AI remains a separately benchmarked capability. The frontend can prepare its interface and its offline capability states, but must not implement local inference yet.

# 3. Repository Audit

## 3.1 Existing technology stack

The repository currently uses:

| Component | Existing technology |
| --- | --- |
| Framework | Expo SDK 57 |
| Navigation | Expo Router |
| Language | TypeScript |
| UI | React Native |
| React | 19.2.3 |
| React Native | 0.86.0 |
| Styling | React Native StyleSheet and Tailwind CSS 4 dependencies |
| Validation | Zod 4 |
| Local persistence | AsyncStorage |
| File handling | Expo Document Picker and Expo File System |
| Maps | MapLibre React Native |
| Calendar | Schedule-X |
| Icons | Expo Vector Icons |
| Fonts | Nunito |
| Animation | React Native Reanimated |
| Package manager | npm |

The existing stack is sufficient for the current phase.

**Do not replace Expo, React Native, Expo Router or TypeScript.**

Preserve the current dependency structure unless an actual technical limitation is demonstrated.

## 3.2 Existing application structure

The existing application has these major areas:

**Authentication**

- Pre-authentication.
- Login.
- Signup.

**Onboarding**

- Five onboarding steps.
- Academic profile selection.
- Course selection.
- Study goals.
- Learning preferences.
- Profile summary.

**Dashboard**

- Home.
- BUILD AI.
- Calendar.
- CBT.
- Courses.
- Chats.
- Campus map.
- Place details.
- Read Mode.
- Settings.
- Study groups.
- Study modes.
- Video player.

**Shared components**

- Dashboard bottom navigation.
- Primary button.
- Progress header.
- Calendar components.
- Campus map components.
- Theme and color utilities.

**Existing local services**

- Student calendar.
- Study shelf.
- Local file handling.

This is a useful starting point. A complete rewrite is not justified.

## 3.3 Important audit findings

These findings come from static inspection of the repository files. Confirm them against a local runtime baseline before changes begin.

### A. Authentication is currently a prototype

The login screen accepts input visually, but its Sign In action navigates to onboarding without authenticating the user.

The signup screen:

- Has three visual steps.
- Does not submit an actual registration request.
- Does not keep the entered fields together as a complete registration payload.
- Navigates to onboarding after submission.

The forgot-password control isn't connected to any account-recovery workflow.

The inspected root layout has no production authentication or session architecture.

**Required action:** preserve the existing screens, but isolate authentication behind an interface that can later be connected to the backend.

Do not pretend that users are authenticated.

### B. Onboarding is local-only

`Onboardingcontext.tsx` currently manages:

- Institution.
- School.
- Department.
- Academic level.
- Courses.
- Study goals.
- Learning styles.

This information lives in React context and is not persisted through an authoritative account service.

The current academic selection data is also local.

**Required action:** improve the onboarding experience, validation and local draft recovery. Keep account synchronization deferred.

### C. Dashboard data is not consistently authoritative

The dashboard contains presentation data and locally derived academic information.

The developer must identify every displayed value and classify it as:

1. Static presentation content.
2. Local user-generated content.
3. Backend-owned information.
4. AI-service-owned information.

Only the first two categories can work on their own without backend integration.

Never present fixture values as actual student records.

### D. BUILD AI currently has an integration mismatch

`dashboard/buildai.tsx` currently:

- Uses `EXPO_PUBLIC_BUILD_AI_API_URL`.
- Sends a raw messages array.
- Expects a response containing `reply`.

This is not an approved production integration contract.

It also creates a direct frontend-to-AI-service dependency.

**Required action:** remove this direct transport assumption. Introduce a typed AI-facing interface that will eventually connect through the approved backend contract.

The chat interface can be fully developed using deterministic mock responses.

### E. CBT is currently hardcoded

`dashboard/cbtquiz.tsx` contains:

- Hardcoded questions.
- Hardcoded answers.
- A locally controlled timer.
- A fabricated 95% result.
- A fixed total of 20 questions, although only three question objects are defined.

The current implementation is suitable only as a UI prototype.

**Required action:** redesign the CBT screen around a typed assessment model, local draft answers and explicit submission states.

Do not implement authoritative scoring or submission.

### F. Read Mode uses static content

`dashboard/readmode.tsx` currently contains hardcoded educational content.

Bookmarking is local component state, and the AI summary is a predefined alert.

**Required action:** introduce a reusable reading experience that accepts a typed content model. Support font scaling, reading progress, navigation and local bookmarks.

AI-generated summaries must remain unavailable until a valid service response exists.

### G. Study shelf is already partially independent

`services/studyShelf.ts` provides local persistence for:

- Courses.
- Notes.
- Selected files.
- File opening and sharing.

This is useful work that can proceed independently.

However, local storage does not mean a document has been uploaded, processed or indexed.

**Required action:** preserve the local study shelf and separate local document management from server-side document ingestion.

### H. Calendar is already locally functional

`services/studentCalendar.ts` uses AsyncStorage and Zod validation.

The calendar supports local event creation, editing and deletion.

This is an appropriate independent feature.

**Required action:** improve edge cases, persistence reliability, date handling and testing.

Do not imply that local calendar events are synchronized with an institutional timetable.

### I. Campus map is an independent workstream

The app already has:

- MapLibre integration.
- Local campus place data.
- Place search.
- Category filters.
- Location permissions.
- User location tracking.
- Campus place details.

This is a valuable feature that can be completed independently.

The developer must verify map behaviour, location permission handling, data completeness, error states and platform compatibility.

### J. Testing infrastructure needs attention

The current package scripts expose:

- `typecheck`
- `test:campus`
- `lint`
- Expo development commands.

The inspected package manifest has no general application test command.

**Required action:** establish a frontend testing strategy before adding substantial functionality.

Do not claim full frontend test coverage based only on the existing campus test script.

# 4. Target Frontend Architecture

Introduce a clear separation between presentation, domain logic, local persistence and future network integration.

Recommended structure:

```
mobile-app-main/
└── src/
    ├── app/
    │   ├── (auth)/
    │   ├── (onboarding)/
    │   ├── dashboard/
    │   └── _layout.tsx
    │
    ├── components/
    │   ├── ui/
    │   ├── navigation/
    │   ├── forms/
    │   ├── feedback/
    │   ├── academic/
    │   ├── learning/
    │   └── dashboard/
    │
    ├── features/
    │   ├── authentication/
    │   ├── onboarding/
    │   ├── dashboard/
    │   ├── courses/
    │   ├── study/
    │   ├── calendar/
    │   ├── cbt/
    │   ├── ai-chat/
    │   ├── documents/
    │   ├── campus/
    │   ├── settings/
    │   └── subscriptions/
    │
    ├── services/
    │   ├── api/
    │   ├── mocks/
    │   ├── storage/
    │   └── platform/
    │
    ├── context/
    ├── hooks/
    ├── constants/
    ├── theme/
    ├── types/
    ├── schemas/
    └── utils/
```

This is a target structure, not an instruction to move every existing file immediately.

Migrate incrementally. Keep working screens operational while improving their architecture.

## 4.1 UI layer

UI components should be reusable and presentation-focused.

Examples:

- `PrimaryButton`
- `SecondaryButton`
- `InputField`
- `SearchField`
- `AppHeader`
- `BottomNavigation`
- `EmptyState`
- `ErrorState`
- `LoadingState`
- `ProgressIndicator`
- `CourseCard`
- `DocumentCard`
- `QuestionCard`
- `MessageBubble`
- `ConfirmationDialog`
- `OfflineIndicator`

Avoid duplicating styles and interaction logic across screens.

## 4.2 Feature layer

Each feature should own its:

- Types.
- Validation schemas.
- Components.
- Hooks.
- Local state.
- Use cases.
- Tests.

Don't add abstractions a feature doesn't need. It should be modular without becoming more complicated than necessary.

## 4.3 Service layer

Separate local services from future API services.

For example:

```
services/
├── api/
│   ├── client.ts
│   ├── errors.ts
│   └── contracts/
│
├── mocks/
│   ├── fixtures/
│   ├── handlers/
│   └── adapters/
│
└── storage/
    ├── onboarding-storage.ts
    ├── calendar-storage.ts
    ├── study-shelf-storage.ts
    └── preferences-storage.ts
```

Mock implementations must implement the same frontend-facing interfaces as the eventual real adapters.

This prevents the frontend from becoming tightly coupled to temporary mock data.

# 5. Implementation Workstreams

The workstreams below are ordered by dependency, not by visual importance.

## M0 — Baseline and Repository Stabilisation

**Priority: Critical**

Before implementing features:

1. Inspect the entire repository.
2. Read the mobile frontend master PRD.
3. Read the repository-specific agent instructions.
4. Inspect Expo SDK 57 documentation.
5. Install dependencies using the existing lockfile.
6. Run the existing TypeScript check.
7. Run lint.
8. Run the campus tests.
9. Launch the application.
10. Test the existing navigation on the supported development platforms.

Record:

- Existing build failures.
- TypeScript errors.
- Runtime crashes.
- Broken routes.
- Dependency warnings.
- Existing test failures.
- Platform-specific issues.

Create:

`docs/frontend-audit-baseline.md`

Acceptance criteria:

- Existing application behaviour is documented.
- Existing failures are recorded.
- No existing functionality is removed without justification.
- The development environment is reproducible.

## M1 — Frontend Foundation

**Priority: Critical**

Establish the application foundation.

### Tasks

1. Standardise the application directory structure.
2. Establish shared design tokens.
3. Consolidate typography.
4. Standardise spacing, radii, borders and shadows.
5. Standardise button and input components.
6. Standardise loading, error and empty states.
7. Establish shared modal and confirmation patterns.
8. Establish keyboard and safe-area behaviour.
9. Improve theme consistency.
10. Introduce common accessibility conventions.

### Navigation

Review the Expo Router structure.

Implement:

- Predictable navigation transitions.
- Correct back behaviour.
- Screen-level navigation options.
- Safe handling of unknown routes.
- Deep-link preparation.
- Consistent bottom navigation.

Do not implement security-sensitive route guards based on locally stored roles or subscription flags.

### Acceptance criteria

- Shared components work across existing screens.
- Navigation is consistent.
- Light and dark themes are usable.
- Layouts work across different screen dimensions.
- No major visual regressions are introduced.

## M2 — Authentication and Onboarding UI Preparation

**Priority: High**

The objective is to prepare complete user experiences without pretending to implement production authentication.

### Authentication screens

Improve:

- Login.
- Signup.
- Password confirmation.
- Forgot-password screen.
- Password visibility controls.
- Input validation.
- Form error messages.
- Loading and disabled states.
- Keyboard handling.
- Terms and privacy navigation.

Introduce interfaces for future account operations:

```ts
interface AuthService {
  signIn(input: SignInInput): Promise<AuthResult>;
  signUp(input: SignUpInput): Promise<AuthResult>;
  requestPasswordReset(
    input: PasswordResetInput
  ): Promise<void>;
  signOut(): Promise<void>;
}
```

The interface is a frontend boundary, not an implementation of authentication.

A mock adapter may be used for development, but it must be visibly identified as development-only.

### Onboarding

Improve the existing five-step flow:

1. Academic identity.
2. Course selection.
3. Learning goals.
4. Learning preferences.
5. Profile summary.

Tasks:

- Form validation.
- Step navigation.
- Previous-step editing.
- Draft persistence.
- Resume incomplete onboarding.
- Clear selection behaviour.
- Empty states.
- Searchable academic selections.
- Consistent selection components.

Treat the academic dataset as local development data until the backend's authoritative academic structure is available.

Do not silently assume that the local dataset represents the complete or current institutional structure.

### Acceptance criteria

- Every onboarding step works.
- Users can navigate backwards without losing their draft.
- Invalid input is clearly identified.
- Local drafts survive an application restart.
- No fake registration or authentication success is presented as production behaviour.

## M3 — Student Dashboard and Academic Navigation

**Priority: High**

The dashboard should become a coherent entry point into the student experience.

### Tasks

1. Standardise dashboard layout.
2. Improve responsive layout behaviour.
3. Separate fixture data from presentation components.
4. Establish typed dashboard models.
5. Create reusable course cards.
6. Create reusable progress cards.
7. Create upcoming-activity components.
8. Create quick-action components.
9. Establish empty dashboard states.
10. Ensure navigation destinations are correct.

### Dashboard information categories

Prepare the following UI sections:

- Welcome and academic context.
- Study focus.
- Course overview.
- Upcoming schedule.
- Learning activity.
- Study shortcuts.
- BUILD AI entry point.
- Academic progress placeholders.

Use clearly identified mock fixtures where backend data is not available.

Do not display fabricated grades, completed assessments or student analytics as actual user information.

### Acceptance criteria

- Dashboard screens render correctly.
- All navigation actions work.
- Empty and loading states are available.
- Mock data is isolated from production adapters.

## M4 — Independent Learning Experiences

**Priority: Very High**

This is the most important independent student-facing workstream.

It should receive substantial attention before AI and backend integrations are ready.

### A. Study Mode

Improve the existing study-mode hub.

Support:

- Selected courses.
- Local study materials.
- Available learning modes.
- Recently accessed materials.
- Empty states.
- Study navigation.

### B. Read Mode

Create a reusable reader that accepts structured content.

Suggested content model:

```ts
interface LearningContent {
  id: string;
  title: string;
  courseId: string;
  sections: LearningSection[];
  estimatedReadingMinutes?: number;
}

interface LearningSection {
  id: string;
  heading?: string;
  paragraphs: string[];
}
```

Support:

- Font-size controls.
- Reading progress.
- Section navigation.
- Local bookmarks.
- Reading preferences.
- Accessible text presentation.
- Resume reading.
- Offline access to explicitly downloaded local content.

Use locally supplied sample content during development.

Do not claim that a sample lesson is AI-generated or institutionally verified.

### C. Local Study Shelf

Improve the existing study shelf.

Support:

- Adding local files.
- Removing files.
- Course association.
- File metadata.
- File opening.
- Storage errors.
- Duplicate detection.
- Storage availability.
- File-size validation.

The local shelf must be independent of server ingestion.

Use separate states:

- Saved locally.
- Upload pending.
- Uploaded.
- Processing.
- Ready.
- Failed.

Only the first state can be implemented independently today.

Design the other states for the future contract, but don't activate them falsely.

### D. Video Learning Interface

Improve the video-learning interface. Do not claim that playback or offline downloads work while no actual media source or download implementation exists.

Prepare:

- Player component.
- Playback controls.
- Chapter navigation.
- Captions interface.
- Playback progress.
- Error states.
- Download status interface.

Use legitimate local development media or a controlled test fixture.

### Acceptance criteria

- Local learning content can be opened and read.
- Reading preferences persist.
- Bookmarks work locally.
- Study materials can be managed.
- File operations report genuine success or failure.
- Video controls do not fabricate playback or download completion.

## M5 — CBT Interface and Assessment Client Preparation

**Priority: Very High**

The current CBT prototype requires structural improvement.

Do not implement authoritative assessment behaviour.

### Tasks

1. Remove hardcoded assessment assumptions.
2. Define typed assessment and question models.
3. Create reusable question components.
4. Create answer-selection components.
5. Create a question palette.
6. Create assessment navigation.
7. Implement a presentation-level timer.
8. Support answer review.
9. Support unanswered-question indicators.
10. Introduce confirmation dialogs.
11. Prepare submission and result screens.
12. Add interruption and recovery UI states.

### Suggested model

```ts
interface AssessmentView {
  id: string;
  title: string;
  durationSeconds: number;
  questions: AssessmentQuestionView[];
}

interface AssessmentQuestionView {
  id: string;
  prompt: string;
  options: AssessmentOptionView[];
}

interface AssessmentOptionView {
  id: string;
  text: string;
}

interface AssessmentDraft {
  assessmentId: string;
  answers: Record<string, string>;
  currentQuestionIndex: number;
}
```

The client must not receive or store correct answers merely to calculate a result locally.

### Timer

The timer is a presentation aid.

The backend will remain authoritative for assessment timing, attempt validity and submission deadlines.

The frontend must not claim that a local timer determines whether an attempt is valid.

### Submission

Prepare a submission interface with states:

- Not submitted.
- Submitting.
- Submitted.
- Submission failed.
- Submission status unknown.

The client must not display a successful result until it receives an authoritative response.

### Acceptance criteria

- Questions can be navigated.
- Answers can be selected and reviewed.
- Draft state behaves predictably.
- Timer behaviour is tested.
- No fabricated score is displayed.
- No client-side answer-key scoring exists.
- Submission UI is ready for a future backend adapter.

## M6 — BUILD AI Frontend Experience

**Priority: High, UI preparation only**

The objective is to prepare the complete student-facing AI experience.

No production AI integration is authorised in this phase.

### Tasks

1. Refactor the current chat screen.
2. Separate chat UI from transport logic.
3. Introduce typed messages.
4. Introduce conversation state.
5. Implement message grouping.
6. Improve scrolling.
7. Improve keyboard handling.
8. Add retry and error states.
9. Add empty-state prompts.
10. Prepare attachment presentation.
11. Prepare citation components.
12. Prepare answer feedback components.

### Suggested message model

```ts
type MessageRole = "user" | "assistant";

interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: string;
  citations?: CitationView[];
}

interface CitationView {
  sourceId: string;
  title: string;
  excerpt?: string;
  page?: number;
}
```

This is a frontend view model. It does not replace the backend's authoritative M3-F contract.

Map it to the API once the approved contract is available.

### AI interface states

Prepare UI states for:

- Idle.
- Sending.
- Generating.
- Completed.
- Failed.
- Cancelled.
- Connection unavailable.
- Answer withheld.
- Citation unavailable.

The interface must distinguish between:

- A message being sent.
- A response being generated.
- A completed answer.
- A failed request.
- An answer deliberately withheld.

Do not display fabricated AI responses as actual service responses.

### Grounding and citations

Prepare a citation component that can eventually display:

- Source title.
- Page number.
- Excerpt.
- Source reference.

Do not invent citations or imply that an answer is grounded without actual source provenance.

### Acceptance criteria

- Chat interface works with deterministic development fixtures.
- Chat transport is replaceable.
- Retry behaviour works.
- Message states are correct.
- Citation rendering is independently tested.
- No provider credentials exist in the frontend.

## M7 — Calendar and Study Planning

**Priority: Medium-High**

The existing local calendar is a strong independent feature.

Improve:

- Calendar navigation.
- Event creation.
- Event editing.
- Event deletion.
- Date validation.
- Time validation.
- Upcoming event display.
- Event categorisation.
- Empty states.
- Persistence recovery.

Test:

- Invalid dates.
- Month transitions.
- Year transitions.
- Same-day events.
- All-day events.
- Time-zone handling.
- App restarts.
- Corrupted stored data.

The calendar should clearly distinguish student-created local events from future institutional timetable data.

## M8 — Campus Map

**Priority: Medium-High**

The campus map can proceed independently of backend and AI-service readiness.

Tasks:

1. Verify MapLibre rendering.
2. Verify campus geometry.
3. Verify campus place metadata.
4. Verify search.
5. Verify category filters.
6. Verify selected-place details.
7. Verify location permissions.
8. Verify denied-permission behaviour.
9. Verify location tracking lifecycle.
10. Verify heading and compass behaviour.
11. Verify map error recovery.
12. Verify Android and iOS compatibility.
13. Review map data attribution and licensing.

Treat the current local FUTA campus dataset as one explicit dataset, not a universal campus-data solution.

Do not introduce unnecessary backend dependencies for functionality already supported by local data.

## M9 — Study Groups and Messaging UI

**Priority: Medium**

The current chat interface contains seeded contacts and messages.

Prepare the UI architecture for future messaging integration.

Tasks:

- Conversation list.
- Conversation details.
- Message bubbles.
- Message composer.
- Attachment selection UI.
- Empty states.
- Unread indicators.
- Delivery status presentation.
- Loading and error states.

Do not claim real-time messaging, read receipts, delivery confirmation or group membership without a real service.

Use development fixtures only.

# 6. Local Storage and Offline Preparation

The frontend can improve local persistence now.

However, local persistence must not become a replacement for authoritative server storage.

## 6.1 Storage categories

| Information | Local storage policy |
| --- | --- |
| Theme preference | Local |
| Onboarding draft | Local temporary draft |
| Calendar events | Local |
| Study shelf metadata | Local |
| User-selected reading preferences | Local |
| Local bookmarks | Local |
| Authentication credentials | Never store as ordinary AsyncStorage data |
| Subscription entitlement | Backend-authoritative |
| Assessment result | Backend-authoritative |
| Academic membership | Backend-authoritative |
| AI conversation history | Follow approved backend persistence contract |
| Learning Memory | Backend/AI-service governed |

## 6.2 Storage requirements

Implement:

- Versioned storage keys.
- Zod validation.
- Safe deserialization.
- Error recovery.
- Migration strategy for local schema changes.
- Duplicate protection.
- Storage cleanup where appropriate.

Avoid storing unnecessary copies of large documents in AsyncStorage.

## 6.3 Offline experience

Prepare the application to communicate:

- Online.
- Offline.
- Reconnecting.
- Local content available.
- Remote content unavailable.

Do not implement local AI inference in this workstream.

The future offline-model portfolio will be benchmarked separately: Qwen3 and Glimmer candidates, evaluated on actual supported devices.

# 7. API and Mock Integration Architecture

This is one of the most important requirements.

The frontend developer must prepare for backend integration without inventing backend contracts.

## 7.1 API client foundation

Prepare a central transport layer with:

- Configurable base URL.
- Typed request handling.
- Response parsing.
- Request cancellation.
- Timeouts.
- Normalised errors.
- Safe logging.
- Correlation identifiers where available.

Do not embed credentials in public Expo environment variables.

An `EXPO_PUBLIC_` variable must be treated as public application configuration.

## 7.2 Contract-first integration

The following process is mandatory:

1. Locate the authoritative backend or AI-facing contract.
2. Confirm that the endpoint exists.
3. Confirm request and response schemas.
4. Confirm permissions and expected errors.
5. Generate or derive frontend types.
6. Implement the adapter.
7. Add contract tests.
8. Connect the screen.
9. Verify the complete workflow.

The frontend developer must not guess an endpoint or payload.

## 7.3 Mock adapters

For independent UI work, implement deterministic mock adapters.

Example:

```ts
interface CourseService {
  listCourses(): Promise<Course[]>;
}

class MockCourseService implements CourseService {
  async listCourses(): Promise<Course[]> {
    return mockCourses;
  }
}
```

The actual implementation should use the same interface.

Mock mode must be explicit and development-only.

Never silently fall back from a failed production API request to fabricated student information.

## 7.4 Environment separation

Prepare:

- Local development.
- Mock development.
- Integration testing.
- Staging.
- Production configuration placeholders.

Production credentials and server-side secrets must never be embedded in the application.

# 8. Subscriptions and Account Settings Preparation

The frontend can prepare subscription presentation screens, but it must not implement entitlement enforcement.

Prepare:

- Subscription overview.
- Plan comparison presentation.
- Usage presentation.
- Upgrade entry points.
- Renewal information.
- Subscription status display.
- Account settings.
- Privacy settings.
- Notification preferences UI.

The eventual backend remains authoritative for:

- Active subscription.
- Plan.
- Expiration.
- Usage limits.
- Entitlements.
- Institutional access.
- Payment confirmation.

The APK must never be trusted to determine subscription access.

The frontend must not activate premium functionality merely because a locally stored value says that a user is subscribed.

# 9. Quality Engineering

Testing must become part of the development process rather than an activity reserved for release.

## 9.1 Testing layers

Introduce:

**Unit tests**

- Validation schemas.
- Utility functions.
- Local storage services.
- State transitions.
- Timer calculations.
- Calendar date operations.

**Component tests**

- Inputs.
- Buttons.
- Cards.
- Modals.
- Question components.
- Message bubbles.
- Empty states.

**Feature tests**

- Onboarding.
- Study shelf.
- Read Mode.
- CBT navigation.
- Chat presentation.
- Calendar.
- Campus search.

**Integration tests**

- Mock adapter interactions.
- Storage interactions.
- Navigation workflows.
- Error recovery.

**End-to-end tests**

- Authentication presentation flow.
- Onboarding flow.
- Student dashboard flow.
- Local learning workflow.
- Local CBT interaction workflow.

Production backend integration tests will be added when the relevant contracts and services are ready.

## 9.2 Required checks

At minimum, maintain:

```
npm ci
npm run typecheck
npm run lint
npm run test:campus
npm test
```

The final command must be introduced when the test runner is configured.

Add platform build checks where appropriate.

Do not claim that the mobile app is production-ready because TypeScript passes.

## 9.3 Quality expectations

- No unhandled application errors.
- No fabricated success states.
- No accidental leakage of secrets.
- No inaccessible critical controls.
- No broken primary navigation.
- No untested critical local persistence.
- No regression of existing campus functionality.

# 10. Accessibility and User Experience

Accessibility must be part of implementation, not a final visual pass.

Requirements:

- Accessible control labels.
- Appropriate accessibility roles.
- Screen-reader-friendly state announcements.
- Sufficient contrast.
- Scalable text.
- Keyboard-safe layouts.
- Touch targets appropriate for mobile use.
- Reduced unnecessary animations.
- Clear validation messages.
- Consistent focus behaviour.

The developer should also test:

- Small Android screens.
- Larger Android screens.
- iOS layouts.
- Different text sizes.
- Light and dark themes.
- Poor network conditions.
- Permission-denied states.

# 11. Implementation Order and Deliverables

The following sequence is the recommended execution order.

| Phase | Workstream | Deliverable |
| --- | --- | --- |
| M0 | Baseline audit | Audit report and reproducible baseline |
| M1 | Frontend foundation | Shared architecture and UI system |
| M2 | Authentication and onboarding UI | Validated, recoverable user flows |
| M3 | Dashboard | Consistent student dashboard |
| M4 | Independent learning | Read Mode, study shelf and video UI |
| M5 | CBT preparation | Typed assessment client and local interaction |
| M6 | AI frontend | Mock-driven chat and citation presentation |
| M7 | Calendar | Reliable local study planner |
| M8 | Campus map | Verified independent campus experience |
| M9 | Messaging and groups | Integration-ready messaging UI |
| M10 | Quality consolidation | Tests, accessibility and documentation |
| M11 | Integration readiness | Contract adapters and integration checklist |

The phases can overlap where dependencies permit.

Don't polish low-priority screens while authentication navigation, onboarding state or the core learning experience is still structurally unreliable.

# 12. Git and Collaboration Strategy

All frontend work must use feature branches.

Suggested branches:

```
feat/mobile-foundation
feat/mobile-design-system
feat/mobile-auth-ui
feat/mobile-onboarding
feat/mobile-dashboard
feat/mobile-study-experience
feat/mobile-cbt-client
feat/mobile-ai-chat-ui
feat/mobile-calendar
feat/mobile-campus-map
feat/mobile-messaging-ui
feat/mobile-test-infrastructure
```

Do not create one enormous frontend branch containing every workstream.

Each pull request should:

- Have a narrow scope.
- Reference the relevant requirement.
- Include screenshots or recordings where useful.
- Include tests.
- Pass typecheck.
- Pass lint.
- Preserve existing functionality.
- Document mock-only behaviour.
- Identify future backend dependencies.

Avoid concurrent changes to shared routing, theme or global layout files without coordination.

# 13. Explicitly Deferred Work

The following work must not be treated as part of the immediate frontend implementation.

| Work | Reason for deferral |
| --- | --- |
| Production authentication | Requires backend contract and security implementation |
| Production account registration | Requires backend |
| Authoritative academic data | Backend-owned |
| Institutional membership | Backend-owned |
| Production course synchronisation | Backend-owned |
| Document ingestion | Requires backend and AI service |
| OCR processing | AI-service responsibility |
| RAG and vector search | AI-service responsibility |
| Production AI chat | Requires approved backend-facing AI contract |
| Gemini integration | Model Gateway and provider verification first |
| Local generative AI | Requires device benchmarking and architecture approval |
| Authoritative CBT submission | Backend-owned assessment lifecycle |
| Authoritative examination scoring | Backend-owned |
| Learning Memory | Disabled until its approved implementation and controls are ready |
| Subscription enforcement | Backend-owned |
| Payment verification | Backend-owned |
| Production notifications | Requires approved service integration |
| Mobile production deployment | Final project phase |

No frontend implementation should bypass these dependencies.

# 14. Frontend Definition of Done

A frontend feature is complete only when:

1. Its user journey is documented.
2. Its UI is implemented.
3. Its state transitions are correct.
4. Loading, empty, success and error states exist where applicable.
5. Local persistence is tested where applicable.
6. Its interfaces are typed.
7. Its validation is tested.
8. Accessibility is considered.
9. Navigation works.
10. Relevant automated tests pass.
11. No fake production behaviour exists.
12. Mock behaviour is clearly isolated.
13. Documentation is updated.
14. Outstanding backend or AI-service dependencies are recorded.

A rendered screen alone is not evidence that a feature is complete.

# 15. Frontend Integration-Readiness Gate

Before the backend and AI service are integrated, the frontend should demonstrate:

- A stable application foundation.
- A consistent design system.
- Reliable navigation.
- Complete onboarding UI.
- Reusable academic components.
- Local study shelf functionality.
- Functional Read Mode.
- CBT presentation and local draft behaviour.
- AI chat presentation with mock adapters.
- Calendar functionality.
- Verified campus map functionality.
- A documented API adapter architecture.
- No direct internal AI-service dependency.
- No embedded provider secrets.
- Automated frontend tests.
- A clear list of pending backend and AI contracts.

This is an integration-readiness milestone, not mobile production approval.

# 16. Release and Production Boundary

The mobile app is the final production workstream.

Once the backend and AI service have satisfied their production-readiness requirements, the frontend will enter the integration and release sequence.

That sequence will include:

1. Contract verification.
2. Authentication integration.
3. Academic data integration.
4. Document upload and ingestion integration.
5. AI integration.
6. Citation and provenance verification.
7. CBT lifecycle integration.
8. Subscription and entitlement integration.
9. Offline behaviour verification.
10. Security review.
11. Cross-platform testing.
12. Performance testing.
13. Release candidate verification.
14. Production deployment approval.

The existing `GATE_OPEN = False` boundary must remain unchanged.

No frontend milestone authorises opening student routes or bypassing backend security gates.

---

# 17. Immediate Instructions to the Frontend Developer

Start with M0.

Do not begin by redesigning every screen or rewriting the application.

First:
1. Establish the actual state of the repository.
2. Run the existing checks.
3. Inspect the routes.
4. Identify the broken or misleading interactions.

Then execute M1 and M2 before moving into the core independent student workflows.

Prioritise the work that creates reusable foundations and directly improves the student's learning experience.

For every completed milestone, the frontend developer should provide a short implementation report containing:

- What changed.
- Files affected.
- Architectural decisions.
- Tests executed.
- Test results.
- Screenshots or recordings.
- Known limitations.
- Backend dependencies.
- AI-service dependencies.
- Recommended next milestone.

**Final instruction: build the frontend so that backend and AI-service integration becomes a controlled adapter-integration exercise, not another frontend rewrite.**

The immediate objective is a well-engineered mobile application foundation that can be tested on its own. Production remains the final phase.

## 17.1 Assignment order

Don't assign all eleven workstreams at once: they would overlap, and the architecture would become inconsistent.

Assign the first three deliverables in this order:

1. **M0, baseline audit:** establish the actual build, runtime, routing and testing status.
2. **M1, foundation:** shared UI components, navigation consistency, theme and test infrastructure.
3. **M2, authentication and onboarding UI:** improve the complete flow, but keep authentication mocked and explicitly non-production.

While the foundation work is being reviewed, begin M4's Read Mode and Study Shelf improvements.

**One correction to make early:** the login button must stop navigating straight into onboarding as though authentication succeeded. Fix this before the backend authentication endpoints are ready.

The next useful deliverable is a set of narrowly scoped GitHub issues for M0–M2, with acceptance criteria and PR boundaries, so the developer can begin without interpreting the entire plan himself.
