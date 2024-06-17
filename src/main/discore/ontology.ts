import { DOMParser } from '@xmldom/xmldom';
import xpath from 'xpath';
import { createElementWithText, node2elem } from './utils';
import { DISGetType, DISSetType } from './type';
import formatXml from 'xml-formatter';

/**
 * A help function to add or update a child element in an XML element.
 *
 * @param elem the parent element
 * @param itemName the name of the child element
 * @param content undefined means do nothing, null or a empty string means do remove, otherwise do update or add
 * @returns
 */
function setItem(
  elem: Element,
  itemName: string,
  content: string | undefined | null,
): void {
  if (content === undefined) {
    return;
  }

  const itemNode = xpath.select1(`./${itemName}`, elem) as Node;
  if (content === null || content === '') {
    if (itemNode !== undefined) {
      elem.removeChild(itemNode);
    }
    return;
  }

  if (itemNode === undefined) {
    elem.appendChild(
      createElementWithText(elem.ownerDocument!, itemName, content),
    );
  } else {
    itemNode.textContent = content;
  }
}

/**
 * A help function to make sure a direct child element exists in an XML element.
 * @param elem the element to check
 * @param itemName the name of the direct child element which must exist
 */
function makeSureItemExists(elem: Element, itemName: string): void {
  const itemNode = xpath.select1(`./${itemName}`, elem) as Node;
  if (itemNode === undefined) {
    elem.appendChild(elem.ownerDocument!.createElement(itemName));
  }
}

/**
 * A help function to set an array item in an XML element. The previous content will be removed.
 * @example
 * setArrayItem(elem, 'item', 'subItem', ['a', 'b', 'c'])
 * will generate:
 * <elem>
 *   <item>
 *     <subItem>a</subItem>
 *     <subItem>b</subItem>
 *     <subItem>c</subItem>
 *   </item>
 * </elem>
 *
 * @param elem the target element
 * @param itemName the name of the array item
 * @param subItemName the name of the sub item
 * @param content the content of the array item
 */
function setArrayItem(
  elem: Element,
  itemName: string,
  subItemName: string,
  content: Array<string>,
): void {
  makeSureItemExists(elem, itemName);
  const itemNode = xpath.select1(`./${itemName}`, elem) as Node;
  const itemElem = node2elem(itemNode);

  // remove all previous sub items
  while (itemElem.firstChild) {
    itemElem.removeChild(itemElem.firstChild);
  }

  content.forEach((subItemContent) => {
    itemElem.appendChild(
      createElementWithText(elem.ownerDocument!, subItemName, subItemContent),
    );
  });
}

class DISOntology {
  private doc: Document = undefined as unknown as Document;

  public isInitialized(): boolean {
    return this.doc !== undefined;
  }

  /**
   * Check whether doc is initialized or not. Must be called before any operation.
   */
  private verifyInit(): void {
    if (!this.isInitialized()) {
      throw new Error('DISOntology is not initialized');
    }
  }

  /**
   * Save the ontology to a formated XML string.
   * @returns the XML string of the ontology
   */
  public save(): string {
    this.verifyInit();
    return formatXml(this.doc.toString(), {
      collapseContent: true,
    });
  }

  public create(): DISOntology {
    this.doc = new DOMParser().parseFromString(
      '<ontology><name></name><atomDomain></atomDomain></ontology>',
      'application/xml',
    );
    return this;
  }

  private checkNameValid(name: string) {
    if (name === '' || name === undefined || name === null) {
      throw new Error('Name cannot be empty, undefined or null');
    }
  }

  public loadFromString(str: string): DISOntology {
    this.doc = new DOMParser().parseFromString(str, 'application/xml');
    return this;
  }

  public setName(name: string): void {
    this.verifyInit();
    this.checkNameValid(name);
    const nameNode = xpath.select1('/ontology/name', this.doc) as Node;
    const nameElem = node2elem(nameNode);
    nameElem.textContent = name;
  }

  public getName(): string {
    this.verifyInit();
    const nameNode = xpath.select1('/ontology/name', this.doc) as Node;
    return nameNode.textContent!;
  }

  public setAtom(atom: DISSetType.Atom): void {
    this.verifyInit();
    this.checkNameValid(atom.name);
    const atomDomainNode = xpath.select1(
      '/ontology/atomDomain',
      this.doc,
    ) as Node;
    const atomDomainElem = node2elem(atomDomainNode);

    let atomNode = xpath.select1(
      `./atom[name="${atom.name}"]`,
      atomDomainNode,
    ) as Node;

    // make sure atom node exists and it must have a name element
    if (atomNode === undefined) {
      atomNode = this.doc.createElement('atom') as Node;
      atomDomainElem.appendChild(atomNode);
      const atomElem = node2elem(atomNode);
      atomElem.appendChild(createElementWithText(this.doc, 'name', atom.name));
    }

    const atomElem = node2elem(atomNode);
    setItem(atomElem, 'description', atom.description);
  }

