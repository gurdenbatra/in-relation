import IntroSection from './components/sections/IntroSection.jsx'
import FootstepsSection from './components/sections/FootstepsSection.jsx'
import NarrativeSection from './components/sections/NarrativeSection.jsx'
import StampSection from './components/sections/StampSection.jsx'
import PeopleSection from './components/sections/PeopleSection.jsx'
import RoadFork from './components/sections/RoadFork.jsx'
import WalksSection from './components/sections/WalksSection.jsx'
import NextWalksSection from './components/sections/NextWalksSection.jsx'

export default function App() {
  return (
    <main style={{ background: '#f5f0e8' }}>
      <IntroSection />
      <FootstepsSection />
      {/* <NarrativeSection /> */}
      {/* <StampSection /> */}
      <PeopleSection />
      <RoadFork />
      <WalksSection />
      <NextWalksSection />
    </main>
  )
}
