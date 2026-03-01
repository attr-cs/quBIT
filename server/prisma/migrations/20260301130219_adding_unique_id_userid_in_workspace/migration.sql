/*
  Warnings:

  - A unique constraint covering the columns `[id,ownerId]` on the table `Workspace` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Workspace_id_ownerId_key" ON "Workspace"("id", "ownerId");
