import React, { Fragment } from 'react'
import { SafeLink } from 'components/global/safeLink'
import { StyledList } from 'components/global/text'
import Conference from './conference'
import { Dates, FAQ, TicketPurchasingOptions, TicketsProvider } from './types'
import { format } from 'date-fns'
import Link from 'next/link'

export default function getFaqs(dates: Dates): FAQ[] {
  const Faqs: FAQ[] = []

  if (!Conference.HideDate) {
    Faqs.push({
      Question: 'When and where is it?',
      Answer: `The event ${dates.IsComplete ? 'was' : 'will be'} held on ${dates.Display}${
        Conference.HideVenue ? '' : ' at ' + Conference.Venue.Name
      }.
          Doors ${dates.IsComplete ? 'opened' : 'will open'} at ${Conference.DoorsOpenTime} and ${
        dates.IsComplete ? 'we finished' : "we'll finish"
      } at ${Conference.FinishTime} ${
        Conference.HasAfterParty
          ? 'followed by the afterparty' + Conference.HideAfterpartyVenue
            ? ''
            : ' at ' + Conference.Venue.Afterparty
          : ''
      }.`,
    })
  }

  Faqs.push({
    Question: 'How much does it cost to attend?',
    Answer: `${Conference.TicketPrice} covers your entry, food and coffee all day${
      Conference.HasAfterParty ? ' and access to the afterparty!' : '!'
    }  Amazing value right!?
      We are able to keep the ticket price so low thanks to our generous sponsors.
      ${
        Conference.Name
      } is a non profit event and any excess will be kept as part of a fund for future events and/or donated to charity.`,
    Category: 'tickets',
  })

  Faqs.push({
    Question: "[Financial Assistance] What if I can't afford to attend?",
    AnswerWithoutParagraph: (
      <div>
        <p>
          If you can't afford the ticket price then we have Sponsored (Financial Assistance) tickets available. DDD
          Perth is donating 10 such tickets and we also have an option for people within the community to donate further
          tickets. The only requirement for eligibility is that you can't afford the ticket; you can access the
          Financial Assistance tickets by{' '}
          {Conference.TicketsProviderId === TicketsProvider.Eventbrite ? (
            <>
              entering the promotional code of <code>{Conference.TicketsProviderFinancialAssistanceCode}</code>
            </>
          ) : (
            <>selecting the Financial Assistance ticket</>
          )}
          .
        </p>
        <StyledList>
          <li>Already attended a conference in the past? That's ok.</li>
          <li>Already received a sponsored ticket in the past? Still ok.</li>
          <li>
            Don't have much (or any) experience with the technology featured at {Conference.Name}? That’s ok, too.
          </li>
          <li>Don't want to take money away from someone else? Really, it’s ok, everyone says that!</li>
          <li>Don't feel like you deserve this? That’s also ok: you do.</li>
        </StyledList>
      </div>
    ),
    Category: 'tickets',
  })

  Faqs.push({
    Question: 'Is this just for software developers?',
    Answer:
      'No! While our name implies we are just about devs, our events are aimed at all professionals in the software industry - developers, testers, designers, analysts, managers, etc.',
  })

  Faqs.push({
    Question: 'How is the agenda chosen?',
    Answer:
      'DDD Perth is a community driven event with core values of inclusion and democratic engagement. Proposed sessions are anonymised and voted for by the public, but some curation is inevitably required to produce an agenda that meets our inclusion goals. We aim to maximise the impact of every vote in the process, and always look to the community first in our decision making.',
  })

  Faqs.push({
    Question: 'Will refreshments be provided?',
    Answer:
      'Yes, attendees will receive lunch and snacks throughout the day and we will have a coffee cart operating all day.',
  })

  Faqs.push({
    Question: 'What about swag?',
    Answer:
      'Yes, there will be a bunch of swag on offer on the day both from our swag table as well as with the various sponsors that will have booths. We have decided not to offer showbags this year as they often end up resulting in a lot of waste; this way attendees can choose the swag they want. We will have a small number of bags on offer if you need, but it may also be prudent to bring your own bag.',
  })

  if (Conference.Venue && Conference.Venue.Wifi !== null) {
    Faqs.push({
      Question: 'Will there be wifi?',
      Answer: Conference.Venue.Wifi,
    })
  }

  Faqs.push({
    Question: 'Will childcare be available?',
    Answer: `Yes! We will be providing childcare at this year’s conference. It will be available for the duration of the main conference and is ${Conference.ChildcarePrice}. You will be required to provide food for your child for the day. If you would like to book your child in then please purchase an additional ‘Childcare’ ticket when purchasing your ticket. Spots are limited!`,
    Category: 'tickets',
  })

  Faqs.push({
    Question: 'When does registration open?',
    Answer: (
      <Fragment>
        {dates.RegistrationOpen ? (
          <Fragment>
            Now! Go to <Link href="/tickets">the tickets page</Link> to register.
          </Fragment>
        ) : Conference.TicketPurchasingOptions === TicketPurchasingOptions.SoldOut ? (
          <Fragment>The conference is now sold out.</Fragment>
        ) : Conference.TicketPurchasingOptions === TicketPurchasingOptions.WaitListOpen ? (
          <Fragment>The conference has an open waitlist for tickets.</Fragment>
        ) : dates.RegistrationClosed ? (
          <Fragment>Ticket sales have closed.</Fragment>
        ) : (
          <Fragment>
            Registration opens on {format(Conference.RegistrationOpenFrom, dates.DateDisplayFormat)} at{' '}
            {format(Conference.RegistrationOpenFrom, dates.TimeDisplayFormat)}.
          </Fragment>
        )}
      </Fragment>
    ),
  })

  Faqs.push({
    Question: 'Can I pay by cheque, invoice, cash, Coinye West?',
    Answer: 'Payments can be made with credit card using Tito via our tickets page when registrations are open.',
    Category: 'tickets',
  })

  Faqs.push({
    Question: 'Can I cancel/give my ticket to someone else?',
    Answer: <Fragment>You are welcome to send someone else in your place. Please do this through Tito.</Fragment>,
    Category: 'tickets',
  })

  Faqs.push({
    Question: `What is the hashtag for ${Conference.Name}?`,
    Answer: (
      <Fragment>
        The Twitter hashtag is{' '}
        <SafeLink href={'https://twitter.com/search?q=%23' + Conference.HashTag} target="_blank">
          #{Conference.HashTag}
        </SafeLink>
        .
      </Fragment>
    ),
  })

  Faqs.push({
    Question: 'Will I be photographed or filmed?',
    Answer: (
      <Fragment>
        Media personnel authorised by {Conference.Name} will be in attendance. These media personnel will respect the
        photo policy as defined in the <Link href="/code-of-conduct#photo-policy">Code of Conduct</Link>.
      </Fragment>
    ),
  })

  Faqs.push({
    Question: 'I want to be involved. Can I help?',
    Answer: (
      <Fragment>
        We are always looking for volunteers and sometimes looking for organisers! It takes a lot of effort to organise
        a volunteer-run conference like {Conference.Name}. Shoot us an email at{' '}
        <a className="maillink" href={'mailto:' + Conference.ContactEmail}>
          {Conference.ContactEmail}
        </a>{' '}
        and we can work with you to figure out the best way to assist.
      </Fragment>
    ),
  })

  Faqs.push({
    Question: 'How can I contact the organisers?',
    Answer: (
      <Fragment>
        We can be contacted via email at{' '}
        <a className="maillink" href={'mailto:' + Conference.ContactEmail}>
          {Conference.ContactEmail}
        </a>
        {Conference.Socials.Twitter.Name !== null ? (
          <Fragment>
            {' '}
            and Twitter at{' '}
            <SafeLink href={'https://twitter.com/' + Conference.Socials.Twitter.Name} target="_blank">
              @{Conference.Socials.Twitter.Name}
            </SafeLink>
            . See also the other Social Media accounts at the footer of this page.
          </Fragment>
        ) : (
          '. Also, see our various social media accounts at the footer of this page.'
        )}
      </Fragment>
    ),
  })

  Faqs.push({
    Question: `How can I sponsor ${Conference.Name}?`,
    Answer: (
      <Fragment>
        {Conference.Name} will be heavily publicised in the community and we believe offers a unique marketing and
        recruiting opportunity based on being attended by people that don't normally get to go to conferences. It's also
        a great chance to give back and support the local software community. We have various levels of sponsorship
        available with various benefits and price points. We have a sponsorship prospectus that will be provided on
        request that explains detailed benefits and impact of sponsorship and the difference between the various levels;
        if you would like a copy{' '}
        <a className="maillink" href={'mailto:' + Conference.SponsorshipEmail}>
          please contact us
        </a>
        .
      </Fragment>
    ),
  })

  Faqs.push({
    Question: 'How can I go to this kind of thing more often?',
    AnswerWithoutParagraph: (
      <Fragment>
        <p>Perth has a very active software community. Consider attending one of the meetups/conferences such as:</p>
        <StyledList>
          <li>
            <SafeLink href="http://www.meetup.com/PerthDotNet/" target="_blank">
              Perth .NET
            </SafeLink>
          </li>
          <li>
            <SafeLink href="http://www.meetup.com/Perth-Cloud/" target="_blank">
              Perth MS Cloud Computing User Group
            </SafeLink>
          </li>
          <li>
            <SafeLink href="http://www.meetup.com/PerthFP/" target="_blank">
              Perth Functional Programmers
            </SafeLink>
          </li>
          <li>
            <SafeLink href="http://www.meetup.com/Agile-Perth/" target="_blank">
              Agile Perth
            </SafeLink>
          </li>
          <li>
            <SafeLink href="http://www.meetup.com/Perth-Agile-Meetup-Group/" target="_blank">
              Perth Agile Meetup
            </SafeLink>
          </li>
          <li>
            <SafeLink href="http://www.meetup.com/DevOps-Perth/" target="_blank">
              DevOps Perth
            </SafeLink>
          </li>
          <li>
            <SafeLink href="http://www.meetup.com/Front-End-Web-Developers-Perth/" target="_blank">
              Front End Web Developers Perth (Fenders)
            </SafeLink>
          </li>
          <li>
            <SafeLink href="http://www.meetup.com/Perth-Agile-Testing/" target="_blank">
              Perth Agile Testing
            </SafeLink>
          </li>
          <li>
            <SafeLink href="http://www.meetup.com/Perth-Code-Dojo/" target="_blank">
              Perth Code Dojo
            </SafeLink>
          </li>
          <li>
            <SafeLink href="https://www.meetup.com/Perth-mobile-dot-net-developers/" target="_blank">
              Perth Mobile .NET Developers
            </SafeLink>
          </li>
          <li>
            <SafeLink href="http://www.witwa.org.au/" target="_blank">
              Women in Technology, WA
            </SafeLink>
          </li>
          <li>
            <SafeLink href="http://mixinconf.com/" target="_blank">
              Mixin conference
            </SafeLink>
          </li>
          <li>
            <SafeLink href="http://west.yowconference.com.au/" target="_blank">
              Yow! West conference
            </SafeLink>
          </li>
        </StyledList>
        <p>
          Furthermore, you can see an up to date list of Australian conferences at{' '}
          <SafeLink href="https://github.com/readify/devevents" target="_blank">
            Readify's DevEvents repository
          </SafeLink>
          .
        </p>
      </Fragment>
    ),
  })

  Faqs.push({
    Question: 'Who are the organisers?',
    AnswerWithoutParagraph: (
      <Fragment>
        <p>
          {Conference.Name} is organised by DDD WA Inc. a non-profit organisation set up to create inclusive events for
          the WA software community. {Conference.Name} {Conference.Instance} is organised by:
        </p>
        <StyledList>
          <li>
            <SafeLink href="https://www.linkedin.com/in/rebeccacwaters/" target="_blank">
              Rebecca Waters
            </SafeLink>
          </li>
          <li>
            <SafeLink href="https://twitter.com/amys_kapers" target="_blank">
              Amy Kapernick
            </SafeLink>
          </li>
          <li>
            <SafeLink href="https://twitter.com/mattyjward" target="_blank">
              Matt Ward
            </SafeLink>
          </li>
          <li>Sarah McGeough</li>
          <li>
            <SafeLink href="https://twitter.com/ian_hughes" target="_blank">
              Ian Hughes
            </SafeLink>
          </li>
          <li>
            <SafeLink href="https://twitter.com/robdmoore" target="_blank">
              Rob Moore
            </SafeLink>
          </li>
          <li>
            <SafeLink href="https://twitter.com/aidanjmorgan" target="_blank">
              Aidan Morgan
            </SafeLink>
          </li>
          <li>
            <SafeLink href="https://twitter.com/battlepanda_au" target="_blank">
              David Schokker
            </SafeLink>
          </li>
          <li>
            <SafeLink href="https://twitter.com/kristysachse" target="_blank">
              Kristy Sachse
            </SafeLink>
          </li>
          <li>
            <SafeLink href="https://twitter.com/_vedusha_" target="_blank">
              Vedusha Chooramun
            </SafeLink>
          </li>
          <li>
            <SafeLink href="https://twitter.com/mzaatar" target="_blank">
              Mo Zaatar
            </SafeLink>
          </li>
          <li>
            <SafeLink href="https://twitter.com/al5848" target="_blank">
              Allen Azemia
            </SafeLink>
          </li>
          <li>
            <SafeLink href="https://twitter.com/Caiwrote" target="_blank">
              Cairo Malet
            </SafeLink>
          </li>
          <li>
            <SafeLink href="https://twitter.com/eleusis7" target="_blank">
              Priyaj Sham Chukoury
            </SafeLink>
          </li>
          <li>Nehal Ghuman</li>
          <li>
            <SafeLink href="https://twitter.com/robdcrowley" target="_blank">
              Rob Crowley
            </SafeLink>
          </li>
          <li>
            <SafeLink href="https://twitter.com/antonjb" target="_blank">
              Anton Ball
            </SafeLink>
          </li>
          <li>Deanne Blom</li>
        </StyledList>
        <p>Furthermore, we have many others who volunteer and have assisted with organisation in the past</p>
      </Fragment>
    ),
  })

  Faqs.push({
    Question: 'Can I wear a face mask?',
    Answer: `Absolutely, we support any attendees who choose to wear a face mask on the day of the conference.`,
    Category: 'covid',
  })

  Faqs.push({
    Question: 'Will you have sanitiser available at the conference?',
    Answer: `Yes! We'll have sanitising processes in place for all attendees on the day, and this includes providing hand sanitiser. However, we also encourage everyone to bring their own personal supply too, just in case!`,
    Category: 'covid',
  })

  Faqs.push({
    Question: 'Why can’t I go to the talk I want?',
    AnswerWithoutParagraph: (
      <Fragment>
        <p>
          As part of our COVID restrictions, we have capacity limits in place for all of our speaker rooms which will be
          enforced at the door. This means that once a room is full, we can’t let anyone else in. If there’s a talk
          you’re desperate to see, we recommend getting to the room as early as you can to avoid disappointment and
          please be kind to those on the door, we guarantee they don’t enjoy having to turn people away.
        </p>
        <p>
          If you do miss something due to capacity limits, keep an eye out after the conference – we’ll be releasing
          recordings of all the talks so you’ll have the opportunity to catch up on anything you missed!)
        </p>
      </Fragment>
    ),
    Category: 'covid',
  })

  Faqs.push({
    Question: 'I don’t feel well, can I still come to the conference?',
    Answer: (
      <Fragment>
        We all know the drill by now – if you’re experiencing any cold or flu-like symptoms, please stay home and follow
        the WA government instructions regarding COVID testing. If you miss the conference due to illness, feel free to
        pass your ticket along through Tito so it doesn’t go to waste. If you’re not able to pass it along, please email{' '}
        <a className="maillink" href={'mailto:' + Conference.ContactEmail}>
          {Conference.ContactEmail}
        </a>{' '}
        and we’ll issue a refund for your ticket. And never fear, we’ll be releasing recordings of all the talks so you
        can watch them back later once you’re recovered!
      </Fragment>
    ),
    Category: 'covid',
  })

  Faqs.push({
    Question: 'How will the online conference differ from the in-person conference?',
    Answer: (
      <Fragment>
        <p>
          If we move to an online conference, there will be some obvious differences – you’ll be logging in to
          conference via an online platform rather than joining us in person at the PCEC, and we’ll be making some
          tweaks to the agenda based on our speakers’ availability for the online conference.
        </p>
        <p>
          Outside of that, we’ve done our best to recreate the DDD Perth <em>vibe</em> as best we can, so you can
          expect:
        </p>
        <StyledList>
          <li>High quality, pre-recorded talks from our speakers (no awkward “you’re on mute” moments)</li>
          <li>Live Q&amp;A with our speakers during their talks</li>
          <li>Breaks between talks so you’re not stuck in back to back sessions</li>
          <li>Live welcomes and prize draws from the DDD Perth committee.</li>
        </StyledList>
      </Fragment>
    ),
    Category: 'covid',
  })

  Faqs.push({
    Question: 'Why will the conference move online?',
    Answer: `We love our community and part of that means putting safety first.  The DDD Perth team are monitoring the COVID situation closely and will make the decision to move online if restrictions in the Perth metropolitan area will have a detrimental impact on our speakers and attendees.`,
    Category: 'covid',
  })

  Faqs.push({
    Question: 'When will we find out if the conference is going online?',
    Answer: `Unfortunately, we can’t commit to a specific timeframe. We’re closely monitoring the COVID situation and aim to give attendees as much notice as possible if we move online, but we’ve all seen how rapidly the situation can change! We’ll will let the community know as soon as a decision is made - this could be anywhere from 2 weeks before the conference to the night before. We ask all attendees to keep on top of the WA Government COVID advice and check their emails regularly, especially the day and night before the conference and in the morning on August 14th before leaving the house to join us.`,
    Category: 'covid',
  })

  Faqs.push({
    Question: 'How do I access the online conference?',
    Answer: `You’ll receive a link to access our online platform before the start of the conference. You’ll need a web browser to access the link but you won’t need to download any special software.`,
    Category: 'covid',
  })

  Faqs.push({
    Question: 'What if I can’t attend the online conference?',
    Answer: `If you’re not able to attend the online conference, you’ll still get the chance to see our wonderful speakers! We’ll be releasing recordings of the talks online so you can watch them back later.`,
    Category: 'covid',
  })

  Faqs.push({
    Question: 'Can I get a refund if the conference moves online?',
    Answer: (
      <Fragment>
        Unfortunately, we’re not able to offer refunds in the case that we move online. Our committee has put a lot of
        effort into creating an online conference experience that’s as close to the DDD Perth <em>vibe</em> as we could
        get, so we hope you’ll join us online.
      </Fragment>
    ),
    Category: 'covid',
  })

  Faqs.push({
    Question: 'I’m on the waitlist, can I come to the online conference?',
    Answer: `Yes! The upside of going online is we don’t have the same capacity restrictions as in-person. If we make the decision to move online, we’ll re-open ticket sales and advise the waitlist, so anyone who missed out can purchase a ticket to join us and our speakers online.`,
    Category: 'covid',
  })

  Faqs.push({
    Question: 'Will talks be recorded for the online conference, or will they be live?',
    Answer: (
      <Fragment>
        To minimise the potential for <em>technical problems</em>, we are pre-recording our speakers to be broadcast as
        part of the online conference. We will still have our speakers available for live Q&amp;A while their talks are
        broadcast, so you’ll have the opportunity to ask questions and pick their brains on their talk topic while their
        talk is on.
      </Fragment>
    ),
    Category: 'covid',
  })

  Faqs.push({
    Question: 'Will the speakers be available for questions?',
    Answer: `Yes! Our speakers will be answering questions and sharing their thoughts during their talks, so you can interact with them live while watching their talks.`,
    Category: 'covid',
  })

  Faqs.push({
    Question: 'Will talks be available online after the conference?',
    Answer: `Yes! Whether we go ahead in person or online, we’ll be releasing recordings of the talks so you can catch up on anything you may have missed on the day. One of the perks of preparing for a potential online conference is we’ll have high quality recordings ready to go, so no dodgy audio or bad lighting to contend with.`,
    Category: 'covid',
  })

  Faqs.push({
    Question: 'Will the Code of Conduct still apply to the online conference?',
    Answer: `Absolutely. Our peacekeepers will be monitoring the online conference just as they would in-person and our online platform has technical protections in place that will assist us to enforce the Code of Conduct if needed.`,
    Category: 'covid',
  })

  return Faqs
}
