import { useRef, useState } from "react";
import IFormField from "./types/IFormField";

function FormInput({ type, field }: { type: string; field: IFormField }) {
  const [tags, setTags] = useState<string[]>([]);
  const tagContainerRef = useRef<HTMLDivElement>(null);

  const createTagElement = (tag: string) => {
    const tagElement = document.createElement("div");
    const removeButton = document.createElement("button");
    removeButton.textContent = "x";
    removeButton.className = "ml-2 text-red-500";
    removeButton.onclick = () => {
      tagContainerRef.current?.removeChild(tagElement);
      setTags((prev) => prev.filter((t) => t !== tag));
    };
    tagElement.appendChild(document.createTextNode(tag));
    tagElement.appendChild(removeButton);
    tagElement.className =
      "inline-block bg-gray-200 text-gray-700 px-2 py-1 rounded mr-2 mb-2 mt-2";
    return tagElement;
  };

  const particlesInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const lastChar = input.slice(-1);
    if (lastChar === " " || lastChar === ",") {
      e.target.value = "";
      const tag = input.slice(0, -1).trim();
      if (!tag || tags.includes(tag)) return;
      tagContainerRef.current?.appendChild(createTagElement(tag));
      setTags((prev) => [...prev, tag]);
    }
  };

  if (type === "textarea") {
    return (
      <textarea
        id={field.name}
        name={field.name}
        className="border p-2 rounded"
        placeholder={field.placeholder}
        rows={4}
      ></textarea>
    );
  }
  if (type === "particles") {
    return (
      <div>
        <input
          type="text"
          className="border p-2 rounded"
          placeholder={field.placeholder}
          onChange={particlesInputHandler}
        />
        <div ref={tagContainerRef}></div>
        {tags.map((tag, idx) => (
          <input key={idx} name={`${field.name}[]`} hidden defaultValue={tag} />
        ))}
      </div>
    );
  }
  if (type === "extra") {
    return;
  }
  if (type === "text" || type === "email" || type === "password") {
    return (
      <input
        id={field.name}
        name={field.name}
        type={field.type}
        className="border p-2 rounded"
        placeholder={field.placeholder}
        autoComplete={field.autoComplete ? "on" : "off"}
      />
    );
  }
}

export default FormInput;
