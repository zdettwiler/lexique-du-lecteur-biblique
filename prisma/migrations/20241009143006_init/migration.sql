-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "password" TEXT,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("provider","providerAccountId")
);

-- CreateTable
CREATE TABLE "Session" (
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("identifier","token")
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
    "id" SERIAL NOT NULL,
    "book" TEXT NOT NULL,
    "chapter" INTEGER NOT NULL,
    "verse" INTEGER NOT NULL,
    "word" TEXT NOT NULL,
    "lemma" TEXT NOT NULL,
    "strong" TEXT NOT NULL,

    CONSTRAINT "BibleWord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearntWord" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "strong" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewed_gh_fr" TIMESTAMP(3) NOT NULL,
    "due_gh_fr" TIMESTAMP(3) NOT NULL,
    "reviewed_fr_gh" TIMESTAMP(3) NOT NULL,
    "due_fr_gh" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LearntWord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "LLBWord_strong_key" ON "LLBWord"("strong");

-- CreateIndex
CREATE UNIQUE INDEX "BibleWord_id_key" ON "BibleWord"("id");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BibleWord" ADD CONSTRAINT "BibleWord_strong_fkey" FOREIGN KEY ("strong") REFERENCES "LLBWord"("strong") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearntWord" ADD CONSTRAINT "LearntWord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearntWord" ADD CONSTRAINT "LearntWord_strong_fkey" FOREIGN KEY ("strong") REFERENCES "LLBWord"("strong") ON DELETE RESTRICT ON UPDATE CASCADE;
