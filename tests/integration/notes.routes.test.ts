import request from "supertest";
import { makeApp } from "../../src/app"
import { vi, describe, it, expect, beforeEach } from "vitest";
import { notify } from "../../src/services/notificationService";

// Mock del servicio notify
vi.mock("../../src/services/notificationService", () => ({
    notify: vi.fn(),
}));

const app = makeApp(":memory:");

describe("Notes Routes - Test de Integracion (ejercicio 6)", () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

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