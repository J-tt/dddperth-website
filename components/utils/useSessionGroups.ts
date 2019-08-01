import { Moment } from 'moment'
import React from 'react'
import Conference from '../../config/conference'
import getConferenceDates from '../../config/dates'
import { Session } from '../../config/types'
import dateTimeProvider from './dateTimeProvider'

type SessionId = string // UUID

export interface SessionGroupBase {
  timeStart: Moment
  timeEnd: Moment
}

export interface SessionGroup extends SessionGroupBase {
  type: 'Sessions'
  sessions: Session[]
}

export interface SessionGroupWithIds extends SessionGroupBase {
  type: 'SessionIds'
  sessions: string[]
}

interface SessionGroups {
  allSessionGroups: SessionGroup[]
  currentSessionGroup?: SessionGroup
  previousSessionGroup?: SessionGroup
  nextSessionGroup?: SessionGroup
  pastSessionGroups?: SessionGroup[]
  futureSessionGroups?: SessionGroup[]
}

function getSessionById(sessions: Session[], ids: SessionId[]) {
  return sessions
    .filter(session => ids.includes(session.Id))
    .sort((sessionA, sessionB) => {
      const aIndex = ids.indexOf(sessionA.Id)
      const bIndex = ids.indexOf(sessionB.Id)

      if (aIndex < bIndex) {
        return -1
      } else if (aIndex > bIndex) {
        return 1
      } else {
        return 0
      }
    })
}

// so manual - ideally there would be a better way to achieve this or expand it to handle the agenda too
// e.g. on the agenda page show next sessions up top then the whole list
export function useSessionGroups(sessions: Session[]): SessionGroups {
  const allSessionGroups: SessionGroup[] = React.useMemo(
    () =>
      Conference.SessionGroups.map(sessionGroup => ({
        ...sessionGroup,
        sessions: getSessionById(sessions, sessionGroup.sessions),
        type: 'Sessions',
      })),
    [Conference.Date.toString(), sessions.length],
  )

  const { IsInProgress } = getConferenceDates(Conference, dateTimeProvider.now())

  let pastSessionsIndex: number = -1
  let previousSessionIndex: number = -1
  let nextSessionIndex: number = -1
  let currentSessionIndex: number = -1
  let futureSessionIndex: number = -1

  for (let i = 0; i < allSessionGroups.length; i++) {
    const session = allSessionGroups[i]
    const isCurrentSession = dateTimeProvider.now().Value.isBetween(session.timeStart, session.timeEnd)
    const isNextSession = dateTimeProvider.now().Value.isBefore(session.timeStart)
    const isAfterSession = dateTimeProvider.now().Value.isAfter(session.timeEnd)

    if (!IsInProgress) {
      break
    }

    if (isCurrentSession) {
      pastSessionsIndex = i - 2 >= 0 ? i - 1 : -1
      previousSessionIndex = i - 1 >= 0 ? i - 1 : -1
      currentSessionIndex = i
      nextSessionIndex = i + 1 < allSessionGroups.length ? i + 1 : -1
      futureSessionIndex = i + 2 < allSessionGroups.length ? i + 2 : -1
      break
    } else if (isNextSession) {
      pastSessionsIndex = i - 2 >= 0 ? i - 1 : -1
      previousSessionIndex = i - 1 >= 0 ? i - 1 : -1
      currentSessionIndex = -1
      nextSessionIndex = i
      futureSessionIndex = i + 1 < allSessionGroups.length ? i + 1 : -1
      break
    } else if (i === allSessionGroups.length - 1 && isAfterSession) {
      // after the last talk
      pastSessionsIndex = i - 1
      previousSessionIndex = i
      break
    }
  }

  const calculatedSessionGroups = React.useMemo<Omit<SessionGroups, 'allSessionGroups'>>(
    () => ({
      ...(pastSessionsIndex !== -1 ? { pastSessionGroups: allSessionGroups.slice(0, pastSessionsIndex) } : {}),
      ...(previousSessionIndex !== -1 ? { previousSessionGroup: allSessionGroups[previousSessionIndex] } : {}),
      ...(currentSessionIndex !== -1 ? { currentSessionGroup: allSessionGroups[currentSessionIndex] } : {}),
      ...(nextSessionIndex !== -1 ? { nextSessionGroup: allSessionGroups[nextSessionIndex] } : {}),
      ...(futureSessionIndex !== -1 ? { futureSessionGroups: allSessionGroups.slice(futureSessionIndex) } : {}),
    }),
    [
      pastSessionsIndex,
      previousSessionIndex,
      nextSessionIndex,
      currentSessionIndex,
      futureSessionIndex,
      sessions.length,
    ],
  )

  return {
    ...calculatedSessionGroups,
    allSessionGroups,
  }
}
