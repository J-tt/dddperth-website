import Router from 'next/router'
import React, { Fragment, useState } from 'react'
import { Session, Sponsor } from '../../config/types'
import { SafeLink } from '../global/safeLink'
import { SessionGroup, useSessionGroups } from '../utils/useSessionGroups'
import { useSessions } from '../utils/useSessions'
import { StyledCenteredParagraph, StyledSponsorLogo } from './Agenda.styled'
import { SessionDetails } from './SessionDetails'
import { StyledCloseButton, StyledDialogContent, StyledDialogOverlay } from './SessionDetails.styled'
export type onSelectCallback = (session: Session, sponsor: Sponsor) => void

interface AgendaProps {
  sessions: Session[]
  selectedSessionId: string
  sessionsUrl: string
  acceptingFeedback: boolean
  feedbackLink?: string
  render: (sessions: Session[], nextSessionGroup: SessionGroup, onSelect: onSelectCallback) => React.ReactElement
}

interface AgendaActionSelect {
  type: 'selected'
  session: Session
  sponsor?: Sponsor
}

interface AgendaActionDismiss {
  type: 'dismiss'
}

type AllAgendaActions = AgendaActionSelect | AgendaActionDismiss

interface AgendaState {
  showModal: boolean
  selectedSession?: Session
  sessionSponsor?: Sponsor
}

function agendaReducer(state: AgendaState, action: AllAgendaActions): AgendaState {
  switch (action.type) {
    case 'selected':
      return {
        selectedSession: action.session,
        sessionSponsor: action.sponsor,
        showModal: true,
      }
    case 'dismiss':
      return {
        showModal: false,
      }
    default:
      return state
  }
}

export const Agenda: React.FC<AgendaProps> = props => {
  const { isError, sessions } = useSessions(props.sessionsUrl, props.sessions)
  const { nextSessionGroup } = useSessionGroups(sessions)
  const [sessionState, dispatch] = React.useReducer(agendaReducer, { showModal: false })

  React.useEffect(() => {
    if (!sessions || sessions.length <= 0) {
      return
    }

    if (props.selectedSessionId) {
      const foundSession = sessions.find(session => session.Id === props.selectedSessionId)
      if (foundSession) {
        dispatch({
          session: foundSession,
          type: 'selected',
        })
      }
    }
  }, [sessions, props.selectedSessionId])

  const onSelectHandler = (session: Session, sponsor: Sponsor) => {
    const url = `/agenda?sessionId=${session.Id}`
    Router.push(url, url, { shallow: true })
    dispatch({ type: 'selected', session, sponsor })
  }

  const onDismissHandler = () => {
    Router.replace(`/agenda`)
    dispatch({ type: 'dismiss' })
  }

  if (isError) {
    return <div className="alert alert-danger">Error loading sessions</div>
  }

  return (
    <React.Fragment>
      {props.render(sessions, nextSessionGroup, onSelectHandler)}

      <StyledDialogOverlay isOpen={sessionState.showModal} onDismiss={onDismissHandler}>
        <StyledDialogContent>
          <StyledCloseButton type="button" className="close-button" onClick={onDismissHandler} aria-label="Close">
            <span aria-hidden>×</span>
          </StyledCloseButton>
          <SessionDetails
            session={sessionState.selectedSession}
            showPresenters={true}
            showBio={true}
            hideTags={false}
            hideLevelAndFormat={false}
          />

          {props.acceptingFeedback && (
            <StyledCenteredParagraph>
              <SafeLink className="btn btn-secondary" target="_blank" href={props.feedbackLink}>
                Give feedback
              </SafeLink>
            </StyledCenteredParagraph>
          )}

          {sessionState.sessionSponsor && (
            <Fragment>
              <hr />
              <StyledCenteredParagraph>
                Sponsored by:
                <SafeLink
                  href={sessionState.sessionSponsor.url}
                  target="_blank"
                  title={sessionState.sessionSponsor.name}
                >
                  <StyledSponsorLogo
                    src={sessionState.sessionSponsor.imageUrl}
                    alt={sessionState.sessionSponsor.name}
                  />
                </SafeLink>
              </StyledCenteredParagraph>
            </Fragment>
          )}
        </StyledDialogContent>
      </StyledDialogOverlay>
    </React.Fragment>
  )
}

Agenda.displayName = 'Agenda'
