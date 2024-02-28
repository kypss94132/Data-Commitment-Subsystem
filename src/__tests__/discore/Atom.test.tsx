import exp from 'constants';
import { DISOntology } from '../../main/discore/ontology';

const onto = new DISOntology();

beforeAll(() => {
  onto.create();
});

describe('atom', () => {
  test('add', () => {
    onto.setAtom({
      name: 'a5',
      description: 'a5 atom',
    });
    const atom = onto.getAtom('a5');
    expect(atom).not.toBeNull();
    expect(atom!.name).toBe('a5');
    expect(atom!.description).toBe('a5 atom');
  });

  test('update', () => {
    onto.setAtom({
      name: 'a6',
      description: 'a6 atom',
    });
    const atom = onto.getAtom('a6');
    expect(atom).not.toBeNull();
    expect(atom!.name).toBe('a6');
    expect(atom!.description).toBe('a6 atom');

    onto.setAtom({
      name: 'a6',
      description: 'a6 atom updated',
    });
    const atom2 = onto.getAtom('a6');
    expect(atom2).not.toBeNull();
    expect(atom2!.name).toBe('a6');
    expect(atom2!.description).toBe('a6 atom updated');
  });

  test('no description', () => {
    onto.setAtom({
      name: 'a7',
    });
    const atom = onto.getAtom('a7');
    expect(atom).not.toBeNull();
    expect(atom!.name).toBe('a7');
    expect(atom!.description).toBeUndefined();
  });

  test('delete description', () => {
    onto.setAtom({
      name: 'a8',
      description: 'a8 atom',
    });
    const atom = onto.getAtom('a8');
    expect(atom).not.toBeNull();
    expect(atom!.name).toBe('a8');
    expect(atom!.description).toBe('a8 atom');

    onto.setAtom({
      name: 'a8',
      description: null,
    });
    const atom2 = onto.getAtom('a8');
    expect(atom2).not.toBeNull();
    expect(atom2!.name).toBe('a8');
    expect(atom2!.description).toBeUndefined();
  });

  test('remove atom', () => {
    onto.setAtom({
      name: 'a9',
      description: 'a9 atom',
    });

    const atom = onto.getAtom('a9');
    expect(atom).not.toBeNull();
    expect(atom!.name).toBe('a9');
    expect(atom!.description).toBe('a9 atom');

    onto.removeAtom('a9');
    expect(onto.getAtom('a9')).toBeNull();
  });
});
