


export default class DocumentStatus {

    constructor() {
        
    }

    public static getFullNameStatus(status: string | null) : string{
        switch (status) {
            case 'A':
                return 'Approved';
            case 'D':
                return 'Draft';
            case 'C':
                return 'Cancelled';
            case 'T':
                return 'Terminated';
            case 'F':
                return 'On Hold';
            case 'O':
                return 'On Hold';
            default:
                return '';
        }
    }

    public static getDocumentStatus(status: string | null) : string{
        switch (status) {
            case 'C':
                return 'Closed';
            case 'O':
                return 'Open';
            default:
                return '';
        }
    }
}