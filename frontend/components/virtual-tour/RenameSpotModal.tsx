'use client'
import { useState } from 'react'

type Props = {
  isOpen: boolean
  onClose: () => void
  currentName: string
  onSave: (newName: string) => void
}

export default function RenameSpotModal({ isOpen, onClose, currentName, onSave }: Props) {
  const [name, setName] = useState(currentName)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Change Spot Name</h2>
        <div>
          <label htmlFor="spotName" className="block text-sm font-medium text-gray-700">Spot name</label>
          <input
            type="text"
            id="spotName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">
            CLOSE
          </button>
          <button onClick={() => { onSave(name); onClose(); }} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
            CHANGE
          </button>
        </div>
      </div>
    </div>
  )
}