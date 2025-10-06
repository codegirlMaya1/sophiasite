export default function Privacy(){
  return (
    <main className="section">
      <div className="container">
        <div className="panel">
          <h2 className="mt-0">Privacy</h2>
          <p className="small">
            This site collects only the information you submit via the contact form (name, email, message).
            It is used to respond to your inquiry and is not sold or shared with third parties for advertising.
          </p>
          <ul className="small">
            <li><b>Data you provide:</b> name, email, and message content.</li>
            <li><b>Retention:</b> kept only as long as needed to handle your request.</li>
            <li><b>Security:</b> transport encryption (HTTPS); least-access practices.</li>
            <li><b>Your choices:</b> email to request access or deletion.</li>
          </ul>
          <p className="small">Contact: <a href="mailto:support@tiertechtools.com">support@tiertechtools.com</a></p>
        </div>
      </div>
    </main>
  )
}
