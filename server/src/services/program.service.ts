import prisma from '../prisma/client';
import { ProgramStatus } from '@prisma/client';

interface CreateProgramData {
  name: string;
  details?: string;
  days: {
    name: string;
    exercises: string[];
  }[];
}

class ProgramService {
  async createProgramWithDaysAndExercises(userId: string, data: CreateProgramData) {
    const { name, details, days } = data;

    // Verify all exercises belong to the user
    const exerciseIds = days.flatMap(day => day.exercises);
    const userExercises = await prisma.exercise.findMany({
      where: {
        id: { in: exerciseIds },
        userId: userId
      },
      select: { id: true }
    });

    const userExerciseIds = userExercises.map((ex: { id: string }) => ex.id);
    const invalidExerciseIds = exerciseIds.filter(id => !userExerciseIds.includes(id));

    if (invalidExerciseIds.length > 0) {
      throw new Error(`Invalid exercise IDs: ${invalidExerciseIds.join(', ')}`);
    }

    // Create program with nested days and exercises using Prisma transaction
    const program = await prisma.program.create({
      data: {
        userId,
        name,
        details,
        status: ProgramStatus.INACTIVE,
        days: {
          create: days.map(day => ({
            name: day.name,
            exercises: {
              create: day.exercises.map(exerciseId => ({
                exerciseId
              }))
            }
          }))
        }
      },
      include: {
        days: {
          include: {
            exercises: {
              include: {
                exercise: {
                  select: {
                    id: true,
                    name: true
                  }
                }
              }
            }
          }
        }
      }
    });

    return program;
  }

  async getUserPrograms(userId: string) {
    const programs = await prisma.program.findMany({
      where: {
        userId
      },
      include: {
        days: {
          include: {
            exercises: {
              include: {
                exercise: {
                  select: {
                    id: true,
                    name: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return programs;
  }

  async getProgramById(userId: string, programId: string) {
    const program = await prisma.program.findFirst({
      where: {
        id: programId,
        userId
      },
      include: {
        days: {
          include: {
            exercises: {
              include: {
                exercise: {
                  select: {
                    id: true,
                    name: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!program) {
      throw new Error('Program not found');
    }

    return program;
  }

  async updateProgramStatus(userId: string, programId: string, status: ProgramStatus) {
    const program = await prisma.program.findFirst({
      where: {
        id: programId,
        userId
      }
    });

    if (!program) {
      throw new Error('Program not found');
    }

    return await prisma.program.update({
      where: {
        id: programId
      },
      data: {
        status
      }
    });
  }
}

export const programService = new ProgramService();
