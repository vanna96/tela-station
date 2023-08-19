import Repository from "@/astractions/repository";
import Attachment, { AttachmentLine } from "@/models/Attachment";
import { arrayBufferToBlob } from "@/utilies";
import request from "@/utilies/request";


export default class AttachmentRepository extends Repository<Attachment> {

    url = '/Attachments2';



    get<T>(query?: string | undefined): Promise<T[]> {
        throw new Error("Method not implemented.");
    }

    async find<T>(id: any): Promise<any> {

        if (!id) return [];

        const response: Attachment = await request('GET', this.url + "(" + id + ")").then((res: any) => new Attachment(res.data));

        const attachments: any = response.attachmentLine.map(async (e: AttachmentLine) => {
            const image: any = await request('GET', `${this.url}(${id})/$value?filename='${e.fileName}.${e.fileExtension}'`, {}, 'arraybuffer');
            const blob = await arrayBufferToBlob(image.data, image.headers['content-type'], `${e?.fileName}.${e?.fileExtension}`);
            e.file = blob;
            return e;
        });

        return await Promise.all(attachments);
    }

    async post(payload: Blob[], isUpdate?: boolean | undefined, id?: any): Promise<Attachment> {

        if (payload.length <= 0) throw new Error('No files');

        const formData = new FormData();
        payload.forEach((e: any, index : number) => {
            const fileName = Date.now() + "." + e.originFileObj.type?.split('/')[1];
             let file = new File([e.originFileObj], fileName, {
                type: e.originFileObj.type,
                lastModified: e.originFileObj.lastModifiedDate
             });
            
            formData.append("uploads[" + index + "]", file, file.name);
        });


        await request('POST', this.url, formData);

        return new Attachment({});
    }

    patch(id: any, payload: any): Promise<Attachment> {
        throw new Error("Method not implemented.");
    }


    delete(id: any): Promise<Attachment> {
        throw new Error("Method not implemented.");
    }

}