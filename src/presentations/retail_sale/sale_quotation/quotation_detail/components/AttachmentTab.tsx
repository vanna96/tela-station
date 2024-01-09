import { TitleField } from "./Label";

import { AttachmentTable } from "./AttachmentTable";

type AttachmentTabProps = {
  Attachment?: any;
};

export const AttachmentTab = ({ Attachment }: AttachmentTabProps) => {
  return (
    <div>
      <TitleField label="Attachment Preference" />
      <AttachmentTable Attachment={Attachment} />
      <div className="mb-8"></div>
    </div>
  );
};
