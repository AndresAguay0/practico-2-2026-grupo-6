import { test, expect } from "@playwright/test";
import { resetAndSeed } from "./helpers";

test.describe("Notes API - Test e2e (ejercicio 7)", () => {

    test.beforeEach(async ({ baseURL }) => {
        await resetAndSeed(baseURL!);
    });

    // Happy path
    test("Happy path: (Crear, Obtener, Actualizar y Eliminar", async ({ request }) => {
        // Crear nueva nota
        const nueva_nota = {
            title: "Nota E2E",
            content: "Happy path",
            pinned: true,
        };

        const createRes = await request.post("/notes", { data: nueva_nota });
        expect(createRes.status()).toBe(201);

        const createdNote = await createRes.json();
        expect(createdNote).toHaveProperty("id");
        expect(createdNote.title).toBe(nueva_nota.title);
        expect(createdNote.content).toBe(nueva_nota.content);
        expect(createdNote.pinned).toBe(true);

        const noteId = createdNote.id;

        // Obtener nota creada
        const getRes = await request.get(`/notes/${noteId}`);
        expect(getRes.status()).toBe(200);

        const fetchedNote = await getRes.json();
        expect(fetchedNote.id).toBe(noteId);
        expect(fetchedNote.title).toBe(nueva_nota.title);

        // Actualizar nota
        const patchNote = { title: "Titulo patcheado"};
        const patchRes = await request.patch(`/notes/${noteId}`, { data: patchNote });
        expect(patchRes.status()).toBe(200);

        const updateNote = await patchRes.json();
        expect(updateNote.title).toBe(patchNote.title);
        expect(updateNote.content).toBe(nueva_nota.content);

        // Eliminar nota
        const deleteRes = await request.delete(`/notes/${noteId}`);
        expect(deleteRes.status()).toBe(204);

        const getAfterDelete = await request.get(`/notes/${noteId}`);
        expect(getAfterDelete.status()).toBe(404);
    });

});