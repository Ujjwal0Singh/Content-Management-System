import ReactMarkdown from "react-markdown";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

function HeaderBlock({ data }) {
  const Tag = `h${data.level || 2}`;
  const sizes = { 1: "text-4xl", 2: "text-3xl", 3: "text-2xl", 4: "text-xl" };
  return <Tag className={`${sizes[data.level] || "text-2xl"} font-bold mb-4`}>{data.text}</Tag>;
}

function TextBlock({ data }) {
  return (
    <div className="prose max-w-none mb-4">
      <ReactMarkdown>{data.content}</ReactMarkdown>
    </div>
  );
}

function ListItems({ items, style }) {
  const Tag = style === "ordered" ? "ol" : "ul";
  return (
    <Tag className={style === "ordered" ? "list-decimal ml-6" : "list-disc ml-6"}>
      {items.map((item, idx) => (
        <li key={idx} className="mb-1">
          {item.text}
          {item.items?.length > 0 && <ListItems items={item.items} style={style} />}
        </li>
      ))}
    </Tag>
  );
}

function ListBlock({ data }) {
  return (
    <div className="mb-4">
      <ListItems items={data.items} style={data.style} />
    </div>
  );
}

function TableBlock({ data }) {
  return (
    <div className="overflow-x-auto mb-4">
      <table className="w-full border-collapse border border-slate-200 text-sm">
        <thead className="bg-slate-100">
          <tr>
            {data.headers.map((h, idx) => (
              <th key={idx} className="border border-slate-200 p-2 text-left font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, r) => (
            <tr key={r}>
              {row.map((cell, c) => (
                <td key={c} className="border border-slate-200 p-2">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MathBlock({ data }) {
  return (
    <div className="mb-4">
      {data.display ? <BlockMath math={data.latex} /> : <InlineMath math={data.latex} />}
    </div>
  );
}

function ImageBlock({ data }) {
  if (!data.url) return null;
  return (
    <div className="mb-4">
      <img src={data.url} alt={data.alt || ""} className="rounded-lg max-w-full" />
    </div>
  );
}

const RENDERERS = {
  header: HeaderBlock,
  text: TextBlock,
  list: ListBlock,
  table: TableBlock,
  math: MathBlock,
  image: ImageBlock,
};

export default function BlockRenderer({ blocks }) {
  if (!blocks?.length) return <p className="text-slate-400">No content yet.</p>;
  return (
    <div>
      {blocks.map((block, idx) => {
        const Renderer = RENDERERS[block.type];
        if (!Renderer) return null;
        return <Renderer key={block._id || idx} data={block.data} />;
      })}
    </div>
  );
}
