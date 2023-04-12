import { ConnectKitButton } from 'connectkit'
import { useContext, useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAccount } from 'wagmi'
import { Button, Sprite } from '../../components'
import { AppContext } from '../../context'
import { useOutsideAlerter } from '../../hooks'
import { rem, VAULT_NAV_LINKS } from '../../utils'
import ConnectButtonDropdown from './connectbuttondropdown'
import './header.scss'
import NetworkDropdown from './networkdropdown'

const Header = () => {
  const [state] = useContext(AppContext)

  const { isConnected } = useAccount()

  const location = useLocation()
  const navigate = useNavigate()
  const vaultLinkDropdown = useRef(null)
  useOutsideAlerter(vaultLinkDropdown, () => setOpenVaultLinks(false))

  const [openVaultLinks, setOpenVaultLinks] = useState(false)
  const [openMobileVaultLinks, setOpenMobileVaultLinks] = useState(false)
  const [openMobileHeader, setOpenMobileHeader] = useState(false)

  const VaultLinks = ({ type }: { type: 'desktop' | 'mobile' }) => (
    <>
      {VAULT_NAV_LINKS.map((link, index) => (
        <span
          key={`${link.link} - ${index}`}
          className={`vault-dropdown-option ${
            location.pathname.includes(link.link) ? 'vault-selected' : ''
          }`}
          {...(link.link !== 'twinpeaks'
            ? { style: { cursor: 'not-allowed' } }
            : {
                onClick: () => {
                  navigate(`/vaults/${link.link}`)
                  type === 'mobile'
                    ? setOpenMobileVaultLinks(false)
                    : setOpenVaultLinks(false)
                  setOpenMobileHeader(false)
                },
              })}
        >
          <label className="vault-label">
            {link.label}
            {link.link !== 'twinpeaks' ? (
              <>
                &nbsp;
                <span
                  style={{
                    padding: `${rem(2)} ${rem(4)}`,
                    borderRadius: rem(30),
                    textTransform: 'lowercase',
                    fontSize: rem(12),
                    lineHeight: rem(12),
                    background: 'var(--soon-tag-background)',
                    color: 'var(--soon-tag-text-color)',
                  }}
                >
                  soon
                </span>
              </>
            ) : null}
          </label>
        </span>
      ))}
    </>
  )

  return (
    <div className="header" {...state.approveTokenModal ? { style: { zIndex: 0 } } : undefined}>
      <div className="logo-area">
        <Sprite id="cruize-header-beta-icon" width={156} height={46} />
        <div className="links">
          <Link
            to={`/vaults`}
            className={`link ${
              location.pathname === '/vaults' ? ' active' : ''
            }`}
          >
            {'Vaults'}
          </Link>
          {/* <div
            className="vault-link"
            onMouseEnter={() => setOpenVaultLinks(true)}
            onMouseLeave={() => setOpenVaultLinks(false)}
          >
            <span
              className={`link ${
                location.pathname.includes('vaults/twinpeaks') ? ' active' : ''
              }`}
            >
              Vaults
            </span>
            <div className="link-dropdown-icon" ref={vaultLinkDropdown}>
              <Sprite
                id="dropdown-expand-icon"
                width={20}
                height={20}
                style={{
                  cursor: 'pointer',
                  transform: `rotate(${openVaultLinks ? '180deg' : '0deg'})`,
                }}
              />
              {openVaultLinks ? (
                <div className="vault-dropdown">
                  <VaultLinks type="desktop" />
                </div>
              ) : null}
            </div>
          </div> */}
          <Link
            to={`/portfolio`}
            className={`link ${
              location.pathname.includes('portfolio') ? ' active' : ''
            }`}
          >
            {'Portfolio'}
          </Link>
        </div>
      </div>
      <div className="connection-area">
        {isConnected ? <NetworkDropdown /> : null}
        <ConnectButtonDropdown />
      </div>
      <Sprite
        id={`${openMobileHeader ? 'close-nav-icon' : 'hamburg-icon'}`}
        width={20}
        height={14}
        className={`mobile-hamburg-icon`}
        onClick={() => setOpenMobileHeader(!openMobileHeader)}
      />
      <div className={`mobile-header ${openMobileHeader ? 'open' : ''}`}>
        <div className="mobile-header-content">
          <div className="mobile-header-content">
            <div className="mobile-header-section-container">
              <Link
                to={`/vaults`}
                className={`link ${
                  location.pathname === '/vaults' ? ' active' : ''
                }`}
                onClick={() => setOpenMobileHeader(false)}
              >
                {'Vaults'}
              </Link>
            </div>
            <div className="mobile-header-section-container">
              {/* <div
                className="vault-link"
                onClick={() => setOpenMobileVaultLinks(!openMobileVaultLinks)}
              >
                <span
                  className={`link ${
                    location.pathname.includes('vaults/twinpeaks')
                      ? ' active'
                      : ''
                  }`}
                >
                  Vaults
                </span>
                <Sprite
                  id="dropdown-expand-icon"
                  width={20}
                  height={20}
                  style={{
                    cursor: 'pointer',
                    transform: `rotate(${
                      openMobileVaultLinks ? '180deg' : '0deg'
                    })`,
                  }}
                />
              </div> */}
              {openMobileVaultLinks ? (
                <div className={`vault-dropdown`}>
                  <VaultLinks type="mobile" />
                </div>
              ) : null}
            </div>
            <div className="mobile-header-section-container">
              <Link
                to={`/portfolio`}
                className={`link ${
                  location.pathname.includes('portfolio') ? ' active' : ''
                }`}
                onClick={() => setOpenMobileHeader(false)}
              >
                {'Portfolio'}
              </Link>
            </div>
            {isConnected ? null : (
              <div className="mobile-header-section-container">
                <ConnectKitButton.Custom>
                  {({ show }) => {
                    return (
                      <Button
                        className="mobile-connect-wallet-button"
                        onClick={show}
                      >
                        Connect Wallet
                      </Button>
                    )
                  }}
                </ConnectKitButton.Custom>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
