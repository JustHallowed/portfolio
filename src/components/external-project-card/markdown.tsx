import { Fragment, ReactNode } from 'react';
import { isVideoUrl, ProjectScreenshot, ProjectVideo } from './media';

/**
 * A small Markdown renderer for project write-ups. Supports headings (#–####),
 * horizontal rules (---), nested bullet and numbered lists, paragraphs, and
 * inline **bold**, *italic*, `code` and [links](https://...).
 *
 * A line containing only ![caption](url) embeds media: YouTube links and video
 * files (.mp4, .webm, ...) become players, anything else is shown as an image.
 * Consecutive images are laid out in a grid. Relative paths such as
 * `catasite-1.png` point at files in the `public/` folder.
 *
 * Unlike standard Markdown, a single line break is kept as a line break, so
 * text displays the way it is written. A blank line starts a new paragraph.
 */

type ListBlock = {
  ordered: boolean;
  start: number;
  items: { text: string; children: ListBlock | null }[];
};

type Block =
  | { type: 'heading'; level: number; text: string }
  | { type: 'rule' }
  | { type: 'list'; list: ListBlock }
  | { type: 'media'; items: { alt: string; url: string }[] }
  | { type: 'paragraph'; lines: string[] };

const HEADING = /^(#{1,4})\s+(.*)$/;
const RULE = /^\s*(-{3,}|\*{3,}|_{3,})\s*$/;
const LIST_ITEM = /^(\s*)([-*+]|\d+[.)])\s+(.*)$/;
const MEDIA = /^\s*!\[([^\]]*)\]\(([^)\s]+)\)\s*$/;

// Resolve paths like `shot.png` against the site's base path, so files in
// `public/` work whatever `base` is set to
const resolveUrl = (url: string): string =>
  /^([a-z][a-z\d+.-]*:|\/)/i.test(url)
    ? url
    : `${import.meta.env.BASE_URL}${url.replace(/^\.\//, '')}`;

const parseBlocks = (markdown: string): Block[] => {
  const lines = markdown.replace(/\r\n?/g, '\n').split('\n');
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trimEnd();

    if (!line.trim()) {
      i++;
      continue;
    }

    const heading = line.match(HEADING);
    if (heading) {
      blocks.push({
        type: 'heading',
        level: heading[1].length,
        text: heading[2],
      });
      i++;
      continue;
    }

    if (MEDIA.test(line)) {
      const items: { alt: string; url: string }[] = [];
      let media: RegExpMatchArray | null;
      while (i < lines.length && (media = lines[i].match(MEDIA))) {
        if (!/^\s*javascript:/i.test(media[2])) {
          items.push({ alt: media[1], url: resolveUrl(media[2]) });
        }
        i++;
      }
      blocks.push({ type: 'media', items });
      continue;
    }

    if (RULE.test(line)) {
      blocks.push({ type: 'rule' });
      i++;
      continue;
    }

    if (LIST_ITEM.test(line)) {
      const root: ListBlock = { ordered: false, start: 1, items: [] };
      const stack: { indent: number; list: ListBlock }[] = [];

      while (i < lines.length) {
        const current = lines[i].trimEnd();
        const item = current.match(LIST_ITEM);

        if (item) {
          const indent = item[1].length;
          const ordered = /\d/.test(item[2]);

          if (stack.length === 0) {
            root.ordered = ordered;
            root.start = ordered ? parseInt(item[2], 10) : 1;
            stack.push({ indent, list: root });
          } else {
            while (stack.length > 1 && indent < stack[stack.length - 1].indent) {
              stack.pop();
            }

            const top = stack[stack.length - 1];
            const parent = top.list.items[top.list.items.length - 1];
            if (indent > top.indent && parent) {
              parent.children = {
                ordered,
                start: ordered ? parseInt(item[2], 10) : 1,
                items: [],
              };
              stack.push({ indent, list: parent.children });
            }
          }

          stack[stack.length - 1].list.items.push({
            text: item[3],
            children: null,
          });
          i++;
        } else if (current.trim() && /^\s/.test(current)) {
          // An indented line that isn't a new item continues the previous one
          const top = stack[stack.length - 1].list;
          top.items[top.items.length - 1].text += ` ${current.trim()}`;
          i++;
        } else {
          break;
        }
      }

      blocks.push({ type: 'list', list: root });
      continue;
    }

    const paragraph: string[] = [];
    while (i < lines.length) {
      const current = lines[i].trimEnd();
      if (
        !current.trim() ||
        HEADING.test(current) ||
        RULE.test(current) ||
        LIST_ITEM.test(current) ||
        MEDIA.test(current)
      ) {
        break;
      }
      paragraph.push(current.trim());
      i++;
    }
    blocks.push({ type: 'paragraph', lines: paragraph });
  }

  return blocks;
};