  public getAtom(name: string): DISGetType.Atom | null {
    this.verifyInit();
    const atomNode = xpath.select1(
      `/ontology/atomDomain/atom[name="${name}"]`,
      this.doc,
    ) as Node;

    if (atomNode === undefined) {
      return null;
    }

    const atomName = (xpath.select1('./name', atomNode) as Node).textContent!;
    const atomDesc = (xpath.select1('./description', atomNode) as Node)
      ?.textContent!;

    return {
      name: atomName,
      description: atomDesc,
    };
  }

  /**
   * Get all atoms in the ontology.
   * @returns all atoms in the ontology
   */
  public getAllAtoms(): DISGetType.Atom[] {
    this.verifyInit();
    const atomNodes = xpath.select(
      '/ontology/atomDomain/atom',
      this.doc,
    ) as Array<Node>;

    return atomNodes.map((atomNode) => {
      const atomName = (xpath.select1('./name', atomNode) as Node).textContent!;
      const atomDesc = (xpath.select1('./description', atomNode) as Node)
        ?.textContent!;

      return {
        name: atomName,
        description: atomDesc,
      };
    });
  }

  /**
   * Check whether an atom exists in the ontology.
   * @param name the name of the atom to check
   * @returns true if the atom exists, false otherwise
   */
  public hasAtom(name: string): boolean {
    const atomNode = xpath.select1(
      `/ontology/atomDomain/atom[name="${name}"]`,
      this.doc,
    );
    return atomNode !== undefined;
  }

  /**
   * Remove an atom from the ontology's atom domain.
   * Noticed: All concepts and rooted graphs related to this atom will be removed.
   * @param name the name of the atom to remove
   */
  public removeAtom(name: string): void {
    this.verifyInit();
    const atomNode = xpath.select1(
      `/ontology/atomDomain/atom[name="${name}"]`,
      this.doc,
    ) as Node;

    if (atomNode !== undefined) {
      atomNode.parentNode!.removeChild(atomNode);
    }

    const concepts = this.getAllConcepts();
    concepts.forEach((concept) => {
      if (concept.latticeOfConcepts.includes(name)) {
        this.removeConcept(concept.name);

        let graphs = this.getAllRootedGraphs();
        graphs.forEach((graph) => {
          if (graph.rootedAt === concept.name) {
            this.removeRootedGraph(graph.name);
          } else if (graph.rootedAt === name) {
            this.removeRootedGraph(graph.name);
          }
        });
        graphs = this.getAllRootedGraphs();
        graphs.forEach((graph) => {
          this.getAllRelations(graph.name).forEach((edge) => {
            if (edge.from === concept.name || edge.to === concept.name) {
              this.removeRelation(edge, graph.name);
            } else if (edge.from === name || edge.to === name) {
              this.removeRelation(edge, graph.name);
            }
          });
        });
      }
    });
  }

  /**
   * Set a concept in the ontology.
   * @param concept the concept to set
   */
  public setConcept(concept: DISSetType.Concept): void {
    this.verifyInit();
    this.checkNameValid(concept.name);

    let conceptNode = xpath.select1(
      `/ontology/concept[name="${concept.name}"]`,
      this.doc,
    ) as Node;

    if (conceptNode === undefined) {
      conceptNode = this.doc.createElement('concept') as Node;
      this.doc.documentElement.appendChild(conceptNode);
      const conceptElem = node2elem(conceptNode);
      conceptElem.appendChild(
        createElementWithText(this.doc, 'name', concept.name),
      );
    }

    concept.latticeOfConcepts.forEach((atomName) => {
      if (!this.hasAtom(atomName)) {
        throw new Error(`Atom ${atomName} does not exist`);
      }
    });

    const conceptElem = node2elem(conceptNode);
    setItem(conceptElem, 'description', concept.description);
    setArrayItem(
      conceptElem,
      'latticeOfConcepts',
      'atom',
      concept.latticeOfConcepts,
    );
  }

