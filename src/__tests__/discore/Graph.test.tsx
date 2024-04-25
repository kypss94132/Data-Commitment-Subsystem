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
});

describe('graph', () => {
  test('add without root', () => {
    expect(() => {
      onto.setRootedGraph({
        name: 'g1',
        description: 'g1 graph',
      });
    }).toThrow('While creating rooted graph, it must have a root');
  });

  test('add with atom root', () => {
    onto.setRootedGraph({
      name: 'g2',
      description: 'g2 graph',
      rootedAt: 'a1',
    });
    const graph = onto.getRootedGraph('g2');
    expect(graph).not.toBeNull();
    expect(graph!.name).toBe('g2');
    expect(graph!.description).toBe('g2 graph');
    expect(graph!.rootedAt).toBe('a1');
  });

  test('add with concept root', () => {
    onto.setRootedGraph({
      name: 'g2',
      description: 'g2 graph',
      rootedAt: 'c1',
    });
    const graph = onto.getRootedGraph('g2');
    expect(graph).not.toBeNull();
    expect(graph!.name).toBe('g2');
    expect(graph!.description).toBe('g2 graph');
    expect(graph!.rootedAt).toBe('c1');
  });

  test('add with wrong root', () => {
    expect(() => {
      onto.setRootedGraph({
        name: 'g3',
        description: 'g3 graph',
        rootedAt: 'a99',
      });
    }).toThrow('Concept or atom concept a99 does not exist');
  });

  test('remove', () => {
    onto.setRootedGraph({
      name: 'g4',
      description: 'g4 graph',
      rootedAt: 'a1',
    });
    const graph = onto.getRootedGraph('g4');
    expect(graph).not.toBeNull();
    expect(graph!.name).toBe('g4');
    expect(graph!.description).toBe('g4 graph');
    onto.removeRootedGraph('g4');
    expect(onto.getRootedGraph('g4')).toBeNull();
  });
});
