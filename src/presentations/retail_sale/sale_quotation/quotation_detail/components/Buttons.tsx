type ButtonProps = {
  toggle?: boolean;
  onToggle?: () => void;
  onCopyTo?: () => void;
  goToEditPage?: () => void;
};

const EditButton = ({ goToEditPage }: ButtonProps) => {
  return (
    <button
      onClick={goToEditPage}
      className="px-2 py-1 border text-sm rounded hover:bg-gray-100 hover:text-blue-500 flex items-center"
    >
      <svg
        className="w-4 h-4 mr-1"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
        />
      </svg>
      Edit
    </button>
  );
};

const CopyButton = ({ onCopyTo }: ButtonProps) => {
  return (
    <button
      onClick={onCopyTo}
      className="px-2 py-1 border text-sm rounded hover:bg-gray-100 hover:text-blue-500"
    >
      Copy To
    </button>
  );
};

const ToggleButton = ({ onToggle, toggle }: ButtonProps) => {
  return (
    <div className="hidden lg:block ml-5">
      <button
        onClick={onToggle}
        className=" hover:bg-gray-100 rounded px-2 hover:text-blue-500 "
      >
        {toggle ? (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 15.75l7.5-7.5 7.5 7.5"
            />
          </svg>
        )}
      </button>
    </div>
  );
};

export { EditButton, CopyButton, ToggleButton };
