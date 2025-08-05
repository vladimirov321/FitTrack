import prisma from '../prisma/client';

export interface CreateExerciseData {
  name: string;
}

export interface UpdateExerciseNameData {
  name: string;
}

export interface SetData {
  weight: number;
  reps: number;
  order: number;
}

export const exerciseService = {
  async createExercise(userId: string, data: CreateExerciseData) {
    const existing = await prisma.exercise.findFirst({
      where: { 
        userId, 
        name: data.name 
      }
    });

    if (existing) {
      throw new Error('Exercise name already exists');
    }

    const exercise = await prisma.exercise.create({
      data: {
        userId,
        name: data.name,
      },
      include: {
        lastSets: {
          orderBy: { order: 'asc' }
        }
      }
    });

    return exercise;
  },

  async getUserExercises(userId: string) {
    const exercises = await prisma.exercise.findMany({
      where: { userId },
      include: {
        lastSets: {
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    return exercises;
  },

  async getExerciseById(userId: string, exerciseId: string) {
    const exercise = await prisma.exercise.findFirst({
      where: { 
        id: exerciseId,
        userId 
      },
      include: {
        lastSets: {
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!exercise) {
      throw new Error('Exercise not found');
    }

    return exercise;
  },

  async updateExerciseName(userId: string, exerciseId: string, data: UpdateExerciseNameData) {
    const exercise = await this.getExerciseById(userId, exerciseId);

    const existing = await prisma.exercise.findFirst({
      where: { 
        userId, 
        name: data.name,
        id: { not: exerciseId }
      }
    });

    if (existing) {
      throw new Error('Exercise name already exists');
    }

    const updatedExercise = await prisma.exercise.update({
      where: { id: exerciseId },
      data: { name: data.name },
      include: {
        lastSets: {
          orderBy: { order: 'asc' }
        }
      }
    });

    return updatedExercise;
  },

  async replaceExerciseSets(userId: string, exerciseId: string, sets: SetData[]) {
    await this.getExerciseById(userId, exerciseId);

    if (!Array.isArray(sets)) {
      throw new Error('Sets must be an array');
    }

    sets.forEach((set, index) => {
      if (typeof set.weight !== 'number' || set.weight < 0) {
        throw new Error(`Invalid weight for set ${index + 1}`);
      }
      if (typeof set.reps !== 'number' || set.reps < 1) {
        throw new Error(`Invalid reps for set ${index + 1}`);
      }
      if (typeof set.order !== 'number' || set.order < 1) {
        throw new Error(`Invalid order for set ${index + 1}`);
      }
    });

    // Use transaction to replace all sets
    const result = await prisma.$transaction(async (tx) => {
      // Delete existing sets
      await tx.set.deleteMany({
        where: { exerciseId }
      });

      // Create new sets
      if (sets.length > 0) {
        await tx.set.createMany({
          data: sets.map(set => ({
            exerciseId,
            weight: set.weight,
            reps: set.reps,
            order: set.order
          }))
        });
      }

      // Update exercise's updatedAt timestamp
      const updatedExercise = await tx.exercise.update({
        where: { id: exerciseId },
        data: { updatedAt: new Date() },
        include: {
          lastSets: {
            orderBy: { order: 'asc' }
          }
        }
      });

      return updatedExercise;
    });

    return result;
  },

  async deleteExercise(userId: string, exerciseId: string) {
    await this.getExerciseById(userId, exerciseId);

    const programUsage = await prisma.programDayExercise.findFirst({
      where: { exerciseId }
    });

    if (programUsage) {
      throw new Error('Cannot delete exercise that is used in programs');
    }

    // Delete exercise (sets will be deleted due to cascade)
    await prisma.exercise.delete({
      where: { id: exerciseId }
    });

    return { message: 'Exercise deleted successfully' };
  }
};
