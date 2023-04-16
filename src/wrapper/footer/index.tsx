import { useState } from 'react'
import { Button, Sprite, Modal } from '../../components'
import StakeCard from '../../pages/twinpeaks/stakearea'
import { rem } from '../../utils'
import NetworkDropdown from '../header/networkdropdown'
import ConnectButtonDropdown from '../header/connectbuttondropdown'
import './footer.scss'
import { useAccount } from 'wagmi'
import { Link, useLocation } from 'react-router-dom'

const Footer = () => {
  const { isConnected } = useAccount()

  const location = useLocation()

  const [openStakeModal, setOpenStakeModal] = useState(false)

  return (
    <>
      <div className="footer">
        <div className="row-1">
          <div className="col-1">
            <Sprite id="cruize-footer-icon" width={150} height={40} />
            <p className="desc">
              With Cruize, your assets remain safe from volatility risks while
              generating outsized returns in every market condition.
            </p>
          </div>
          {/* <div className="col-2">
            <label className="link-title">Product</label>
            <Link
              className="link"
              to="/vaults/twinpeaks"
            >
              Twin Peaks
            </Link>
            <a
              className="link"
              style={{
                color: 'var(--vault-card-border)',
                cursor: 'not-allowed',
              }}
            >
              Yield Booster
            </a>
          </div> */}
          <div className="col-2">
            <label className="link-title">Resources</label>
            <a
              className="link"
              href="https://docs.cruize.finance/"
              target={'_blank'}
              rel={'noreferrer noopener'}
            >
              Docs
            </a>
            <a
              className="link"
              href="https://docs.cruize.finance/technical-details/audits"
              target={'_blank'}
              rel={'noreferrer noopener'}
            >
              Audit
            </a>
            <a
              className="link"
              href="https://discord.com/invite/tACTMsMYbd"
              target={'_blank'}
              rel={'noreferrer noopener'}
            >
              Help center
            </a>
            <a
              className="link"
              style={{
                color: 'var(--vault-card-border)',
                cursor: 'not-allowed',
              }}
            >
              Tutorials
            </a>
          </div>
          <div className="col-2">
            <label className="link-title">Company</label>
            <a
              className="link"
              href="https://www.cruize.finance"
              target={'_blank'}
              rel="noreferrer noopener"
            >
              Home
            </a>
            <a
              className="link"
              href="https://www.cruize.finance/about"
              target={'_blank'}
              rel="noreferrer noopener"
            >
              About
            </a>
            <a
              className="link"
              href="https://cruize-finance.notion.site/Careers-at-Cruize-e9fa839414ac491ca84f285911ad39fb"
              target={'_blank'}
              rel="noreferrer noopener"
            >
              Careers
            </a>
            <a
              className="link"
              href="https://www.cruize.finance/terms-page"
              target={'_blank'}
              rel="noreferrer noopener"
            >
              Terms
            </a>
          </div>
          <div className="col-2">
            <label className="link-title">Social</label>
            <a
              className="link"
              href="https://discord.com/invite/tACTMsMYbd"
              target={'_blank'}
              rel={'noreferrer noopener'}
            >
              Discord
            </a>
            <a
              className="link"
              href="https://twitter.com/CruizeFinance"
              target={'_blank'}
              rel={'noreferrer noopener'}
            >
              Twitter
            </a>
            <a
              className="link"
              href="https://www.linkedin.com/company/cruize-protocol"
              target={'_blank'}
              rel={'noreferrer noopener'}
            >
              LinkedIn
            </a>
            <a
              className="link"
              href="https://github.com/CruizeFinance"
              target={'_blank'}
              rel={'noreferrer noopener'}
            >
              GitHub
            </a>
          </div>
        </div>
        <div className="row-2">
          <label className="label">© 2023 Cruize Inc.</label>
          <div className="socials">
            <a
              href="https://discord.com/invite/tACTMsMYbd"
              target={'_blank'}
              rel={'noreferrer noopener'}
            >
              <Sprite id="discord-icon" width={21} height={17} />
            </a>
            <a
              href="https://twitter.com/CruizeFinance"
              target={'_blank'}
              rel={'noreferrer noopener'}
            >
              <Sprite id="twitter-icon" width={25} height={20} />
            </a>
            <a
              href="https://www.linkedin.com/company/cruize-protocol"
              target={'_blank'}
              rel={'noreferrer noopener'}
            >
              <Sprite id="linkedin-icon" width={25} height={24} />
            </a>
            <a
              href="https://github.com/CruizeFinance"
              target={'_blank'}
              rel={'noreferrer noopener'}
            >
              <Sprite id="github-icon" width={25} height={24} />
            </a>
          </div>
        </div>
        {location.pathname === '/vaults/twinpeaks' ? (
          <div className="mobile-fake-div" />
        ) : null}
      </div>
      {location.pathname === '/vaults/twinpeaks' ? (
        <div className="stake-button-container">
          <Button
            className="stake-button"
            onClick={() => setOpenStakeModal(true)}
          >
            Stake
          </Button>
        </div>
      ) : null}
      <Modal
        open={openStakeModal}
        hide={() => setOpenStakeModal(false)}
        modalContentStyle={{ borderRadius: rem(20), bottom: 0 }}
      >
        <div className="network-wallet-area">
          <div className="network-wallet-container">
            <div className="dropdown-options">
              {isConnected ? (
                <>
                  <NetworkDropdown />
                  <ConnectButtonDropdown />
                </>
              ) : null}
            </div>
            <Sprite
              id="close-modal-icon"
              width={28}
              height={29}
              onClick={() => setOpenStakeModal(false)}
            />
          </div>
        </div>
        <StakeCard />
      </Modal>
    </>
  )
}

export default Footer
