/* eslint-disable max-len */
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useRef } from 'react';
import { Link } from 'react-router-dom';

/**
 @param {any} props
 @returns {JSX}
 */
export default function Modal(props: any) {
    const cancelButtonRef = useRef(null);

    return (
        <Transition.Root show={props.open} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-10"
                initialFocus={cancelButtonRef}
                onClose={() => {
                    props.setOpen(false);
                }}
            >
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-700 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                <div className="p-8 grid gap-2">
                                    <div className="h-14 flex justify-center items-center w-full rounded-lg bg-green-100 text-green-600">
                    Your meeting has been created successfully!
                                    </div>
                                    <div className="font-semibold text-gray-600">
                    Meeting id:{' '}
                                        <span className="font-normal text-gray-700">
                                            {props.popupFields.meeting_id}
                                        </span>
                                    </div>
                                    <div className="font-semibold text-gray-600">
                    Meeting passcode:{' '}
                                        <span className="font-normal text-gray-700">
                                            {props.popupFields.passcode}
                                        </span>
                                    </div>
                                    <div className="font-semibold text-gray-600">
                    Meeting URL:{' '}
                                        <span className="font-normal text-gray-700">
                                            {props.popupFields.joinURL}
                                        </span>
                                    </div>
                                    <div className="flex justify-center">
                                        <Link to={'/join-meeting'}>
                                            <button className="bg-emerald-600 font-semibold px-4 py-2 mt-1 text-white rounded-md">
                        Start Meeting
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}
