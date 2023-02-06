import { useContext, useState } from 'react'
import { Card, Collapsible } from '../../../components'
import { AppContext } from '../../../context'
import './faqcard.scss'

const data = [
  {
    id: 1,
    isOpen: true,
    question: 'What currency will my returns from the vault be paid in?',
    answer:
      'The returns will be paid in the form of the token that you deposited in the vault. Eg: If you deposited WETH, the returns added to your portfolio will be in WETH.',
  },
  {
    id: 2,
    isOpen: false,
    question:
      'What occurs if I fail to withdraw my funds at the end of a cycle?',
    answer:
      "If you don't withdraw at the end of a cycle, your original deposit and the returns earned will automatically move to the next cycle for continued compounding returns.",
  },
  {
    id: 3,
    isOpen: false,
    question: 'How do I withdraw funds from the vault?',
    answer:
      'There are two options for withdrawing funds from the vault: Instant and Standard. Instant withdrawals are for funds that have not yet been invested in a strategy and can be done at any time before deployment. Standard withdrawals are for funds that have been invested and earning returns and can be initiated at any time, but will only be available at the end of the current cycle.',
  },
  {
    id: 4,
    isOpen: false,
    question: 'What are the costs associated with utilizing the vault?',
    answer:
      'We impose a 2% management fee on a pro-rated basis and a 10% performance fee charged on the generated profits per cycle.',
  },
  {
    id: 5,
    isOpen: false,
    question: 'Are the costs included in the APY?',
    answer:
      'Yes, the APY displayed for each vault account for the fees incurred.',
  },
  {
    id: 6,
    isOpen: false,
    question: 'Do I have to make another deposit once my vault expires?',
    answer:
      'No, once your vault expires, the funds and the returns earned will automatically rollover for continued compounding returns.',
  },
  {
    id: 7,
    isOpen: false,
    question: 'What are the risks?',
    answer:
      'Risks include the potential for market makers to default, counterparties to be unable to fulfill their obligations, the experimental nature of smart contracts, technical issues with the Ethereum blockchain, and the lack of deposit insurance protection for assets held in the vault. Learn More',
  },
]

const FaqCard = () => {
  const [state] = useContext(AppContext)

  const [openQuestions, setOpenQuestions] = useState(false)
  const [faqData, setFaqData] = useState(data)

  const openFaq = (id: number) => {
    const tempData = [...faqData]
    const tempObj = tempData.filter((data) => data.id === id)[0]
    tempObj.isOpen = !tempObj.isOpen
    tempData.splice(
      tempData.findIndex((data) => data.id === id),
      1,
      tempObj,
    )
    setFaqData(tempData)
  }

  return (
    <Card className="faq-card">
      <div
        className="faq-card-header"
        onClick={() => setOpenQuestions(!openQuestions)}
      >
        <label className="faq-header-label">Frequently asked questions</label>
      </div>
      <div className="card-content">
        {faqData.map((data) => (
          <div
            className="faq-section"
            key={data.id}
            {...(data.isOpen
              ? { style: { background: 'var(--faq-open-background' } }
              : undefined)}
          >
            <img
              src={`/assets/icons/${data.isOpen ? 'minus' : 'plus'}-circle.png`}
              alt={`${data.isOpen}-circle`}
              width={24}
              height={24}
              onClick={() => openFaq(data.id)}
            />
            <div className="faq-content">
              <p
                className="faq-question"
                style={{ cursor: 'pointer' }}
                onClick={() => openFaq(data.id)}
              >
                {data.question}
              </p>
              <Collapsible
                isOpen={data.isOpen}
                content={<p className="faq-answer">{data.answer.replaceAll('WETH', state.selectedAsset.toUpperCase())}</p>}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default FaqCard