  /**
   * Get a concept from the ontology.
   * @param name the name of the concept to get
   * @returns the concept with the name, or null if not found
   */
  public getConcept(name: string): DISGetType.Concept | null {
    this.verifyInit();

    const conceptNode = xpath.select1(
      `/ontology/concept[name="${name}"]`,
      this.doc,
    ) as Node;

    if (conceptNode === undefined) {
      return null;
    }

    const conceptName = (xpath.select1('./name', conceptNode) as Node)
      .textContent!;
    const conceptDesc = (xpath.select1('./description', conceptNode) as Node)
      ?.textContent!;
    const latticeArray = xpath.select(
      './latticeOfConcepts/atom',
      conceptNode,
    ) as Array<Node>;

    const conceptLattice = latticeArray.map((node) => {
      return node.textContent!;
    });

    return {
      name: conceptName,
      description: conceptDesc,
      latticeOfConcepts: conceptLattice,
    };
  }

  /**
   * Get all concepts in the ontology.
   * @returns all concepts in the ontology
   */
  public getAllConcepts(): DISGetType.Concept[] {
    this.verifyInit();

    const conceptNodes = xpath.select(
      '/ontology/concept',
      this.doc,
    ) as Array<Node>;

    return conceptNodes.map((conceptNode) => {
      const conceptName = (xpath.select1('./name', conceptNode) as Node)
        .textContent!;
      const conceptDesc = (xpath.select1('./description', conceptNode) as Node)
        ?.textContent!;
      const latticeArray = xpath.select(
        './latticeOfConcepts/atom',
        conceptNode,
      ) as Array<Node>;

      const conceptLattice = latticeArray.map((node) => {
        return node.textContent!;
      });

      return {
        name: conceptName,
        description: conceptDesc,
        latticeOfConcepts: conceptLattice,
      };
    });
  }

  /**
   * Remove a concept from the ontology.
   * Noticed: All rooted graphs and relations related to this concept will be removed.
   * @param name the name of the concept to remove
   */
  public removeConcept(name: string): void {
    this.verifyInit();

    const conceptNode = xpath.select1(
      `/ontology/concept[name="${name}"]`,
      this.doc,
    ) as Node;

    if (conceptNode !== undefined) {
      conceptNode.parentNode!.removeChild(conceptNode);
    }

    let graphs = this.getAllRootedGraphs();
    graphs.forEach((graph) => {
      if (graph.rootedAt === name) {
        this.removeRootedGraph(graph.name);
      }
    });

    graphs = this.getAllRootedGraphs();
    graphs.forEach((graph) => {
      this.getAllRelations(graph.name).forEach((edge) => {
        if (edge.from === name || edge.to === name) {
          this.removeRelation(edge, graph.name);
        }
      });
    });
  }

  /**
   * Set a virtual concept in the ontology.
   * @param virtualConcept the virtual concept to set
   */
  public setVirtualConcept(virtualConcept: DISSetType.VirtualConcept): void {
    this.verifyInit();
    this.checkNameValid(virtualConcept.name);

    let vcNode = xpath.select1(
      `/ontology/virtualConcept[name="${virtualConcept.name}"]`,
      this.doc,
    ) as Node;

    if (vcNode === undefined) {
      vcNode = this.doc.createElement('virtualConcept') as Node;
      this.doc.documentElement.appendChild(vcNode);
      const vcElem = node2elem(vcNode);
      vcElem.appendChild(
        createElementWithText(this.doc, 'name', virtualConcept.name),
      );
    }

    const vcElem = node2elem(vcNode);
    setItem(vcElem, 'description', virtualConcept.description);
  }

  /**
   * Get a virtual concept from the ontology.
   * @param name the name of the virtual concept to get
   * @returns the virtual concept with the name, or null if not found
   */
  public getVirtualConcept(name: string): DISGetType.VirtualConcept | null {
    this.verifyInit();
    const vcNode = xpath.select1(
      `/ontology/virtualConcept[name="${name}"]`,
      this.doc,
    ) as Node;

    if (vcNode === undefined) {
      return null;
    }

    const vcName = (xpath.select1('./name', vcNode) as Node).textContent!;
    console.log('vcName: ', vcName);
    const vcDesc = (xpath.select1('./description', vcNode) as Node)
      ?.textContent!;
    console.log('vcDesc: ', vcDesc);

    return {
      name: vcName,
      description: vcDesc,
    };
  }

  /**
   * Remove a virtual concept from the ontology.
   * @param name the name of the virtual concept to remove
   */
  public removeVirtualConcept(name: string): void {
    this.verifyInit();

    const virtualConceptNode = xpath.select1(
      `/ontology/virtualConcept[name="${name}"]`,
      this.doc,
    ) as Node;

    if (virtualConceptNode !== undefined) {
      this.doc.removeChild(virtualConceptNode);
    }
  }

