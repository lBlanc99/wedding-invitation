'use client'

import { updateEvent } from '../../actions'
import Swal from 'sweetalert2'

function toWIBString(date: Date) {
  if (!date) return ''
  const wibDate = new Date(new Date(date).getTime() + 7 * 60 * 60 * 1000)
  return wibDate.toISOString().slice(0, 16)
}

export default function EditEventForm({ event }: { event: any }) {
  
  async function handleSubmit(formData: FormData) {
    try {
      Swal.fire({ title: 'Saving...', didOpen: () => Swal.showLoading() })
      await updateEvent(formData)
      Swal.fire({ title: 'Success!', text: 'Event details updated successfully.', icon: 'success', timer: 1500, showConfirmButton: false })
    } catch (error) {
      Swal.fire({ title: 'Failed!', text: 'Something went wrong.', icon: 'error' })
    }
  }

  const defaultMatrimony = toWIBString(event.matrimonyDate)
  const defaultReception = toWIBString(event.receptionDate)

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h2 className="font-bold text-lg text-slate-800 mb-6 border-b border-slate-100 pb-4">Edit Event Details</h2>
      
      <form action={handleSubmit} className="flex flex-col gap-5">
        <input type="hidden" name="id" value={event.id} />
        
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Event Name</label>
          <input name="name" defaultValue={event.name} className="w-full border border-slate-300 p-2.5 rounded-lg text-sm text-slate-900 bg-white font-medium focus:ring-2 focus:ring-indigo-500 outline-none" />
        </div>
        
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Slug (URL)</label>
          <div className="flex">
            <span className="bg-slate-100 border border-slate-300 border-r-0 rounded-l-lg px-3 flex items-center text-xs text-slate-500">/</span>
            <input name="slug" defaultValue={event.slug} className="w-full border border-slate-300 p-2.5 rounded-r-lg text-sm text-slate-900 bg-white font-mono focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
        </div>

        {/* DUA INPUT LOKASI */}
        <div className="grid grid-cols-1 gap-4">
            <div>
                <label className="text-[10px] font-bold text-indigo-600 uppercase mb-1 block">Matrimony Location</label>
                <input name="matrimonyLocation" defaultValue={event.matrimonyLocation} className="w-full border border-slate-300 p-2.5 rounded-lg text-sm text-slate-900 bg-white focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
                <label className="text-[10px] font-bold text-pink-600 uppercase mb-1 block">Reception Location</label>
                <input name="receptionLocation" defaultValue={event.receptionLocation} className="w-full border border-slate-300 p-2.5 rounded-lg text-sm text-slate-900 bg-white focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
              <label className="text-[10px] font-bold text-indigo-600 uppercase mb-1 block">Matrimony Time</label>
              <input type="datetime-local" name="matrimonyDate" defaultValue={defaultMatrimony} className="w-full border border-slate-300 p-2.5 rounded-lg text-sm text-slate-900 bg-white focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
              <label className="text-[10px] font-bold text-pink-600 uppercase mb-1 block">Reception Time</label>
              <input type="datetime-local" name="receptionDate" defaultValue={defaultReception} className="w-full border border-slate-300 p-2.5 rounded-lg text-sm text-slate-900 bg-white focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
        </div>

        <button type="submit" className="bg-slate-800 text-white font-bold py-3 rounded-lg text-sm hover:bg-slate-900 transition mt-2 shadow-lg shadow-slate-500/20">
          Save Changes
        </button>
      </form>
    </div>
  )
}