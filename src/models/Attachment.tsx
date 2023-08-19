import { File } from 'buffer';
import Model from './Model';
import moment from 'moment';



export default class Attachment extends Model {

    attachmentEntry: number;
    attachmentLine: AttachmentLine[];

    constructor(json: any) {
        super()

        this.attachmentEntry = json['AbsoluteEntry']
        this.attachmentLine = json['Attachments2_Lines'].map((e:any) => new AttachmentLine(e));
    }


    toJson(update?: boolean | undefined) {
        throw new Error('Method not implemented.');
    }
}

export  class AttachmentLine extends Model {

    sourcePath: string | null;
    fileName: string | null;
    fileExtension: string | null;
    attachmentDate: string | null;
    freeText?: string | null;
    file?: Blob;


    constructor(json: any) {
        super()
        this.sourcePath = json['SourcePath']
        this.fileExtension = json['FileExtension']
        this.fileName = json['FileName']
        this.attachmentDate = moment(json['AttachmentDate']).format('DD-MM-YYYY')
        this.freeText = json['FreeText']
        this.file = json['File']
    }


    set setFile(file: Blob) {
        this.file = file;
    }


    toJson(update?: boolean | undefined) {
        return {
            "SourcePath": this.sourcePath,
            "FileName": this.fileName,
            "FileExtension": this.fileExtension,
            "AttachmentDate": this.attachmentDate,
            "FreeText": this.freeText,
            "File": this.file,
        }
    }
}