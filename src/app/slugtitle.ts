import slugify from 'slugify';

export function slugTitle(index: string, title?: string): string {
  let baseString = index;
  if (title) {
    baseString = `${index}-${slugify(title.toLowerCase())}`;
  }

  baseString = baseString.split('"').join('');
  if (baseString.match(/^.+(\.)$/)) {
    return baseString.substring(0, baseString.length - 1);
  }
  return baseString;
}
