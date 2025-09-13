import * as marked from 'marked';
import { convert as toRoman } from 'roman-numeral';
import { type GameRule } from 'src/app/interfaces';
import { slugTitle } from 'src/app/slugtitle';

export function getCustomRenderer(
  allRules: GameRule[],
  indexRuleHash: Record<string, string>,
): marked.Renderer {
  const renderer = new marked.Renderer();
  const parser = new marked.Parser({ renderer });

  // custom inline image formatter
  renderer.codespan = (codespan: marked.Tokens.Codespan) => {
    const text = codespan.text;

    if (text.includes(':')) {
      const [type, subtype] = text.split(':');

      if (type === 'rule') {
        const [major, minor, child, desc, descDesc] = subtype.split('.');
        let chosenNode = null;
        let chosenString = '';

        if (major) {
          chosenNode = allRules[+major - 1];
          chosenString += chosenNode?.appendix || major;
        }

        if (minor && chosenNode && chosenNode.children) {
          chosenString += `.${minor}`;
          chosenNode = chosenNode.children[+minor - 1];
        }

        if (child && chosenNode && chosenNode.children) {
          chosenString += `.${child}`;
          chosenNode = chosenNode.children[+child - 1];
        }

        if (desc && chosenNode && chosenNode.children) {
          chosenString += `.${toRoman(desc)}`;
          chosenNode = chosenNode.children[+desc - 1];
        }

        if (descDesc && chosenNode && chosenNode.children) {
          chosenString += `${String.fromCharCode(+descDesc + 96)}`;
          chosenNode = chosenNode.children[+descDesc - 1];
        }

        if (!chosenNode) {
          return `<span class="error">Not Found: ${subtype}</span>`;
        }

        return `<a href="#${slugTitle(
          subtype,
          chosenNode.name,
        )}" class="rule-link">${chosenString}</a>`;
      }

      if (type === 'rule-relative') {
        const [major, minor, child, desc, descDesc] = subtype.split('$');
        let chosenNode = null;
        let chosenIdx = -1;
        let chosenString = '';
        let derivedRuleSubtype = '';

        if (major) {
          let found = false;
          for (const [idx, candidateNode] of allRules.entries()) {
            if (major === candidateNode.name) {
              chosenNode = candidateNode;
              chosenIdx = idx;
              found = true;
              break;
            }
          }
          if (!found) {
            return `<span class="error">Not Found: ${subtype}</span>`;
          }
          chosenString += `${chosenIdx + 1}`;
          derivedRuleSubtype += `${chosenIdx + 1}`;
        }

        if (minor && chosenNode && chosenNode.children) {
          let found = false;
          for (const [idx, candidateNode] of chosenNode.children.entries()) {
            if (minor === candidateNode.name) {
              chosenNode = candidateNode;
              chosenIdx = idx;
              found = true;
              break;
            }
          }
          if (!found) {
            return `<span class="error">Not Found: ${subtype}</span>`;
          }
          chosenString += `.${chosenIdx + 1}`;
          derivedRuleSubtype += `.${chosenIdx + 1}`;
        }

        if (child && chosenNode && chosenNode.children) {
          let found = false;
          for (const [idx, candidateNode] of chosenNode.children.entries()) {
            if (child === candidateNode.name) {
              chosenNode = candidateNode;
              chosenIdx = idx;
              found = true;
              break;
            }
          }
          if (!found) {
            return `<span class="error">Not Found: ${subtype}</span>`;
          }
          chosenString += `.${chosenIdx + 1}`;
          derivedRuleSubtype += `.${chosenIdx + 1}`;
        }

        if (desc && chosenNode && chosenNode.children) {
          let found = false;
          for (const [idx, candidateNode] of chosenNode.children.entries()) {
            if (desc === candidateNode.name) {
              chosenNode = candidateNode;
              chosenIdx = idx;
              found = true;
              break;
            }
          }
          if (!found) {
            return `<span class="error">Not Found: ${subtype}</span>`;
          }
          chosenString += `.${toRoman(chosenIdx + 1)}`;
          derivedRuleSubtype += `.${chosenIdx + 1}`;
        }

        if (descDesc && chosenNode && chosenNode.children) {
          let found = false;
          for (const [idx, candidateNode] of chosenNode.children.entries()) {
            if (descDesc === candidateNode.name) {
              chosenNode = candidateNode;
              chosenIdx = idx;
              found = true;
              break;
            }
          }
          if (!found) {
            return `<span class="error">Not Found: ${subtype}</span>`;
          }
          chosenString += `${String.fromCharCode(chosenIdx + 1 + 96)}`;
          derivedRuleSubtype += `.${chosenIdx + 1}`;
        }

        if (!chosenNode) {
          return `<span class="error">Not Found: ${subtype}</span>`;
        }

        // For some reason, linking to top-level rules requires a trailing period.
        if (!derivedRuleSubtype.includes('.')) {
          derivedRuleSubtype += '.';
        }

        return `<a href="#${slugTitle(
          derivedRuleSubtype,
          chosenNode.name,
        )}" class="rule-link">${chosenString}</a>`;
      }

      if (type === 'faction') {
        const [icon, extra] = subtype.split('$');
        return `
            <a href="#${indexRuleHash[extra]}">
              <img src="inicon/${type}-${icon}.png" class="inline-icon" />
            </a>
          `;
      }

      return `<img src="inicon/${type}-${subtype}.png" class="inline-icon" />`;
    }

    return `<pre>${text}</pre>`;
  };

  renderer.blockquote = (blockquote: marked.Tokens.Blockquote) =>
    `<div class="specialhighlight">${parser.parse(blockquote.tokens)}</div>`;

  renderer.strong = (strong: marked.Tokens.Strong) =>
    `${parser.parseInline(strong.tokens)}`;

  renderer.paragraph = (paragraph: marked.Tokens.Paragraph) =>
    `${parser.parseInline(paragraph.tokens)}`;

  return renderer;
}
