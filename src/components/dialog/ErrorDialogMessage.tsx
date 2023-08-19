import React, { FC, RefObject, useEffect } from 'react'

import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { BsCheckCircle, BsExclamationCircle } from "react-icons/bs"


interface ErrorDialogMessageProps {
    open: boolean,
    title?: string,
    message?: string,
}


export default function ErrorDialogMessage(props: ErrorDialogMessageProps) {
    const [open, setOpen] = React.useState(false);

    useEffect(() => setOpen(props.open), [props.open])

    return (
        <Transition appear show={open} as={Fragment}>
            <Dialog as="div" className="relative z-[100] " onClose={() => { }}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto w-full ">
                    <div className="flex min-h-full items-center justify-center p-4 text-center ">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className={`w-[28rem] shadow-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle  transition-all`}>
                                <Dialog.Title
                                    as="h3"
                                    className={`w-full flex  items-center gap-2 text-md font-medium leading-6 text-red-500`}
                                >
                                    <BsExclamationCircle /> <span>{props.title}</span>

                                </Dialog.Title>
                                <hr />
                                <div className="text-sm my-4">
                                    {props.message}
                                </div>

                                <div className="mt-4 flex gap-2 justify-end">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-2 py-1 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                        onClick={() => setOpen(false)}
                                    >
                                        Close
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}