const INLINE =
  /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)\s]+\)|\*[^*\s][^*]*\*)/g;

const renderInline = (text: string): ReactNode[] =>
  text.split(INLINE).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return <strong key={index}>{renderInline(part.slice(2, -2))}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return (
        <code
          key={index}
          className="bg-base-200 rounded px-1 py-0.5 font-mono text-[0.9em]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
    if (link && !/^\s*javascript:/i.test(link[2])) {
      return (
        <a
          key={index}
          className="link link-primary"
          href={link[2]}
          target="_blank"
          rel="noreferrer"
        >
          {renderInline(link[1])}
        </a>
      );
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return <em key={index}>{renderInline(part.slice(1, -1))}</em>;
    }
    return part;
  });

const renderList = (list: ListBlock, nested = false): ReactNode => {
  const items = list.items.map((item, index) => (
    <li key={index}>
      {renderInline(item.text)}
      {item.children && renderList(item.children, true)}
    </li>
  ));
  const className = `${list.ordered ? 'list-decimal' : 'list-disc'} pl-5 space-y-1 ${nested ? 'mt-1' : ''}`;

  return list.ordered ? (
    <ol className={className} start={list.start}>
      {items}
    </ol>
  ) : (
    <ul className={className}>{items}</ul>
  );
};

const renderMedia = (items: { alt: string; url: string }[]): ReactNode[] => {
  // Group runs of images into grids; each video gets its own row
  const groups: { video: boolean; items: { alt: string; url: string }[] }[] =
    [];
  items.forEach((item) => {
    const video = isVideoUrl(item.url);
    const last = groups[groups.length - 1];
    if (!video && last && !last.video) {
      last.items.push(item);
    } else {
      groups.push({ video, items: [item] });
    }
  });

  return groups.map((group, index) =>
    group.video ? (
      <ProjectVideo
        key={index}
        url={group.items[0].url}
        title={group.items[0].alt || 'Video'}
      />
    ) : (
      <div
        key={index}
        className={`grid gap-4 ${group.items.length > 1 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}
      >
        {group.items.map((item, i) => (
          <figure key={i}>
            <ProjectScreenshot url={item.url} alt={item.alt} />
            {item.alt && (
              <figcaption className="mt-1 text-center text-xs opacity-60">
                {item.alt}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    ),
  );
};

const HEADING_CLASSES: Record<number, string> = {
  1: 'text-xl font-bold pt-2',
  2: 'text-lg font-bold pt-2',
  3: 'text-base font-semibold pt-1',
  4: 'text-base font-semibold opacity-80',
};

const Markdown = ({ children }: { children: string }) => (
  <div className="space-y-3 text-base-content text-sm sm:text-base leading-relaxed">
    {parseBlocks(children).map((block, index) => {
      switch (block.type) {
        case 'heading': {
          const Tag = `h${block.level + 2}` as 'h3' | 'h4' | 'h5' | 'h6';
          return (
            <Tag key={index} className={HEADING_CLASSES[block.level]}>
              {renderInline(block.text)}
            </Tag>
          );
        }
        case 'media':
          return (
            <div key={index} className="space-y-4 py-1">
              {renderMedia(block.items)}
            </div>
          );
        case 'rule':
          return <hr key={index} className="border-base-300 my-4" />;
        case 'list':
          return <Fragment key={index}>{renderList(block.list)}</Fragment>;
        case 'paragraph':
          return (
            <p key={index}>
              {block.lines.map((line, i) => (
                <Fragment key={i}>
                  {i > 0 && <br />}
                  {renderInline(line)}
                </Fragment>
              ))}
            </p>
          );
      }
    })}
  </div>
);

export default Markdown;
