import request from "supertest";
import { makeApp } from "../../src/app"
import { vi, describe, it, expect, beforeEach } from "vitest";
import { notify } from "../../src/services/notificationService";

// Mock del servicio notify
vi.mock("../../src/services/notificationService", () => ({
    notify: vi.fn(),
}));


describe("Notes Routes - Test de integracion", () => {

    let app: ReturnType<typeof makeApp>;
            
    beforeEach( async () => {
        vi.clearAllMocks();
        
        app = makeApp(":memory:")
    });

    describe("(ejercicio 3)", () => {

        it("Debe devolver una nota existente por su id", async () => {
            const nota = {
                title: "Comprar pan",
                content: "Antes de las 20hs"
            };

            // Crear la nota que vamos a buscar
            const nota_creada = await request(app)
                .post("/notes")
                .send(nota)
                .expect(201);

            // Buscar la nota por su id
            const respuesta = await request(app)
                .get(`/notes/${nota_creada.body.id}`)
                .expect(200);

            expect(respuesta.body).toEqual(nota_creada.body);
        });

        it("Debe devolver 404 cuando el id no existe", async () => {
            const respuesta = await request(app)
                .get("/notes/1557")
                .expect(404);

            expect(respuesta.body).toEqual({ error: "NotFound" });
        });
    });

    describe("(ejercicio 5)", () => {

    it("Debe eliminar una nota existente", async () => {
        const nota = {
            title: "Nota para eliminar",
            content: "Esta nota será eliminada"
        };

        // Primero crear la nota que vamos a eliminar
        const nota_creada = await request(app)
            .post("/notes")
            .send(nota)
            .expect(201);

        // Eliminar la nota creada anteriormente
        await request(app)
            .delete(`/notes/${nota_creada.body.id}`)
            .expect(204);

        // Comprobar que ya no existe
        await request(app)
            .get(`/notes/${nota_creada.body.id}`)
            .expect(404);
    });

    it("Debe devolver 404 cuando se intenta eliminar una nota que no existe", async () => {
        const respuesta = await request(app)
            .delete("/notes/1557")
            .expect(404);

        expect(respuesta.body).toEqual({ error: "NotFound" });
    });

});

    describe("(ejercicio 6)", () => {

        // Caso de creación con pinned = false
        it("Debe crear una nota sin activar el servicio de notify", async () => {
            const nota_no_pinned = {
                title: "Nota no pinned",
                content: ">:|",
                pinned: false
            };

            await request(app).post("/notes").send(nota_no_pinned).expect(201);

            expect(notify).not.toHaveBeenCalled();
        });

        // Caso de creación con pinned = true
        it("Debe crear una nota y activar el servicio de notify", async () => {
            const nota_pinned = {
                title: "Nota pinned",
                content: ":D",
                pinned: true
            };

            await request(app).post("/notes").send(nota_pinned).expect(201);

            expect(notify).toHaveBeenCalledTimes(1);

            const notify_expected = {
                id: expect.any(Number),
                title: nota_pinned.title,
                content: nota_pinned.content,
                pinned: true
            };

            expect(notify).toHaveBeenCalledWith(expect.objectContaining(notify_expected));
        });
    });
});
