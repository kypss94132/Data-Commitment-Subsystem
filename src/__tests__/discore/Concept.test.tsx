import DISOntology from '../../main/discore/ontology';

const onto = new DISOntology();

beforeAll(() => {
  onto.create();
  onto.setAtom({
    name: 'a1',
    description: 'a1 atom',
  });
  onto.setAtom({
    name: 'a2',
    description: 'a2 atom',
  });
  onto.setAtom({
    name: 'a3',
    description: 'a3 atom',
  });
  onto.setAtom({
    name: 'a4',
    description: 'a4 atom',
  });
});

describe('concept', () => {
  test('add', () => {
    onto.setConcept({
      name: 'c1',
      description: 'c1 concept',
      latticeOfConcepts: ['a1', 'a2', 'a3', 'a4'],
    });
    const concept = onto.getConcept('c1');
    expect(concept).not.toBeNull();
    expect(concept!.name).toBe('c1');
    expect(concept!.description).toBe('c1 concept');
    expect(concept!.latticeOfConcepts).toEqual(['a1', 'a2', 'a3', 'a4']);
  });

  test('set', () => {
    onto.setConcept({
      name: 'c2',
      description: 'c2 concept',
      latticeOfConcepts: ['a1', 'a2', 'a3', 'a4'],
    });
    const concept = onto.getConcept('c2');
    expect(concept).not.toBeNull();
    expect(concept!.name).toBe('c2');
    expect(concept!.description).toBe('c2 concept');
    expect(concept!.latticeOfConcepts).toEqual(['a1', 'a2', 'a3', 'a4']);
    onto.setConcept({
      name: 'c2',
      latticeOfConcepts: ['a1', 'a2'],
    });
    const concept2 = onto.getConcept('c2');
    expect(concept2).not.toBeNull();
    expect(concept2!.name).toBe('c2');
    expect(concept2!.description).toBe('c2 concept');
    expect(concept2!.latticeOfConcepts).toEqual(['a1', 'a2']);
  });

  test('add wrong atom', () => {
    expect(() => {
      onto.setConcept({
        name: 'c3',
        description: 'c3 concept',
        latticeOfConcepts: ['a1', 'a2', 'a3', 'a99'],
      });
    }).toThrow('Atom a99 does not exist');
  });

  test('remove', () => {
    onto.setConcept({
      name: 'c4',
      description: 'c4 concept',
      latticeOfConcepts: ['a1', 'a2', 'a3', 'a4'],
    });
    const concept = onto.getConcept('c4');
    expect(concept).not.toBeNull();
    expect(concept!.name).toBe('c4');
    expect(concept!.description).toBe('c4 concept');
    expect(concept!.latticeOfConcepts).toEqual(['a1', 'a2', 'a3', 'a4']);

    onto.removeConcept('c4');
    const concept2 = onto.getConcept('c4');
    expect(concept2).toBeNull();
  });
});

describe('virtualConcept', () => {
  test('add', () => {
    onto.setVirtualConcept('vc1');
    expect(onto.hasVirtualConcept('vc1')).toBe(true);
  });

  test('remove', () => {
    onto.setVirtualConcept('vc2');
    expect(onto.hasVirtualConcept('vc2')).toBe(true);
    onto.removeVirtualConcept('vc2');
    expect(onto.hasVirtualConcept('vc2')).toBe(false);
  });
});
