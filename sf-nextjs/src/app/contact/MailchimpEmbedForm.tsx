import React from 'react';

const MailchimpEmbedForm: React.FC = () => {
  return (
    <div id="mc_embed_shell">
      <div
        id="mc_embed_signup"
        style={{
          background: '#fff',
          fontFamily: 'Helvetica, Arial, sans-serif',
          width: '600px',
          padding: '20px',
          borderRadius: '8px',
        }}
      >
        <form
          action="https://gmail.us22.list-manage.com/subscribe/post?u=c51b8d1989d515cd66be11e95&amp;id=02d6493d6c&amp;f_id=00bdd8e1f0"
          method="post"
          id="mc-embedded-subscribe-form"
          name="mc-embedded-subscribe-form"
          className="validate"
          target="_self"
          noValidate
        >
          <div id="mc_embed_signup_scroll">
            <h2>Subscribe</h2>
            <div className="indicates-required">
              <span className="asterisk">*</span> indicates required
            </div>
            <div className="mc-field-group">
              <label htmlFor="mce-EMAIL">
                Email Address <span className="asterisk">*</span>
              </label>
              <input
                type="email"
                name="EMAIL"
                className="required email"
                id="mce-EMAIL"
                required
                style={{ padding: '8px', margin: '5px 0', borderRadius: '4px', width: '100%' }}
              />
            </div>
            <div id="mce-responses" className="clear foot">
              <div className="response" id="mce-error-response" style={{ display: 'none' }}></div>
              <div className="response" id="mce-success-response" style={{ display: 'none' }}></div>
            </div>
            <div aria-hidden="true" style={{ position: 'absolute', left: '-5000px' }}>
              <input
                type="text"
                name="b_c51b8d1989d515cd66be11e95_02d6493d6c"
                tabIndex={-1}
                defaultValue=""
              />
            </div>
            <div className="optionalParent">
              <div className="clear foot">
                <input
                  type="submit"
                  name="subscribe"
                  id="mc-embedded-subscribe"
                  className="button"
                  value="Subscribe"
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#007bff',
                    color: '#fff',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                />
                <p style={{ margin: '10px auto', textAlign: 'center' }}>
                  <a href="http://eepurl.com/iWyW6E" title="Mailchimp - email marketing made easy and fun">
                    <span style={{ display: 'inline-block', backgroundColor: 'transparent', borderRadius: '4px' }}>
                      <img
                        className="refferal_badge"
                        src="https://digitalasset.intuit.com/render/content/dam/intuit/mc-fe/en_us/images/intuit-mc-rewards-text-dark.svg"
                        alt="Intuit Mailchimp"
                        style={{
                          width: '220px',
                          height: '40px',
                          display: 'flex',
                          padding: '2px 0',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      />
                    </span>
                  </a>
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MailchimpEmbedForm;
