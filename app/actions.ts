'use server'

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

type QuizResult = {
  name: string;
  position: string;
  difficulty: number;
  userScore: number;
  modelScore: number;
};

export async function submitQuizResult(data: QuizResult) {
  const { name, position, difficulty, userScore, modelScore } = data;

  // Positive % = Model did better. Negative % = User did better.
  const percentDiff = ((modelScore - userScore) / 10) * 100;

  await prisma.userSession.create({
    data: {
      name,
      position,
      selected_difficulty: difficulty,
      user_score: userScore,
      model_score: modelScore,
      percent_difference: percentDiff,
    },
  });

  revalidatePath('/');
  return { success: true };
}
