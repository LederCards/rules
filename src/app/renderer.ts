import * as marked from 'marked';
import { convert as toRoman } from 'roman-numeral';
import { slugTitle } from 'src/app/slugtitle';

// TODO: arcs: https://github.com/Vagabottos/arcs/commit/d8bd489460fd936e181cea25c5ebabc595a09588
// TODO: arcs: https://github.com/Vagabottos/arcs/commit/6dfed7334e4d0d64e056e84372563dede444d83b
// TODO: faction icon refs

export function getCustomRenderer(allRules: any[]): marked.Renderer {
  const renderer = new marked.Renderer();

  // custom inline image formatter
  renderer.codespan = (codespan: marked.Tokens.Codespan) => {
    const text = codespan.toString();

    if (text.includes(':')) {
      const [type, subtype, extra] = text.split(':');

      if (type === 'rule') {
        const [major, minor, child, desc, descDesc] = subtype.split('.');
        let chosenNode = null;
        let chosenString = '';

        if (major) {
          chosenString += major;
          chosenNode = allRules[+major - 1];
        }

        if (minor && chosenNode && chosenNode.children) {
          chosenString += `.${minor}`;
          chosenNode = chosenNode.children[+minor - 1];
        }

        if (child && chosenNode && chosenNode.children) {
          chosenString += `.${child}`;
          chosenNode = chosenNode.children[+child - 1];
        }

        if (desc && chosenNode && chosenNode.subchildren) {
          chosenString += `.${toRoman(desc)}`;
          chosenNode = chosenNode.subchildren[+desc - 1];
        }

        if (descDesc && chosenNode && chosenNode.subchildren) {
          chosenString += `${String.fromCharCode(+descDesc + 96)}`;
          chosenNode = chosenNode.subchildren[+descDesc - 1];
        }

        if (!chosenNode) {
          return `<span class="error">Not Found: ${subtype}</span>`;
        }

        return `<a href="#${slugTitle(
          subtype,
          chosenNode.name
        )}" class="rule-link">${chosenString}</a>`;
      }

      /*
      if (type === 'faction') {
        return `
            <a href="#${this.indexRuleHash[extra]}">
              <img src="assets/inicon/${type}-${subtype}.png" class="inline-icon" />
            </a>
          `;
      }
      */

      return `<img src="assets/inicon/${type}-${subtype}.png" class="inline-icon" />`;
    }

    return `<pre>${text}</pre>`;
  };

  renderer.strong = (text: marked.Tokens.Strong) =>
    `<strong class="emph">${text}</strong>`;

  // no paragraphs
  renderer.paragraph = (text: marked.Tokens.Paragraph) => `${text}`;

  return renderer;
}
