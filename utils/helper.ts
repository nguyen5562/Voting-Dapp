import { ContestantStruct, PollStruct, TruncateParams } from "./types"

const truncate = ({ text, startChars, endChars, maxLength }: TruncateParams): string => {
    if (text.length > maxLength) {
        let start = text.substring(0, startChars)
        let end = text.substring(text.length - endChars, text.length)
        while (start.length + end.length < maxLength) {
            start = start + '.'
        }
        return start + end
    }
    return text
}

const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp)
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ]

    const dayOfWeek = daysOfWeek[date.getUTCDay()]
    const month = months[date.getUTCMonth()]
    const day = date.getUTCDate()
    const year = date.getUTCFullYear()

    return `${dayOfWeek}, ${month} ${day}, ${year}`
}

const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp)

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')

    return `${year}-${month}-${day}T${hours}:${minutes}`
}

const structurePolls = (polls: any[]): PollStruct[] =>
    polls
        .map((poll) => ({
            id: Number(poll.id),
            image: poll.image,
            title: poll.title,
            description: poll.description,
            votes: Number(poll.votes),
            contestants: Number(poll.contestants),
            deleted: poll.deleted,
            director: poll.director.toLowerCase(),
            startsAt: Number(poll.startsAt),
            endsAt: Number(poll.endsAt),
            timestamp: Number(poll.timestamp),
            voters: poll.voters.map((voter: string) => voter.toLowerCase()),
            avatars: poll.avatars,
        }))
        .sort((a, b) => b.timestamp - a.timestamp)

const structureContestants = (contestants: any[]): ContestantStruct[] =>
    contestants
        .map((contestant) => ({
            id: Number(contestant.id),
            image: contestant.image,
            name: contestant.name,
            voter: contestant.voter.toLowerCase(),
            votes: Number(contestant.votes),
            voters: contestant.voters.map((voter: string) => voter.toLowerCase()),
        }))
        .sort((a, b) => b.votes - a.votes)

export {
    truncate,
    formatDate,
    formatTimestamp,
    structurePolls,
    structureContestants,
}