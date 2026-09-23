-- CreateTable
CREATE TABLE "usuarios" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "categorias" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "listas" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "linkReferencia" TEXT,
    "dataCriacao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" INTEGER NOT NULL,
    CONSTRAINT "listas_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "itens" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL DEFAULT 1,
    "categoria" TEXT NOT NULL DEFAULT 'Outros',
    "status" TEXT NOT NULL DEFAULT 'pendente',
    "listaId" INTEGER NOT NULL,
    CONSTRAINT "itens_listaId_fkey" FOREIGN KEY ("listaId") REFERENCES "listas" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_CategoriaToLista" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_CategoriaToLista_A_fkey" FOREIGN KEY ("A") REFERENCES "categorias" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CategoriaToLista_B_fkey" FOREIGN KEY ("B") REFERENCES "listas" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "categorias_nome_key" ON "categorias"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "listas_usuarioId_nome_key" ON "listas"("usuarioId", "nome");

-- CreateIndex
CREATE UNIQUE INDEX "_CategoriaToLista_AB_unique" ON "_CategoriaToLista"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoriaToLista_B_index" ON "_CategoriaToLista"("B");
