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
  onto.setConcept({
    name: 'c1',
    description: 'c1 concept',
    latticeOfConcepts: ['a1', 'a2', 'a3', 'a4'],
  });
  onto.setVirtualConcept('vc1');
  onto.setVirtualConcept('vc2');
  onto.setVirtualConcept('vc3');
  onto.setVirtualConcept('vc4');
  onto.setRootedGraph({
    name: 'g1',
    description: 'g1 graph',
    rootedAt: 'c1',
  });
});

describe('edge', () => {
  test('add with predicate', () => {
    onto.setRelation(
      {
        from: 'vc1',
        to: 'vc2',
        predicate: 'test',
        relation: 'isA',
      },
      'g1',
    );
    const edge = onto.getRelation(
      {
        from: 'vc1',
        to: 'vc2',
        relation: 'isA',
      },
      'g1',
    );
    expect(edge).not.toBeNull();
    expect(edge!.from).toBe('vc1');
    expect(edge!.to).toBe('vc2');
    expect(edge!.predicate).toBe('test');
    expect(edge!.relation).toBe('isA');
  });

  test('add without predicate', () => {
    onto.setRelation(
      {
        from: 'vc1',
        to: 'vc3',
        relation: 'isA',
      },
      'g1',
    );
    const edge = onto.getRelation(
      {
        from: 'vc1',
        to: 'vc3',
        relation: 'isA',
      },
      'g1',
    );
    expect(edge).not.toBeNull();
    expect(edge!.from).toBe('vc1');
    expect(edge!.to).toBe('vc3');
    expect(edge!.predicate).toBeUndefined();
    expect(edge!.relation).toBe('isA');
  });

  test('add with wrong from', () => {
    expect(() => {
      onto.setRelation(
        {
          from: 'vc99',
          to: 'vc3',
          relation: 'r2',
        },
        'g1',
      );
    }).toThrow('Edge node vc99 is not a concept, a virtual concept or an atom');
  });

  test('add with wrong to', () => {
    expect(() => {
      onto.setRelation(
        {
          from: 'vc1',
          to: 'vc99',
          relation: 'r2',
        },
        'g1',
      );
    }).toThrow('Edge node vc99 is not a concept, a virtual concept or an atom');
  });

  test('remove', () => {
    onto.setRelation(
      {
        from: 'vc1',
        to: 'vc4',
        relation: 'r3',
      },
      'g1',
    );
    const edge = onto.getRelation(
      {
        from: 'vc1',
        to: 'vc4',
        relation: 'r3',
      },
      'g1',
    );
    expect(edge).not.toBeNull();
    expect(edge!.from).toBe('vc1');
    expect(edge!.to).toBe('vc4');
    expect(edge!.relation).toBe('r3');
    onto.removeRelation(
      {
        from: 'vc1',
        to: 'vc4',
        relation: 'r3',
      },
      'g1',
    );
    expect(
      onto.getRelation(
        {
          from: 'vc1',
          to: 'vc4',
          relation: 'r3',
        },
        'g1',
      ),
    ).toBeNull();
  });
});
