import { Fragment, useEffect } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { User } from '../core/entities';

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Dropdown({contacts, addParticipants}: {contacts: []; addParticipants: (value: number | User) => void;}) {
    
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-between rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100">

          <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items onChange={(e: any )=> console.log(e.target.value)} className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          {contacts.map((contact: any) => {
            return (
          <div className="py-1" key={contact.id}>
                <Menu.Item>
              {({ active }) => (
                <div onClick={()=> {
                    addParticipants(contact.id)
                }}
                  className={classNames(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'block px-4 py-2 text-sm'
                  )}
                >
                  {contact.first_name}
                </div>
              )}
            </Menu.Item>
          </div>
            )
          })}
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
