## 🏗 System Architecture

### 1. Data Layer (`questions.json`)
This is the **source of truth** for the application. It is a local JSON file that acts as a read-only database for the quiz content.
* **Structure:** An array of objects, where each object represents a single research scenario.
* **Key Fields:**
    * `k_hops`: Integer (1-5) representing difficulty level. Used for filtering.
    * `question_and_explanation`: A complex string containing XML-like tags (`<Question>`, `<Options>`, `<Explanation>`, `<Answer>`) that must be parsed at runtime.
    * `correctness_X`: Dynamic keys (e.g., `correctness_Qwen3-32B`) indicating if the LLM answered correctly ("yes"/"no").
    * `response_X`: The LLM's raw "thinking trace" or explanation.

### 2. Database Schema (`prisma/schema.prisma`)
Defines the **write-only** storage for user results using SQLite.
* **`UserSession` Table:**
    * `id`: Auto-incrementing primary key.
    * `name` & `position`: User demographic strings (e.g., "Dr. Smith", "Researcher").
    * `selected_difficulty`: The difficulty level chosen by the user (matches `k_hops`).
    * `user_score`: Integer (0-10) tracking user correctness.
    * `model_score`: Integer (0-10) tracking model correctness on the *same 10 questions*.
    * `percent_difference`: A calculated float. Formula: `((model - user) / 10) * 100`.
        * *Positive Value:* Model outperformed User.
        * *Negative Value:* User outperformed Model.

### 3. Backend Logic & Utilities

#### `lib/data.ts` (The Parser)
This utility transforms the raw, messy `questions.json` into a clean UI-ready format.
* **`getQuestions(difficulty)`**:
    * **File Reading:** synchronously reads `questions.json` from the filesystem.
    * **Filtering:** Filters the array to match the requested `difficulty`.
    * **Regex Parsing:**
        * Extracts the correct answer character (A, B, C, D) from `<Answer>`.
        * Extracts the question body from `<Question>`.
        * Extracts the raw options text from `<Options>`.
    * **Dynamic Key Lookup:** Scans object keys to find `correctness_...` and `response_...` fields automatically, regardless of the specific model name version.

#### `app/actions.ts` (Server Actions)
Handles the secure database transaction when a user finishes a quiz.
* **`submitQuizResult(data)`**:
    * Accepts the raw score data from the frontend.
    * Performs the `percent_difference` calculation server-side to ensure consistency.
    * **Writes to DB:** Creates a new row in `UserSession` via Prisma.
    * **Revalidation:** Triggers `revalidatePath('/')` to ensure any future admin dashboards see fresh data immediately.

### 4. Frontend Components

#### `components/quiz/QuizApp.tsx` (The Brain)
This is a comprehensive **State Machine** handling the user journey.
* **State: `view`**: Controls which "screen" is visible (`INTAKE` -> `QUIZ` -> `RESULTS`).
* **State: `activeQuestions`**: Holds the random subset of 10 questions selected for this session.
* **State: `userAnswers`**: A dictionary mapping `questionId` -> `selectedOption` (e.g., `{ 101: "A", 102: "C" }`).
* **Key Logic:**
    * **Randomization:** On start, it shuffles the filtered questions and slices the first 10.
    * **Scoring:** Iterates through `userAnswers` vs `correct_answer` to compute the final score before sending to the server.

