import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

const BLOCK_DEFAULTS = {
  header: { text: "New heading", level: 2 },
  text: { content: "Write some text here. Supports **markdown**." },
  list: { style: "unordered", items: [{ text: "First item", items: [] }] },
  table: { headers: ["Column 1", "Column 2"], rows: [["", ""]] },
  math: { latex: "E = mc^2", display: true },
  image: { url: "", alt: "" },
};

export function newBlock(type) {
  return { type, data: structuredClone(BLOCK_DEFAULTS[type]), order: 0 };
}

function HeaderBlockForm({ data, onChange }) {
  return (
    <div className="grid grid-cols-4 gap-3">
      <input
        className="col-span-3 border rounded-md px-3 py-2"
        value={data.text}
        onChange={(e) => onChange({ ...data, text: e.target.value })}
        placeholder="Heading text"
      />
      <select
        className="border rounded-md px-2 py-2"
        value={data.level}
        onChange={(e) => onChange({ ...data, level: Number(e.target.value) })}
      >
        {[1, 2, 3, 4].map((lvl) => (
          <option key={lvl} value={lvl}>H{lvl}</option>
        ))}
      </select>
    </div>
  );
}

function TextBlockForm({ data, onChange }) {
  return (
    <textarea
      className="w-full border rounded-md px-3 py-2 min-h-[120px]"
      value={data.content}
      onChange={(e) => onChange({ ...data, content: e.target.value })}
      placeholder="Markdown supported: **bold**, *italic*, lists, etc."
    />
  );
}

function ListItemEditor({ item, path, updateItem, removeItem, addChild }) {
  return (
    <div className="ml-4 border-l pl-3 my-1">
      <div className="flex items-center gap-2">
        <input
          className="flex-1 border rounded-md px-2 py-1 text-sm"
          value={item.text}
          onChange={(e) => updateItem(path, { ...item, text: e.target.value })}
        />
        <button type="button" className="text-xs text-indigo-600" onClick={() => addChild(path)}>
          + nested
        </button>
        <button type="button" className="text-xs text-red-500" onClick={() => removeItem(path)}>
          remove
        </button>
      </div>
      {item.items?.map((child, idx) => (
        <ListItemEditor
          key={idx}
          item={child}
          path={[...path, idx]}
          updateItem={updateItem}
          removeItem={removeItem}
          addChild={addChild}
        />
      ))}
    </div>
  );
}

function ListBlockForm({ data, onChange }) {
  const updateItem = (path, newItem) => {
    const items = structuredClone(data.items);
    let target = items;
    for (let i = 0; i < path.length - 1; i++) target = target[path[i]].items;
    target[path[path.length - 1]] = newItem;
    onChange({ ...data, items });
  };

  const removeItem = (path) => {
    const items = structuredClone(data.items);
    let target = items;
    for (let i = 0; i < path.length - 1; i++) target = target[path[i]].items;
    target.splice(path[path.length - 1], 1);
    onChange({ ...data, items });
  };

  const addChild = (path) => {
    const items = structuredClone(data.items);
    let target = items;
    for (let i = 0; i < path.length; i++) {
      if (i === path.length - 1) target = target[path[i]].items;
      else target = target[path[i]].items;
    }
    target.push({ text: "New nested item", items: [] });
    onChange({ ...data, items });
  };

  const addTopLevel = () => {
    onChange({ ...data, items: [...data.items, { text: "New item", items: [] }] });
  };

  return (
    <div>
      <select
        className="border rounded-md px-2 py-1 text-sm mb-2"
        value={data.style}
        onChange={(e) => onChange({ ...data, style: e.target.value })}
      >
        <option value="unordered">Bulleted</option>
        <option value="ordered">Numbered</option>
      </select>
      {data.items.map((item, idx) => (
        <ListItemEditor
          key={idx}
          item={item}
          path={[idx]}
          updateItem={updateItem}
          removeItem={removeItem}
          addChild={addChild}
        />
      ))}
      <button type="button" onClick={addTopLevel} className="text-xs text-indigo-600 mt-2">
        + add item
      </button>
    </div>
  );
}

