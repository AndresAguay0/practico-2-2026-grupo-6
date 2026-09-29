import { describe, it, expect, beforeEach } from 'vitest';
import { NoteServiceImpl } from '../../src/services/NoteService';
import { SqliteNoteRepository } from '../../src/repositories/NoteRepository';
import { createDb } from '../../src/db/connection';

describe('NoteService - deleteNote (Ejercicio 5)', () => {
  let service: NoteServiceImpl;
  let repo: SqliteNoteRepository;

  beforeEach(() => {
    const db = createDb(':memory:');
    repo = new SqliteNoteRepository(db);
    service = new NoteServiceImpl(repo);
  });

  it('elimina una nota existente', () => {
    const created = repo.create({
      title: 'Comprar pan',
      content: 'Antes de las 20hs'
    });

    expect(service.deleteNote(created.id)).toBe(true);
    expect(service.getNote(created.id)).toBeUndefined();
  });

  it('devuelve false cuando el id no existe', () => {
    expect(service.deleteNote(1557)).toBe(false);
  });
});