#### `components/quiz/ResultCard.tsx` (Inside QuizApp)
Renders the detailed breakdown of a single question in the Results view.
* **Visual Feedback:** Uses color-coding (Green/Red) to instantly show user correctness.
* **Comparison Logic:** Displays "You: [Answer]" vs "Model: [Correct/Incorrect]" side-by-side.
* **Expandable Accordion:** Clicking the card reveals the full text and the **Model Trace** (the AI's reasoning), allowing users to audit the model's logic.

#### `components/layout/Navbar.tsx`
* **Static Component:** Provides the "NeuroSI" branding and "Confidential" badging.
* **Navigation:** Contains a link back to Home (`/`).

### 5. Routing Pages

#### `app/page.tsx` (Home)
* **Landing Page:** Purely presentational.
* **Content:** Contains the "Abstract", "Methodology", and the primary Call-to-Action button ("See if you can beat the model").

#### `app/quiz/page.tsx` (Quiz Container)
* **Server Component:** This page is `async`.
* **Data Fetching:** It calls `getQuestions()` for difficulties 1, 2, and 3 *on the server* during the initial render.
* **Prop Passing:** It passes this massive array of questions to the client-side `QuizApp`, ensuring the transition to the quiz is instant and doesn't require loading spinners.


UI changes to try with aider: 
Here is the comprehensive roadmap to transform your current MVP into a high-end, professional research application.

This focuses on an **"Academic Modern" aesthetic**: clean typography, lots of whitespace, subtle shadows, slate/teal color palettes, and smooth transitions.

### 1. Foundation & Configuration (`tailwind.config.ts` & `app/layout.tsx`)

**Goal:** Establish the typography and color system. The current default Tailwind font is too generic.

* **`app/layout.tsx`**:
* **Add:** Import `Inter` (sans) and `Playfair Display` or `Merriweather` (serif) from `next/font/google`.
* **Action:** Apply these variables to the `<body>` so we can use `font-sans` for UI and `font-serif` for scientific text.


* **`tailwind.config.ts`**:
* **Add:** Extend the theme colors. Add a "Brand" color (e.g., a deep scientific blue: `#0f172a`) and an "Accent" color (e.g., teal).
* **Add:** Define `fontFamily` to use the CSS variables from the layout.
* **Add:** Add generic `keyframes` for subtle fade-ins (`fade-in-up`).



### 2. Global Styles (`app/globals.css`)

**Goal:** Remove browser default ugliness and add "polish" utilities.

* **Add:**
* `@layer base`: Set default text color to a soft black (`slate-900`) and background to a very light grey (`slate-50`).
* **Custom Scrollbar:** Hide the ugly default scrollbar and replace it with a thin, slate-colored bar for the "Model Trace" window.
* **Utilities:** Create a `.glass-panel` class: `bg-white/70 backdrop-blur-md border border-white/20 shadow-xl`. This makes cards look premium.



### 3. Layout (`components/layout/Navbar.tsx`)

**Goal:** Make it feel like a persistent, professional app header.

* **Add:**
* **Sticky Positioning:** `sticky top-0 z-50` so it floats as you scroll.
* **Backdrop Blur:** `backdrop-blur-md bg-white/80` instead of solid white.
* **Logo Polish:** precise letter-spacing (`tracking-tight`) and a slightly heavier weight.
* **Status Indicator:** A small green "pulse" dot next to "System Operational" or "Database Connected" to make it feel like a live research tool.



### 4. Home Page (`app/page.tsx`)

**Goal:** Move away from a text wall to a "Research Paper" landing page.

* **Add:**
* **Hero Section:** A subtle background pattern (dot grid or graph paper SVG) behind the main title.
* **Typography:** Make the "Abstract" and "Methodology" headers look like actual academic paper section headers (uppercase, small, bold, tracking-wide, with a horizontal rule).
* **Grid Layout:** Use `grid-cols-12`. Put the text in `col-span-8` and the "Download/Resources" card in `col-span-4` (sticky on the right side).
* **Stats Ticker:** A row showing "5 Difficulty Levels", "32B Parameters", "100+ Ground Truth Paths" using a monospace font.



### 5. Quiz Logic (`components/quiz/QuizApp.tsx`)

**Goal:** This needs the biggest overhaul. It needs to feel like a high-stakes test.

* **Intake View (State: INTAKE):**
* **Card Design:** Use the `.glass-panel` style.
* **Inputs:** Change standard borders to `ring` focus states. Add floating labels or inside-input icons (User icon for name, Briefcase for position).
* **Select Dropdown:** Style the "Difficulty" selector to look like a custom pill selector rather than a native HTML dropdown.


* **Quiz View (State: QUIZ):**
* **Progress Bar:** A thin line at the very top of the card showing `(currentIndex / total) * 100%` width.
* **Question Typography:** Increase font size (`text-xl` or `text-2xl`), use the Serif font, and increase `leading-relaxed` (line height) for readability.
* **Option Buttons:**
* **Default:** White background, subtle border.
* **Hover:** `bg-slate-50`.
* **Selected:** `ring-2 ring-slate-900 bg-slate-50`.
* **Add:** A prominent "A", "B", "C", "D" badge on the left of each option.




* **Results View (State: RESULTS):**
* **Score Visualization:** Instead of just text numbers, add two **Progress Bars** side-by-side (User vs Model) or a Donut Chart.
* **Color Coding:** Use `emerald-500` for the winner and `slate-400` for the loser.
* **Summary Box:** A specific sentence generated dynamically: *"The Model outperformed you by 20% on Level 3 complexity."*



### 6. Results & Trace (`components/quiz/ResultCard.tsx`)

**Goal:** Make the "Thinking Trace" readable and the comparison instant.

* **Add:**
* **Accordion Animation:** Use a transition on `max-height` so the drawer slides open smoothly instead of snapping.
* **Trace Window:**
* Style it like a **Terminal**: Black background, green/grey monospace text (`font-mono`).
* Add a "Copy Trace" button top-right.


* **Diff View:**
* If the user was wrong and model right, highlight the user's row in Red and the Model's row in Green explicitly.





### 7. Loading States (`app/quiz/loading.tsx`)

**Goal:** Prevent layout shift while data loads.

* **Create File:** Add a `loading.tsx` in the quiz folder.
* **Add:** A generic skeleton loader (pulsing gray rectangles) that mimics the shape of the Quiz Card.

---

### Implementation Priority Order

1. **Typography & Config** (This instantly makes everything look 50% better).
2. **Global CSS** (Scrollbars & Base styles).
3. **QuizApp UI** (This is where the user spends 90% of their time).
4. **ResultCard** (The payoff moment).
5. **Home Page** (The first impression).

**Would you like me to start by giving you the code for Step 1 (Config & Fonts) and Step 2 (Globals)?**