  /**
   * Get all virtual concepts in the ontology.
   * @returns all virtual concepts in the ontology
   */
  public getAllVirtualConcepts(): DISGetType.VirtualConcept[] {
    this.verifyInit();

    const virtualConceptNodes = xpath.select(
      '/ontology/virtualConcept',
      this.doc,
    ) as Array<Node>;

    return virtualConceptNodes.map((node) => {
      const vcName = (xpath.select1('./name', node) as Node).textContent!;
      const vcDesc = (xpath.select1('./description', node) as Node)?.textContent!;

      return {
        name: vcName,
        description: vcDesc,
      };
    });
  }

  /**
   * Set a rooted graph in the ontology.
   * If the graph does not exist, it will be created. But the root must exist.
   * Noticed that this function will only set the graph's name, description and root.
   * It will not set the edges. Use setRelation to set edges.
   * @param graph the graph to set
   */
  public setRootedGraph(graph: DISSetType.Graph): void {
    this.verifyInit();
    this.checkNameValid(graph.name);

    let graphNode = xpath.select1(
      `/ontology/graph[name="${graph.name}"]`,
      this.doc,
    ) as Node;

    if (graphNode === undefined) {
      graphNode = this.doc.createElement('graph') as Node;
      this.doc.documentElement.appendChild(graphNode);
      const graphElem = node2elem(graphNode);
      graphElem.appendChild(
        createElementWithText(this.doc, 'name', graph.name),
      );

      if (graph.rootedAt === undefined) {
        throw new Error('While creating rooted graph, it must have a root');
      }
    }

    const graphElem = node2elem(graphNode);
    setItem(graphElem, 'description', graph.description);
    if (
      graph.rootedAt &&
      !this.hasAtom(graph.rootedAt) &&
      !this.getConcept(graph.rootedAt)
    ) {
      throw new Error(
        `Concept or atom concept ${graph.rootedAt} does not exist`,
      );
    }
    setItem(graphElem, 'rootedAt', graph.rootedAt);
  }

  /**
   * Get a rooted graph from the ontology.
   * @param name the name of the rooted graph to get
   * @returns the rooted graph with the name, or null if not found
   */
  public getRootedGraph(name: string): DISGetType.Graph | null {
    this.verifyInit();

    const graphNode = xpath.select1(
      `/ontology/graph[name="${name}"]`,
      this.doc,
    ) as Node;

    if (graphNode === undefined) {
      return null;
    }

    const graphName = (xpath.select1('./name', graphNode) as Node).textContent!;
    const graphDesc = (xpath.select1('./description', graphNode) as Node)
      ?.textContent!;
    const graphRoot = (xpath.select1('./rootedAt', graphNode) as Node)
      ?.textContent!;

    return {
      name: graphName,
      description: graphDesc,
      rootedAt: graphRoot,
    };
  }

  /**
   * Get all rooted graphs in the ontology.
   * @returns all rooted graphs in the ontology
   */
  public getAllRootedGraphs(): DISGetType.Graph[] {
    this.verifyInit();

    const graphNodes = xpath.select('/ontology/graph', this.doc) as Array<Node>;

    return graphNodes.map((graphNode) => {
      const graphName = (xpath.select1('./name', graphNode) as Node)
        .textContent!;
      const graphDesc = (xpath.select1('./description', graphNode) as Node)
        ?.textContent!;
      const graphRoot = (xpath.select1('./rootedAt', graphNode) as Node)
        ?.textContent!;

      return {
        name: graphName,
        description: graphDesc,
        rootedAt: graphRoot,
      };
    });
  }

  /**
   * Remove a rooted graph from the ontology.
   * @param name the name of the rooted graph to remove
   */
  public removeRootedGraph(name: string): void {
    this.verifyInit();

    const graphNode = xpath.select1(
      `/ontology/graph[name="${name}"]`,
      this.doc,
    ) as Node;

    if (graphNode !== undefined) {
      graphNode.parentNode!.removeChild(graphNode);
    }
  }

  /**
   * check whether a node in edge is valid or not
   * @param nodeName the name of the edge node
   */
  private checkEdgeNode(nodeName: string) {
    const n1 = xpath.select1(
      `/ontology/atomDomain/atom[name="${nodeName}"]`,
      this.doc,
    ) as Node;

    const n2 = xpath.select1(
      `/ontology/concept[name="${nodeName}"]`,
      this.doc,
    ) as Node;

    const n3 = xpath.select1(
      `/ontology/virtualConcept[name="${nodeName}"]`,
      this.doc,
    ) as Node;

    if (n1 === undefined && n2 === undefined && n3 === undefined) {
      throw new Error(
        `Edge node ${nodeName} is not a concept, a virtual concept or an atom`,
      );
    }
  }

