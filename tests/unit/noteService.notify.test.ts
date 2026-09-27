import { vi, describe, it, expect, beforeEach } from "vitest";
import { NoteServiceImpl } from "../../src/services/NoteService";

vi.mock( "../../src/services/notificationService", () => ({
    notify: vi.fn(),
}));
import { notify } from "../../src/services/notificationService";

import { tr } from "zod/v4/locales";

class MockNoteRepository {
    create = vi.fn();

    // Agrego los otros metodos falsos porque sino typescript se me enoja
    findAll = vi.fn();
    findById = vi.fn();
    update = vi.fn();
    delete = vi.fn();
    clear = vi.fn();
}

describe("NoteService - createNote (ejercicio 6)", () => {

    // Instancia del repositorio mockeado
    const mockRepo = new MockNoteRepository();
    let noteService: NoteServiceImpl;

    beforeEach(() => {
        vi.clearAllMocks();
        noteService = new NoteServiceImpl(mockRepo);
    });

    it("Se llama a notify() si se crea una nota pinned.", () => {
        
        // Nota de prueba
        const notaPinned = {
            title: "Nota prueba",
            content: "(°-°)",
            pinned: true
        };

        // Nota esperada
        const notaExpected = {
            id: 10,
            title: notaPinned.title,
            content: notaPinned.content,
            pinned: true
        };

        // Configuracion del repositorio mockeado
        mockRepo.create.mockReturnValue(notaExpected);
        
        const resultado = noteService.createNote(notaPinned);

        // Revision del return esperado
        expect(resultado).toEqual(notaExpected);

        // Revision si se llama a notify
        expect(notify).toHaveBeenCalledTimes(1);
        expect(notify).toHaveBeenCalledWith(notaExpected);
    });

    it("No llama a notify() si se crea una nota no pinned.", () => {

        // Nota de prueba
        const notaNoPinned = {
            title: "Nota Prueba2",
            content: "(0_0)",
            pinned: false
        };

        // Nota esperada
        const notaExpected2 = {
            id: 11,
            title: notaNoPinned.title,
            content: notaNoPinned.content,
            pinned: false
        };

        // Configuracion del repositorio mockeado
        mockRepo.create.mockReturnValue(notaExpected2);

        const resultado = noteService.createNote(notaNoPinned);

        // Revision del return esperado
        expect(resultado).toEqual(notaExpected2);

        // Revision si no se llama a notify
        expect(notify).not.toHaveBeenCalled();
    });
});