import { CopyButton, EditButton, ToggleButton } from "./Buttons";

type InformationTabProps = {
  toggle?: boolean;
  enableCopyToButton?: boolean;
  onToggle?: () => void;
  onCopyTo?: () => void;
  goToEditPage?: () => void;
  children?: JSX.Element[];
};

export const InformationTab = ({
  toggle,
  onToggle,
  onCopyTo,
  goToEditPage,
  enableCopyToButton,
  children,
}: InformationTabProps) => {
  return (
    <div className="min-w-[25rem] lg:w-full bg-white rounded p-4">
      <div className={`${toggle ? "" : "mb-6"} flex justify-between`}>
        <h2 className="uppercase text-lg font-md ">Information</h2>
        <div className="flex gap-3">
          {enableCopyToButton ? <CopyButton onCopyTo={onCopyTo} /> : null}
          <EditButton goToEditPage={goToEditPage} />
          <ToggleButton onToggle={onToggle} toggle={toggle} />
        </div>
      </div>
      {toggle ? null : children}
    </div>
  );
};
