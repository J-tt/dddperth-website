import React, { Fragment } from 'react'
import { Footer } from 'components/global/Footer/footer'
import { Meta } from 'components/global/meta'
import { SkipToContent } from 'components/SkipToContent/SkipToContent'
import { NavigationProvider } from 'components/global/Nav/Nav.context'
import { TestingControl } from 'components/TestingControl/TestingControl'
import { Header } from 'components/global/Header/Header'
import { Nav } from 'components/global/Nav/Nav'
import Menu from 'config/menu'
import { ActionBar } from 'components/ActionBar/ActionBar'
import { Hero } from 'components/Hero/hero'
import { useConfig } from 'Context/Config'

export interface TemplateProps {
  title: string
  description?: string
  image?: string
  showHero?: boolean
  children?: React.ReactNode
  showActionBar?: boolean
}

export const Template = ({
  children,
  title,
  description,
  image,
  showHero,
  showActionBar = true,
}: TemplateProps): JSX.Element => {
  const { conference, appConfig, dates } = useConfig()
  const menu = Menu(conference, dates)

  return (
    <Fragment>
      <Meta pageTitle={title} pageDescription={description} pageImage={image} />
      <SkipToContent />
      <NavigationProvider>
        <Header />
        <Nav menu={menu.Top} />
      </NavigationProvider>
      {showActionBar && <ActionBar />}
      {showHero && <Hero />}
      {children}
      <Footer />
      {appConfig.testingMode() && <TestingControl />}
    </Fragment>
  )
}
