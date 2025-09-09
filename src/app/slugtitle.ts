import slugify from 'slugify';

export function slugTitle(index: string, title: string): string {
  const baseString = `${index}-${slugify(title.toLowerCase())}`
    .split('"')
    .join('');
  if (baseString.match(/^.+(\.)$/)) {
    return baseString.substring(0, baseString.length - 1);
  }
  return baseString;
}
