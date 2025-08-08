/*
  Warnings:

  - Added the required column `exerciseId` to the `ProgramLogDayExercise` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."ProgramLogDayExercise" ADD COLUMN     "exerciseId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."ProgramLogDayExercise" ADD CONSTRAINT "ProgramLogDayExercise_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "public"."Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
