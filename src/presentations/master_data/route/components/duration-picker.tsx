import React from "react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/shadcn-components/ui/popover"
import { Button } from "@/shadcn-components/ui/button"
import { Separator } from "@/shadcn-components/ui/separator"
import { ScrollArea } from "@/shadcn-components/ui/scroll-area"
import { Timer } from "lucide-react"
import { cn } from "@/lib/utils";

const minute = (): (number | string)[] => {
    const minutes: (string | number)[] = [];
    for (let index = 0; index < 60; index++) {
        minutes.push(index < 10 ? '0' + index : index)
    }
    return minutes;
}

const hours = (): (number | string)[] => {
    const minutes: (string | number)[] = [];
    for (let index = 0; index < 13; index++) {
        minutes.push(index < 10 ? '0' + index : index)
    }
    return minutes;
}




export const getDuration = (value: string | undefined | null) => {
    if (!value) return '00 h : 00 min';

    const time: string[] = value?.split(':');
    return `${time?.at(0) ?? '00'} h : ${time?.at(1) ?? '00'} min`;
}

export type DurationType = 'hour' | 'minute';

export const DurationPicker = ({ value, className, onChange }: { className?: string, value?: string, disabled?: boolean | undefined, onChange: (value: string) => void }) => {
    const [hour, setHour] = React.useState<number | string | undefined>();
    const [minutes, setMinutes] = React.useState<number | string | undefined>();



    React.useEffect(() => {
        if (value) {
            const str = value.split(':');
            setHour(str.at(0) ?? '00');
            setMinutes(str.at(1) ?? '00');
        }
    }, [value])

    const handlerChange = async (value: number | string, type: DurationType) => {
        if (type === 'hour') {
            setHour(value)
        } else {
            setMinutes(value)
        }

        const _hour = type === 'hour' ? value : hour ?? '00';
        const _minute = type === 'minute' ? value : minutes ?? '00';
        onChange(`${_hour}:${_minute}`);
    }


    const hourTime = React.useMemo(() => {
        if (hour) return hour;

        if (value) {
            const str = value?.split(':');
            return str?.at(0);
        }
    }, [value, hour])




    const minuteTime = React.useMemo(() => {
        if (minutes) return minutes;


        if (value) {
            const str = value?.split(':');
            return str?.at(1);
        }

        return minutes
    }, [value, minutes])


    return <Popover>
        <PopoverTrigger asChild>
            <Button variant="outline" className={cn(['h-8 text-left w-full flex justify-between ', className])}>
                <span className="text-left">{hourTime ?? '00'} h : {minuteTime ?? '00'} min </span>
                <Timer className="w-4" />
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[15rem] px-1 py-2 bg-white" align="end">
            <div className="grid gap-2">
                {/* <div className="space-y-2">
                                                <h4 className="font-medium leading-none text-sm">Duration Picker</h4>
                                            </div> */}
                {/* <Separator /> */}
                <div className="w-full grid grid-cols-2 text-sm">
                    <div className="flex flex-col justify-center items-center ">
                        <div className="mb-2">Hour</div>
                        <Separator />
                        <ScrollArea className="h-72 w-full flex flex-col p-2" >
                            {hours().map((e) => <Button
                                key={"_hour_" + e}
                                className={`w-full hover:bg-green-100 ${e === hour ? 'bg-green-100' : ''}`}
                                type="button"
                                variant={'ghost'}
                                onClick={() => handlerChange(e, 'hour')}
                            >{e}h</Button>)}
                        </ScrollArea >
                    </div>
                    <div className="flex flex-col justify-center items-center ">
                        <div className="mb-2">Minute</div>
                        <Separator />
                        <ScrollArea className="h-72 w-full flex flex-col p-2" >
                            {minute()?.map((e: number | string) => <Button
                                key={"_minute_" + e}
                                className={`w-full hover:bg-green-100 ${e === minutes ? 'bg-green-100' : ''}`}
                                type="button"
                                variant={'ghost'}
                                onClick={() => handlerChange(e, 'minute')}
                            >{e} min</Button>)}
                        </ScrollArea >
                    </div>
                </div>
            </div>
        </PopoverContent>
    </Popover>
}