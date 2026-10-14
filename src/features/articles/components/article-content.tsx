import { PageLink as Link } from "@/components/ui/page-link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { ArticleContentBlock, InlinePart } from "../article.types";

function InlineParts({ parts }: { parts: InlinePart[] }) {
  return (
    <>
      {parts.map((part, index) => {
        if (part.type === "link") {
          const external = part.external ?? part.href.startsWith("http");
          if (external) {
            return (
              <a
                key={`${part.href}-${index}`}
                href={part.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                {part.value}
              </a>
            );
          }
          return (
            <Link
              key={`${part.href}-${index}`}
              href={part.href}
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              {part.value}
            </Link>
          );
        }
        return <span key={index}>{part.value}</span>;
      })}
    </>
  );
}

type ArticleContentProps = {
  blocks: ArticleContentBlock[];
};

export function ArticleContent({ blocks }: ArticleContentProps) {
  return (
    <div className="article-prose">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "heading": {
            const Tag = block.level === 2 ? "h2" : block.level === 3 ? "h3" : "h4";
            return (
              <Tag key={block.id} id={block.id} className="article-heading scroll-mt-28">
                {block.text}
              </Tag>
            );
          }
          case "paragraph":
            return (
              <p key={index}>
                <InlineParts parts={block.parts} />
              </p>
            );
          case "list":
            return block.ordered ? (
              <ol key={index}>
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            ) : (
              <ul key={index}>
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            );
          case "image":
            return (
              <figure key={index} className="article-figure">
                <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-border">
                  <Image
                    src={block.src}
                    alt={block.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 672px"
                    className="object-cover"
                  />
                </div>
                {block.caption ? (
                  <figcaption className="mt-2 text-caption">{block.caption}</figcaption>
                ) : null}
              </figure>
            );
          case "quote":
            return (
              <blockquote key={index}>
                <p>{block.text}</p>
                {block.attribution ? (
                  <footer className="mt-2 text-sm text-muted">— {block.attribution}</footer>
                ) : null}
              </blockquote>
            );
          case "callout":
            return (
              <aside
                key={index}
                className={cn(
                  "rounded-2xl border p-4 sm:p-5",
                  block.variant === "highlight" &&
                    "border-secondary/30 bg-secondary/5",
                  block.variant === "info" &&
                    "border-primary/20 bg-primary/5",
                  block.variant === "warning" &&
                    "border-warning/40 bg-warning/10",
                )}
                role="note"
              >
                {block.title ? (
                  <p className="font-semibold text-foreground">{block.title}</p>
                ) : null}
                <p className={cn("text-sm leading-relaxed", block.title && "mt-2")}>
                  <InlineParts parts={block.parts} />
                </p>
              </aside>
            );
          case "table":
            return (
              <figure key={index} className="article-table-wrap">
                <div className="overflow-x-auto rounded-2xl border border-border">
                  <table>
                    <thead>
                      <tr>
                        {block.headers.map((header) => (
                          <th key={header} scope="col">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {block.rows.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {row.map((cell, cellIndex) => (
                            <td key={cellIndex}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {block.caption ? (
                  <figcaption className="mt-2 text-caption">{block.caption}</figcaption>
                ) : null}
              </figure>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
