-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LLBWord" (
    "strong" TEXT NOT NULL,
    "lemma" TEXT NOT NULL,
    "gloss" TEXT NOT NULL,
    "freq" INTEGER NOT NULL,
    "vu" BOOLEAN NOT NULL,

    CONSTRAINT "LLBWord_pkey" PRIMARY KEY ("strong")
);

-- CreateTable
CREATE TABLE "BibleWord" (
    "id" INTEGER NOT NULL,
    "book" TEXT NOT NULL,
    "chapter" INTEGER NOT NULL,
    "verse" INTEGER NOT NULL,
    "word" TEXT NOT NULL,
    "lemma" TEXT NOT NULL,
    "strong" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "LearntWord" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "strong" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewed_gh_fr" TIMESTAMP(3) NOT NULL,
    "due_gh_fr" TIMESTAMP(3) NOT NULL,
    "reviewed_fr_gh" TIMESTAMP(3) NOT NULL,
    "due_fr_gh" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LearntWord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "LLBWord_strong_key" ON "LLBWord"("strong");

-- CreateIndex
CREATE UNIQUE INDEX "BibleWord_id_key" ON "BibleWord"("id");

-- AddForeignKey
ALTER TABLE "BibleWord" ADD CONSTRAINT "BibleWord_strong_fkey" FOREIGN KEY ("strong") REFERENCES "LLBWord"("strong") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearntWord" ADD CONSTRAINT "LearntWord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearntWord" ADD CONSTRAINT "LearntWord_strong_fkey" FOREIGN KEY ("strong") REFERENCES "LLBWord"("strong") ON DELETE RESTRICT ON UPDATE CASCADE;
