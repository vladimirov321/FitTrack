import prisma from '../prisma/client';

export interface LoggedSetData {
  weight: number;
  reps: number;
  order: number;
}

export interface LoggedExerciseData {
  exerciseId: string;
  sets: LoggedSetData[];
}

export interface WorkoutDayData {
  date: string; // ISO date string
  exercises: LoggedExerciseData[];
}

class LogService {
  // Start a new program log
  async startProgramLog(userId: string, programId: string) {
    // Verify program ownership
    const program = await prisma.program.findFirst({
      where: {
        id: programId,
        userId: userId
      }
    });

    if (!program) {
      throw new Error('Program not found or not owned by user');
    }

    // Check if there's already an active log for this program
    const existingLog = await prisma.programLog.findFirst({
      where: {
        userId: userId,
        programId: programId,
        endDate: null
      }
    });

    if (existingLog) {
      return existingLog;
    }

    // Create new program log
    const programLog = await prisma.programLog.create({
      data: {
        userId: userId,
        programId: programId,
        programName: program.name,
        startDate: new Date()
      }
    });

    return programLog;
  }

  // Log a completed workout day
  async logWorkoutDay(userId: string, logId: string, dayId: string, workoutData: WorkoutDayData) {
    // Verify log ownership
    const log = await prisma.programLog.findFirst({
      where: {
        id: logId,
        userId: userId
      }
    });

    if (!log) {
      throw new Error('Program log not found or not owned by user');
    }

    // Verify program day exists in the program
    const programDay = await prisma.programDay.findFirst({
      where: {
        id: dayId,
        programId: log.programId
      }
    });

    if (!programDay) {
      throw new Error('Program day not found in this program');
    }

    // Validate all exercises exist and belong to the user
    const exerciseIds = workoutData.exercises.map(ex => ex.exerciseId);
    const userExercises = await prisma.exercise.findMany({
      where: {
        id: { in: exerciseIds },
        userId: userId
      }
    });

    if (userExercises.length !== exerciseIds.length) {
      throw new Error('One or more exercises not found or not owned by user');
    }

    // Create exercise map for name lookup
    const exerciseMap = new Map(userExercises.map(ex => [ex.id, ex.name]));

    // Check if this day is already logged for this date
    const existingLogDay = await prisma.programLogDay.findFirst({
      where: {
        logId: logId,
        date: {
          gte: new Date(workoutData.date + 'T00:00:00.000Z'),
          lt: new Date(workoutData.date + 'T23:59:59.999Z')
        }
      },
      include: {
        exercises: {
          include: {
            sets: true
          }
        }
      }
    });

    // If day already exists, delete it and recreate (update pattern)
    if (existingLogDay) {
      try {
        await prisma.programLogDay.delete({
          where: {
            id: existingLogDay.id
          }
        });
      } catch (error) {
        console.error('Error deleting existing log day:', error);
        throw new Error('Failed to update existing workout day');
      }
    }

    // Create new workout day log with nested exercises and sets
    try {
      const logDay = await prisma.programLogDay.create({
        data: {
          logId: logId,
          date: new Date(workoutData.date + 'T12:00:00.000Z'), // Set to noon to avoid timezone issues
          exercises: {
            create: workoutData.exercises.map(exercise => ({
              exerciseId: exercise.exerciseId,
              name: exerciseMap.get(exercise.exerciseId) || 'Unknown Exercise', // Snapshot of name
              sets: {
                create: exercise.sets.map(set => ({
                  weight: set.weight,
                  reps: set.reps,
                  order: set.order
                }))
              }
            }))
          }
        },
        include: {
          exercises: {
            include: {
              sets: {
                orderBy: {
                  order: 'asc'
                }
              }
            }
          }
        }
      });

      return logDay;
    } catch (error) {
      console.error('Error creating workout day log:', error);
      throw new Error('Failed to create workout day log. Please check your data and try again.');
    }
  }

  // Get all user's program logs
  async getUserLogs(userId: string) {
    const logs = await prisma.programLog.findMany({
      where: {
        userId: userId
      },
      include: {
        program: {
          select: {
            id: true,
            name: true,
            status: true
          }
        },
        days: {
          include: {
            exercises: {
              include: {
                sets: {
                  orderBy: {
                    order: 'asc'
                  }
                }
              }
            }
          },
          orderBy: {
            date: 'desc'
          }
        }
      },
      orderBy: {
        startDate: 'desc'
      }
    });

    return logs;
  }

  // Get a specific log by ID (helper method)
  async getLogById(userId: string, logId: string) {
    const log = await prisma.programLog.findFirst({
      where: {
        id: logId,
        userId: userId
      },
      include: {
        program: {
          select: {
            id: true,
            name: true,
            status: true,
            days: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        days: {
          include: {
            exercises: {
              include: {
                sets: {
                  orderBy: {
                    order: 'asc'
                  }
                }
              }
            }
          },
          orderBy: {
            date: 'desc'
          }
        }
      }
    });

    return log;
  }

  // End a program log (optional - for when user stops following a program)
  async endProgramLog(userId: string, logId: string) {
    const log = await prisma.programLog.findFirst({
      where: {
        id: logId,
        userId: userId
      }
    });

    if (!log) {
      throw new Error('Program log not found or not owned by user');
    }

    const updatedLog = await prisma.programLog.update({
      where: {
        id: logId
      },
      data: {
        endDate: new Date()
      }
    });

    return updatedLog;
  }

  // Get logs for a specific program
  async getProgramLogs(userId: string, programId: string) {
    const logs = await prisma.programLog.findMany({
      where: {
        userId: userId,
        programId: programId
      },
      include: {
        days: {
          include: {
            exercises: {
              include: {
                sets: {
                  orderBy: {
                    order: 'asc'
                  }
                }
              }
            }
          },
          orderBy: {
            date: 'desc'
          }
        }
      },
      orderBy: {
        startDate: 'desc'
      }
    });

    return logs;
  }
}

export const logService = new LogService();
