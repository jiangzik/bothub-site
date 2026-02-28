export interface DesktopSlide {
  src: string
  alt: string
  kicker: string
  title: string
  desc: string
}

export interface PanelContent {
  kicker: string
  title: string
  desc: string
  items: Array<{ id: string; text: string }>
  ariaPrev: string
  ariaNext: string
}

export interface MobileSlide {
  src: string
  alt: string
  kicker: string
  title: string
  desc: string
}

export interface MobileCard {
  kicker: string
  title: string
  items: string[]
}

export interface MobileFlow {
  kicker: string
  title: string
  steps: string[]
}

export interface MobileContent {
  cards: MobileCard[]
  flow: MobileFlow
  ariaPrev: string
  ariaNext: string
}
