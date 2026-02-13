
### 📁 Project Root

#### `questions.json`

* **Type:** Data Source (Read-Only)
* **Description:** The "Source of Truth" for the benchmark. Contains raw research scenarios.
* **Key Structure:** An array of objects.
* `question_and_explanation`: Contains XML-like tags (`<Question>`, `<Options>`, `<Explanation>`, `<Answer>`) that are parsed at runtime.
* `k_hops`: Integer (1-5) defining complexity.
* `correctness_X` / `response_X`: Model validation data.



#### `package.json`

* **Type:** Configuration
* **Description:** Tracks dependencies and scripts.
* **Key Dependencies:**
* `lucide-react`: For the scientific icon set (Brain, DNA, Terminal).
* `clsx` & `tailwind-merge`: For dynamic class logic in the UI.
* `prisma`: For database ORM.



---

### 📁 `app/` (The Application Layer)

#### `app/layout.tsx`

* **Type:** Root Layout (Server Component)
* **Description:** The global shell of the application.
* **Key Functions:**
* **Font Injection:** Imports `Inter` (UI text) and `Merriweather` (Scientific/Serif text) from `next/font/google`.
* **Body Styling:** Applies the `bg-slate-50` background and base text colors to the entire app.
* **Structure:** Wraps children in a `flex-col` container to ensure the footer/content always fills the screen.



#### `app/globals.css`

* **Type:** Global Styles (Tailwind v4)
* **Description:** The design system definition.
* **Key Sections:**
* **`@theme`:** Defines custom color variables (`--color-scientific-900` for deep slate, `--color-brand-500` for teal/emerald).
* **`@layer utilities`:**
* `.glass-panel`: A reusable class for the frosted glass effect on cards (`backdrop-blur-md`).
* `.scrollbar-thin`: Custom styling for the "Model Trace" terminal window to hide default browser scrollbars.





#### `app/page.tsx`

* **Type:** Landing Page
* **Description:** The "Research Paper" abstract page.
* **Key Components:**
* **Hero:** "Evaluating Reasoning Capabilities..." with a dot-matrix background pattern.
* **Stats Ticker:** Displays "5 Difficulty Levels", "32B Parameters".
* **Methodology Section:** Academic text layout describing the experiment.
* **Sticky CTA:** The "Begin Session" card that follows the user on the right side.



#### `app/actions.ts`

* **Type:** Server Actions
* **Description:** Secure backend logic handling database writes.
* **Key Function:** `submitQuizResult(data)`
* Calculates the `percent_difference` between Human vs. Model scores.
* Writes a new row to the SQLite database via Prisma.
* Triggers `revalidatePath('/')` to update cached data.



---

### 📁 `app/quiz/` (The Assessment Engine)

#### `app/quiz/page.tsx`

* **Type:** Server Component
* **Description:** The entry point for the quiz.
* **Logic:**
* **Parallel Fetching:** Calls `getQuestions()` for difficulty levels 1 through 5 simultaneously.
* **Data Passing:** Flattens the data into a single array and passes it to the client-side `QuizApp`.
* **Dynamic:** Exports `dynamic = 'force-dynamic'` to ensure fresh randomization on every visit.



#### `app/quiz/loading.tsx`

* **Type:** Loading State
* **Description:** A React Suspense boundary.
* **Visuals:** Renders a "Skeleton" version of the Quiz Card (pulsing grey blocks) to prevent layout shift while the questions are being parsed.

---

### 📁 `components/quiz/` (Interactive Logic)

#### `components/quiz/QuizApp.tsx`

* **Type:** Client Component (`use client`)
* **Description:** The main "Brain" or State Machine of the application.
* **States:**
* `INTAKE`: Renders the Researcher ID form and Difficulty Pill Selector (1-5 hops).
* `QUIZ`: Renders the active question, progress bar, and "Deep Blue" answer buttons.
* `RESULTS`: Renders the comparative scoreboards and list of ResultCards.


* **Logic:** Handles question randomization, scoring, and the transition between views.

#### `components/quiz/ResultCard.tsx`

* **Type:** Client Component
* **Description:** The detailed audit component for a single question.
* **Features:**
* **Accordion UI:** Uses CSS grid transitions to smoothly slide open/closed.
* **Diff View:** Highlights user errors in Red and correct answers in Green/Teal.
* **Trace Terminal:** A black window stylized like a code terminal displaying the LLM's raw reasoning chain (`explanation`).
* **Props:** Accepts `question`, `userAnswer`, and `index`.



---

### 📁 `components/layout/`

#### `components/layout/Navbar.tsx`

* **Type:** Static Component
* **Description:** The persistent header.
* **Styling:** Sticky positioning (`sticky top-0`) with a glassmorphism effect.
* **Features:**
* Includes the "NeuroSI" logo.
* **Status Indicator:** A pulsing green dot labeled "SYSTEM OPERATIONAL".



---

### 📁 `lib/` (Utilities)

#### `lib/data.ts`

* **Type:** Utility Function
* **Description:** The Parser engine.
* **Key Function:** `getQuestions()`
* Reads `questions.json` from the filesystem.
* **Regex Logic:** Extracts content from the custom XML tags (`<Question>`, `<Answer>`) inside the raw strings.
* **Sanitization:** Cleans up whitespace and handles missing data gracefully.



---

### 📁 `prisma/` (Database)

#### `prisma/schema.prisma`

* **Type:** Schema Definition
* **Description:** Defines the structure of the SQLite database.
* **Model:** `UserSession`
* Fields: `id`, `name`, `position`, `selected_difficulty`, `user_score`, `model_score`, `percent_difference`, `created_at`.



#### `prisma/dev.db`

* **Type:** Binary Database File
* **Description:** The actual SQLite database file where user results are stored. You can view this using `npx prisma studio`.
