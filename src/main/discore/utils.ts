function getElementByTag(doc: Document, tag: string): Element | null {
  const elems = doc.getElementsByTagName(tag);
  if (elems.length === 0) {
    return null;
  }
  if (elems.length > 1) {
    throw new Error(`multiple elements with tag ${tag}`);
  }

  return elems[0];
}

function node2elem(node: Node): Element {
  if (node.nodeType !== Node.ELEMENT_NODE) {
    throw new Error('node is not element');
  }

  return node as Element;
}

function createElementWithText(
  doc: Document,
  tag: string,
  text: string,
): Element {
  const elem = doc.createElement(tag);
  elem.textContent = text;
  return elem;
}

export { getElementByTag, node2elem, createElementWithText };
