// import { DISOntology } from './ontology';

// class DISManager {
//   public loadOntologyFromString(str: string): DISOntology {
//     const dom = new DOMParser().parseFromString(str, 'text/xml');
//     const onto = new DISOntology();
//     onto.setName('test');

//     return onto;
//   }

//   public createOntology(name: string): DISOntology {
//     return new DISManager();
//   }

//   private check(): boolean {
//     const root = this.doc.documentElement;
//     if (root.nodeName !== 'discore') {
//       throw new Error('root node is not discore');
//     }

//     return false;
//   }

//   public addAtom(name: string): void {
//     const root = this.doc.documentElement;
//     const atom = this.doc.createElement('atom');
//     atom.setAttribute('name', name);
//     root.appendChild(atom);
//   }
// }
