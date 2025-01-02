import { createPoll } from '@/services/blockchain'
import { globalActions } from '@/store/globalSlices'
import { PollParams, RootState } from '@/utils/types'
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { FaTimes } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { uploadFile } from '@/services/pinata'
import Image from 'next/image'

const CreatePoll: React.FC = () => {
  const dispatch = useDispatch()
  const { setCreateModal } = globalActions
  const { wallet, createModal } = useSelector((states: RootState) => states.globalStates)

  const [poll, setPoll] = useState<PollParams>({
    image: '',
    title: '',
    description: '',
    startsAt: '',
    endsAt: '',
  })

  useEffect(() => {
    console.log(poll);
  }, [poll]);

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    console.log(poll)

    if (!poll.image || !poll.title || !poll.description || !poll.startsAt || !poll.endsAt) return
    if (wallet === '') return toast.warning('Connect wallet first!')

    poll.startsAt = new Date(poll.startsAt).getTime()
    poll.endsAt = new Date(poll.endsAt).getTime()

    await toast.promise(
      new Promise<void>((resolve, reject) => {
        createPoll(poll)
          .then((tx) => {
            closeModal()
            console.log(tx)
            resolve(tx)
          })
          .catch((error) => reject(error))
      }),
      {
        pending: 'Approve transaction...',
        success: 'Poll created successfully 👌',
        error: 'Encountered error 🤯',
      }
    )
  }

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return
    const file = e.target.files[0]

    setIsLoading(true);

    try {
      const result = await uploadFile(file)
      if (result.success) {
        setPoll((prev) => ({
          ...prev,
          image: result.pinataUrl || '',
        }));
        toast.success('Image uploaded successfully!')
      } else {
        toast.error('Failed to upload image')
      }
    } catch (error) {
      toast.error('Error uploading image')
      console.error(error)
    } finally {
      setIsLoading(false);
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setPoll((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const closeModal = () => {
    dispatch(setCreateModal('scale-0'))
    setPoll({
      image: '',
      title: '',
      description: '',
      startsAt: '',
      endsAt: '',
    })
  }

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex items-center justify-center
    bg-black bg-opacity-50 transform z-50 transition-transform duration-300 ${createModal}`}
    >
      <div className="bg-[#1c1c2b] text-[#BBBBBB] shadow-lg shadow-[#1B5CFE] rounded-xl w-11/12 md:w-2/5 h-7/12 p-6">
        <div className="flex flex-col">
          <div className="flex flex-row justify-between items-center">
            <p className="font-semibold">Add Poll</p>
            <button onClick={closeModal} className="border-0 bg-transparent focus:outline-none">
              <FaTimes />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-center items-start rounded-xl mt-5 mb-5"
          >
            <div className="py-4 w-full border border-[#212D4A] rounded-full flex items-center px-4 mb-3 mt-2">
              <input
                placeholder="Poll Title"
                className="bg-transparent outline-none w-full placeholder-[#929292] text-sm"
                name="title"
                value={poll.title}
                onChange={handleChange}
                required
              />
            </div>

            <div
              className="py-4 w-full border border-[#212D4A] rounded-full
              flex items-center px-4 mb-3 mt-2 space-x-2 relative"
            >
              <span
                className="bg-[#1B5CFE] bg-opacity-20 text-[#4C6AD7]
                absolute left-[2.5px] py-3 rounded-full px-5 w-48"
              >
                <span className="text-transparent">.</span>
              </span>
              <input
                className="bg-transparent outline-none w-full placeholder-transparent text-sm"
                name="startsAt"
                type="datetime-local"
                placeholder="Start Date"
                value={poll.startsAt}
                onChange={handleChange}
                required
              />
            </div>

            <div
              className="py-4 w-full border border-[#212D4A] rounded-full
              flex items-center px-4 mb-3 mt-2 space-x-2 relative"
            >
              <span
                className="bg-[#1B5CFE] bg-opacity-20 text-[#4C6AD7]
                absolute left-[2.5px] py-3 rounded-full px-5 w-48"
              >
                <span className="text-transparent">.</span>
              </span>
              <input
                className="bg-transparent outline-none w-full placeholder-[#929292] text-sm"
                name="endsAt"
                type="datetime-local"
                value={poll.endsAt}
                onChange={handleChange}
                required
              />
            </div>

            <div className="py-4 w-full border border-[#212D4A] rounded-lg flex items-center px-4 mb-3 mt-2 gap-2">
              <label className="cursor-pointer bg-[#212D4A] text-white text-sm px-4 py-2 rounded-md hover:bg-[#1F2C48] transition-all">
                Upload Image
                <input
                  type="file"
                  className="hidden"
                  name="image"
                  accept="image/*"
                  onChange={handleImageUpload}
                  required
                />
              </label>

              {/* Hiển thị spinner khi đang tải ảnh */}
              {isLoading && (
                <div className="mt-2 flex justify-center items-center rounded-md overflow-hidden shadow-md ml-auto animate-spin">
                  <div className="w-8 h-8 border-4 border-t-transparent border-[#212D4A] rounded-full" />
                </div>
              )}

              {poll.image && !isLoading && (
                <div className="mt-2 relative w-32 h-32 border border-[#212D4A] rounded-md overflow-hidden shadow-md ml-auto">
                  <Image
                    src={poll.image}
                    alt="Preview"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              )}
            </div>

            {/* <div className="py-4 w-full border border-[#212D4A] rounded-full flex items-center px-4 mb-3 mt-2">
              <input
                placeholder="Banner URL"
                type="file"
                className="bg-transparent outline-none w-full placeholder-[#929292] text-sm"
                name="image"
                accept="image/*"
                // value={poll.image}
                onChange={handleImageUpload}
                required
              />
              {poll.image && (
                <div className="mt-2">
                  <Image
                    src={poll.image}
                    alt="Preview"
                    width={128}
                    height={128}
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                </div>
              )}
            </div> */}

            <div className="py-4 w-full border border-[#212D4A] rounded-xl flex items-center px-4 h-20 mt-2">
              <textarea
                placeholder="Poll Description"
                className="bg-transparent outline-none w-full placeholder-[#929292] text-sm"
                name="description"
                value={poll.description}
                onChange={handleChange}
                required
              />
            </div>

            <button
              className="h-[48px] w-full block mt-2 px-3 rounded-full text-sm font-bold
              transition-all duration-300 bg-[#1B5CFE] hover:bg-blue-500"
            >
              Create Poll
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreatePoll
