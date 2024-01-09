import { useRef } from "react";

type DragDropFileProps = {
  setSelectedFiles: any;
  selectedFiles: any;
};

export const DragDropFile = ({
  setSelectedFiles,
  selectedFiles,
}: DragDropFileProps) => {
  const inputRef: any = useRef(null);

  const handleFileDrop = (e: any) => {
    e.preventDefault();
    const files = [...e.dataTransfer.files];
    setSelectedFiles((prev: any) => [...prev, ...files]);
  };

  const handleChange = (e: any) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setSelectedFiles([...selectedFiles, ...e.target.files]);
    }
  };

  return (
    <div>
      <div
        className="w-full bg-gray-100 rounded-sm mb-10 mt-4 text-center p-10 cursor-pointer"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleFileDrop}
        onClick={() => inputRef.current.click()}
      >
        <center>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-14 text-blue-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H6.911a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661z"
            />
          </svg>
        </center>
        <p className="font-semibold-bold text-xl">
          Click or drag file to this area to upload
        </p>
        <p className="text-gray-400">
          Support for a single or bulk upload. Strictly prohibit from uploading
          company data or other band files
        </p>
        <input
          ref={inputRef}
          type="file"
          id="input-file-upload"
          multiple={true}
          onChange={handleChange}
          className="opacity-0 absolute right-0"
        />
      </div>
    </div>
  );
};
