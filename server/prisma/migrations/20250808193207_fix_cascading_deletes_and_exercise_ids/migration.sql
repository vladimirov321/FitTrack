-- DropForeignKey
ALTER TABLE "public"."LoggedSet" DROP CONSTRAINT "LoggedSet_logDayExerciseId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProgramLogDay" DROP CONSTRAINT "ProgramLogDay_logId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProgramLogDayExercise" DROP CONSTRAINT "ProgramLogDayExercise_logDayId_fkey";

-- AddForeignKey
ALTER TABLE "public"."ProgramLogDay" ADD CONSTRAINT "ProgramLogDay_logId_fkey" FOREIGN KEY ("logId") REFERENCES "public"."ProgramLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProgramLogDayExercise" ADD CONSTRAINT "ProgramLogDayExercise_logDayId_fkey" FOREIGN KEY ("logDayId") REFERENCES "public"."ProgramLogDay"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LoggedSet" ADD CONSTRAINT "LoggedSet_logDayExerciseId_fkey" FOREIGN KEY ("logDayExerciseId") REFERENCES "public"."ProgramLogDayExercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;
