export const documentStatusList = (status: string, edit: boolean | undefined) => {
    if ((status?.includes('A') || status?.includes('F') || status?.includes('T')) && edit) {
        return [
            { value: 'A', label: 'Approved' },
            { value: 'F', label: 'On Hold' },
            { value: 'T', label: 'Terminated' },
        ]
    }


    return [
        { value: 'D', label: 'Draft' },
        { value: 'A', label: 'Approved' },
    ];
}

export const getValueDocumentStatus = (status: string | undefined): string => {
    switch (status) {
        case 'asOnHold':
            return 'F';
        case 'asTerminated':
            return 'T';
        case 'asApproved':
            return 'A';
        case 'asCanceled':
            return 'C';
        default:
            return 'D';
    }

}

export const getValueDocumentStatusProcument = (status: string | undefined): string => {
    switch (status) {
        case 'bost_Close':
            return 'C';
        default:
            return 'O';
    }

}

export const documentType = [
    {
        value: "dDocument_Items",
        label: "Items"
    },
    {
        value: "dDocument_Service",
        label: "Services"
    },

]

export const isItemType = (value: string): boolean => value === 'dDocument_Items';


export const agreementMethodLists = [
    { value: 'G', label: 'General' },
    { value: 'S', label: 'Specific' }
]