  /**
   * Set a relation in a rooted graph.
   * @param edge the edge to set
   * @param graphName the name of the rooted graph
   */
  public setRelation(edge: DISSetType.Edge, graphName: string): void {
    this.verifyInit();
    const graphNode = xpath.select1(
      `/ontology/graph[name="${graphName}"]`,
      this.doc,
    ) as Node;

    if (graphNode === undefined) {
      throw new Error(`Graph ${graphName} does not exist`);
    }

    let edgeNode = xpath.select1(
      `./edge[from="${edge.from}" and to="${edge.to}" and @relation="${edge.relation}"]`,
      graphNode,
    ) as Node;

    if (edgeNode === undefined) {
      const graphElem = node2elem(graphNode);
      const edgeElem = this.doc.createElement('edge');

      edgeElem.setAttribute('relation', edge.relation);
      this.checkEdgeNode(edge.from);
      setItem(edgeElem, 'from', edge.from);
      this.checkEdgeNode(edge.to);
      setItem(edgeElem, 'to', edge.to);
      graphElem.appendChild(edgeElem);
      edgeNode = edgeElem;
    }

    const edgeElem = node2elem(edgeNode);
    setItem(edgeElem, 'predicate', edge.predicate);
  }

  /**
   * Get a relation from a rooted graph.
   * @param edge the edge to get
   * @param graphName the name of the rooted graph
   * @returns the edge with the relation, or null if not found
   */
  public getRelation(
    edge: DISGetType.Edge,
    graphName: string,
  ): DISGetType.Edge | null {
    this.verifyInit();
    const graphNode = xpath.select1(
      `/ontology/graph[name="${graphName}"]`,
      this.doc,
    ) as Node;

    if (graphNode === undefined) {
      return null;
    }

    const edgeNode = xpath.select1(
      `./edge[from="${edge.from}" and to="${edge.to}" and @relation="${edge.relation}"]`,
      graphNode,
    ) as Node;

    if (edgeNode === undefined) {
      return null;
    }

    const edgeElem = node2elem(edgeNode);
    const edgeFrom = (xpath.select1('./from', edgeNode) as Node).textContent!;
    const edgeTo = (xpath.select1('./to', edgeNode) as Node).textContent!;
    const edgePred = (xpath.select1('./predicate', edgeNode) as Node)
      ?.textContent!;

    return {
      from: edgeFrom,
      to: edgeTo,
      predicate: edgePred,
      relation: edgeElem.getAttribute('relation')!,
    };
  }

  /**
   * Remove a relation from a rooted graph.
   * @param edge the edge to remove
   * @param graphName the name of the rooted graph
   */
  public removeRelation(edge: DISSetType.Edge, graphName: string) {
    const relationNode = xpath.select1(
      `/ontology/graph[name="${graphName}"]/edge[from="${edge.from}" and to="${edge.to}" and @relation="${edge.relation}"]`,
      this.doc,
    ) as Node;

    if (relationNode !== undefined) {
      relationNode.parentNode!.removeChild(relationNode);
    }
  }

  /**
   * Get all relations in a rooted graph.
   * @param graphName the name of the rooted graph
   * @returns all relations in the rooted graph
   */
  public getAllRelations(graphName: string): DISGetType.Edge[] {
    this.verifyInit();
    const graphNode = xpath.select1(
      `/ontology/graph[name="${graphName}"]`,
      this.doc,
    ) as Node;

    if (graphNode === undefined) {
      return [];
    }

    const edgeNodes = xpath.select('./edge', graphNode) as Array<Node>;

    return edgeNodes.map((edgeNode) => {
      const edgeElem = node2elem(edgeNode);
      const edgeFrom = (xpath.select1('./from', edgeNode) as Node).textContent!;
      const edgeTo = (xpath.select1('./to', edgeNode) as Node).textContent!;
      const edgePred = (xpath.select1('./predicate', edgeNode) as Node)
        ?.textContent!;

      return {
        from: edgeFrom,
        to: edgeTo,
        predicate: edgePred,
        relation: edgeElem.getAttribute('relation')!,
      };
    });
  }

  // private getAllAtoms(): DISAtom[] {}
}

export default DISOntology;
