import {
    differenceInHours,
    differenceInMinutes,
    differenceInDays,
    differenceInMonths,
    differenceInYears,
    format,
    differenceInSeconds,
} from "date-fns"

import { zonedTimeToUtc } from "date-fns-tz"

/**
 *
 * @param {array} array The array to be added timeAgo in each item.
 * @param {string} timeStampProp Attribute's name of the object eg.{"createAt" || "updatedAt"}.
 * @returns A new array which have the timAgo properties in each object item.
 */

export const addTimeAgo = async (array, timeStampProp) => {
    const updatedArray = await array.map((item) => {
        const now = new Date()
        const from = new Date(item[timeStampProp])

        const timeAgoInMinutes = differenceInMinutes(now, from)
        if (timeAgoInMinutes < 0) {
            return {
                ...item,
                timeAgo: `1 phút trước`,
            }
        }
        if (timeAgoInMinutes < 61) {
            return {
                ...item,
                timeAgo: `${timeAgoInMinutes.toString()} phút trước`,
            }
        }

        const timeAgoInHours = differenceInHours(now, from)
        if (timeAgoInHours < 25) {
            return {
                ...item,
                timeAgo: `${timeAgoInHours.toString()} giờ trước`,
            }
        }

        const timeAgoInDays = differenceInDays(now, from)
        if (timeAgoInDays < 31) {
            return {
                ...item,
                timeAgo: `${timeAgoInDays.toString()} ngày trước`,
            }
        }

        const timeAgoInMonths = differenceInMonths(now, from)
        if (timeAgoInMonths < 13) {
            return {
                ...item,
                timeAgo: `${timeAgoInMonths.toString()} tháng trước`,
            }
        }

        const timeAgoInYears = differenceInYears(now, from)
        return {
            ...item,
            timeAgo: `${timeAgoInYears.toString()} năm trước`,
        }
    })
    return updatedArray
}

export const toTimeAgo = (timeStamp) => {
    if (!timeStamp) return

    const time = new Date()
    const timeZoneOffset = "+07:00"
    const now = zonedTimeToUtc(time, timeZoneOffset) // get the current time of +07:00 timezone
    const from = new Date(timeStamp)

    const timeAgoInSeconds = differenceInSeconds(now, from)
    if (timeAgoInSeconds < 61) {
        if (timeAgoInSeconds === 0) return `1 giây trước`
        return `${timeAgoInSeconds} giây trước`
    }

    const timeAgoInMinutes = differenceInMinutes(now, from)
    if (timeAgoInMinutes < 61) {
        if (timeAgoInMinutes === 0) return `1 phút trước`
        return `${timeAgoInMinutes} phút trước`
    }

    const timeAgoInHours = differenceInHours(now, from)
    if (timeAgoInHours < 25) {
        return `${timeAgoInHours} giờ trước`
    }

    const timeAgoInDays = differenceInDays(now, from)
    if (timeAgoInDays < 31) {
        return `${timeAgoInDays} ngày trước`
    }

    const timeAgoInMonths = differenceInMonths(now, from)
    if (timeAgoInMonths < 13) {
        return `${timeAgoInMonths} tháng trước`
    }

    const timeAgoInYears = differenceInYears(now, from)
    return `${timeAgoInYears} năm trước`
}
export const formatToString = (timeStamp, type) => {
    const date = new Date(timeStamp)

    const formattedDate = format(date, type)

    return formattedDate
}
