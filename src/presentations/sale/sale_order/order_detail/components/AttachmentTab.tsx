import { TitleField } from "./Label";

import { AttachmentTable } from "./AttachmentTable";

type AttachmentTabProps = {
  Attachment?: any;
  data?: any;
};

export const AttachmentTab = ({ Attachment, data }: AttachmentTabProps) => {
  return (
    <div>
      <TitleField label="Attachment Preference" />
      <AttachmentTable Attachment={Attachment} data={data} />
      <div className="mb-8"></div>
    </div>
  );
};