function TableBlockForm({ data, onChange }) {
  const updateHeader = (idx, value) => {
    const headers = [...data.headers];
    headers[idx] = value;
    onChange({ ...data, headers });
  };

  const updateCell = (r, c, value) => {
    const rows = data.rows.map((row) => [...row]);
    rows[r][c] = value;
    onChange({ ...data, rows });
  };

  const addColumn = () => {
    const headers = [...data.headers, `Column ${data.headers.length + 1}`];
    const rows = data.rows.map((row) => [...row, ""]);
    onChange({ ...data, headers, rows });
  };

  const addRow = () => {
    onChange({ ...data, rows: [...data.rows, data.headers.map(() => "")] });
  };

  const removeRow = (idx) => {
    onChange({ ...data, rows: data.rows.filter((_, i) => i !== idx) });
  };

  return (
    <div className="overflow-x-auto">
      <table className="border-collapse w-full text-sm">
        <thead>
          <tr>
            {data.headers.map((h, idx) => (
              <th key={idx} className="border p-1">
                <input
                  className="w-full px-1 py-0.5 font-semibold"
                  value={h}
                  onChange={(e) => updateHeader(idx, e.target.value)}
                />
              </th>
            ))}
            <th className="border p-1 w-8"></th>
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, r) => (
            <tr key={r}>
              {row.map((cell, c) => (
                <td key={c} className="border p-1">
                  <input
                    className="w-full px-1 py-0.5"
                    value={cell}
                    onChange={(e) => updateCell(r, c, e.target.value)}
                  />
                </td>
              ))}
              <td className="border p-1 text-center">
                <button type="button" className="text-red-500 text-xs" onClick={() => removeRow(r)}>
                  x
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex gap-3 mt-2">
        <button type="button" className="text-xs text-indigo-600" onClick={addColumn}>+ column</button>
        <button type="button" className="text-xs text-indigo-600" onClick={addRow}>+ row</button>
      </div>
    </div>
  );
}

function MathBlockForm({ data, onChange }) {
  return (
    <div>
      <input
        className="w-full border rounded-md px-3 py-2 font-mono text-sm"
        value={data.latex}
        onChange={(e) => onChange({ ...data, latex: e.target.value })}
        placeholder="LaTeX, e.g. \\int_0^1 x^2 dx"
      />
      <label className="flex items-center gap-2 text-xs mt-2">
        <input
          type="checkbox"
          checked={data.display}
          onChange={(e) => onChange({ ...data, display: e.target.checked })}
        />
        Block (display) mode
      </label>
      <div className="mt-3 p-3 bg-slate-50 rounded-md">
        {data.display ? <BlockMath math={data.latex || " "} /> : <InlineMath math={data.latex || " "} />}
      </div>
    </div>
  );
}

function ImageBlockForm({ data, onChange }) {
  return (
    <div className="grid gap-2">
      <input
        className="border rounded-md px-3 py-2"
        value={data.url}
        onChange={(e) => onChange({ ...data, url: e.target.value })}
        placeholder="Image URL"
      />
      <input
        className="border rounded-md px-3 py-2"
        value={data.alt}
        onChange={(e) => onChange({ ...data, alt: e.target.value })}
        placeholder="Alt text"
      />
      {data.url && <img src={data.url} alt={data.alt} className="max-h-40 rounded-md border" />}
    </div>
  );
}

const FORMS = {
  header: HeaderBlockForm,
  text: TextBlockForm,
  list: ListBlockForm,
  table: TableBlockForm,
  math: MathBlockForm,
  image: ImageBlockForm,
};

export default function BlockEditor({ blocks, onChange }) {
  const setBlockData = (idx, data) => {
    const next = [...blocks];
    next[idx] = { ...next[idx], data };
    onChange(next);
  };

  const removeBlock = (idx) => onChange(blocks.filter((_, i) => i !== idx));

  const moveBlock = (idx, dir) => {
    const target = idx + dir;
    if (target < 0 || target >= blocks.length) return;
    const next = [...blocks];
    [next[idx], next[target]] = [next[target], next[idx]];
    onChange(next);
  };

  const addBlock = (type) => onChange([...blocks, newBlock(type)]);

  return (
    <div className="space-y-4">
      {blocks.map((block, idx) => {
        const Form = FORMS[block.type];
        return (
          <div key={idx} className="bg-white border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                {block.type}
              </span>
              <div className="flex gap-2 text-xs">
                <button type="button" onClick={() => moveBlock(idx, -1)} className="text-slate-500">up</button>
                <button type="button" onClick={() => moveBlock(idx, 1)} className="text-slate-500">down</button>
                <button type="button" onClick={() => removeBlock(idx)} className="text-red-500">delete</button>
              </div>
            </div>
            {Form && <Form data={block.data} onChange={(data) => setBlockData(idx, data)} />}
          </div>
        );
      })}

      <div className="flex flex-wrap gap-2 pt-2 border-t">
        {Object.keys(FORMS).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => addBlock(type)}
            className="text-sm px-3 py-1.5 rounded-md bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
          >
            + {type}
          </button>
        ))}
      </div>
    </div>
  );
}
