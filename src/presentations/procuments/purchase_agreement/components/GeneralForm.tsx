import FormCard from '@/components/card/FormCard';
import MUIDatePicker from '@/components/input/MUIDatePicker';
import MUITextField from '@/components/input/MUITextField';
import VendorTextField from '@/components/input/VendorTextField';
import MUISelect from '@/components/selectbox/MUISelect';
import { ContactEmployee } from '@/models/BusinessParter';
import TextField from '@mui/material/TextField';

export interface IGeneralFormProps {
    handlerChange: (key: string, value: any) => void;
    data: any,
    handlerOpenProject?: () => void,
    edit?: boolean
}

export default function GeneralForm({ data, handlerChange, handlerOpenProject, edit }: IGeneralFormProps) {



    return (
        <>
            <FormCard title='Information'>
                <div className="flex flex-col gap-2">
                    <div className="grid grid-cols-2 gap-3">
                        <VendorTextField vtype={'supplier'} onChange={(vendor) => handlerChange('vendor', vendor)} key={data?.CardCode} error={'CardCode' in data?.error} helpertext={data?.error?.CardCode} required label="Vendor Code" autoComplete='off' defaultValue={data?.CardCode} disabled={edit} name="BPCode" endAdornment={!edit} />
                        <MUITextField required label="Vendor Name" value={data?.CardName} disabled={edit} name="BPName" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1 text-sm">
                            <label htmlFor="Code" className="text-gray-500 text-[14px]">Contact Person</label>
                            <div className="">
                                <MUISelect
                                    items={data?.ContactPersonList?.map((e: ContactEmployee) => ({ id: e.id, name: e.name }))}
                                    onChange={(e) => handlerChange('ContactPersonCode', e.target.value)}
                                    value={data?.ContactPersonCode}
                                    aliasvalue="id"
                                    aliaslabel="name"
                                    name="ContactPersonCode"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1 text-sm">
                            <MUITextField label="Vendor Ref.No" defaultValue={data?.NumAtCard} name="" onBlur={(e) => handlerChange('NumAtCard', e.target.value)} />
                        </div>
                    </div>

                    {/* <div className="grid grid-cols- gap-3">
                        <div className="flex flex-col gap-1 text-sm">
                            <label htmlFor="Code" className="text-gray-500 text-[14px]">
                                Currency
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <MUITextField
                                    size="small"
                                    name="BPCurrency"
                                    defaultValue={data.Currency}
                                    disabled
                                // disabled
                                />
                                <div></div>
                            </div>
                        </div>
                    </div> */}
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1 text-sm">
                        <label htmlFor="series">Series <span className='text-red-500'>*</span></label>
                        <div className="grid grid-cols-2 gap-3 ">
                            <MUISelect
                                items={data.SerieLists ?? []}
                                aliasvalue="Series"
                                aliaslabel="Name"
                                name="Series"
                                loading={data?.isLoadingSerie}
                                value={data?.Series === '' ? 'M' : data?.Series}
                                disabled={edit}
                                onChange={(e: any) => handlerChange('Series', e.target.value)}
                            />
                            <div className='-mt-1'>
                                <MUITextField size="small" name="DocNum" value={data?.DocNum} disabled={edit} placeholder='Document No' />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1 text-sm">
                            <label htmlFor="Code" className="text-gray-500 text-[14px]">
                                Start Date <span className='text-red-500'>*</span>
                            </label>
                            <div className="">
                                <MUIDatePicker disabled={edit && (data?.Status?.includes('A'))} error={data?.message?.includes('StartDate')} value={data.StartDate} onChange={(e: any) => handlerChange('StartDate', e)} />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1 text-sm">
                            <label htmlFor="Code" className={`${!('EndDate' in data?.error) ? 'text-gray-500' : 'text-red-500'} text-[14px]`}>
                                End Date <span className='text-red-500'>*</span>
                            </label>
                            <div className="">
                                <MUIDatePicker required error={'EndDate' in data?.error} helpertext={data?.error['EndDate']} disabled={edit && (data?.Status?.includes('A'))} value={data.EndDate ?? null} onChange={(e: any) => handlerChange('EndDate', e)} />
                            </div>
                        </div>
                    </div>
                </div>
                {/* <div className='col-span-2'></div> */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1 text-sm">
                        <MUITextField label="Tel. No" value={data.Phone} disabled={true} />
                    </div>

                    <div className="flex flex-col gap-1 text-sm">
                        <MUITextField label="Email" value={data.Email} disabled={true} />
                    </div>
                </div>
                <div className="flex flex-col gap-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1 text-sm">
                            <MUITextField label="Project" name="Project" disabled={edit && (data?.Status?.includes('A'))} value={data.Project} endAdornment={true} onClick={handlerOpenProject} />
                        </div>

                        <div className="flex flex-col gap-1 text-sm">
                            <label htmlFor="TerminateDate" className="text-gray-500 text-[14px]">
                                Terminate Date
                            </label>
                            <div className="">
                                <MUIDatePicker value={data?.TerminateDate ?? null} disabled={data?.disable['TerminateDate']} onChange={(e: any) => handlerChange('TerminateDate', e)} name="TerminateDate" />
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-sm">
                        {/* <label htmlFor="SigningDate" className="text-gray-500 text-[14px]">
                            Signing Date
                        </label> */}
                        <div className="">
                            <MUIDatePicker label='Signing Date' value={data?.SigningDate} disabled={edit && (data?.Status?.includes('A'))} onChange={(e: any) => handlerChange('SigningDate', e)} name="SigningDate" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1 text-sm">
                        <label htmlFor="Code" className="text-gray-500 text-[14px]">
                            Description
                        </label>
                        <div className="">
                            <TextField
                                size="small"
                                multiline
                                rows={4}
                                fullWidth
                                onBlur={(e) => handlerChange('Description', e.target.value)}
                                name="Description"
                                className="w-full"
                                defaultValue={data?.Description}
                            />
                        </div>
                    </div>
                </div>
            </FormCard>
        </>
    )
} 