import { describe, it, expect, beforeEach } from "vitest";

import { NoteServiceImpl } from "../../src/services/NoteService";
import { SqliteNoteRepository } from "../../src/repositories/NoteRepository";
import { createDb } from "../../src/db/connection";

describe("NoteService - updateNote (Ejercicio 4)", () => {
    let service: NoteServiceImpl;

    beforeEach(() => {
        const db = createDb(":memory:");
        const repo = new SqliteNoteRepository(db);
        service = new NoteServiceImpl(repo);
    });

    it("actualiza solamente el title sin modificar el content", () => {
        const nota = service.createNote({
            title: "Título original",
            content: "Contenido original"
        });

        const actualizada = service.updateNote(nota.id, {
            title: "Título modificado"
        });

        expect(actualizada).toBeDefined();
        expect(actualizada?.id).toBe(nota.id);
        expect(actualizada?.title).toBe("Título modificado");
        expect(actualizada?.content).toBe("Contenido original");
    });

    it("actualiza solamente el content sin modificar el title", () => {
        const nota = service.createNote({
            title: "Título original",
            content: "Contenido original"
        });

        const actualizada = service.updateNote(nota.id, {
            content: "Contenido modificado"
        });

        expect(actualizada).toBeDefined();
        expect(actualizada?.id).toBe(nota.id);
        expect(actualizada?.title).toBe("Título original");
        expect(actualizada?.content).toBe("Contenido modificado");
    });

    it("actualiza solamente pinned", () => {
        const nota = service.createNote({
            title: "Mi nota",
            content: "Contenido",
            pinned: false
        });

        const actualizada = service.updateNote(nota.id, {
            pinned: true
        });

        expect(actualizada).toBeDefined();
        expect(actualizada?.title).toBe("Mi nota");
        expect(actualizada?.content).toBe("Contenido");
        expect(actualizada?.pinned).toBe(true);
    });

    it("actualiza varios campos al mismo tiempo", () => {
        const nota = service.createNote({
            title: "Título original",
            content: "Contenido original",
            pinned: false
        });

        const actualizada = service.updateNote(nota.id, {
            title: "Nuevo título",
            content: "Nuevo contenido",
            pinned: true
        });

        expect(actualizada).toBeDefined();
        expect(actualizada?.id).toBe(nota.id);
        expect(actualizada?.title).toBe("Nuevo título");
        expect(actualizada?.content).toBe("Nuevo contenido");
        expect(actualizada?.pinned).toBe(true);
    });

    it("devuelve undefined cuando la nota no existe", () => {
        const resultado = service.updateNote(999, {
            title: "Título nuevo"
        });

        expect(resultado).toBeUndefined();
    });
});