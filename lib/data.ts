import fs from 'fs';
import path from 'path';

export type Question = {
  id: number;
  k_hops: number; 
  question: string;
  options: string[]; 
  correct_answer: string; 
  explanation: string;
  model_correct: boolean; 
  raw_response: string; 
};

export async function getQuestions(difficulty: number): Promise<Question[]> {
  const filePath = path.join(process.cwd(), 'questions.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const rawData = JSON.parse(fileContents);

  const filteredData = rawData.filter((item: any) => item.k_hops === difficulty);

  return filteredData.map((item: any) => {
    const explanationBlock = item.question_and_explanation || "";
    // Robust regex to find the answer (supports <Answer>: C and <Answer>C</Answer>)
    const answerMatch = explanationBlock.match(/<Answer>:\s*([A-D])/i) || explanationBlock.match(/<Answer>([A-D])<\/Answer>/i);
    const correctAnswer = answerMatch ? answerMatch[1].toUpperCase() : "C"; 

    // Extract Question Text
    const questionTextMatch = explanationBlock.match(/<Question>\n\[(.*?)\]\n<\/Question>/s);
    const questionText = questionTextMatch ? questionTextMatch[1] : "Question text not found.";

    // Dynamic Model Correctness
    const correctnessKey = Object.keys(item).find(key => key.startsWith("correctness_"));
    const isModelCorrect = correctnessKey ? item[correctnessKey].toLowerCase().includes("yes") : false;

    // Dynamic Model Response
    const responseKey = Object.keys(item).find(key => key.startsWith("response_"));
    const rawResponse = responseKey ? item[responseKey] : "";

    return {
      id: item.id,
      k_hops: item.k_hops,
      question: questionText,
      options: extractOptions(explanationBlock),
      correct_answer: correctAnswer,
      explanation: rawResponse, 
      model_correct: isModelCorrect,
      raw_response: rawResponse
    };
  });
}

function extractOptions(text: string): string[] {
  const optionsBlockMatch = text.match(/<Options>(.*?)<\/Options>/s);
  if (!optionsBlockMatch) return [];
  return optionsBlockMatch[1].trim().split('\n').filter(line => line.trim().length > 0);
}
