import Navbar from '@/components/layout/Navbar';
import QuizApp from '@/components/quiz/QuizApp';
import { getQuestions } from '@/lib/data';

export default async function QuizPage() {
  let allQuestions: any[] = [];
  try {
      const q1 = await getQuestions(1);
      const q2 = await getQuestions(2);
      const q3 = await getQuestions(3);
      allQuestions = [...q1, ...q2, ...q3];
  } catch (e) {
      console.error("Error loading questions", e);
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <Navbar />
      <QuizApp questionsPool={allQuestions} />
    </main>
  );
}
