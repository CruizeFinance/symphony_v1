import { Card } from '../../../components'
import './faqcard.scss'

const FaqCard = () => {
  return (
    <Card className="faq-card">
      <div className="card-header">
        <label className="label">Frequently asked questions</label>
      </div>
      <div className="card-content">
        <div className="faq-section">
          <p className="faq-question">How does it work?</p>
          <p className="faq-answer">
            Lorem ipsum dolor sit amet consectetur. Cras lectus nunc nibh donec
            quis curabitur non. Ut leo in amet vulputate a semper amet ipsum.
          </p>
        </div>
        <div className="faq-section">
          <p className="faq-question">How much do I receive ?</p>
          <p className="faq-answer">
            Lorem ipsum dolor sit amet consectetur. Cras lectus nunc nibh donec
            quis curabitur non.
          </p>
        </div>
        <div className="faq-section">
          <p className="faq-question">What is your cancellation policy?</p>
          <p className="faq-answer">
            We understand that things change. You can cancel your plan at any
            time and we’ll refund you the difference already paid.
          </p>
        </div>
        <div className="faq-section">
          <p className="faq-question">Can other info be added to an invoice?</p>
          <p className="faq-answer">
            At the moment, the only way to add additional information to
            invoices is to add the information to the workspace's name.
          </p>
        </div>
      </div>
    </Card>
  )
}

export default FaqCard
