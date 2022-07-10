import { PlusIcon } from '@heroicons/react/outline'
import { useEffect, useState } from 'react'
import Accordion from './Accordion'
import Friend from './Friend'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { allMessages } from '../slices/messageSlice'

export default function Friends({ user, activeUrl }) {
    const [open, setOpen] = useState(true)
    const { conversations } = useSelector(state => state.conversation)
    const { rooms } = useSelector(state => state.room)
    const yourFriends = conversations.map(c => c.members.find(m => m.memberId !== user._id))
    const dispatch = useDispatch()

    useEffect(() => {
        if (user) {
            const cid = conversations.map(c => c._id)
            const roomId = rooms.map(r => r._id)
            dispatch(allMessages([...cid, ...roomId]))
        }
    }, [dispatch, user, conversations, rooms])

    return (
        <div>
            <Accordion name="Friends" setOpen={setOpen} open={open} />

            <div className={`${open ? 'block' : 'hidden'}`}>
                {
                    yourFriends.map(f => (<Friend key={f.memberId} yourFriend={f} activeUrl={activeUrl} />))
                }
            </div>

            <Link to="/">
                <div className="flex items-center gap-4 cursor-pointer mt-8">
                    <div className="w-9 h-9 rounded-xl bg-gray-700 flex justify-center items-center">
                        <PlusIcon className="stroke-white w-4 h-4" />
                    </div>
                    <span className="text-gray-300 capitalize text-xl">add friends</span>
                </div>
            </Link>
        </div>
    )
}