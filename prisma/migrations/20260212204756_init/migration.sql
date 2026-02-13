-- CreateTable
CREATE TABLE "UserSession" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "selected_difficulty" INTEGER NOT NULL,
    "user_score" INTEGER NOT NULL,
    "model_score" INTEGER NOT NULL,
    "percent_difference" REAL NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
