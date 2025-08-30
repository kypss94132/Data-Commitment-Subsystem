//parses predicate expressions

function extractContent(text) {
    let start = text.indexOf("[CDATA[");
    let end = text.lastIndexOf("]]");
    if (start !== -1 && end !== -1 && end > start) {
      return text.substring(start + 7, end - 1).trim();
    }
    return text.trim();
  }
  
  function extractPredicateParts(extractedContent) {
    const match = extractedContent.match(/^(.+?)\s*([><=!]+)\s*(.+)$/);
    if (match) {
      return {
        leftOperand: match[1].trim(),
        operator: match[2].trim(),
        rightOperand: match[3].trim(),
      };
    }
    return { leftOperand: null, operator: null, rightOperand: null };
  }
  
  module.exports = {
    extractContent,
    extractPredicateParts,
  };
  